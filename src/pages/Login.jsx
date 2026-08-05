import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, MessageSquareText } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { Label, Input } from "../components/FormField";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, forgotPassword, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("password"); // "password" | "otp"

  // Password mode
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  // OTP mode
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMsg, setOtpMsg] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(phone.trim(), password, rememberMe);
    if (!result.ok) return setError(result.error);
    navigate(from, { replace: true });
  };

  const handleForgot = async () => {
    setError("");
    const result = await forgotPassword(phone.trim());
    if (!result.ok) return setError(result.error);
    setForgotMsg(result.message);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpMsg("");
    setOtpSending(true);
    const result = await sendOtp(otpPhone.trim(), "login");
    setOtpSending(false);
    if (!result.ok) return setOtpError(result.error);
    setOtpSent(true);
    setOtpMsg(result.message);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    setOtpVerifying(true);
    const result = await verifyOtp(otpPhone.trim(), otpCode.trim(), "login", rememberMe);
    setOtpVerifying(false);
    if (!result.ok) return setOtpError(result.error);
    navigate(from, { replace: true });
  };

  return (
    <AuthShell
      title="Resident Login"
      subtitle="Log in to report issues and get involved."
      footer={
        <>
          <span className="text-neutral-500">New here? </span>
          <Link to="/register" className="font-semibold text-brand-red hover:underline">
            Create an account
          </Link>
          <span className="mx-2 text-neutral-300">•</span>
          <Link to="/admin-login" className="font-semibold text-neutral-500 hover:underline">
            Admin Login
          </Link>
        </>
      }
    >
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`rounded-md py-2 text-sm font-semibold transition ${
            mode === "password" ? "bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white" : "text-neutral-500"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("otp")}
          className={`rounded-md py-2 text-sm font-semibold transition ${
            mode === "otp" ? "bg-white text-neutral-900 shadow dark:bg-neutral-700 dark:text-white" : "text-neutral-500"
          }`}
        >
          Log in with OTP
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
          <div>
            <Label htmlFor="phone" required>Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              data-testid="login-phone-input"
            />
          </div>

          <div>
            <Label htmlFor="password" required>Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
                data-testid="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-brand-red focus:ring-brand-red"
              />
              Remember Me
            </label>
            <button type="button" onClick={handleForgot} className="font-semibold text-brand-red hover:underline">
              Forgot Password?
            </button>
          </div>

          {error && <p className="text-sm font-medium text-brand-red" role="alert">{error}</p>}
          {forgotMsg && <p className="text-sm font-medium text-emerald-600">{forgotMsg}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-red py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-red-dark"
          >
            Log In
          </button>
        </form>
      ) : (
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4" data-testid="otp-login-form">
          <div>
            <Label htmlFor="otpPhone" required>Phone Number</Label>
            <Input
              id="otpPhone"
              type="tel"
              inputMode="numeric"
              placeholder="98765 43210"
              value={otpPhone}
              onChange={(e) => {
                setOtpPhone(e.target.value);
                setOtpSent(false);
                setOtpMsg("");
              }}
              required
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <div>
              <Label htmlFor="otpCode" required>Verification Code</Label>
              <Input
                id="otpCode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending}
                className="mt-2 text-xs font-semibold text-brand-red hover:underline disabled:opacity-50"
              >
                {otpSending ? "Resending…" : "Resend code"}
              </button>
            </div>
          )}

          {otpError && <p className="text-sm font-medium text-brand-red" role="alert">{otpError}</p>}
          {otpMsg && <p className="text-sm font-medium text-emerald-600">{otpMsg}</p>}

          <button
            type="submit"
            disabled={otpSending || otpVerifying}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-red-dark disabled:opacity-60"
          >
            <MessageSquareText size={16} />
            {otpSent ? (otpVerifying ? "Verifying…" : "Verify & Log In") : otpSending ? "Sending…" : "Send Code"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
