export interface BrandColor {
  name: string;
  value: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  image: string | null;
}

export type FormatType = 'YOUTUBE' | 'SQUARE' | 'STORY' | 'BANNER';

export interface AppState {
  text: string;
  textColor: string;
  blockColor: string;
  backgroundColor: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  layoutSeed: number;
  transparentBackground: boolean;
  
  // v2.0 Features
  backgroundImage: string | null;
  overlayOpacity: number;
  showGrid: boolean;
  showShadows: boolean;
  isBold: boolean;

  // v3.5 Multi-Format Features
  format: FormatType; // New
  textPosition: { x: number; y: number }; 
  textAlignment: 'left' | 'center' | 'right';
  brandTag: string; 
  logoImage: string | null;
  logoSize: number;
  invertLogo: boolean; 
  speakers: Speaker[];
  speakerGrayscale: boolean;
}

export enum PresetName {
  AUTOMATION = 'AUTOMATION',
  CIRCLE = 'CIRCLE',
  TEAMS = 'TEAMS',
  SIGNAL = 'SIGNAL',
  CODING = 'CODING',
}