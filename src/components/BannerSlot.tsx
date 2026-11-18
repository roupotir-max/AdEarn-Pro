import React from 'react';

interface BannerSlotProps {
  content: string;
  position: 'top' | 'bottom';
}

export const BannerSlot: React.FC<BannerSlotProps> = ({ content, position }) => {
  const trimmed = content.trim();
  if (!trimmed) return null;

  const isUrl = /^https?:\/\//i.test(trimmed);

  return (
    <div
      className={
        position === 'top'
          ? 'w-full h-[50px] bg-[#131c31] border-b border-white/10 flex items-center justify-center overflow-hidden'
          : 'fixed bottom-[64px] lg:bottom-0 left-0 right-0 z-30 h-[50px] bg-[#131c31] border-t border-white/10 flex items-center justify-center overflow-hidden'
      }
      aria-label={position === 'top' ? 'টপ ব্যানার অ্যাড' : 'বটম ব্যানার অ্যাড'}
    >
      <div className="w-full max-w-5xl h-full mx-auto">
        {isUrl ? (
          <iframe
            src={trimmed}
            title={position === 'top' ? 'Top Banner Ad' : 'Bottom Banner Ad'}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <iframe
            srcDoc={`<!doctype html><html><body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;height:100%;background:transparent;color:#fbbf24;font-family:sans-serif;font-size:12px;">${trimmed}</body></html>`}
            title={position === 'top' ? 'Top Banner Ad' : 'Bottom Banner Ad'}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );
};
