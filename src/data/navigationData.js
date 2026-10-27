/**
 * Ordered list of top-level routes rendered in the navbar.
 * `end` makes the home link match only the exact root path.
 */
export const navigationLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/syllabus', label: 'Syllabus' },
  { to: '/services', label: 'Services' },
  { to: '/practice', label: 'Practice' },
  { to: '/tracker', label: 'Tracker' },
];
