import { T } from "@/components/i18n/t";

const ITEMS = [
  { ru: "шпаргалка для Middle+", en: "cheatsheet for Middle+" },
  { ru: "8 DevOps тем", en: "8 DevOps topics" },
  {
    ru: "аналогии → концепции → команды → квиз",
    en: "analogies → concepts → commands → quiz",
  },
  { ru: "личный конспект, лежит открыто", en: "personal notes, kept open" },
  { ru: "часть ninitux.com", en: "part of ninitux.com" },
];

export function Marquee() {
  // For a seamless `translateX(-50%)` loop, the "first half" of the track must
  // be at least viewport-wide — otherwise the right edge of the track scrolls
  // into view as empty space before the animation wraps.
  // With 5 unique short items the doubled track is only ~2430px wide
  // (half = 1215px), which leaves a gap on every viewport > 1215px.
  // Repeating ×6 instead of ×2 gives ~7300px total / 3650px half — covers up
  // to QHD (2560px) comfortably and only loses a sliver on 4K.
  const REPEAT = 6;
  const tracked = Array.from({ length: REPEAT }, () => ITEMS).flat();
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {tracked.map((item, idx) => (
          <span key={idx}>
            <span className="dot">●</span> <T ru={item.ru} en={item.en} />
          </span>
        ))}
      </div>
    </div>
  );
}
