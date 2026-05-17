import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  image: string;
  bg: string;
  tag: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: '/images/Aziz1.jpeg',
    bg: 'from-brand-dark via-brand-green to-brand-lime',
    tag: 'ABC Agroalimentaire',
    title: 'Une vision, une marque',
    subtitle: 'Aziz Ndiaye, fondateur d\'ABC, place la qualité J\'adore au cœur de chaque foyer sénégalais.',
  },
  {
    id: 2,
    image: '/images/Huile.jpg',
    bg: 'from-yellow-900 via-amber-700 to-brand-gold',
    tag: "Huile J'adore",
    title: 'L\'huile qui fait la différence',
    subtitle: 'Pure, naturelle et saine — la référence des cuisines au Sénégal.',
  },
  {
    id: 3,
    image: '/images/Riz.jpg',
    bg: 'from-amber-900 via-amber-700 to-yellow-600',
    tag: "Riz J'adore",
    title: 'Le riz premium au Sénégal',
    subtitle: 'Chaque grain est sélectionné avec soin pour votre table.',
  },
  {
    id: 4,
    image: '/images/Aziz2.jpeg',
    bg: 'from-brand-dark via-emerald-800 to-brand-green',
    tag: 'Gestion Moderne',
    title: 'Pilotez votre activité',
    subtitle: 'Un système centralisé pour contrôler stocks, ventes et traçabilité en temps réel.',
  },
];

const INTERVAL = 4500;

export function AuthLogin() {
  const [current, setCurrent] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];
  const hasImage = !imageErrors[slide.id];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Gradient de fond (fallback ou overlay) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${slide.id}`}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {/* Image */}
      <AnimatePresence mode="wait">
        {hasImage && (
          <motion.div
            key={`img-${slide.id}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImageErrors((prev) => ({ ...prev, [slide.id]: true }))}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu */}
      <div className="relative h-full flex flex-col justify-between p-10">
        {/* Espace top vide — logo retiré */}
        <div />

        {/* Texte slide */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 mb-3">
                {slide.tag}
              </span>
              <h2 className="text-white text-3xl font-bold leading-tight mb-2">
                {slide.title}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Indicateurs de progression */}
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === current ? 32 : 8 }}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full" />
                {i === current && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                    key={`progress-${current}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
