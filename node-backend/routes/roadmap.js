const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Setting up AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key'
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || 'dummy_key');

const roadmapLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 10),
  message: { error: 'Too many requests, please try again later.' }
});

const validateGenerateInput = [
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('age').isInt({ min: 10, max: 100 }).withMessage('Valid age is required'),
  body('status').notEmpty().trim().escape(),
  body('city').notEmpty().trim().escape(),
  body('degree').notEmpty().trim().escape(),
  body('specialization').notEmpty().trim().escape(),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('interests').isArray().withMessage('Interests must be an array'),
  body('certificates').optional().isArray().withMessage('Certificates must be an array'),
  body('challenge').notEmpty().trim().escape(),
  body('dream').notEmpty().trim().escape(),
];

const systemPrompt = "You are TrustPath AI, India's most trusted career counselor with 20+ years experience. Analyze the user profile, including their existing certificates, and generate a structured JSON career roadmap. If the user already has a certificate in a skill, recommend 'Next Level' advanced practices and certifications. Always be India-specific (INR salaries, Indian exams, Indian platforms). Be warm, honest, and actionable. Never give generic advice.";

router.post('/generate', roadmapLimiter, validateGenerateInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, age, status, city, degree, specialization, skills, interests, challenge, dream, certificates = [] } = req.body;

  const certLabels = certificates.map((c) => c.name).filter(Boolean).join(', ');

  const userPrompt = `Generate a career roadmap for:
Name: ${name}, Age: ${age}, Status: ${status}
City: ${city}, Degree: ${degree} in ${specialization}
Skills: ${skills.join(', ')}, Interests: ${interests.join(', ')}
Existing Certificates: ${certLabels || 'None yet'}
Challenge: ${challenge}, Dream: ${dream}

Return ONLY valid JSON in this exact structure:
{
  "profileSummary": "string",
  "careerPaths": [
    {
      "title": "string",
      "matchScore": 0,
      "salaryRange": "string",
      "growthScope": "string",
      "competitionLevel": "string",
      "description": "string"
    }
  ],
  "immediateActions": [
    {
      "month": "string",
      "tasks": ["string"]
    }
  ],
  "skillsToLearn": [
    {
      "skill": "string",
      "priority": "string",
      "resources": ["string"]
    }
  ],
  "examsAndCerts": [
    {
      "name": "string",
      "relevance": "string",
      "nextDate": "string",
      "prepTime": "string"
    }
  ],
  "motivationalNote": "string"
}`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    let rawJson = msg.content[0].text;
    
    // Attempt to extract JSON if there's markdown wrapping
    const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      rawJson = jsonMatch[0];
    }
    
    const parsedData = JSON.parse(rawJson);
    return res.json(parsedData);
  } catch (error) {
    console.error("Claude failed:", error.message);
    
    // Fallback to Gemini
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt
      });
      const result = await model.generateContent(userPrompt);
      const responseText = await result.response.text();
      
      let rawJson = responseText;
      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        rawJson = jsonMatch[0];
      }
      
      const parsedData = JSON.parse(rawJson);
      return res.json(parsedData);
    } catch (geminiError) {
      console.error("Gemini failed:", geminiError.message);
      return res.status(503).json({ error: "Service currently unavailable. Please try again later." });
    }
  }
});

module.exports = router;
