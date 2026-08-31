import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** OcuVision mark: an iris ring crossed by the retinal-signal waveform. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#1A1C1C" />
      <path
        d="M8 21.5c3.2 0 4.4-6.4 7.2-6.4s3.4 10 6.4 10 3.6-8.6 6-8.6c1.6 0 2.2 2.4 4.4 2.4"
        fill="none"
        stroke="#F9F9F8"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Bolt(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props} fill="currentColor" stroke="none">
      <path d="M13.4 2 5 13.2h5.2L9.8 22 18.4 10.6h-5.3z" />
    </svg>
  );
}

export function Upload(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function EyeScan(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 8V6a2 2 0 0 1 2-2h2M21 8V6a2 2 0 0 0-2-2h-2M3 16v2a2 2 0 0 0 2 2h2M21 16v2a2 2 0 0 1-2 2h-2" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M5.5 12c1.9-3 4.1-4.5 6.5-4.5s4.6 1.5 6.5 4.5c-1.9 3-4.1 4.5-6.5 4.5S7.4 15 5.5 12Z" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

export function AlertTriangle(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 4.5 2.8 20h18.4L12 4.5Z" />
      <path d="M12 10v4.5M12 17.4v.2" />
    </svg>
  );
}

export function Siren(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 18v-5a6 6 0 0 1 12 0v5" />
      <path d="M4 18h16v2.5H4zM12 3.5V2M4.6 6.2 3.5 5.1M19.4 6.2l1.1-1.1" />
    </svg>
  );
}

export function Shield(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3l7.5 2.7v5.6c0 4.6-3.1 8.2-7.5 9.7-4.4-1.5-7.5-5.1-7.5-9.7V5.7L12 3Z" />
      <path d="m8.8 12.2 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function Layers(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3 3 7.6l9 4.6 9-4.6L12 3Z" />
      <path d="m3 12.4 9 4.6 9-4.6M3 16.8l9 4.6 9-4.6" />
    </svg>
  );
}

export function Grid(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 4h6.4v6.4H4zM13.6 4H20v6.4h-6.4zM4 13.6h6.4V20H4zM13.6 13.6H20V20h-6.4z" />
    </svg>
  );
}

export function Activity(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 12.5h3.6l2.2-6 3.2 12 2.6-8 1.8 4h4.6" />
    </svg>
  );
}

export function Target(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Users(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="9.5" cy="8.5" r="3.4" />
      <path d="M3.5 20c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4" />
      <path d="M16.5 5.6a3.4 3.4 0 0 1 0 6.6M18 14.9c1.7.7 2.9 2.2 2.9 4.3" />
    </svg>
  );
}

export function Flask(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M9.5 3h5v5.2l4.3 8.3A2.5 2.5 0 0 1 16.6 20H7.4a2.5 2.5 0 0 1-2.2-3.5l4.3-8.3V3Z" />
      <path d="M7.2 14.4h9.6" />
    </svg>
  );
}

export function Compass(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.9 9.1-1.6 4.2-4.2 1.6 1.6-4.2 4.2-1.6Z" />
    </svg>
  );
}

export function Database(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <ellipse cx="12" cy="6.2" rx="7.5" ry="3.2" />
      <path d="M4.5 6.2v11.6c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2V6.2" />
      <path d="M4.5 12c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  );
}

export function Table(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 5h16v14H4zM4 10h16M4 14.5h16M10.5 10v9" />
    </svg>
  );
}

export function Copy(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M9 9h9.5v11H9zM6 15H4.5V4H14v1.5" />
    </svg>
  );
}
