import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Firewall Manager. Schema: see s3.js. */
export default {
  tagline: 'Centrally define and enforce WAF, Shield, security group and firewall policies across an organization.',
  intro: [
    'AWS Firewall Manager is a security management service that lets you centrally configure and manage firewall rules across the accounts and resources in your AWS Organizations organization.',
    'A Firewall Manager policy can deploy AWS WAF rules, Shield Advanced protections, security group rules, AWS Network Firewall, Route 53 Resolver DNS Firewall and network ACL settings to all in-scope accounts and resources.',
    'Policies apply automatically to new accounts and new resources as they are created, and can audit existing resources for non-compliance and optionally remediate them.',
    'Prerequisites: AWS Organizations with all features, a designated Firewall Manager administrator account, and AWS Config enabled in the member accounts.',
    'It does not itself filter traffic: it deploys and governs WAF, Shield, security groups and Network Firewall, so a question about enforcing the same rules everywhere points here.',
  ],
  useCases: [
    { title: 'Organization-wide WAF baseline', detail: 'Attach a standard WAF web ACL to every ALB and CloudFront distribution in all accounts.' },
    { title: 'Security group governance', detail: 'Audit and remove overly permissive security group rules across accounts.' },
    { title: 'Central Shield Advanced rollout', detail: 'Protect all tagged public resources with Shield Advanced.' },
  ],
  importance: {
    points: [
      'Domain 1 governance service; appears with Organizations, WAF and Shield in "apply these protections to all accounts" questions.',
      'Remember the requirement for Organizations and AWS Config.',
    ],
  },
  cli: [
    { command: 'aws fms associate-admin-account --admin-account 111122223333', description: 'Designate the Firewall Manager administrator account.' },
    { command: 'aws fms put-policy --policy file://waf-policy.json', description: 'Create or update a policy (for example a WAF policy).' },
    { command: 'aws fms list-policies', description: 'List policies.' },
    { command: 'aws fms get-compliance-detail --policy-id <id> --member-account 444455556666', description: 'See compliance for one member account.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list Firewall Manager policies',
        language: 'python',
        code: `import boto3

fms = boto3.client("fms")
for p in fms.list_policies()["PolicyList"]:
    print(p["PolicyName"], p["SecurityServiceType"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Enforce one WAF baseline everywhere',
      scenario: 'A security team wants all public ALBs in 40 accounts to use the same WAF rules, including future ones.',
      steps: [
        'Enable AWS Config and designate a Firewall Manager administrator account.',
        'Create a WAF policy scoped to ALBs by tag and OU.',
        'Turn on auto-remediation so new ALBs receive the web ACL automatically.',
        'Monitor compliance in the Firewall Manager dashboard.',
      ],
    },
  ],
  diagram: {
    title: 'Firewall Manager policy enforcement',
    nodes: [
      ['admin', 'Firewall Manager admin account', 'management', 0, 1],
      ['fms', 'Firewall Manager policy', 'management', 1, 1],
      ['waf', 'AWS WAF web ACLs', 'security', 1, 0],
      ['nf', 'Shield Advanced / Network Firewall', 'security', 1, 2],
      ['acc', 'Member accounts and resources', 'compute', 2, 1],
    ],
    edges: [
      ['admin', 'fms', 'Defines policy'],
      ['fms', 'waf', 'Deploys WAF rules'],
      ['fms', 'nf', 'Deploys protections'],
      ['fms', 'acc', 'Enforces on new resources'],
    ],
    steps: [
      'The administrator account creates a policy scoped by account, OU, resource type or tag.',
      'Firewall Manager deploys WAF, Shield or Network Firewall configurations into member accounts.',
      'New resources are protected automatically and non-compliant ones are reported or remediated.',
    ],
  },
  questionTypes: [
    { pattern: 'Apply the same WAF/Shield/security group rules to all accounts', hint: 'AWS Firewall Manager.' },
    { pattern: 'Prerequisites for Firewall Manager', hint: 'Organizations, admin account, AWS Config.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company with many AWS accounts wants to enforce the same AWS WAF rules on all new and existing Application Load Balancers automatically. Which service should be used?',
      options: ['AWS Shield Standard', 'AWS Artifact', 'AWS Firewall Manager', 'Amazon Inspector'],
      answer: ['C'],
      explanation: 'Firewall Manager centrally deploys WAF policies to accounts and resources across an organization.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which are prerequisites for using AWS Firewall Manager? (Select TWO.)',
      multi: true,
      options: ['A Direct Connect connection', 'AWS Snowball Edge', 'An RDS database', 'AWS Config enabled for the accounts', 'AWS Organizations with all features enabled'],
      answer: ['D', 'E'],
      explanation: 'Firewall Manager needs an organization, an administrator account and AWS Config to evaluate resources.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which statement about AWS Firewall Manager is correct?',
      options: ['It is a replacement for AWS WAF', 'It encrypts S3 buckets', 'It only works in a single account', 'It deploys and governs rules for WAF, Shield Advanced, security groups and Network Firewall'],
      answer: ['D'],
      explanation: 'Firewall Manager is a management layer; the actual filtering is done by the services it configures.',
    },
  ],
  keyFacts: [
    'Central policy management across an AWS Organizations organization.',
    'Supports WAF, Shield Advanced, security groups, Network Firewall, DNS Firewall and NACL policies.',
    'Requires Organizations, an FMS administrator account and AWS Config.',
    'Policies auto-apply to new accounts and resources, with optional remediation.',
  ],
  traps: [
    { clue: 'Same firewall rules in every account', answer: 'Firewall Manager.' },
    { clue: 'Filter HTTP requests on one ALB', answer: 'AWS WAF.' },
  ],
  related: ['waf', 'shield', 'network-firewall', 'organizations', 'config'],
  sources: [
    { title: 'What is AWS Firewall Manager?', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html' },
    { title: 'Firewall Manager prerequisites', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/fms-prereq.html' },
    { title: 'AWS CLI fms commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/fms/index.html' },
  ],
};
