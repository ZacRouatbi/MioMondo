"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Please try a different email.");
      }
    } catch {
      setStatus("error");
      setMessage("Service unavailable. Try again later.");
    }
  };

  return (
    <section className="bg-[#202C39] py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#FFCA68] uppercase text-[11px] font-bold tracking-[0.3em] mb-6">
          ✦ Mio Mondo Club
        </p>
        
        <h2 className="text-white text-4xl md:text-5xl font-light mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Design inspiration, <br className="hidden md:block" /> delivered.
        </h2>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="text-[#FFCA68]" size={40} strokeWidth={1} />
            <p className="text-white text-xl font-light">Please check your inbox to confirm.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 max-w-lg mx-auto relative">
            <div className="flex flex-col md:flex-row gap-0 rounded-xl overflow-hidden shadow-2xl">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-white outline-none focus:bg-white/10 transition-all"
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#FFCA68] text-[#202C39] px-8 py-4 font-bold uppercase text-[12px] tracking-widest hover:bg-[#ffd980] transition-colors disabled:opacity-50"
              >
                {status === "loading" ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Join Us"}
              </button>
            </div>
            {status === "error" && (
              <p className="absolute -bottom-8 left-0 text-red-400 text-sm">{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}