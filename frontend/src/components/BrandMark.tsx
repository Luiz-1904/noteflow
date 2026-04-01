export function BrandMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="128" height="128" rx="32" fill="#151310" />
      <rect x="16" y="16" width="96" height="96" rx="24" fill="url(#brand-gradient)" />
      <path
        d="M38 40C38 35.5817 41.5817 32 46 32H82C86.4183 32 90 35.5817 90 40V88C90 92.4183 86.4183 96 82 96H46C41.5817 96 38 92.4183 38 88V40Z"
        fill="#161513"
      />
      <path d="M50 50H78" stroke="#F5EEE1" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 64H78" stroke="#F5EEE1" strokeWidth="6" strokeLinecap="round" opacity="0.82" />
      <path d="M50 78H67" stroke="#F5EEE1" strokeWidth="6" strokeLinecap="round" opacity="0.58" />
      <path
        d="M84 34V62C84 73.0457 75.0457 82 64 82H38"
        stroke="#FFB547"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="brand-gradient" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB547" />
          <stop offset="1" stopColor="#D6782D" />
        </linearGradient>
      </defs>
    </svg>
  );
}
