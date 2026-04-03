const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key'
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || 'dummy_key');

const systemPrompt = `You are an expert AI Career and College Advisory Engine for Indian students. 
Analyze the student profile, expectations, and industry boundaries logically. Generate purely highly-structured JSON output.
Your recommendations must be strict, realistic, and India-specific. Ensure the "collegeTrustScore" is robust (0-100) based on placement stats, infrastructure, and reputation matching their expectations. Evaluate Scam Risk. Predict Salaries. Calculate accurate Success Probabilities based on real skills.`;

router.post('/generate', async (req, res) => {
  const { profile, expectations } = req.body;

  const userPrompt = `
Generate a Student College Expectations Analysis for:
PROFILE:
Name: ${profile.name || 'Student'}
Age: ${profile.age || 18}
Location: ${profile.state || 'India'}, ${profile.city || ''}
Qualification: ${profile.qualification || '12th'}
Marks: ${profile.marks || ''}
Favorite Subjects: ${profile.subjects || ''}
Skills Known: ${profile.skills || ''}
Career Interest: ${profile.interests || ''}
Preferred Role: ${profile.preferredRole || ''}
Budget: ${profile.budget || ''}

EXPECTATIONS:
Placement: ${expectations.placementRequired ? 'Required (Min: ' + expectations.minSalary + ', Dream: ' + expectations.dreamSalary + ')' : 'Not strictly required'}
Reputation/Reviews: ${expectations.priority === 'High College Ranking' ? 'High Importance' : 'Normal Importance'}
Infrastructure/Facilities desired: ${(expectations.facilities || []).join(', ')}
Campus Environment: ${expectations.urbanPreference || 'Any'}
Ultimate Priority: ${expectations.priority || 'Balanced'}

Deliver EXACTLY this JSON structure. DO NOT output any text before or after the JSON:
{
  "analysis": {
    "strengths": ["string"],
    "weakAreas": ["string"],
    "summary": "string"
  },
  "recommendedCareers": [
    { 
      "role": "string", 
      "matchReason": "string", 
      "successProbability": number, 
      "improvementTips": ["string"],
      "salaryPrediction": {
        "entryLevel": "string",
        "after3Years": "string",
        "after5Years": "string",
        "topCompanies": ["string"]
      }
    }
  ],
  "skillGapAnalysis": {
    "currentSkills": ["string"],
    "requiredSkills": ["string"],
    "criticalSkillGaps": ["string"],
    "recommendedLearningPath": "string"
  },
  "skillRecommendations": ["string"],
  "internshipRecommendations": [
    { "title": "string", "description": "string", "requiredSkills": ["string"] }
  ],
  "certifications": [
    { "name": "string", "platform": "string" }
  ],
  "recommendedColleges": [
    {
      "name": "string",
      "location": "string",
      "courses": ["string"],
      "placementPercentage": "string",
      "topHiringCompanies": ["string"],
      "internshipOpportunities": "string",
      "ranking": "string",
      "trustScore": number,
      "scamWarning": {
        "isRisky": boolean,
        "warningReason": "string (or null)",
        "saferAlternative": "string (or null)"
      }
    }
  ],
  "careerRoadmap": [
    { "year": "Year 1", "focus": "string", "tasks": ["string"] },
    { "year": "Year 2", "focus": "string", "tasks": ["string"] },
    { "year": "Year 3", "focus": "string", "tasks": ["string"] },
    { "year": "Year 4", "focus": "string", "tasks": ["string"] }
  ]
}`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    let rawJson = msg.content[0].text;
    const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) rawJson = jsonMatch[0];
    
    return res.json(JSON.parse(rawJson));
  } catch (error) {
    console.error("Claude failed for advisory:", error.message);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemPrompt });
      const result = await model.generateContent(userPrompt);
      const responseText = await result.response.text();
      
      let rawJson = responseText;
      const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) rawJson = jsonMatch[0];
      
      return res.json(JSON.parse(rawJson));
    } catch (geminiError) {
      console.error("Gemini failed for advisory:", geminiError.message);
      return res.status(503).json({ error: "AI service unavailable." });
    }
  }
});

module.exports = router;
