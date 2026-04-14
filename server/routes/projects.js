const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const User = require('../models/User');
const { sendAcceptanceEmail } = require('../services/notificationService');

const router = express.Router();

// ── Multer Config ───────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ── Routes ─────────────────────────────────────────────

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate('mentorId', 'name institution').sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create project (Alumni only)
router.post('/', async (req, res) => {
    const { title, description, techStack, deadline, mentorId } = req.body;
    try {
        const project = new Project({
            title,
            description,
            techStack,
            deadline,
            mentorId
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Apply for project
router.post('/:id/apply', async (req, res) => {
    const { studentId } = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        const alreadyApplied = project.applicants.find(a => a.studentId.toString() === studentId);
        if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

        project.applicants.push({ studentId });
        await project.save();
        res.json({ message: 'Application submitted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Accept student
router.post('/:id/accept/:studentId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        const student = await User.findById(req.params.studentId);
        
        if (!project || !student) return res.status(404).json({ message: 'Not found' });

        const applicant = project.applicants.find(a => a.studentId.toString() === req.params.studentId);
        if (!applicant) return res.status(404).json({ message: 'Applicant not found' });

        applicant.status = 'accepted';
        project.status = 'in-progress';
        await project.save();

        // Trigger Notification
        await sendAcceptanceEmail(student.email, student.name, project.title);

        res.json({ message: 'Student accepted and notified' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit task (Proof of Work)
router.post('/:id/submit/:studentId', upload.single('file'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const applicant = project.applicants.find(a => a.studentId.toString() === req.params.studentId);
        if (!applicant) return res.status(404).json({ message: 'Not an applicant' });

        applicant.submissionPath = req.file.path;
        applicant.submittedAt = new Date();
        await project.save();

        res.json({ message: 'Work submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Complete and award badge
router.post('/:id/complete/:studentId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        const student = await User.findById(req.params.studentId);

        if (!project || !student) return res.status(404).json({ message: 'Not found' });

        project.status = 'completed';
        await project.save();

        // Award verified skill
        const skillName = project.techStack[0] || 'Technical Project';
        student.verifiedSkills.push({
            skill: skillName,
            projectId: project._id
        });
        await student.save();

        res.json({ message: 'Project completed and skill badge awarded!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
