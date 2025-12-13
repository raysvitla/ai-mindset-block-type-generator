import React, { useRef } from 'react';
import { AppState, PresetName } from '../types';
import { BRAND_PRESETS, COLORS } from '../constants';
import { RefreshCw, Download, Type, Layers, Palette, Grid, Image as ImageIcon, BoxSelect, Bold, Trash2 } from 'lucide-react';

interface ControlsProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onExport: () => void;
  isExporting: boolean;
}

const Controls: React.FC<ControlsProps> = ({ state, onChange, onExport, isExporting }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePresetClick = (preset: { name: PresetName; color: string }) => {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({ backgroundImage: url, transparentBackground: false });
    }
  };

  return (
    <div className="w-full md:w-80 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 h-screen overflow-y-auto p-5 flex flex-col gap-6 text-neutral-300 shadow-2xl z-10 custom-scrollbar">
      
      {/* Header */}
      <div>
        <h1 className="text-white text-lg font-bold tracking-tight mb-0.5">AI Mindset v2.0</h1>
        <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold">Thumbnail Generator</p>
      </div>

      {/* SECTION 1: CONTENT */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Type size={12} /> Content
        </label>
        <textarea
          value={state.text}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={3}
          className="w-full bg-neutral-800 border-neutral-700 border rounded-md p-3 text-white text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none font-mono"
          placeholder="ENTER TEXT HERE"
        />
      </div>

      {/* SECTION 2: STYLE & PRESETS */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Palette size={12} /> Brand Style
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {BRAND_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset)}
              className="group relative flex items-center justify-between px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 transition-all bg-neutral-800 hover:bg-neutral-750"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm shadow-sm" 
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-[11px] font-bold text-neutral-300">{preset.name}</span>
              </div>
              {state.blockColor === preset.color && (
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: BACKGROUND */}
      <div className="flex flex-col gap-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-800">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <ImageIcon size={12} /> Background
        </label>

        {/* Upload Image */}
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs font-semibold hover:bg-neutral-700 transition-colors"
          >
            {state.backgroundImage ? 'Change Image' : 'Upload Image'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          {state.backgroundImage && (
            <button 
              onClick={() => onChange({ backgroundImage: null })}
              className="px-2 bg-neutral-800 border border-neutral-700 rounded hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Overlay Opacity (Only if Image) */}
        {state.backgroundImage && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Overlay Opacity</span>
              <span>{Math.round(state.overlayOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.overlayOpacity}
              onChange={(e) => onChange({ overlayOpacity: Number(e.target.value) })}
              className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}

        {/* Swiss Grid Toggle */}
        {!state.backgroundImage && (
          <label className="flex items-center justify-between cursor-pointer group mt-1">
            <span className="text-xs text-neutral-400 group-hover:text-neutral-200">Swiss Grid</span>
            <input
              type="checkbox"
              checked={state.showGrid}
              onChange={(e) => onChange({ showGrid: e.target.checked })}
              className="w-3 h-3 rounded border-neutral-600 bg-neutral-700 accent-blue-600"
            />
          </label>
        )}
      </div>

      {/* SECTION 4: TYPOGRAPHY & EFFECTS */}
      <div className="flex flex-col gap-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Grid size={12} /> Typography & Effects
        </label>

        {/* Font Weight & Shadow Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ isBold: !state.isBold })}
            className={`flex-1 py-1.5 px-2 rounded border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              state.isBold ? 'bg-blue-900/30 border-blue-600 text-blue-100' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
          >
            <Bold size={12} /> Bold
          </button>
          
          <button
            onClick={() => onChange({ showShadows: !state.showShadows })}
            className={`flex-1 py-1.5 px-2 rounded border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              state.showShadows ? 'bg-blue-900/30 border-blue-600 text-blue-100' : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
          >
            <BoxSelect size={12} /> 3D Shadow
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
           {/* Font Size */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Size</span>
              <span>{state.fontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="160"
              value={state.fontSize}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
              className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Line Height */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Leading</span>
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
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>Tracking</span>
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
        </div>

        {/* Randomize */}
        <button
          onClick={() => onChange({ layoutSeed: Math.random() })}
          className="mt-1 flex items-center justify-center gap-2 w-full py-2 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700 text-xs font-bold uppercase transition-colors"
        >
          <RefreshCw size={12} /> Randomize Layout
        </button>
      </div>

      {/* SECTION 5: EXPORT */}
      <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-neutral-800">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">Transparent PNG</span>
          <input
            type="checkbox"
            checked={state.transparentBackground}
            disabled={!!state.backgroundImage} // Disable if image is set
            onChange={(e) => onChange({ transparentBackground: e.target.checked })}
            className="w-3 h-3 rounded border-neutral-600 bg-neutral-700 accent-blue-600 disabled:opacity-50"
          />
        </label>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase text-xs tracking-wide shadow-lg hover:shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Processing...' : (
            <>
              <Download size={14} /> Download Asset
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-1 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
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