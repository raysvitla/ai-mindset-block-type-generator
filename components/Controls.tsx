import React from 'react';
import { AppState, PresetName } from '../types';
import { BRAND_PRESETS, COLORS } from '../constants';
import { RefreshCw, Download, Type, Layers, Palette, Grid } from 'lucide-react';

interface ControlsProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onExport: () => void;
  isExporting: boolean;
}

const Controls: React.FC<ControlsProps> = ({ state, onChange, onExport, isExporting }) => {
  
  const handlePresetClick = (preset: { name: PresetName; color: string }) => {
    // Automatically set high contrast text for darker colors
    const needsWhiteText = [
      PresetName.AUTOMATION,
      PresetName.TEAMS,
      PresetName.SIGNAL,
      PresetName.CODING
    ].includes(preset.name);

    onChange({ 
      blockColor: preset.color,
      textColor: needsWhiteText ? '#FCFCFC' : COLORS.GRAPHITE
    });
  };

  return (
    <div className="w-full md:w-80 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 h-screen overflow-y-auto p-6 flex flex-col gap-8 text-neutral-300 shadow-2xl z-10">
      
      {/* Header */}
      <div>
        <h1 className="text-white text-xl font-bold tracking-tight mb-1">AI Mindset</h1>
        <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold">Brand Generator</p>
      </div>

      {/* Text Input */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Type size={14} /> Content
        </label>
        <textarea
          value={state.text}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={4}
          className="w-full bg-neutral-800 border-neutral-700 border rounded-md p-3 text-white text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none font-mono"
          placeholder="ENTER TEXT HERE"
        />
      </div>

      {/* Brand Presets */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Palette size={14} /> Brand Presets
        </label>
        <div className="grid grid-cols-1 gap-2">
          {BRAND_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset)}
              className="group relative flex items-center justify-between px-3 py-2 rounded border border-neutral-700 hover:border-neutral-500 transition-all bg-neutral-800 hover:bg-neutral-750"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-sm shadow-sm" 
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-xs font-bold text-neutral-300">{preset.name}</span>
              </div>
              {state.blockColor === preset.color && (
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Typography & Layout Controls */}
      <div className="flex flex-col gap-4">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Grid size={14} /> Typography & Layout
        </label>

        {/* Font Size */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Size</span>
            <span>{state.fontSize}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="120"
            value={state.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Line Height */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Line Height</span>
            <span>{state.lineHeight.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.0"
            step="0.1"
            value={state.lineHeight}
            onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Spacing</span>
            <span>{state.letterSpacing}px</span>
          </div>
          <input
            type="range"
            min="-5"
            max="20"
            value={state.letterSpacing}
            onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Randomize Layout */}
        <button
          onClick={() => onChange({ layoutSeed: Math.random() })}
          className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700 text-xs font-bold uppercase transition-colors"
        >
          <RefreshCw size={14} /> Randomize Pattern
        </button>
      </div>

      {/* Manual Overrides */}
      <div className="flex flex-col gap-3">
         <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Layers size={14} /> Overrides
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-neutral-500">Block Fill</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.blockColor}
                onChange={(e) => onChange({ blockColor: e.target.value })}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-neutral-400">{state.blockColor}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-neutral-500">Text Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-neutral-400">{state.textColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Effects & Export */}
      <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-neutral-800">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Transparent BG</span>
          <input
            type="checkbox"
            checked={state.transparentBackground}
            onChange={(e) => onChange({ transparentBackground: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-600 bg-neutral-700 accent-blue-600 focus:ring-offset-neutral-900"
          />
        </label>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase text-sm tracking-wide shadow-lg hover:shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Processing...' : (
            <>
              <Download size={16} /> Download Asset
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-2 pt-4 border-t border-neutral-800 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-[10px] text-neutral-500">
            made by Ray Svitla // stay evolving 🐌
          </p>
          <a 
            href="https://svit.la/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-semibold text-neutral-400 hover:text-white transition-colors border-b border-transparent hover:border-neutral-500"
          >
            svit.la
          </a>
        </div>
      </div>

    </div>
  );
};

export default Controls;