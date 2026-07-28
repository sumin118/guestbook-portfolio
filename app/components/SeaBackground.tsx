function Gull({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 40 16"
      className={`h-3 w-7 ${className ?? ""}`}
      style={style}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 12 Q10 1 19 10 Q28 1 39 12"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SeaBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAF6FF] via-[#8ECBFF] to-[#1990FF]" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-[#1990FF] to-[#0B5FC7]" />

      <svg
        className="absolute inset-x-0 bottom-[60%] h-10 w-full"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 20 Q25 5 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20 V40 H0 Z"
          fill="white"
          opacity="0.25"
        />
      </svg>

      <Gull
        className="absolute left-[12%] top-[12%]"
        style={{ animation: "fly-a 22s ease-in-out infinite" }}
      />
      <Gull
        className="absolute left-[58%] top-[8%]"
        style={{ animation: "fly-b 27s ease-in-out infinite" }}
      />
      <Gull
        className="absolute left-[30%] top-[20%]"
        style={{ animation: "fly-c 18s ease-in-out infinite" }}
      />
      <Gull
        className="absolute left-[78%] top-[16%]"
        style={{ animation: "fly-a 24s ease-in-out infinite reverse" }}
      />
    </div>
  );
}
