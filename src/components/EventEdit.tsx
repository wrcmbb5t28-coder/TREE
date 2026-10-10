import CountrySelect from "./CountrySelect";
import VoiceFill from "./VoiceFill";
import { updateEvent } from "@/app/app/actions";
import type { Lang } from "@/i18n/config";

type Ev = { id: string; year: number | null; description: string; place: string | null; country: string | null };
type L = { edit: string; save: string; year: string; what: string; place: string; country: string; whatShown: string; speak: string; listening: string };

/** "Edit" next to an event: a small form to fix the year, the text, the place or the country. */
export default function EventEdit({ e, lang, back, l }: { e: Ev; lang: Lang; back: string; l: L }) {
  const birth = e.description.endsWith(" is born"); // the text of a birth is written by the app, so only its date and place change
  return (
    <details className="ev-edit">
      <summary className="btn-link small muted">{l.edit}</summary>
      <form action={updateEvent.bind(null, e.id)} className="event-form ev-new ev-edit-form">
        <input type="hidden" name="back" value={back} />
        <div className="field"><label htmlFor={`ey-${e.id}`}>{l.year}</label><input id={`ey-${e.id}`} name="year" inputMode="numeric" defaultValue={e.year ?? ""} /></div>
        {birth ? <p className="small muted" style={{ alignSelf: "end", margin: 0 }}>{l.whatShown}</p>
          : <div className="field ev-what">
              <div className="voice-label"><label htmlFor={`ed-${e.id}`}>{l.what}</label><VoiceFill lang={lang} labels={{ speak: l.speak, listening: l.listening }} /></div>
              <textarea id={`ed-${e.id}`} name="description" required rows={3} defaultValue={e.description} />
            </div>}
        <div className="field"><label htmlFor={`ep-${e.id}`}>{l.place}</label><input id={`ep-${e.id}`} name="place" defaultValue={e.place ?? ""} /></div>
        <div className="field"><label htmlFor={`ec-${e.id}`}>{l.country}</label><CountrySelect lang={lang} id={`ec-${e.id}`} defaultValue={e.country} /></div>
        <button className="btn btn-primary btn-sm">{l.save}</button>
      </form>
    </details>
  );
}
