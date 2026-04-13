"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { requestPasswordReset } from "@/hooks/useNodemailer";
type AuthMode = "login" | "signup" | "reset";



export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const { login, signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const resetMutation = useMutation({
    mutationFn: () => requestPasswordReset(formData.email),
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login.mutate({ email: formData.email, password: formData.password });
    } else if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) return;
      signup.mutate(formData);
    } else if (mode === "reset") {
      resetMutation.mutate();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModeSwitch = (next: AuthMode) => {
    setMode(next);
    resetMutation.reset();
  };

  const authError =
    login.error?.message ||
    signup.error?.message ||
    (mode === "reset" && resetMutation.isError ? (resetMutation.error as Error).message : null);

  const inputClass =
    "w-full pl-10 pr-4 py-3 bg-lavender/30 border border-jet/5 rounded-xl focus:outline-none focus:border-[#FFCA68] transition-all text-[14px]";

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
            >
              {/* Header */}
              <div className="mb-8">
                <h2
                  className="text-2xl font-normal text-jet mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {mode === "login" && "Bon retour"}
                  {mode === "signup" && "Créer un compte"}
                  {mode === "reset" && "Mot de passe oublié"}
                </h2>
                <p className="text-jet/60 text-sm">
                  {mode === "login" && "Accédez à votre espace MioMondoHome."}
                  {mode === "signup" && "Rejoignez notre communauté dès aujourd'hui."}
                  {mode === "reset" &&
                    "Saisissez votre adresse e-mail. Nous vous enverrons un nouveau mot de passe."}
                </p>
              </div>

              {/* Error banner */}
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-center gap-2"
                >
                  <AlertCircle size={14} />
                  {authError}
                </motion.div>
              )}

              {/* Reset success state */}
              {mode === "reset" && resetMutation.isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-6 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#FFCA68]/15 flex items-center justify-center">
                    <CheckCircle2 size={28} className="text-[#FFCA68]" />
                  </div>
                  <div>
                    <p className="text-jet font-medium mb-1 text-[15px]">E-mail envoyé !</p>
                    <p className="text-jet/50 text-[13px] leading-relaxed max-w-[28ch] mx-auto">
                      Si un compte existe pour{" "}
                      <span className="text-jet font-medium">{formData.email}</span>, vous
                      recevrez votre nouveau mot de passe sous peu.
                    </p>
                  </div>
                  <button
                    onClick={() => handleModeSwitch("login")}
                    className="mt-2 text-sm text-jet/60 hover:text-jet transition-colors"
                  >
                    Retour à la{" "}
                    <span className="text-jet font-bold underline decoration-[#FFCA68] underline-offset-4">
                      connexion
                    </span>
                  </button>
                </motion.div>
              ) : (
                /* Form */
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-jet/40 font-bold ml-1">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/20"
                        size={18}
                      />
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nom@exemple.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {mode !== "reset" && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-jet/40 font-bold ml-1">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/20"
                          size={18}
                        />
                        <input
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}

                  {mode === "signup" && (
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-jet/40 font-bold ml-1">
                        Confirmer
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-jet/20"
                          size={18}
                        />
                        <input
                          name="confirmPassword"
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || resetMutation.isPending}
                    className="w-full bg-jet text-snow py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#2A2A2A] disabled:opacity-50 transition-all mt-6 shadow-xl shadow-jet/5 text-[14px]"
                  >
                    {isLoading || resetMutation.isPending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        {mode === "login" && "Se connecter"}
                        {mode === "signup" && "Créer le compte"}
                        {mode === "reset" && "Envoyer le mot de passe"}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Footer links */}
              {!(mode === "reset" && resetMutation.isSuccess) && (
                <div className="mt-8 pt-6 border-t border-jet/5 flex flex-col gap-3 text-center">
                  {mode === "login" ? (
                    <>
                      <button
                        onClick={() => handleModeSwitch("signup")}
                        className="text-sm text-jet/60 hover:text-jet transition-colors"
                      >
                        Nouveau ici ?{" "}
                        <span className="text-jet font-bold underline decoration-[#FFCA68] underline-offset-4">
                          Créer un compte
                        </span>
                      </button>
                      <button
                        onClick={() => handleModeSwitch("reset")}
                        className="text-xs text-jet/30 hover:text-jet transition-colors"
                      >
                        Mot de passe oublié ?
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleModeSwitch("login")}
                      className="text-sm text-jet/60 hover:text-jet transition-colors"
                    >
                      Déjà membre ?{" "}
                      <span className="text-jet font-bold underline decoration-[#FFCA68] underline-offset-4">
                        Se connecter
                      </span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}