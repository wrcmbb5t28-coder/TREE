"use client";

import Link from "next/link";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="empty stack" style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: "1.5rem" }}>That didn’t work</h2>
      <p>{error.message && !error.message.includes("digest") ? error.message : "Something went wrong. Please try again."}</p>
      <div className="row" style={{ justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={reset}>Try again</button>
        <Link className="btn btn-ghost" href="/app">Back to home</Link>
      </div>
    </div>
  );
}
