import { useId } from "react";
import type { CSSProperties } from "react";
import type { Faction } from "../domain/types";

export function Creature({
  faction,
  stage = 2,
  mood = "idle",
  className = "",
}: {
  faction: Faction;
  stage?: number;
  mood?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`creature ${faction} stage-${stage} mood-${mood} ${className}`}
      viewBox="0 0 420 360"
      role="img"
      aria-label={`${faction === "fly" ? "Neuro Fly" : "GPT-6 Astra"}, evolution stage ${stage + 1}`}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2=".9" y2="1">
          <stop stopColor={faction === "fly" ? "#c6ff93" : "#d6d0ff"} />
          <stop
            offset=".6"
            stopColor={faction === "fly" ? "#78c77d" : "#9185cc"}
          />
          <stop
            offset="1"
            stopColor={faction === "fly" ? "#35654f" : "#484262"}
          />
        </linearGradient>
        <linearGradient id={`${id}-brain`} x2=".9" y2="1">
          <stop stopColor="#ffb1c4" />
          <stop offset="1" stopColor="#be648f" />
        </linearGradient>
        <linearGradient id={`${id}-screen`} x2="1" y2="1">
          <stop stopColor="#152b2a" />
          <stop offset="1" stopColor="#092120" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop
            stopColor={faction === "fly" ? "#a6edb5" : "#bab0ff"}
            stopOpacity=".4"
          />
          <stop
            offset="1"
            stopColor={faction === "fly" ? "#a6edb5" : "#bab0ff"}
            stopOpacity="0"
          />
        </radialGradient>
      </defs>
      <ellipse
        cx="214"
        cy="318"
        rx="126"
        ry="21"
        fill={`url(#${id}-glow)`}
        className="creature-shadow"
      />
      {faction === "fly" ? (
        <g className="creature-float">
          {stage >= 3 && (
            <g className="fly-orbit" stroke="#8fe2a8" fill="none" opacity=".55">
              <ellipse
                cx="204"
                cy="194"
                rx="172"
                ry="112"
                strokeDasharray="4 11"
              />
              <circle cx="44" cy="160" r="9" fill="#a3e4ac" />
              <circle cx="361" cy="225" r="6" fill="#a3e4ac" />
            </g>
          )}
          <g
            className="fly-wing left-wing"
            fill="#d9fff1"
            fillOpacity=".57"
            stroke="#b8ead6"
            strokeWidth="2"
          >
            <path d="M169 205C110 199 30 113 53 74C78 48 151 107 178 183Z" />
            <path
              d="M173 190L67 90M170 186L107 83M165 184L62 131"
              fill="none"
              opacity=".5"
            />
          </g>
          <g
            className="fly-wing right-wing"
            fill="#e0fff2"
            fillOpacity=".63"
            stroke="#b8ead6"
            strokeWidth="2"
          >
            <path d="M234 191C255 99 328 51 353 83C377 131 289 192 242 214Z" />
            <path
              d="M243 197L340 93M249 185L299 89M257 193L347 136"
              fill="none"
              opacity=".5"
            />
          </g>
          <g
            className="fly-legs"
            fill="none"
            stroke="#284436"
            strokeWidth="10"
            strokeLinecap="round"
          >
            <path d="M154 231L113 254L91 244M160 261L136 292L109 290M201 279L194 310L174 316M241 270L269 296L287 287M262 236L301 258L322 242" />
          </g>
          <path
            d="M150 183C124 219 130 266 175 285C224 306 277 273 280 231C282 198 253 170 214 166Z"
            fill={`url(#${id}-body)`}
            stroke="#2b493b"
            strokeWidth="4"
          />
          <path
            d="M165 247Q204 267 257 240M170 266Q215 281 249 261"
            fill="none"
            stroke="#457559"
            strokeWidth="5"
          />
          <g className="fly-head">
            <path
              d="M133 151Q119 181 146 213Q189 241 252 207Q288 178 271 140Q254 97 209 99Q153 93 133 151"
              fill={`url(#${id}-body)`}
              stroke="#2b493b"
              strokeWidth="4"
            />
            {stage >= 1 && (
              <g className="brain-pulse">
                <path
                  d="M155 127C140 109 152 91 170 91C168 73 190 65 205 75C217 54 242 63 245 81C266 78 282 98 269 114C282 132 261 147 243 137C232 151 211 143 207 131C189 146 168 144 155 127Z"
                  fill={`url(#${id}-brain)`}
                  stroke="#713f58"
                  strokeWidth="3"
                />
                <path
                  d="M174 98Q194 95 185 117M209 78Q198 102 217 116M244 86Q228 104 248 115M207 129L211 117"
                  fill="none"
                  stroke="#9e5476"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            )}
            <g className="eyeballs" stroke="#354234" strokeWidth="3">
              <ellipse
                cx="166"
                cy="166"
                rx="32"
                ry="39"
                fill="#f2f0d1"
                transform="rotate(-13 166 166)"
              />
              <ellipse
                cx="234"
                cy="165"
                rx="30"
                ry="34"
                fill="#f2f0d1"
                transform="rotate(15 234 165)"
              />
            </g>
            <g className="pupils" fill="#23362c">
              <ellipse cx="178" cy="176" rx="10" ry="14" />
              <ellipse cx="229" cy="171" rx="10" ry="12" />
              <circle cx="181" cy="170" r="3" fill="white" />
              <circle cx="232" cy="167" r="3" fill="white" />
            </g>
            <path
              d="M189 207Q210 220 233 204"
              fill="none"
              stroke="#263a2d"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M209 212L211 224L222 220L220 209"
              fill="#efe9c4"
              stroke="#354234"
              strokeWidth="2"
            />
            <path
              d="M145 127L127 104M264 135L290 116"
              stroke="#426349"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {stage >= 2 && (
              <g>
                <rect
                  x="115"
                  y="178"
                  width="16"
                  height="28"
                  rx="5"
                  fill="#172c29"
                  transform="rotate(-20 115 178)"
                />
                <path
                  d="M121 199Q84 200 97 239L136 240"
                  fill="none"
                  stroke="#76e6c5"
                  strokeWidth="4"
                />
                <circle cx="98" cy="227" r="5" fill="#b7ffd7" />
              </g>
            )}
            {stage >= 4 && (
              <path
                d="M171 75L156 39L189 52L208 20L228 47L257 32L250 77Z"
                fill="#edd38d"
                stroke="#9b8853"
                strokeWidth="3"
              />
            )}
          </g>
          {stage >= 3 && (
            <g className="fly-pack">
              <rect
                x="253"
                y="212"
                width="28"
                height="49"
                rx="9"
                fill="#364452"
                stroke="#151e24"
                strokeWidth="3"
              />
              <rect
                x="260"
                y="220"
                width="14"
                height="23"
                rx="3"
                fill="#b3ef9c"
              />
              <path d="M265 254L267 267" stroke="#c9ffbe" strokeWidth="3" />
            </g>
          )}
        </g>
      ) : (
        <g className="creature-float astra-float">
          {stage >= 3 && (
            <g
              className="astra-orbit"
              fill="none"
              stroke="#bcb0ef"
              strokeWidth="2"
            >
              <ellipse
                cx="211"
                cy="176"
                rx="154"
                ry="102"
                transform="rotate(-24 211 176)"
                strokeDasharray="6 12"
              />
              {[0, 1, 2].map((i) => (
                <rect
                  key={i}
                  x={48 + i * 143}
                  y={i === 1 ? 57 : 204}
                  width="23"
                  height="28"
                  rx="5"
                  fill="#8f86b6"
                  transform={`rotate(${i * 14 - 14} ${60 + i * 143} 219)`}
                />
              ))}
            </g>
          )}
          <g className="astra-cable">
            <path
              d="M216 253C220 291 271 265 266 307Q260 330 291 319"
              fill="none"
              stroke="#8d829f"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <rect
              x="284"
              y="303"
              width="24"
              height="27"
              rx="5"
              fill="#bcb6d6"
              transform="rotate(25 297 317)"
            />
            <path
              d="M300 310L312 293M306 314L317 298"
              stroke="#d1cde0"
              strokeWidth="4"
            />
          </g>
          <path
            d="M111 94L277 75L322 111L312 236L270 269L108 244Z"
            fill="#54495f"
            stroke="#292430"
            strokeWidth="4"
          />
          <path d="M279 75L321 111L310 235L266 253Z" fill="#817394" />
          <path
            d="M111 94L277 75L267 251L103 234Z"
            fill={`url(#${id}-body)`}
            stroke="#a49bb7"
            strokeWidth="3"
          />
          <path
            d="M126 110L256 98L246 206L119 200Z"
            fill="#403b4b"
            stroke="#d0c5df"
            strokeWidth="3"
          />
          <path
            d="M137 121L246 111L238 194L130 189Z"
            fill={`url(#${id}-screen)`}
          />
          <g className="screen-lines" stroke="#a4f5c4" opacity=".075">
            {Array.from({ length: 11 }, (_, i) => (
              <path key={i} d={`M133 ${124 + i * 6}L240 ${117 + i * 6}`} />
            ))}
          </g>
          <g className="astra-face" fill="#b0edc4">
            <path d="M149 142L173 140L171 150L148 152ZM205 137L229 135L227 145L204 147Z" />
            <path d="M160 169L171 168L171 175L194 174L194 167L205 166L203 182L161 184Z" />
            <rect x="137" y="178" width="8" height="3" opacity=".55" />
          </g>
          <g stroke="#5d526f" strokeWidth="3">
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M132 ${213 + i * 4}L174 ${216 + i * 4}`} />
            ))}
          </g>
          <circle
            className="monitor-led"
            cx="239"
            cy="226"
            r="4"
            fill="#c5ffa9"
          />
          <g stroke="#413748" strokeWidth="3">
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M285 ${142 + i * 9}L306 ${127 + i * 9}`} />
            ))}
          </g>
          {stage >= 1 && (
            <g className="antenna">
              <path
                d="M210 84L207 50L183 35"
                fill="none"
                stroke="#b0a6c0"
                strokeWidth="5"
              />
              <circle cx="179" cy="32" r="9" fill="#d4a8e8" />
              <circle cx="177" cy="29" r="3" fill="#f8e3ff" />
            </g>
          )}
          {stage >= 2 && (
            <g className="astra-hands">
              <path
                d="M105 188Q70 175 74 218M310 172Q339 171 344 208"
                fill="none"
                stroke="#64596f"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M62 213L88 210L95 236L69 244L57 230Z"
                fill="#b6abc9"
                stroke="#52475c"
                strokeWidth="3"
              />
              <path
                d="M333 204L356 203L366 227L344 240L330 226Z"
                fill="#b6abc9"
                stroke="#52475c"
                strokeWidth="3"
              />
            </g>
          )}
          {stage >= 4 && (
            <g
              className="astra-halo"
              fill="none"
              stroke="#ddcb97"
              strokeWidth="5"
            >
              <ellipse
                cx="213"
                cy="31"
                rx="71"
                ry="17"
                transform="rotate(-7 213 31)"
              />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

export function Blob({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const colors = [
    "#b7e5b7",
    "#baaee9",
    "#e9a7b4",
    "#e9c18d",
    "#91c9d4",
    "#d3d886",
  ];
  return (
    <svg
      className={`blob ${className}`}
      style={
        { "--blob-color": colors[variant % colors.length] } as CSSProperties
      }
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d={
          variant % 2
            ? "M17 70Q7 48 24 40Q19 14 42 22Q65 7 75 34Q94 41 86 66Q97 85 70 84Q48 94 30 83Q10 92 17 70"
            : "M14 66Q6 40 29 31Q29 10 49 23Q74 7 79 37Q99 49 83 69Q85 92 63 83Q44 95 29 80Q9 85 14 66"
        }
        fill="var(--blob-color)"
      />
      <ellipse cx="39" cy="48" rx="9" ry="12" fill="#f1f1dd" />
      <ellipse cx="61" cy="47" rx="8" ry="11" fill="#f1f1dd" />
      <g className="blob-eyes" fill="#242b2c">
        <ellipse cx="42" cy="50" rx="3.5" ry="5" />
        <ellipse cx="58" cy="49" rx="3.5" ry="5" />
      </g>
      <path
        d={variant % 3 ? "M43 69Q50 73 58 65" : "M43 70L57 68"}
        fill="none"
        stroke="#394039"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {variant % 2 === 0 && (
        <path
          d="M26 32L19 21M77 35L83 26"
          stroke="#638267"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
