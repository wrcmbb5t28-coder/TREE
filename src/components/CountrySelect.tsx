import { countryName, type Lang } from "@/i18n/config";

/** All ISO 3166-1 alpha-2 codes (current countries and territories). */
const ALL = ("AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CD CF CG CH CI CK CL CM CN CO CR CU CV CW CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW").split(" ");
/** Shown first: where Treename families most often come from. */
const TOP = ["CH", "DE", "AT", "IT", "FR", "ES", "PT", "RU", "UA", "BY", "KZ", "PL", "GB", "US"];

/** Country picker: frequent countries first, then all countries A–Z in the interface language. */
export default function CountrySelect({ lang, id, name = "country", defaultValue = "", emptyLabel = "—" }: {
  lang: Lang; id: string; name?: string; defaultValue?: string | null; emptyLabel?: string;
}) {
  const coll = new Intl.Collator(lang);
  const rest = ALL.filter((c) => !TOP.includes(c)).map((c) => [c, countryName(c, lang)] as const).sort((a, b) => coll.compare(a[1], b[1]));
  return (
    <select id={id} name={name} defaultValue={defaultValue ?? ""}>
      <option value="">{emptyLabel}</option>
      <optgroup label="★">
        {TOP.map((c) => <option key={c} value={c}>{countryName(c, lang)}</option>)}
      </optgroup>
      <optgroup label="A–Z">
        {rest.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
      </optgroup>
    </select>
  );
}
