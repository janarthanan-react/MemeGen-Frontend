import React, { useState } from 'react';
import { Mail, CheckCircle, KeyRound, Lock } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      if (newPassword && newPassword.length >= 8) {
        await authService.resetPassword(email, newPassword);
      }
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process password reset.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMsg(null);
    setNewPassword('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Reset Your Password"
      description="Enter your account email and new password to securely update your credentials."
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your email address and desired new password. Your new password will be encrypted with bcrypt before being stored.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoFocus
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              helperText="Must be at least 8 characters long."
              required
            />

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={handleReset} type="button" className="w-full sm:w-auto min-h-[42px]">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={!email || newPassword.length < 8 || loading}
                className="w-full sm:w-auto min-h-[42px]"
              >
                {loading ? 'Securing Password...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 py-2 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password Reset Successful</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Your password for <strong className="font-semibold">{email}</strong> has been encrypted with bcrypt and updated. You can now sign in with your new password.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleReset}
                leftIcon={<KeyRound className="w-4 h-4" />}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
