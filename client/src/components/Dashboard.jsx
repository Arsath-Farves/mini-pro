import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sandbox from './Sandbox';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role === 'Student') {
            fetchRecommendations(parsedUser.id);
        } else {
            setLoading(false);
        }
    }, [navigate]);

    const fetchRecommendations = async (userId) => {
        try {
            const { data } = await axios.get(`/api/recommendations/${userId}`);
            setRecommendations(data);
        } catch (err) {
            console.error('Fetch recommendations error:', err);
            setError('Failed to load recommendations.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="brand-nav">
                    <span className="brand-flag">🇮🇳</span>
                    <span className="brand-name">Bharat-Setu</span>
                </div>
                <div className="user-nav">
                    <button onClick={() => navigate('/forum')} className="forum-btn">Community Forum</button>
                    <span className="user-welcome">Hello, {user.name} ({user.role})</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Student Dashboard</h1>
                    <p className="subtitle">Connect with alumni and boost your career</p>
                    {user.verifiedSkills && user.verifiedSkills.length > 0 && (
                        <div className="verified-skills-header">
                            <span className="skills-label">Reputation:</span>
                            {user.verifiedSkills.map((s, i) => (
                                <span key={i} className="skill-badge-verified">🌟 {s.skill}</span>
                            ))}
                        </div>
                    )}
                </header>

                {user.role === 'Student' && (
                    <section className="recommendations-section">
                        <div className="section-header">
                            <h2>Suggested Mentors</h2>
                            <span className="ai-badge">AI Powered</span>
                        </div>
                        
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Finding the best matches for you...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : recommendations.length === 0 ? (
                            <div className="empty-state">
                                <p>No recommendations found yet. Try adding more interests!</p>
                            </div>
                        ) : (
                            <div className="mentor-grid">
                                {recommendations.map((mentor) => (
                                    <div key={mentor.id} className="mentor-card">
                                        <div className="mentor-header">
                                            <div className="mentor-avatar">
                                                {mentor.name.charAt(0)}
                                            </div>
                                            <div className="mentor-info">
                                                <h3 className="mentor-name">
                                                    {mentor.name}
                                                    {mentor.isVerified && <span className="verified-badge">✔️ Verified</span>}
                                                </h3>
                                                <p className="mentor-inst">{mentor.institution}</p>
                                            </div>
                                            <div className="match-score">
                                                {Math.round(mentor.score * 100)}% Match
                                            </div>
                                        </div>
                                        <div className="mentor-body">
                                            <div className="skill-tags">
                                                {mentor.skills.map((skill, index) => (
                                                    <span key={index} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                            <p className="mentor-location">📍 {mentor.city}</p>
                                        </div>
                                        <button className="connect-btn">Connect Now</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {user.role === 'Alumni' && (
                    <section className="alumni-welcome">
                        <h2>Welcome, Mentor!</h2>
                        <p>Students will soon be reaching out to you based on your skills.</p>
                    </section>
                )}

                <hr className="section-divider" />

                <section className="sandbox-section">
                    <Sandbox user={user} />
                </section>
            </main>

            <style>{`
                .dashboard-container {
                    min-height: 100vh;
                    background-color: #f8fafc;
                    background-image: none;
                    font-family: 'Inter', system-ui, sans-serif;
                    color: #1e293b;
                }
                .dashboard-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 2rem;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .brand-nav {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .brand-flag { font-size: 1.5rem; }
                .brand-name {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 1.25rem;
                    background: none;
                    -webkit-text-fill-color: #1e293b;
                    -webkit-background-clip: unset;
                    background-clip: unset;
                }
                .user-nav {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .user-welcome {
                    color: #334155;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .forum-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    border: none;
                    background: #6366f1;
                    color: white;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                .logout-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #334155;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .logout-btn:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                }
                .dashboard-main {
                    max-width: 1000px;
                    margin: 2rem auto;
                    padding: 0 1rem;
                }
                .dashboard-header { margin-bottom: 2.5rem; }
                .dashboard-header h1 {
                    font-size: 2rem;
                    color: #0f172a;
                    margin-bottom: 0.5rem;
                }
                .subtitle { color: #64748b; }
                .section-header h2 {
                    font-size: 1.5rem;
                    color: #0f172a;
                }
                
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .ai-badge {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    padding: 0.25rem 0.6rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .mentor-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }
                .mentor-card {
                    background: white;
                    border-radius: 12px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                    transition: transform 0.2s;
                    display: flex;
                    flex-direction: column;
                }
                .mentor-card:hover { transform: translateY(-4px); }
                
                .mentor-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                .mentor-avatar {
                    width: 48px;
                    height: 48px;
                    background: #f1f5f9;
                    color: #6366f1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 1.25rem;
                }
                .mentor-info h3 { margin: 0; font-size: 1.125rem; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; -webkit-text-fill-color: #1e293b; }
                .verified-badge {
                    background: #dcfce7;
                    color: #166534;
                    font-size: 0.65rem;
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .mentor-inst { margin: 0; font-size: 0.875rem; color: #64748b; }
                
                .match-score {
                    margin-left: auto;
                    font-weight: 700;
                    color: #059669;
                    font-size: 0.875rem;
                    background: #ecfdf5;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                }
                
                .mentor-body { margin-bottom: 1.5rem; flex-grow: 1; }
                .skill-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }
                .skill-tag {
                    background: #f1f5f9;
                    color: #475569;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                }
                .mentor-location { font-size: 0.875rem; color: #64748b; margin: 0; }
                
                .connect-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                .connect-btn:hover { opacity: 0.9; }
                
                .loading-state {
                    text-align: center;
                    padding: 3rem;
                    color: #64748b;
                }
                .error-state {
                    text-align: center;
                    padding: 2rem;
                    color: #dc2626;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 12px;
                    font-weight: 500;
                }
                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: #64748b;
                    font-size: 0.95rem;
                }
                .alumni-welcome {
                    text-align: center;
                    padding: 3rem;
                }
                .alumni-welcome h2 {
                    font-size: 1.5rem;
                    color: #0f172a;
                    margin-bottom: 0.75rem;
                }
                .alumni-welcome p {
                    color: #64748b;
                    font-size: 1rem;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .verified-skills-header { display: flex; align-items: center; gap: 0.75rem; margin-top: 1rem; flex-wrap: wrap; }
                .skills-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
                .skill-badge-verified { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; padding: 0.3rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 650; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.1); }
                .section-divider { border: none; border-top: 1px solid #e2e8f0; margin: 3rem 0; }
            `}</style>
        </div>
    );
};

export default Dashboard;
