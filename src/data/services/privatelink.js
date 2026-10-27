import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS PrivateLink and VPC endpoints. Schema: see s3.js. */
export default {
  tagline: 'Reach AWS services and partner/own services privately - without internet gateways, NAT or public IPs.',
  intro: [
    'VPC endpoints connect your VPC privately to supported AWS services; traffic stays on the AWS network and never traverses the public internet.',
    'Gateway endpoints exist only for Amazon S3 and DynamoDB, are free, and work through route-table entries.',
    'Interface endpoints (powered by AWS PrivateLink) place an elastic network interface with a private IP in your subnet to reach many AWS services or your own services.',
    'You can publish your own service behind a Network Load Balancer as an endpoint service so consumers in other VPCs and accounts connect privately - even with overlapping CIDR blocks.',
    'Endpoint policies restrict which actions and resources can be reached through the endpoint; security groups control access to interface endpoints.',
    'Private DNS makes the service\'s normal DNS name resolve to the endpoint\'s private IPs.',
  ],
  useCases: [
    { title: 'Private subnets without NAT', detail: 'Access S3, DynamoDB, SQS, KMS and other services without internet routes.' },
    { title: 'Expose a SaaS or internal service privately', detail: 'Producers publish via NLB; consumers connect with interface endpoints.' },
    { title: 'Cut NAT and data-transfer costs', detail: 'Gateway endpoints avoid NAT processing charges for S3 and DynamoDB traffic.' },
  ],
  importance: {
    points: [
      'Named in Tasks 3.4 (PrivateLink as a connection option) and 4.4 (VPC endpoints to minimise transfer cost).',
      'Key distinction: gateway endpoints (S3, DynamoDB, free) vs interface endpoints (everything else, per-hour cost).',
    ],
  },
  cli: [
    { command: 'aws ec2 create-vpc-endpoint --vpc-id vpc-0abc --service-name com.amazonaws.ap-south-1.s3 --route-table-ids rtb-0abc', description: 'Create a gateway endpoint for S3.' },
    { command: 'aws ec2 create-vpc-endpoint --vpc-id vpc-0abc --vpc-endpoint-type Interface --service-name com.amazonaws.ap-south-1.sqs --subnet-ids subnet-a subnet-b --security-group-ids sg-0abc --private-dns-enabled', description: 'Create an interface endpoint for SQS.' },
    { command: 'aws ec2 create-vpc-endpoint-service-configuration --network-load-balancer-arns <nlb-arn> --acceptance-required', description: 'Publish your own service as an endpoint service.' },
    { command: 'aws ec2 describe-vpc-endpoints', description: 'List endpoints.' },
    { command: 'aws ec2 modify-vpc-endpoint --vpc-endpoint-id vpce-0abc --policy-document file://endpoint-policy.json', description: 'Attach an endpoint policy.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'JSON: an endpoint policy allowing one bucket',
        language: 'json',
        code: `{
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::reports-bucket/*"
  }]
}`,
      },
    ],
  },
  examples: [
    {
      title: 'Private access to S3 for a locked-down VPC',
      scenario: 'Instances in private subnets must read from S3 but there must be no route to the internet.',
      steps: [
        'Create a gateway endpoint for S3 and associate it with the private route tables.',
        'Attach an endpoint policy that allows only the required bucket.',
        'Add a bucket policy condition aws:SourceVpce to accept requests only from that endpoint.',
      ],
    },
  ],
  diagram: {
    title: 'Gateway and interface endpoints',
    nodes: [
      ['app', 'Private instances', 'compute', 0, 1],
      ['gw', 'Gateway endpoint (S3, DynamoDB)', 'network', 1, 0],
      ['if', 'Interface endpoint (PrivateLink ENI)', 'network', 1, 2],
      ['s3', 'Amazon S3', 'storage', 2, 0],
      ['svc', 'AWS service / partner service', 'integration', 2, 2],
    ],
    edges: [
      ['app', 'gw', 'Route table entry'],
      ['app', 'if', 'Private IP + DNS'],
      ['gw', 's3', 'AWS network'],
      ['if', 'svc', 'PrivateLink'],
    ],
    steps: [
      'Traffic from private instances to S3 or DynamoDB is routed to a gateway endpoint by a prefix-list route.',
      'Traffic to other services goes to an interface endpoint\'s private IP, resolved through private DNS.',
      'In both cases the traffic stays on the AWS network - no internet gateway or NAT gateway is needed.',
    ],
  },
  questionTypes: [
    { pattern: 'Keep traffic off the internet', hint: 'VPC endpoints / PrivateLink.' },
    { pattern: 'Reduce NAT cost for S3/DynamoDB', hint: 'Gateway endpoint.' },
    { pattern: 'Expose a service to other accounts privately', hint: 'Endpoint service behind an NLB (PrivateLink).' },
    { pattern: 'Peering vs PrivateLink', hint: 'Peering connects whole networks; PrivateLink exposes only one service, one direction.' },
  ],
  questions: [
    {
      source: 'mock', domain: 4,
      stem: 'Application servers in private subnets send terabytes of data to S3 every month through a NAT gateway. Which change reduces cost without internet exposure?',
      options: ['Add a second NAT gateway', 'Create a gateway VPC endpoint for S3', 'Create an interface endpoint for S3 only', 'Use an internet gateway'],
      answer: ['B'],
      explanation: 'A gateway endpoint for S3 is free and bypasses the NAT gateway\'s per-GB processing charge while keeping traffic private.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A SaaS provider wants customers in other AWS accounts to access its application privately, even though customer VPC CIDR blocks overlap with the provider\'s. Which solution should be used?',
      options: ['VPC peering', 'AWS PrivateLink endpoint service behind a Network Load Balancer', 'An internet gateway with security groups', 'AWS Direct Connect'],
      answer: ['B'],
      explanation: 'PrivateLink exposes a service through endpoints in consumer VPCs and does not require non-overlapping CIDR ranges, unlike VPC peering.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which AWS services are accessed through GATEWAY VPC endpoints? (Select TWO.)',
      multi: true,
      options: ['Amazon S3', 'Amazon DynamoDB', 'Amazon SQS', 'AWS KMS', 'Amazon SNS'],
      answer: ['A', 'B'],
      explanation: 'Only S3 and DynamoDB use gateway endpoints; other services (SQS, KMS, SNS...) use interface endpoints powered by PrivateLink.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'An on-premises network connected through Direct Connect must reach Amazon S3 privately without using the internet. Which endpoint type supports this?',
      options: ['An S3 gateway endpoint', 'An S3 interface endpoint (AWS PrivateLink)', 'A NAT gateway', 'An internet gateway'],
      answer: ['B'],
      explanation: 'Gateway endpoints are not reachable from on premises. Interface endpoints have private IP addresses reachable over Direct Connect or VPN.',
    },
  ],
  keyFacts: [
    'Gateway endpoints: S3 and DynamoDB only; no charge; use route tables and prefix lists.',
    'Interface endpoints: ENIs with private IPs, hourly + per-GB charges; secured by security groups.',
    'PrivateLink endpoint services require a Network Load Balancer (or Gateway Load Balancer) on the provider side.',
    'Endpoint policies and bucket policies (aws:SourceVpce) can restrict access to the endpoint.',
    'PrivateLink works across accounts and with overlapping CIDRs; traffic is unidirectional from consumer to provider.',
    'Gateway endpoints are not reachable from on-premises or peered VPCs by default; interface endpoints can be reached over VPN/Direct Connect.',
  ],
  traps: [
    { clue: 'Private S3/DynamoDB access, free', answer: 'Gateway endpoint.' },
    { clue: 'Private access to other AWS services', answer: 'Interface endpoint (PrivateLink).' },
    { clue: 'Expose one service, overlapping CIDRs', answer: 'PrivateLink endpoint service.' },
    { clue: 'Connect entire networks', answer: 'Peering or Transit Gateway.' },
  ],
  related: ['vpc', 's3', 'dynamodb', 'transit-gateway', 'elb'],
  sources: [
    { title: 'What is AWS PrivateLink?', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html' },
    { title: 'Gateway endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html' },
    { title: 'Interface VPC endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html' },
    { title: 'Endpoint services', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/endpoint-service.html' },
    { title: 'AWS CLI ec2 create-vpc-endpoint', url: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/create-vpc-endpoint.html' },
  ],
};
