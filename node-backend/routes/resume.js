const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key'
});

const systemPrompt = `You are an expert AI Resume Builder and Career Coach. 
Analyze the provided student profile (which may include academic history, skills, and projects).
Generate a highly professional, ATS-optimized Resume in MARKDOWN format.
Include standard sections: Header (Name, contact), Summary, Education, Skills, Projects/Experience (if any), Certifications (if any).
Output the response purely in MARKDOWN format containing ONLY the resume text, no introductory conversational text.`;

router.post('/generate', async (req, res) => {
  const { profile } = req.body;

  const userPrompt = `
Generate an ATS-friendly markdown resume for the following profile:
Name: ${profile.name || "Student"}
Email: ${profile.email || "student@example.com"}
Phone: ${profile.phone || "+91 0000000000"}
Location: ${profile.location || "India"}
Education: ${profile.educationLevel} ${profile.stream ? `in ${profile.stream}` : ''}
Institution: ${profile.institutionName || ""}
Marks: ${profile.marks || ""}
Tech Skills: ${profile.techSkills || ""}
Soft Skills: ${profile.softSkills || ""}
Desired Job Role: ${profile.dreamJob || "Entry Level Professional"}
Target Industry: ${profile.careerPreference || "Corporate"}

Add impressive bullet points suggesting standard academic projects or achievements if they don't have experience yet, but mark them clearly as placeholders for the user to edit. Ensure the markdown formatting uses Headings (#, ##), lists, and bold text professionally.`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    const markdownResume = msg.content[0].text;
    return res.json({ markdown: markdownResume });
  } catch (error) {
    console.error("Claude Resume Gen Error:", error.message);
    return res.status(503).json({ error: "AI service currently unavailable for resume generation." });
  }
});

module.exports = router;
