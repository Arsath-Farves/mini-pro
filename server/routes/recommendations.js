const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const User = require('../models/User');
const { isUserVerified } = require('../services/blockchainAdapter');

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const student = await User.findById(req.params.userId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const alumni = await User.find({ role: 'Alumni' });
        if (alumni.length === 0) {
            return res.json([]);
        }

        // Prepare data for Python
        const inputData = {
            student_interests: student.interests,
            alumni: alumni.map(a => ({
                id: a._id,
                name: a.name,
                skills: a.skills,
                city: a.city,
                institution: a.institution
            }))
        };

        // Path to python executable in venv
        const pythonPath = path.join(__dirname, '../../ai-services/venv/Scripts/python.exe');
        const scriptPath = path.join(__dirname, '../../ai-services/recommend.py');

        const pythonProcess = spawn(pythonPath, [scriptPath]);

        let resultData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            resultData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}: ${errorData}`);
                return res.status(500).json({ message: 'Recommendation engine error' });
            }

            try {
                const recommendations = JSON.parse(resultData);
                
                // Add verification status from blockchain mock
                const enrichedRecommendations = recommendations.map(rec => ({
                    ...rec,
                    isVerified: isUserVerified(rec.id)
                }));
                
                res.json(enrichedRecommendations);
            } catch (err) {
                console.error('Failed to parse Python output:', err);
                res.status(500).json({ message: 'Invalid response from recommendation engine' });
            }
        });

        // Send data to Python via stdin
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

    } catch (error) {
        console.error('Recommendation route error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
