import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = ({ user, onProjectCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [techStack, setTechStack] = useState('');
    const [deadline, setDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/api/projects', {
                title,
                description,
                techStack: techStack.split(',').map(s => s.trim()),
                deadline,
                mentorId: user.id
            });
            setTitle('');
            setDescription('');
            setTechStack('');
            setDeadline('');
            onProjectCreated();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <h3>Post New Micro-Project</h3>
            {error && <p className="error-msg">{error}</p>}
            <div className="form-group">
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Dashboard Refactor" required />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What needs to be done?" required />
            </div>
            <div className="form-group">
                <label>Tech Stack (comma separated)</label>
                <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js, MongoDB" required />
            </div>
            <div className="form-group">
                <label>Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Project 🚀'}
            </button>

            <style>{`
                .project-form {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    margin-bottom: 2rem;
                }
                .project-form h3 { margin-bottom: 1rem; color: #1e293b; }
                .form-group { margin-bottom: 1rem; }
                .form-group label { display: block; font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem; }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-family: inherit;
                }
                .project-form button {
                    width: 100%;
                    padding: 0.75rem;
                    background: #6366f1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .error-msg { color: #dc2626; font-size: 0.875rem; margin-bottom: 1rem; }
            `}</style>
        </form>
    );
};

export default ProjectForm;
