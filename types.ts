export interface BrandColor {
  name: string;
  value: string;
}

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
  // v2.0 New Features
  backgroundImage: string | null;
  overlayOpacity: number; // 0 to 1
  showGrid: boolean;
  showShadows: boolean;
  isBold: boolean;
}

export enum PresetName {
  AUTOMATION = 'AUTOMATION',
  CIRCLE = 'CIRCLE',
  TEAMS = 'TEAMS',
  SIGNAL = 'SIGNAL',
  CODING = 'CODING',
}