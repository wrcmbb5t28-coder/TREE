"use client";

export default function PrintButton() {
  return <button className="btn btn-primary btn-sm" onClick={() => window.print()}>Save as PDF / Print</button>;
}
