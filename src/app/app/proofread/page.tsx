import { appContext } from "@/i18n/app";
import { fixT } from "@/i18n/app/fix";
import ProofreadAll from "@/components/ProofreadAll";
import { proofreadBatch } from "./actions";
import { undoFix } from "../actions";

export const maxDuration = 60;

export default async function Proofread() {
  const { lang } = await appContext();
  const f = fixT[lang];
  return (
    <div className="stack" style={{ maxWidth: 760, gap: 18 }}>
      <div className="page-head"><h1>{f.all.title}</h1></div>
      <p className="muted">{f.all.text}</p>
      <ProofreadAll labels={{ ...f.all, undo: f.undo, fields: f.fields }} run={proofreadBatch} undo={undoFix} />
    </div>
  );
}
