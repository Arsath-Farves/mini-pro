const express = require('express');
const Post = require('../models/Post');
const toxicityGuard = require('../middleware/toxicityGuard');

const router = express.Router();

// GET all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// CREATE a post - Guarded by NLP AI
router.post('/posts', toxicityGuard, async (req, res) => {
    try {
        const { userId, userName, content } = req.body;
        
        const newPost = new Post({
            userId,
            userName,
            content
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: 'Error saving post' });
    }
});

module.exports = router;
