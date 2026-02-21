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
        const errorMsg = `[FAILED] ${modelName}: ${error.message}\n` + (error.response ? JSON.stringify(error.response, null, 2) : '');
        console.error(errorMsg);
        fs.appendFileSync('error_log.txt', errorMsg + '\n\n');
    }
}

async function listModels() {
    console.log("Listing available models...");
    try {
        // For google-generative-ai, we might need a different way to list, 
        // but let's try a direct fetch if the SDK doesn't expose it easily in this context,
        // OR better yet, just use a known working model if any.
        // Actually the SDK has a list_models method but it might be on a different class.
        // Let's just try to generate with 'gemini-1.0-pro' just in case.
        // But to be sure, let's try to verify if the key works AT ALL.

        // The error 404 usually means the API/Model is not found.
        // Let's try to see if we can get a list of models.
        // Note: The Node SDK might not have a direct listModels method on the GenerativeModel instance?
        // It's usually on the GoogleGenerativeAI instance or similar.
        // Looking at docs: genAI.getGenerativeModel is for a specific model.
        // To list, we might need to use the REST API manually if the SDK version is old or I don't recall the method.
        // Wait, the error suggests "Call ListModels".

        // For the purpose of this script, let's just log that we suspect the key is invalid.
    } catch (e) {
        console.error(e);
    }
}

async function runTests() {
    // await testModel("gemini-pro");
    // await testModel("gemini-1.5-flash"); 
    // Let's retry with just gemini-1.5-flash but print if it fails. 
    // Actually we already did that.

    // Let's try 'gemini-1.0-pro' just in case.
    await testModel("gemini-1.0-pro-latest");
    await testModel("gemini-1.5-flash-latest");
}

runTests();
