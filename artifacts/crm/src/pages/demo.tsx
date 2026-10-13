import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Video } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import video1 from "@assets/Video_1_1786868522450.mp4";
import video2 from "@assets/Video_2_1786868522452.mp4";
import video3 from "@assets/Video_3_1786868522453.mp4";
import video4 from "@assets/Video_4_1786868522455.mp4";
import video5 from "@assets/Video_5_1786868522456.mp4";

const demoVideos = [
  { source: video1, title: "Centralize your customers", description: "Keep every conversation and customer detail in one place." },
  { source: video2, title: "Track every order", description: "See what is pending, shipped, completed, or needs attention." },
  { source: video3, title: "Understand your numbers", description: "Turn your activity into a clear view of revenue and growth." },
  { source: video4, title: "Stay on top of follow-ups", description: "Keep reminders and next steps visible when they matter." },
  { source: video5, title: "Run your business with confidence", description: "A practical CRM built for the way small teams actually work." },
];

export default function Demo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = demoVideos[activeIndex];

  useEffect(() => {
    videoRef.current?.load();
    void videoRef.current?.play().catch(() => {
      // Browsers can block autoplay with sound; native controls remain available.
    });
  }, [activeIndex]);

  const goToVideo = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), demoVideos.length - 1));
  };

  return (
    <main className="min-h-[100dvh] bg-background px-4 py-6 text-foreground sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link href="/">
            <span className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </span>
          </Link>
          <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <span className="inline-flex cursor-pointer items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5">
              Start Free
            </span>
          </Link>
          </div>
        </header>

        <section className="mb-8 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Video className="h-3.5 w-3.5" />
            Product demo
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            See how your CRM gets work out of the way.
          </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Watch the five short clips in sequence, or jump straight to the part you want to explore.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                key={activeVideo.source}
                className="h-full w-full object-contain"
                src={activeVideo.source}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
                onEnded={() => {
                  if (activeIndex < demoVideos.length - 1) goToVideo(activeIndex + 1);
                }}
              />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                Clip {activeIndex + 1} of {demoVideos.length}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-4 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">{activeVideo.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{activeVideo.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToVideo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous video"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goToVideo(activeIndex + 1)}
                  disabled={activeIndex === demoVideos.length - 1}
                  aria-label="Next video"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-3">
            <div className="px-3 pb-3 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Explore the demo</p>
            </div>
            <div className="space-y-1">
              {demoVideos.map((demoVideo, index) => (
                <button
                  key={demoVideo.source}
                  type="button"
                  onClick={() => goToVideo(index)}
                  className={`group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    index === activeIndex ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    index === activeIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-accent"
                  }`}>
                    {index === activeIndex ? <Play className="h-3 w-3 fill-current" /> : index + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{demoVideo.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">8-second walkthrough</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}