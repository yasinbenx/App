import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Hand, BellRing } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../components/ui/Button';

const SLIDES = [
  {
    icon: BookOpen,
    title: 'Der Qur’an in Ruhe lesen',
    description: 'Arabischer Text, deutsche Übersetzung und Transliteration übersichtlich an einem Ort.',
  },
  {
    icon: Hand,
    title: 'Duas für jeden Moment',
    description: 'Bittgebete für Alltag, Reisen und Sorgen – geordnet nach Themen und jederzeit griffbereit.',
  },
  {
    icon: BellRing,
    title: 'Tägliche Erinnerungen',
    description: 'Verse, Hadithe und Duas, die dich sanft durch Morgen, Nachmittag und Abend begleiten.',
  },
];

export function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
    <div className="flex h-full flex-col bg-sand-100 px-7 pb-10 pt-14">
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="tap-highlight-none text-[13.5px] font-medium text-ink-400"
        >
          Überspringen
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[30px] bg-dome-50 text-dome-600">
              <Icon size={38} strokeWidth={1.6} />
            </div>
            <h1 className="font-display max-w-[260px] text-[23px] font-semibold leading-snug text-ink-900">
              {slide.title}
            </h1>
            <p className="mt-3 max-w-[270px] text-[14.5px] leading-relaxed text-ink-500">{slide.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-8 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={clsx(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-6 bg-dome-500' : 'w-1.5 bg-dome-200',
            )}
          />
        ))}
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => (isLast ? navigate('/home') : setIndex((i) => i + 1))}
      >
        {isLast ? 'Los geht’s' : 'Weiter'}
      </Button>
    </div>
  );
}
