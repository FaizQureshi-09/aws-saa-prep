import { kindColor } from '../../../utils/diagram';

/**
 * Stroke color for a node kind on the website. The "actor" kind is near-black
 * in the exported draw.io file (white canvas) but must follow the theme text
 * color on the site so it stays visible in dark mode.
 *
 * @param {string} kind - diagram node kind
 * @returns {string} CSS color value
 */
export function themedKindColor(kind) {
  return kind === 'actor' ? 'var(--color-text-primary)' : kindColor(kind);
}
