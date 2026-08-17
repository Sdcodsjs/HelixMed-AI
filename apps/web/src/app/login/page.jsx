"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  Key,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("doctor@HelixMed.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("clinician");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please provide valid credentials.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (!requires2FA) {
        setRequires2FA(true);
      } else {
        if (twoFactorCode.length < 4) {
          setErrorMessage("Please enter a valid 2FA authenticator code.");
          return;
        }
        setAuthSuccess(true);
        localStorage.setItem("cn_auth_token", "cn_jwt_" + Date.now().toString(16));
        localStorage.setItem("cn_user_role", role);
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    }, 800);
  };

  const handleGoogleAuth = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSuccess(true);
      localStorage.setItem("cn_auth_token", "google_oauth_" + Date.now().toString(16));
      localStorage.setItem("cn_user_role", role);
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-[#1e293b]/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <ShieldCheck className="text-white" size={30} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            HelixMed AI
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Enterprise Precision Health Platform
          </p>
        </div>

        {authSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-300">Authentication Successful!</h3>
            <p className="text-xs text-slate-300">
              Session token issued. Redirecting to Clinical Workspace...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google Sign-Up / Sign-In Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-3 text-xs shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Sign Up / Sign In with Google</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-500 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span>or email sign in</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {!requires2FA ? (
                <>
                  {/* Role Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Access Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="clinician">Lead Clinician / Physician</option>
                      <option value="researcher">AI Clinical Researcher</option>
                      <option value="auditor">Compliance Auditor</option>
                      <option value="patient">Patient Participant</option>
                    </select>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 text-slate-500" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="doctor@HelixMed.ai"
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 text-slate-500" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* 2FA Verification Step */
                <div className="space-y-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                    <Key size={16} /> 2FA Authenticator Challenge
                  </div>
                  <p className="text-xs text-slate-400">
                    Enter the 6-digit verification code generated by your physical security key or authenticator app.
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-[0.5em] text-lg rounded-xl py-2.5 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-xs"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : requires2FA ? (
                  <>
                    <span>Verify 2FA & Access Dashboard</span> <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <span>Sign In</span> <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Security Compliance Stamp */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center text-[10px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-blue-400" /> HIPAA & GDPR Compliant Security Shield
          </span>
        </div>
      </div>
    </div>
  );
}
