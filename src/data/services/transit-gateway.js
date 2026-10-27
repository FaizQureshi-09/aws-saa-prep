import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Transit Gateway. Schema: see s3.js. */
export default {
  tagline: 'A regional network hub that interconnects thousands of VPCs and on-premises networks with simple routing.',
  intro: [
    'AWS Transit Gateway (TGW) is a regional virtual router: you attach VPCs, VPNs, Direct Connect gateways and peered Transit Gateways, and it routes between them.',
    'It replaces complex meshes of VPC peering connections with a hub-and-spoke design and supports transitive routing.',
    'Transit Gateway route tables and associations let you segment traffic (for example separate production from development).',
    'Inter-Region peering connects Transit Gateways in different Regions over the AWS backbone.',
    'Multiple Site-to-Site VPN tunnels to a Transit Gateway can use ECMP to add up bandwidth beyond a single tunnel\'s limit.',
    'Transit Gateways can be shared with other accounts using AWS RAM; attachments are billed per hour and per GB processed.',
  ],
  useCases: [
    { title: 'Hub-and-spoke VPC networking', detail: 'Connect many VPCs and accounts through one hub.' },
    { title: 'Hybrid connectivity at scale', detail: 'Attach VPN and Direct Connect once and reach all VPCs.' },
    { title: 'Network segmentation and shared services', detail: 'Route tables isolate environments while sharing a services VPC.' },
  ],
  importance: {
    points: [
      'Task 4.4 names Transit Gateway and VPC peering for network routing, topology and peering cost.',
      'Answer pattern: many VPCs + on-premises + transitive routing = Transit Gateway; two VPCs = peering.',
    ],
  },
  cli: [
    { command: 'aws ec2 create-transit-gateway --description "core hub" --options AmazonSideAsn=64512,AutoAcceptSharedAttachments=enable', description: 'Create a Transit Gateway.' },
    { command: 'aws ec2 create-transit-gateway-vpc-attachment --transit-gateway-id tgw-0abc --vpc-id vpc-0abc --subnet-ids subnet-a subnet-b', description: 'Attach a VPC (one subnet per AZ).' },
    { command: 'aws ec2 create-transit-gateway-route-table --transit-gateway-id tgw-0abc', description: 'Create a TGW route table for segmentation.' },
    { command: 'aws ec2 create-transit-gateway-route --destination-cidr-block 10.2.0.0/16 --transit-gateway-route-table-id tgw-rtb-0abc --transit-gateway-attachment-id tgw-attach-0abc', description: 'Add a static route.' },
    { command: 'aws ec2 create-transit-gateway-peering-attachment --transit-gateway-id tgw-0abc --peer-transit-gateway-id tgw-0def --peer-region us-east-1 --peer-account-id 111111111111', description: 'Peer with a Transit Gateway in another Region.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): attach a VPC',
        language: 'python',
        code: `import boto3

ec2 = boto3.client("ec2")
ec2.create_transit_gateway_vpc_attachment(
    TransitGatewayId="tgw-0abc",
    VpcId="vpc-0abc",
    SubnetIds=["subnet-a", "subnet-b"],
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Replace a peering mesh',
      scenario: 'Fifteen VPCs need to reach each other and the on-premises network over Direct Connect.',
      steps: [
        'Create one Transit Gateway in the Region and attach all VPCs.',
        'Attach the Direct Connect gateway (transit VIF) for on-premises access.',
        'Use separate TGW route tables to isolate production and development.',
        'Share the TGW with other accounts through AWS RAM.',
      ],
    },
  ],
  diagram: {
    title: 'Transit Gateway hub-and-spoke',
    nodes: [
      ['vpca', 'VPC A (prod)', 'compute', 0, 0],
      ['vpcb', 'VPC B (dev)', 'compute', 0, 2],
      ['tgw', 'Transit Gateway', 'network', 1, 1],
      ['dx', 'Direct Connect / VPN', 'network', 2, 1],
      ['onprem', 'On-premises', 'external', 3, 1],
    ],
    edges: [
      ['vpca', 'tgw', 'Attachment'],
      ['vpcb', 'tgw', 'Attachment'],
      ['tgw', 'dx', 'Hybrid link'],
      ['dx', 'onprem', 'Private network'],
    ],
    steps: [
      'Each VPC attaches to the Transit Gateway once instead of peering with every other VPC.',
      'TGW route tables decide which attachments can reach each other.',
      'A Direct Connect or VPN attachment provides on-premises connectivity shared by all attached VPCs.',
    ],
  },
  questionTypes: [
    { pattern: 'Many VPCs needing transitive routing', hint: 'Transit Gateway.' },
    { pattern: 'Peering limitations', hint: 'VPC peering is non-transitive and one-to-one.' },
    { pattern: 'Increase VPN bandwidth', hint: 'Multiple VPN tunnels with ECMP on Transit Gateway.' },
  ],
  questions: [
    {
      source: 'mock', domain: 4,
      stem: 'A company has 30 VPCs that must communicate with each other and with an on-premises network. Managing peering connections has become complex. Which solution simplifies and scales the network?',
      options: ['A full mesh of VPC peering connections', 'AWS Transit Gateway with attachments for all VPCs and the on-premises connection', 'An internet gateway in every VPC', 'A NAT gateway per VPC'],
      answer: ['B'],
      explanation: 'Transit Gateway is a hub that supports transitive routing for many VPCs and hybrid links, replacing a mesh of peering connections.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'VPC A is peered with VPC B, and VPC B is peered with VPC C. Can instances in VPC A reach VPC C through VPC B?',
      options: ['Yes, peering is transitive', 'No, VPC peering is not transitive', 'Yes, if security groups allow it', 'Only with an internet gateway'],
      answer: ['B'],
      explanation: 'VPC peering does not support transitive routing; you need a direct peering connection or a Transit Gateway.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A single Site-to-Site VPN tunnel does not provide enough bandwidth to AWS. How can total VPN throughput be increased?',
      options: ['Terminate multiple VPN connections on a Transit Gateway and use ECMP', 'Add more security groups', 'Increase the VPC CIDR block', 'Enable S3 Transfer Acceleration'],
      answer: ['A'],
      explanation: 'Transit Gateway supports equal-cost multi-path (ECMP) routing across multiple VPN tunnels, aggregating bandwidth.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants to keep production VPCs isolated from development VPCs while both attach to the same Transit Gateway. What should it use?',
      options: ['Security groups attached to the Transit Gateway', 'A NAT gateway in each VPC', 'Separate Transit Gateway route tables for production and development attachments', 'An internet gateway per VPC'],
      answer: ['C'],
      explanation: 'Association and propagation with separate route tables segment which attachments can reach each other.',
    },
  ],
  keyFacts: [
    'Transit Gateway is regional; use peering attachments to connect Transit Gateways across Regions.',
    'Attach a VPC by choosing one subnet per Availability Zone.',
    'Supports transitive routing, route tables for segmentation, and ECMP for VPN bandwidth scaling.',
    'Billing: per attachment-hour plus per GB of data processed.',
    'Share with other accounts through AWS RAM.',
    'VPC peering has no hourly charge for the connection itself but is one-to-one and non-transitive.',
  ],
  traps: [
    { clue: 'Dozens of VPCs and on-prem, transitive', answer: 'Transit Gateway.' },
    { clue: 'Only two VPCs, lowest cost', answer: 'VPC peering.' },
    { clue: 'Isolate prod from dev on the hub', answer: 'Separate Transit Gateway route tables.' },
  ],
  related: ['vpc', 'direct-connect', 'vpn', 'privatelink', 'ram'],
  sources: [
    { title: 'What is AWS Transit Gateway?', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html' },
    { title: 'Transit gateway route tables', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/tgw-route-tables.html' },
    { title: 'Transit gateway peering attachments', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/tgw-peering.html' },
    { title: 'What is VPC peering?', url: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html' },
    { title: 'AWS CLI ec2 transit gateway commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/create-transit-gateway.html' },
  ],
};
