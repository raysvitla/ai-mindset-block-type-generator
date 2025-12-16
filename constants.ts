import { BrandColor, PresetName } from './types';

// Brand Colors
export const COLORS = {
  // Backgrounds
  PAPER_WHITE: '#F5F5F5',
  PURE_WHITE: '#FCFCFC', // New v5.1
  GRAPHITE: '#333333',
  CONTRAST_WHITE: '#F8F9FA',
  
  // Accents
  AUTOMATION_INDIGO: '#252DA6',
  CIRCLE_ORANGE: '#FF8C00',
  TEAMS_TEAL: '#0FA3B1',
  SIGNAL_RED: '#D92027',
  CODING_GREEN: '#00A95C',
};

export const BRAND_PRESETS: { name: PresetName; color: string }[] = [
  { name: PresetName.WHITE, color: COLORS.PURE_WHITE },     // New v5.1
  { name: PresetName.GRAPHITE, color: COLORS.GRAPHITE },    // New v5.1
  { name: PresetName.AUTOMATION, color: COLORS.AUTOMATION_INDIGO },
  { name: PresetName.CIRCLE, color: COLORS.CIRCLE_ORANGE },
  { name: PresetName.TEAMS, color: COLORS.TEAMS_TEAL },
  { name: PresetName.SIGNAL, color: COLORS.SIGNAL_RED },
  { name: PresetName.CODING, color: COLORS.CODING_GREEN },
];

export const DEFAULT_TEXT = "BUILDING\nTHE FUTURE\nWITH AI";

export const FORMATS = {
  YOUTUBE: { width: 1920, height: 1080, label: 'YouTube' },
  SQUARE: { width: 1080, height: 1080, label: 'Square' },
  STORY: { width: 1080, height: 1920, label: 'Story' },
  BANNER: { width: 1920, height: 640, label: 'Banner' },
};