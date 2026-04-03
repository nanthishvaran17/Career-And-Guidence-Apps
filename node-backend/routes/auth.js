const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../database/db');

// GitHub OAuth Config (Prefer .env for production)
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback';

// 1. Initial Redirect to GitHub
router.get('/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    res.redirect(githubAuthUrl);
});

// 2. GitHub Callback Handler
router.get('/github/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'No code provided from GitHub' });
    }

    try {
        // Step A: Exchange code for Access Token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            throw new Error('Failed to obtain access token from GitHub');
        }

        // Step B: Get User Profile
        const userResponse = await axios.get('https://github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });

        // Step C: Get User Email (GitHub might hide it in profile if private)
        const emailsResponse = await axios.get('https://github.com/user/emails', {
            headers: { Authorization: `token ${accessToken}` }
        });

        const primaryEmail = emailsResponse.data.find(e => e.primary && e.verified)?.email || userResponse.data.email;
        const githubUser = {
            id: userResponse.data.id,
            name: userResponse.data.name || userResponse.data.login,
            email: primaryEmail,
            avatar: userResponse.data.avatar_url
        };

        // Step D: Find or Create User in DB
        db.get('SELECT * FROM users WHERE email = ?', [githubUser.email], (err, existingUser) => {
            if (err) return res.status(500).json({ error: 'DB Error finding GitHub user' });

            if (existingUser) {
                // User exists, return user data
                return res.json({ status: 'success', user: existingUser });
            } else {
                // Register new user from GitHub
                const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
                db.run(sql, [githubUser.name, githubUser.email, 'github-oauth-account'], function (err) {
                    if (err) return res.status(500).json({ error: 'Failed to create GitHub user profile' });
                    
                    db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
                        if (err) return res.status(500).json({ error: 'Failed to retrieve new user' });
                        res.json({ status: 'success', user: newUser, isNewUser: true });
                    });
                });
            }
        });

    } catch (error) {
        console.error('GitHub Auth Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
});

module.exports = router;
