'use client';

import * as React from 'react';

interface TimelessByMeerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function TimelessByMeer({ size = "lg" }: TimelessByMeerProps) {
  const scale = {
    xs: { main: "text-[12px]", sub: "text-[11px]", spacing: "tracking-[4px]", subSpacing: "tracking-[5px]", gap: "my-0.5", dividerWidth: "max-w-[80px]", bySize: "text-[8px] tracking-[2px]", diamond: "w-[3px] h-[3px]" },
    sm: { main: "text-2xl", sub: "text-xl", spacing: "tracking-[6px]", subSpacing: "tracking-[8px]", gap: "my-1.5", dividerWidth: "max-w-[200px]", bySize: "text-[11px] tracking-[3px]", diamond: "w-[4px] h-[4px]" },
    md: { main: "text-4xl", sub: "text-3xl", spacing: "tracking-[8px]", subSpacing: "tracking-[10px]", gap: "my-2", dividerWidth: "max-w-[260px]", bySize: "text-[13px] tracking-[4px]", diamond: "w-[5px] h-[5px]" },
    lg: { main: "text-5xl", sub: "text-4xl", spacing: "tracking-[10px]", subSpacing: "tracking-[12px]", gap: "my-2", dividerWidth: "max-w-[320px]", bySize: "text-[13px] tracking-[4px]", diamond: "w-[5px] h-[5px]" },
  }[size] || { main: "", sub: "", spacing: "", subSpacing: "", gap: "", dividerWidth: "", bySize: "", diamond: "" };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .tbm-main-text  { font-family: var(--font-cinzel), serif; }
        .tbm-by-text    { font-family: var(--font-cormorant), serif; }
        .tbm-label-text { font-family: var(--font-montserrat), sans-serif; }

        .tbm-glow {
          text-shadow: 0 0 40px rgba(201,168,76,0.35), 0 2px 6px rgba(0,0,0,0.9);
        }
      `}} />

      <div className="relative flex flex-col items-center justify-center select-none bg-transparent w-full">
        {/* TIMELESS */}
        <h1 className={`tbm-main-text font-semibold ${scale.main} ${scale.spacing} text-[#f0d98a] uppercase leading-none tbm-glow text-center`}>
          Timeless
        </h1>

        {/* Divider with "by" */}
        <div className={`flex items-center justify-center gap-1.5 ${scale.gap} w-full ${scale.dividerWidth}`}>
          <div className="flex-1 h-px bg-[#c9a84c] opacity-50" />
          <div className={`${scale.diamond} border border-[#c9a84c] rotate-45 flex-shrink-0`} />
          <p className={`tbm-by-text italic font-light ${scale.bySize} text-[#c9a84c] lowercase opacity-80 leading-none`}>
            by
          </p>
          <div className={`${scale.diamond} border border-[#c9a84c] rotate-45 flex-shrink-0`} />
          <div className="flex-1 h-px bg-[#c9a84c] opacity-50" />
        </div>

        {/* MEER */}
        <h2 className={`tbm-main-text font-normal ${scale.sub} ${scale.subSpacing} text-[#f0d98a] uppercase leading-none tbm-glow text-center`}>
          Meer
        </h2>
      </div>
    </>
  );
}
