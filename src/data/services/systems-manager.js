import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Systems Manager. Schema: see s3.js. */
export default {
  tagline: 'The operations hub: manage, patch, connect to and configure fleets of nodes in AWS and on premises.',
  intro: [
    'AWS Systems Manager helps you centrally view, manage and operate nodes at scale across AWS, on-premises and multicloud environments; nodes become "managed" when the SSM Agent runs on them and can reach the service.',
    'Session Manager gives secure shell or PowerShell access without opening inbound ports, SSH keys or bastion hosts; sessions are authenticated by IAM and can be logged to S3 or CloudWatch Logs.',
    'Run Command executes scripts on many nodes, Patch Manager automates OS patching with patch baselines and maintenance windows, and State Manager keeps nodes in a desired configuration.',
    'Parameter Store stores configuration values and secrets (String, StringList, SecureString encrypted with KMS) in a hierarchy; Automation runs runbooks to remediate or provision, including for AWS Config rules.',
    'EC2 instances need the SSM Agent and an instance profile with permissions such as the AmazonSSMManagedInstanceCore policy; on-premises servers use hybrid activations.',
    'It is free to use for most tools (some advanced features are charged) and underlies many operational patterns tested on the exam: patching, secure access and centralised configuration.',
  ],
  useCases: [
    { title: 'Secure instance access', detail: 'Session Manager replaces SSH and bastion hosts; no inbound port 22 and full audit logs.' },
    { title: 'Automated patching', detail: 'Patch Manager applies patch baselines to fleets inside maintenance windows.' },
    { title: 'Central configuration', detail: 'Parameter Store feeds database endpoints and feature flags to applications.' },
    { title: 'Automated remediation', detail: 'Automation runbooks fix non-compliant resources flagged by AWS Config.' },
  ],
  importance: {
    points: [
      'Systems Manager shows up under Domain 2 (resilience and operations) and Domain 1 (secure access, Parameter Store vs Secrets Manager).',
      'Know the main tools and their one-line purposes: Session Manager (access), Patch Manager (patching), Run Command (ad-hoc), State Manager (configuration), Parameter Store (config values), Automation (runbooks).',
    ],
  },
  cli: [
    { command: 'aws ssm start-session --target i-0123456789abcdef0', description: 'Open a Session Manager shell without SSH.' },
    { command: 'aws ssm send-command --document-name AWS-RunShellScript --targets Key=tag:Env,Values=prod --parameters commands=["yum update -y"]', description: 'Run a command on all instances with a tag.' },
    { command: 'aws ssm put-parameter --name /app/prod/db/url --value "db.example.com" --type String', description: 'Store a configuration parameter.' },
    { command: 'aws ssm put-parameter --name /app/prod/db/password --value "<password>" --type SecureString', description: 'Store an encrypted secret value.' },
    { command: 'aws ssm get-parameter --name /app/prod/db/password --with-decryption', description: 'Read and decrypt a SecureString parameter.' },
    { command: 'aws ssm describe-instance-information', description: 'List managed instances and their agent status.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): read a SecureString parameter',
        language: 'python',
        code: `import boto3

ssm = boto3.client("ssm")
resp = ssm.get_parameter(Name="/app/prod/db/password", WithDecryption=True)
password = resp["Parameter"]["Value"]`,
      },
    ],
  },
  examples: [
    {
      title: 'Patch a fleet and remove SSH access',
      scenario: 'Security wants all instances patched monthly and no inbound SSH.',
      steps: [
        'Attach an instance profile with AmazonSSMManagedInstanceCore and confirm instances are managed.',
        'Define a patch baseline and a maintenance window targeting instances by tag.',
        'Close port 22 in security groups and use Session Manager for administration, logging sessions to S3.',
        'Review patch compliance in Systems Manager.',
      ],
    },
  ],
  diagram: {
    title: 'Systems Manager managing instances',
    nodes: [
      ['admin', 'Administrator (IAM)', 'actor', 0, 1],
      ['ssm', 'AWS Systems Manager', 'management', 1, 1],
      ['ps', 'Parameter Store', 'security', 1, 0],
      ['patch', 'Patch Manager baselines', 'management', 1, 2],
      ['ec2', 'EC2 and on-premises nodes (SSM Agent)', 'compute', 2, 1],
      ['logs', 'S3 / CloudWatch session logs', 'storage', 3, 1],
    ],
    edges: [
      ['admin', 'ssm', 'Session, Run Command'],
      ['ps', 'ssm', 'Config and secrets'],
      ['ssm', 'patch', 'Schedules patching'],
      ['ssm', 'ec2', 'Via SSM Agent'],
      ['ec2', 'logs', 'Session output'],
    ],
    steps: [
      'Administrators use IAM-authenticated sessions or commands; no inbound ports are needed.',
      'Systems Manager reaches nodes through the SSM Agent and applies patches or configuration.',
      'Session logs go to S3 or CloudWatch Logs; Parameter Store supplies application configuration.',
    ],
  },
  questionTypes: [
    { pattern: 'Access instances without SSH/bastion', hint: 'Session Manager.' },
    { pattern: 'Automate OS patching', hint: 'Patch Manager with maintenance windows.' },
    { pattern: 'Store config values and secrets centrally', hint: 'Parameter Store (SecureString) or Secrets Manager.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A security team wants administrators to access EC2 instances in private subnets without opening port 22, managing SSH keys or running bastion hosts, and with a full audit trail. Which solution meets this?',
      options: ['A NAT gateway with SSH', 'Security group rule allowing 0.0.0.0/0 on port 22', 'AWS Systems Manager Session Manager', 'A larger bastion host'],
      answer: ['C'],
      explanation: 'Session Manager provides IAM-controlled shell access through the SSM Agent without inbound ports and can log sessions to S3 or CloudWatch Logs.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company must patch hundreds of EC2 and on-premises servers every month during a defined maintenance window with minimal effort. Which Systems Manager capability should be used?',
      options: ['Patch Manager', 'Parameter Store', 'OpsCenter', 'Session Manager only'],
      answer: ['A'],
      explanation: 'Patch Manager applies patch baselines to managed nodes on a schedule using maintenance windows.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which are prerequisites for an EC2 instance to be managed by Systems Manager? (Select TWO.)',
      multi: true,
      options: ['SSM Agent installed and running', 'An open inbound port 22', 'A dedicated host', 'An instance profile with permissions for Systems Manager', 'A public IP address in every case'],
      answer: ['A', 'D'],
      explanation: 'The agent must run and the instance needs an IAM role (for example AmazonSSMManagedInstanceCore). No inbound port is required and private instances can use VPC endpoints.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'An application needs to read a database password at startup. The value must be stored encrypted and fetched through the AWS API. Which Systems Manager feature supports this?',
      options: ['A String parameter', 'An S3 object in plain text', 'Parameter Store SecureString parameter', 'An AMI baked with the password'],
      answer: ['C'],
      explanation: 'SecureString parameters are encrypted with KMS and read with the GetParameter API using decryption (Secrets Manager adds automatic rotation).',
    },
  ],
  keyFacts: [
    'Managed node = SSM Agent running + IAM permissions + connectivity (internet or VPC endpoints).',
    'Session Manager: no inbound ports/SSH keys/bastion; sessions logged to S3 or CloudWatch Logs.',
    'Patch Manager + maintenance windows automate patching; State Manager keeps configuration; Run Command executes ad hoc.',
    'Parameter Store: hierarchical config; SecureString uses KMS; Secrets Manager adds rotation.',
    'Automation runbooks power AWS Config remediation; hybrid activations manage on-premises servers.',
  ],
  traps: [
    { clue: 'No SSH, no bastion, audit sessions', answer: 'Session Manager.' },
    { clue: 'Monthly OS patching of fleets', answer: 'Patch Manager.' },
    { clue: 'Automatic secret rotation', answer: 'Secrets Manager (not Parameter Store).' },
  ],
  related: ['ec2', 'secrets-manager', 'config', 'cloudwatch', 'kms', 'cloudformation'],
  sources: [
    { title: 'What is AWS Systems Manager?', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html' },
    { title: 'AWS Systems Manager Session Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html' },
    { title: 'AWS Systems Manager Patch Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html' },
    { title: 'AWS Systems Manager Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' },
    { title: 'AWS CLI ssm commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ssm/index.html' },
  ],
};
