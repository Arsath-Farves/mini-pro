const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    techStack: {
        type: [String],
        default: []
    },
    deadline: {
        type: Date,
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicants: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { 
            type: String, 
            enum: ['pending', 'accepted', 'rejected'], 
            default: 'pending' 
        },
        submissionPath: { type: String },
        submittedAt: { type: Date }
    }],
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
