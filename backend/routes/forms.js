// File: formAI/backend/routes/forms.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Form = require('../models/Form');
const Response = require('../models/Response');
const User = require('../models/User');
const Papa = require('papaparse');
const router = express.Router();
const { detectSpam } = require('../services/aiService');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');
    try {
        req.userId = jwt.verify(token, process.env.JWT_SECRET).userId;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};

router.post('/create', authenticate, async (req, res) => {
    try {
        const { title, questions, theme, isPublic } = req.body;
        
        // Check for duplicate forms with same title for this user
        const existingForm = await Form.findOne({ 
            userId: req.userId, 
            title: title.trim() 
        });
        
        if (existingForm) {
            return res.status(400).json({ 
                error: 'A form with this title already exists. Please use a different title.' 
            });
        }
        
        const user = await User.findById(req.userId);
        if (user.formsCreated >= 3) { // Example limit for a free tier
            return res.status(403).send('Free tier limit: 3 forms');
        }
        if (!title || !Array.isArray(questions)) {
            return res.status(400).send('Invalid form data');
        }
        const form = new Form({ userId: req.userId, title, questions, theme, isPublic });
        await form.save();
        user.formsCreated += 1;
        await user.save();
        res.status(201).json(form);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/myforms', authenticate, async (req, res) => {
    try {
        const forms = await Form.find({ userId: req.userId });
        res.json(forms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:formId', async (req, res) => {
    try {
        const { formId } = req.params;
        const form = await Form.findById(formId);
        if (!form) return res.status(404).send('Form not found');
        
        // Check if form is public
        if (form.isPublic) {
            // Public forms can be accessed by anyone
            return res.json(form);
        }
        
        // Private forms require authentication
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ 
                error: 'Form is private and requires authentication',
                code: 'PRIVATE_FORM'
            });
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (form.userId.toString() !== decoded.userId) {
                return res.status(403).json({ 
                    error: 'Unauthorized to view this private form',
                    code: 'UNAUTHORIZED'
                });
            }
            res.json(form);
        } catch (err) {
            return res.status(401).json({ 
                error: 'Invalid or expired token',
                code: 'INVALID_TOKEN'
            });
        }
    } catch (err) {
        console.error('Form fetch error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:formId', authenticate, async (req, res) => {
    try {
        const { formId } = req.params;
        const form = await Form.findById(formId);
        if (!form || form.userId.toString() !== req.userId) {
            return res.status(403).send('Unauthorized');
        }
        
        const updatedForm = await Form.findByIdAndUpdate(formId, req.body, { new: true });
        res.json(updatedForm);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/submit/:formId', async (req, res) => {
    try {
        const { formId } = req.params;
        const { data, isConversational } = req.body;
        
        const form = await Form.findById(formId);
        if (!form) return res.status(404).json({ error: 'Form not found' });

        // Check if form is public for submissions
        if (!form.isPublic) {
            return res.status(403).json({ 
                error: 'Cannot submit to private forms',
                code: 'PRIVATE_FORM'
            });
        }

        // AI Spam Detection (only if GEMINI_API_KEY is available)
        let spamScore = 0;
        if (process.env.GEMINI_API_KEY) {
            try {
                spamScore = await detectSpam(data);
            } catch (error) {
                console.error('Spam detection failed:', error);
                // Continue without spam detection
            }
        }
        
        if (spamScore > 0.8) {
            return res.status(403).json({ 
                error: 'Submission blocked due to high spam score',
                code: 'SPAM_DETECTED'
            });
        }

        const response = new Response({ 
            formId, 
            userId: form.userId, 
            data, 
            ip: req.ip, 
            spamScore 
        });
        await response.save();

        // Update user statistics
        try {
            const user = await User.findById(form.userId);
            if (user) {
                user.totalResponses += 1;
                
                let uploadSize = 0;
                for (const key in data) {
                    if (data[key] && typeof data[key] === 'object' && data[key].size) {
                        uploadSize += data[key].size;
                    }
                }
                user.totalUploads += uploadSize;
                await user.save();
            }
        } catch (userError) {
            console.error('Failed to update user stats:', userError);
            // Continue even if user stats update fails
        }
        
        if (isConversational) {
            res.json({ message: 'Thank you for your submission!' });
        } else {
            res.status(201).json({ message: 'Response submitted successfully' });
        }
    } catch (err) {
        console.error('Form submission error:', err);
        res.status(500).json({ error: 'Failed to submit response' });
    }
});

router.get('/responses/:formId', authenticate, async (req, res) => {
    try {
        const { formId } = req.params;
        const form = await Form.findById(formId);
        if (!form || form.userId.toString() !== req.userId) return res.status(403).send('Unauthorized');
        const responses = await Response.find({ formId });
        res.json(responses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/export/:formId', authenticate, async (req, res) => {
    try {
        const { formId } = req.params;
        const form = await Form.findById(formId);
        if (!form || form.userId.toString() !== req.userId) return res.status(403).send('Unauthorized');
        const responses = await Response.find({ formId }).lean();
        const csvData = responses.map(r => ({ ...r.data, submittedAt: r.createdAt }));
        const csv = Papa.unparse(csvData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="responses-${formId}.csv"`);
        res.send(csv);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
