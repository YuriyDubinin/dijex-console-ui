import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Orb = {
  id: string;
  color: string;
  size: number;
  initial: { x: string; y: string };
  keyframes: { x: string[]; y: string[] };
  duration: number;
  blur: number;
  opacity: number;
};

const ORBS: Orb[] = [
  {
    id: 'orb-1',
    color: '#6366F1',
    size: 600,
    initial: { x: '-10%', y: '-20%' },
    keyframes: { x: ['-10%', '15%', '-5%', '-10%'], y: ['-20%', '5%', '25%', '-20%'] },
    duration: 22,
    blur: 120,
    opacity: 0.18,
  },
  {
    id: 'orb-2',
    color: '#06B6D4',
    size: 500,
    initial: { x: '60%', y: '10%' },
    keyframes: { x: ['60%', '40%', '70%', '60%'], y: ['10%', '40%', '-5%', '10%'] },
    duration: 18,
    blur: 100,
    opacity: 0.15,
  },
  {
    id: 'orb-3',
    color: '#8B5CF6',
    size: 400,
    initial: { x: '20%', y: '60%' },
    keyframes: { x: ['20%', '50%', '10%', '20%'], y: ['60%', '30%', '70%', '60%'] },
    duration: 26,
    blur: 90,
    opacity: 0.12,
  },
  {
    id: 'orb-4',
    color: '#6366F1',
    size: 300,
    initial: { x: '80%', y: '70%' },
    keyframes: { x: ['80%', '65%', '85%', '80%'], y: ['70%', '50%', '80%', '70%'] },
    duration: 20,
    blur: 80,
    opacity: 0.1,
  },
];

export function HeroBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Radial mesh gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 50%)',
            'radial-gradient(ellipse 50% 60% at 10% 70%, rgba(139,92,246,0.07) 0%, transparent 50%)',
          ].join(', '),
        }}
      />

      {/* Floating orbs */}
      {ORBS.map((orb) =>
        prefersReducedMotion ? (
          <div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.initial.x,
              top: orb.initial.y,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ) : (
          <motion.div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              left: 0,
              top: 0,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
              x: orb.initial.x,
              y: orb.initial.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{ x: orb.keyframes.x, y: orb.keyframes.y }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ),
      )}

      {/* SVG dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle top-edge glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 30%, rgba(6,182,212,0.4) 70%, transparent 100%)',
        }}
      />
    </div>
  );
}
