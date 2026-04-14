import React, { useState } from 'react';
import axios from 'axios';

const ProjectCard = ({ project, user, onUpdate }) => {
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const isMentor = user.role === 'Alumni' && project.mentorId?._id === user.id;
    const isStudent = user.role === 'Student';
    const applicant = project.applicants.find(a => a.studentId === user.id);
    const isAccepted = applicant?.status === 'accepted';

    const handleApply = async () => {
        try {
            await axios.post(`/api/projects/${project._id}/apply`, { studentId: user.id });
            onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply');
        }
    };

    const handleAccept = async (studentId) => {
        try {
            await axios.post(`/api/projects/${project._id}/accept/${studentId}`);
            onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept student');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmitWork = async (e) => {
        e.preventDefault();
        if (!file) return;

        setSubmitting(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`/api/projects/${project._id}/submit/${user.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Upload failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = async (studentId) => {
        try {
            await axios.post(`/api/projects/${project._id}/complete/${studentId}`);
            onUpdate();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to complete project');
        }
    };

    return (
        <div className={`project-card ${project.status}`}>
            <div className="card-header">
                <div>
                    <h4>{project.title}</h4>
                    <span className={`status-badge ${project.status}`}>{project.status}</span>
                </div>
                <p className="mentor">Mentor: {project.mentorId?.name}</p>
            </div>
            
            <p className="description">{project.description}</p>
            
            <div className="tech-stack">
                {project.techStack.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                ))}
            </div>

            <p className="deadline">📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</p>

            <div className="card-actions">
                {isStudent && !applicant && project.status === 'open' && (
                    <button onClick={handleApply} className="apply-btn">Apply Now</button>
                )}

                {isStudent && applicant && applicant.status === 'pending' && (
                    <span className="info-badge">Application Pending...</span>
                )}

                {isStudent && isAccepted && project.status !== 'completed' && (
                    <div className="submission-zone">
                        <h5>Submit Proof of Work</h5>
                        <form onSubmit={handleSubmitWork}>
                            <input type="file" onChange={handleFileChange} required />
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'Uploading...' : 'Submit Work ⬆️'}
                            </button>
                        </form>
                    </div>
                )}

                {isMentor && (
                    <div className="mentor-controls">
                        <h5>Applicants ({project.applicants.length})</h5>
                        {project.applicants.map(app => (
                            <div key={app.studentId} className="applicant-row">
                                <span>{app.studentId}</span>
                                {app.status === 'pending' && (
                                    <button onClick={() => handleAccept(app.studentId)} className="small-btn">Accept</button>
                                )}
                                {app.status === 'accepted' && (
                                    <>
                                        {app.submissionPath ? (
                                            <div className="review-box">
                                                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${app.submissionPath}`} target="_blank" rel="noreferrer">View Work 📄</a>
                                                {project.status !== 'completed' && (
                                                    <button onClick={() => handleComplete(app.studentId)} className="small-btn success">Approve & Complete</button>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="info-badge">Waiting for submission...</span>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .project-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 1rem; }
                .project-card.completed { border-left: 4px solid #10b981; }
                .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .card-header h4 { margin: 0; font-size: 1.125rem; color: #1e293b; }
                .status-badge { font-size: 0.65rem; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700; margin-top: 0.25rem; display: inline-block; }
                .status-badge.open { background: #dcfce7; color: #166534; }
                .status-badge.in-progress { background: #fef9c3; color: #854d0e; }
                .status-badge.completed { background: #e0f2fe; color: #0369a1; }
                .mentor { font-size: 0.75rem; color: #64748b; margin: 0; }
                .description { font-size: 0.9rem; color: #475569; margin: 0; line-height: 1.5; }
                .tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .tech-tag { background: #f1f5f9; color: #475569; padding: 0.1rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; border: 1px solid #e2e8f0; }
                .deadline { font-size: 0.8rem; color: #94a3b8; margin: 0; }
                .card-actions { margin-top: 0.5rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
                .apply-btn { width: 100%; padding: 0.6rem; background: #0f172a; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
                .info-badge { font-size: 0.875rem; color: #64748b; font-style: italic; }
                .submission-zone h5, .mentor-controls h5 { font-size: 0.9rem; color: #1e293b; margin-bottom: 0.75rem; }
                .submission-zone input { font-size: 0.8rem; margin-bottom: 0.5rem; }
                .submission-zone button { padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 6px; font-size: 0.8rem; }
                .applicant-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.8rem; }
                .small-btn { padding: 0.3rem 0.6rem; font-size: 0.75rem; border: 1px solid #6366f1; background: transparent; color: #6366f1; border-radius: 4px; cursor: pointer; }
                .small-btn.success { background: #10b981; color: white; border: none; }
                .review-box { display: flex; align-items: center; gap: 1rem; }
            `}</style>
        </div>
    );
};

export default ProjectCard;
