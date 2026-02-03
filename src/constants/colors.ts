import type { ThemeColors } from '../types';

export const lightColors: ThemeColors = {
  primary: '#000000',
  accent: '#FF0000',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  error: '#FF0000',
  success: '#000000',
  border: '#E5E5E5',
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF0000',
  green: '#22C55E',
  inputBg: '#FFFFFF',
};

export const darkColors: ThemeColors = {
  primary: '#FFFFFF',
  accent: '#FF0000',
  background: '#0A0A0A',
  text: '#FFFFFF',
  textSecondary: '#999999',
  error: '#FF0000',
  success: '#FFFFFF',
  border: '#333333',
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF0000',
  green: '#22C55E',
  inputBg: '#1A1A1A',
};

export const getColors = (isDark: boolean): ThemeColors =>
  isDark ? darkColors : lightColors;

export const colors = lightColors;
