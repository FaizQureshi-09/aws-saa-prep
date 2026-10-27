import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Direct Connect. Schema: see s3.js. */
export default {
  tagline: 'A dedicated private network connection from your data center to AWS with consistent latency and lower data-transfer cost.',
  intro: [
    'AWS Direct Connect links your on-premises network to AWS through a dedicated physical connection at a Direct Connect location, bypassing the public internet.',
    'Dedicated connections come in 1, 10 and 100 Gbps; hosted connections are provided in smaller speeds by AWS Direct Connect Partners.',
    'Virtual interfaces (VIFs) carry traffic: private VIF to VPCs (through a virtual private gateway or Direct Connect gateway), public VIF to AWS public services such as S3, and transit VIF to Transit Gateway.',
    'A Direct Connect gateway lets one connection reach VPCs in multiple Regions and accounts.',
    'Direct Connect is NOT encrypted by default; add an IPsec VPN over it (or MACsec on supported dedicated connections) when encryption is required.',
    'Provisioning takes time (often weeks), so a Site-to-Site VPN is a common quick start or backup; for resilience use two connections at separate locations.',
  ],
  useCases: [
    { title: 'Consistent, high-throughput hybrid connectivity', detail: 'Large data transfers, hybrid databases and latency-sensitive integrations.' },
    { title: 'Lower data-transfer-out cost', detail: 'Data transfer over Direct Connect is cheaper than over the internet.' },
    { title: 'Encrypted private connectivity', detail: 'Run an IPsec VPN over a public or transit VIF.' },
  ],
  importance: {
    points: [
      'Named in Tasks 1.2, 3.4 and 4.4 ("Direct Connect compared with VPN compared with internet", "Direct Connect speed").',
      'Typical decision: Direct Connect for predictable bandwidth/latency, VPN for fast, cheap, encrypted connectivity.',
    ],
  },
  cli: [
    { command: 'aws directconnect describe-connections', description: 'List your Direct Connect connections.' },
    { command: 'aws directconnect create-private-virtual-interface --connection-id dxcon-abc --new-private-virtual-interface file://vif.json', description: 'Create a private virtual interface.' },
    { command: 'aws directconnect create-direct-connect-gateway --direct-connect-gateway-name dx-gw --amazon-side-asn 64512', description: 'Create a Direct Connect gateway.' },
    { command: 'aws directconnect describe-virtual-interfaces', description: 'List virtual interfaces and BGP status.' },
    { command: 'aws directconnect create-direct-connect-gateway-association --direct-connect-gateway-id <id> --gateway-id <vgw-or-tgw-id>', description: 'Associate the gateway with a virtual private gateway or Transit Gateway.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): check connection state',
        language: 'python',
        code: `import boto3

dx = boto3.client("directconnect")
for conn in dx.describe_connections()["connections"]:
    print(conn["connectionName"], conn["bandwidth"], conn["connectionState"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Resilient hybrid connectivity',
      scenario: 'A bank needs predictable bandwidth and failover to AWS, with encrypted traffic.',
      steps: [
        'Provision two Direct Connect connections at different locations.',
        'Attach to a Direct Connect gateway associated with a Transit Gateway.',
        'Add a Site-to-Site VPN as a backup path and for encryption where required.',
        'Use BGP to prefer Direct Connect and fail over to the VPN.',
      ],
    },
  ],
  diagram: {
    title: 'Direct Connect with VPN backup',
    nodes: [
      ['dc', 'On-premises data center', 'external', 0, 1],
      ['dx', 'Direct Connect location', 'network', 1, 1],
      ['gw', 'Direct Connect gateway', 'network', 2, 1],
      ['vpc', 'VPC (private VIF)', 'compute', 3, 1],
      ['vpn', 'Site-to-Site VPN (backup)', 'network', 0, 2],
    ],
    edges: [
      ['dc', 'dx', 'Dedicated link'],
      ['dx', 'gw', 'Private VIF'],
      ['gw', 'vpc', 'Routes to VPC'],
      ['dc', 'vpn', 'Backup over internet', 'dashed'],
    ],
    steps: [
      'The on-premises router connects to AWS at a Direct Connect location over a dedicated line.',
      'A virtual interface and Direct Connect gateway extend the connection to your VPC(s).',
      'A VPN over the internet provides a lower-cost backup path (and encryption where needed).',
    ],
  },
  questionTypes: [
    { pattern: 'Consistent bandwidth and latency to on-premises', hint: 'Direct Connect.' },
    { pattern: 'Encrypt Direct Connect traffic', hint: 'IPsec VPN over Direct Connect (or MACsec).' },
    { pattern: 'Quick, cheap connectivity', hint: 'Site-to-Site VPN, not Direct Connect.' },
    { pattern: 'Connect multiple VPCs/Regions', hint: 'Direct Connect gateway (and Transit Gateway).' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company transfers large volumes of data daily between its data center and AWS and needs predictable network performance and lower data-transfer cost than the internet. Which solution is best?',
      options: ['Site-to-Site VPN over the internet', 'AWS Direct Connect', 'Public S3 endpoints', 'A NAT gateway'],
      answer: ['B'],
      explanation: 'Direct Connect provides a dedicated private connection with consistent latency and reduced data transfer charges.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company uses Direct Connect and must ensure that data in transit between the data center and AWS is encrypted. What should the architect do?',
      options: ['Nothing - Direct Connect is encrypted by default', 'Establish an IPsec Site-to-Site VPN over the Direct Connect connection', 'Replace Direct Connect with a NAT gateway', 'Use security groups to encrypt traffic'],
      answer: ['B'],
      explanation: 'Direct Connect is private but not encrypted by default; an IPsec VPN over the link (or MACsec where supported) provides encryption in transit.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company needs connectivity to AWS within days while a Direct Connect connection is being provisioned. Which approach meets the need?',
      options: ['Wait for Direct Connect', 'Create an AWS Site-to-Site VPN as an interim connection', 'Use VPC peering', 'Use an Elastic IP'],
      answer: ['B'],
      explanation: 'A Site-to-Site VPN can be established quickly over the internet and later serve as backup to Direct Connect.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'One Direct Connect connection must provide access to VPCs in several AWS Regions. Which component enables this?',
      options: ['VPC peering', 'Direct Connect gateway', 'Internet gateway', 'NAT gateway'],
      answer: ['B'],
      explanation: 'A Direct Connect gateway lets a single connection reach multiple VPCs across Regions through virtual private gateways or Transit Gateways.',
    },
  ],
  keyFacts: [
    'Dedicated connection speeds: 1, 10 and 100 Gbps; hosted connections via partners offer smaller speeds.',
    'VIF types: private (VPC), public (AWS public services) and transit (Transit Gateway).',
    'Direct Connect is not encrypted by default - use VPN over Direct Connect or MACsec.',
    'Lead time is long; for high availability use two connections in different locations (and a VPN backup).',
    'Direct Connect gateway enables multi-Region and multi-account VPC access from one connection.',
    'Routing uses BGP; AWS prefers Direct Connect routes over VPN routes when advertised equally specific.',
  ],
  traps: [
    { clue: 'Consistent latency/bandwidth to on-prem', answer: 'Direct Connect.' },
    { clue: 'Encrypted + quick + cheap', answer: 'Site-to-Site VPN.' },
    { clue: 'Direct Connect + encryption', answer: 'VPN over Direct Connect.' },
    { clue: 'Many VPCs/Regions via one link', answer: 'Direct Connect gateway / Transit Gateway.' },
  ],
  related: ['vpn', 'transit-gateway', 'vpc', 'privatelink', 'datasync'],
  sources: [
    { title: 'What is AWS Direct Connect?', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' },
    { title: 'Direct Connect virtual interfaces', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/WorkingWithVirtualInterfaces.html' },
    { title: 'Direct Connect gateways', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways.html' },
    { title: 'Direct Connect resiliency recommendations', url: 'https://aws.amazon.com/directconnect/resiliency-recommendation/' },
    { title: 'AWS CLI directconnect commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/directconnect/index.html' },
  ],
};
