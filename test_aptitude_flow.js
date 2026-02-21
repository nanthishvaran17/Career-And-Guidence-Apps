const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:4000/api/aptitude';

async function testAptitude() {
    console.log("1. Fetching Questions...");
    try {
        const res = await fetch(`${BASE_URL}/test`);
        const data = await res.json();

        if (!data.questions || data.questions.length === 0) {
            console.error("❌ No questions returned!");
            return;
        }
        console.log(`✅ Loaded ${data.questions.length} questions.`);
        console.log(`   ID: ${data.test_id}, Duration: ${data.duration_minutes} mins`);

        // Simulate Answers
        console.log("\n2. Submitting Answers...");
        const answers = {};

        // Let's answer first 5 questions (we don't know correct ones easily since they are hashed, 
        // but we can pick options randomly. 
        // ACTUALLY, I know the source of truth in 'generate_questions.js', 
        // but the server treats them as hashed.
        // I will just randomly select options to see if it accepts submission.

        data.questions.forEach((q, idx) => {
            if (idx < 5) {
                answers[q.question_id] = q.options[0]; // Just pick first option
            }
        });

        const submitRes = await fetch(`${BASE_URL}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers, timeTaken: 120 })
        });

        const result = await submitRes.json();

        if (result.success) {
            console.log("✅ Submission Successful!");
            console.log("   Score:", result.report.score + "%");
            console.log("   Correct:", result.report.correct + "/" + result.report.total);
            console.log("   Performance:", result.report.performance);
        } else {
            console.error("❌ Submission Failed:", result);
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

testAptitude();
