"use client";

export function StepIndicator({ step }: { step: number }) {
  const steps = ["Livraison", "Paiement", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all duration-300 ${
                done ? "bg-jet border-jet text-white" :
                active ? "bg-[#FFCA68] border-[#FFCA68] text-jet" :
                "bg-white border-[#E6E6FA] text-neutral-300"
              }`}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                ) : idx}
              </div>
              <span className={`text-[10px] font-semibold tracking-wider uppercase hidden sm:block ${active ? "text-jet" : done ? "text-neutral-500" : "text-neutral-300"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-2 mb-4 transition-colors duration-300 ${done ? "bg-jet" : "bg-[#E6E6FA]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
