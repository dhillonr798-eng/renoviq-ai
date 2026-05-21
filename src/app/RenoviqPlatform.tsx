"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, FormEvent, ReactNode, useEffect, useState } from "react";

type AuthMode = "signin" | "signup" | "forgot";
type GenerationState = "idle" | "loading" | "complete";

const spaceTypes = [
  "Exterior",
  "Interior",
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Office",
] as const;

const demoImages: Record<(typeof spaceTypes)[number], string> = {
  Interior: "/images/gallery-living.jpg",
  Exterior: "/images/gallery-exterior.jpg",
  Kitchen: "/images/gallery-kitchen.jpg",
  Bathroom: "/images/gallery-bathroom.jpg",
  Bedroom: "/images/gallery-bedroom.jpg",
  Office: "/images/gallery-office.jpg",
};

const demoTitles: Record<(typeof spaceTypes)[number], string> = {
  Interior: "Premium Interior in Modern Luxury",
  Exterior: "Modern Exterior Concept",
  Kitchen: "Kitchen in Modern Luxury",
  Bathroom: "Modern Bathroom Concept",
  Bedroom: "Luxury Bedroom Result",
  Office: "Modern Executive Office",
};

const whatsappLink =
  "https://wa.me/917973928146?text=Hi%20Rana%20Design%20Studio%2C%20I%20tried%20RENOVIQ%20AI%20and%20want%20a%20real%20custom%20design%20for%20my%20project.";

const styles = [
  "Modern Luxury",
  "Minimal",
  "Scandinavian",
  "Japandi",
  "Neo Classical",
  "Indian Contemporary",
  "Punjabi Luxury",
  "Futuristic",
];

const features = [
  ["AI Exterior Renovation", "Facade concepts with materials, lighting, entry rhythm, and landscape cues."],
  ["AI Interior Design", "Premium room transformations tuned for layouts, furniture, lighting, and mood."],
  ["Smart Style Detection", "Recognizes space type and suggests the most relevant design languages."],
  ["Instant Before/After", "Compare your source photo against the generated design direction."],
  ["Ultra HD Renders", "Presentation-ready outputs for owners, designers, and commercial teams."],
  ["Commercial Design", "Retail, office, studio, and showroom concepts for faster client alignment."],
  ["Virtual Renovation Preview", "See premium design possibilities before committing to expensive work."],
  ["AI Material Suggestions", "Surface, wall, fixture, lighting, and finish ideas matched to each style."],
];

const galleryItems = [
  {
    category: "Exterior",
    title: "Minimal Villa Facade",
    image: "/images/gallery-exterior.jpg",
    before: "Unfinished street elevation",
    after: "Modern luxury villa facade",
  },
  {
    category: "Living Room",
    title: "Luxury Lounge Concept",
    image: "/images/gallery-living.jpg",
    before: "Plain family seating",
    after: "Premium modern living room",
  },
  {
    category: "Kitchen",
    title: "Modern Chef Kitchen",
    image: "/images/gallery-kitchen.jpg",
    before: "Basic cooking zone",
    after: "Luxury modular kitchen",
  },
  {
    category: "Bathroom",
    title: "Spa Marble Suite",
    image: "/images/gallery-bathroom.jpg",
    before: "Simple utility bath",
    after: "Spa-style bathroom",
  },
  {
    category: "Office",
    title: "Executive AI Studio",
    image: "/images/gallery-office.jpg",
    before: "Generic workspace",
    after: "Modern executive office",
  },
  {
    category: "Bedroom",
    title: "Hotel Master Bedroom",
    image: "/images/gallery-bedroom.jpg",
    before: "Ordinary bedroom",
    after: "Luxury master bedroom",
  },
];

const plans = [
  {
    name: "Starter",
    price: 9,
    description: "For homeowners exploring early renovation ideas.",
    features: ["20 AI redesigns", "Standard quality", "Watermark included", "Basic styles", "Email support"],
  },
  {
    name: "Pro",
    price: 29,
    description: "For serious renovations and repeat design exploration.",
    features: [
      "100 AI redesigns",
      "HD renders",
      "Premium styles",
      "No watermark",
      "Faster rendering",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Studio",
    price: 99,
    description: "For studios, agencies, contractors, and commercial teams.",
    features: [
      "Unlimited redesigns",
      "Ultra HD renders",
      "Commercial usage",
      "API access",
      "Priority rendering",
      "Dedicated support",
    ],
  },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 place-items-center border border-[#d9ad5f]/70 bg-[#d9ad5f]/10 shadow-[0_0_30px_rgba(217,173,95,0.16)]">
        <svg viewBox="0 0 44 44" className="h-8 w-8 text-[#f5d89a]" aria-hidden="true">
          <path
            d="M8 22 22 10l14 12v13H8V22Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M16 34V19h9c4 0 7 2.4 7 6 0 3.2-2.2 5.4-5.5 5.9L32 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M16 25h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 13h5M27 8h5M35 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {!compact ? (
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f5d89a]">RENOVIQ AI</p>
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[#f7eddb]/50">
            Reimagine Every Space
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ImageFallback({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(245,216,154,0.22),transparent_28%),linear-gradient(135deg,#17120b,#050403_62%,#2a1d0c)]">
      <span className="border border-[#d9ad5f]/30 bg-[#070604]/58 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.18em] text-[#f5d89a] backdrop-blur-md">
        {label}
      </span>
    </div>
  );
}

function FeatureIcon({ title }: { title: string }) {
  const common = "fill-none stroke-current stroke-[1.8] stroke-linecap-round stroke-linejoin-round";
  const paths: Record<string, ReactNode> = {
    "AI Exterior Renovation": <><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></>,
    "AI Interior Design": <><path d="M5 13h14v6H5z" /><path d="M7 13V9a3 3 0 0 1 6 0v4" /><path d="M17 13v-3h2v3" /></>,
    "Smart Style Detection": <><path d="m12 3 1.4 4.1L17.5 9l-4.1 1.4L12 14.5l-1.4-4.1L6.5 9l4.1-1.9Z" /><path d="m18 14 .7 2.1 2.1.9-2.1.7-.7 2.1-.9-2.1-2.1-.7 2.1-.9Z" /></>,
    "Instant Before/After": <><path d="M12 4v16" /><path d="M4 6h16v12H4z" /><path d="M7 9h3" /><path d="M14 15h3" /></>,
    "Ultra HD Renders": <><path d="M4 6h16v14H4z" /><path d="m7 16 3-4 3 3 2-2 3 3" /><path d="M8 9h.01" /></>,
    "Commercial Design": <><path d="M5 20V5h10v15" /><path d="M15 10h4v10" /><path d="M8 8h2M8 12h2M8 16h2" /></>,
    "Virtual Renovation Preview": <><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" /><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></>,
    "AI Material Suggestions": <><path d="M4 7h16" /><path d="M7 4v16" /><path d="M4 13h16" /><path d="M13 4v16" /></>,
  };
  return <svg viewBox="0 0 24 24" className={`h-7 w-7 text-[#f5d89a] ${common}`} aria-hidden="true">{paths[title]}</svg>;
}

function GalleryImage({
  alt,
  className,
  src,
}: {
  alt: string;
  className: string;
  src: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2600);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed right-4 top-24 z-50 max-w-sm border border-[#d9ad5f]/35 bg-[#0b0906]/95 px-5 py-4 text-sm text-[#f7eddb] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <p className="font-semibold text-[#f5d89a]">RENOVIQ AI</p>
      <p className="mt-1 text-[#f7eddb]/72">{message}</p>
    </div>
  );
}

function AuthModal({
  mode,
  onClose,
  onModeChange,
  onSuccess,
}: {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (message: string) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    remember: false,
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const title = isSignup ? "Create your account" : isForgot ? "Reset password" : "Sign in to RENOVIQ AI";

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (/(mailinator|tempmail|10minutemail|guerrillamail)/.test(email)) {
      setError("Disposable email addresses are blocked. Please use a permanent email.");
      return;
    }

    if (isSignup && form.name.trim().length < 2) {
      setError("Full name is required.");
      return;
    }

    if (!isForgot && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (isSignup && form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (isSignup && !form.terms) {
      setError("Accept terms and privacy to continue.");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      if (isForgot) {
        onSuccess("Password reset link sent. Check your inbox.");
        onModeChange("signin");
        return;
      }

      onSuccess(
        isSignup
          ? "Account created. Email verification required before exports."
          : "Signed in successfully. Email verification is pending.",
      );
      onClose();
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-4 py-8 backdrop-blur-lg">
      <div className="max-h-[92vh] w-full max-w-lg overflow-auto border border-[#d9ad5f]/28 bg-[#0b0906] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.72)] sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="section-kicker">Secure access</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center border border-[#d9ad5f]/24 text-[#f5d89a] transition hover:bg-[#d9ad5f] hover:text-[#070604]"
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button className="min-h-12 border border-[#d9ad5f]/22 bg-[#100d09] text-sm font-semibold text-white transition hover:border-[#d9ad5f]/70">
            Continue with Google
          </button>
          <button className="min-h-12 border border-[#d9ad5f]/22 bg-[#100d09] text-sm font-semibold text-white transition hover:border-[#d9ad5f]/70">
            Continue with Apple
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={submit}>
          {isSignup ? (
            <>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Full name"
                className="auth-input"
              />
            </>
          ) : null}
          <input
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            type="email"
            placeholder="Email address"
            className="auth-input"
            suppressHydrationWarning
          />
          {!isForgot ? (
            <div className="relative">
              <input
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input pr-24"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-[0.12em] text-[#f5d89a]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          ) : null}
          {isSignup ? (
            <input
              value={form.confirm}
              onChange={(event) => updateField("confirm", event.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="auth-input"
            />
          ) : null}

          {!isForgot ? (
            <label className="flex items-center gap-3 text-sm text-[#f7eddb]/70">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) => updateField("remember", event.target.checked)}
                className="h-4 w-4 accent-[#d9ad5f]"
              />
              Remember me
            </label>
          ) : null}

          {isSignup ? (
            <label className="flex items-start gap-3 text-sm leading-6 text-[#f7eddb]/70">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(event) => updateField("terms", event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#d9ad5f]"
              />
              I agree to the terms, privacy policy, email verification, cooldown, and anti-abuse checks.
            </label>
          ) : null}

          {error ? (
            <p className="border border-[#d9ad5f]/26 bg-[#1a1008] px-4 py-3 text-sm text-[#f5d89a]">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="min-h-13 bg-[#d9ad5f] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#070604] transition hover:bg-[#f5d89a] disabled:opacity-60"
          >
            {loading ? "Please wait..." : isForgot ? "Send reset link" : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-[#f7eddb]/62">
          {!isSignup ? (
            <button className="text-[#f5d89a]" onClick={() => onModeChange("signup")}>
              Create account
            </button>
          ) : (
            <button className="text-[#f5d89a]" onClick={() => onModeChange("signin")}>
              Already have an account?
            </button>
          )}
          {!isForgot ? (
            <button className="text-[#f5d89a]" onClick={() => onModeChange("forgot")}>
              Forgot password?
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-4 backdrop-blur-lg">
      <div className="w-full max-w-md border border-[#d9ad5f]/35 bg-[#0b0906] p-7 text-center shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
        <p className="section-kicker">Upgrade required</p>
        <h2 className="mt-4 text-3xl font-semibold text-white">Free generation limit reached</h2>
        <p className="mt-4 leading-7 text-[#f7eddb]/68">
          Guest users get 1 free generation. Signed up users get 3 free generations. Upgrade to continue rendering premium concepts without interruption.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <a href="#pricing" onClick={onClose} className="inline-flex min-h-12 items-center justify-center bg-[#d9ad5f] px-5 text-sm font-black uppercase tracking-[0.12em] text-[#070604]">
            View pricing
          </a>
          <button onClick={onClose} className="min-h-12 border border-[#d9ad5f]/35 text-sm font-bold text-[#f5d89a]">
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadWorkflow({
  isSignedIn,
  onOpenAuth,
  onUpgrade,
  onToast,
}: {
  isSignedIn: boolean;
  onOpenAuth: (mode: AuthMode) => void;
  onUpgrade: () => void;
  onToast: (message: string) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [spaceType, setSpaceType] = useState<(typeof spaceTypes)[number]>("Exterior");
  const [selectedStyle, setSelectedStyle] = useState("Modern Luxury");
  const [isDragging, setIsDragging] = useState(false);
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [guestCredits, setGuestCredits] = useState(1);
  const [memberCredits, setMemberCredits] = useState(3);
  const [comparison, setComparison] = useState(54);

  const credits = isSignedIn ? memberCredits : guestCredits;
  const canGenerate = Boolean(previewUrl && spaceType && selectedStyle);

  useEffect(() => {
    if (generationState !== "loading") return;
    const timer = window.setTimeout(() => setGenerationState("complete"), 3000);
    return () => window.clearTimeout(timer);
  }, [generationState]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function loadFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return objectUrl;
    });
    setFileName(file.name);
    setGenerationState("idle");
  }

  function generate() {
    if (!canGenerate || generationState === "loading") return;
    if (!isSignedIn && guestCredits <= 0) {
      onToast("Sign up to unlock 3 free generations. Guest cooldown is active.");
      onUpgrade();
      return;
    }
    if (isSignedIn && memberCredits <= 0) {
      onToast("Email verification and upgrade required to continue generating.");
      onUpgrade();
      return;
    }
    if (!isSignedIn) setGuestCredits((current) => current - 1);
    else setMemberCredits((current) => current - 1);
    setGenerationState("loading");
  }

  return (
    <section id="product" className="bg-[#0d0b08] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center reveal">
          <p className="section-kicker">AI renovation workflow</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Try a demo renovation concept before requesting real design work.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#f7eddb]/68">
            Upload a photo, select a project type, and see a sample AI-style preview for lead generation.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl border border-[#d9ad5f]/26 bg-[#120f0a] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:p-6 lg:p-8">
          <div className="grid gap-3 md:grid-cols-4">
            {["Upload Photo", "Select Space Type", "Choose Style", "Generate Redesign"].map((step, index) => (
              <div key={step} className="border border-[#d9ad5f]/18 bg-[#080604] p-4 text-center">
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-[#d9ad5f] text-sm font-black text-[#070604]">
                  {index + 1}
                </span>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#f7eddb]/80">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.72fr)]">
            <label
              htmlFor="renoviq-upload"
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event: DragEvent<HTMLLabelElement>) => {
                event.preventDefault();
                setIsDragging(false);
                loadFile(event.dataTransfer.files?.[0]);
              }}
              className={`relative flex min-h-[360px] cursor-pointer flex-col overflow-hidden border border-dashed bg-[#050403] p-4 transition sm:min-h-[520px] ${
                isDragging ? "border-[#f5d89a]" : "border-[#d9ad5f]/50 hover:border-[#f5d89a]"
              }`}
            >
              {previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Uploaded renovation source" className="absolute inset-0 h-full w-full object-contain p-4" />
                  {generationState === "loading" ? <div className="ai-scan absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(245,216,154,0.34),transparent)]" /> : null}
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(5,4,3,0.96))] px-5 pb-5 pt-24">
                    <p className="inline-flex bg-[#d9ad5f] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#070604]">Original Upload</p>
                    <p className="mt-3 break-words text-lg font-semibold text-white">{fileName}</p>
                  </div>
                </>
              ) : (
                <div className="m-auto max-w-md text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d9ad5f] text-3xl text-[#070604]">+</span>
                  <p className="mt-6 text-2xl font-semibold text-white">Drag and drop your photo</p>
                  <p className="mt-3 leading-7 text-[#f7eddb]/58">Portrait, landscape, square, and tall images stay fully visible inside an elegant dark frame.</p>
                  <span className="mt-6 inline-flex border border-[#d9ad5f]/40 px-5 py-3 text-sm font-bold text-[#f5d89a]">Browse image</span>
                </div>
              )}
              <input id="renoviq-upload" type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => loadFile(event.target.files?.[0])} className="sr-only" />
            </label>

            <div className="grid content-start gap-5">
              <div className="border border-[#d9ad5f]/18 bg-[#080604] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f5d89a]">Free credits</p>
                  <p className="text-sm text-[#f7eddb]/62">{credits} remaining</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#f7eddb]/56">
                  Guest users get 1 free generation. Sign up users get 3 free generations after account creation.
                </p>
                {!isSignedIn ? (
                  <button onClick={() => onOpenAuth("signup")} className="mt-4 min-h-11 w-full border border-[#d9ad5f]/35 text-sm font-bold text-[#f5d89a] transition hover:bg-[#d9ad5f] hover:text-[#070604]">
                    Sign up for 3 free
                  </button>
                ) : null}
              </div>

              <div className="border border-[#d9ad5f]/18 bg-black/24 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f5d89a]">What did you upload?</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {spaceTypes.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSpaceType(item)}
                      className={`min-h-10 border px-3 text-xs font-bold transition ${
                        spaceType === item ? "border-[#f5d89a] bg-[#d9ad5f] text-[#070604]" : "border-[#d9ad5f]/22 text-[#f7eddb]/70 hover:border-[#d9ad5f]/70"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-[#d9ad5f]/18 bg-black/24 p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f5d89a]">Choose style</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {styles.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedStyle(item)}
                      className={`min-h-11 border px-3 text-left text-xs font-bold transition ${
                        selectedStyle === item ? "border-[#f5d89a] bg-[#d9ad5f] text-[#070604]" : "border-[#d9ad5f]/22 text-[#f7eddb]/70 hover:border-[#d9ad5f]/70"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                disabled={!canGenerate || generationState === "loading"}
                className="min-h-14 bg-[#d9ad5f] px-6 text-sm font-black uppercase tracking-[0.14em] text-[#070604] transition hover:bg-[#f5d89a] disabled:cursor-not-allowed disabled:bg-[#5e4822] disabled:text-[#bca779]"
              >
                {generationState === "loading" ? "Generating redesign..." : "Generate redesign"}
              </button>
              <p className="text-sm leading-6 text-[#f7eddb]/58">
                AI concept preview only. Final custom design is prepared by Rana Design Studio.
              </p>
            </div>
          </div>

          <div className="mt-6 border border-[#d9ad5f]/18 bg-[#080604]">
            <div className="grid sm:grid-cols-3">
              {["AI analyzing image", "Applying style intelligence", "Rendering before/after"].map((item, index) => {
                const active = generationState === "loading" || generationState === "complete";
                return (
                  <div key={item} className="border-b border-[#d9ad5f]/18 p-4 sm:border-b-0 sm:border-r last:sm:border-r-0">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${active ? "animate-pulse bg-[#f5d89a]" : "bg-[#44351b]"}`} />
                      <p className="text-sm font-semibold text-white">{item}</p>
                    </div>
                    <div className="mt-3 h-1 bg-[#2a2113]">
                      <div className={`h-full bg-[#d9ad5f] transition-all duration-700 ${active ? index === 2 && generationState === "loading" ? "w-2/3" : "w-full" : "w-0"}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {generationState === "complete" ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="relative min-h-[340px] overflow-hidden border border-[#d9ad5f]/28 bg-[#050403]">
                <ImageFallback label={`${spaceType} demo`} />
                <GalleryImage
                  src={demoImages[spaceType]}
                  alt={`${spaceType} demo redesign result`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {previewUrl ? <img src={previewUrl} alt="Original uploaded space" className="absolute inset-y-0 left-0 h-full w-full object-contain bg-[#050403]" style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }} /> : null}
                <div className="absolute inset-y-0 w-px bg-[#f5d89a]" style={{ left: `${comparison}%` }} />
                <input value={comparison} min={8} max={92} type="range" onChange={(event) => setComparison(Number(event.target.value))} className="absolute bottom-5 left-1/2 w-[72%] -translate-x-1/2 accent-[#d9ad5f]" aria-label="Before after comparison" />
                <span className="absolute left-4 top-4 bg-black/78 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#f5d89a]">Original Upload</span>
                <span className="absolute right-4 top-4 bg-[#d9ad5f] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#070604]">Demo Result</span>
              </div>
              <div className="border border-[#d9ad5f]/18 bg-[#120f0a] p-5">
                <p className="section-kicker">Concept ready</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{demoTitles[spaceType]}</h3>
                <p className="mt-4 leading-7 text-[#f7eddb]/62">AI concept preview only. Final custom design, drawings and execution guidance are prepared by Rana Design Studio.</p>
                <button onClick={() => onToast("Consultation request prepared. This is a frontend-only demo.")} className="mt-6 min-h-12 w-full bg-[#d9ad5f] px-5 text-sm font-black uppercase tracking-[0.12em] text-[#070604]">
                  Get Full Custom Design
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const multiplier = billing === "yearly" ? 10 : 1;

  return (
    <section id="pricing" className="bg-[#0d0b08] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center reveal">
          <p className="section-kicker">Pricing</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Plans for every design workflow.</h2>
          <div className="mx-auto mt-7 inline-grid grid-cols-2 border border-[#d9ad5f]/24 bg-[#080604] p-1">
            {["monthly", "yearly"].map((item) => (
              <button
                key={item}
                onClick={() => setBilling(item as "monthly" | "yearly")}
                className={`min-h-10 px-5 text-sm font-bold capitalize transition ${billing === item ? "bg-[#d9ad5f] text-[#070604]" : "text-[#f7eddb]/70"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(217,173,95,0.18)] ${
                plan.popular ? "border-[#f5d89a] bg-[#17120b]" : "border-[#d9ad5f]/22 bg-[#100d09]"
              }`}
            >
              {plan.popular ? <span className="absolute right-5 top-5 bg-[#d9ad5f] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#070604]">Most Popular</span> : null}
              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-3 min-h-14 text-sm leading-6 text-[#f7eddb]/58">{plan.description}</p>
              <p className="mt-6 text-5xl font-semibold text-[#f5d89a]">${plan.price * multiplier}<span className="text-base text-[#f7eddb]/48">/{billing === "yearly" ? "year" : "month"}</span></p>
              <ul className="mt-7 grid gap-3 text-sm text-[#f7eddb]/70">
                {plan.features.map((feature) => <li key={feature}>+ {feature}</li>)}
              </ul>
              <button className={`mt-8 min-h-12 w-full px-5 text-sm font-black uppercase tracking-[0.12em] ${plan.popular ? "bg-[#d9ad5f] text-[#070604]" : "border border-[#d9ad5f]/35 text-[#f5d89a]"}`}>
                Choose {plan.name}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="bg-[#120f0a] px-5 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1fr]">
        <div className="reveal">
          <p className="section-kicker">Contact</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">Need Real Custom Design?</h2>
          <p className="mt-6 leading-8 text-[#f7eddb]/64">Contact Rana Design Studio for working drawings, elevation and interiors.</p>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#d9ad5f] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#070604] transition hover:bg-[#f5d89a]">Book Consultation</a>
        </div>
        <form onSubmit={submit} className="reveal grid gap-4 border border-[#d9ad5f]/24 bg-[#080604] p-6">
          <input className="auth-input" placeholder="Name" />
          <input className="auth-input" placeholder="Phone" suppressHydrationWarning />
          <input className="auth-input" placeholder="Project Type" />
          <textarea className="auth-input min-h-32 resize-none" placeholder="Message" />
          {sent ? <p className="border border-[#d9ad5f]/26 bg-[#1a1008] px-4 py-3 text-sm text-[#f5d89a]">Request received. Rana Design Studio will contact you soon.</p> : null}
          <button type="submit" className="min-h-13 bg-[#d9ad5f] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#070604] transition hover:bg-[#f5d89a]">Request Consultation</button>
        </form>
      </div>
    </section>
  );
}

function WhatsAppFloatingButton() {
  return (
    <a
  href={whatsappLink}
  target="_blank"
  rel="noreferrer"
  className="fixed z-[9999] bottom-10 right-10 flex items-center gap-3 bg-[#d8ad55] text-black px-7 py-4 font-extrabold tracking-[0.14em] text-sm uppercase shadow-2xl hover:scale-105 transition-transform max-md:bottom-5 max-md:right-4 max-md:px-5 max-md:py-3 max-md:text-xs"
>
<span className="text-xl leading-none">☎</span>
      <span className="whitespace-nowrap">Get Real Design</span>
    </a>
  );
}

export default function RenoviqPlatform() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  function authSuccess(message: string) {
    setIsSignedIn(true);
    setToast(message);
  }

  return (
    <>
    <main className="min-h-screen overflow-hidden bg-[#070604] text-[#f7eddb]">
      {toast ? <Toast message={toast} onClose={() => setToast("")} /> : null}
      {authMode ? (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onModeChange={setAuthMode}
          onSuccess={authSuccess}
        />
      ) : null}
      {upgradeOpen ? <UpgradeModal onClose={() => setUpgradeOpen(false)} /> : null}

      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#d9ad5f]/16 bg-[#070604]/68 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" aria-label="RENOVIQ AI home"><Logo /></a>
          <div className="hidden items-center gap-7 text-sm text-[#f7eddb]/70 lg:flex">
            {["Product", "Features", "Gallery", "Pricing", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase() === "product" ? "product" : item.toLowerCase()}`} className="transition hover:text-[#f5d89a]">{item}</a>
            ))}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <button onClick={() => setAuthMode("signin")} className="min-h-11 px-4 text-sm font-semibold text-[#f7eddb]/78 transition hover:text-[#f5d89a]">Sign In</button>
            <button onClick={() => setAuthMode("signup")} className="min-h-11 bg-[#d9ad5f] px-5 text-sm font-black uppercase tracking-[0.12em] text-[#070604]">Start Free</button>
          </div>
          <button onClick={() => setMenuOpen((current) => !current)} className="grid h-11 w-11 place-items-center border border-[#d9ad5f]/30 text-[#f5d89a] lg:hidden" aria-label="Open mobile menu">
            =
          </button>
        </nav>
        {menuOpen ? (
          <div className="border-t border-[#d9ad5f]/16 bg-[#070604]/96 px-5 py-5 lg:hidden">
            <div className="grid gap-3 text-sm text-[#f7eddb]/74">
              {["Product", "Features", "Gallery", "Pricing", "Contact"].map((item) => (
                <a key={item} onClick={() => setMenuOpen(false)} href={`#${item.toLowerCase() === "product" ? "product" : item.toLowerCase()}`} className="py-2">{item}</a>
              ))}
              <button onClick={() => setAuthMode("signin")} className="min-h-11 border border-[#d9ad5f]/24 text-[#f5d89a]">Sign In</button>
              <button onClick={() => setAuthMode("signup")} className="min-h-11 bg-[#d9ad5f] font-black text-[#070604]">Start Free</button>
            </div>
          </div>
        ) : null}
      </header>

      <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-32 lg:px-8">
        <ImageFallback label="RENOVIQ AI preview" />
        <Image src="/luxury-ai-renovation-hero.png" alt="" fill preload sizes="100vw" className="object-cover opacity-48" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(217,173,95,0.22),transparent_30%),linear-gradient(90deg,rgba(7,6,4,0.98),rgba(7,6,4,0.78)_48%,rgba(7,6,4,0.42))]" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-center">
          <div className="animate-rise">
            <p className="section-kicker">Reimagine Every Space</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Transform Any Space with AI
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f7eddb]/78">
              Upload your interior or exterior photo and generate premium renovation concepts in seconds.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f5d89a]/82">Powered by Rana Design Studio</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setAuthMode("signup")} className="inline-flex min-h-13 items-center justify-center bg-[#d9ad5f] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#070604]">Start Free</button>
              <a href="#product" className="inline-flex min-h-13 items-center justify-center border border-[#d9ad5f]/35 px-7 text-sm font-black uppercase tracking-[0.12em] text-[#f5d89a]">View Demo</a>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["1 free guest generation", "3 free generations after sign up", "AI interior + exterior redesign", "Before/after preview"].map((item) => (
                <div key={item} className="border border-[#d9ad5f]/18 bg-black/24 p-4 text-sm text-[#f7eddb]/70">{item}</div>
              ))}
            </div>
          </div>
          <div className="animate-float border border-[#d9ad5f]/24 bg-[#080604]/72 p-5 backdrop-blur-xl">
            <div className="aspect-[4/5] border border-[#d9ad5f]/18 bg-[linear-gradient(150deg,#17120b,#050403)] p-5">
              <div className="flex items-center justify-between">
                <Logo compact />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#f5d89a]">AI Render</span>
              </div>
              <div className="relative mt-8 h-64 overflow-hidden border border-[#d9ad5f]/18 bg-[radial-gradient(circle_at_30%_20%,rgba(245,216,154,0.35),transparent_28%),linear-gradient(135deg,rgba(217,173,95,0.24),rgba(255,255,255,0.04))]">
                <ImageFallback label="AI preview" />
                <Image
                  src="/images/gallery-living.jpg"
                  alt="RENOVIQ AI sample living room redesign preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.08),rgba(5,4,3,0.46))]" />
                <span className="absolute bottom-4 left-4 border border-[#d9ad5f]/35 bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#f5d89a] backdrop-blur">
                  Before / After Preview
                </span>
              </div>
              <div className="mt-6 border-t border-[#d9ad5f]/18 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f5d89a]">
                  Instant AI Concept
                </p>
                <p className="mt-3 text-sm leading-6 text-[#f7eddb]/66">
                  Upload a space, choose a design style, and preview a premium renovation direction in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UploadWorkflow
        isSignedIn={isSignedIn}
        onOpenAuth={setAuthMode}
        onUpgrade={() => setUpgradeOpen(true)}
        onToast={setToast}
      />

      <section id="features" className="bg-[#070604] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center reveal">
            <p className="section-kicker">Features</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Professional AI renovation intelligence.</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([title, description]) => (
              <article key={title} className="reveal min-h-56 border border-[#d9ad5f]/20 bg-[#100d09] p-6 transition hover:-translate-y-1 hover:border-[#d9ad5f]/60">
                <div className="grid h-12 w-12 place-items-center border border-[#d9ad5f]/40 bg-[#d9ad5f]/12">
                  <FeatureIcon title={title} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#f7eddb]/60">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-[#120f0a] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center reveal">
            <p className="section-kicker">Gallery</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">AI-Powered Renovation Transformations</h2>
            <p className="mt-5 text-lg leading-8 text-[#f7eddb]/64">
              See how RENOVIQ AI transforms ordinary spaces into premium architectural concepts.
            </p>
          </div>
          <div className="mt-14 grid auto-rows-[minmax(420px,auto)] gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item, index) => (
              <article
                key={item.title}
                className={`reveal group flex flex-col overflow-hidden border border-[#d9ad5f]/22 bg-[#080604] shadow-[0_24px_80px_rgba(0,0,0,0.34)] transition duration-500 hover:-translate-y-2 hover:border-[#f5d89a]/70 hover:shadow-[0_0_90px_rgba(217,173,95,0.18)] ${
                  index === 0 || index === 5 ? "xl:row-span-2" : "xl:translate-y-8"
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-[#050403] bg-cover bg-center ${index === 0 || index === 5 ? "min-h-[560px] flex-1" : "h-[390px]"}`}
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <ImageFallback label={item.category} />
                  <GalleryImage
                    src={item.image}
                    alt={`${item.title} AI generated renovation concept`}
                    className="absolute inset-0 h-full w-full object-cover saturate-[1.08] transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(217,173,95,0.18),transparent_28%),linear-gradient(180deg,rgba(5,4,3,0.04),rgba(5,4,3,0.48))]" />
                  <div
                    className="comparison-before absolute inset-0 overflow-hidden border-r border-[#f5d89a]/80 bg-[#070604]/75 bg-cover bg-center backdrop-grayscale"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    <ImageFallback label={`${item.category} before`} />
                    <GalleryImage
                      src={item.image}
                      alt={`${item.title} before state`}
                      className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale contrast-75 brightness-50 transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,3,0.76),rgba(5,4,3,0.42))]" />
                  </div>
                  <div className="comparison-divider absolute top-0 h-full w-px bg-[#f5d89a] shadow-[0_0_22px_rgba(245,216,154,0.8)]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
                    <span className="border border-[#f5d89a]/28 bg-[#070604]/62 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#f5d89a] backdrop-blur-md">
                      {item.category}
                    </span>
                    <span className="bg-[#d9ad5f] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#070604]">
                      AI Generated
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(5,4,3,0.95))] p-5 pt-24">
                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold uppercase tracking-[0.12em]">
                      <span className="border border-white/10 bg-white/8 px-3 py-2 text-[#f7eddb]/68 backdrop-blur-md">
                        {item.before}
                      </span>
                      <span className="border border-[#d9ad5f]/28 bg-[#d9ad5f]/16 px-3 py-2 text-[#f5d89a] backdrop-blur-md">
                        {item.after}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#d9ad5f]/18 bg-[#0b0906]/88 p-6 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f5d89a]">
                        Renovation preview
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-white">{item.title}</h3>
                    </div>
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#f5d89a] shadow-[0_0_18px_rgba(245,216,154,0.9)]" />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#f7eddb]/58">
                    A realistic split-view transformation from ordinary space to a premium AI architectural concept with material depth and cinematic lighting.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Pricing />
      <Contact />

      <footer className="border-t border-[#d9ad5f]/18 bg-[#070604] px-5 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 text-sm leading-7 text-[#f7eddb]/56">Powered by Rana Design Studio. Premium AI renovation concepts for interiors, exteriors, and commercial spaces.</p>
          </div>
          <div>
            <p className="font-semibold text-white">Product</p>
            <div className="mt-4 grid gap-2 text-sm text-[#f7eddb]/58"><a href="#product">Upload Workflow</a><a href="#features">Features</a><a href="#gallery">Gallery</a></div>
          </div>
          <div>
            <p className="font-semibold text-white">Pricing</p>
            <div className="mt-4 grid gap-2 text-sm text-[#f7eddb]/58"><a href="#pricing">Starter</a><a href="#pricing">Pro</a><a href="#pricing">Studio</a></div>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <div className="mt-4 grid gap-2 text-sm text-[#f7eddb]/58"><a href="#contact">Contact</a><a href="#">Terms</a><a href="#">Privacy</a><a href="#contact">Book Consultation</a></div>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl border-t border-[#d9ad5f]/14 pt-6 text-sm text-[#f7eddb]/44">
          Copyright 2026 RENOVIQ AI. All rights reserved.
        </p>
      </footer>
    </main>
    <WhatsAppFloatingButton />
    </>
  );
}
