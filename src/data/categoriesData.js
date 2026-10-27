/**
 * Service categories used to group and color study pages. Colors follow
 * the AWS Architecture Icons category palette so the site and the
 * draw.io diagrams share one visual language.
 */
export const categories = [
  { id: 'foundations', label: 'Foundations', color: '#687078', iconKey: 'foundations' },
  { id: 'security', label: 'Security, Identity & Compliance', color: '#dd344c', iconKey: 'security' },
  { id: 'networking', label: 'Networking & Content Delivery', color: '#8c4fff', iconKey: 'networking' },
  { id: 'compute', label: 'Compute & Containers', color: '#ed7100', iconKey: 'compute' },
  { id: 'storage', label: 'Storage', color: '#7aa116', iconKey: 'storage' },
  { id: 'database', label: 'Database', color: '#c925d1', iconKey: 'database' },
  { id: 'integration', label: 'Application Integration', color: '#e7157b', iconKey: 'integration' },
  { id: 'analytics', label: 'Analytics', color: '#8c4fff', iconKey: 'analytics' },
  { id: 'management', label: 'Management, Governance & Cost', color: '#e7157b', iconKey: 'management' },
  { id: 'migration', label: 'Migration & Transfer', color: '#01a88d', iconKey: 'migration' },
  { id: 'ml', label: 'Machine Learning', color: '#01a88d', iconKey: 'ml' },
];

/** Lookup helper: category id -> category object. */
export const categoryById = Object.fromEntries(categories.map((category) => [category.id, category]));

/**
 * Priority tiers. These are editorial judgements for study planning,
 * derived from how widely a service is referenced across the exam guide's
 * task statements - they are NOT AWS-published weights.
 */
export const tiers = [
  {
    id: 'critical',
    label: 'Critical',
    rank: 1,
    description:
      'Backbone services that appear across several domains and in most scenario questions. Master these first.',
  },
  {
    id: 'high',
    label: 'High',
    rank: 2,
    description:
      'Named explicitly in task statements or core to a whole question family. Expect multiple questions.',
  },
  {
    id: 'medium',
    label: 'Medium',
    rank: 3,
    description: 'Appears in specific scenarios. Know when to choose it and its key limits.',
  },
  {
    id: 'low',
    label: 'Low',
    rank: 4,
    description:
      'In scope but narrow. Know the one-line use case so you can eliminate wrong answers quickly.',
  },
];

/** Lookup helper: tier id -> tier object. */
export const tierById = Object.fromEntries(tiers.map((tier) => [tier.id, tier]));
