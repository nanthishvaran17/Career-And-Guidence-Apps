import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock password reset
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl text-gradient font-bold">CareerHub</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                    <p className="text-gray-600 mt-2">
                        {!submitted
                            ? "Enter your email address and we'll send you a link to reset your password."
                            : "Check your email for the reset link."}
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full gradient-primary text-white">
                            Send Reset Link
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            We have sent a password reset link to <strong>{email}</strong>.
                        </p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full gradient-primary text-white"
                        >
                            Return to Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
