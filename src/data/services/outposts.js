import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Outposts. Schema: see s3.js. */
export default {
  tagline: 'AWS-managed infrastructure and services running in your own data centre or edge site.',
  intro: [
    'AWS Outposts delivers fully managed AWS infrastructure, services, APIs and tools to on-premises and edge locations for a consistent hybrid experience.',
    'It comes in two form factors: Outposts racks (industry-standard 42U racks) and Outposts servers (2U servers for sites with limited space).',
    'An Outpost is an extension of an AWS Region: it connects to its parent Region through a service link, and you can run services such as EC2, EBS, ECS, EKS, RDS and EMR locally while managing them with the same console, CLI and APIs.',
    'Choose it for low-latency access to on-premises systems, local data processing, data residency requirements and migrations that depend on local systems.',
    'AWS installs, monitors, patches and updates the hardware, but the Outpost needs a reliable connection to its Region, and you provide space, power and networking (a local gateway connects it to your network).',
  ],
  useCases: [
    { title: 'Low-latency local processing', detail: 'Factory or retail apps that need single-digit millisecond access to local equipment.' },
    { title: 'Data residency', detail: 'Keep data in a specific country or site while using AWS APIs.' },
    { title: 'Gradual migration', detail: 'Run applications with heavy local dependencies on Outposts first, then move to the Region.' },
  ],
  importance: {
    points: [
      'Appears in hybrid questions: Outposts for AWS services on premises, Storage Gateway for hybrid storage access, VMware Cloud on AWS for vSphere.',
      'AWS recommends Outposts as the replacement path for Snowball Edge Compute Optimized workloads.',
    ],
  },
  cli: [
    { command: 'aws outposts list-outposts', description: 'List Outposts in the account.' },
    { command: 'aws outposts get-outpost --outpost-id op-0abc', description: 'Show Outpost details.' },
    { command: 'aws ec2 create-subnet --vpc-id vpc-0abc --cidr-block 10.0.9.0/24 --outpost-arn <outpost-arn>', description: 'Create a subnet that lives on the Outpost.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list Outposts',
        language: 'python',
        code: `import boto3

outposts = boto3.client("outposts")
for op in outposts.list_outposts()["Outposts"]:
    print(op["OutpostId"], op["Name"], op["AvailabilityZone"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Latency-sensitive factory application',
      scenario: 'A factory control system needs millisecond response to local machines but must be managed like the rest of the AWS estate.',
      steps: [
        'Order an Outposts rack and extend the VPC with a subnet on the Outpost.',
        'Launch EC2 instances locally and connect them to the factory network through the local gateway.',
        'Use the service link to the Region for management and to reach services such as S3.',
      ],
    },
  ],
  diagram: {
    title: 'Outposts as an extension of a Region',
    nodes: [
      ['region', 'AWS Region (parent)', 'management', 0, 1],
      ['link', 'Service link (VPN / Direct Connect)', 'network', 1, 1],
      ['out', 'Outposts rack in your data centre', 'compute', 2, 1],
      ['local', 'Local EC2, EBS, RDS, ECS', 'compute', 2, 0],
      ['app', 'On-premises systems', 'external', 3, 1],
    ],
    edges: [
      ['region', 'link', 'Management plane'],
      ['link', 'out', 'Encrypted link'],
      ['out', 'local', 'Runs locally'],
      ['out', 'app', 'Local gateway'],
    ],
    steps: [
      'The Outpost is managed from its parent Region through the service link.',
      'Services such as EC2 and EBS run on the Outpost hardware in your site.',
      'A local gateway gives on-premises systems low-latency access to those workloads.',
    ],
  },
  questionTypes: [
    { pattern: 'Run AWS services on premises with the same APIs', hint: 'AWS Outposts.' },
    { pattern: 'Low latency / data residency with AWS management', hint: 'Outposts.' },
  ],
  questions: [
    {
      source: 'mock', domain: 4,
      stem: 'A bank must run applications on EC2 in its own data centre for data residency and low-latency access to local systems, while using the same AWS APIs and tools. Which service meets this?',
      options: ['Amazon CloudFront', 'AWS Snowcone', 'AWS Outposts', 'AWS Direct Connect only'],
      answer: ['C'],
      explanation: 'Outposts brings AWS-managed infrastructure and services to your site with consistent APIs.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'What does an AWS Outpost require to operate?',
      options: ['An S3 bucket in every Region', 'No network connectivity at all', 'A Snowball Edge device', 'A connection to its parent AWS Region (service link)'],
      answer: ['D'],
      explanation: 'Outposts are managed through, and are an extension of, a parent Region over the service link.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Which are Outposts form factors? (Select TWO.)',
      multi: true,
      options: ['42U Outposts rack', '2U Outposts server', 'Rack-mounted Snowmobile', 'Shipping container', 'USB drive'],
      answer: ['A', 'B'],
      explanation: 'AWS offers Outposts racks (42U) and Outposts servers (2U).',
    },
  ],
  keyFacts: [
    'AWS-managed hardware in your site; same APIs, console and tools as the Region.',
    'Form factors: 42U racks and 2U servers.',
    'Needs a service link to the parent Region; local gateway connects to on-premises networks.',
    'Use for low latency, local processing and data residency.',
  ],
  traps: [
    { clue: 'Run AWS services in my data centre', answer: 'Outposts.' },
    { clue: 'Transfer data offline', answer: 'Snow Family.' },
  ],
  related: ['ec2', 'storage-gateway', 'snow-family', 'direct-connect', 'vpc'],
  sources: [
    { title: 'What is AWS Outposts?', url: 'https://docs.aws.amazon.com/outposts/latest/userguide/what-is-outposts.html' },
    { title: 'AWS Outposts servers', url: 'https://docs.aws.amazon.com/outposts/latest/server-userguide/what-is-outposts.html' },
    { title: 'AWS CLI outposts commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/outposts/index.html' },
  ],
};
