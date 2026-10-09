"use client";

export default function PrintButton({ label = "Save as PDF / Print" }: { label?: string }) {
  return <button className="btn btn-primary btn-sm" onClick={() => window.print()}>{label}</button>;
}
