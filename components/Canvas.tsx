import React, { useMemo } from 'react';
import { AppState } from '../types';

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
    backgroundImage,
    overlayOpacity,
    showGrid,
    showShadows,
    isBold,
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

  // CSS for the Swiss Grid pattern
  const gridStyle = showGrid && !backgroundImage ? {
    backgroundImage: `
      linear-gradient(rgba(150, 150, 150, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(150, 150, 150, 0.2) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px'
  } : {};

  // CSS for Background Image
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } : {};

  return (
    <div className="flex-1 bg-neutral-200 h-screen overflow-auto flex items-center justify-center p-8 relative">
      
      {/* Workspace Pattern (not exported) */}
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
        className="relative shadow-2xl transition-all duration-300 ease-out origin-center overflow-hidden"
        style={{
          // Base Background logic
          backgroundColor: transparentBackground && !backgroundImage ? 'transparent' : backgroundColor,
          ...backgroundStyle,
          minWidth: '1280px', // Standard YouTube Aspect Ratio 16:9
          minHeight: '720px',
          width: '1280px',
          height: '720px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px', // Default padding, adjust as needed
        }}
      >
        {/* Layer 1: Swiss Grid (Only if no image, or if we want it blended. Here sticking to logic: Grid OR Image) */}
        {!backgroundImage && showGrid && (
          <div className="absolute inset-0 pointer-events-none z-0" style={gridStyle} />
        )}

        {/* Layer 2: Color Overlay for Image (Tint) */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply"
            style={{ 
              backgroundColor: blockColor, // Tint with the brand color
              opacity: overlayOpacity 
            }}
          />
        )}
        
        {/* Alternate Layer: Darkener if block color tint isn't desired, but prompt asked for overlay. 
            Usually tints are better for readability. We can also do a standard black overlay.
            Let's stick to a generic dark overlay tinting towards the brand color for style. */}

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
                className={`inline-block uppercase ${isBold ? 'font-bold' : 'font-light'}`}
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
                  // Hard Shadow logic
                  boxShadow: showShadows ? '12px 12px 0px rgba(0,0,0,0.4)' : 'none',
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

      </div>
    </div>
  );
};

export default Canvas;