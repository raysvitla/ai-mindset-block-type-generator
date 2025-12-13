import React, { useMemo, useRef } from 'react';
import { AppState } from '../types';
import { COLORS } from '../constants';

interface CanvasProps {
  state: AppState;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const Canvas: React.FC<CanvasProps> = ({ state, canvasRef }) => {
  const {
    text,
    textColor,
    blockColor,
    backgroundColor,
    fontSize,
    lineHeight,
    letterSpacing,
    layoutSeed,
    transparentBackground,
  } = state;

  // Process text into words with random spacing to achieve the "Constructivist" jagged look
  const processedWords = useMemo(() => {
    // Simple pseudo-random generator seeded by layoutSeed
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    return words.map((word, i) => {
      // Generate deterministic random values based on seed + word index
      const r1 = random(layoutSeed + i);
      const r2 = random(layoutSeed + i + 100);

      // Determine logic for jagged edges
      // 30% chance of a line break before the word (if not first)
      const forceBreak = i > 0 && r1 > 0.7;
      
      // Random margin (steps)
      // We use standard tailwind spacing multipliers or pixel values
      const margins = [0, 16, 32, 48, 64];
      const marginLeft = margins[Math.floor(r2 * margins.length)];

      return {
        text: word,
        forceBreak,
        marginLeft,
      };
    });
  }, [text, layoutSeed]);

  return (
    <div className="flex-1 bg-neutral-200 h-screen overflow-auto flex items-center justify-center p-8 relative">
      
      {/* Pattern Background for the workspace (not exported) */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* The Exportable Canvas Node */}
      <div
        id="canvas-export"
        ref={canvasRef}
        className="relative shadow-2xl transition-all duration-300 ease-out origin-center"
        style={{
          backgroundColor: transparentBackground ? 'transparent' : backgroundColor,
          minWidth: '800px',
          minHeight: '600px',
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {/* Text Rendering Container */}
        <div 
          className="relative z-10 flex flex-wrap content-start items-start w-full"
          style={{
            lineHeight: lineHeight,
          }}
        >
          {processedWords.map((item, index) => (
            <React.Fragment key={index}>
              {item.forceBreak && <div className="w-full h-0 basis-full" />}
              <span
                className="inline-block font-light uppercase"
                style={{
                  backgroundColor: blockColor,
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  letterSpacing: `${letterSpacing}px`,
                  marginLeft: `${item.marginLeft}px`,
                  marginBottom: `${fontSize * 0.1}px`, // Slight gap vertical
                  paddingLeft: '0.2em',
                  paddingRight: '0.2em',
                  paddingTop: '0.05em',
                  paddingBottom: '0.05em',
                  // Ensure sharp edges
                  boxDecorationBreak: 'clone', 
                  WebkitBoxDecorationBreak: 'clone',
                }}
              >
                {item.text}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Watermark / Brand Footer (Optional, typically used in brand tools) */}
        <div className="absolute bottom-8 right-8 opacity-0">
          {/* Hidden by default, but structure exists if needed */}
        </div>

      </div>
    </div>
  );
};

export default Canvas;