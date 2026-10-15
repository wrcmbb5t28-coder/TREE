// Heirloom drawings: engraved monoline style, viewBox 0 0 200 200, colour via currentColor.
const g = (body) => `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
const hatch = (x1, x2, y1, y2, step = 4, slant = 6) => {
  let d = "";
  for (let x = x1; x <= x2; x += step) d += `M${x} ${y1} L${x + slant} ${y2} `;
  return `<path d="${d}" stroke-width=".7" opacity=".55"/>`;
};
const vhatch = (x1, x2, y1, y2, step = 3.2) => {
  let d = "";
  for (let x = x1; x <= x2; x += step) d += `M${x} ${y1} V${y2} `;
  return `<path d="${d}" stroke-width=".6" opacity=".45"/>`;
};

export const objects = {
  lamp: g(`
    <ellipse cx="100" cy="22" rx="9" ry="9"/>
    <path d="M100 31 V40"/>
    <path d="M80 40 H120 L124 52 H76 Z"/>
    <path d="M76 52 H124 V60 H76 Z"/>
    ${vhatch(78, 122, 53, 59)}
    <path d="M80 60 V118 M120 60 V118 M93 60 V118 M107 60 V118"/>
    <path d="M86 62 C86 80 86 98 86 116 M114 62 C114 80 114 98 114 116" stroke-width=".8" opacity=".6"/>
    ${(() => { let d = ""; for (let y = 64; y < 100; y += 3) d += `M84 ${y} H116 `; return `<path d="${d}" stroke-width=".5" opacity=".5"/>`; })()}
    <path d="M78 100 H122"/>
    <path d="M82 102 H118 V118 H82 Z" stroke-width="1.1"/>
    <path d="M90 104 L96 116 M104 104 L110 116" stroke-width=".6" opacity=".6"/>
    <path d="M98 108 C96 112 104 112 102 108 C101 104 100 103 100 101 C99 104 98 105 98 108 Z" stroke-width="1"/>
    <path d="M100 103 L101.5 105.5" stroke-width=".6" opacity=".7"/>
    <path d="M72 118 H128 L132 128 H68 Z"/>
    <path d="M68 128 H132 V160 C132 168 120 172 100 172 C80 172 68 168 68 160 Z"/>
    ${hatch(70, 128, 132, 166, 4, 3)}
    <path d="M68 138 H132 M68 150 H132" stroke-width="1"/>
    <path d="M132 142 C140 142 142 148 138 152" />
  `),

  cup: g(`
    <path d="M52 70 H148 C148 118 130 148 100 148 C70 148 52 118 52 70 Z"/>
    <ellipse cx="100" cy="70" rx="48" ry="8"/>
    <path d="M70 70 l4 4 l3 -3" stroke-width="1.2"/>
    <path d="M147 84 C170 80 174 108 140 116"/>
    <path d="M146 92 C160 90 160 104 142 108" stroke-width="1"/>
    <path d="M78 148 C82 156 118 156 122 148"/>
    <ellipse cx="100" cy="160" rx="56" ry="9"/>
    <ellipse cx="100" cy="158" rx="30" ry="4" stroke-width=".8" opacity=".6"/>
    <path d="M75 100 C80 92 88 96 92 100 C96 104 102 104 104 98 C106 92 114 92 118 98 L124 94 L121 102 C126 104 126 110 120 110 C114 110 112 114 108 118 L104 116 L104 122 L99 118 C96 122 90 122 88 116 C84 118 78 118 76 112 C72 112 70 106 75 100 Z" stroke-width="1.2"/>
    <path d="M118 98 l3 -6 l2 5" stroke-width="1"/>
    <circle cx="116" cy="101" r=".9" fill="currentColor"/>
    <path d="M84 104 l3 3 M90 106 l3 3 M96 108 l3 3 M102 108 l3 3" stroke-width=".7" opacity=".7"/>
    <path d="M128 86 L134 102 L131 110" stroke-width=".8" opacity=".8"/>
    ${hatch(58, 140, 120, 142, 4.5, -5)}
  `),

  gramophone: g(`
    <path d="M40 120 H130 V160 H40 Z"/>
    <path d="M40 120 L56 108 H146 L130 120 M146 108 V148 L130 160"/>
    ${hatch(132, 144, 112, 156, 4, 0)}
    <path d="M48 128 H122 V152 H48 Z" stroke-width=".9" opacity=".7"/>
    <ellipse cx="88" cy="112" rx="36" ry="6"/>
    <ellipse cx="88" cy="111" rx="8" ry="1.6" stroke-width=".8"/>
    <path d="M30 140 H40 M30 136 V144 M24 140 C24 132 30 132 30 136" stroke-width="1.3"/>
    <path d="M124 108 V96 C124 88 116 84 108 86 L96 108"/>
    <circle cx="95" cy="109" r="2"/>
    <path d="M124 96 C130 70 140 60 150 52"/>
    <path d="M150 52 C140 30 150 14 176 10 C186 26 190 44 186 60 C176 64 160 62 150 52 Z"/>
    <path d="M150 52 C158 42 170 30 176 10 M150 52 C162 46 176 38 184 30 M150 52 C164 54 176 56 186 60" stroke-width=".9" opacity=".7"/>
    <path d="M44 160 V168 M126 160 V168" stroke-width="2"/>
  `),

  soldier: g(`
    <path d="M86 30 H114 V58 H86 Z"/>
    ${vhatch(88, 112, 32, 56, 3)}
    <path d="M82 58 H118"/>
    <path d="M96 30 L100 22 L104 30" stroke-width="1.1"/>
    <circle cx="100" cy="68" r="10"/>
    <path d="M96 66 h.1 M104 66 h.1" stroke-width="2.2"/>
    <path d="M97 72 C99 73.5 101 73.5 103 72" stroke-width=".9"/>
    <path d="M86 80 H114 L118 124 H82 Z"/>
    <path d="M100 80 V124 M86 92 H114" stroke-width=".9"/>
    <path d="M96 86 h.1 M96 98 h.1 M96 110 h.1 M104 86 h.1 M104 98 h.1 M104 110 h.1" stroke-width="2"/>
    <path d="M86 82 C76 90 74 104 78 116 M114 82 C124 88 128 98 128 106"/>
    <ellipse cx="132" cy="108" rx="13" ry="4.5"/>
    <path d="M119 108 V126 C119 131 145 131 145 126 V108"/>
    <path d="M119 110 L132 127 L145 110 M126 129 L132 118 L139 129" stroke-width=".8" opacity=".75"/>
    <path d="M124 102 L112 90 M140 103 L150 90" stroke-width="1.3"/>
    <path d="M88 124 V164 H98 V124 M102 124 V164 H112 V124"/>
    ${vhatch(89, 97, 126, 162, 2.6)} ${vhatch(103, 111, 126, 162, 2.6)}
    <path d="M70 164 H130 V172 H70 Z"/>
  `),

  letters: g(`
    <path d="M44 70 L150 52 L164 128 L58 146 Z"/>
    <path d="M44 70 L106 104 L150 52" stroke-width="1.1"/>
    <path d="M36 84 H146 V160 H36 Z" fill="var(--paper)"/>
    ${(() => { let d = ""; for (let x = 38; x < 144; x += 10) d += `M${x} 86 l5 -0 l-3 6 l-5 0 Z `; return `<path d="${d}" stroke-width=".6"/>`; })()}
    ${(() => { let d = ""; for (let x = 38; x < 144; x += 10) d += `M${x} 152 l5 0 l-3 6 l-5 0 Z `; return `<path d="${d}" stroke-width=".6"/>`; })()}
    <path d="M120 96 H138 V116 H120 Z" stroke-width="1"/>
    <path d="M123 99 H135 V113 H123 Z" stroke-width=".6" opacity=".7"/>
    <path d="M110 112 C116 104 124 120 132 110 C138 104 144 116 148 108" stroke-width=".8" opacity=".8"/>
    <path d="M50 112 C58 110 66 114 74 112 M50 122 H98 M50 130 H90 M50 138 H84" stroke-width="1"/>
    <path d="M48 100 C54 98 58 102 64 100" stroke-width="1.2"/>
  `),

  phone: g(`
    <rect x="70" y="30" width="60" height="120" rx="10"/>
    <rect x="75" y="40" width="50" height="98" rx="3" stroke-width=".9"/>
    <path d="M94 34 H106" stroke-width="1.2"/>
    <circle cx="100" cy="144" r="2.2" stroke-width=".9"/>
    ${(() => { const hs = [6, 12, 20, 9, 26, 16, 30, 12, 22, 8, 14, 5]; return hs.map((h, i) => `<path d="M${80 + i * 3.6} ${89 - h / 2} V${89 + h / 2}" stroke-width="1.6"/>`).join(""); })()}
    <path d="M82 118 H118" stroke-width=".8" opacity=".6"/>
    <circle cx="96" cy="118" r="2" fill="currentColor"/>
    <path d="M44 72 C38 82 38 96 44 106 M34 64 C24 80 24 98 34 114" stroke-width="1.2" opacity=".7"/>
    <path d="M156 72 C162 82 162 96 156 106 M166 64 C176 80 176 98 166 114" stroke-width="1.2" opacity=".7"/>
  `),

  book: g(`
    <path d="M100 60 C80 50 54 50 34 56 V146 C54 140 80 140 100 150 C120 140 146 140 166 146 V56 C146 50 120 50 100 60 Z"/>
    <path d="M100 60 V150"/>
    <path d="M44 72 C58 68 74 68 90 72 M44 84 C58 80 74 80 90 84 M44 96 C58 92 74 92 90 96 M44 108 C58 104 74 104 90 108 M44 120 C58 116 70 116 80 118" stroke-width=".8" opacity=".7"/>
    <path d="M110 72 C126 68 142 68 156 72 M110 84 C126 80 142 80 156 84 M110 96 C126 92 142 92 156 96" stroke-width=".8" opacity=".7"/>
    <path d="M118 108 L150 130 M130 106 L150 120" stroke-width=".8" opacity=".5"/>
    <path d="M150 40 L120 116 L116 124 L124 118 L154 42 Z" stroke-width="1.2"/>
  `),

  guitar: g(`
    <path d="M100 18 V100" stroke-width="5"/>
    <path d="M100 18 V100" stroke="var(--paper)" stroke-width="2.4"/>
    <path d="M92 10 H108 V24 H92 Z"/>
    <path d="M90 13 h-5 M90 20 h-5 M110 13 h5 M110 20 h5" stroke-width="2"/>
    <path d="M100 96 C86 92 70 96 70 112 C70 124 82 126 80 136 C78 148 66 152 70 166 C76 184 124 184 130 166 C134 152 122 148 120 136 C118 126 130 124 130 112 C130 96 114 92 100 96 Z"/>
    <path d="M90 128 H110 V160 H90 Z" stroke-width="1"/>
    <path d="M94 168 H106" stroke-width="2.2"/>
    <path d="M97 24 V166 M103 24 V166" stroke-width=".5" opacity=".7"/>
    <circle cx="120" cy="152" r="2"/> <circle cx="122" cy="160" r="2"/>
  `),
};
