import Image from 'next/image'

type RommanaLogoProps = {
  size?: number
  className?: string
}

export function RommanaLogo({
  size = 32,
  className = '',
}: RommanaLogoProps) {
  return (
    <Image
      src="/rommana-logo.jpg"
      alt="Rommana Cafe logo"
      width={40}
      height={40}
      className={className}
      priority
    />
  )
}