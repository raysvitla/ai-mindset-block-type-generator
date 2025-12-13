import React, { useState, useRef } from 'react';
import domtoimage from 'dom-to-image';
import Controls from './components/Controls';
import Canvas from './components/Canvas';
import { AppState } from './types';
import { COLORS, DEFAULT_TEXT } from './constants';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [state, setState] = useState<AppState>({
    text: DEFAULT_TEXT,
    textColor: '#FCFCFC', // Default to soft white text since default block is Indigo
    blockColor: COLORS.AUTOMATION_INDIGO,
    backgroundColor: COLORS.PAPER_WHITE,
    fontSize: 64,
    lineHeight: 1.1,
    letterSpacing: 0,
    layoutSeed: 12345,
    transparentBackground: true,
  });

  const handleStateChange = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;
    
    try {
      setIsExporting(true);
      const node = canvasRef.current;
      const scale = 3; // Retina quality

      const config = {
        width: node.clientWidth * scale,
        height: node.clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${node.clientWidth}px`,
          height: `${node.clientHeight}px`,
        },
      };

      const dataUrl = await domtoimage.toPng(node, config);
      
      const link = document.createElement('a');
      link.download = `ai-mindset-${Date.now()}.png`;
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