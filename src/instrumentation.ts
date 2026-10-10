/** Saves server errors so they show up on the admin page (production hides the message from users). */
export async function onRequestError(err: unknown, request: { path: string; method: string }, context: { routePath?: string; routeType?: string }) {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const e = err as { message?: string; stack?: string; digest?: string };
    const { track } = await import("./lib/analytics");
    await track("server_error", {
      props: {
        path: request.path?.slice(0, 200), route: context.routePath, type: context.routeType, digest: e?.digest,
        message: String(e?.message ?? err).slice(0, 600), stack: String(e?.stack ?? "").split("\n").slice(0, 8).join("\n").slice(0, 1600),
      },
    });
  } catch { /* never throw from here */ }
}
