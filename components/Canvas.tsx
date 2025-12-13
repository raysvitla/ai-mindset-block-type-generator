import React, { useMemo, useEffect, useState, useRef } from 'react';
import { AppState } from '../types';
import { FORMATS } from '../constants';

interface CanvasProps {
  state: AppState;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const Canvas: React.FC<CanvasProps> = ({ state, canvasRef }) => {
  // This ref is for the fluid container (the available screen space)
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);

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
    textPosition,
    textAlignment,
    brandTag,
    logoImage,
    logoSize,
    invertLogo,
    speakers,
    speakerGrayscale,
    format
  } = state;

  const currentFormat = FORMATS[format];

  // --- LAYOUT CONFIGURATION (v5.0) ---
  const layout = useMemo(() => {
     // Base values
     const BASE_PAD = 40;
     
     switch (format) {
       case 'YOUTUBE': // 1920x1080
         return {
           textScale: 1.0,      // Main Text Baseline
           speakerScale: 2.0,   // Request: 2.0x Bigger
           tagScale: 1.8,       // Request: 1.8x Bigger
           topOffset: BASE_PAD, 
           sideOffset: 60,      // Slightly more breathing room for wide HD
         };
       case 'SQUARE': // 1080x1080
         return {
           textScale: 1.2,
           speakerScale: 1.2,
           tagScale: 1.2,
           topOffset: BASE_PAD,
           sideOffset: BASE_PAD,
         };
       case 'STORY': // 1080x1920
         return {
           textScale: 1.5,
           speakerScale: 1.4,
           tagScale: 1.5,
           topOffset: 160,      // CRITICAL FIX: Safe Zone for Instagram UI
           sideOffset: BASE_PAD,
         };
       case 'BANNER': // 1920x640 (New in v5.0)
         return {
           textScale: 0.9,      // Slightly smaller to fit vertical constraint
           speakerScale: 1.1,   // Conservative size to prevent overflow
           tagScale: 1.2,
           topOffset: BASE_PAD,
           sideOffset: 60,      // Wide format padding
         };
       default:
         return { 
            textScale: 1, 
            speakerScale: 1, 
            tagScale: 1, 
            topOffset: BASE_PAD, 
            sideOffset: BASE_PAD 
         };
     }
  }, [format]);

  // Derived styling values
  const effectiveFontSize = fontSize * layout.textScale;
  
  // Keep Logo scale consistent with text or manual slider, 
  // but let's apply a slight boost for Story so it's visible at bottom.
  const effectiveLogoSize = logoImage ? logoSize * layout.textScale : 0;
  
  // Speaker dimensions (Reference: 96px base)
  const speakerBaseSize = 96;
  const speakerSize = speakerBaseSize * layout.speakerScale;

  // --- VIRTUAL VIEWPORT SCALING (v4.0 Logic) ---
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const padding = 64; // Space around the canvas
      const availableWidth = containerRef.current.clientWidth - padding;
      const availableHeight = containerRef.current.clientHeight - padding;
      
      const scaleX = availableWidth / currentFormat.width;
      const scaleY = availableHeight / currentFormat.height;
      
      // Calculate the scale needed to fit the HUGE fixed canvas into the available div
      const fitScale = Math.min(scaleX, scaleY);
      
      setPreviewScale(fitScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentFormat]);

  // Process text into words
  const processedWords = useMemo(() => {
    const random = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    return words.map((word, i) => {
      const r1 = random(layoutSeed + i);
      const r2 = random(layoutSeed + i + 100);

      const forceBreak = i > 0 && r1 > 0.8;
      
      let marginLeft = 0;
      if (textAlignment === 'left') {
         // Indentation also scales
         const margins = [0, 0, 16 * layout.textScale, 32 * layout.textScale];
         marginLeft = margins[Math.floor(r2 * margins.length)];
      }

      return {
        text: word,
        forceBreak,
        marginLeft,
      };
    });
  }, [text, layoutSeed, textAlignment, layout.textScale]);

  // CSS for Backgrounds
  const gridStyle = showGrid && !backgroundImage ? {
    backgroundImage: `
      linear-gradient(rgba(150, 150, 150, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(150, 150, 150, 0.2) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px'
  } : {};

  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <div 
      ref={containerRef}
      id="preview-wrapper"
      className="flex-1 bg-neutral-200 h-screen overflow-hidden flex items-center justify-center relative"
    >
      
      {/* UI background pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* 
         THE SCALER WRAPPER 
      */}
      <div
        style={{
           transform: `scale(${previewScale})`, 
           transformOrigin: 'center center',
           transition: 'transform 0.1s linear',
           width: `${currentFormat.width}px`,
           height: `${currentFormat.height}px`,
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
        }}
      >
        {/* 
           THE CANVAS NODE (Fixed Dimensions)
        */}
        <div
            id="canvas-node"
            ref={canvasRef}
            className="relative overflow-hidden bg-white shadow-2xl"
            style={{
              width: `${currentFormat.width}px`,
              height: `${currentFormat.height}px`,
              minWidth: `${currentFormat.width}px`,
              minHeight: `${currentFormat.height}px`,
              backgroundColor: transparentBackground && !backgroundImage ? 'transparent' : backgroundColor,
              ...backgroundStyle,
            }}
        >
            {/* 1. Grid Layer (Z-0) */}
            {!backgroundImage && showGrid && (
              <div className="absolute inset-0 pointer-events-none z-0" style={gridStyle} />
            )}

            {/* 2. Overlay Layer (Z-0) */}
            {backgroundImage && (
              <div 
                className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply"
                style={{ backgroundColor: blockColor, opacity: overlayOpacity }}
              />
            )}

            {/* 3. Logo Watermark (Z-5) */}
            {logoImage && (
              <div 
                className="absolute z-0 opacity-90 pointer-events-none"
                style={{ 
                   bottom: `${48 * layout.textScale}px`, 
                   right: `${48 * layout.textScale}px` 
                }}
              >
                <img 
                  src={logoImage} 
                  alt="Logo" 
                  style={{ 
                    height: `${effectiveLogoSize}px`, 
                    objectFit: 'contain',
                    filter: invertLogo ? 'invert(1)' : 'none',
                    transition: 'filter 0.3s ease'
                  }}
                />
              </div>
            )}

            {/* 4. Brand Badge (Z-30) */}
            {brandTag && (
              <div 
                className="absolute z-30"
                style={{ 
                   top: `${layout.topOffset}px`, 
                   left: `${layout.sideOffset}px` 
                }}
              >
                <div 
                  className="inline-block font-mono font-bold tracking-wider"
                  style={{ 
                    backgroundColor: blockColor, 
                    color: textColor, 
                    boxShadow: showShadows ? `${6 * layout.tagScale}px ${6 * layout.tagScale}px 0px rgba(0,0,0,0.3)` : 'none',
                    padding: `${8 * layout.tagScale}px ${16 * layout.tagScale}px`,
                    fontSize: `${20 * layout.tagScale}px`
                  }}
                >
                  {`{ ${brandTag} }`}
                </div>
              </div>
            )}

            {/* 5. Speakers Module (Z-20) */}
            {speakers.length > 0 && (
              <div 
                className="absolute flex flex-col items-end z-20"
                style={{
                  top: `${layout.topOffset}px`,
                  right: `${layout.sideOffset}px`,
                  gap: `${16 * layout.speakerScale}px`
                }}
              >
                {speakers.map((speaker) => (
                   <div 
                    key={speaker.id} 
                    className="flex flex-row-reverse items-center bg-black/60 backdrop-blur-sm rounded-l-xl border-r-4" 
                    style={{ 
                      borderColor: blockColor,
                      padding: `${12 * layout.speakerScale}px`,
                      gap: `${16 * layout.speakerScale}px`
                    }}
                   >
                      {/* Photo */}
                      {speaker.image && (
                        <div 
                          className="bg-neutral-800 overflow-hidden shadow-lg border-2 border-white/20" 
                          style={{ 
                            borderRadius: '50%',
                            width: `${speakerSize}px`,
                            height: `${speakerSize}px`
                          }}
                        > 
                           <img 
                            src={speaker.image} 
                            className="w-full h-full object-cover"
                            style={{ filter: speakerGrayscale ? 'grayscale(100%)' : 'none' }}
                           />
                        </div>
                      )}
                      {/* Text Info */}
                      <div className="text-right">
                        <div 
                          className="bg-white text-black inline-block font-bold uppercase tracking-tight transform -skew-x-6"
                          style={{
                            padding: `${2 * layout.speakerScale}px ${8 * layout.speakerScale}px`,
                            marginBottom: `${4 * layout.speakerScale}px`,
                            fontSize: `${18 * layout.speakerScale}px`
                          }}
                        >
                           {speaker.name}
                        </div>
                        {speaker.role && (
                          <div 
                            className="text-white font-mono uppercase tracking-wide opacity-90"
                            style={{ fontSize: `${14 * layout.speakerScale}px` }}
                          >
                            {speaker.role}
                          </div>
                        )}
                      </div>
                   </div>
                ))}
              </div>
            )}

            {/* 6. Main Text (Z-10) */}
            <div 
              className="absolute z-10 w-full pointer-events-none"
              style={{
                maxWidth: '80%',
                left: `${textPosition.x}%`,
                top: `${textPosition.y}%`,
                transform: 'translate(-50%, -50%)',
                textAlign: textAlignment,
              }}
            >
               <div style={{ lineHeight }}>
                  {processedWords.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.forceBreak && <div className="w-full h-0 basis-full" />}
                      <span
                        className={`inline-block uppercase ${isBold ? 'font-bold' : 'font-light'}`}
                        style={{
                          backgroundColor: blockColor,
                          color: textColor,
                          fontSize: `${effectiveFontSize}px`,
                          letterSpacing: `${letterSpacing}px`,
                          marginLeft: textAlignment === 'left' ? `${item.marginLeft}px` : '0',
                          marginRight: textAlignment === 'right' ? `${item.marginLeft}px` : '0',
                          marginBottom: `${effectiveFontSize * 0.1}px`,
                          padding: '0.1em 0.25em',
                          boxShadow: showShadows ? `${16 * layout.textScale}px ${16 * layout.textScale}px 0px rgba(0,0,0,0.4)` : 'none',
                          boxDecorationBreak: 'clone', 
                          WebkitBoxDecorationBreak: 'clone',
                        }}
                      >
                        {item.text}
                      </span>
                      {/* Space between words if not breaking */}
                      {!item.forceBreak && <span className="inline-block" style={{ width: '0.2em' }} />} 
                    </React.Fragment>
                  ))}
               </div>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default Canvas;