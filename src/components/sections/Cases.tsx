import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { PulsingImage } from '@/components/motion/PulsingImage';
import { revealItemVariants } from '@/components/motion/variants';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import { landing, type Case } from '@/content/landing';

function CaseImage({ caseItem }: { caseItem: Case }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(6,182,212,0.35) 0%, transparent 70%)',
        }}
      />
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-bg-surface/60 backdrop-blur-sm">
        <div
          aria-hidden
          className="absolute inset-0 bg-grid-pattern opacity-50"
        />
        <PulsingImage
          src={caseItem.image}
          alt={caseItem.imageAlt}
          width={1280}
          height={720}
          className="relative h-full w-full object-contain p-8"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

function CaseCard({ caseItem, index }: { caseItem: Case; index: number }) {
  const reverse = index % 2 === 1;

  return (
    <motion.article
      variants={revealItemVariants}
      className={cn(
        'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
      )}
    >
      <div className={cn(reverse && 'lg:order-2')}>
        <CaseImage caseItem={caseItem} />
      </div>

      <div className={cn('flex flex-col gap-5', reverse && 'lg:order-1')}>
        <p className="text-small font-semibold uppercase tracking-[0.2em] text-accent-secondary">
          {caseItem.client}
        </p>
        <h3 className="font-display text-h2 font-bold text-text-primary">
          {caseItem.title}
        </h3>
        <p className="text-body leading-relaxed text-text-secondary">
          {caseItem.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {caseItem.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function Cases() {
  const { cases } = landing;

  return (
    <section
      id="cases"
      className="scroll-mt-20 border-t border-border/40 py-24 md:py-32"
    >
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-small font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Кейсы
          </p>
          <h2 className="mt-3 font-display text-h1 font-bold text-text-primary">
            {cases.title}
          </h2>
          <p className="mt-4 text-body text-text-secondary">{cases.lead}</p>
        </FadeIn>

        <ScrollReveal
          className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28"
          staggerChildren={0.12}
        >
          {cases.items.map((caseItem, index) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} index={index} />
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
