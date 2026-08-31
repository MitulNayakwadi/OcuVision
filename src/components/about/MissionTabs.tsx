import { useState } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { PillButton } from '@/components/ui/PillButton';
import { FadeIn } from '@/components/ui/Reveal';
import { ArrowUpRight, Check, Compass, EyeScan, Flask, Users } from '@/components/ui/Icons';
import { MISSION_TABS, RESEARCH_STACK, TEAM } from '@/lib/content';
import { ROADMAP } from '@/lib/glaucoma';
import type { TeamMember } from '@/types';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

const LAYOUT_GROUP = 'mission';

/** Icons are decorative reinforcement; the tab label carries the meaning. */
const KEYS = [
  { id: 'mission', Icon: Compass, aside: 'What we are trying to remove' },
  { id: 'vision', Icon: EyeScan, aside: 'Where this has to end up' },
  { id: 'team', Icon: Users, aside: 'Who is accountable for what' },
  { id: 'research', Icon: Flask, aside: 'How the model is trained' },
] as const;

/**
 * Mission, Vision, Team and Research on one panel.
 *
 * Each tab's prose comes from a single source; what differs is the artefact under
 * it — the roadmap for Vision, profile cards for Team, the fine-tuning stack for
 * Research. Mission has none on purpose: a claim about intent should not arrive
 * dressed up as evidence.
 */
export function MissionTabs() {
  const [active, setActive] = useState<string>(KEYS[0].id);
  const [profile, setProfile] = useState<TeamMember | null>(null);
  const reduced = useReducedMotionSafe();

  return (
    <Section id="mission">
      <SectionHeader
        eyebrow="Position"
        title="Mission, Vision, Team, Research"
        titleId="mission-title"
        body="Four views of the same commitment — the problem being removed, the endpoint being aimed at, the people accountable for it, and the method that has to hold for any of it to mean anything."
      />

      <FadeIn className="mt-12">
        <Tabs
          items={KEYS.map(({ id }) => ({ id, label: MISSION_TABS[id].title }))}
          active={active}
          onChange={setActive}
          layoutGroup={LAYOUT_GROUP}
          label="Mission, vision, team and research"
        />
      </FadeIn>

      <div className="mt-9">
        {KEYS.map(({ id, Icon, aside }) => (
          <TabPanel key={id} layoutGroup={LAYOUT_GROUP} id={id} active={active === id}>
            <motion.div
              key={id}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard radius="panel" className="p-7 lg:p-10">
                <div className="grid gap-9 lg:grid-cols-[15rem_1fr] lg:gap-card-gap">
                  <div className="flex flex-col gap-5">
                    <span
                      aria-hidden="true"
                      className="grid h-14 w-14 place-items-center rounded-full bg-chrome text-charcoal shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]"
                    >
                      <Icon className="h-6 w-6" />
                    </span>

                    <p className="font-display text-[clamp(1.2rem,2.4vw,1.6rem)] uppercase leading-tight text-charcoal">
                      {MISSION_TABS[id].title}
                    </p>

                    <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-copper">
                      {aside}
                    </p>

                    <span aria-hidden="true" className="h-px w-16 bg-slate-hair lg:w-full" />
                  </div>

                  <div>
                    <div className="space-y-5">
                      {MISSION_TABS[id].body.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 32)}
                          className="max-w-prose text-[15px] leading-relaxed text-slate-warm first:text-[16px] first:text-charcoal/85"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {id === 'vision' && <RoadmapChips />}
                    {id === 'team' && <TeamCards onOpen={setProfile} />}
                    {id === 'research' && <ResearchStack />}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </TabPanel>
        ))}
      </div>

      <Modal
        open={profile !== null}
        onClose={() => setProfile(null)}
        title={profile?.name ?? ''}
        eyebrow={profile?.role}
        footer={
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-cool">
            Focus · {profile?.focus}
          </p>
        }
      >
        {profile && (
          <div className="space-y-7">
            <p className="max-w-prose text-sm leading-relaxed text-slate-warm">{profile.bio}</p>

            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
                Responsibilities
              </p>
              <ul className="mt-4 space-y-2.5">
                {profile.responsibilities.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-card bg-white/60 px-4 py-3 text-[13.5px] leading-snug text-charcoal"
                  >
                    <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-vitality-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}

/** The roadmap, as flat chips — an order of intent, not a feature list. */
function RoadmapChips() {
  return (
    <div className="mt-8 border-t border-slate-hair pt-7">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
        Roadmap — none of these are detected in this version
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {ROADMAP.map((condition) => (
          <li
            key={condition.id}
            className="inline-flex items-center gap-2 rounded-chip border border-dashed border-slate-hair bg-white/45 px-3 py-1.5 text-[12px] text-slate-warm"
          >
            {condition.name}
            <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-copper">
              v2+
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The two profile cards, each opening the shared dialog. */
function TeamCards({ onOpen }: { onOpen: (member: TeamMember) => void }) {
  return (
    <ul className="mt-8 grid gap-5 border-t border-slate-hair pt-7 sm:grid-cols-2">
      {TEAM.map((member) => (
        <li key={member.id}>
          <GlassCard
            as="article"
            variant="well"
            radius="card"
            className="flex h-full flex-col p-5"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-chrome font-display text-[14px] text-charcoal shadow-[inset_0_1px_3px_rgba(255,255,255,0.9)]"
              >
                {member.initials}
              </span>

              <div className="min-w-0">
                <h3 className="font-display text-[14px] uppercase leading-tight text-charcoal">
                  {member.name}
                </h3>
                <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-vitality-ink">
                  {member.role}
                </p>
              </div>
            </div>

            <p className="mt-4 flex-1 text-[12.5px] leading-relaxed text-slate-warm">
              {member.focus}
            </p>

            <div className="mt-5">
              <PillButton
                variant="outline"
                size="sm"
                onClick={() => onOpen(member)}
                iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
              >
                Full remit
              </PillButton>
            </div>
          </GlassCard>
        </li>
      ))}
    </ul>
  );
}

/** The fine-tuning stack, each package with the job it actually does. */
function ResearchStack() {
  return (
    <div className="mt-8 border-t border-slate-hair pt-7">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-cool">
        Fine-tuning stack
      </p>
      <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {RESEARCH_STACK.map((pkg) => (
          <div key={pkg.name} className="border-b border-slate-hair pb-3 last:border-b-0">
            <dt className="font-mono text-[11.5px] text-charcoal">{pkg.name}</dt>
            <dd className="mt-1 text-[12px] leading-snug text-slate-cool">{pkg.role}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
