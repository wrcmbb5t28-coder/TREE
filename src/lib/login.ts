import { db } from "./db";
import { appUrl, token } from "./util";
import { sendEmail, emailLayout } from "./email";

/**
 * Creates a one-time sign-in link and emails it.
 * Returns the link itself only in development without email configured,
 * so the flow can be tested locally. Never in production.
 */
export async function sendLoginLink(opts: {
  email: string;
  draftFamilyId?: string;
  inviteToken?: string;
  next?: string;
}): Promise<{ devLink?: string }> {
  const t = token(24);
  await db.loginToken.create({
    data: {
      token: t,
      email: opts.email.toLowerCase(),
      draftFamilyId: opts.draftFamilyId,
      inviteToken: opts.inviteToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
  const next = opts.next && opts.next.startsWith("/app") ? `&next=${encodeURIComponent(opts.next)}` : "";
  const link = appUrl(`/api/auth/verify?token=${t}${next}`);
  const { sent } = await sendEmail(
    opts.email,
    "Your Treename sign-in link",
    emailLayout("Welcome to Treename", "Tap the button to open your family story. The link works once and expires in 24 hours.", { label: "Open my family story", url: link }),
    `Open your family story: ${link}\nThe link works once and expires in 24 hours.`
  );
  // SHOW_LOGIN_LINKS=1 is for staging/testing only, never set it in production.
  const dev = !sent && (process.env.NODE_ENV !== "production" || process.env.SHOW_LOGIN_LINKS === "1");
  return dev ? { devLink: link } : {};
}
