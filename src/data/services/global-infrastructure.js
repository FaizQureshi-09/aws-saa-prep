import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Global Infrastructure and the Shared Responsibility Model. Schema: see s3.js. */
export default {
  tagline: 'Regions, Availability Zones and edge locations - plus who is responsible for securing what.',
  intro: [
    'An AWS Region is a separate geographic area; each Region is isolated from the others and contains multiple Availability Zones (AZs).',
    'An Availability Zone is one or more discrete data centers with independent power, cooling and networking, connected to other AZs in the Region by low-latency, high-throughput links.',
    'Edge locations and Regional edge caches serve content for CloudFront and answer Route 53, Shield and WAF traffic close to users; Local Zones, Wavelength and Outposts extend AWS closer to users or into your own facility.',
    'Choose a Region by compliance and data residency, latency to users, service and feature availability, and price; data does not leave a Region unless you move it.',
    'Most services are Regional; some are global (IAM, Route 53, CloudFront, AWS Organizations) and some resources are zonal (subnets, EBS volumes, NAT gateways).',
    'The shared responsibility model: AWS secures the cloud itself (hardware, facilities, virtualisation, managed service software); you secure what you put in the cloud (data, IAM, OS patching on EC2, network rules, encryption choices).',
  ],
  useCases: [
    { title: 'High availability', detail: 'Spread instances and databases across at least two AZs so one AZ failure does not cause an outage.' },
    { title: 'Disaster recovery', detail: 'Replicate data to a second Region to survive a Regional event.' },
    { title: 'Low-latency global delivery', detail: 'Use CloudFront edge locations and Global Accelerator close to users.' },
    { title: 'Data residency and compliance', detail: 'Keep data in a specific Region to meet regulation.' },
  ],
  importance: {
    points: [
      'Task 1.1 lists global infrastructure and the shared responsibility model explicitly; Tasks 2.2, 3.3 and 4.2 repeat "Availability Zones and Regions".',
      'Almost every resilience question assumes you know that AZ = fault domain and Region = disaster boundary.',
      'Shared responsibility questions test which tasks belong to you for EC2 vs RDS vs S3.',
    ],
  },
  cli: [
    { command: 'aws ec2 describe-regions --all-regions', description: 'List Regions (including those not enabled for your account).' },
    { command: 'aws ec2 describe-availability-zones --region ap-south-1', description: 'List the AZs in a Region.' },
    { command: 'aws account list-regions --region-opt-status-contains ENABLED ENABLED_BY_DEFAULT', description: 'Show enabled Regions for the account.' },
    { command: 'aws account enable-region --region-name ap-south-2', description: 'Opt in to a Region that is disabled by default.' },
    { command: 'aws configure set region ap-south-1', description: 'Set your default Region for the CLI.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list AZs in a Region',
        language: 'python',
        code: `import boto3

ec2 = boto3.client("ec2", region_name="ap-south-1")
for az in ec2.describe_availability_zones()["AvailabilityZones"]:
    print(az["ZoneName"], az["ZoneId"], az["State"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Where do I deploy?',
      scenario: 'An Indian retailer must keep customer data in India, serve customers with low latency, and survive a data center failure.',
      steps: [
        'Choose an Indian Region to satisfy data residency and latency.',
        'Deploy application and database resources across at least two AZs in that Region.',
        'Use CloudFront to cache static content at edge locations.',
        'If a second Region is needed for DR, pick one that satisfies the same residency rules.',
      ],
    },
  ],
  diagram: {
    title: 'Regions, Availability Zones and edge locations',
    nodes: [
      ['user', 'Users', 'actor', 0, 1],
      ['edge', 'Edge location (CloudFront)', 'network', 1, 1],
      ['az1', 'Availability Zone A', 'compute', 2, 0],
      ['az2', 'Availability Zone B', 'compute', 2, 2],
      ['other', 'Another Region (DR)', 'storage', 3, 1],
    ],
    edges: [
      ['user', 'edge', 'Nearest edge'],
      ['edge', 'az1', 'Origin fetch'],
      ['edge', 'az2', 'Origin fetch'],
      ['az1', 'other', 'Replication', 'dashed'],
    ],
    groups: [['AWS Region', 2, 0, 2, 2]],
    steps: [
      'Users reach the nearest edge location, which serves cached content or fetches from the origin.',
      'Inside the Region, workloads run across multiple AZs, each an independent failure domain.',
      'For disaster recovery, data is replicated to another Region, which is isolated from the first.',
    ],
  },
  questionTypes: [
    { pattern: 'Survive a data center failure', hint: 'Deploy across multiple Availability Zones.' },
    { pattern: 'Survive a Regional event', hint: 'Multi-Region design with replicated data and DNS failover.' },
    { pattern: 'Who is responsible?', hint: 'Customer: data, IAM, guest OS patching on EC2, security groups. AWS: physical, hypervisor, managed service patching.' },
    { pattern: 'Choosing a Region', hint: 'Compliance, latency, available services, price.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company needs its application to remain available if one data center in a Region fails, without cross-Region data transfer costs. What should the architect do?',
      options: ['Deploy resources across multiple Availability Zones in one Region', 'Deploy everything in a single Availability Zone with larger instances', 'Deploy in two Regions with synchronous replication', 'Use a single large EC2 instance with Reserved pricing'],
      answer: ['A'],
      explanation: 'Availability Zones are independent failure domains within a Region, connected by low-latency links, so multi-AZ designs survive a data center failure without cross-Region costs.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Under the AWS shared responsibility model, which task is the customer\'s responsibility when using Amazon EC2?',
      options: ['Patching the guest operating system', 'Maintaining the physical servers', 'Operating the hypervisor', 'Securing the data center perimeter'],
      answer: ['A'],
      explanation: 'For EC2 (infrastructure as a service) AWS secures the underlying infrastructure and hypervisor; the customer manages the guest OS, applications, security groups and data.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Under the shared responsibility model, who is responsible for patching the database engine of an Amazon RDS instance?',
      options: ['The customer', 'AWS', 'The operating system vendor', 'The AWS Marketplace seller'],
      answer: ['B'],
      explanation: 'RDS is a managed service: AWS patches the database engine and OS (within the maintenance window you configure), while the customer manages data, access and network configuration.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statement about Availability Zones is correct?',
      options: ['A subnet can span multiple Availability Zones', 'An EBS volume can be attached to an instance in any Availability Zone in the Region', 'A subnet resides entirely in one Availability Zone', 'Availability Zones are located in different Regions'],
      answer: ['C'],
      explanation: 'A subnet is zonal - it lives in exactly one AZ. EBS volumes are also bound to a single AZ, and AZs belong to a single Region.',
    },
  ],
  keyFacts: [
    'Regions are isolated from each other; services and data stay in a Region unless you explicitly replicate or move them.',
    'An AZ is a fault-isolation boundary within a Region; highly available designs use at least two AZs.',
    'Zonal resources: subnets, EBS volumes, NAT gateways. Regional: S3 buckets, VPCs, most services. Global: IAM, Route 53, CloudFront, Organizations.',
    'Edge locations serve CloudFront, Route 53, Shield and WAF; they are separate from Regions.',
    'Shared responsibility: AWS = security OF the cloud; customer = security IN the cloud, and the split shifts with the service (EC2 vs RDS vs Lambda vs S3).',
    'Some newer Regions must be opted in before use.',
  ],
  traps: [
    { clue: 'Data center failure', answer: 'Multi-AZ.' },
    { clue: 'Regional disaster or data residency across geographies', answer: 'Multi-Region.' },
    { clue: 'Guest OS patching responsibility', answer: 'Customer (for EC2).' },
    { clue: 'Database engine patching responsibility (RDS)', answer: 'AWS.' },
  ],
  related: ['well-architected', 'dr-strategies', 'cloudfront', 'route53', 'iam', 'outposts'],
  sources: [
    { title: 'AWS Global Infrastructure', url: 'https://aws.amazon.com/about-aws/global-infrastructure/' },
    { title: 'Regions and Availability Zones', url: 'https://aws.amazon.com/about-aws/global-infrastructure/regions_az/' },
    { title: 'Shared Responsibility Model', url: 'https://aws.amazon.com/compliance/shared-responsibility-model/' },
    { title: 'Regions and Zones (Amazon EC2)', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html' },
    { title: 'AWS CLI ec2 describe-availability-zones', url: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-availability-zones.html' },
  ],
};
