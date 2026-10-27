import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Backup. Schema: see s3.js. */
export default {
  tagline: 'Centralised, policy-based backup and restore across AWS services, accounts and Regions.',
  intro: [
    'AWS Backup is a fully managed service that centralises and automates data protection across AWS services (and some on-premises workloads) from one console, API and CLI, replacing per-service scripts.',
    'A backup plan defines schedule, backup window, lifecycle (move to cold storage, expire) and copy rules; resources are assigned to a plan by resource ID or by tag.',
    'Backups are stored as recovery points in a backup vault, which is encrypted with a KMS key and controlled by a resource-based access policy.',
    'Vault Lock enforces a write-once-read-many (WORM) model so that nobody, including the root user, can delete backups or shorten retention.',
    'Cross-Region and cross-account copies protect against Regional outages and compromised accounts; with AWS Organizations, backup policies can be applied across all accounts.',
    'Supported resources include EC2, EBS, S3, RDS, Aurora, DynamoDB, EFS, FSx, Storage Gateway volumes, DocumentDB, Neptune and Redshift; continuous backup enables point-in-time restore for supported resources.',
  ],
  useCases: [
    { title: 'Organization-wide backup standards', detail: 'Enforce a single policy (daily, 35-day retention) on all tagged resources.' },
    { title: 'Ransomware and compliance protection', detail: 'Vault Lock and cross-account copies keep immutable copies out of reach.' },
    { title: 'Disaster recovery for the backup-and-restore strategy', detail: 'Copy recovery points to another Region and restore there during an outage.' },
  ],
  importance: {
    points: [
      'Covers Domain 2 (resilience and DR), Domain 1 (data protection, immutability) and Domain 4 (lifecycle to cold storage lowers cost).',
      'The answer when a question asks for centralised, automated backup of many different services with compliance reporting.',
    ],
  },
  cli: [
    { command: 'aws backup create-backup-vault --backup-vault-name prod-vault --encryption-key-arn <kms-key-arn>', description: 'Create an encrypted backup vault.' },
    { command: 'aws backup create-backup-plan --backup-plan file://plan.json', description: 'Create a plan with rules (schedule, lifecycle, copy actions).' },
    { command: 'aws backup create-backup-selection --backup-plan-id <plan-id> --backup-selection file://selection.json', description: 'Assign resources to the plan, for example by tag.' },
    { command: 'aws backup put-backup-vault-lock-configuration --backup-vault-name prod-vault --min-retention-days 30 --max-retention-days 365', description: 'Apply Vault Lock retention limits.' },
    { command: 'aws backup start-restore-job --recovery-point-arn <arn> --iam-role-arn <role-arn> --metadata file://restore.json', description: 'Restore a recovery point.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): start an on-demand backup',
        language: 'python',
        code: `import boto3

backup = boto3.client("backup")
job = backup.start_backup_job(
    BackupVaultName="prod-vault",
    ResourceArn="arn:aws:ec2:us-east-1:111122223333:volume/vol-0abc",
    IamRoleArn="arn:aws:iam::111122223333:role/service-role/AWSBackupDefaultServiceRole",
)
print(job["BackupJobId"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Tag-based backup with immutable copies',
      scenario: 'A company must back up every resource tagged Backup=true daily, keep 35 days, and retain an immutable copy in another account and Region.',
      steps: [
        'Create a backup plan with a daily rule, 35-day retention and a copy action to a vault in a second account and Region.',
        'Assign resources by tag (Backup=true).',
        'Enable Vault Lock on the destination vault to block deletions.',
        'Use AWS Backup Audit Manager to report compliance.',
      ],
    },
  ],
  diagram: {
    title: 'AWS Backup plan and vaults',
    nodes: [
      ['res', 'EC2, EBS, RDS, DynamoDB, EFS (tagged)', 'compute', 0, 1],
      ['plan', 'Backup plan (schedule, lifecycle)', 'management', 1, 1],
      ['vault', 'Backup vault (KMS encrypted)', 'storage', 2, 1],
      ['lock', 'Vault Lock (WORM)', 'security', 2, 0],
      ['copy', 'Cross-Region / cross-account vault', 'storage', 3, 1],
    ],
    edges: [
      ['plan', 'res', 'Protects resources'],
      ['plan', 'vault', 'Recovery points'],
      ['lock', 'vault', 'Immutable'],
      ['vault', 'copy', 'Copy rule'],
    ],
    steps: [
      'A backup plan runs on a schedule against resources assigned by tag or ID.',
      'Recovery points are stored in an encrypted vault; Vault Lock can make them immutable.',
      'Copy rules replicate recovery points to another Region or account for disaster recovery.',
    ],
  },
  questionTypes: [
    { pattern: 'Centralised backup across many AWS services', hint: 'AWS Backup.' },
    { pattern: 'Prevent backups from being deleted', hint: 'Backup Vault Lock (WORM).' },
    { pattern: 'DR copy in another Region or account', hint: 'Cross-Region / cross-account copy rule.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants a single place to schedule and monitor backups of EC2 volumes, RDS databases, DynamoDB tables and EFS file systems, with retention rules applied by tag. Which service should be used?',
      options: ['AWS DataSync', 'Amazon S3 Lifecycle', 'AWS Backup', 'AWS Snowball Edge'],
      answer: ['C'],
      explanation: 'AWS Backup centralises policy-based backups across many services and supports tag-based resource assignment.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Compliance requires that backups cannot be deleted or have their retention shortened by anyone, including administrators, for 7 years. Which feature meets this?',
      options: ['AWS Backup Vault Lock', 'An IAM policy on one user', 'S3 Transfer Acceleration', 'A security group rule'],
      answer: ['A'],
      explanation: 'Vault Lock enforces a WORM model that prevents deletion or retention changes.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company\'s DR plan requires backups to be stored in a different Region and a different AWS account. What is the SIMPLEST way to do this?',
      options: ['Add a copy action to the AWS Backup plan targeting a vault in the other Region and account', 'Write a Lambda function that copies each snapshot', 'Email the backup files', 'Use a NAT gateway'],
      answer: ['A'],
      explanation: 'Backup plans support cross-Region and cross-account copy rules natively.',
    },
  ],
  keyFacts: [
    'Components: backup plan (rules), backup selection (resources by ID or tag), backup vault (KMS-encrypted), recovery points.',
    'Vault Lock = WORM; cross-Region and cross-account copy for DR and ransomware resilience.',
    'Lifecycle rules can move recovery points to cold storage to save cost for supported resource types.',
    'Continuous backup gives point-in-time restore for supported resources (such as RDS and S3).',
    'Works with AWS Organizations (backup policies) and Backup Audit Manager (compliance reports).',
  ],
  traps: [
    { clue: 'Central, policy-driven backup across services', answer: 'AWS Backup.' },
    { clue: 'Immutable backups nobody can delete', answer: 'Backup Vault Lock.' },
    { clue: 'Only EBS snapshots on a schedule', answer: 'Amazon Data Lifecycle Manager can do it, but AWS Backup is the broader answer.' },
  ],
  related: ['dr-strategies', 'ebs', 'rds', 'dynamodb', 'efs', 'organizations'],
  sources: [
    { title: 'What is AWS Backup?', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html' },
    { title: 'Backup plan options and configuration', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/plan-options-and-configuration.html' },
    { title: 'AWS Backup Vault Lock', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html' },
    { title: 'Creating backup copies across AWS Regions', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/cross-region-backup.html' },
    { title: 'AWS CLI backup commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/backup/index.html' },
  ],
};
