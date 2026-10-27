/**
 * 30-day study plan. Every service id in serviceCatalog appears in exactly
 * one learning day (checked by scripts/validate-data.mjs). The plan is this
 * site's recommendation - AWS does not publish a study schedule. Daily load
 * is roughly 4-5.5 hours; compress it if you already work with AWS daily.
 */

import { serviceById } from './serviceCatalog.js';

/**
 * @typedef {object} PlanDay
 * @property {number} day - 1-based day number
 * @property {string} focus - theme of the day
 * @property {string[]} services - catalog ids studied that day
 * @property {string} [task] - non-service activity (practice, review)
 * @property {number} [taskHours] - hours for the non-service activity
 */

/** @type {{ week: number, title: string, goal: string, domains: number[], days: PlanDay[] }[]} */
export const studyPlan = [
  {
    week: 1,
    title: 'Foundations, Security & Networking',
    goal: 'Understand how AWS is organised, lock down access (IAM, KMS, org-level controls) and build a solid VPC mental model.',
    domains: [1],
    days: [
      { day: 1, focus: 'Foundations', services: ['global-infrastructure', 'well-architected', 'artifact'] },
      { day: 2, focus: 'Identity & access', services: ['iam', 'organizations'] },
      { day: 3, focus: 'Federation & encryption', services: ['control-tower', 'iam-identity-center', 'directory-service', 'kms'] },
      { day: 4, focus: 'Secrets, certificates & identity for apps', services: ['secrets-manager', 'acm', 'cognito', 'cloudhsm', 'ram'] },
      { day: 5, focus: 'Threat protection & detection', services: ['waf', 'shield', 'guardduty', 'inspector', 'macie', 'security-hub', 'network-firewall', 'firewall-manager', 'detective'] },
      { day: 6, focus: 'VPC deep dive', services: ['vpc'] },
      { day: 7, focus: 'Hybrid & private connectivity', services: ['privatelink', 'transit-gateway', 'direct-connect', 'vpn'] },
    ],
  },
  {
    week: 2,
    title: 'Compute, Storage & Edge',
    goal: 'Choose the right compute, storage and edge service for performance, resilience and cost.',
    domains: [2, 3, 4],
    days: [
      { day: 8, focus: 'EC2', services: ['ec2', 'outposts', 'batch'] },
      { day: 9, focus: 'Scaling & load balancing', services: ['ec2-auto-scaling', 'elb', 'elastic-beanstalk'] },
      { day: 10, focus: 'Object storage', services: ['s3', 'glacier'] },
      { day: 11, focus: 'Block & file storage', services: ['ebs', 'efs', 'fsx'] },
      { day: 12, focus: 'Hybrid storage & transfer', services: ['storage-gateway', 'backup', 'datasync', 'snow-family', 'transfer-family'] },
      { day: 13, focus: 'DNS & content delivery', services: ['route53', 'cloudfront', 'global-accelerator'] },
      { day: 14, focus: 'Serverless compute & APIs', services: ['lambda', 'api-gateway'] },
    ],
  },
  {
    week: 3,
    title: 'Databases, Decoupling & Analytics',
    goal: 'Pick the right database, decouple tiers with messaging and design data ingestion and analytics pipelines.',
    domains: [2, 3],
    days: [
      { day: 15, focus: 'Relational databases', services: ['rds', 'elasticache'] },
      { day: 16, focus: 'Aurora & purpose-built databases', services: ['aurora', 'redshift', 'neptune', 'documentdb', 'keyspaces'] },
      { day: 17, focus: 'NoSQL & migration', services: ['dynamodb', 'dms'] },
      { day: 18, focus: 'Messaging', services: ['sqs', 'sns', 'amazon-mq'] },
      { day: 19, focus: 'Events, workflows & containers', services: ['eventbridge', 'step-functions', 'ecs'] },
      { day: 20, focus: 'Containers & streaming', services: ['fargate', 'eks', 'ecr', 'kinesis', 'msk'] },
      { day: 21, focus: 'Data lakes & analytics', services: ['athena', 'glue', 'emr', 'quicksight', 'lake-formation', 'opensearch'] },
    ],
  },
  {
    week: 4,
    title: 'Operations, Cost, DR & Exam Practice',
    goal: 'Monitor, automate and optimise cost, finish the managed-AI services, then spend the remaining days on timed practice.',
    domains: [2, 4],
    days: [
      { day: 22, focus: 'Monitoring & governance', services: ['cloudwatch', 'cloudtrail', 'config'] },
      { day: 23, focus: 'Automation & disaster recovery', services: ['cloudformation', 'systems-manager', 'x-ray', 'compute-optimizer', 'dr-strategies'] },
      { day: 24, focus: 'Cost, migration & managed AI', services: ['cost-management', 'mgn', 'rekognition', 'comprehend', 'polly', 'transcribe', 'translate', 'textract', 'lex', 'sagemaker'] },
      { day: 25, focus: 'Practice', services: [], task: 'Official Practice Question Set (Skill Builder) + review every wrong answer', taskHours: 4 },
      { day: 26, focus: 'Weak-area review', services: [], task: 'Re-read the "Key facts & exam traps" of your weakest Domain 1 and 2 services', taskHours: 4 },
      { day: 27, focus: 'Mock exam 1', services: [], task: 'Timed 65-question mock (130 min) + review', taskHours: 4 },
      { day: 28, focus: 'Weak-area review', services: [], task: 'Re-read the "Key facts & exam traps" of your weakest Domain 3 and 4 services', taskHours: 4 },
      { day: 29, focus: 'Mock exam 2', services: [], task: 'Timed 65-question mock + skim all service cheat-sheets', taskHours: 3 },
      { day: 30, focus: 'Exam day', services: [], task: 'Light skim of cheat-sheets only. Rest, check ID and testing setup, then sit the exam.', taskHours: 1 },
    ],
  },
];

/** Hours planned for a single day (services' recommended hours + any task hours). */
export function hoursForDay(day) {
  const serviceHours = day.services.reduce((sum, id) => sum + (serviceById[id]?.hours ?? 0), 0);
  return serviceHours + (day.taskHours ?? 0);
}

/** Flat list of every plan day, in order. */
export const allPlanDays = studyPlan.flatMap((week) => week.days);

/** Map: service id -> day number it is scheduled on. */
export const dayByServiceId = Object.fromEntries(
  allPlanDays.flatMap((day) => day.services.map((id) => [id, day.day]))
);

/** Total planned hours across the 30 days. */
export const totalPlannedHours = allPlanDays.reduce((sum, day) => sum + hoursForDay(day), 0);
