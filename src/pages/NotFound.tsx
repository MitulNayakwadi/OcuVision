import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillLink } from '@/components/ui/PillButton';
import { FadeIn } from '@/components/ui/Reveal';
import { ArrowRight, EyeScan } from '@/components/ui/Icons';

const ROUTES = [
  {
    to: '/',
    label: 'Overview',
    body: 'The model, the nine classes it separates, and the imaging it reads.',
  },
  {
    to: '/screen',
    label: 'Screening console',
    body: 'Submit a fundus image and get a graded class with an attention map.',
  },
  {
    to: '/about',
    label: 'The research',
    body: 'The inference path stage by stage, the evaluation figures, and the team.',
  },
];

export function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="Error 404"
        title="NOTHING HERE"
        titleLines={['NOTHING', 'HERE']}
        headingId="notfound-title"
        body="That address does not resolve to a page. Nothing has been lost — the site is three routes deep, and all three are below."
      />

      <Section className="!pt-0">
        <FadeIn>
          <ul className="grid gap-card-gap sm:grid-cols-3">
            {ROUTES.map((route) => (
              <li key={route.to}>
                <GlassCard radius="panel" className="flex h-full flex-col p-7">
                  <p className="font-display text-[15px] uppercase leading-tight text-charcoal">
                    {route.label}
                  </p>
                  <p className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-warm">
                    {route.body}
                  </p>
                  <PillLink
                    to={route.to}
                    variant="outline"
                    size="sm"
                    className="mt-6 self-start"
                    iconRight={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    Go
                  </PillLink>
                </GlassCard>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-card-gap">
          <PillLink to="/screen" variant="primary" size="lg" iconRight={<EyeScan className="h-4 w-4" />}>
            Screen an image instead
          </PillLink>
        </FadeIn>
      </Section>
    </>
  );
}
