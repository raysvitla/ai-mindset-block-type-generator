import React, { useRef } from 'react';
import { AppState, PresetName, Speaker, FormatType } from '../types';
import { BRAND_PRESETS, COLORS, FORMATS } from '../constants';
import { 
  Download, Type, Palette, Grid, Image as ImageIcon, 
  BoxSelect, Bold, Trash2, UserPlus, AlignLeft, 
  AlignCenter, AlignRight, Move, BadgeCheck, Users, Upload, RefreshCcw, LayoutTemplate, Layers
} from 'lucide-react';

interface ControlsProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onExport: () => void;
  isExporting: boolean;
}

const Controls: React.FC<ControlsProps> = ({ state, onChange, onExport, isExporting }) => {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const speakerInputRef = useRef<HTMLInputElement>(null);
  const [activeSpeakerId, setActiveSpeakerId] = React.useState<string | null>(null);

  // --- Handlers ---

  const handlePresetClick = (preset: { name: PresetName; color: string }) => {
    // Determine if text should be white based on block brightness
    // GRAPHITE, AUTOMATION, TEAMS, SIGNAL, CODING -> White Text
    // WHITE, CIRCLE -> Dark Text
    const needsWhiteText = [
      PresetName.GRAPHITE,
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'bg' | 'logo' | 'speaker') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'bg') onChange({ backgroundImage: url, transparentBackground: false });
      if (type === 'logo') onChange({ logoImage: url });
      if (type === 'speaker' && activeSpeakerId) {
        const newSpeakers = state.speakers.map(s => s.id === activeSpeakerId ? { ...s, image: url } : s);
        onChange({ speakers: newSpeakers });
        setActiveSpeakerId(null);
      }
    }
  };

  const addSpeaker = () => {
    if (state.speakers.length >= 4) return;
    const newSpeaker: Speaker = {
      id: Date.now().toString(),
      name: 'Name',
      role: 'Title',
      image: null
    };
    onChange({ speakers: [...state.speakers, newSpeaker] });
  };

  const updateSpeaker = (id: string, field: keyof Speaker, value: string) => {
    const newSpeakers = state.speakers.map(s => s.id === id ? { ...s, [field]: value } : s);
    onChange({ speakers: newSpeakers });
  };

  const removeSpeaker = (id: string) => {
    onChange({ speakers: state.speakers.filter(s => s.id !== id) });
  };

  const triggerSpeakerUpload = (id: string) => {
    setActiveSpeakerId(id);
    speakerInputRef.current?.click();
  };

  // --- Render ---

  return (
    <div className="w-full md:w-80 flex-shrink-0 bg-neutral-900 border-r border-neutral-800 h-screen overflow-y-auto shadow-2xl z-10 custom-scrollbar flex flex-col">
      
      {/* Fixed Header */}
      <div className="p-5 border-b border-neutral-800">
        <h1 className="text-white text-lg font-bold tracking-tight mb-0.5">AI Mindset v5.1</h1>
        <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold">Multi-Format Generator</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">

        {/* 1. FORMAT & BACKGROUND */}
        <details className="group bg-neutral-800/30 rounded-lg border border-neutral-800 open:bg-neutral-800/50 open:border-neutral-700 transition-all" open>
          <summary className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-400 cursor-pointer hover:text-white flex items-center justify-between">
            <span className="flex items-center gap-2"><LayoutTemplate size={14} /> Format & Canvas</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-3 pt-0 flex flex-col gap-4">
             {/* Format Switcher */}
             <div className="grid grid-cols-4 gap-1 bg-neutral-900 p-1 rounded border border-neutral-800">
                {(Object.keys(FORMATS) as FormatType[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => onChange({ format: fmt })}
                    className={`text-[10px] font-bold py-1.5 rounded transition-all ${state.format === fmt ? 'bg-neutral-700 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    {FORMATS[fmt].label}
                  </button>
                ))}
             </div>

             <div className="flex gap-2">
              <button 
                onClick={() => bgInputRef.current?.click()}
                className="flex-1 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs font-semibold hover:bg-neutral-700 transition-colors"
              >
                {state.backgroundImage ? 'Replace BG' : 'Upload BG'}
              </button>
              <input type="file" ref={bgInputRef} onChange={(e) => handleImageUpload(e, 'bg')} accept="image/*" className="hidden" />
              {state.backgroundImage && (
                <button onClick={() => onChange({ backgroundImage: null })} className="px-2 bg-neutral-800 border border-neutral-700 rounded hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            
            {state.backgroundImage && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-neutral-400"><span>Overlay</span><span>{Math.round(state.overlayOpacity * 100)}%</span></div>
                <input type="range" min="0" max="1" step="0.05" value={state.overlayOpacity} onChange={(e) => onChange({ overlayOpacity: Number(e.target.value) })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
            )}
            {!state.backgroundImage && (
              <div className="space-y-2 pt-1 border-t border-neutral-800/50">
                <label className="flex items-center justify-between cursor-pointer group hover:bg-neutral-800/50 p-1 rounded transition-colors">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Grid size={12} />
                    <span>Swiss Grid</span>
                  </div>
                  <input type="checkbox" checked={state.showGrid} onChange={(e) => onChange({ showGrid: e.target.checked })} className="w-3 h-3 rounded border-neutral-600 bg-neutral-700 accent-blue-600 cursor-pointer" />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer group hover:bg-neutral-800/50 p-1 rounded transition-colors">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Layers size={12} />
                    <span>Transparent Background</span>
                  </div>
                  <input type="checkbox" checked={state.transparentBackground} onChange={(e) => onChange({ transparentBackground: e.target.checked })} className="w-3 h-3 rounded border-neutral-600 bg-neutral-700 accent-blue-600 cursor-pointer" />
                </label>
              </div>
            )}
          </div>
        </details>

        {/* 2. MAIN CONTENT (Typography) */}
        <details className="group bg-neutral-800/30 rounded-lg border border-neutral-800 open:bg-neutral-800/50 open:border-neutral-700 transition-all">
          <summary className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-400 cursor-pointer hover:text-white flex items-center justify-between">
            <span className="flex items-center gap-2"><Type size={14} /> Typography</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-3 pt-0 flex flex-col gap-4">
            <textarea
              value={state.text}
              onChange={(e) => onChange({ text: e.target.value })}
              rows={3}
              className="w-full bg-neutral-900 border-neutral-700 border rounded p-2 text-white text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none font-mono"
            />
            
            {/* Position */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-neutral-500 flex items-center gap-1"><Move size={10} /> Position X / Y</label>
              <div className="flex gap-2">
                <input type="range" min="0" max="100" value={state.textPosition.x} onChange={(e) => onChange({ textPosition: { ...state.textPosition, x: Number(e.target.value) } })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                <input type="range" min="0" max="100" value={state.textPosition.y} onChange={(e) => onChange({ textPosition: { ...state.textPosition, y: Number(e.target.value) } })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
            </div>

            {/* Alignment */}
            <div className="flex bg-neutral-900 rounded p-1 border border-neutral-700">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => onChange({ textAlignment: align })}
                  className={`flex-1 flex justify-center py-1 rounded hover:bg-neutral-700 ${state.textAlignment === align ? 'bg-neutral-700 text-white' : 'text-neutral-500'}`}
                >
                  {align === 'left' && <AlignLeft size={14} />}
                  {align === 'center' && <AlignCenter size={14} />}
                  {align === 'right' && <AlignRight size={14} />}
                </button>
              ))}
            </div>

            {/* Sliders: Size & Leading */}
             <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                 <span className="text-[10px] text-neutral-500">Size</span>
                 <input type="range" min="20" max="150" value={state.fontSize} onChange={(e) => onChange({ fontSize: Number(e.target.value) })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] text-neutral-500">Leading</span>
                 <input type="range" min="0.8" max="2.0" step="0.1" value={state.lineHeight} onChange={(e) => onChange({ lineHeight: Number(e.target.value) })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
               </div>
             </div>
             
             <div className="flex gap-2">
                <button onClick={() => onChange({ isBold: !state.isBold })} className={`flex-1 py-1.5 text-xs border rounded ${state.isBold ? 'bg-blue-900/30 border-blue-600 text-blue-100' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}>Bold</button>
                <button onClick={() => onChange({ showShadows: !state.showShadows })} className={`flex-1 py-1.5 text-xs border rounded ${state.showShadows ? 'bg-blue-900/30 border-blue-600 text-blue-100' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}>Shadow</button>
                <button onClick={() => onChange({ layoutSeed: Math.random() })} className="flex-1 py-1.5 text-xs border border-neutral-700 bg-neutral-800 rounded text-neutral-400 hover:text-white"><Grid size={12} className="mx-auto" /></button>
             </div>
          </div>
        </details>

        {/* 3. SPEAKERS & BADGES */}
        <details className="group bg-neutral-800/30 rounded-lg border border-neutral-800 open:bg-neutral-800/50 open:border-neutral-700 transition-all">
          <summary className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-400 cursor-pointer hover:text-white flex items-center justify-between">
            <span className="flex items-center gap-2"><Users size={14} /> Guests ({state.speakers.length}/4)</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-3 pt-0 flex flex-col gap-3">
             {/* Tag */}
             <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase">Brand Tag</span>
                <input 
                  type="text" 
                  value={state.brandTag} 
                  onChange={(e) => onChange({ brandTag: e.target.value })}
                  className="w-full bg-neutral-900 border-neutral-700 border rounded p-2 text-white text-xs" 
                />
             </div>

             {/* Speakers */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800">
               <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                 <input type="checkbox" checked={state.speakerGrayscale} onChange={(e) => onChange({ speakerGrayscale: e.target.checked })} className="w-3 h-3 rounded border-neutral-600 bg-neutral-700 accent-blue-600" />
                 B&W Filter
               </label>
               <button onClick={addSpeaker} disabled={state.speakers.length >= 4} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 disabled:opacity-50">
                 <UserPlus size={12} /> Add Guest
               </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <input type="file" ref={speakerInputRef} onChange={(e) => handleImageUpload(e, 'speaker')} accept="image/*" className="hidden" />
              {state.speakers.map(speaker => (
                <div key={speaker.id} className="bg-neutral-900 border border-neutral-700 rounded p-2 flex gap-2 items-start">
                   <div 
                      onClick={() => triggerSpeakerUpload(speaker.id)}
                      className="w-10 h-10 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center cursor-pointer hover:border-blue-500 overflow-hidden shrink-0"
                   >
                      {speaker.image ? <img src={speaker.image} className="w-full h-full object-cover" /> : <Upload size={12} className="text-neutral-500" />}
                   </div>
                   <div className="flex-1 flex flex-col gap-1">
                      <input 
                        value={speaker.name} 
                        onChange={(e) => updateSpeaker(speaker.id, 'name', e.target.value)} 
                        className="bg-transparent border-b border-neutral-800 text-xs text-white focus:border-blue-500 outline-none pb-0.5" 
                        placeholder="Name"
                      />
                      <input 
                        value={speaker.role} 
                        onChange={(e) => updateSpeaker(speaker.id, 'role', e.target.value)} 
                        className="bg-transparent border-b border-neutral-800 text-[10px] text-neutral-400 focus:border-blue-500 outline-none pb-0.5" 
                        placeholder="Title"
                      />
                   </div>
                   <button onClick={() => removeSpeaker(speaker.id)} className="text-neutral-600 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* 4. LOGO (Reverted to Upload) */}
        <details className="group bg-neutral-800/30 rounded-lg border border-neutral-800 open:bg-neutral-800/50 open:border-neutral-700 transition-all">
          <summary className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-400 cursor-pointer hover:text-white flex items-center justify-between">
            <span className="flex items-center gap-2"><BadgeCheck size={14} /> Logo</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-3 pt-0 flex flex-col gap-3">
             <div className="space-y-1">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-neutral-500 uppercase">Logo Watermark</span>
                   <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={state.invertLogo} onChange={(e) => onChange({ invertLogo: e.target.checked })} className="w-3 h-3 rounded border-neutral-600 bg-neutral-700 accent-blue-600" />
                      <span className="text-[10px] text-neutral-400">Invert</span>
                   </label>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 py-2 bg-neutral-800 border border-neutral-700 rounded text-xs hover:bg-neutral-700 text-neutral-400"
                  >
                    {state.logoImage ? 'Replace Logo' : 'Upload Logo'}
                  </button>
                  <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logo')} accept="image/*" className="hidden" />
                  
                  {state.logoImage && <button onClick={() => onChange({ logoImage: null })} className="px-2 border border-neutral-700 rounded bg-neutral-800 hover:text-red-400"><Trash2 size={12} /></button>}
                </div>
                {state.logoImage && (
                  <input type="range" min="40" max="400" value={state.logoSize} onChange={(e) => onChange({ logoSize: Number(e.target.value) })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer mt-2" />
                )}
             </div>
          </div>
        </details>
        
        {/* 5. STYLE PRESETS */}
        <details className="group bg-neutral-800/30 rounded-lg border border-neutral-800 open:bg-neutral-800/50 open:border-neutral-700 transition-all">
          <summary className="p-3 text-xs font-bold uppercase tracking-wider text-neutral-400 cursor-pointer hover:text-white flex items-center justify-between">
            <span className="flex items-center gap-2"><Palette size={14} /> Colors</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="p-3 pt-0 grid grid-cols-1 gap-1.5">
             {BRAND_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetClick(preset)}
                  className="group relative flex items-center justify-between px-3 py-1.5 rounded border border-neutral-700 hover:border-neutral-500 transition-all bg-neutral-800 hover:bg-neutral-750"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm shadow-sm border border-black/10" style={{ backgroundColor: preset.color }} />
                    <span className="text-[11px] font-bold text-neutral-300">{preset.name}</span>
                  </div>
                  {state.blockColor === preset.color && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-glow" />}
                </button>
              ))}
          </div>
        </details>

      </div>

      {/* FOOTER & EXPORT */}
      <div className="p-5 border-t border-neutral-800 flex flex-col gap-3">
         <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold uppercase text-xs tracking-wide shadow-lg hover:shadow-blue-900/20 transition-all disabled:opacity-50"
        >
          {isExporting ? 'Processing...' : <><Download size={14} /> Download .PNG</>}
        </button>
        <div className="text-center opacity-50">
            <p className="text-[10px] text-neutral-500">made by Ray Svitla // stay evolving 🐌</p>
        </div>
      </div>

    </div>
  );
};

export default Controls;