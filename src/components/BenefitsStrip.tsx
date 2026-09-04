const items = [
  {
    title: "Гарантия качества",
    text: "Только проверенная продукция",
    icon: (
      <>
        <circle cx="12" cy="12" r="3.4" />
        <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Доставка по всей России",
    text: "Быстро и надежно",
    icon: (
      <path d="M2 6h11v9H2zM13 9h4.5L21 12.5V15h-8M6.5 18a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm10 0a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Безопасная оплата",
    text: "Удобные способы оплаты",
    icon: (
      <path d="M3 7h18v11H3zM3 10.5h18M7 14.5h4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Консультация специалиста",
    text: "Поможем с подбором материалов",
    icon: (
      <path d="M4 13a8 8 0 0 1 16 0M4 13v4a2 2 0 0 0 2 2h2v-6H4Zm16 0v4a2 2 0 0 1-2 2h-2v-6h4Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export default function BenefitsStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid divide-y divide-ink/8 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x ${className}`}
    >
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-4 px-6 py-5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="shrink-0 text-ink"
            aria-hidden
          >
            {item.icon}
          </svg>
          <div>
            <div className="text-[13px] font-bold text-ink">{item.title}</div>
            <div className="mt-0.5 text-[11px] text-moss">{item.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
