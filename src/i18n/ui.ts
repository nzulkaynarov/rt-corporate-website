/**
 * Language types and UI localization definitions for RailTech Portal
 */

export type Lang = 'ru' | 'uz' | 'en';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'ru', label: 'РУС' },
  { code: 'uz', label: "O'ZB" },
  { code: 'en', label: 'ENG' },
];

export const DEFAULT_LANG: Lang = 'ru';
