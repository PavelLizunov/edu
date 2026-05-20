import { T } from "@/components/i18n/t";

const ITEMS = [
  { ru: "шпаргалка для Middle+", en: "cheatsheet for Middle+" },
  { ru: "8 DevOps тем", en: "8 DevOps topics" },
  {
    ru: "аналогии → концепции → команды → квиз",
    en: "analogies → concepts → commands → quiz",
  },
  { ru: "без воды, без маркетинга", en: "no water · no marketing" },
  { ru: "часть ninitux.com", en: "part of ninitux.com" },
];

export function Marquee() {
  // Duplicate items so the animation loops seamlessly at -50% translateX.
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {doubled.map((item, idx) => (
          <span key={idx}>
            <span className="dot">●</span> <T ru={item.ru} en={item.en} />
          </span>
        ))}
      </div>
    </div>
  );
}
