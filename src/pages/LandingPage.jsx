import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Star, ChevronRight, Zap, Shield, BarChart3, Cpu, Leaf, Users } from 'lucide-react';

/* ─────────────── Data ─────────────── */
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

const OLD_WAY = [
  'Manual crop inspection — hours in the field',
  'Guesswork-based disease identification',
  'Delayed treatment leads to crop loss',
  'No centralized health records',
];

const NEW_WAY = [
  'AI scan in under 3 seconds',
  '95%+ accurate diagnosis with action plans',
  'Instant alerts & treatment steps',
  'Full health dashboard & history tracking',
];

const FEATURES = [
  {
    title: 'AI-Powered Scanning',
    desc: 'Point your camera at any crop or livestock. Our AI identifies diseases, pests, and health issues in seconds with detailed action plans.',
    icon: Cpu,
    span: 'col-span-2',
    dark: false,
  },
  {
    title: 'Smart Diagnostics',
    desc: 'Get severity ratings, urgency levels, affected areas, and immediate care steps — everything you need in one scan.',
    icon: Zap,
    span: '',
    dark: true,
  },
  {
    title: 'Real-Time Weather',
    desc: 'Hyperlocal weather forecasts with agricultural advisories tailored to your specific crops and region.',
    icon: Shield,
    span: '',
    dark: false,
  },
  {
    title: 'Health Dashboard',
    desc: 'Track yield predictions, weight monitoring, and feed optimization with beautiful charts and predictive analytics.',
    icon: BarChart3,
    span: 'col-span-2',
    dark: true,
  },
  {
    title: '22 Languages',
    desc: 'Full support for all major Indian languages. FarmBuddy speaks your language — from Hindi to Tamil to Assamese.',
    icon: Users,
    span: '',
    dark: false,
  },
  {
    title: 'Crop & Livestock',
    desc: 'Works with any crop, plant, or livestock animal. From wheat fields to dairy cattle — one app for everything.',
    icon: Leaf,
    span: '',
    dark: false,
  },
];

const STEPS = [
  {
    num: '01',
    title: 'SCAN YOUR FARM',
    desc: 'Open FarmBuddy and point your camera at any crop leaf, plant, or livestock animal. Our AI instantly processes the image.',
  },
  {
    num: '02',
    title: 'GET AI DIAGNOSIS',
    desc: 'Within seconds, receive a detailed health report: disease identification, severity assessment, affected areas, and confidence scores.',
  },
  {
    num: '03',
    title: 'ACT & PROTECT',
    desc: 'Follow personalized action plans with immediate care steps, treatment recommendations, and preventive measures. Track progress over time.',
  },
];

const TESTIMONIALS = [
  {
    name: 'RAJESH KUMAR',
    role: 'Wheat Farmer, Punjab',
    text: '"FarmBuddy spotted wheat rust on my crops 2 weeks before I would have noticed. Saved nearly 40% of my harvest that season."',
    avatar: '👨‍🌾',
  },
  {
    name: 'PRIYA SHARMA',
    role: 'Dairy Farmer, Gujarat',
    text: '"The livestock scanning feature is incredible. It identified early signs of mastitis in my cattle and the treatment plan worked perfectly."',
    avatar: '👩‍🌾',
  },
  {
    name: 'ARUN PATEL',
    role: 'Rice Farmer, Tamil Nadu',
    text: '"Having 22 language support means my entire family can use the app. The AI diagnostics in Tamil are just as accurate."',
    avatar: '🧑‍🌾',
  },
];

/* ─────────────── Component ─────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [ctaEmail, setCtaEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleWaitlist = (value, setter) => {
    if (value.trim()) {
      alert(`🎉 You're on the list! We'll notify ${value} when FarmBuddy launches.`);
      setter('');
    }
  };

  return (
    <div className="font-body bg-white text-charcoalDark overflow-x-hidden">

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-display text-3xl uppercase tracking-normal text-charcoalDark">
            FarmBuddy<span className="text-goldenYellow">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="font-body text-sm font-medium text-charcoalDark/70 hover:text-charcoalDark transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="font-body text-sm font-medium text-charcoalDark/70 hover:text-charcoalDark transition-colors">
              Login
            </Link>
            <Link to="/login" className="bg-charcoalDark text-white font-body text-sm font-medium px-6 py-2.5 rounded-full hover:bg-charcoalDark/90 transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`w-6 h-0.5 bg-charcoalDark transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-charcoalDark transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-charcoalDark transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg md:hidden border-t border-charcoalDark/10">
            <div className="p-6 flex flex-col gap-4">
              {NAV_LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="font-body text-lg font-medium text-charcoalDark/70">
                  {l.label}
                </a>
              ))}
              <hr className="border-charcoalDark/10" />
              <Link to="/login" className="font-body text-lg font-medium text-charcoalDark/70">Login</Link>
              <Link to="/login" className="bg-charcoalDark text-white font-body font-medium text-center px-6 py-3 rounded-full">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="grid-bg min-h-screen flex flex-col items-center justify-center pt-20 px-6 relative overflow-hidden">
        {/* Decorative grid fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-charcoalDark/5 border border-charcoalDark/10 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-goldenYellow rounded-full animate-pulse" />
            <span className="font-body text-xs font-medium uppercase tracking-widest text-charcoalDark/70">
              AI-POWERED FARM DIAGNOSTICS
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.9] mb-6 tracking-normal">
            PROTECT YOUR{' '}
            <br className="hidden sm:block" />
            FARM WITH{' '}
            <span className="highlight-bar px-2 sm:px-4">AI</span>
          </h1>

          {/* Subheadline */}
          <p className="font-body text-lg sm:text-xl text-charcoalDark/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Scan any crop or livestock with your camera. Get instant AI diagnosis, treatment plans, and health tracking — in 22 languages.
          </p>

          {/* Waitlist Form */}
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full sm:flex-1 border border-charcoalDark/20 bg-white font-body text-base px-6 py-4 rounded-xl focus:outline-none focus:border-charcoalDark/50 transition-colors"
            />
            <button
              onClick={() => handleWaitlist(email, setEmail)}
              className="w-full sm:w-auto bg-goldenYellow text-charcoalDark font-display text-xl px-8 py-4 rounded-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              JOIN WAITLIST <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust line */}
          <p className="font-body text-xs text-charcoalDark/40 mt-4">
            Free forever for small farms · No credit card required
          </p>
        </div>
      </section>

      {/* ═══════ ABSTRACT UI MOCKUP ═══════ */}
      <section className="px-6 lg:px-10 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="border border-charcoalDark/10 rounded-2xl shadow-2xl overflow-hidden bg-white">
          {/* Browser Header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-charcoalDark/[0.03] border-b border-charcoalDark/10">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-body text-xs text-charcoalDark/40 mx-auto">FarmBuddy — AI Dashboard</span>
          </div>

          {/* Mockup Body */}
          <div className="grid grid-cols-12 min-h-[320px] md:min-h-[420px]">
            {/* Sidebar */}
            <div className="col-span-3 lg:col-span-2 bg-charcoalDark p-4 flex flex-col gap-3">
              <div className="w-full h-3 bg-white/10 rounded" />
              <div className="w-3/4 h-3 bg-white/10 rounded" />
              <div className="w-full h-3 bg-goldenYellow/30 rounded mt-2" />
              <div className="w-5/6 h-3 bg-white/5 rounded" />
              <div className="w-4/6 h-3 bg-white/5 rounded" />
              <div className="mt-auto">
                <div className="w-8 h-8 bg-goldenYellow/20 rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-goldenYellow" />
                </div>
              </div>
            </div>

            {/* Main Canvas */}
            <div className="col-span-6 lg:col-span-7 bg-[#f8f9fa] p-6 flex items-center justify-center relative">
              {/* Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 w-48 md:w-64 animate-float">
                <div className="w-full h-3 bg-charcoalDark/10 rounded mb-3" />
                <div className="w-3/4 h-3 bg-charcoalDark/10 rounded mb-4" />
                <div className="flex gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-teal/20" />
                  <div className="w-8 h-8 rounded-full bg-goldenYellow/30" />
                  <div className="w-8 h-8 rounded-full bg-coralRed/20" />
                </div>
                <div className="w-full h-2 bg-goldenYellow/40 rounded" />
              </div>

              {/* Floating cursor */}
              <div className="absolute bottom-8 right-12 md:bottom-12 md:right-20 flex items-center gap-1">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="drop-shadow-lg">
                  <path d="M0 0L16 12H6L0 20V0Z" fill="#171e19" />
                </svg>
                <span className="bg-charcoalDark text-white font-body text-[10px] px-2 py-1 rounded-md shadow-md">
                  Farmer Alex
                </span>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="col-span-3 bg-white border-l border-charcoalDark/10 p-4 flex flex-col gap-3">
              <p className="font-display text-xs uppercase text-charcoalDark/60">Properties</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-charcoalDark/50">Font</span>
                  <span className="font-display text-[11px]">Anton</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-charcoalDark/50">Align</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 border border-charcoalDark/20 rounded flex items-center justify-center">
                      <div className="space-y-[2px]"><div className="w-2 h-[1px] bg-charcoalDark/40" /><div className="w-1.5 h-[1px] bg-charcoalDark/40" /></div>
                    </div>
                    <div className="w-4 h-4 border border-charcoalDark/20 rounded bg-charcoalDark/5 flex items-center justify-center">
                      <div className="space-y-[2px]"><div className="w-2 h-[1px] bg-charcoalDark" /><div className="w-2 h-[1px] bg-charcoalDark" /></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-charcoalDark/50">Color</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-goldenYellow border border-charcoalDark/10" />
                    <span className="font-body text-[9px] text-charcoalDark/40">#FFE17C</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <div className="w-full h-2 bg-charcoalDark/5 rounded" />
                <div className="w-3/4 h-2 bg-charcoalDark/5 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF / TESTIMONIALS ═══════ */}
      <section id="testimonials" className="px-6 lg:px-10 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-charcoalDark/50 mb-3">TRUSTED BY FARMERS</p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9]">
            REAL <span className="highlight-bar px-2">RESULTS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`landing-card rounded-2xl p-8 flex flex-col ${
                i === 1
                  ? 'bg-charcoalDark text-white md:translate-y-4 border-transparent'
                  : 'bg-white border border-charcoalDark/10'
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-5 h-5 text-goldenYellow fill-goldenYellow" />
                ))}
              </div>

              {/* Body */}
              <p className={`font-body text-lg font-medium leading-relaxed mb-8 flex-1 ${i === 1 ? 'text-white/90' : 'text-charcoalDark/80'}`}>
                {t.text}
              </p>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl grayscale ${i === 1 ? 'bg-white/10' : 'bg-charcoalDark/5'}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display text-sm uppercase">{t.name}</p>
                  <p className={`font-body text-xs ${i === 1 ? 'text-white/50' : 'text-charcoalDark/50'}`}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ PROBLEM-SOLUTION ═══════ */}
      <section className="w-full">
        <div className="flex flex-col md:flex-row">
          {/* Problem — Left */}
          <div className="flex-1 bg-charcoalDark p-10 sm:p-12 md:p-16 lg:p-20">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-sageMuted/50 mb-2">FARMING WITHOUT AI</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-white leading-[0.9] mb-10">
              THE OLD<br/>WAY
            </h2>
            <ul className="space-y-5">
              {OLD_WAY.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-coralRed shrink-0 mt-0.5" />
                  <span className="font-body text-base text-sageMuted/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution — Right */}
          <div className="flex-1 bg-darkGray p-10 sm:p-12 md:p-16 lg:p-20 border-l-4 border-goldenYellow">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-goldenYellow/60 mb-2">WITH FARMBUDDY AI</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-white leading-[0.9] mb-10">
              THE FARMBUDDY<br/>WAY
            </h2>
            <ul className="space-y-5">
              {NEW_WAY.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-goldenYellow shrink-0 mt-0.5" />
                  <span className="font-body text-base text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════ BENTO FEATURE GRID ═══════ */}
      <section id="features" className="px-6 lg:px-10 py-16 md:py-28 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-charcoalDark/50 mb-3">EVERYTHING YOU NEED</p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9]">
            POWERFUL <span className="highlight-bar px-2">FEATURES</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(280px,auto)] md:auto-rows-[minmax(340px,auto)]">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`landing-card rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden ${i === 0 || i === 3 ? 'sm:col-span-2' : ''} ${
                  f.dark
                    ? 'bg-charcoalDark text-white'
                    : 'bg-[#f8f9fa] text-charcoalDark border border-charcoalDark/5'
                }`}
              >
                {/* Abstract decoration */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${f.dark ? 'bg-goldenYellow/10' : 'bg-charcoalDark/[0.03]'}`} />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.dark ? 'bg-goldenYellow/20' : 'bg-charcoalDark/5'}`}>
                    <Icon className={`w-6 h-6 ${f.dark ? 'text-goldenYellow' : 'text-charcoalDark/70'}`} />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl uppercase mb-3">{f.title}</h3>
                  <p className={`font-body text-base leading-relaxed ${f.dark ? 'text-white/60' : 'text-charcoalDark/60'}`}>
                    {f.desc}
                  </p>
                </div>

                {/* Bottom decorative elements */}
                <div className="mt-6 flex gap-2 relative z-10">
                  {i === 0 && (
                    <>
                      <div className="h-2 flex-1 bg-goldenYellow/30 rounded animate-pulse-slow" />
                      <div className="h-2 flex-1 bg-teal/30 rounded animate-pulse-slow" style={{ animationDelay: '1s' }} />
                      <div className="h-2 w-8 bg-goldenYellow/60 rounded animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  {i === 1 && (
                    <div className="bg-white/5 rounded-lg p-3 w-full font-body text-xs text-white/40">
                      <span className="text-goldenYellow">$</span> scan --crop wheat --ai<br/>
                      <span className="text-teal">✓</span> <span className="text-white/60">Healthy · 98% confidence</span>
                    </div>
                  )}
                  {i === 3 && (
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1 h-16 bg-goldenYellow/10 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-goldenYellow/20 rounded-b-lg" />
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-goldenYellow/40 rounded-b-lg" />
                      </div>
                      <div className="flex-1 h-16 bg-teal/10 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-teal/20 rounded-b-lg" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-teal/40 rounded-b-lg" />
                      </div>
                    </div>
                  )}
                  {i === 4 && (
                    <div className="flex flex-wrap gap-1">
                      {['हि', 'த', 'ते', 'ক', 'ਪ', 'ಕ'].map((ch, ci) => (
                        <span key={ci} className="w-8 h-8 rounded bg-charcoalDark/5 flex items-center justify-center font-body text-xs text-charcoalDark/50">{ch}</span>
                      ))}
                    </div>
                  )}
                  {i === 5 && (
                    <div className="flex -space-x-2">
                      {['🌾', '🐄', '🌽', '🐑'].map((e, ei) => (
                        <span key={ei} className="w-10 h-10 rounded-full bg-charcoalDark/5 flex items-center justify-center text-lg border-2 border-[#f8f9fa]">{e}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="px-6 lg:px-10 py-16 md:py-28 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left — Sticky title */}
          <div className="lg:w-1/3 lg:sticky lg:top-28 lg:self-start">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-charcoalDark/50 mb-3">SIMPLE PROCESS</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.9]">
              HOW IT <span className="highlight-bar px-2">WORKS</span>
            </h2>
          </div>

          {/* Right — Steps */}
          <div className="lg:w-2/3 space-y-8">
            {STEPS.map((step, i) => (
              <div key={i} className="step-card group bg-[#f8f9fa] rounded-2xl p-8 md:p-10 border border-charcoalDark/5 hover:border-goldenYellow/30 transition-colors cursor-default">
                <div className="flex items-start gap-6">
                  <span className="step-num font-display text-6xl md:text-8xl leading-none select-none">
                    {step.num}
                  </span>
                  <div className="pt-1 md:pt-3">
                    <h3 className="font-display text-xl md:text-2xl uppercase mb-2">{step.title}</h3>
                    <p className="font-body text-base text-charcoalDark/60 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="bg-goldenYellow relative overflow-hidden py-20 md:py-32 px-6">
        {/* Decorative text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[120px] sm:text-[180px] md:text-[260px] lg:text-[340px] uppercase text-charcoalDark/[0.06] leading-none whitespace-nowrap">
            FARMBUDDY
          </span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] mb-6 text-charcoalDark">
            START PROTECTING YOUR FARM TODAY
          </h2>
          <p className="font-body text-lg sm:text-xl md:text-2xl text-charcoalDark/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of farmers using AI to diagnose, protect, and optimize their farms. It's free to get started.
          </p>

          {/* CTA Form */}
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={ctaEmail}
              onChange={e => setCtaEmail(e.target.value)}
              className="w-full sm:flex-1 border border-charcoalDark/20 bg-white font-body text-base px-6 py-4 rounded-xl focus:outline-none focus:border-charcoalDark/50 transition-colors shadow-xl"
            />
            <button
              onClick={() => handleWaitlist(ctaEmail, setCtaEmail)}
              className="w-full sm:w-auto bg-charcoalDark text-white font-display text-xl px-8 py-4 rounded-xl shadow-xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              GET STARTED <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-charcoalDark text-white px-6 lg:px-10 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            {/* Logo */}
            <div>
              <a href="#" className="font-display text-3xl uppercase text-white">
                FarmBuddy<span className="text-goldenYellow">.</span>
              </a>
              <p className="font-body text-sm text-sageMuted/50 mt-3 max-w-xs">
                AI-powered crop and livestock diagnostics. Protecting farms across India and beyond.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-12 sm:gap-16">
              <div>
                <p className="font-display text-sm uppercase mb-4 text-sageMuted/50">Product</p>
                <ul className="space-y-3">
                  {['Features', 'Pricing', 'API', 'Languages'].map(l => (
                    <li key={l}><a href="#" className="font-body text-sm text-white/50 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-display text-sm uppercase mb-4 text-sageMuted/50">Company</p>
                <ul className="space-y-3">
                  {['About', 'Blog', 'Careers', 'Contact'].map(l => (
                    <li key={l}><a href="#" className="font-body text-sm text-white/50 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-sm uppercase mb-4 text-sageMuted/50">Legal</p>
                <ul className="space-y-3">
                  {['Privacy', 'Terms', 'Security'].map(l => (
                    <li key={l}><a href="#" className="font-body text-sm text-white/50 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-sageMuted/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-sageMuted/30">
              © 2026 FarmBuddy. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="font-body text-xs text-sageMuted/30 hover:text-white transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
