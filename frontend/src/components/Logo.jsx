export default function Logo({ height = 22, color = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 240 60"
      height={height}
      role="img"
      aria-label="Omegation"
      style={{ display: 'block' }}
    >
      <text
        x="0"
        y="44"
        fontFamily="Helvetica Neue, Arial, sans-serif"
        fontWeight="800"
        fontSize="42"
        letterSpacing="-1"
        fill={color}
        style={{ textTransform: 'uppercase' }}
      >
        Omegation
      </text>
    </svg>
  );
}
