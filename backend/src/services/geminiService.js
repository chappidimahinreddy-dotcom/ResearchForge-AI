const env = require('../config/env');

let aiClient;

async function getAIClient() {
    if (!aiClient) {
        const { GoogleGenAI } = await import('@google/genai');

        aiClient = new GoogleGenAI({
            apiKey: env.GEMINI_API_KEY,
        });
    }

    return aiClient;
}

async function generateContent(prompt) {
    const ai = await getAIClient();

    const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
    });

    return response.text;
}

module.exports = { generateContent };