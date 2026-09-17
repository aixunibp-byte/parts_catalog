import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import engineImage from '../assets/hero-engine.jpg';
import { ENGINE_HOTSPOTS } from '../data/engineHotspots';

const TRANSITION_MS = 620;

export default function EngineExplorer() {
  const navigate = useNavigate();
  const frameRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const active = useMemo(
    () => ENGINE_HOTSPOTS.find((spot) => spot.id === activeId) || null,
    [activeId],
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setIsReducedMotion(media.matches);
    syncPreference();
    media.addEventListener('change', syncPreference);
    return () => media.removeEventListener('change', syncPreference);
  }, []);

  const handlePointerMove = useCallback((event) => {
    if (isReducedMotion || isTransitioning) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      setParallax({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
    });
  }, [isReducedMotion, isTransitioning]);

  const resetParallax = useCallback(() => {
    setActiveId(null);
    setParallax({ x: 0, y: 0 });
  }, []);

  const openCategory = useCallback((spot) => {
    if (isTransitioning) return;
    setActiveId(spot.id);

    if (isReducedMotion) {
      navigate(`/?search=${encodeURIComponent(spot.search)}`);
      return;
    }

    setIsTransitioning(true);
    window.setTimeout(() => {
      navigate(`/?search=${encodeURIComponent(spot.search)}`);
    }, TRANSITION_MS);
  }, [isReducedMotion, isTransitioning, navigate]);

  return (
    <Box
      component="section"
      aria-label="Интерактивная схема двигателя"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetParallax}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: { xs: 350, md: 560 },
        overflow: 'hidden',
        isolation: 'isolate',
        touchAction: 'pan-y',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 72% 45%, rgba(255,68,0,0.16), transparent 38%), linear-gradient(118deg, #080808 3%, #171717 58%, #080808 100%)'
            : 'radial-gradient(circle at 72% 45%, rgba(255,68,0,0.12), transparent 38%), linear-gradient(118deg, #F5F5F5 3%, #FFFFFF 58%, #ECECEC 100%)',
        }}
      />

      <Box
        component="img"
        src={engineImage}
        alt="Взрыв-схема автомобильного двигателя"
        draggable="false"
        sx={{
          position: 'absolute',
          inset: { xs: '11% -18% 4% -4%', md: '2% -12% -4% 11%' },
          width: { xs: '122%', md: '101%' },
          height: { xs: '91%', md: '106%' },
          objectFit: 'contain',
          objectPosition: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          filter: (theme) => theme.palette.mode === 'dark'
            ? 'invert(1) contrast(0.86) brightness(1.1)'
            : 'contrast(1.06)',
          opacity: activeId ? 0.58 : 0.94,
          transform: isReducedMotion
            ? 'scale(1)'
            : `translate3d(${parallax.x * 14}px, ${parallax.y * 10}px, 0) scale(${activeId ? 1.025 : 1})`,
          transition: 'opacity 220ms ease, transform 520ms cubic-bezier(.2,.75,.2,1), filter 220ms ease',
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(90deg, #090909 0%, rgba(9,9,9,0.88) 28%, rgba(9,9,9,0.1) 72%, rgba(9,9,9,0.2) 100%)'
            : 'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.92) 28%, rgba(255,255,255,0.05) 72%, rgba(255,255,255,0.35) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label="Выберите узел двигателя"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        {ENGINE_HOTSPOTS.map((spot) => {
          const isActive = activeId === spot.id;
          const isDimmed = activeId && !isActive;

          return (
            <g key={spot.id}>
              <path
                d={spot.path}
                tabIndex="0"
                role="button"
                aria-label={`${spot.title}: ${spot.subtitle}`}
                onPointerEnter={() => setActiveId(spot.id)}
                onFocus={() => setActiveId(spot.id)}
                onClick={() => openCategory(spot)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCategory(spot);
                  }
                }}
                fill={isActive ? 'rgba(255,68,0,0.18)' : 'transparent'}
                stroke={isActive ? '#FF4400' : 'transparent'}
                strokeWidth="0.45"
                style={{
                  cursor: 'pointer',
                  outline: 'none',
                  opacity: isDimmed ? 0.35 : 1,
                  transition: 'fill 180ms ease, stroke 180ms ease, opacity 180ms ease',
                }}
              />
              <line
                x1={spot.x}
                y1={spot.y}
                x2={spot.labelX}
                y2={spot.labelY}
                stroke={isActive ? '#FF4400' : 'rgba(255,255,255,0.55)'}
                strokeWidth={isActive ? '0.32' : '0.2'}
                strokeDasharray={isActive ? '0' : '1.1 0.9'}
                opacity={isDimmed ? 0.24 : 1}
                style={{ transition: 'stroke 180ms ease, opacity 180ms ease' }}
              />
              <circle cx={spot.x} cy={spot.y} r={isActive ? '1.25' : '0.84'} fill="#FF4400" opacity={isDimmed ? 0.35 : 1} />
              <circle
                cx={spot.x}
                cy={spot.y}
                r={isActive ? '2.15' : '1.52'}
                fill="none"
                stroke="#FF4400"
                strokeWidth="0.18"
                opacity={isDimmed ? 0.18 : isActive ? 1 : 0.58}
                className={isActive && !isReducedMotion ? 'engine-hotspot__pulse' : undefined}
              />
            </g>
          );
        })}
      </svg>

      {active && (
        <Box
          role="status"
          sx={{
            position: 'absolute',
            zIndex: 3,
            left: { xs: 18, md: `${Math.min(active.labelX + 2, 65)}%` },
            right: { xs: 18, md: 'auto' },
            bottom: { xs: 18, md: `${Math.max(7, 100 - active.labelY - 24)}%` },
            width: { xs: 'auto', md: 268 },
            p: 2.25,
            bgcolor: 'rgba(12,12,12,0.95)',
            color: '#FFFFFF',
            borderLeft: '3px solid #FF4400',
            boxShadow: '0 24px 70px rgba(0,0,0,0.34)',
            backdropFilter: 'blur(14px)',
            animation: isReducedMotion ? 'none' : 'engine-card-in 180ms ease-out both',
          }}
        >
          <Chip
            label="Узел двигателя"
            size="small"
            sx={{ mb: 1.25, bgcolor: '#FF4400', color: '#111111' }}
          />
          <Typography sx={{ fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.05, mb: 0.75 }}>
            {active.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', mb: 1.75 }}>
            {active.subtitle}
          </Typography>
          <Button
            variant="contained"
            onClick={() => openCategory(active)}
            sx={{ bgcolor: '#FFFFFF', color: '#111111', '&:hover': { bgcolor: '#FF4400' } }}
          >
            Найти запчасти
          </Button>
        </Box>
      )}

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          opacity: isTransitioning ? 1 : 0,
          bgcolor: '#FF4400',
          transform: isTransitioning ? 'scale(1)' : 'scale(0.01)',
          transformOrigin: active ? `${active.x}% ${active.y}%` : '50% 50%',
          transition: `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms cubic-bezier(.7,0,.2,1)`,
        }}
      />
    </Box>
  );
}
