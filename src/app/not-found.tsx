import Link from "next/link";

export default function NotFound() {
  return (
    <main className="answer-page">
      <div className="answer-card card-elev stack">
        <p className="eyebrow">Treename</p>
        <h1 style={{ fontSize: "2rem" }}>This page doesn’t exist</h1>
        <p className="muted">The link may be old or mistyped.</p>
        <Link className="btn btn-primary" href="/">Go to Treename</Link>
      </div>
    </main>
  );
}
