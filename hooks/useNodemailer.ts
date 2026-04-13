export async function requestPasswordReset(email: string) {
  const res = await fetch("/api/auth/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur lors de la réinitialisation");
  return data;
}