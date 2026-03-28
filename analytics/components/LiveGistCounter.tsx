'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const LOCATIONS = ['Abuja', 'Lagos', 'Kano', 'Ibadan', 'Port Harcourt', 'Enugu', 'Kaduna'];
const CATEGORIES = ['Events', 'Food', 'Safety', 'Tips', 'News', 'Transit', 'Markets', 'Other'];
const CATEGORY_COLORS: Record<string, string> = {
  Events:  '#6366f1',
  Food:    '#fb923c',
  Safety:  '#ef4444',
  Tips:    '#22c55e',
  News:    '#3b82f6',
  Transit: '#a855f7',
  Markets: '#eab308',
  Other:   '#9ca3af',
};

interface RecentGist {
  id: string;
  location: string;
  category: string;
  timestamp: number;
  isNew: boolean;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeGist(): RecentGist {
  return {
    id: Math.random().toString(36).slice(2, 9),
    location: pick(LOCATIONS),
    category: pick(CATEGORIES),
    timestamp: Date.now(),
    isNew: true,
  };
}

/** Returns a human-readable elapsed string, updates every second. */
function useElapsed(timestamp: number): string {
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = Math.floor((Date.now() - timestamp) / 1000);
  if (elapsed < 5)  return 'Just now';
  if (elapsed < 60) return `${elapsed}s ago`;
  return `${Math.floor(elapsed / 60)}m ago`;
}

function GistRow({ gist }: { gist: RecentGist }) {
  const elapsed = useElapsed(gist.timestamp);
  const color = CATEGORY_COLORS[gist.category] ?? '#9ca3af';

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 8,
        marginBottom: 6,
        background: gist.isNew ? 'rgba(99,102,241,0.08)' : 'transparent',
        animation: gist.isNew ? 'gistSlideIn 0.35s ease' : undefined,
        transition: 'background 0.6s ease',
        listStyle: 'none',
      }}
    >
      {/* Colored category dot */}
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          animation: gist.isNew ? 'dotPulse 0.8s ease' : undefined,
        }}
      />

      {/* Category badge */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color,
          minWidth: 56,
        }}
      >
        {gist.category}
      </span>

      {/* Location */}
      <span style={{ fontSize: 13, flex: 1, color: '#374151' }}>
        {gist.location}
      </span>

      {/* Timestamp */}
      <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>
        {elapsed}
      </span>
    </li>
  );
}

/** Animates `displayCount` toward `target` over ~500 ms. */
function useCountAnimation(target: number): number {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = display;
    const diff = target - start;
    if (diff === 0) return;

    const duration = 500;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

const INITIAL_COUNT = 1_284;

export default function LiveGistCounter() {
  const [count, setCount] = useState(INITIAL_COUNT);
  const [gists, setGists] = useState<RecentGist[]>([]);
  const [flash, setFlash] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const displayCount = useCountAnimation(count);

  /** Fire 1–5 gists at a random interval (12 s – 60 s). */
  const scheduleNext = useCallback(() => {
    // 12 000 ms = 5/min, 60 000 ms = 1/min
    const delay = Math.floor(Math.random() * (60_000 - 12_000) + 12_000);

    const id = setTimeout(() => {
      const batch = Math.floor(Math.random() * 5) + 1;
      const newGists = Array.from({ length: batch }, makeGist);

      setCount((c) => c + batch);
      setGists((prev) => {
        const next = [...newGists, ...prev].slice(0, 5);
        return next;
      });

      // Flash the counter
      setFlash(true);
      setTimeout(() => setFlash(false), 600);

      // Pulse the live indicator
      setPulsing(true);
      setTimeout(() => setPulsing(false), 800);

      // Clear isNew flag after animation
      setTimeout(() => {
        setGists((prev) =>
          prev.map((g) => ({ ...g, isNew: false }))
        );
      }, 700);

      scheduleNext();
    }, delay);

    return id;
  }, []);

  useEffect(() => {
    // Seed with a couple of old gists so the list isn't empty on load
    const seed: RecentGist[] = [
      { ...makeGist(), timestamp: Date.now() - 43_000, isNew: false },
      { ...makeGist(), timestamp: Date.now() - 91_000, isNew: false },
    ];
    setGists(seed);

    const id = scheduleNext();
    return () => clearTimeout(id);
  }, [scheduleNext]);

  return (
    <>
      {/* Keyframe definitions */}
      <style>{`
        @keyframes flashBg {
          0%   { background: rgba(99,102,241,0.25); }
          100% { background: rgba(99,102,241,0.06); }
        }
        @keyframes dotPulse {
          0%   { transform: scale(1);   opacity: 1; }
          50%  { transform: scale(2.2); opacity: 0.6; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes gistSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes livePulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0.5; }
        }
        @keyframes countFlash {
          0%   { color: #6366f1; }
          100% { color: #111827; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 420,
          margin: '0 auto',
          fontFamily: 'inherit',
        }}
      >
        {/* Counter card */}
        <div
          style={{
            borderRadius: 16,
            padding: '28px 32px',
            background: flash ? undefined : 'rgba(99,102,241,0.06)',
            animation: flash ? 'flashBg 0.6s ease forwards' : undefined,
            border: '1px solid rgba(99,102,241,0.18)',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {/* Live indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                animation: pulsing ? 'livePulse 0.8s ease' : 'livePulse 2s ease infinite',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Live
            </span>
          </div>

          {/* The big number */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1,
              color: flash ? undefined : '#111827',
              animation: flash ? 'countFlash 0.6s ease forwards' : undefined,
              letterSpacing: '-0.03em',
              marginBottom: 6,
            }}
          >
            {displayCount.toLocaleString()}
          </div>

          <div style={{ fontSize: 14, color: '#6b7280' }}>
            total gists created
          </div>
        </div>

        {/* Recent gists list */}
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#9ca3af',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              marginBottom: 8,
              paddingLeft: 12,
            }}
          >
            Recent activity
          </div>
          <ul style={{ margin: 0, padding: 0 }}>
            {gists.map((g) => (
              <GistRow key={g.id} gist={g} />
            ))}
            {gists.length === 0 && (
              <li
                style={{
                  textAlign: 'center',
                  color: '#d1d5db',
                  fontSize: 13,
                  padding: 16,
                  listStyle: 'none',
                }}
              >
                Waiting for gists…
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
