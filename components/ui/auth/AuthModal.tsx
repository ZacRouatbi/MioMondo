"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; 

type AuthMode = "login" | "signup" | "reset";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const { login, signup, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login.mutate({ email: formData.email, password: formData.password });
    } else if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) return;
      signup.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const authError = login.error?.message || signup.error?.message;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jet/40 backdrop-blur-sm"
      />

      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-snow rounded-2xl shadow-2xl overflow-hidden z-10 border border-jet/5"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-jet/40 hover:text-jet transition-colors">
          <X size={20} />
        </button>

        <div className="p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
              <div className="mb-8">
                <h2 className="text-2xl font-normal text-jet mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {mode === "login" && "Welcome Back"}
                  {mode === "signup" && "Create Account"}
                  {mode === "reset" && "Reset Password"}
                </h2>
                <p className="text-jet/60 text-sm">
                  {mode === "login" && "Access your Mio Mondo dashboard."}
                  {mode === "signup" && "Join our furniture collective today."}
                  {mode === "reset" && "We'll send a recovery link to your inbox."}
                </p>
              </div>

              {authError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} />
                  {authError}
                </motion.div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-jet/40 font-bold ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/20" size={18} />
                    <input 
                      name="email" type="email" required
                      value={formData.email} onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-lavender/30 border border-jet/5 rounded-xl focus:outline-none focus:border-[#FFCA68] transition-all"
                    />
                  </div>
                </div>

                {mode !== "reset" && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-jet/40 font-bold ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/20" size={18} />
                      <input 
                        name="password" type="password" required
                        value={formData.password} onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-lavender/30 border border-jet/5 rounded-xl focus:outline-none focus:border-[#FFCA68] transition-all"
                      />
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-jet/40 font-bold ml-1">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/20" size={18} />
                      <input 
                        name="confirmPassword" type="password" required
                        value={formData.confirmPassword} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-lavender/30 border border-jet/5 rounded-xl focus:outline-none focus:border-[#FFCA68] transition-all"
                      />
                    </div>
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  className="w-full bg-jet text-snow py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#2A2A2A] disabled:opacity-50 transition-all mt-6 shadow-xl shadow-jet/5"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : (
                    <>
                      {mode === "login" && "Sign In"}
                      {mode === "signup" && "Create Account"}
                      {mode === "reset" && "Send Link"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-jet/5 flex flex-col gap-3 text-center">
                {mode === "login" ? (
                  <>
                    <button onClick={() => setMode("signup")} className="text-sm text-jet/60 hover:text-jet transition-colors">
                      New here? <span className="text-jet font-bold underline decoration-[#FFCA68] underline-offset-4">Sign Up</span>
                    </button>
                    <button onClick={() => setMode("reset")} className="text-xs text-jet/30 hover:text-jet transition-colors">
                      Forgot password?
                    </button>
                  </>
                ) : (
                  <button onClick={() => setMode("login")} className="text-sm text-jet/60 hover:text-jet transition-colors">
                    Already a member? <span className="text-jet font-bold underline decoration-[#FFCA68] underline-offset-4">Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}