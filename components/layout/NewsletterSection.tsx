"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Please enter a valid email address."); return; }
    setError("");
    setSubmitted(true);
  };

  return (
    <section className="bg-jet text-center" style={{ padding: "clamp(4rem, 8vw, 8rem) 0" }}>
      <div className="inner flex flex-col items-center">

        <p
          className="text-gold uppercase mb-5"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em" }}
        >
          ✦ Stay Inspired
        </p>

        <h2
          className="text-snow leading-[1.1] mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4vw, 4rem)",
            fontWeight: 300,
          }}
        >
          Join the Mio Mondo<br />community
        </h2>

        <p
          className="text-snow opacity-50 leading-[1.7] mb-10"
          style={{ fontSize: "clamp(14px,1.1vw,17px)", maxWidth: "42ch" }}
        >
          New collections, décor tips, and exclusive offers — straight to your inbox.
        </p>

        {submitted ? (
          <p
            className="text-gold"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,1.8vw,26px)" }}
          >
            ✓ You&rsquo;re in! Welcome to Mio Mondo.
          </p>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex w-full max-w-[520px] rounded-lg overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,.25)]"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                required
                className="flex-1 px-6 py-4 bg-white/10 border border-white/15 border-r-0 text-snow placeholder:text-snow/40 outline-none focus:border-gold transition-colors duration-200 text-[14px] rounded-l-lg"
                style={{ fontFamily: "var(--font-body)" }}
              />
              <button
                type="submit"
                className="bg-gold text-jet px-8 py-4 text-[12px] font-bold tracking-[.1em] uppercase transition-colors duration-200 hover:bg-[#ffd980] whitespace-nowrap border-0 cursor-pointer rounded-r-lg"
              >
                Subscribe
              </button>
            </form>
            {error && <p className="text-red-400 text-[13px] mt-3">{error}</p>}
          </>
        )}
      </div>
    </section>
  );
}
