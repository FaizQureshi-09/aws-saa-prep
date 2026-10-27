import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS WAF. Schema: see s3.js. */
export default {
  tagline: 'A Layer 7 web application firewall that blocks SQL injection, cross-site scripting and abusive traffic.',
  intro: [
    'AWS WAF filters HTTP/HTTPS requests with a web ACL made of rules that allow, block, count or challenge matching requests.',
    'It attaches to Amazon CloudFront, Application Load Balancer, Amazon API Gateway, AWS AppSync and Amazon Cognito user pools.',
    'Rule types: managed rule groups (AWS or marketplace), IP set matches, geographic match, string/regex match, SQL injection and cross-site scripting detection, and rate-based rules to throttle abusive clients.',
    'Rules inspect headers, URI, query strings and bodies; labels and Bot Control add further bot and fraud protections.',
    'Logging can go to CloudWatch Logs, S3 or Amazon Data Firehose; AWS Firewall Manager applies WAF rules across accounts.',
    'WAF protects at Layer 7; AWS Shield protects against network/transport layer DDoS - they are used together.',
  ],
  useCases: [
    { title: 'Block common web exploits', detail: 'Use the AWS managed rule groups for SQL injection and XSS.' },
    { title: 'Rate limiting', detail: 'Rate-based rule blocks IPs that send more than a threshold of requests in five minutes.' },
    { title: 'Geo and IP restrictions', detail: 'Block countries or allow only corporate IP ranges to an admin path.' },
  ],
  importance: {
    points: [
      'Task 1.2 lists threat vectors such as DDoS and SQL injection and names AWS WAF and AWS Shield as integrations.',
      'Answer pattern: SQL injection / XSS / bad bots = WAF; volumetric DDoS = Shield.',
    ],
  },
  cli: [
    { command: 'aws wafv2 create-web-acl --name web-acl --scope REGIONAL --default-action Allow={} --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=webacl --rules file://rules.json', description: 'Create a web ACL (scope CLOUDFRONT requires us-east-1).' },
    { command: 'aws wafv2 associate-web-acl --web-acl-arn <acl-arn> --resource-arn <alb-arn>', description: 'Attach the web ACL to an ALB.' },
    { command: 'aws wafv2 create-ip-set --name blocked --scope REGIONAL --ip-address-version IPV4 --addresses 203.0.113.0/24', description: 'Create an IP set for a block rule.' },
    { command: 'aws wafv2 list-available-managed-rule-groups --scope REGIONAL', description: 'See managed rule groups.' },
    { command: 'aws wafv2 get-sampled-requests --web-acl-arn <arn> --rule-metric-name <name> --scope REGIONAL --time-window StartTime=...,EndTime=... --max-items 50', description: 'Inspect sampled requests.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'JSON: a rate-based rule',
        language: 'json',
        code: `{
  "Name": "rate-limit",
  "Priority": 1,
  "Statement": { "RateBasedStatement": { "Limit": 2000, "AggregateKeyType": "IP" } },
  "Action": { "Block": {} },
  "VisibilityConfig": {
    "SampledRequestsEnabled": true,
    "CloudWatchMetricsEnabled": true,
    "MetricName": "rate-limit"
  }
}`,
      },
    ],
  },
  examples: [
    {
      title: 'Protect an ALB-fronted site',
      scenario: 'A public web app is being probed with SQL injection and floods from a few IPs.',
      steps: [
        'Create a web ACL with the AWS managed Core rule set and SQL database rule group.',
        'Add a rate-based rule to throttle abusive IPs.',
        'Associate the web ACL with the ALB (or CloudFront).',
        'Enable logging and review sampled requests; tune with count mode first.',
      ],
    },
  ],
  diagram: {
    title: 'AWS WAF in front of an application',
    nodes: [
      ['user', 'Internet traffic', 'external', 0, 1],
      ['waf', 'AWS WAF web ACL', 'security', 1, 1],
      ['alb', 'CloudFront / ALB / API GW', 'network', 2, 1],
      ['app', 'Application', 'compute', 3, 1],
      ['rules', 'Managed + custom rules', 'security', 1, 0],
    ],
    edges: [
      ['user', 'waf', 'Requests'],
      ['rules', 'waf', 'Evaluated in order'],
      ['waf', 'alb', 'Allowed traffic'],
      ['alb', 'app', 'Forward'],
    ],
    steps: [
      'Every request is inspected by the web ACL attached to CloudFront, ALB or API Gateway.',
      'Rules (managed groups, IP, rate-based, SQLi/XSS) are evaluated by priority; matching requests are blocked, counted or challenged.',
      'Allowed requests continue to the application.',
    ],
  },
  questionTypes: [
    { pattern: 'SQL injection / XSS protection', hint: 'AWS WAF managed rules.' },
    { pattern: 'DDoS protection', hint: 'AWS Shield (Standard automatic, Advanced optional) with CloudFront and Route 53.' },
    { pattern: 'Throttle abusive clients', hint: 'WAF rate-based rule (or API Gateway throttling).' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A public web application behind an Application Load Balancer is receiving SQL injection attempts. What is the MOST appropriate AWS service to block them?',
      options: ['AWS Shield Standard', 'AWS WAF with a SQL injection rule', 'Amazon GuardDuty', 'Security groups'],
      answer: ['B'],
      explanation: 'AWS WAF inspects HTTP requests at Layer 7 and can block SQL injection patterns. Security groups cannot inspect HTTP content; GuardDuty detects but does not block.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants to block clients that send more than 2,000 requests in five minutes to its API. Which solution is the simplest?',
      options: ['An AWS WAF rate-based rule', 'A network ACL deny rule for each IP', 'An Auto Scaling policy', 'A KMS key policy'],
      answer: ['A'],
      explanation: 'Rate-based rules aggregate requests per IP over a window and block those above the limit automatically.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which resources can an AWS WAF web ACL be associated with? (Select TWO.)',
      multi: true,
      options: ['Application Load Balancer', 'Amazon CloudFront distribution', 'Network Load Balancer', 'Amazon EC2 instance directly', 'Amazon RDS instance'],
      answer: ['A', 'B'],
      explanation: 'WAF attaches to CloudFront, ALB, API Gateway, AppSync and Cognito user pools - not to NLBs, EC2 instances or databases.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants quick protection for an Application Load Balancer against common web exploits such as those in the OWASP Top 10, without writing rules. What should it use?',
      options: ['Security group inbound rules', 'AWS managed rule groups in a web ACL', 'VPC Flow Logs', 'Route 53 health checks'],
      answer: ['B'],
      explanation: 'AWS managed rule groups provide ready-made rules for common threats and attach to a WAF web ACL.',
    },
  ],
  keyFacts: [
    'WAF works at Layer 7 (HTTP/HTTPS) - it cannot protect non-HTTP protocols (use Shield/NLB features).',
    'Supported associations: CloudFront, ALB, API Gateway, AppSync, Cognito user pools.',
    'A web ACL used with CloudFront is created in us-east-1 (scope CLOUDFRONT).',
    'Rate-based rules block IPs exceeding a request threshold in a rolling five-minute window.',
    'Test new rules in "count" mode before switching to "block".',
    'AWS Firewall Manager can deploy WAF rules across an organization.',
  ],
  traps: [
    { clue: 'SQL injection, XSS, bad bots', answer: 'AWS WAF.' },
    { clue: 'Volumetric network DDoS', answer: 'AWS Shield.' },
    { clue: 'Block a single IP at subnet level', answer: 'Network ACL (or WAF IP set for HTTP).' },
    { clue: 'Detect compromised instances', answer: 'GuardDuty - not WAF.' },
  ],
  related: ['shield', 'cloudfront', 'elb', 'api-gateway', 'firewall-manager'],
  sources: [
    { title: 'What is AWS WAF?', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html' },
    { title: 'AWS WAF rules', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rules.html' },
    { title: 'Rate-based rule statements', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html' },
    { title: 'AWS CLI wafv2 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/wafv2/index.html' },
  ],
};
