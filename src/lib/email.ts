/**
 * Sends email through Resend when RESEND_API_KEY is set.
 * Without a key (local development) the message is printed to the server console.
 */
export async function sendEmail(to: string, subject: string, html: string, text: string): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`\n[email:dev] To: ${to}\nSubject: ${subject}\n${text}\n`);
    return { sent: false };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || "Treename <hello@treename.ai>", to, subject, html, text }),
  });
  if (!res.ok) {
    console.error("[email] Resend error", res.status, await res.text());
    return { sent: false };
  }
  return { sent: true };
}

export function emailLayout(title: string, body: string, cta?: { label: string; url: string }): string {
  return `<!doctype html><html><body style="margin:0;background:#F4F6F1;font-family:Helvetica,Arial,sans-serif;color:#1B2523">
<div style="max-width:520px;margin:0 auto;padding:32px 20px">
<p style="font-family:Georgia,serif;font-size:22px;margin:0 0 24px">Treename</p>
<div style="background:#fff;border-radius:16px;padding:28px">
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 12px">${title}</h1>
<div style="font-size:16px;line-height:1.55;color:#3c4744">${body}</div>
${cta ? `<p style="margin:24px 0 0"><a href="${cta.url}" style="display:inline-block;background:#1D5A4B;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold">${cta.label}</a></p>` : ""}
</div>
<p style="font-size:12px;color:#58645F;margin-top:20px">Treename · Family history, told by your family</p>
</div></body></html>`;
}
