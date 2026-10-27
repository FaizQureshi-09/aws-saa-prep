import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Global Accelerator. Schema: see s3.js. */
export default {
  tagline: 'Static anycast IP addresses that route users over the AWS global network to the nearest healthy endpoint.',
  intro: [
    'AWS Global Accelerator improves the availability and performance of applications used by a global audience by sending traffic over the AWS global network instead of the congested public internet.',
    'It gives you two static anycast IPv4 addresses (four with dual-stack: two IPv4 and two IPv6) that act as fixed entry points; the addresses stay with the accelerator until you delete it.',
    'Standard accelerators route to Application Load Balancers, Network Load Balancers, EC2 instances or Elastic IP addresses in one or more Regions, choosing the endpoint by client location, health and configured policies.',
    'Health checks detect unhealthy endpoints and shift traffic to healthy ones within seconds, with no DNS caching delay; traffic dials and endpoint weights let you control blue/green or regional shifts.',
    'It works at layers 3 and 4, so it supports non-HTTP protocols (TCP and UDP) such as gaming, VoIP and IoT, and can preserve the client IP address for supported endpoints.',
    'Custom routing accelerators map specific users to specific EC2 instances or ports (for example multiplayer game sessions); Global Accelerator does not cache content, so it is not a CDN replacement.',
  ],
  useCases: [
    { title: 'Global TCP/UDP applications', detail: 'Gaming, VoIP and real-time apps that need low latency from anywhere.' },
    { title: 'Fast multi-Region failover', detail: 'Health-based routing between Regions without waiting for DNS TTLs.' },
    { title: 'Fixed IP addresses for allow-listing', detail: 'Partners and firewalls whitelist two static IPs, regardless of backend changes.' },
  ],
  importance: {
    points: [
      'Appears in Domain 3 (high-performing networks) and Domain 2 (resilience) as the answer for static IPs, non-HTTP traffic and quick regional failover.',
      'The key discrimination is Global Accelerator (TCP/UDP, no caching, static IPs) versus CloudFront (HTTP content delivery with caching) versus Route 53 (DNS routing).',
    ],
  },
  cli: [
    { command: 'aws globalaccelerator create-accelerator --name web-accel --ip-address-type IPV4 --enabled --region us-west-2', description: 'Create an accelerator (the API is in us-west-2).' },
    { command: 'aws globalaccelerator create-listener --accelerator-arn <arn> --protocol TCP --port-ranges FromPort=443,ToPort=443 --region us-west-2', description: 'Add a TCP 443 listener.' },
    { command: 'aws globalaccelerator create-endpoint-group --listener-arn <arn> --endpoint-group-region us-east-1 --endpoint-configurations EndpointId=<alb-arn>,Weight=128 --region us-west-2', description: 'Attach an ALB in us-east-1 as an endpoint.' },
    { command: 'aws globalaccelerator describe-accelerator --accelerator-arn <arn> --region us-west-2', description: 'Show the static IP addresses and DNS name.' },
    { command: 'aws globalaccelerator update-endpoint-group --endpoint-group-arn <arn> --traffic-dial-percentage 50 --region us-west-2', description: 'Send only half of the traffic to this Region.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): create an accelerator',
        language: 'python',
        code: `import boto3

ga = boto3.client("globalaccelerator", region_name="us-west-2")
acc = ga.create_accelerator(Name="web-accel", IpAddressType="IPV4", Enabled=True)["Accelerator"]
print(acc["DnsName"], [ip for s in acc["IpSets"] for ip in s["IpAddresses"]])`,
      },
    ],
  },
  examples: [
    {
      title: 'Multi-Region game backend with fast failover',
      scenario: 'A UDP game service runs in two Regions; players worldwide need low latency and instant failover.',
      steps: [
        'Create an accelerator with a UDP listener on the game port.',
        'Add endpoint groups for NLBs in us-east-1 and eu-west-1.',
        'Global Accelerator routes each player to the closest healthy Region over the AWS backbone.',
        'If a Region fails its health checks, traffic moves automatically to the other Region.',
      ],
    },
  ],
  diagram: {
    title: 'Global Accelerator request path',
    nodes: [
      ['user', 'Global users', 'actor', 0, 1],
      ['hc', 'Health checks', 'management', 1, 0],
      ['ga', 'Global Accelerator (2 static anycast IPs)', 'network', 1, 1],
      ['e2', 'NLB in eu-west-1', 'network', 1, 2],
      ['e1', 'ALB in us-east-1', 'network', 2, 1],
      ['app', 'Application servers', 'compute', 3, 1],
    ],
    edges: [
      ['user', 'ga', 'Nearest edge location'],
      ['hc', 'ga', 'Monitors endpoints'],
      ['ga', 'e2', 'Failover Region'],
      ['ga', 'e1', 'Primary Region'],
      ['e1', 'app', 'Forwards requests'],
    ],
    steps: [
      'Users connect to one of two static anycast IPs and enter the AWS network at the nearest edge location.',
      'Global Accelerator chooses a healthy endpoint using location, health and traffic dials.',
      'If an endpoint or Region becomes unhealthy, traffic shifts to the next healthy endpoint within seconds.',
    ],
  },
  questionTypes: [
    { pattern: 'Static IP addresses for a global app', hint: 'Global Accelerator.' },
    { pattern: 'Non-HTTP (TCP/UDP) global performance', hint: 'Global Accelerator, not CloudFront.' },
    { pattern: 'Fast cross-Region failover without DNS delay', hint: 'Global Accelerator health checks.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company runs a UDP-based multiplayer game in two AWS Regions. Players worldwide need the lowest latency and automatic failover between Regions. Which service should be used?',
      options: ['AWS Global Accelerator', 'Amazon Route 53 simple routing', 'Amazon CloudFront', 'Amazon S3 Transfer Acceleration'],
      answer: ['A'],
      explanation: 'Global Accelerator supports TCP and UDP, routes over the AWS backbone and fails over quickly between Regions; CloudFront serves HTTP content.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A partner can only allow-list a small number of fixed IP addresses for a global application behind several load balancers. What should the company use?',
      options: ['AWS Global Accelerator static IP addresses', 'A Route 53 alias record', 'CloudFront edge IP addresses that change over time', 'Dynamic Application Load Balancer IPs'],
      answer: ['A'],
      explanation: 'Global Accelerator provides two static anycast IP addresses that remain fixed while the accelerator exists.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statements about AWS Global Accelerator are true? (Select TWO.)',
      multi: true,
      options: ['It caches static content at edge locations.', 'It only supports HTTP traffic.', 'It replaces Amazon VPC.', 'It can route to ALBs, NLBs, EC2 instances and Elastic IP addresses.', 'It provides static anycast IP addresses as entry points.'],
      answer: ['D', 'E'],
      explanation: 'Global Accelerator provides static entry IPs and routes to those endpoint types. It does not cache content and supports TCP/UDP, not just HTTP.',
    },
  ],
  keyFacts: [
    'Two static anycast IPv4 addresses (four with dual-stack); stay assigned until the accelerator is deleted.',
    'Endpoints: ALB, NLB, EC2 instances, Elastic IPs; one or many Regions.',
    'Layer 3/4 service supporting TCP and UDP; no caching.',
    'Health checks give fast failover without DNS TTL delays; traffic dials and weights shape traffic.',
    'Custom routing accelerators map users to specific instances/ports in VPC subnets.',
  ],
  traps: [
    { clue: 'Cache static or dynamic web content at the edge', answer: 'CloudFront.' },
    { clue: 'Static IPs, UDP/TCP, instant regional failover', answer: 'Global Accelerator.' },
    { clue: 'DNS-based routing and failover with TTL', answer: 'Route 53.' },
  ],
  related: ['cloudfront', 'route53', 'elb', 'vpn', 'shield', 'ec2'],
  sources: [
    { title: 'What is AWS Global Accelerator?', url: 'https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html' },
    { title: 'How Global Accelerator works', url: 'https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-how-it-works.html' },
    { title: 'Global Accelerator use cases', url: 'https://docs.aws.amazon.com/global-accelerator/latest/dg/introduction-benefits-of-migrating.html' },
    { title: 'AWS CLI globalaccelerator commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/globalaccelerator/index.html' },
  ],
};
