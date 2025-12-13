import React, { useState, useRef } from 'react';
import domtoimage from 'dom-to-image';
import Controls from './components/Controls';
import Canvas from './components/Canvas';
import { AppState } from './types';
import { COLORS, DEFAULT_TEXT, FORMATS } from './constants';

const App: React.FC = () => {
  // canvasRef points to the FIXED dimension node (1920x1080), not the wrapper
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [state, setState] = useState<AppState>({
    text: DEFAULT_TEXT,
    textColor: '#FCFCFC',
    blockColor: COLORS.AUTOMATION_INDIGO,
    backgroundColor: COLORS.PAPER_WHITE,
    fontSize: 80,
    lineHeight: 1.1,
    letterSpacing: 0,
    layoutSeed: 12345,
    transparentBackground: false, 
    
    // v2.0 Defaults
    backgroundImage: null,
    overlayOpacity: 0.6,
    showGrid: false,
    showShadows: true,
    isBold: true,

    // v3.5/v4.0 Defaults
    format: 'YOUTUBE',
    textPosition: { x: 50, y: 50 },
    textAlignment: 'left',
    brandTag: 'EPISODE 01',
    logoImage: null, 
    logoSize: 100,
    invertLogo: false, 
    speakers: [],
    speakerGrayscale: true,
  });

  const handleStateChange = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    
    try {
      setIsExporting(true);
      const node = canvasRef.current;
      const currentFormat = FORMATS[state.format];
      
      // CRITICAL V4.0 FIX:
      // The node in the DOM is ALREADY 1920x1080 (or format size).
      // We just need to tell dom-to-image to capture it at that exact size.
      // We pass 'transform: none' to ensure no parent styling interferes.
      const config = {
        width: currentFormat.width,
        height: currentFormat.height,
        style: {
          transform: 'none', 
          transformOrigin: 'top left',
          width: `${currentFormat.width}px`,
          height: `${currentFormat.height}px`,
          margin: '0',
          padding: '0'
        },
      };

      const dataUrl = await domtoimage.toPng(node, config);
      
      const link = document.createElement('a');
      link.download = `ai-mindset-${state.format.toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-900">
      <Controls 
        state={state} 
        onChange={handleStateChange}
        onExport={handleExport}
        isExporting={isExporting}
      />
      <Canvas 
        state={state} 
        canvasRef={canvasRef}
      />
    </div>
  );
};

export default App;