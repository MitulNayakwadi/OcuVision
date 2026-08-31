import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

/** Element ids are derived from `layoutGroup` so a consumer rendering its own
 *  panels can reference them — see `tabId` / `panelId`. */
export const tabId = (layoutGroup: string, id: string) => `${layoutGroup}-tab-${id}`;
export const panelId = (layoutGroup: string, id: string) => `${layoutGroup}-panel-${id}`;

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  /** Unique per tablist instance — keeps the sliding indicator from teleporting. */
  layoutGroup: string;
  label: string;
  className?: string;
  size?: 'sm' | 'md';
  scrollable?: boolean;
}

/**
 * WAI-ARIA tablist. Arrow keys move between tabs, Home/End jump to the ends,
 * and the active pill is a shared-layout element so it slides rather than cuts.
 */
export function Tabs({
  items,
  active,
  onChange,
  layoutGroup,
  label,
  className,
  size = 'md',
  scrollable = false,
}: TabsProps) {
  const baseId = layoutGroup;
  const reduced = useReducedMotionSafe();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusTab = (id: string) => {
    onChange(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = items.findIndex((t) => t.id === active);
    if (i < 0) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusTab(items[(i + 1) % items.length].id);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusTab(items[(i - 1 + items.length) % items.length].id);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(items[0].id);
        break;
      case 'End':
        event.preventDefault();
        focusTab(items[items.length - 1].id);
        break;
      default:
    }
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'flex items-center gap-2',
        scrollable && 'no-scrollbar mask-fade-r overflow-x-auto pr-8 md:mask-none md:overflow-visible md:pr-0',
        className,
      )}
    >
      {items.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative shrink-0 rounded-chip font-medium transition-colors duration-200 ease-clinical',
              size === 'sm' ? 'h-9 px-4 text-[13px]' : 'h-11 px-5 text-sm',
              selected ? 'text-canvas' : 'text-slate-cool hover:text-charcoal',
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${layoutGroup}-indicator`}
                aria-hidden="true"
                className="absolute inset-0 rounded-chip bg-charcoal"
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }
                }
              />
            )}
            {!selected && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-chip border border-white bg-white/60"
              />
            )}
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Panel counterpart. Pass `layoutGroup` and the tab's own id; the ARIA wiring is
 * then derived identically on both sides.
 */
export function TabPanel({
  layoutGroup,
  id,
  active,
  children,
  className,
}: {
  layoutGroup: string;
  id: string;
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (!active) return null;
  return (
    <div
      role="tabpanel"
      id={panelId(layoutGroup, id)}
      aria-labelledby={tabId(layoutGroup, id)}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}
