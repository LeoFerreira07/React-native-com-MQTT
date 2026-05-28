export const colors = {
  // backgrounds
  bg0: '#0A0E1A',   // deepest
  bg1: '#0F1629',   // surface
  bg2: '#162040',   // card
  bg3: '#1E2D5A',   // elevated card

  // text
  textPrimary: '#E8EEFF',
  textSecondary: '#8A9DC2',
  textMuted: '#4A5A82',

  // status
  connected: '#00F5A0',    // neon emerald
  disconnected: '#E63B60', // crimson
  connecting: '#F5A623',   // amber

  // accent
  violet: '#9B6DFF',
  blue: '#3B82F6',
  cyan: '#06B6D4',

  // sensor types
  temperature: '#FF6B6B',
  humidity: '#48CAE4',
  presence: '#A8DADC',

  // status badges
  ok: '#00F5A0',
  warning: '#F5A623',
  error: '#E63B60',

  // borders
  border: '#1E2D5A',
  borderLight: '#2A3D6A',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
