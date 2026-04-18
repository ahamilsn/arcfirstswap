interface VertexLogoProps {
  size?: number;
}

export function VertexLogo({ size = 28 }: VertexLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="air-stroke" x1="6" y1="6" x2="25" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F6E4C0" />
          <stop offset="0.52" stopColor="#F4C237" />
          <stop offset="1" stopColor="#D49F18" />
        </linearGradient>
      </defs>

      <rect x="1.5" y="1.5" width="29" height="29" rx="10.5" fill="rgb(var(--logo-bg) / 0.94)" />
      <rect x="1.5" y="1.5" width="29" height="29" rx="10.5" stroke="rgb(var(--arc-green) / 0.24)" />

      <path
        d="M9 24 15.5 8.4h1.1L23 24"
        stroke="url(#air-stroke)"
        strokeWidth="2.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8 17.8h6.3"
        stroke="url(#air-stroke)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="24.6" cy="9.1" r="1.8" fill="#F4C237" fillOpacity="0.92" />
    </svg>
  );
}
