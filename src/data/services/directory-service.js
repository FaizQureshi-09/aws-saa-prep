import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Directory Service. Schema: see s3.js. */
export default {
  tagline: 'Managed Microsoft Active Directory and directory connectors for Windows workloads, LDAP apps and hybrid sign-in.',
  intro: [
    'AWS Directory Service provides several ways to use Microsoft Active Directory (AD) and LDAP-aware applications on AWS; a directory stores users, groups and devices and controls access to resources.',
    'AWS Managed Microsoft AD runs a real Windows Server Active Directory managed by AWS; it supports trust relationships with on-premises AD, MFA, LDAPS, schema extensions and Group Policy, and works with RDS for SQL Server, WorkSpaces and Amazon Quick.',
    'Managed Microsoft AD is deployed in your VPC across two Availability Zones, includes monitoring and daily snapshots, and comes in Standard (small and midsize organizations) and Enterprise (up to ~500,000 objects) editions.',
    'AD Connector is a directory gateway (proxy): it forwards sign-in requests to your existing on-premises AD without caching or storing users in the cloud, and needs a private connection (VPN or Direct Connect).',
    'Simple AD is a low-cost, standalone, Samba 4-based directory with basic AD features; it does not support MFA, trust relationships, LDAPS or schema extensions, and is not compatible with RDS for SQL Server.',
    'For customers of your own web or mobile apps use Amazon Cognito, and for workforce SSO to AWS accounts use IAM Identity Center (which can use these directories as its identity source).',
  ],
  useCases: [
    { title: 'Run Windows workloads on AWS', detail: 'Join EC2 Windows instances and RDS for SQL Server to Managed Microsoft AD with seamless domain join.' },
    { title: 'Extend on-premises AD to the cloud', detail: 'Create a trust between on-premises AD and Managed Microsoft AD so users keep one set of credentials.' },
    { title: 'Use on-premises credentials for AWS apps', detail: 'AD Connector lets WorkSpaces, Amazon Quick and the AWS console authenticate against your existing directory.' },
    { title: 'Small standalone directory', detail: 'Simple AD for a handful of Linux/Windows instances needing basic directory features at low cost.' },
  ],
  importance: {
    points: [
      'Part of Domain 1 (secure access): questions ask you to pick the directory option that matches a hybrid or Windows requirement.',
      'The three choices are tested as a matrix: need real AD or trust = Managed Microsoft AD; proxy to on-premises = AD Connector; cheap and basic = Simple AD.',
    ],
  },
  cli: [
    { command: 'aws ds create-microsoft-ad --name corp.example.com --short-name CORP --password <password> --edition Standard --vpc-settings VpcId=vpc-0abc,SubnetIds=subnet-0a,subnet-0b', description: 'Create an AWS Managed Microsoft AD directory across two subnets.' },
    { command: 'aws ds connect-directory --name corp.example.com --size Small --password <password> --connect-settings VpcId=vpc-0abc,SubnetIds=subnet-0a,subnet-0b,CustomerDnsIps=10.0.0.10,CustomerUserName=svc-connector', description: 'Create an AD Connector that proxies to on-premises AD.' },
    { command: 'aws ds describe-directories', description: 'List directories and their status.' },
    { command: 'aws ds create-trust --directory-id d-1234567890 --remote-domain-name onprem.example.com --trust-password <password> --trust-direction Two-Way --trust-type Forest', description: 'Create a forest trust with an on-premises domain.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list directories',
        language: 'python',
        code: `import boto3

ds = boto3.client("ds")
for d in ds.describe_directories()["DirectoryDescriptions"]:
    print(d["DirectoryId"], d["Type"], d["Stage"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Windows file servers and RDS for SQL Server using corporate identities',
      scenario: 'A company moves Windows workloads to AWS but must keep on-premises AD as the source of identity.',
      steps: [
        'Create AWS Managed Microsoft AD in two private subnets of the VPC.',
        'Establish a Direct Connect or VPN link and a forest trust to on-premises AD.',
        'Join EC2 Windows instances and RDS for SQL Server to the managed domain.',
        'Users sign in with their corporate credentials through the trust.',
      ],
    },
  ],
  diagram: {
    title: 'Managed Microsoft AD with an on-premises trust',
    nodes: [
      ['onprem', 'On-premises Active Directory', 'external', 0, 1],
      ['link', 'VPN or Direct Connect', 'network', 1, 1],
      ['mad', 'AWS Managed Microsoft AD', 'security', 2, 1],
      ['apps', 'EC2 Windows, RDS SQL Server, WorkSpaces', 'compute', 3, 1],
      ['ic', 'IAM Identity Center / console', 'security', 2, 2],
    ],
    edges: [
      ['onprem', 'link', 'Private connection'],
      ['link', 'mad', 'Forest trust'],
      ['mad', 'apps', 'Authenticates'],
      ['mad', 'ic', 'Identity source'],
    ],
    steps: [
      'On-premises AD connects over VPN or Direct Connect.',
      'A trust lets Managed Microsoft AD accept on-premises identities.',
      'Windows workloads and AWS applications authenticate against Managed Microsoft AD; IAM Identity Center can use it as its identity source.',
    ],
  },
  questionTypes: [
    { pattern: 'Which directory option fits? (real AD / proxy / basic)', hint: 'Managed Microsoft AD vs AD Connector vs Simple AD.' },
    { pattern: 'RDS for SQL Server Windows authentication', hint: 'AWS Managed Microsoft AD.' },
    { pattern: 'Use on-premises AD without storing identities in AWS', hint: 'AD Connector.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company wants Amazon RDS for SQL Server and EC2 Windows instances to authenticate users against Active Directory, with a trust to the on-premises domain. Which service should be used?',
      options: ['AWS Managed Microsoft AD', 'AWS IAM users', 'Simple AD', 'Amazon Cognito user pools'],
      answer: ['A'],
      explanation: 'Managed Microsoft AD is a real AD that supports trust relationships and integrates with RDS for SQL Server; Simple AD is not compatible with RDS SQL Server and has no trusts.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company already runs Active Directory on premises and wants Amazon WorkSpaces users to sign in with those credentials without replicating the directory to AWS. Which option is MOST appropriate?',
      options: ['Simple AD', 'AD Connector', 'Amazon DynamoDB', 'AWS Managed Microsoft AD with data copied manually'],
      answer: ['B'],
      explanation: 'AD Connector proxies authentication requests to the on-premises directory without caching identities in the cloud.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which features are supported by AWS Managed Microsoft AD but NOT by Simple AD? (Select TWO.)',
      multi: true,
      options: ['Joining Linux instances to a domain', 'Samba 4 compatibility', 'Multi-factor authentication', 'Basic user accounts and group memberships', 'Trust relationships with other Active Directory domains'],
      answer: ['C', 'E'],
      explanation: 'Simple AD does not support trust relationships or MFA (nor LDAPS or schema extensions); basic users, groups and domain join are supported by both.',
    },
  ],
  keyFacts: [
    'Three options: AWS Managed Microsoft AD, AD Connector, Simple AD (plus Cognito for app customers).',
    'Managed Microsoft AD: real AD, two domain controllers in different AZs, trusts, MFA, LDAPS, schema extensions; Standard and Enterprise editions.',
    'AD Connector: proxy to on-premises AD, requires VPN or Direct Connect, nothing stored in the cloud, not compatible with RDS SQL Server.',
    'Simple AD: Samba 4-based, basic features only, no trusts, no MFA, not for RDS SQL Server.',
    'IAM Identity Center can use Managed Microsoft AD or AD Connector as its identity source.',
  ],
  traps: [
    { clue: 'Needs a trust with on-premises AD or RDS SQL Server', answer: 'AWS Managed Microsoft AD.' },
    { clue: 'Forward authentication to the existing on-premises AD', answer: 'AD Connector.' },
    { clue: 'Cheap, basic directory, Linux LDAP', answer: 'Simple AD.' },
    { clue: 'Customers signing up to a mobile app', answer: 'Amazon Cognito.' },
  ],
  related: ['iam-identity-center', 'iam', 'cognito', 'vpn', 'direct-connect', 'rds'],
  sources: [
    { title: 'What is AWS Directory Service?', url: 'https://docs.aws.amazon.com/directoryservice/latest/admin-guide/what_is.html' },
    { title: 'AWS Managed Microsoft AD', url: 'https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_microsoft_ad.html' },
    { title: 'AD Connector', url: 'https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_ad_connector.html' },
    { title: 'Simple AD', url: 'https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_simple_ad.html' },
    { title: 'AWS CLI ds commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ds/index.html' },
  ],
};
