import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Brain, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// MOCKED QUESTIONS (Ideally fetched from backend)
const QUESTIONS = [
    // LOGICAL (1-10) - Sample 3 for brevity
    { id: 1, type: 'Logical', question: '2, 6, 12, 20, ___ ?', options: ['28', '30', '32', '36'], answer: '30' },
    { id: 2, type: 'Logical', question: 'Find the odd one out: Circle, Triangle, Square, Cube', options: ['Circle', 'Triangle', 'Square', 'Cube'], answer: 'Cube' },
    { id: 3, type: 'Logical', question: 'If CAT is 3120, what is DOG?', options: ['4157', '4120', '4320', '3120'], answer: '4157' },

    // VERBAL (11-20) - Sample 3
    { id: 11, type: 'Verbal', question: 'Choose the correct sentence:', options: ['He don’t like coffee', 'He doesn’t likes coffee', 'He doesn’t like coffee', 'He didn’t likes coffee'], answer: 'He doesn’t like coffee' },
    { id: 12, type: 'Verbal', question: 'Synonym of "Benevolent"', options: ['Kind', 'Cruel', 'Rich', 'Poor'], answer: 'Kind' },
    { id: 13, type: 'Verbal', question: 'Antonym of "Ancient"', options: ['Old', 'Modern', 'Classic', 'Historic'], answer: 'Modern' },

    // TECHNICAL (21-30) - Sample 3
    { id: 21, type: 'Technical', question: 'Which data structure follows LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], answer: 'Stack' },
    { id: 22, type: 'Technical', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Markup Language', 'Hyper Tabular Markup Language', 'None'], answer: 'Hyper Text Markup Language' },
    { id: 23, type: 'Technical', question: 'Which is NOT a programming language?', options: ['Python', 'Java', 'HTML', 'C++'], answer: 'HTML' }
];

export function AptitudeTest() {
    const navigate = useNavigate();
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 mins
    const [report, setReport] = useState<string | null>(null);

    // Timer
    useEffect(() => {
        if (!started || finished) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [started, finished]);

    const handleOptionSelect = (option: string) => {
        setAnswers({ ...answers, [QUESTIONS[currentQ].id]: option });
    };

    const handleNext = () => {
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        setFinished(true);
        generateReport();
    };

    const generateReport = () => {
        // Calculate Score
        let logicalScore = 0, verbalScore = 0, technicalScore = 0;
        let total = 0;

        QUESTIONS.forEach(q => {
            if (answers[q.id] === q.answer) {
                total++;
                if (q.type === 'Logical') logicalScore++;
                if (q.type === 'Verbal') verbalScore++;
                if (q.type === 'Technical') technicalScore++;
            }
        });

        // Mock AI Generation (In real app, send scores to backend -> Gemini)
        const mockReport = `
# 🧠 AI Career Assessment Report

## Overall Performance Summary
- **Overall Score:** ${Math.round((total / QUESTIONS.length) * 100)}%
- **Performance Level:** ${total > 7 ? 'Excellent 🌟' : total > 4 ? 'Good 👍' : 'Needs Improvement 📈'}

## Section-wise Analysis
- **Logical Reasoning:** ${logicalScore}/3 (${logicalScore > 2 ? 'Strong' : 'Average'})
- **Verbal Ability:** ${verbalScore}/3 (${verbalScore > 2 ? 'Excellent' : 'Good'})
- **Technical Aptitude:** ${technicalScore}/3 (${technicalScore > 2 ? 'High Potential' : 'Developing'})

## Skill Strengths
1. **${technicalScore > logicalScore ? 'Technical Knowledge' : 'Analytical Thinking'}**
2. **Problem Solving**
3. **Decision Making**

## Skill Gaps
- Focus on enhancing **${verbalScore < 2 ? 'Verbal Communication' : 'Advanced Technical Concepts'}**.

## AI Career Recommendations
1. **Software Engineer** (Match: 95%)
2. **Data Analyst** (Match: 88%)
3. **Product Manager** (Match: 82%)

## Next-Step Guidance
- **Learn:** React, Node.js, Python (Agile Development)
- **Certify:** AWS Certified Practitioner
        `;
        setReport(mockReport);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!started) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto p-4">
                    <Card className="p-8 text-center space-y-6">
                        <Brain className="w-16 h-16 text-indigo-600 mx-auto" />
                        <h2 className="text-3xl font-bold">Aptitude & Skills Assessment</h2>
                        <div className="space-y-4 text-left max-w-lg mx-auto bg-gray-50 p-6 rounded-xl">
                            <h3 className="font-semibold text-lg">Test Instructions:</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong>Time Limit:</strong> 20 Minutes</li>
                                <li><strong>Questions:</strong> 30 (Logical, Verbal, Technical)</li>
                                <li><strong>Marking:</strong> No negative marking</li>
                                <li><strong>Result:</strong> Instant AI Report</li>
                            </ul>
                        </div>
                        <Button size="lg" className="w-full max-w-sm gradient-primary text-white" onClick={() => setStarted(true)}>
                            Start Test
                        </Button>
                    </Card>
                </div>
            </Layout>
        );
    }

    if (finished && report) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto p-4">
                    <Card className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6" /> Assessment Completed
                            </h2>
                            <Button variant="outline" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        </div>
                        <div className="prose max-w-none bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <ReactMarkdown>{report}</ReactMarkdown>
                        </div>
                        <div className="mt-6 flex justify-end gap-4">
                            <Button variant="outline" onClick={() => window.print()}>Download Report</Button>
                            <Button className="gradient-primary text-white" onClick={() => navigate('/dashboard')}>
                                Save to Profile
                            </Button>
                        </div>
                    </Card>
                </div>
            </Layout>
        );
    }

    const q = QUESTIONS[currentQ];

    return (
        <Layout>
            <div className="max-w-3xl mx-auto p-4 pt-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <span>Question {currentQ + 1} / {QUESTIONS.length}</span>
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">{q.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 font-bold text-lg bg-red-50 px-4 py-2 rounded-lg">
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <Card className="p-8 mb-8 min-h-[300px] flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-medium mb-8 leading-relaxed">{q.question}</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {q.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionSelect(opt)}
                                    className={`p-4 text-left rounded-xl border-2 transition-all ${answers[q.id] === opt
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium shadow-sm'
                                            : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button size="lg" onClick={handleNext} disabled={!answers[q.id]}>
                            {currentQ === QUESTIONS.length - 1 ? 'Submit Test' : 'Next Question'}
                        </Button>
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
