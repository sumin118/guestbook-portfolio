export function Clothespin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 30"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 2 L7 20 Q7 26 12 26 Q17 26 17 20 L17 2"
        fill="#4FADFF"
        stroke="#1990FF"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="9" r="2.6" fill="white" stroke="#1990FF" strokeWidth="1.2" />
      <line
        x1="12"
        y1="2"
        x2="12"
        y2="26"
        stroke="#1990FF"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}
