const { GoogleGenerativeAI } = require('@google/generative-ai');
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

function extractJson(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start !== -1 && end > start) {
        try {
            return JSON.parse(text.substring(start, end));
        } catch (e) {
            return null;
        }
    }
    return null;
}

async function detectSpam(responseData) {
    // If AI service is not available, return a safe default
    if (!model) {
        console.warn('AI service not available for spam detection');
        return 0; // Default to not spam
    }

    try {
        const prompt = `
        Analyze the following form submission data for signs of spam, gibberish, or automated bot-like input.
        Data: ${JSON.stringify(responseData)}
        Consider if the text is nonsensical, overly promotional, or has unnatural language.
        Respond with ONLY a JSON object in the format: { "spamScore": number }
        The "spamScore" should be a number between 0.0 and 1.0, where 0.0 is definitely not spam and 1.0 is definitely spam.`;
        
        const result = await model.generateContent(prompt);
        const content = result.response.text();
        const analysis = extractJson(content);

        if (analysis && typeof analysis.spamScore === 'number') {
            return analysis.spamScore;
        }
        return 0; // Default to not spam if AI fails
    } catch (error) {
        console.error('Error in AI spam detection:', error);
        return 0; // Return a safe default on error
    }
}

module.exports = { detectSpam };
