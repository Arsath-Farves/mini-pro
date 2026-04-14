import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-wrapper">
            <nav className="landing-nav">
                <div className="brand">
                    <span className="brand-flag">🇮🇳</span>
                    <span className="brand-name">Bharat-Setu</span>
                </div>
                <div className="nav-links">
                    <Link to="/login" className="login-link">Login</Link>
                    <button onClick={() => navigate('/register')} className="join-btn">Join Now</button>
                </div>
            </nav>

            <main className="hero-section">
                <div className="hero-content">
                    <h1>Bridge the gap between <span className="highlight-saffron">Talent</span> and <span className="highlight-green">Opportunity</span></h1>
                    <p className="hero-subtitle">
                        An AI-driven ecosystem connecting passionate Indian students with verified alumni mentors for real-world micro-projects.
                    </p>
                    
                    <div className="cta-group">
                        <button onClick={() => navigate('/register')} className="primary-cta">Start Your Journey 🚀</button>
                        <button onClick={() => navigate('/login')} className="secondary-cta">Explore Sandbox</button>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3>AI Matchmaking</h3>
                            <p>Machine Learning algorithms pair you with mentors based on precise technical synergies and interests.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⛓️</div>
                            <h3>Verified Trust</h3>
                            <p>Blockchain-backed verification ensures interacting with genuine, accredited alumni and professionals.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛠️</div>
                            <h3>Collaborative Sandbox</h3>
                            <p>Build real "Proof of Work" through micro-projects and earn reputation badges directly from mentors.</p>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="abstract-shape shape-1"></div>
                    <div className="abstract-shape shape-2"></div>
                </div>
            </main>

            <style>{`
                .landing-wrapper { min-height: 100vh; background-color: #07090f; color: #f1f5f9; font-family: 'Inter', system-ui, sans-serif; overflow: hidden; position: relative; }
                .landing-wrapper::before { content: ''; position: absolute; top: -50%; left: -20%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 50%); z-index: 0; }
                
                .landing-nav { position: relative; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 5%; background: rgba(7,9,15,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
                .brand { display: flex; align-items: center; gap: 0.5rem; }
                .brand-flag { font-size: 1.75rem; }
                .brand-name { font-weight: 800; font-size: 1.5rem; background: linear-gradient(135deg, #f59e0b, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .nav-links { display: flex; align-items: center; gap: 2rem; }
                .login-link { color: #cbd5e1; text-decoration: none; font-weight: 500; transition: color 0.2s; }
                .login-link:hover { color: white; }
                .join-btn { padding: 0.6rem 1.5rem; background: #6366f1; color: white; border: none; border-radius: 9999px; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
                .join-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4); }

                .hero-section { position: relative; z-index: 10; padding: 6rem 5% 4rem; display: flex; flex-direction: column; align-items: center; text-align: center; }
                .hero-content { max-width: 900px; }
                .hero-content h1 { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
                .highlight-saffron { color: #f59e0b; }
                .highlight-green { color: #10b981; }
                .hero-subtitle { font-size: 1.25rem; color: #94a3b8; margin-bottom: 3rem; line-height: 1.6; max-width: 700px; margin-left: auto; margin-right: auto; }

                .cta-group { display: flex; gap: 1rem; justify-content: center; margin-bottom: 5rem; }
                .primary-cta { padding: 1rem 2.5rem; font-size: 1.125rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: transform 0.2s; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5); }
                .primary-cta:hover { transform: translateY(-3px); }
                .secondary-cta { padding: 1rem 2.5rem; font-size: 1.125rem; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
                .secondary-cta:hover { background: rgba(255,255,255,0.1); }

                .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; text-align: left; }
                .feature-card { background: rgba(13,20,38,0.5); padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s; }
                .feature-card:hover { transform: translateY(-5px); border-color: rgba(99,102,241,0.3); background: rgba(13,20,38,0.8); }
                .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
                .feature-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: #f8fafc; }
                .feature-card p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
            `}</style>
        </div>
    );
};

export default Landing;
