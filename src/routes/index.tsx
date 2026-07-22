import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import venueImg from "@/assets/venue.jpg";
import lampImg from "@/assets/lamp.jpg";
import storyImg from "@/assets/story.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arjun & Ananya — A Kerala Wedding" },
      { name: "description", content: "A cinematic Kerala wedding: monsoon mornings, jasmine, kasavu and heritage. Join Arjun & Ananya." },
      { property: "og:title", content: "Arjun & Ananya — A Kerala Wedding" },
      { property: "og:description", content: "A cinematic Kerala wedding: monsoon mornings, jasmine, kasavu and heritage." },
    ],
  }),
  component: Index,
});

// ————————————————————————————————————————————————
// Config
// ————————————————————————————————————————————————
const WEDDING_DATE = new Date("2026-11-14T06:30:00+05:30");
const COUPLE = { one: "Arjun", two: "Ananya", malayalam: "അർജുൻ & അനന്യ" };

// ————————————————————————————————————————————————
// Jasmine petal SVG
// ————————————————————————————————————————————————
function Petal({ size = 18, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} style={style} aria-hidden>
      <g>
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="20" cy="12" rx="4.5" ry="8" fill="oklch(0.98 0.008 85)" opacity="0.95" transform={`rotate(${r} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="2" fill="oklch(0.85 0.11 85)" />
      </g>
    </svg>
  );
}

function PetalRain({ count = 14, duration = [10, 18] as [number, number], durationMs = 0 }: { count?: number; duration?: [number, number]; durationMs?: number }) {
  const [alive, setAlive] = useState(true);
  const petals = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 4,
      dur: duration[0] + Math.random() * (duration[1] - duration[0]),
      drift: (Math.random() - 0.5) * 200,
      size: 12 + Math.random() * 14,
      rotate: Math.random() * 360,
      key: i,
    })), [count, duration]);

  useEffect(() => {
    if (!durationMs) return;
    const t = setTimeout(() => setAlive(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  if (!alive) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {petals.map((p) => (
        <Petal
          key={p.key}
          size={p.size}
          className="petal absolute"
          style={{
            left: `${p.left}%`,
            top: "-5vh",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ["--drift" as any]: `${p.drift}px`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ————————————————————————————————————————————————
// Countdown
// ————————————————————————————————————————————————
function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = target.getTime() - now.getTime();
  const isToday = diff <= 0 || (target.toDateString() === now.toDateString());
  const total = Math.max(diff, 0);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total / 3600000) % 24);
  const minutes = Math.floor((total / 60000) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds, isToday };
}

function Countdown() {
  const { days, hours, minutes, seconds, isToday } = useCountdown(WEDDING_DATE);
  if (isToday) {
    return (
      <div className="text-center">
        <div className="relative inline-block">
          <div className="absolute inset-0 -m-16 animate-glow rounded-full bg-[radial-gradient(circle,oklch(0.78_0.14_82/0.5),transparent_70%)]" />
          <h2 className="relative font-serif text-5xl italic md:text-7xl gold-text">Today's the Day</h2>
        </div>
        <p className="mt-6 eyebrow">The lamps are lit · You are awaited</p>
      </div>
    );
  }
  const units = [
    { v: days, l: "Days" },
    { v: hours, l: "Hours" },
    { v: minutes, l: "Minutes" },
    { v: seconds, l: "Seconds" },
  ];
  return (
    <div className="grid grid-cols-4 gap-3 md:gap-8">
      {units.map((u) => (
        <div key={u.l} className="text-center">
          <div className="font-serif text-4xl tabular-nums text-charcoal md:text-7xl">
            {String(u.v).padStart(2, "0")}
          </div>
          <div className="mt-3 text-[0.6rem] uppercase tracking-[0.35em] text-wood md:text-xs">{u.l}</div>
        </div>
      ))}
    </div>
  );
}

// ————————————————————————————————————————————————
// Reveal on scroll
// ————————————————————————————————————————————————
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, seen } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(28px)",
        filter: seen ? "blur(0)" : "blur(6px)",
        transition: `opacity 1.2s ease ${delay}ms, transform 1.2s cubic-bezier(.22,.61,.36,1) ${delay}ms, filter 1.2s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ————————————————————————————————————————————————
// Music toggle (ambient tone; user brings own file if wanted)
// ————————————————————————————————————————————————
function MusicToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode }[]>([]);

  useEffect(() => () => {
    nodesRef.current.forEach(({ osc, lfo }) => { try { osc.stop(); lfo.stop(); } catch {} });
    ctxRef.current?.close();
  }, []);

  const toggle = () => {
    if (on) {
      nodesRef.current.forEach(({ gain }) => gain.gain.exponentialRampToValueAtTime(0.0001, (ctxRef.current!.currentTime + 1)));
      setTimeout(() => {
        nodesRef.current.forEach(({ osc, lfo }) => { try { osc.stop(); lfo.stop(); } catch {} });
        nodesRef.current = [];
      }, 1100);
      setOn(false);
      return;
    }
    const AC: typeof AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    // Soft flute-like drone chord: A, E, C#
    const freqs = [220, 329.63, 277.18];
    nodesRef.current = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const gain = ctx.createGain();
      gain.gain.value = 0.0001;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15 + i * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain).connect(gain.gain);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      lfo.start();
      gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 2);
      return { osc, gain, lfo, lfoGain };
    });
    setOn(true);
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Pause music" : "Play music"}
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-kasavu/60 bg-ivory/80 text-charcoal backdrop-blur-md transition-all hover:bg-kasavu/20 md:h-14 md:w-14"
    >
      {on ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M9 6c1.5 0 3 1 3 3v6c0 2-1.5 3-3 3M9 6c-1.5 0-3 1-3 3v6c0 2 1.5 3 3 3M9 6v12M15 3v18" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/></svg>
      )}
    </button>
  );
}

// ————————————————————————————————————————————————
// RSVP
// ————————————————————————————————————————————————
function RSVP({ onSent }: { onSent: () => void }) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [guests, setGuests] = useState(1);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attending) return;
    setSent(true);
    onSent();
  };

  if (sent) {
    return (
      <div className="text-center">
        <p className="eyebrow">With gratitude</p>
        <h3 className="mt-6 font-serif text-4xl italic text-charcoal md:text-5xl">Thank you, {name.split(" ")[0]}</h3>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          {attending === "yes"
            ? "Your presence will make the day complete. A jasmine will bloom for you."
            : "You will be dearly missed. Our love reaches you across the miles."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-8">
      <div>
        <label className="eyebrow mb-3 block">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border-b border-charcoal/30 bg-transparent py-3 font-serif text-xl text-charcoal placeholder:text-muted-foreground/50 focus:border-kasavu focus:outline-none"
          placeholder="As it appears on the invitation"
        />
      </div>
      <div>
        <label className="eyebrow mb-4 block">Will you join us?</label>
        <div className="grid grid-cols-2 gap-3">
          {(["yes", "no"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setAttending(opt)}
              className={`border py-3 text-xs uppercase tracking-[0.3em] transition-all ${
                attending === opt
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-charcoal/30 text-charcoal hover:border-charcoal"
              }`}
            >
              {opt === "yes" ? "Joyfully yes" : "Regretfully no"}
            </button>
          ))}
        </div>
      </div>
      {attending === "yes" && (
        <div className="animate-rise">
          <label className="eyebrow mb-3 block">Number of guests</label>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="h-10 w-10 border border-charcoal/30 text-charcoal hover:border-charcoal">−</button>
            <span className="font-serif text-3xl tabular-nums text-charcoal">{guests}</span>
            <button type="button" onClick={() => setGuests(Math.min(6, guests + 1))} className="h-10 w-10 border border-charcoal/30 text-charcoal hover:border-charcoal">+</button>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={!name || !attending}
        className="group relative w-full overflow-hidden border border-kasavu bg-transparent py-4 text-xs uppercase tracking-[0.4em] text-charcoal transition-all hover:bg-kasavu/10 disabled:opacity-40"
      >
        <span className="relative">Send with love</span>
      </button>
    </form>
  );
}

// ————————————————————————————————————————————————
// Page
// ————————————————————————————————————————————————
function Index() {
  const [firstVisit, setFirstVisit] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const visited = sessionStorage.getItem("kw_visited");
    if (!visited) {
      setFirstVisit(true);
      sessionStorage.setItem("kw_visited", "1");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ivory text-charcoal">
      {firstVisit && <PetalRain count={12} duration={[14, 22]} durationMs={12000} />}
      {celebrate && <PetalRain count={30} duration={[6, 12]} durationMs={7000} />}
      <MusicToggle />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-30 border-b border-kasavu/20 bg-ivory/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <a href="#top" className="font-serif text-lg italic tracking-wider text-charcoal">A & A</a>
          <div className="hidden gap-8 text-[0.65rem] uppercase tracking-[0.3em] text-charcoal md:flex">
            <a href="#story" className="hover:text-kasavu">Story</a>
            <a href="#events" className="hover:text-kasavu">Events</a>
            <a href="#venue" className="hover:text-kasavu">Venue</a>
            <a href="#gallery" className="hover:text-kasavu">Gallery</a>
            <a href="#rsvp" className="hover:text-kasavu">RSVP</a>
          </div>
          <span className="font-malayalam text-sm text-wood">കല്യാണം</span>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* image with parallax + sunrise */}
        <div
          className="absolute inset-0 animate-sunrise"
          style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.05)` }}
        >
          <img
            src={heroImg}
            alt="Bride in kasavu saree at heritage home"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/40 via-ivory/10 to-ivory" />
          <div className="absolute inset-0 [background:var(--grad-morning)] mix-blend-soft-light" />
        </div>

        {/* subtle floating petals in hero */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Petal
              key={i}
              size={14 + i * 2}
              className="petal absolute opacity-70"
              style={{
                left: `${10 + i * 15}%`,
                top: "-5vh",
                animationDelay: `${i * 2}s`,
                animationDuration: `${16 + i * 2}s`,
                ["--drift" as any]: `${(i % 2 === 0 ? 1 : -1) * 80}px`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 px-6 text-center animate-rise" style={{ animationDelay: "0.6s" }}>
          <p className="eyebrow">14 · 11 · 2026 · Thrissur, Kerala</p>
          <h1 className="mt-8 font-serif text-6xl leading-[0.95] text-charcoal md:text-[9rem] lg:text-[11rem]">
            <span className="block italic font-light">{COUPLE.one}</span>
            <span className="block font-serif italic text-kasavu">&</span>
            <span className="block italic font-light">{COUPLE.two}</span>
          </h1>
          <p className="font-malayalam mt-6 text-xl text-wood md:text-2xl">{COUPLE.malayalam}</p>
          <div className="mx-auto mt-10 h-px w-24 bg-kasavu" />
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-charcoal/70">
            Two families, one morning of lamps and jasmine. We invite you to be present.
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.4em] text-wood animate-glow">
          Scroll
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="relative border-t border-kasavu/20 py-24 md:py-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p className="eyebrow">The morning approaches</p>
            <div className="mx-auto mt-8 h-px w-16 bg-kasavu" />
            <div className="mt-16">
              <Countdown />
            </div>
          </Reveal>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="relative border-t border-kasavu/20 bg-cream py-28 md:py-40 paper-texture">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-10">
          <Reveal className="relative">
            <div className="reveal aspect-[3/4] w-full overflow-hidden">
              <img src={storyImg} alt="Hands exchanging jasmine garland" className="h-full w-full object-cover hover-lift" />
            </div>
          </Reveal>
          <Reveal delay={200} className="flex flex-col justify-center">
            <p className="eyebrow">Our Story</p>
            <h2 className="mt-6 font-serif text-5xl leading-tight text-charcoal md:text-6xl">
              A monsoon in <em className="italic text-kasavu">Fort Kochi</em>, and everything changed.
            </h2>
            <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                They met on a rain-soaked afternoon in June — Ananya running for shelter under the eaves of a spice merchant's home, Arjun already there with a book and two glasses of chai.
              </p>
              <p>
                What followed were three years of long letters, longer conversations, ferry rides across the backwaters, and quiet mornings at the Guruvayur temple. This November, in the courtyard of her grandmother's Nalukettu, they will light the lamp together.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-kasavu/50" />
              <span className="font-serif italic text-wood">Est. June 2023</span>
              <div className="h-px flex-1 bg-kasavu/50" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="relative border-t border-kasavu/20 py-28 md:py-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Reveal className="text-center">
            <p className="eyebrow">The Ceremonies</p>
            <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl leading-tight text-charcoal md:text-6xl">
              Three mornings, held gently.
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-px bg-kasavu/30 md:grid-cols-3">
            {[
              { day: "Nov 12", title: "Nischayam", time: "Evening · 6.00 pm", desc: "The engagement. Lamps lit, prayers offered, futures joined.", place: "Padinjarekkara Home, Thrissur" },
              { day: "Nov 13", title: "Mehendi & Sangeet", time: "Afternoon · 3.00 pm", desc: "Jasmine, henna, and the music of both families under a starlit courtyard.", place: "Kalari Kovilakom" },
              { day: "Nov 14", title: "Vivaham", time: "Muhurtham · 6.42 am", desc: "The wedding at first light. Tying of the thaali, the seven steps, the blessing.", place: "Vadakkumnathan Temple" },
            ].map((e) => (
              <div key={e.title} className="group relative bg-ivory p-10 transition-colors hover:bg-cream md:p-12">
                <div className="eyebrow text-kasavu">{e.day}</div>
                <h3 className="mt-6 font-serif text-3xl italic text-charcoal md:text-4xl">{e.title}</h3>
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-wood">{e.time}</p>
                <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{e.desc}</p>
                <div className="mt-10 flex items-center gap-3 border-t border-kasavu/30 pt-6 text-xs text-wood-dark">
                  <span className="h-1 w-1 rounded-full bg-kasavu" />
                  {e.place}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAMP INTERLUDE */}
      <section className="relative overflow-hidden bg-wood-dark py-32 md:py-48">
        <div
          className="absolute inset-0 opacity-70"
          style={{ transform: `translateY(${(scrollY - 2400) * 0.15}px)` }}
        >
          <img src={lampImg} alt="Brass nilavilakku lamp" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-wood-dark via-wood-dark/40 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-6 md:px-10">
          <Reveal>
            <p className="eyebrow text-kasavu">Nilavilakku</p>
            <blockquote className="mt-8 font-serif text-3xl italic leading-relaxed text-ivory md:text-5xl">
              "Before the mantras, before the vows — there is the lamp. It is lit once, and then love keeps the flame."
            </blockquote>
            <p className="mt-8 font-malayalam text-lg text-kasavu-soft">— അമ്മ പറഞ്ഞത്</p>
          </Reveal>
        </div>
      </section>

      {/* VENUE */}
      <section id="venue" className="relative border-t border-kasavu/20 py-28 md:py-40">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid gap-16 md:grid-cols-5 md:gap-20">
            <Reveal className="md:col-span-2">
              <p className="eyebrow">The Venue</p>
              <h2 className="mt-6 font-serif text-5xl leading-tight text-charcoal md:text-6xl">
                Where the water meets the morning.
              </h2>
              <p className="mt-8 text-base leading-relaxed text-muted-foreground">
                Kalari Kovilakom — a 200-year-old palace on the edge of the Alappuzha backwaters. Wooden pillars, tiled roofs, and a courtyard that has held four generations of vows.
              </p>
              <dl className="mt-10 space-y-4 text-sm">
                <div className="flex justify-between border-b border-kasavu/30 pb-3">
                  <dt className="eyebrow">Address</dt>
                  <dd className="text-right text-charcoal">Kollengode, Palakkad · Kerala 678506</dd>
                </div>
                <div className="flex justify-between border-b border-kasavu/30 pb-3">
                  <dt className="eyebrow">Nearest station</dt>
                  <dd className="text-right text-charcoal">Palakkad Junction, 40 km</dd>
                </div>
                <div className="flex justify-between border-b border-kasavu/30 pb-3">
                  <dt className="eyebrow">Airport</dt>
                  <dd className="text-right text-charcoal">Coimbatore Intl., 55 km</dd>
                </div>
              </dl>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-3 border-b border-charcoal py-2 text-xs uppercase tracking-[0.35em] text-charcoal hover:text-kasavu hover:border-kasavu"
              >
                View on map
                <span className="text-kasavu">→</span>
              </a>
            </Reveal>
            <Reveal delay={200} className="md:col-span-3">
              <div className="reveal aspect-[4/3] w-full overflow-hidden">
                <img src={venueImg} alt="Kerala backwaters at dawn" className="h-full w-full object-cover hover-lift" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="relative border-t border-kasavu/20 bg-cream py-28 md:py-40 paper-texture">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Reveal className="text-center">
            <p className="eyebrow">Fragments</p>
            <h2 className="mt-6 font-serif text-5xl italic text-charcoal md:text-6xl">A quiet gallery</h2>
          </Reveal>
          <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[g1, g2, g3, g4].map((src, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className={`overflow-hidden ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-[3/4] md:mt-16"}`}>
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover hover-lift" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative border-t border-kasavu/20 py-28 md:py-40">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <Reveal className="text-center">
            <p className="eyebrow">Kindly respond</p>
            <h2 className="mt-6 font-serif text-5xl italic text-charcoal md:text-6xl">A seat under the mandapam</h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Please let us know by the 20th of October. Every reply lights a lamp in our home.
            </p>
          </Reveal>
          <div className="mt-16">
            <RSVP onSent={() => setCelebrate(true)} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-kasavu/30 bg-wood-dark py-20 text-ivory">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
          <p className="font-serif text-3xl italic md:text-4xl">
            {COUPLE.one} <span className="text-kasavu">&</span> {COUPLE.two}
          </p>
          <p className="font-malayalam mt-4 text-lg text-kasavu-soft">{COUPLE.malayalam}</p>
          <div className="mx-auto mt-8 h-px w-16 bg-kasavu" />
          <p className="mt-8 text-[0.65rem] uppercase tracking-[0.4em] text-ivory/60">
            14 November 2026 · Thrissur, Kerala
          </p>
          <p className="mt-12 text-xs text-ivory/40">
            Made with jasmine and quiet mornings.
          </p>
        </div>
      </footer>
    </div>
  );
}
