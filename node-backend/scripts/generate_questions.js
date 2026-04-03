const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const hashAnswer = (answer) => {
    return crypto.createHash('sha256').update(answer.trim().toLowerCase()).digest('hex');
};

const questions = [
    // --- LOGICAL REASONING (10) ---
    {
        category: "Logical",
        question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
        options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
        answer: "(1/8)"
    },
    {
        category: "Logical",
        question: "SCD, TEF, UGH, ____, WKL",
        options: ["CMN", "UJI", "VIJ", "IJT"],
        answer: "VIJ"
    },
    {
        category: "Logical",
        question: "Which word does NOT belong with the others?",
        options: ["Index", "Glossary", "Chapter", "Book"],
        answer: "Book"
    },
    {
        category: "Logical",
        question: "Safe : Secure :: Protect : ?",
        options: ["Lock", "Guard", "Sure", "Conserve"],
        answer: "Guard"
    },
    {
        category: "Logical",
        question: "If A = 26, SUN = 27, then CAT = ?",
        options: ["24", "27", "57", "58"],
        answer: "57"
    },
    {
        category: "Logical",
        question: "Statement: All mangoes are golden in color. No golden-colored things are cheap. Conclusion: 1) All mangoes are cheap. 2) Golden-colored mangoes are not cheap.",
        options: ["Only 1 follows", "Only 2 follows", "Either 1 or 2", "Both follow"],
        answer: "Only 2 follows"
    },
    {
        category: "Logical",
        question: "Point A is 5m North of Point B. Point C is 5m East of Point B. What is the direction of A with respect to C?",
        options: ["South-West", "North-East", "North-West", "South-East"],
        answer: "North-West"
    },
    {
        category: "Logical",
        question: "If in a certain code, TWENTY is written as 863985 and ELEVEN is written as 323039, how is TWELVE written in that code?",
        options: ["863203", "863584", "863903", "863063"],
        answer: "863203"
    },
    {
        category: "Logical",
        question: "A man points to a woman and says, 'Her mother is the only daughter of my mother.' How is the woman related to the man?",
        options: ["Sister", "Daughter", "Mother", "Niece"],
        answer: "Daughter"
    },
    {
        category: "Logical",
        question: "Find the missing number in the matrix: \n 6  18  15 \n 3   2   5 \n 4   3   ? \n 8  27   9",
        options: ["11", "6", "3", "2"],
        answer: "3" // (6*3)-10=8? No. 6-3+5? Row logic? (6*3)/2? Col logic: 6*? = 8? 
        // Actually: 6*3/2=9? No. 
        // Logic: (Col1 * Col2) / 2 = Col 4? No.
        // Let's change to a standard one.
        // 6, 3, 4, 8 -> 6+4-2=8.
        // 18, 2, 3, 27 -> 18+?
        // Let's use simpler: 
        // 6 18 15
        // 4 3 ?
        // 24 54 45. (Row 1 * Row 2 = Row 3) -> 6*4=24, 18*3=54. 15*?=45 -> 3.
        // Matrix updated in object below to match logic.
    },

    // --- QUANTITATIVE APTITUDE (8) ---
    {
        category: "Quantitative",
        question: "A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:",
        options: ["45 km/hr", "50 km/hr", "54 km/hr", "55 km/hr"],
        answer: "50 km/hr"
    },
    {
        category: "Quantitative",
        question: "The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?",
        options: ["4 years", "8 years", "10 years", "None of these"],
        answer: "4 years"
    },
    {
        category: "Quantitative",
        question: "A father said to his son, 'I was as old as you are at the present at the time of your birth'. If the father's age is 38 years now, the son's age five years back was:",
        options: ["14 years", "19 years", "33 years", "38 years"],
        answer: "14 years"
    },
    {
        category: "Quantitative",
        question: "A alone can do a piece of work in 6 days and B alone in 8 days. A and B undertook to do it for ₹3200. With the help of C, they completed the work in 3 days. How much is to be paid to C?",
        options: ["₹375", "₹400", "₹600", "₹800"],
        answer: "₹400"
    },
    {
        category: "Quantitative",
        question: "What is the probability of getting a sum of 9 from two throws of a dice?",
        options: ["1/6", "1/8", "1/9", "1/12"],
        answer: "1/9"
    },
    {
        category: "Quantitative",
        question: "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
        options: ["3", "4", "5", "6"],
        answer: "5"
    },
    {
        category: "Quantitative",
        question: "The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?",
        options: ["0", "1", "10", "19"],
        answer: "19"
    },
    {
        category: "Quantitative",
        question: "It was Sunday on Jan 1, 2006. What was the day of the week on Jan 1, 2010?",
        options: ["Sunday", "Saturday", "Friday", "Wednesday"],
        answer: "Friday"
    },

    // --- VERBAL ABILITY (7) ---
    {
        category: "Verbal",
        question: "Synonym of: CANDID",
        options: ["Apparent", "Explicit", "Frank", "Bright"],
        answer: "Frank"
    },
    {
        category: "Verbal",
        question: "Antonym of: ENORMOUS",
        options: ["Soft", "Average", "Tiny", "Weak"],
        answer: "Tiny"
    },
    {
        category: "Verbal",
        question: "Find the correctly spelt word.",
        options: ["Adverisment", "Advertiesment", "Advertisement", "Advertisment"],
        answer: "Advertisement"
    },
    {
        category: "Verbal",
        question: "Complete the sentence: The doctor ____ the patient to stop smoking.",
        options: ["advised", "advice", "adviced", "advise"],
        answer: "advised"
    },
    {
        category: "Verbal",
        question: "Idiom: To keep one's temper",
        options: ["To become hungry", "To be in good mood", "To preserve ones energy", "To be aloof from"],
        answer: "To be in good mood"
    },
    {
        category: "Verbal",
        question: "One word substitution: A person who renounces the world and practices self-discipline in order to attain salvation.",
        options: ["Sceptic", "Ascetic", "Devotee", "Antiquarian"],
        answer: "Ascetic"
    },
    {
        category: "Verbal",
        question: "Rearrange the parts: (P) to the (Q) he went (R) library (S) study",
        options: ["QPRS", "QPSR", "QRPS", "QSPR"],
        answer: "QPRS" // He went to the library study... No. Q P R S -> He went to the library study? Typically "to study".
        // Let's fix. He went to the library to study.
        // P: to the, Q: he went, R: library, S: to study.
        // Q P R S -> He went to the library to study. 
        // Actually assume S implies 'to study' context or change.
        // Let's pick a better one.
    }
];

// Fix Matrix Logic
questions[9] = {
    category: "Logical",
    question: "Find the missing number in the matrix:\nRow 1: 6, 4, 24\nRow 2: 18, 3, 54\nRow 3: 15, ?, 45",
    options: ["1", "2", "3", "4"],
    answer: "3"
};

// Fix Jumbled Word
questions[24] = {
    category: "Verbal",
    question: "Rearrange: (1) medicine (2) a (3) Neeta (4) given (5) was",
    options: ["51432", "25431", "15423", "35421"], // 35421: Neeta was given a medicine OR 35412? 
    // 3 5 4 2 1 -> Neeta was given a medicine.
    answer: "35421"
};


const finalData = {
    test_id: "GEN-" + crypto.randomUUID().split('-')[0].toUpperCase(),
    total_questions: questions.length,
    duration_minutes: 30,
    questions: questions.map(q => ({
        question_id: crypto.randomUUID(),
        category: q.category,
        question: q.question,
        options: q.options.sort(() => 0.5 - Math.random()), // Shuffle options
        encrypted_correct_answer: hashAnswer(q.answer)
    }))
};

const outputPath = path.join(__dirname, '../data/aptitude_questions.json');

// Ensure dir exists
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
console.log(`✅ Generated ${questions.length} secure questions at ${outputPath}`);
