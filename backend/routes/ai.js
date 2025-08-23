// File: formAI/backend/routes/ai.js
const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const Response = require('../models/Response');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let genAI = null;
let model = null;

// Initialize AI service only if API key is available
if (process.env.GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error) {
        console.error('Failed to initialize AI service:', error);
    }
} else {
    console.warn('GEMINI_API_KEY not found. AI features will be disabled.');
}

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized: No token provided');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).send('Invalid token');
    }
};

function extractJson(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start !== -1 && end > start) {
        try {
            return JSON.parse(text.substring(start, end));
        } catch (e) { return null; }
    }
    return null;
}

router.post('/generate-form', authenticate, async (req, res) => {
    if (!model) {
        return res.status(503).json({ error: 'AI service is not available. Please check your GEMINI_API_KEY configuration.' });
    }

    const { prompt } = req.body;
    try {
        const fullPrompt = `
        Respond with nothing but a single, clean JSON object. No explanations or markdown.
        Generate a form structure based on: "${prompt}".
        Infer the most appropriate question type ('text', 'mcq', 'checkbox', 'dropdown', 'file', 'rating').
        
        IMPORTANT: Make the title unique and specific by including:
        - The type of business/service (e.g., "Restaurant", "Event", "Product")
        - The specific purpose (e.g., "Customer Feedback", "Registration", "Evaluation")
        - Avoid generic titles like "Feedback Form" or "Survey"
        - Include relevant details from the prompt to make it unique
        
        Example: Instead of "Feedback Form", use "Restaurant Customer Experience Survey" or "Event Registration & Feedback Form"
        
        The JSON output must strictly follow this format:
        {
          "title": "string",
          "questions": [ { "type": "string", "label": "string", "options": ["string"], "required": boolean } ],
          "theme": { "primaryColor": "string (hex code)", "logoUrl": "string" },
          "isPublic": boolean
        }`;
        const result = await model.generateContent(fullPrompt);
        const formData = extractJson(result.response.text());
        if (!formData?.questions) return res.status(500).send('Could not extract valid JSON from AI response');
        // Return the form data without saving - let user review and save manually
        res.json({ ...formData, userId: req.userId });
    } catch (error) {
        console.error('Form generation error:', error);
        res.status(500).json({ error: 'Failed to generate form' });
    }
});

router.post('/improve-question', authenticate, async (req, res) => {
    if (!model) {
        return res.status(503).json({ error: 'AI service is not available. Please check your GEMINI_API_KEY configuration.' });
    }

    const { label } = req.body;
    if (!label) return res.status(400).send('Question label is required.');
    try {
        const prompt = `
        Respond with nothing but a single, clean JSON object.
        Rephrase the following form question to be clearer and more engaging: "${label}"
        Return JSON format: {"suggestion": "string"}`;
        const result = await model.generateContent(prompt);
        const suggestion = extractJson(result.response.text());
        if (!suggestion) return res.status(500).send('Could not get a suggestion from the AI.');
        res.json(suggestion);
    } catch (error) {
        console.error('Question improvement error:', error);
        res.status(500).json({ error: 'Failed to improve question' });
    }
});

router.post('/insights/:formId', authenticate, async (req, res) => {
    if (!model) {
        return res.status(503).json({ error: 'AI service is not available. Please check your GEMINI_API_KEY configuration.' });
    }

    try {
        const form = await Form.findById(req.params.formId);
        if (!form || form.userId.toString() !== req.userId) return res.status(403).send('Unauthorized');
        const responses = await Response.find({ formId: req.params.formId });
        if (responses.length === 0) return res.json({ summary: 'No responses yet.', sentiment: 'neutral', keywords: [], trends: [], suggestions: [] });

        const structuredResponses = responses.map(r => ({ responseId: r._id, data: r.data }));
        const prompt = `
        Respond with nothing but a single, clean JSON object.
        Analyze these form responses for "${form.title}": ${JSON.stringify(structuredResponses)}.
        Provide a comprehensive analysis in this JSON format:
        {
          "summary": "A concise overview of the findings.",
          "sentiment": "'positive', 'negative', or 'neutral'.",
          "keywords": ["5-7 most frequent themes."],
          "trends": ["3-5 notable patterns."],
          "suggestions": ["3-5 actionable recommendations."],
          "anomaly_report": [ { "responseId": "The response _id", "reason": "Why it is an anomaly." } ]
        }`;

        const result = await model.generateContent(prompt);
        const insights = extractJson(result.response.text());
        if (!insights) return res.status(500).send('Failed to generate insights from AI response.');
        
        if (insights.anomaly_report?.length > 0) {
            for (const report of insights.anomaly_report) {
                await Response.findByIdAndUpdate(report.responseId, { anomalyReason: report.reason });
            }
        }
        res.json(insights);
    } catch (error) {
        console.error('Insights generation error:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

router.post('/conversational-next', async (req, res) => {
    if (!model) {
        return res.status(503).json({ error: 'AI service is not available. Please check your GEMINI_API_KEY configuration.' });
    }

    const { formId, answers } = req.body;
    try {
        const form = await Form.findById(formId);
        if (!form) return res.status(404).send('Form not found');

        const answeredLabels = Object.keys(answers);
        const nextQuestion = form.questions.find(q => !answeredLabels.includes(q.label));

        if (!nextQuestion) return res.json({ isFinished: true, message: "Thank you for completing the form!" });
        
        const prompt = `
        You are a friendly AI survey assistant. Ask the next question conversationally.
        Previous answers: ${JSON.stringify(answers)}
        Next question: "${nextQuestion.label}"
        Respond with only a JSON object: {"conversationalLabel": "Your rephrased question."}`;

        const result = await model.generateContent(prompt);
        const rephrased = extractJson(result.response.text());
        const finalQuestionObject = nextQuestion.toObject();
        if (rephrased?.conversationalLabel) finalQuestionObject.label = rephrased.conversationalLabel;

        res.json({ nextQuestion: finalQuestionObject, isFinished: false });
    } catch (error) {
        console.error('Conversational next error:', error);
        res.status(500).json({ error: 'Failed to get next question' });
    }
});

module.exports = router;
