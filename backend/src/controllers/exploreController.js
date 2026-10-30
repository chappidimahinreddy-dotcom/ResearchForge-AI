const { generateContent } = require('../services/geminiService');

const generate = async (req, res) => {
    try {
        const { topic, objective = '' } = req.body;

        // Validate input
        if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a research topic with at least 3 characters.',
            });
        }

        if (topic.length > 300 || objective.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Topic or objective exceeds the allowed length.',
            });
        }

        const prompt = `
You are an academic research assistant.

Explore the following research topic:

Topic: ${topic.trim()}
Research objective: ${objective.trim() || 'Not specified'}

Generate a structured research exploration.

Return ONLY valid JSON with these exact keys:

{
  "relatedTopics": [
    "5 related research topics"
  ],
  "researchQuestions": [
    "10 meaningful research questions"
  ],
  "keywords": [
    "10 relevant research keywords"
  ],
  "potentialResearchGaps": [
    "5 potential areas that may need further investigation"
  ],
  "researchDirections": [
    "5 possible future research directions"
  ],
  "summary": "A short overview of the research topic"
}

IMPORTANT:
- Follow the requested number of items.
- Make suggestions specific to the topic.
- Avoid repeating the same ideas.
- Do not invent research papers, authors, DOIs, or statistics.
- Research gaps are hypotheses, not verified findings.
- Do not claim that a gap is new or unexplored without literature verification.
- Return valid JSON only, without Markdown code fences.
`;

        const result = await generateContent(prompt);

        // Parse Gemini's JSON response
        const cleanedResult = result
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();

        const exploration = JSON.parse(cleanedResult);

        return res.status(200).json({
            success: true,
            message: 'Research exploration generated successfully.',
            data: {
                topic: topic.trim(),
                ...exploration,
                disclaimer:
                    'AI-generated research suggestions. Verify potential research gaps against relevant academic literature.',
            },
        });
    } catch (error) {
        console.error('Explore Mode Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Unable to generate research exploration. Please try again.',
        });
    }
};

module.exports = { generate };