import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon VPC. Schema: see s3.js. */
export default {
  tagline: 'Your private, isolated network in AWS: subnets, routing, gateways and the layered security around them.',
  intro: [
    'A Virtual Private Cloud (VPC) is a logically isolated network in one Region, defined by an IPv4 CIDR block (and optionally IPv6) and spanning all Availability Zones in that Region.',
    'A subnet lives in exactly one AZ. A subnet is "public" when its route table sends 0.0.0.0/0 to an internet gateway; otherwise it is private.',
    'Route tables decide where traffic goes; an internet gateway (IGW) gives public connectivity; a NAT gateway lets private instances start outbound connections without being reachable from the internet.',
    'Security groups are stateful, instance-level allow-only firewalls; network ACLs are stateless, subnet-level firewalls with allow and deny rules evaluated in number order.',
    'Connectivity options: VPC peering (non-transitive), Transit Gateway, VPC endpoints / PrivateLink, Site-to-Site VPN and Direct Connect.',
    'VPC Flow Logs capture IP traffic metadata for troubleshooting and security analysis, and are delivered to CloudWatch Logs, S3 or Firehose.',
  ],
  useCases: [
    { title: 'Three-tier web application', detail: 'Public subnets for load balancers, private subnets for app servers and databases across at least two AZs.' },
    { title: 'Private access to AWS services', detail: 'Gateway endpoints (S3, DynamoDB) and interface endpoints keep traffic off the public internet and avoid NAT charges.' },
    { title: 'Hybrid networking', detail: 'Extend on-premises networks with Site-to-Site VPN or Direct Connect attached to a virtual private gateway or Transit Gateway.' },
    { title: 'Network segmentation and compliance', detail: 'Separate environments with VPCs/subnets; use security groups and NACLs for defence in depth.' },
  ],
  importance: {
    points: [
      'Networking underpins Domains 1, 3 and 4: Task 1.2 (VPC security components), 3.4 (network architecture) and 4.4 (NAT gateway, peering and routing cost).',
      'Almost every scenario has a VPC: knowing public vs private subnet, NAT, endpoints and SG vs NACL is non-negotiable.',
      'AWS\'s own sample questions include a NAT gateway scenario.',
    ],
  },
  cli: [
    { command: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16', description: 'Create a VPC.' },
    { command: 'aws ec2 create-subnet --vpc-id vpc-0abc --cidr-block 10.0.1.0/24 --availability-zone ap-south-1a', description: 'Create a subnet in a specific AZ.' },
    { command: 'aws ec2 create-internet-gateway && aws ec2 attach-internet-gateway --internet-gateway-id igw-0abc --vpc-id vpc-0abc', description: 'Create an internet gateway and attach it to the VPC.' },
    { command: 'aws ec2 create-nat-gateway --subnet-id subnet-public1 --allocation-id eipalloc-0abc', description: 'Create a NAT gateway in a PUBLIC subnet with an Elastic IP.' },
    { command: 'aws ec2 create-route --route-table-id rtb-private --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-0abc', description: 'Send a private subnet\'s internet-bound traffic to the NAT gateway.' },
    { command: 'aws ec2 create-security-group --group-name web-sg --description "web" --vpc-id vpc-0abc', description: 'Create a security group.' },
    { command: 'aws ec2 authorize-security-group-ingress --group-id sg-0abc --protocol tcp --port 443 --cidr 0.0.0.0/0', description: 'Allow inbound HTTPS.' },
    { command: 'aws ec2 create-vpc-endpoint --vpc-id vpc-0abc --service-name com.amazonaws.ap-south-1.s3 --route-table-ids rtb-private', description: 'Create a gateway endpoint so private subnets reach S3 without NAT.' },
    { command: 'aws ec2 create-vpc-peering-connection --vpc-id vpc-0abc --peer-vpc-id vpc-0def', description: 'Request a VPC peering connection.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): create a VPC and subnet',
        language: 'python',
        code: `import boto3

ec2 = boto3.client("ec2", region_name="ap-south-1")
vpc_id = ec2.create_vpc(CidrBlock="10.0.0.0/16")["Vpc"]["VpcId"]
ec2.modify_vpc_attribute(VpcId=vpc_id, EnableDnsHostnames={"Value": True})

subnet = ec2.create_subnet(
    VpcId=vpc_id, CidrBlock="10.0.1.0/24", AvailabilityZone="ap-south-1a"
)["Subnet"]["SubnetId"]
print(vpc_id, subnet)`,
      },
    ],
  },
  examples: [
    {
      title: 'Highly available three-tier network',
      scenario: 'A web app needs internet-facing load balancing, private application servers, and a private database across two AZs.',
      steps: [
        'Create a VPC (10.0.0.0/16) and two public + two private subnets, one pair per AZ.',
        'Attach an internet gateway; public route table sends 0.0.0.0/0 to the IGW.',
        'Place an ALB in the public subnets and a NAT gateway in each AZ\'s public subnet.',
        'Private route tables send 0.0.0.0/0 to the NAT gateway in the same AZ.',
        'Security groups: ALB SG allows 443 from the internet; app SG allows traffic only from the ALB SG; DB SG allows only from the app SG.',
      ],
    },
  ],
  diagram: {
    title: 'Public and private subnets with NAT gateway',
    nodes: [
      ['net', 'Internet', 'external', 0, 1],
      ['igw', 'Internet gateway', 'network', 1, 1],
      ['alb', 'ALB (public subnet)', 'network', 2, 0],
      ['nat', 'NAT gateway (public subnet)', 'network', 2, 2],
      ['app', 'App servers (private subnet)', 'compute', 3, 1],
    ],
    edges: [
      ['net', 'igw', 'Inbound HTTPS'],
      ['igw', 'alb', 'Route to ALB'],
      ['alb', 'app', 'Forward to targets'],
      ['app', 'nat', 'Outbound updates'],
      ['nat', 'igw', 'Via IGW to internet'],
    ],
    groups: [['VPC 10.0.0.0/16', 1, 0, 3, 2]],
    steps: [
      'Users reach the internet gateway, which routes traffic to the load balancer in the public subnet.',
      'The ALB forwards requests to application servers that sit in private subnets and have no public IP.',
      'When the servers need patches, their route table sends internet-bound traffic to the NAT gateway in a public subnet.',
      'The NAT gateway forwards the request through the internet gateway; replies return the same way, but nothing on the internet can initiate a connection to the servers.',
    ],
  },
  questionTypes: [
    { pattern: 'Private instances need outbound internet only', hint: 'NAT gateway in a public subnet + route in the private route table (not an IGW route).' },
    { pattern: 'Security group vs network ACL', hint: 'Stateful allow-only vs stateless allow/deny; block one IP = NACL deny.' },
    { pattern: 'Private connectivity to AWS services', hint: 'Gateway endpoints (S3, DynamoDB) or interface endpoints; saves NAT cost and avoids the internet.' },
    { pattern: 'Connecting VPCs', hint: 'Peering (non-transitive, no overlapping CIDRs) vs Transit Gateway for many VPCs.' },
    { pattern: 'Cost of NAT designs', hint: 'One NAT per AZ for resilience vs one shared NAT for lowest cost; cross-AZ data transfer charges.' },
  ],
  questions: [
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q1', domain: 1, multi: true,
      stem: 'A company runs a public-facing three-tier web application in a VPC across multiple Availability Zones. Amazon EC2 instances for the application tier running in private subnets need to download software patches from the internet. However, the EC2 instances cannot be directly accessible from the internet. Which actions should be taken to allow the EC2 instances to download the needed patches? (Select TWO.)',
      options: [
        'Configure a NAT gateway in a public subnet.',
        'Define a custom route table with a route to the NAT gateway for internet traffic and associate it with the private subnets for the application tier.',
        'Assign Elastic IP addresses to the EC2 instances.',
        'Define a custom route table with a route to the internet gateway for internet traffic and associate it with the private subnets for the application tier.',
        'Configure a NAT instance in a private subnet.',
      ],
      answer: ['A', 'B'],
      explanation: 'A NAT gateway forwards traffic from the EC2 instances in the private subnet to the internet or other AWS services, and then sends the response back to the instances. After a NAT gateway is created, the route tables for private subnets must be updated to point internet traffic to the NAT gateway. (AWS official explanation.)',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A security team must immediately block traffic from a specific malicious IP address to all instances in a subnet. Which action is the MOST appropriate?',
      options: [
        'Add a deny rule for the IP address to the subnet\'s network ACL.',
        'Add a deny rule for the IP address to each instance\'s security group.',
        'Remove the internet gateway from the VPC.',
        'Create a VPC endpoint for the IP address.',
      ],
      answer: ['A'],
      explanation: 'Network ACLs support explicit deny rules and apply to the whole subnet. Security groups only contain allow rules, so you cannot deny a specific IP with them.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Instances in private subnets download large datasets from Amazon S3 through a NAT gateway, causing high data processing charges. How can the company reduce cost while keeping traffic private?',
      options: [
        'Add a second NAT gateway in each Availability Zone.',
        'Create a gateway VPC endpoint for S3 and add it to the private route tables.',
        'Move the instances to public subnets with Elastic IP addresses.',
        'Use a NAT instance instead of the NAT gateway.',
      ],
      answer: ['B'],
      explanation: 'A gateway endpoint for S3 routes S3 traffic privately over the AWS network at no additional charge, bypassing the NAT gateway and its per-GB processing fee.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company has twelve VPCs in one Region and an on-premises network connected by AWS Direct Connect. Many VPCs must communicate with each other and with on-premises, and the number of VPCs is growing. Which solution scales BEST?',
      options: [
        'Create a full mesh of VPC peering connections.',
        'Attach all VPCs and the Direct Connect gateway to an AWS Transit Gateway.',
        'Route traffic between VPCs through an internet gateway.',
        'Place all workloads in a single large subnet.',
      ],
      answer: ['B'],
      explanation: 'Transit Gateway is a regional hub that connects many VPCs and on-premises networks with simple route management. Peering is non-transitive and a full mesh grows quadratically.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An application tier in private subnets across two Availability Zones needs outbound internet access. The design must tolerate the failure of one Availability Zone. What should the architect do?',
      options: [
        'Deploy one NAT gateway in one public subnet and route all private subnets to it.',
        'Deploy a NAT gateway in a public subnet in each Availability Zone and route each private subnet to the NAT gateway in its own AZ.',
        'Attach an internet gateway to each private subnet.',
        'Deploy a NAT instance in a private subnet.',
      ],
      answer: ['B'],
      explanation: 'A NAT gateway is zonal. One per AZ, used by that AZ\'s private subnets, avoids a single point of failure and cross-AZ data charges. Private subnets cannot use an internet gateway route, and a NAT must be in a public subnet.',
    },
  ],
  keyFacts: [
    'A VPC is regional; a subnet is zonal (one AZ). A subnet cannot span AZs.',
    'Each VPC has a main route table; a subnet is public only because of a route to an internet gateway.',
    'Security groups: stateful, allow rules only, evaluated together. NACLs: stateless, numbered allow/deny rules, one per subnet, must allow return (ephemeral) traffic.',
    'NAT gateway: managed, zonal, lives in a public subnet, needs an Elastic IP, supports outbound IPv4 only (use an egress-only internet gateway for IPv6).',
    'Gateway endpoints exist only for S3 and DynamoDB, are free and use route tables; interface endpoints (PrivateLink) use ENIs and cost per hour and per GB.',
    'VPC peering is non-transitive, requires non-overlapping CIDRs and works across accounts and Regions.',
    'AWS reserves 5 IP addresses in every subnet (first four and the last). VPC CIDR range is /16 to /28.',
    'Flow Logs record IP traffic metadata (not packet contents) at VPC, subnet or ENI level.',
  ],
  traps: [
    { clue: 'Private instance needs outbound internet only', answer: 'NAT gateway in a public subnet.' },
    { clue: 'Block a single IP address', answer: 'Network ACL deny rule (security groups cannot deny).' },
    { clue: 'Reach S3/DynamoDB privately with no cost', answer: 'Gateway VPC endpoint.' },
    { clue: 'Hundreds of VPCs, transitive routing', answer: 'AWS Transit Gateway.' },
    { clue: 'Expose your own service to other VPCs privately', answer: 'AWS PrivateLink (interface endpoint service).' },
  ],
  related: ['elb', 'transit-gateway', 'privatelink', 'direct-connect', 'vpn', 'route53'],
  sources: [
    { title: 'What is Amazon VPC?', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html' },
    { title: 'Subnets for your VPC', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html' },
    { title: 'NAT gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' },
    { title: 'Security groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' },
    { title: 'Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' },
    { title: 'Gateway endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html' },
    { title: 'VPC Flow Logs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html' },
  ],
};
