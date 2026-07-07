import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <path
        d="M6 30C6 15.088 17.64 3 32 3s26 12.088 26 27"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect x="2" y="27" width="11" height="18" rx="4" stroke="currentColor" strokeWidth="3.2" />
      <rect x="51" y="27" width="11" height="18" rx="4" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="23" cy="37" r="2.4" fill="currentColor" />
      <circle cx="32" cy="37" r="2.4" fill="currentColor" />
      <circle cx="41" cy="37" r="2.4" fill="currentColor" />
      <path
        d="M20 45c3 4.5 8 6.8 12 6.8s9-2.3 12-6.8"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
