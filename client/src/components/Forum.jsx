import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Forum = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
        fetchPosts();
    }, [navigate]);

    const fetchPosts = async () => {
        try {
            const { data } = await axios.get('/api/forum/posts');
            setPosts(data);
        } catch (err) {
            console.error('Fetch posts error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        setSubmitting(true);
        setError('');
        try {
            await axios.post('/api/forum/posts', {
                userId: user.id,
                userName: user.name,
                content: newPost
            });
            setNewPost('');
            fetchPosts();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to post message.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="forum-container">
            <header className="forum-header">
                <h1>Community Forum</h1>
                <p>Discuss projects and mentorship with the community</p>
            </header>

            <form onSubmit={handlePostSubmit} className="post-form">
                <textarea
                    placeholder="Share something with the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows="3"
                    disabled={submitting}
                    required
                ></textarea>
                
                {error && (
                    <div className="moderation-alert">
                        <span className="alert-icon">⚠️</span>
                        <div className="alert-content">
                            <strong>Moderation Alert:</strong>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <div className="form-footer">
                    <span className="safety-note">🛡️ Protected by Multilingual AI Moderation</span>
                    <button type="submit" disabled={submitting || !newPost.trim()}>
                        {submitting ? 'Checking Content...' : 'Post Message 🚀'}
                    </button>
                </div>
            </form>

            <div className="posts-list">
                {loading ? (
                    <div className="loading">Loading discussions...</div>
                ) : posts.length === 0 ? (
                    <div className="empty">No discussions yet. Be the first to post!</div>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="post-card">
                            <div className="post-meta">
                                <span className="post-author">{post.userName}</span>
                                <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="post-content">{post.content}</div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .forum-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
                .forum-header { margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; }
                .forum-header h1 { color: #1e293b; margin: 0; }
                .forum-header p { color: #64748b; margin: 0.5rem 0 0; }
                
                .post-form { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 2.5rem; }
                .post-form textarea { width: 100%; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; resize: none; font-family: inherit; margin-bottom: 1rem; }
                .post-form textarea:focus { outline: none; border-color: #6366f1; ring: 2px #6366f1; }
                
                .form-footer { display: flex; justify-content: space-between; align-items: center; }
                .safety-note { font-size: 0.75rem; color: #94a3b8; }
                .post-form button { background: #6366f1; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .post-form button:disabled { background: #94a3b8; cursor: not-allowed; }
                
                .moderation-alert { display: flex; gap: 1rem; background: #fff1f2; border: 1px solid #fecdd3; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; align-items: flex-start; }
                .alert-icon { font-size: 1.5rem; }
                .alert-content strong { color: #9f1239; display: block; margin-bottom: 0.25rem; }
                .alert-content p { color: #be123c; margin: 0; font-size: 0.875rem; }
                
                .post-card { background: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem; border: 1px solid #f1f5f9; }
                .post-meta { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.875rem; }
                .post-author { font-weight: 700; color: #334155; }
                .post-date { color: #94a3b8; }
                .post-content { color: #475569; line-height: 1.6; }
            `}</style>
        </div>
    );
};

export default Forum;
