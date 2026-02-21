import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Timer, CheckCircle, Loader2, Brain, Zap, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
    question_id: string;
    category: string;
    question: string;
    options: string[];
}

interface TestData {
    total_questions: number;
    duration_minutes: number;
    questions: Question[];
}

interface TestReport {
    score: number;
    correct: number;
    total: number;
    performance: string;
    recommendation: string;
    breakdown: { logical: number; quant: number; verbal: number };
}

export function AptitudeTest() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [testData, setTestData] = useState<TestData | null>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [report, setReport] = useState<TestReport | null>(null);

    const handleSubmit = useCallback(async () => {
        if (finished) return;
        setSubmitting(true);

        const userEmail = localStorage.getItem('userEmail') || '';

        try {
            const res = await fetch('/api/aptitude/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers, email: userEmail }),
            });

            if (res.ok) {
                const data = await res.json();
                setReport(data.report);
                setFinished(true);
                toast.success('Test submitted! Results ready.');
            } else {
                // Even if API fails, show completion
                setFinished(true);
                toast.error('Submitted, but could not fetch score. Check backend.');
            }
        } catch (e) {
            setFinished(true);
            toast.error('Network error — submitted locally only.');
        } finally {
            setSubmitting(false);
        }
    }, [finished, answers, navigate]);

    // Timer
    useEffect(() => {
        if (!started || finished || timeLeft <= 0) return;
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
    }, [started, finished, timeLeft, handleSubmit]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const timePercent = testData ? (timeLeft / (testData.duration_minutes * 60)) * 100 : 100;
    const timeColor = timePercent > 50 ? 'bg-green-500' : timePercent > 20 ? 'bg-yellow-500' : 'bg-red-500';

    const startTest = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/aptitude/test');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (!data.questions || data.questions.length === 0) throw new Error('No questions found');
            setTestData(data);
            setTimeLeft(data.duration_minutes * 60);
            setStarted(true);
            toast.success(`Test loaded! ${data.total_questions} questions, ${data.duration_minutes} minutes`);
        } catch (error) {
            console.error('Error loading test:', error);
            toast.error('Failed to load test. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (option: string) => {
        if (!testData) return;
        const questionId = testData.questions[currentQ].question_id;
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const nextQuestion = () => {
        if (!testData) return;
        if (currentQ < testData.questions.length - 1) setCurrentQ(prev => prev + 1);
    };

    const prevQuestion = () => {
        if (currentQ > 0) setCurrentQ(prev => prev - 1);
    };

    // ─── START SCREEN ────────────────────────────────────────────────────────────
    if (!started) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto p-6">
                    {/* Hero Card */}
                    <div className="relative overflow-hidden rounded-2xl mb-6"
                        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)' }}>
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        <div className="relative p-8 text-white text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <Brain className="w-9 h-9 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Aptitude Test</h1>
                            <p className="text-blue-100 text-base">
                                Evaluate your skills across Logical Reasoning, Quantitative Aptitude, and Verbal Ability
                            </p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { icon: BookOpen, label: '25 Questions', sub: 'Mixed categories', color: 'bg-blue-50 text-blue-600' },
                            { icon: Timer, label: '30 Minutes', sub: 'Time limit', color: 'bg-purple-50 text-purple-600' },
                            { icon: Zap, label: 'Instant Result', sub: 'Score + email', color: 'bg-green-50 text-green-600' },
                        ].map(({ icon: Icon, label, sub, color }) => (
                            <Card key={label} className="p-4 text-center border-0 shadow-sm">
                                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                                <p className="text-xs text-gray-500">{sub}</p>
                            </Card>
                        ))}
                    </div>

                    {/* Instructions */}
                    <Card className="p-5 mb-6 border border-blue-100 bg-blue-50/50">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">i</span>
                            Instructions
                        </h3>
                        <ul className="space-y-2">
                            {[
                                '✅ 25 questions across different categories',
                                '⏱️ 30 minutes duration — timer starts on Begin',
                                '📝 Select one answer per question',
                                '🔄 Navigate freely between questions',
                                '✉️ Your score report will be emailed to you',
                            ].map((item, i) => (
                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Start Button — Vibrant Blue */}
                    <button
                        onClick={startTest}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem 2rem',
                            background: loading
                                ? '#93c5fd'
                                : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                            letterSpacing: '0.02em',
                        }}
                        onMouseEnter={e => {
                            if (!loading) {
                                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                                (e.target as HTMLElement).style.boxShadow = '0 8px 28px rgba(37, 99, 235, 0.5)';
                            }
                        }}
                        onMouseLeave={e => {
                            (e.target as HTMLElement).style.transform = 'translateY(0)';
                            (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.4)';
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Loading Questions...
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5" />
                                Begin Test
                            </>
                        )}
                    </button>
                </div>
            </Layout>
        );
    }

    // ─── FINISHED SCREEN ─────────────────────────────────────────────────────────
    if (finished) {
        const userEmail = localStorage.getItem('userEmail') || '';
        const perfColor = report
            ? report.score >= 80 ? '#059669' : report.score >= 50 ? '#d97706' : '#dc2626'
            : '#2563eb';

        return (
            <Layout>
                <div className="max-w-xl mx-auto p-4 md:p-6">
                    {/* Score Hero Banner */}
                    <div className="relative overflow-hidden rounded-2xl p-8 text-center mb-5"
                        style={{ background: `linear-gradient(135deg, ${perfColor} 0%, ${perfColor}cc 100%)` }}>
                        <CheckCircle className="w-16 h-16 text-white mx-auto mb-3" />
                        <h1 className="text-3xl font-bold text-white mb-1">Test Completed!</h1>
                        {report ? (
                            <>
                                <div className="my-4">
                                    <span className="text-6xl font-black text-white">{report.score}%</span>
                                    <p className="text-white/80 text-sm mt-1">{report.correct} correct out of {report.total} questions</p>
                                </div>
                                <div className="inline-block bg-white/25 backdrop-blur-sm rounded-full px-5 py-2">
                                    <span className="text-white font-bold text-lg">{report.performance}</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-white/80 mt-2">Answered: {Object.keys(answers).length} / {testData?.total_questions || 0}</p>
                        )}
                    </div>

                    {/* Breakdown */}
                    {report && (
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            {[
                                { label: 'Logical', key: 'logical', color: '#3b82f6' },
                                { label: 'Quantitative', key: 'quant', color: '#8b5cf6' },
                                { label: 'Verbal', key: 'verbal', color: '#10b981' },
                            ].map(({ label, key, color }) => (
                                <div key={key} className="text-center p-4 rounded-xl border"
                                    style={{ borderColor: color + '33', background: color + '11' }}>
                                    <p className="text-2xl font-bold" style={{ color }}>
                                        {(report.breakdown as any)[key]}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Recommendation */}
                    {report && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                            <p className="text-sm font-semibold text-blue-900 mb-1">💡 Recommendation</p>
                            <p className="text-sm text-blue-700">{report.recommendation}</p>
                        </div>
                    )}

                    {/* Email notice */}
                    <div className="bg-gray-50 border rounded-xl p-4 mb-5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">✉️</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Results sent to email</p>
                            <p className="text-xs text-gray-500">{userEmail || 'your registered email'}</p>
                        </div>
                    </div>

                    {/* Go to Dashboard */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                            color: 'white', border: 'none', fontWeight: '700',
                            fontSize: '1rem', cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(37,99,235,0.35)',
                        }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </Layout>
        );
    }

    // ─── LOADING STATE ───────────────────────────────────────────────────────────
    if (!testData) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </Layout>
        );
    }

    // ─── TEST SCREEN ─────────────────────────────────────────────────────────────
    const currentQuestion = testData.questions[currentQ];
    const currentAnswer = answers[currentQuestion.question_id];
    const answeredCount = Object.keys(answers).length;
    const progressPercent = (answeredCount / testData.total_questions) * 100;

    return (
        <Layout>
            <div className="max-w-3xl mx-auto p-4 md:p-6">

                {/* Top Bar: Timer + Progress */}
                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500 font-medium">
                        Question <span className="text-gray-900 font-bold">{currentQ + 1}</span> of {testData.total_questions}
                    </div>
                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-base shadow-md ${timePercent <= 20 ? 'animate-pulse' : ''}`}
                        style={{ background: timePercent > 50 ? '#16a34a' : timePercent > 20 ? '#d97706' : '#dc2626' }}>
                        <Timer className="w-4 h-4" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Timer Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
                    <div className={`h-1.5 rounded-full transition-all duration-1000 ${timeColor}`}
                        style={{ width: `${timePercent}%` }} />
                </div>

                {/* Question Card */}
                <Card className="p-6 mb-5 shadow-md border-0 ring-1 ring-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-100">
                            {currentQuestion.category}
                        </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-6 leading-relaxed">
                        {currentQuestion.question}
                    </h2>

                    {/* Options — fully clickable, no overlay */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = currentAnswer === option;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => selectAnswer(option)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '14px 18px',
                                        borderRadius: '10px',
                                        border: isSelected ? '2px solid #2563eb' : '2px solid #e5e7eb',
                                        background: isSelected
                                            ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                                            : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'all 0.15s ease',
                                        boxShadow: isSelected ? '0 0 0 3px rgba(37,99,235,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                                        color: isSelected ? '#1d4ed8' : '#374151',
                                        fontWeight: isSelected ? '600' : '400',
                                        fontSize: '0.95rem',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    {/* Option circle indicator */}
                                    <span style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        border: isSelected ? '2px solid #2563eb' : '2px solid #d1d5db',
                                        background: isSelected ? '#2563eb' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        transition: 'all 0.15s',
                                    }}>
                                        {isSelected && (
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', display: 'block' }} />
                                        )}
                                    </span>
                                    <span>{option}</span>
                                </button>
                            );
                        })}
                    </div>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mb-5">
                    <Button
                        onClick={prevQuestion}
                        disabled={currentQ === 0}
                        variant="outline"
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>

                    {/* Question dots (mini progress) */}
                    <div className="flex gap-1 flex-wrap justify-center max-w-xs">
                        {testData.questions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentQ(i)}
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: i === currentQ
                                        ? '#2563eb'
                                        : answers[q.question_id]
                                            ? '#22c55e'
                                            : '#d1d5db',
                                    transition: 'background 0.2s',
                                }}
                                title={`Q${i + 1}`}
                            />
                        ))}
                    </div>

                    {currentQ === testData.questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', minWidth: '110px' }}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Test ✓'}
                        </Button>
                    ) : (
                        <Button
                            onClick={nextQuestion}
                            style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', border: 'none' }}
                            className="flex items-center gap-1"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Answer Progress Bar */}
                <div className="bg-gray-100 rounded-xl p-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="font-medium">Answered</span>
                        <span className="font-bold text-blue-700">{answeredCount} / {testData.total_questions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

            </div>
        </Layout>
    );
}
