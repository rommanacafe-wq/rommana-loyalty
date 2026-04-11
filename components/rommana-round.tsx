import Image from 'next/image'

type RommanaLogoProps = {
  size?: number
  variant?: 'circle' | 'square' | 'bare'
  className?: string
}

export function RommanaRound({
  size = 40,
  variant = 'circle',
  className = '',
}: RommanaLogoProps) {
  // Image itself
  const logo = (
    <Image
      src="/rommana-round.jpg"
      alt="Rommana Cafe Round"
      width={size}
      height={size}
      className="object-contain"
      priority
    />
  )

  // Variants for different use cases
  if (variant === 'bare') {
    return logo
  }

  if (variant === 'square') {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-white p-2 shadow-sm ${className}`}
        style={{ width: size + 16, height: size + 16 }}
      >
        {logo}
      </div>
    )
  }

  // default = circle
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-white p-2 shadow-sm ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      {logo}
    </div>
  )
}