const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Testing API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "MISSING");

    if (!apiKey) {
        console.error("No API Key found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        console.log("Sending request to Gemini...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        if (error.response) {
            console.error("Error Details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
