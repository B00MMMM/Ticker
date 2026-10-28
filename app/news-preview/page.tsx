"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const gradients = {
  midnight: "linear-gradient(90deg, #101820, #263d4a)",
  red: "linear-gradient(90deg, #8b0909, #ed351c)",
  blue: "linear-gradient(90deg, #063a70, #0879bb)",
  green: "linear-gradient(90deg, #124d42, #159477)"
};

function PreviewContent() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("ticker") || "TickerDesk live news preview";
  const title = searchParams.get("title") || "TickerDesk News";
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const [gradient, setGradient] = useState<keyof typeof gradients>("red");
  const [accent, setAccent] = useState("#ffd633");
  const [speed, setSpeed] = useState("24s");
  const [tickerType, setTickerType] = useState<"marquee" | "switch">("marquee");
  const [switchIndex, setSwitchIndex] = useState(0);
  const [switchPhase, setSwitchPhase] = useState<"in" | "out">("in");
  const switchSegments = useMemo(() => {
    const segments = ticker.match(/[^:,]+[:,]+|[^:,]+$/gu)?.map((segment) => segment.trim()).filter(Boolean) ?? [];
    return segments.length ? segments : [ticker];
  }, [ticker]);
  useEffect(() => {
    setSwitchIndex(0);
    setSwitchPhase("in");
  }, [ticker]);
  useEffect(() => {
    if (tickerType !== "switch") return;
    let swap: number | undefined;
    const interval = window.setInterval(() => {
      setSwitchPhase("out");
      swap = window.setTimeout(() => {
        setSwitchIndex((current) => (current + 1) % switchSegments.length);
        setSwitchPhase("in");
      }, 600);
    }, 4500);
    return () => {
      window.clearInterval(interval);
      if (swap !== undefined) window.clearTimeout(swap);
    };
  }, [switchSegments.length, tickerType]);
  const stageStyle = useMemo(() => ({ "--marquee-background": gradients[gradient], "--marquee-accent": accent } as React.CSSProperties), [accent, gradient]);

  return (
    <main className="news-preview-page">
      <header className="preview-toolbar">
        <div><a className="back-link" href="/">← Back to editorial queue</a><h1>News panel demo</h1><p>Preview how this ticker could sit over a live broadcast frame.</p></div>
        <div className="preview-controls">
          <label>Position<select value={position} onChange={(event) => setPosition(event.target.value as "bottom" | "top")}><option value="bottom">Bottom of screen</option><option value="top">Top of screen</option></select></label>
          <label>Colour<select value={gradient} onChange={(event) => setGradient(event.target.value as keyof typeof gradients)}><option value="red">News red</option><option value="blue">Broadcast blue</option><option value="green">Sage green</option><option value="midnight">Midnight</option></select></label>
          <label>Accent<input className="accent-picker" type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /></label>
          <label>Ticker style<select value={tickerType} onChange={(event) => { setTickerType(event.target.value as "marquee" | "switch"); setSwitchIndex(0); setSwitchPhase("in"); }}><option value="marquee">Scrolling marquee</option><option value="switch">Enlarging switch</option></select></label>
          <label>Scroll speed<select value={speed} onChange={(event) => setSpeed(event.target.value)}><option value="16s">Fast</option><option value="24s">Standard</option><option value="36s">Slow</option></select></label>
        </div>
      </header>
      <section className={`broadcast-stage ${position}`} style={stageStyle}>
        <div className="stage-grid"><div className="stage-channel">TD <span>LIVE</span></div><div className="stage-copy"><strong>{title}</strong><small>Broadcast preview · not a live feed</small></div><div className="stage-clock">12:42 PM</div></div>
        {tickerType === "marquee" ? (
          <div className="broadcast-marquee"><div className="marquee-tag">BREAKING</div><div className="marquee-window"><div className="marquee-track" style={{ animationDuration: speed }}>{ticker}<span aria-hidden="true">{ticker}</span></div></div></div>
        ) : (
          <div className="broadcast-switch"><div className="switch-bg-stripes" /><div className="switch-tag"><span className="switch-live-dot" />FLASH NEWS</div><div className="switch-headline-container"><div className={`switch-copy switch-${switchPhase}`} key={`${switchIndex}-${switchSegments[switchIndex]}`}>{switchSegments[switchIndex]}</div></div><div className="switch-progress">{switchIndex + 1} / {switchSegments.length}</div></div>
        )}
        <div className="stage-caption">TickerDesk newsroom visualisation</div>
      </section>
      <div className="preview-note"><strong>Preview controls</strong><span>Change the placement and colours to explore a broadcast treatment. This demo uses a neutral studio frame and does not represent a real broadcaster.</span></div>
    </main>
  );
}

export default function NewsPreviewPage() {
  return (
    <Suspense fallback={<main className="news-preview-page"><div className="panel preview-loading">Loading news panel preview…</div></main>}>
      <PreviewContent />
    </Suspense>
  );
}
