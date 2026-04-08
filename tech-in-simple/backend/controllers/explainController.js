const { GoogleGenerativeAI } = require("@google/generative-ai");

const explainTopic = async (req, res) => {
    const { topic, style, language } = req.body;
    
    if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured in backend/.env" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const activeStyle = style || 'Teacher';
        const activeLanguage = language || 'English';

        const prompt = `You are a master technical educator. First and foremost, you MUST strictly adopt the Persona / Tone of: "${activeStyle}". 
If the style is 'Funny', be stand-up comedian hilarious. If 'Friend', use casual modern slang and speak exactly like my best buddy. If 'Teacher', be formal, structured and professional. If 'One-line', be brutally concise everywhere.
Additionally, you MUST respond entirely and fluently in the requested language: "${activeLanguage}". Do not use any other language for the answers.

Explain the technology concept "${topic}" in exact JSON format. Do NOT use markdown code blocks or backticks. Return ONLY a valid JSON object with the following keys and string values:
{
  "kid": "Explain it like I am a 5 year old. (Write in ${activeLanguage}, stay in ${activeStyle} persona)",
  "student": "Explain it to an intelligent college student, with reasonable technical terms. (Write in ${activeLanguage}, stay in ${activeStyle} persona)",
  "interview": "Explain it thoroughly for an interview context. (Write in ${activeLanguage}, stay in ${activeStyle} persona)",
  "analogy": "Provide a simple but powerful real-life analogy. (Write in ${activeLanguage}, stay in ${activeStyle} persona)",
  "one_liner": "A single sentence summary. (Write in ${activeLanguage}, stay in ${activeStyle} persona)"
}`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        // Clean up markdown block if the model included it
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

        const jsonResponse = JSON.parse(text);

        res.json(jsonResponse);

    } catch (err) {
        console.error("Error generating explanation:", err);
        res.status(500).json({ error: "Failed to generate explanation. Check the console for details." });
    }
};

const simplifyText = async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert at simplifying complex technical concepts. Rewrite the following text to be even simpler, shorter, use an analogy if possible, and be extremely easy for anyone to understand. Respond ONLY with the simplified text:\n"${text}"`;

        const result = await model.generateContent(prompt);
        const simplified = result.response.text().trim();

        res.json({ simplified });
    } catch (err) {
        console.error("Error simplifying:", err);
        res.status(500).json({ error: "Failed to simplify text." });
    }
};

const elaborateText = async (req, res) => {
    const { text, topic, style, language } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const activeStyle = style || 'Teacher';
        const activeLanguage = language || 'English';

        const prompt = `You are a strict technical educator. The user clicked "ASK WHY?" to deep-dive into the following explanation about "${topic || 'a concept'}":\n\n"${text}"\n\nElaborate extensively on the underlying mechanics, "how it works under the hood", or the detailed logic behind this specific explanation. 
First and foremost, you MUST strictly adopt the Persona/Tone of: "${activeStyle}". Additionally, you MUST respond entirely and fluently in the requested language: "${activeLanguage}". Do not use markdown code backticks. Respond ONLY with the rich elaboration text.`;

        const result = await model.generateContent(prompt);
        const elaboration = result.response.text().trim();

        res.json({ elaboration });
    } catch (err) {
        console.error("Error elaborating:", err);
        res.status(500).json({ error: "Failed to elaborate." });
    }
};

module.exports = {
    explainTopic,
    simplifyText,
    elaborateText
};
