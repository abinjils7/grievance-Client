export default function SubmittedIllustration() {
  return (
    <div className="mx-auto mt-4 flex h-48 w-full max-w-xs items-center justify-center sm:h-52">
      <svg
        viewBox="0 0 320 210"
        role="img"
        aria-label="An envelope being delivered to a public service mailbox"
        className="h-full w-full"
      >
        <ellipse cx="160" cy="187" rx="93" ry="10" fill="#edf2f7" />
        <path d="M155 132h10v47h-10z" fill="#64748b" />
        <path d="M143 177h34l12 8h-58z" fill="#94a3b8" />
        <path d="M102 91c0-22 18-40 40-40h36c22 0 40 18 40 40v67H102z" fill="#0b69a5" />
        <path d="M114 92c0-15 12-27 27-27h38c15 0 27 12 27 27v8h-92z" fill="#e9f3fb" />
        <path d="M111 95h98v8h-98z" fill="#082f65" />
        <path d="M120 116h80v31h-80z" fill="#fff" />
        <path d="M127 126h40m-40 8h26" stroke="#d5e0ec" strokeLinecap="round" strokeWidth="3" />
        <path
          d="M214 43h22l-5 13 15-7c5-2 10 0 12 4 2 4 0 8-4 10l-10 5 9 7c4 3 4 8 1 11-3 4-8 4-11 1l-11-8 1 8c0 5-3 8-7 8s-7-3-8-7l-3-15-10 5c-4 2-9 0-10-4-2-4 0-8 4-10l16-8z"
          fill="#d99b79"
        />
        <path d="m224 43-11-1-8 10 13-4-6 11c-2 4 0 8 3 10 4 2 8 1 10-3l6-9" fill="#e6aa8b" />
        <g className="submitted-letter">
          <rect
            x="162"
            y="17"
            width="40"
            height="28"
            rx="3"
            fill="#fff"
            stroke="#b7c9dc"
            strokeWidth="2"
          />
          <path d="m164 20 18 13 18-13" fill="none" stroke="#0b69a5" strokeWidth="2" />
          <path d="M169 39h11m5 0h8" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="2" />
        </g>
        <path d="M73 72v18m-9-9h18" stroke="#f3bf4d" strokeLinecap="round" strokeWidth="3" />
        <circle cx="250" cy="139" r="3" fill="#f3bf4d" />
        <circle cx="79" cy="134" r="2.5" fill="#52a7ce" />
      </svg>
    </div>
  );
}
