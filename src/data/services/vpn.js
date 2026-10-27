import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Site-to-Site VPN and Client VPN. Schema: see s3.js. */
export default {
  tagline: 'Encrypted tunnels over the internet: Site-to-Site VPN links networks, Client VPN links individual users.',
  intro: [
    'AWS Site-to-Site VPN creates an IPsec VPN connection between your VPC and your on-premises network or branch office across the public internet.',
    'Each VPN connection has two tunnels for high availability; on the AWS side the endpoint is a virtual private gateway (attached to one VPC) or a transit gateway (many VPCs), and on your side is a customer gateway device.',
    'Routing can be static or dynamic with BGP; a standard tunnel supports up to 1.25 Gbps, larger tunnels (up to 5 Gbps) are available on Transit Gateway or Cloud WAN, and Accelerated Site-to-Site VPN uses Global Accelerator for better performance.',
    'AWS Client VPN is a managed, client-based OpenVPN service for remote users; you create a Client VPN endpoint, associate target subnets and add authorization rules.',
    'Client VPN authenticates with Active Directory, SAML-based federation or mutual certificates, and logs connections to CloudWatch Logs.',
    'A VPN is quick to set up and low cost but depends on the internet; Direct Connect gives a dedicated, consistent connection, and a VPN is often used as its backup or as an encrypted overlay.',
  ],
  useCases: [
    { title: 'Quick hybrid connectivity', detail: 'Connect a data centre to a VPC in hours when Direct Connect lead time is too long.' },
    { title: 'Backup for Direct Connect', detail: 'Fail over to a VPN if the dedicated link goes down.' },
    { title: 'Remote workforce access', detail: 'Client VPN lets employees reach private VPC and on-premises resources from laptops.' },
    { title: 'Encrypted traffic over Direct Connect', detail: 'Run IPsec over a Direct Connect public virtual interface or private IP VPN for encryption.' },
  ],
  importance: {
    points: [
      'Domain 1 (secure network design), Domain 2 (hybrid resilience) and Domain 4 (cheap connectivity) all use it; know when VPN beats Direct Connect (speed to deploy, cost) and when it does not (consistent bandwidth and latency).',
      'The exam commonly tests the two-tunnel design, the virtual private gateway vs transit gateway choice and Client VPN for remote users.',
    ],
  },
  cli: [
    { command: 'aws ec2 create-customer-gateway --type ipsec.1 --public-ip 203.0.113.12 --bgp-asn 65000', description: 'Register your on-premises VPN device.' },
    { command: 'aws ec2 create-vpn-gateway --type ipsec.1', description: 'Create a virtual private gateway.' },
    { command: 'aws ec2 attach-vpn-gateway --vpn-gateway-id vgw-0abc --vpc-id vpc-0abc', description: 'Attach the gateway to a VPC.' },
    { command: 'aws ec2 create-vpn-connection --type ipsec.1 --customer-gateway-id cgw-0abc --vpn-gateway-id vgw-0abc', description: 'Create the Site-to-Site VPN connection with two tunnels.' },
    { command: 'aws ec2 create-client-vpn-endpoint --client-cidr-block 10.100.0.0/16 --server-certificate-arn <acm-arn> --authentication-options Type=certificate-authentication,MutualAuthentication={ClientRootCertificateChainArn=<arn>} --connection-log-options Enabled=false', description: 'Create a Client VPN endpoint using mutual certificate authentication.' },
    { command: 'aws ec2 authorize-client-vpn-ingress --client-vpn-endpoint-id <id> --target-network-cidr 10.0.0.0/16 --authorize-all-groups', description: 'Allow clients to reach the VPC CIDR.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): create a Site-to-Site VPN connection',
        language: 'python',
        code: `import boto3

ec2 = boto3.client("ec2")
vpn = ec2.create_vpn_connection(
    Type="ipsec.1",
    CustomerGatewayId="cgw-0abc",
    VpnGatewayId="vgw-0abc",
    Options={"StaticRoutesOnly": False},
)["VpnConnection"]
print(vpn["VpnConnectionId"], vpn["State"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Connect a branch office and add a remote-user path',
      scenario: 'A company needs encrypted access between its office and a VPC this week, plus VPN access for travelling staff.',
      steps: [
        'Create a customer gateway for the office firewall and a virtual private gateway for the VPC.',
        'Create the Site-to-Site VPN connection, configure both tunnels on the firewall, enable route propagation.',
        'Create a Client VPN endpoint, associate private subnets and authorise an Active Directory group.',
        'Plan Direct Connect later and keep the VPN as the backup.',
      ],
    },
  ],
  diagram: {
    title: 'Site-to-Site VPN and Client VPN into a VPC',
    nodes: [
      ['cgw', 'Customer gateway device (on premises)', 'external', 0, 1],
      ['tun', 'Two IPsec tunnels over the internet', 'network', 1, 1],
      ['vgw', 'Virtual private gateway / Transit Gateway', 'network', 2, 1],
      ['vpc', 'Amazon VPC', 'network', 3, 1],
      ['user', 'Remote user (OpenVPN client)', 'actor', 2, 2],
      ['cvpn', 'Client VPN endpoint', 'network', 3, 2],
    ],
    edges: [
      ['cgw', 'tun', 'IKE / IPsec'],
      ['tun', 'vgw', 'Encrypted traffic'],
      ['vgw', 'vpc', 'Routes to subnets'],
      ['user', 'cvpn', 'TLS (OpenVPN)'],
      ['cvpn', 'vpc', 'Authorised access'],
    ],
    steps: [
      'The on-premises device builds two IPsec tunnels to the AWS endpoint for redundancy.',
      'The virtual private gateway (one VPC) or transit gateway (many VPCs) delivers traffic into the VPC.',
      'Remote users connect with an OpenVPN client to a Client VPN endpoint, which applies authorization rules before reaching the VPC.',
    ],
  },
  questionTypes: [
    { pattern: 'Quick, low-cost encrypted link to on premises', hint: 'Site-to-Site VPN.' },
    { pattern: 'Remote employees reach private resources', hint: 'Client VPN.' },
    { pattern: 'VPN vs Direct Connect', hint: 'VPN = fast, cheap, internet; Direct Connect = dedicated, consistent, weeks to provision.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company needs an encrypted connection between its data centre and an Amazon VPC within a few days at the lowest cost. Which solution should be used?',
      options: ['A NAT gateway', 'AWS Direct Connect with a new dedicated line', 'AWS Snowball Edge', 'AWS Site-to-Site VPN'],
      answer: ['D'],
      explanation: 'A Site-to-Site VPN can be created quickly over the existing internet connection and is encrypted with IPsec; Direct Connect takes longer and costs more.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Remote employees must access private resources in a VPC from their laptops using their Active Directory credentials. Which AWS service should be used?',
      options: ['Amazon CloudFront', 'AWS Site-to-Site VPN', 'AWS Client VPN', 'AWS Direct Connect'],
      answer: ['C'],
      explanation: 'Client VPN is a managed OpenVPN-based service for individual users and supports Active Directory authentication.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company\'s Direct Connect link is its primary path to AWS. What is the MOST cost-effective way to add a backup path?',
      options: ['An S3 bucket in another Region', 'A second Direct Connect location immediately', 'A Site-to-Site VPN over the internet', 'An EBS snapshot'],
      answer: ['C'],
      explanation: 'A VPN is inexpensive and quick to deploy and is commonly used as a backup to Direct Connect (a second Direct Connect gives higher resilience but at higher cost).',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which statements about AWS Site-to-Site VPN are true? (Select TWO.)',
      multi: true,
      options: ['Traffic is encrypted with IPsec.', 'It is configured with security groups only.', 'It guarantees consistent latency regardless of internet conditions.', 'It provides a dedicated private fibre connection.', 'Each VPN connection includes two tunnels for high availability.'],
      answer: ['A', 'E'],
      explanation: 'A VPN connection has two IPsec tunnels, but it traverses the public internet; dedicated and consistent connectivity is Direct Connect.',
    },
  ],
  keyFacts: [
    'Site-to-Site VPN: IPsec, two tunnels per connection, up to 1.25 Gbps per standard tunnel (larger tunnels on Transit Gateway/Cloud WAN).',
    'AWS side endpoints: virtual private gateway (one VPC) or transit gateway (many VPCs); your side: customer gateway device.',
    'Routing: static or BGP dynamic; route propagation updates VPC route tables.',
    'Client VPN: OpenVPN-based, authentication by Active Directory, SAML or certificates; authorization rules restrict network access.',
    'VPN uses the public internet; Direct Connect is private and consistent but takes longer to provision.',
    'Accelerated Site-to-Site VPN uses Global Accelerator for better performance.',
  ],
  traps: [
    { clue: 'Hours-to-days setup, encrypted, low cost', answer: 'Site-to-Site VPN.' },
    { clue: 'Consistent latency, high throughput, private', answer: 'Direct Connect.' },
    { clue: 'Individual remote users', answer: 'Client VPN.' },
    { clue: 'Connect many VPCs and sites at scale', answer: 'Transit Gateway.' },
  ],
  related: ['vpc', 'direct-connect', 'transit-gateway', 'global-accelerator', 'directory-service', 'privatelink'],
  sources: [
    { title: 'What is AWS Site-to-Site VPN?', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html' },
    { title: 'What is AWS Client VPN?', url: 'https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html' },
    { title: 'Site-to-Site VPN customer gateway options', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/cgw-options.html' },
    { title: 'AWS CLI ec2 commands (VPN operations)', url: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/index.html' },
  ],
};
