import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Network Firewall. Schema: see s3.js. */
export default {
  tagline: 'Managed network firewall and intrusion prevention to filter VPC traffic from layer 3 to layer 7.',
  intro: [
    'AWS Network Firewall is a managed, scalable network firewall and intrusion detection and prevention service for Amazon VPCs.',
    'You deploy firewall endpoints in dedicated firewall subnets and route traffic through them with route tables, for example between an internet gateway and your protected subnets.',
    'Rules are organised in rule groups: stateless rules (fast, per-packet), stateful rules (5-tuple, domain list filtering, and Suricata-compatible IPS rules) plus AWS managed rule groups; TLS inspection can decrypt and inspect encrypted traffic.',
    'It goes beyond security groups and network ACLs, which filter only on IP, port and protocol: Network Firewall adds domain-name filtering and deep packet inspection.',
    'Logs (alert and flow) go to S3, CloudWatch Logs or Data Firehose, and AWS Firewall Manager can deploy and govern firewalls across an organization.',
  ],
  useCases: [
    { title: 'Egress domain filtering', detail: 'Allow workloads to reach only approved domains (for example package repositories).' },
    { title: 'Intrusion prevention', detail: 'Block known exploit signatures with Suricata-compatible rules.' },
    { title: 'Central inspection in a hub VPC', detail: 'Inspect traffic between VPCs and on-premises using Transit Gateway and a shared inspection VPC.' },
  ],
  importance: {
    points: [
      'A Domain 1 network-protection service: the answer when security groups and NACLs are not enough (domain filtering, IPS, deep inspection).',
      'Compare with WAF (HTTP layer, on ALB/CloudFront) and security groups (instance-level, stateful, allow rules only).',
    ],
  },
  cli: [
    { command: 'aws network-firewall create-rule-group --rule-group-name block-bad-domains --type STATEFUL --capacity 100 --rule-group file://domains.json', description: 'Create a stateful domain-list rule group.' },
    { command: 'aws network-firewall create-firewall-policy --firewall-policy-name prod-policy --firewall-policy file://policy.json', description: 'Create a policy that references rule groups.' },
    { command: 'aws network-firewall create-firewall --firewall-name prod-fw --firewall-policy-arn <policy-arn> --vpc-id vpc-0abc --subnet-mappings SubnetId=subnet-0fw', description: 'Create the firewall with an endpoint in a firewall subnet.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list firewalls',
        language: 'python',
        code: `import boto3

nfw = boto3.client("network-firewall")
for fw in nfw.list_firewalls()["Firewalls"]:
    print(fw["FirewallName"], fw["FirewallArn"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Restrict outbound traffic to approved domains',
      scenario: 'Compliance requires private workloads to reach only a short list of internet domains.',
      steps: [
        'Add a firewall subnet in each AZ and create the firewall with a stateful domain allow-list rule group.',
        'Route private subnet traffic through the firewall endpoint before the NAT gateway.',
        'Send alert logs to S3 or CloudWatch Logs and review blocked attempts.',
      ],
    },
  ],
  diagram: {
    title: 'Network Firewall in the traffic path',
    nodes: [
      ['net', 'Internet', 'external', 0, 1],
      ['igw', 'Internet gateway', 'network', 1, 1],
      ['rules', 'Rule groups (stateless, stateful, domain)', 'security', 2, 0],
      ['fw', 'Network Firewall endpoint', 'security', 2, 1],
      ['logs', 'S3 / CloudWatch alert logs', 'storage', 2, 2],
      ['app', 'Protected workloads', 'compute', 3, 1],
    ],
    edges: [
      ['net', 'igw', 'Inbound and outbound'],
      ['igw', 'fw', 'Routed to firewall'],
      ['rules', 'fw', 'Inspects with'],
      ['fw', 'logs', 'Alert and flow logs'],
      ['fw', 'app', 'Allowed traffic'],
    ],
    steps: [
      'Route tables send traffic through the firewall endpoint in a dedicated subnet.',
      'Rule groups decide to pass, drop or alert; stateful engines can match domains and signatures.',
      'Allowed traffic reaches the workloads, and logs record alerts and flows.',
    ],
  },
  questionTypes: [
    { pattern: 'Domain filtering or IPS for VPC traffic', hint: 'AWS Network Firewall.' },
    { pattern: 'Network Firewall vs WAF vs security groups', hint: 'VPC traffic L3-L7 vs HTTP apps vs instance-level.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company must allow its private workloads to reach only an approved list of domain names on the internet and block known intrusion signatures. Which service should be used?',
      options: ['Security groups', 'AWS Shield Standard', 'Network ACLs', 'AWS Network Firewall'],
      answer: ['D'],
      explanation: 'Network Firewall supports domain-list filtering and IPS rules that security groups and NACLs cannot provide.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Where are AWS Network Firewall endpoints deployed?',
      options: ['On every EC2 instance as an agent', 'In the AWS Organizations management account only', 'In dedicated firewall subnets in the VPC, with route tables sending traffic through them', 'At CloudFront edge locations'],
      answer: ['C'],
      explanation: 'Firewall endpoints live in subnets of your VPC and route tables steer traffic to them.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which statements about AWS Network Firewall are true? (Select TWO.)',
      multi: true,
      options: ['It only works for on-premises networks.', 'It supports stateless and stateful rule groups.', 'It can be managed centrally across accounts with AWS Firewall Manager.', 'It replaces IAM policies.', 'It only filters HTTP requests for CloudFront.'],
      answer: ['B', 'C'],
      explanation: 'Network Firewall offers stateless and stateful rules and is governed centrally via Firewall Manager. HTTP filtering at the edge is WAF.',
    },
  ],
  keyFacts: [
    'Managed firewall + IDS/IPS for VPCs; deployed as endpoints in firewall subnets.',
    'Stateless and stateful rule groups; domain-list filtering; Suricata-compatible rules; TLS inspection.',
    'Goes beyond security groups and NACLs (which filter only on IP/port/protocol).',
    'Logs to S3, CloudWatch Logs or Firehose; central management with Firewall Manager.',
  ],
  traps: [
    { clue: 'Domain-name filtering or IPS for VPC traffic', answer: 'Network Firewall.' },
    { clue: 'SQL injection or HTTP floods on an ALB', answer: 'AWS WAF.' },
  ],
  related: ['vpc', 'waf', 'firewall-manager', 'transit-gateway', 'guardduty'],
  sources: [
    { title: 'What is AWS Network Firewall?', url: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html' },
    { title: 'AWS Network Firewall rule groups', url: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-groups.html' },
    { title: 'AWS CLI network-firewall commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/network-firewall/index.html' },
  ],
};
