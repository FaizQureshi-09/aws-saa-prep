import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Resource Access Manager (RAM). Schema: see s3.js. */
export default {
  tagline: 'Share AWS resources, such as subnets and Transit Gateways, across accounts without duplicating them.',
  intro: [
    'AWS Resource Access Manager (RAM) lets you securely share your AWS resources with other AWS accounts, or within an organization or OUs in AWS Organizations, instead of creating duplicates in each account.',
    'Commonly shared resources include VPC subnets, Transit Gateways, Route 53 Resolver rules, License Manager configurations and some database clusters.',
    'You create a resource share that lists the resources, the principals (accounts, OUs, the organization or IAM roles) and the permissions; sharing within an organization can be enabled once for automatic acceptance.',
    'VPC sharing lets several accounts launch their resources into the same subnets owned by a central networking account, which reduces the number of VPCs, NAT gateways and VPN connections and lowers cost.',
    'There is no additional charge for RAM; the owner keeps control of the resource and participants can use it but cannot modify the shared VPC or subnets themselves.',
  ],
  useCases: [
    { title: 'Shared VPC for many accounts', detail: 'A network account owns subnets and shares them with application accounts.' },
    { title: 'Share a Transit Gateway', detail: 'One Transit Gateway serves attachments from many accounts.' },
    { title: 'Reduce duplicated infrastructure', detail: 'Share Route 53 Resolver rules and other central resources.' },
  ],
  importance: {
    points: [
      'Domain 1 (secure multi-account design) and Domain 4 (cost-optimised network architecture): share rather than duplicate.',
      'Typical exam clue: "multiple accounts need to use the same subnets / Transit Gateway" which means RAM.',
    ],
  },
  cli: [
    { command: 'aws ram enable-sharing-with-aws-organization', description: 'Allow sharing within the organization (run in the management account).' },
    { command: 'aws ram create-resource-share --name shared-subnets --resource-arns <subnet-arn> --principals <ou-arn>', description: 'Share a subnet with an OU.' },
    { command: 'aws ram get-resource-shares --resource-owner SELF', description: 'List shares you own.' },
    { command: 'aws ram list-resources --resource-owner OTHER-ACCOUNTS', description: 'List resources shared with you.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): share a subnet with an account',
        language: 'python',
        code: `import boto3

ram = boto3.client("ram")
share = ram.create_resource_share(
    name="shared-subnets",
    resourceArns=["arn:aws:ec2:us-east-1:111122223333:subnet/subnet-0abc"],
    principals=["444455556666"],
)["resourceShare"]
print(share["resourceShareArn"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Central networking with shared subnets',
      scenario: 'A company wants application teams in separate accounts to deploy into one managed VPC.',
      steps: [
        'Enable sharing with AWS Organizations from the management account.',
        'In the network account, share the private subnets with the application OU.',
        'Application accounts launch EC2, RDS and other resources into the shared subnets.',
        'Use a shared Transit Gateway or VPN so the VPC connects to on-premises once.',
      ],
    },
  ],
  diagram: {
    title: 'Sharing resources with RAM',
    nodes: [
      ['owner', 'Owner (network) account', 'management', 0, 1],
      ['ram', 'AWS RAM resource share', 'management', 1, 1],
      ['org', 'AWS Organizations (org or OU)', 'management', 1, 0],
      ['res', 'Shared subnets / Transit Gateway', 'network', 2, 1],
      ['part', 'Participant accounts', 'compute', 3, 1],
    ],
    edges: [
      ['owner', 'ram', 'Creates share'],
      ['org', 'ram', 'Enables org sharing'],
      ['ram', 'res', 'Shares'],
      ['res', 'part', 'Used by'],
    ],
    steps: [
      'The owner creates a resource share and chooses principals.',
      'With Organizations, sharing within the organization needs no invitation.',
      'Participant accounts use the shared resources while the owner keeps control.',
    ],
  },
  questionTypes: [
    { pattern: 'Share subnets or Transit Gateway across accounts', hint: 'AWS RAM.' },
    { pattern: 'Reduce cost of duplicate network resources', hint: 'Shared VPC via RAM.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A central networking team owns a VPC and wants application teams in other accounts to launch resources into its subnets without peering. Which service enables this?',
      options: ['Amazon Route 53', 'AWS Resource Access Manager', 'AWS Direct Connect', 'AWS Backup'],
      answer: ['B'],
      explanation: 'RAM shares subnets across accounts (VPC sharing) so participants launch resources into the owner\'s VPC.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Which benefit does sharing subnets with AWS RAM provide?',
      options: ['Automatic EC2 right-sizing', 'Unlimited Spot capacity', 'Fewer VPCs, NAT gateways and VPN connections to pay for and manage', 'Free data transfer between Regions'],
      answer: ['C'],
      explanation: 'Shared VPCs let many accounts reuse one set of network infrastructure, lowering cost and complexity.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which are valid principals for an AWS RAM resource share? (Select TWO.)',
      multi: true,
      options: ['An EBS snapshot', 'An S3 bucket', 'A CloudFront distribution', 'An AWS account', 'An organizational unit in AWS Organizations'],
      answer: ['D', 'E'],
      explanation: 'Resource shares can target accounts, OUs, the whole organization or some IAM roles/users.',
    },
  ],
  keyFacts: [
    'RAM shares resources (subnets, Transit Gateways, Resolver rules, etc.) across accounts and within Organizations.',
    'No additional charge; the owner retains control, participants consume.',
    'Enable sharing with AWS Organizations once to avoid invitations.',
    'Shared VPC lowers cost by reducing duplicate network infrastructure.',
  ],
  traps: [
    { clue: 'Share subnets or Transit Gateway across accounts', answer: 'RAM.' },
    { clue: 'Connect two VPCs privately', answer: 'VPC peering or Transit Gateway.' },
  ],
  related: ['vpc', 'transit-gateway', 'organizations', 'route53', 'cost-management'],
  sources: [
    { title: 'What is AWS Resource Access Manager?', url: 'https://docs.aws.amazon.com/ram/latest/userguide/what-is.html' },
    { title: 'Shareable AWS resources', url: 'https://docs.aws.amazon.com/ram/latest/userguide/shareable.html' },
    { title: 'Share your VPC subnets with other accounts', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-sharing.html' },
    { title: 'AWS CLI ram commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ram/index.html' },
  ],
};
