"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lora } from "next/font/google";
import { useResetPassword } from "@/hooks/useAccount";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], display: "swap" });

// 1. Move logic into a Content component
function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, isResetting, error, isSuccess } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    resetPassword({ token, password });
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-medium bg-red-50 px-6 py-3 rounded-xl border border-red-100">
          Lien de réinitialisation invalide ou manquant.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-[#EEEEF5] rounded-2xl p-8 sm:p-10 shadow-sm"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }}>
              <h1 className={`${lora.className} text-[28px] text-jet mb-2`}>
                Nouveau <em>mot de passe</em>
              </h1>
              <p className="text-jet/50 text-[14px] mb-8">
                Choisissez un mot de passe sécurisé pour votre compte.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-jet/40 mb-2 block">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-[#F7F7FA] border border-[#EEEEF5] rounded-xl px-5 py-3.5 text-[14px] outline-none focus:border-jet/20 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-jet/30 hover:text-jet transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg text-[12px]">
                    <AlertCircle size={14} />
                    <span>{(error as Error).message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isResetting || password.length < 8}
                  className="w-full bg-jet text-white py-4 rounded-xl text-[13px] font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isResetting ? <Loader2 size={18} className="animate-spin" /> : "Réinitialiser"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-500" />
              </div>
              <h2 className={`${lora.className} text-[26px] text-jet mb-3`}>
                C&apos;est <em>fait !</em>
              </h2>
              <p className="text-jet/50 text-[14px] mb-8">
                Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.
              </p>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-jet text-white py-4 rounded-xl text-[13px] font-bold tracking-widest uppercase hover:opacity-90 transition-all"
              >
                Se connecter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// 2. Main page shell with Suspense
export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-jet/20" />
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
      <Footer />
    </>
  );
}