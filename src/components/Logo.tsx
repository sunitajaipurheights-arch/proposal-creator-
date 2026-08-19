/** The Jaipur Heights logo mark. Swap /brand/jh-logo.png to change it everywhere. */
export function Logo({ size = 40, radius = 8, className }: { size?: number; radius?: number; className?: string }) {
  return (
    <img
      src="/brand/jh-logo.png"
      alt="Jaipur Heights"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, borderRadius: radius, display: 'block', objectFit: 'contain' }}
    />
  )
}
