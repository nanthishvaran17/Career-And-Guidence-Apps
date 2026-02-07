const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.resolve(__dirname, 'server/.env');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
} catch (e) {
    console.error("Could not read .env", e);
}

console.log("Testing API Key:", apiKey ? "Found" : "Missing");

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log(`[SUCCESS] ${modelName}:`, response.text());
    } catch (error) {
        console.error(`[FAILED] ${modelName}:`, error.message);
        // Print full error for details
        if (error.response) console.error(JSON.stringify(error.response, null, 2));
    }
}

async function runTests() {
    await testModel("gemini-pro");
    await testModel("gemini-1.5-flash"); // Just to check
}

runTests();
