"use client";
import { useState, useEffect } from "react";
import Section from "./Section";
import { useAccount } from "@/hooks/useAccount";

export default function InfoTab({ customerId }: { customerId: number }) {
  const { info, changePassword } = useAccount(customerId);

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", address_1: "", city: "",
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [success, setSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (info.data) {
      setForm({
        first_name: info.data.first_name ?? "",
        last_name: info.data.last_name ?? "",
        email: info.data.email ?? "",
        phone: info.data.billing?.phone ?? "",
        address_1: info.data.billing?.address_1 ?? "",
        city: info.data.billing?.city ?? "",
      });
    }
  }, [info.data]);

  const handleSave = () => {
    info.update(form, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
    });
  };

  const handlePassword = () => {
    setPwError("");
    if (pwForm.next !== pwForm.confirm) { setPwError("Les mots de passe ne correspondent pas."); return; }
    if (pwForm.next.length < 8) { setPwError("Minimum 8 caractères."); return; }

    changePassword.changePassword(
      { current: pwForm.current, next: pwForm.next },
      {
        onSuccess: () => setPwForm({ current: "", next: "", confirm: "" }),
        onError: (err: any) => setPwError(err.message || "Erreur lors du changement."),
      }
    );
  };

  if (info.isLoading) {
    return <div className="p-10 text-center text-neutral-400 text-[14px]">Chargement…</div>;
  }

  const inputClass =
    "w-full p-[10px_14px] rounded-xl border border-[#E6E6FA] bg-[#FAFAFA] text-[14px] text-jet outline-none transition-all focus:border-[#FFCA68] focus:ring-4 focus:ring-[#FFCA68]/15";
  const labelClass = "text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5 block";

  return (
    <div className="flex flex-col gap-5">
      <Section title="Identité">
        {/* Name row — stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          <div>
            <label className={labelClass}>Prénom</label>
            <input className={inputClass} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Nom</label>
            <input className={inputClass} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
        </div>

        <div className="mt-3 sm:mt-3.5">
          <label className={labelClass}>Adresse e-mail</label>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>

        <div className="mt-3 sm:mt-3.5">
          <label className={labelClass}>Téléphone</label>
          <input type="tel" className={inputClass} placeholder="+216 XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        {/* Address + city — stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3 sm:gap-3.5 mt-3 sm:mt-3.5">
          <div>
            <label className={labelClass}>Adresse</label>
            <input className={inputClass} value={form.address_1} onChange={(e) => setForm({ ...form, address_1: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Ville</label>
            <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
        </div>

        <div className="mt-4 sm:mt-[18px] flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSave}
            disabled={info.isUpdating}
            className={`px-6 py-2.5 rounded-full bg-jet text-white text-[13px] font-semibold cursor-pointer transition-opacity ${info.isUpdating ? "opacity-60 cursor-not-allowed" : "opacity-100"}`}
          >
            {info.isUpdating ? "Enregistrement…" : "Enregistrer"}
          </button>
          {success && <span className="text-[13px] text-[#1A6B3C] font-medium">✓ Modifications sauvegardées</span>}
        </div>
      </Section>

      <Section title="Mot de passe">
        <div className="flex flex-col gap-3">
          <div>
            <label className={labelClass}>Mot de passe actuel</label>
            <input type="password" className={inputClass} value={pwForm.current} onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} autoComplete="current-password" />
          </div>
          <div>
            <label className={labelClass}>Nouveau mot de passe</label>
            <input type="password" className={inputClass} value={pwForm.next} onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })} autoComplete="new-password" />
          </div>
          <div>
            <label className={labelClass}>Confirmer le nouveau mot de passe</label>
            <input type="password" className={inputClass} value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} autoComplete="new-password" />
          </div>

          {(pwError || changePassword.error) && (
            <p className="text-[13px] text-[#9B2626] m-0">
              {pwError || (changePassword.error as Error)?.message}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handlePassword}
              disabled={changePassword.isChanging}
              className="px-6 py-2.5 rounded-full border border-[#E6E6FA] bg-white text-jet text-[13px] font-semibold cursor-pointer hover:bg-neutral-50 disabled:opacity-50"
            >
              {changePassword.isChanging ? "Mise à jour..." : "Changer le mot de passe"}
            </button>
            {changePassword.isSuccess && <span className="text-[13px] text-[#1A6B3C] font-medium">✓ Mot de passe mis à jour</span>}
          </div>
        </div>
      </Section>
    </div>
  );
}