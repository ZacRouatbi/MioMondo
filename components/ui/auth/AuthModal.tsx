"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";

type AuthMode = "login" | "signup" | "reset";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jet/40 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-snow rounded-2xl shadow-2xl overflow-hidden z-10 border border-jet/5"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-jet/40 hover:text-jet transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-normal text-jet mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {mode === "login" && "Welcome Back"}
                  {mode === "signup" && "Create Account"}
                  {mode === "reset" && "Reset Password"}
                </h2>
                <p className="text-jet/60 text-sm">
                  {mode === "login" && "Enter your details to access your Mio Mondo account."}
                  {mode === "signup" && "Join our community for a personalized shopping experience."}
                  {mode === "reset" && "Enter your email and we'll send you a recovery link."}
                </p>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-widest text-jet/40 font-semibold ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/30" size={18} />
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-lavender/50 border border-jet/5 rounded-xl focus:outline-none focus:border-[#FFCA68] transition-all"
                    />
                  </div>
                </div>

                {mode !== "reset" && (
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-widest text-jet/40 font-semibold ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/30" size={18} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-lavender/50 border border-jet/5 rounded-xl focus:outline-none focus:border-[#FFCA68] transition-all"
                      />
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-1"
                  >
                    <label className="text-[11px] uppercase tracking-widest text-jet/40 font-semibold ml-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/30" size={18} />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-lavender/50 border border-jet/5 rounded-xl focus:outline-none focus:border-[#FFCA68] transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                <button className="w-full bg-jet text-snow py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-jet/90 transition-all mt-6 shadow-lg shadow-jet/10">
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "reset" && "Send Reset Link"}
                  <ArrowRight size={18} />
                </button>
              </form>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-jet/5 flex flex-col gap-3 text-center">
                {mode === "login" ? (
                  <>
                    <button onClick={() => setMode("signup")} className="text-sm text-jet/60 hover:text-jet transition-colors">
                      Don't have an account? <span className="text-jet font-semibold underline decoration-[#FFCA68] underline-offset-4">Sign Up</span>
                    </button>
                    <button onClick={() => setMode("reset")} className="text-xs text-jet/40 hover:text-jet transition-colors">
                      Forgot your password?
                    </button>
                  </>
                ) : (
                  <button onClick={() => setMode("login")} className="text-sm text-jet/60 hover:text-jet transition-colors">
                    Back to <span className="text-jet font-semibold underline decoration-[#FFCA68] underline-offset-4">Sign In</span>
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