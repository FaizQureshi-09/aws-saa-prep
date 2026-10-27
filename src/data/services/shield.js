import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Shield. Schema: see s3.js. */
export default {
  tagline: 'Managed DDoS protection: Shield Standard is automatic and free; Shield Advanced adds expert help and cost protection.',
  intro: [
    'AWS Shield is a managed Distributed Denial of Service (DDoS) protection service for applications running on AWS.',
    'Shield Standard is automatically enabled for all AWS customers at no extra cost and defends against the most common network and transport layer (layer 3 and 4) attacks such as SYN/UDP floods and reflection attacks.',
    'Shield Advanced is a paid subscription with a one-year commitment that adds enhanced detection, protection for specific resources, near real-time visibility, access to the Shield Response Team (SRT) and DDoS cost protection.',
    'Shield Advanced protects Amazon CloudFront distributions, Route 53 hosted zones, AWS Global Accelerator, Elastic Load Balancers and Elastic IP addresses (for example on EC2).',
    'Application layer (layer 7) attacks such as HTTP floods are handled by combining Shield with AWS WAF (rate-based rules); Shield Advanced can create and manage WAF rules automatically.',
    'The best DDoS architecture uses CloudFront and Route 53 at the edge, so attack traffic is absorbed far from your origin, and hides origin servers behind them.',
  ],
  useCases: [
    { title: 'Baseline protection for all workloads', detail: 'Shield Standard works automatically with CloudFront, Route 53, ELB and Elastic IPs.' },
    { title: 'Business-critical or high-profile apps', detail: 'Shield Advanced with SRT support and cost protection against scaling charges caused by attacks.' },
    { title: 'Layered DDoS defence', detail: 'CloudFront + WAF + Shield Advanced + Auto Scaling to absorb and filter floods.' },
  ],
  importance: {
    points: [
      'Appears in Domain 1 workload-protection questions (Task 1.2) alongside WAF, CloudFront and Route 53.',
      'The exam expects you to know what is free (Standard), what is paid (Advanced), and which layer each handles.',
    ],
  },
  cli: [
    { command: 'aws shield create-subscription', description: 'Subscribe the account to Shield Advanced (one-year commitment).' },
    { command: 'aws shield create-protection --name web-alb --resource-arn <alb-arn>', description: 'Protect a specific resource with Shield Advanced.' },
    { command: 'aws shield list-protections', description: 'List protected resources.' },
    { command: 'aws shield describe-attack --attack-id <attack-id>', description: 'Inspect a detected attack.' },
    { command: 'aws shield associate-drt-role --role-arn <role-arn>', description: 'Give the Shield Response Team access to your WAF configuration.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): protect an Application Load Balancer',
        language: 'python',
        code: `import boto3

shield = boto3.client("shield", region_name="us-east-1")
resp = shield.create_protection(
    Name="web-alb",
    ResourceArn="arn:aws:elasticloadbalancing:us-east-1:111122223333:loadbalancer/app/web/0123456789abcdef",
)
print(resp["ProtectionId"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Harden a public web app against DDoS',
      scenario: 'An e-commerce site expects targeted attacks before a big sale.',
      steps: [
        'Put CloudFront in front of the ALB and restrict the ALB to CloudFront traffic.',
        'Add AWS WAF rate-based rules and managed rule groups.',
        'Subscribe to Shield Advanced and protect the CloudFront distribution and ALB.',
        'Use Auto Scaling so legitimate traffic still scales; DDoS cost protection covers attack-related scaling charges.',
      ],
    },
  ],
  diagram: {
    title: 'DDoS defence layers',
    nodes: [
      ['atk', 'DDoS / malicious traffic', 'external', 0, 1],
      ['std', 'Shield Standard (automatic)', 'security', 1, 1],
      ['adv', 'Shield Advanced (SRT, cost protection)', 'security', 2, 0],
      ['waf', 'AWS WAF (layer 7 rules)', 'security', 2, 2],
      ['edge', 'CloudFront / Route 53 / ELB', 'network', 2, 1],
      ['app', 'Protected application', 'compute', 3, 1],
    ],
    edges: [
      ['atk', 'std', 'Layer 3/4 floods'],
      ['std', 'edge', 'Filtered traffic'],
      ['adv', 'edge', 'Extra protection'],
      ['waf', 'edge', 'Filters HTTP floods'],
      ['edge', 'app', 'Clean traffic'],
    ],
    steps: [
      'Shield Standard automatically blocks common network and transport layer attacks.',
      'Shield Advanced adds detection, SRT support and cost protection for chosen resources.',
      'WAF filters layer 7 floods; only clean traffic reaches the application.',
    ],
  },
  questionTypes: [
    { pattern: 'Automatic, no-cost DDoS protection', hint: 'Shield Standard.' },
    { pattern: 'Expert DDoS support and cost protection', hint: 'Shield Advanced.' },
    { pattern: 'HTTP flood / layer 7 attack', hint: 'AWS WAF rate-based rules with CloudFront.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'Which AWS service provides DDoS protection against common network and transport layer attacks for all customers at no additional cost?',
      options: ['AWS Shield Advanced', 'AWS Firewall Manager', 'Amazon Macie', 'AWS Shield Standard'],
      answer: ['D'],
      explanation: 'Shield Standard is enabled automatically for every AWS customer at no extra charge; Advanced is a paid subscription.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company running a critical public website wants 24x7 access to DDoS experts and protection against bill increases caused by attack-related scaling. Which should they use?',
      options: ['AWS Shield Advanced', 'Amazon Inspector', 'AWS Shield Standard', 'Security groups'],
      answer: ['A'],
      explanation: 'Shield Advanced includes access to the Shield Response Team and DDoS cost protection.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A web application is hit by a flood of HTTP GET requests from many IP addresses. Which combination BEST mitigates this layer 7 attack? (Select TWO.)',
      multi: true,
      options: ['VPC flow logs', 'A bigger EBS volume', 'Amazon CloudFront in front of the application', 'AWS WAF rate-based rules', 'A larger EC2 instance'],
      answer: ['C', 'D'],
      explanation: 'WAF rate-based rules block abusive request rates, and CloudFront absorbs and caches traffic at the edge, protecting the origin.',
    },
  ],
  keyFacts: [
    'Shield Standard: free, automatic, layer 3/4 protection for all customers.',
    'Shield Advanced: paid, 1-year commitment, enhanced detection, Shield Response Team, DDoS cost protection.',
    'Protected resources for Advanced: CloudFront, Route 53, Global Accelerator, ELB, Elastic IP.',
    'Layer 7 protection comes from AWS WAF; Shield Advanced integrates with WAF.',
    'Use CloudFront/Route 53 to keep attack traffic away from the origin.',
  ],
  traps: [
    { clue: 'Free DDoS protection included by default', answer: 'Shield Standard.' },
    { clue: 'SRT, cost protection, advanced detection', answer: 'Shield Advanced.' },
    { clue: 'Block SQL injection or HTTP floods', answer: 'AWS WAF.' },
  ],
  related: ['waf', 'cloudfront', 'route53', 'global-accelerator', 'firewall-manager', 'elb'],
  sources: [
    { title: 'How AWS Shield works', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html' },
    { title: 'AWS Shield Advanced overview', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-advanced-summary.html' },
    { title: 'AWS Best Practices for DDoS Resiliency', url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-best-practices-ddos-resiliency/welcome.html' },
    { title: 'AWS CLI shield commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/shield/index.html' },
  ],
};
