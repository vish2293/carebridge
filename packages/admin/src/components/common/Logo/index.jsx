// Arch-bridge mark (amber span, white person, teal deck) + wordmark. tone="light" for dark backgrounds.
const Logo = ({ tone = "dark", size = 32, mark = true }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10, lineHeight: 1 }}>
    {mark && (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#0F3D3A" />
        <path d="M8 29Q20 7 32 29" stroke="#F2B632" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="20" cy="22.5" r="3" fill="#fff" />
        <path d="M7 30.5H33" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )}
    <span style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, fontSize: size * 0.62, letterSpacing: "-0.03em", color: tone === "light" ? "#fff" : "#0F3D3A" }}>
      care<span style={{ color: tone === "light" ? "#5EEAD4" : "#0F766E" }}>bridge</span>
    </span>
  </span>
);
export default Logo;
