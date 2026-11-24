// Deck.jsx - the stack of dashboard cards. Each card is sticky, a little
// lower than the one before, so as you scroll each new card slides up
// and over the last one. Cards underneath shrink and dim a little more
// for every card on top of them, which gives the pile its depth.
//
//   <Deck>
//     <Card index={0} total={4} title=... subtitle=... controls=... aside=...>
//       <ResponsiveChart ... />
//     </Card>
//   </Deck>
import { useEffect, useRef } from "react";

export function Deck({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const deck = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    // For each card after the first: how far it has slid into place (0-1).
    // A card's depth is the sum of that for every card above it.
    const update = () => {
      frame = 0;
      const cards = [...deck.querySelectorAll(".deck-card")];
      const vh = window.innerHeight;
      const arrived = cards.map((card, i) => {
        if (i === 0) return 0;
        const stick = parseFloat(getComputedStyle(card).top);
        const top = card.getBoundingClientRect().top;
        return Math.min(1, Math.max(0, (vh - top) / (vh - stick)));
      });
      cards.forEach((card, i) => {
        const depth = reduce.matches ? 0 : arrived.slice(i + 1).reduce((a, b) => a + b, 0);
        card.style.setProperty("--depth", depth.toFixed(3));
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="deck" ref={ref}>
      {children}
    </div>
  );
}

//   index, total  position in the deck ("02 / 04")
//   title         card heading
//   subtitle      one line under the heading (the takeaway)
//   controls      inputs in the top-right corner (country, year...)
//   aside         optional side panel (legend, numbers)
export function Card({ index, total, title, subtitle, controls, aside, children }) {
  const n = (v) => String(v).padStart(2, "0");
  return (
    <section className="deck-card" style={{ "--i": index }} aria-labelledby={`card-${index}`}>
      <header className="card-head">
        <div className="card-titles">
          <span className="card-num">{n(index + 1)} / {n(total)}</span>
          <h2 id={`card-${index}`}>{title}</h2>
          {subtitle && <p className="card-sub">{subtitle}</p>}
        </div>
        {controls && <div className="card-controls">{controls}</div>}
      </header>
      <div className={`card-body${aside ? " has-aside" : ""}`}>
        <div className="card-chart">{children}</div>
        {aside && <aside className="card-aside">{aside}</aside>}
      </div>
    </section>
  );
}
