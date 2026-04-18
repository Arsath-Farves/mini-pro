import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';

const Sandbox = ({ user }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/api/projects');
            setProjects(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="sandbox-container">
            <div className="sandbox-header">
                <h2>Collaborative Sandbox</h2>
                <p>
                    {user.role === 'Student' 
                        ? "Work on real projects mentored by verified Alumni" 
                        : "Offer real projects and mentor students"}
                </p>
            </div>

            {user.role === 'Alumni' && (
                <ProjectForm user={user} onProjectCreated={fetchProjects} />
            )}

            <div className="projects-section">
                <h3>Available Projects</h3>
                {loading ? (
                    <p>Loading projects...</p>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        <p>No projects available right now. Check back later!</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <ProjectCard 
                                key={project._id} 
                                project={project} 
                                user={user} 
                                onUpdate={fetchProjects} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .sandbox-container { padding: 1rem 0; }
                .sandbox-header { margin-bottom: 2rem; }
                .sandbox-header h2 { color: #1e293b; font-size: 1.5rem; margin-bottom: 0.5rem; }
                .sandbox-header p { color: #64748b; font-size: 0.95rem; }
                .projects-section h3 { font-size: 1.25rem; color: #1e293b; margin-bottom: 1.5rem; }
                .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
                .empty-state { text-align: center; padding: 3rem; background: white; border-radius: 12px; border: 2px dashed #e2e8f0; color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default Sandbox;
