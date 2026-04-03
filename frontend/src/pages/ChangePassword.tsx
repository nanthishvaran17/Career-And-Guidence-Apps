import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { API_BASE_URL } from '../config';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  KeyRound,
  ArrowLeft,
  Info,
} from 'lucide-react';

// ── Password Rule Check ────────────────────────────────────────────────────────
interface Rule {
  label: string;
  test: (p: string) => boolean;
}

const RULES: Rule[] = [
  { label: 'At least 8 characters',         test: (p) => p.length >= 8 },
  { label: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'At least one lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'At least one number',            test: (p) => /\d/.test(p) },
  { label: 'At least one special character', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

// ── Strength Calculation ───────────────────────────────────────────────────────
function getStrength(password: string): { score: number; label: string; color: string; barColor: string } {
  const passed = RULES.filter(r => r.test(password)).length;
  if (password.length === 0) return { score: 0, label: '', color: '', barColor: 'bg-gray-200' };
  if (passed <= 2) return { score: 1, label: 'Weak',   color: 'text-red-500',    barColor: 'bg-red-500' };
  if (passed <= 3) return { score: 2, label: 'Fair',   color: 'text-orange-500', barColor: 'bg-orange-500' };
  if (passed <= 4) return { score: 3, label: 'Medium', color: 'text-yellow-500', barColor: 'bg-yellow-400' };
  return                  { score: 4, label: 'Strong', color: 'text-green-500',  barColor: 'bg-green-500' };
}

// ── PasswordField Component ────────────────────────────────────────────────────
function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '••••••••••••'}
          className={`pl-10 pr-12 h-12 font-mono tracking-widest text-base dark:bg-gray-800 dark:border-gray-600
            ${error ? 'border-red-400 focus:ring-red-400' : 'focus:ring-indigo-400'}`}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function ChangePassword() {
  const navigate = useNavigate();

  const [current, setCurrent]         = useState('');
  const [newPass, setNewPass]         = useState('');
  const [confirm, setConfirm]         = useState('');
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const strength = getStrength(newPass);

  // ── Frontend Validation ────────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    if (!current.trim()) errs.current = 'Current password is required.';
    if (!newPass)         errs.newPass = 'New password is required.';
    else if (!RULES.every(r => r.test(newPass)))
      errs.newPass = 'Password does not meet all security requirements below.';

    if (!confirm)         errs.confirm = 'Please confirm your new password.';
    else if (confirm !== newPass) errs.confirm = 'Passwords do not match.';

    if (newPass && current && newPass === current)
      errs.newPass = 'New password must be different from your current password.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [current, newPass, confirm]);

  // ── Submit Handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('You must be logged in to change your password.');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE_URL}/api/security/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword: current, newPassword: newPass }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setRateLimited(true);
        toast.error('Too many attempts. Please wait 15 minutes before trying again.');
        return;
      }

      if (!res.ok) {
        if (data.error?.includes('Current password')) {
          setErrors(prev => ({ ...prev, current: data.error }));
        } else if (data.error?.includes('reuse')) {
          setErrors(prev => ({ ...prev, newPass: data.error }));
        } else {
          toast.error(data.error || 'Something went wrong.');
        }
        return;
      }

      setSuccess(true);
      toast.success('Password changed successfully!');
      setCurrent(''); setNewPass(''); setConfirm('');
    } catch (err) {
      toast.error('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto flex items-center justify-center min-h-[70vh] px-4">
          <Card className="w-full p-10 text-center shadow-2xl border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Password Changed!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Your account password has been updated securely using <strong>bcrypt encryption</strong>.
              </p>
              <p className="text-xs text-gray-400 mb-8">
                A security log entry has been recorded with timestamp and device info.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="h-11">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
                </Button>
                <Button onClick={() => setSuccess(false)} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white">
                  Change Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  // ── Rate Limited Screen ────────────────────────────────────────────────────
  if (rateLimited) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto flex items-center justify-center min-h-[70vh] px-4">
          <Card className="w-full p-10 text-center shadow-2xl border-0">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Too Many Attempts</h2>
            <p className="text-gray-500 mb-8">
              For security reasons, this action has been temporarily blocked. Please wait 15 minutes and try again.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full h-11 bg-indigo-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <button onClick={() => navigate(-1)} className="mt-1 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-7 h-7 text-indigo-600" /> Change Password
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Update your account password securely. All fields are encrypted using bcrypt.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">

            {/* Security Notice Banner */}
            <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Your password is stored using <strong>bcrypt</strong> with a salt factor of 12. Plain text passwords are never stored. Rate limiting is active (5 attempts / 15 min).
              </p>
            </div>

            {/* Current Password */}
            <Card className="p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" /> Current Password
              </h3>
              <PasswordField
                id="current-password"
                label="Enter your current password"
                value={current}
                onChange={setCurrent}
                placeholder="Your current password"
                error={errors.current}
              />
            </Card>

            {/* New Password */}
            <Card className="p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" /> New Password
              </h3>

              <div className="space-y-5">
                <PasswordField
                  id="new-password"
                  label="Create a strong new password"
                  value={newPass}
                  onChange={setNewPass}
                  error={errors.newPass}
                />

                {/* Strength Meter */}
                {newPass.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Password Strength</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.barColor : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Password Rules */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Password Requirements
                  </p>
                  {RULES.map((rule) => {
                    const ok = newPass.length > 0 && rule.test(newPass);
                    return (
                      <div key={rule.label} className="flex items-center gap-2.5">
                        {ok
                          ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          : <XCircle className={`w-4 h-4 shrink-0 ${newPass.length > 0 ? 'text-red-400' : 'text-gray-300'}`} />
                        }
                        <span className={`text-xs font-medium ${ok ? 'text-green-600 dark:text-green-400' : newPass.length > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Confirm Password */}
                <PasswordField
                  id="confirm-password"
                  label="Confirm new password"
                  value={confirm}
                  onChange={setConfirm}
                  error={errors.confirm}
                />

                {/* Match indicator */}
                {confirm.length > 0 && (
                  <div className={`flex items-center gap-2 text-xs font-semibold ${confirm === newPass ? 'text-green-500' : 'text-red-400'}`}>
                    {confirm === newPass
                      ? <><CheckCircle2 className="w-4 h-4" /> Passwords match</>
                      : <><XCircle className="w-4 h-4" /> Passwords do not match</>
                    }
                  </div>
                )}
              </div>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || strength.score < 4 || confirm !== newPass || !current}
              className="w-full h-13 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Encrypting & Saving...</>
              ) : (
                <><ShieldCheck className="w-5 h-5 mr-2" /> Update Password Securely</>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              🔒 Requests are encrypted and protected by rate limiting.
              Last 3 passwords cannot be reused.
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
