import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon EFS. Schema: see s3.js. */
export default {
  tagline: 'A shared, elastic NFS file system for Linux workloads that spans Availability Zones.',
  intro: [
    'Amazon Elastic File System (EFS) is a fully managed NFS (v4.0/4.1) file system that grows and shrinks automatically as you add or remove files.',
    'It is for Linux (POSIX) workloads and can be mounted concurrently by thousands of EC2 instances, containers and Lambda functions across multiple Availability Zones.',
    'Regional (Standard) file systems store data across multiple AZs; One Zone file systems store data in a single AZ at lower cost.',
    'Storage classes: Standard, Infrequent Access (IA) and Archive, with lifecycle management that moves cold files automatically to cut cost.',
    'Throughput modes: Elastic (recommended - scales automatically), Provisioned and Bursting; performance modes: General Purpose and Max I/O.',
    'Security: encryption at rest with KMS, encryption in transit with TLS (EFS mount helper), POSIX permissions, IAM authorisation and access points; accessible from on-premises over Direct Connect/VPN.',
  ],
  useCases: [
    { title: 'Shared content and web serving', detail: 'Multiple web servers read and write the same files (CMS, media).' },
    { title: 'Container and serverless persistent storage', detail: 'Mount EFS into ECS/EKS tasks and Lambda functions.' },
    { title: 'Big data and developer tools', detail: 'Shared home directories and analytics scratch space.' },
  ],
  importance: {
    points: [
      'Storage type characteristics (object, file, block) are in Tasks 2.1, 3.1 and 4.1; EFS is the named file-storage example.',
      'Typical decision: EBS (single instance block) vs EFS (shared Linux file) vs FSx (Windows/HPC) vs S3 (object).',
    ],
  },
  cli: [
    { command: 'aws efs create-file-system --encrypted --performance-mode generalPurpose --throughput-mode elastic --tags Key=Name,Value=shared', description: 'Create an encrypted EFS file system.' },
    { command: 'aws efs create-mount-target --file-system-id fs-0abc --subnet-id subnet-a --security-groups sg-0abc', description: 'Create a mount target in a subnet (one per AZ).' },
    { command: 'aws efs put-lifecycle-configuration --file-system-id fs-0abc --lifecycle-policies TransitionToIA=AFTER_30_DAYS TransitionToPrimaryStorageClass=AFTER_1_ACCESS', description: 'Move cold files to the IA class.' },
    { command: 'sudo mount -t efs -o tls fs-0abc:/ /mnt/efs', description: 'Mount with the EFS mount helper (TLS in transit).' },
    { command: 'aws efs create-replication-configuration --source-file-system-id fs-0abc --destination Region=us-east-1', description: 'Replicate to another Region.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): create a file system',
        language: 'python',
        code: `import boto3

efs = boto3.client("efs")
fs = efs.create_file_system(Encrypted=True, ThroughputMode="elastic",
                            Tags=[{"Key": "Name", "Value": "shared"}])
print(fs["FileSystemId"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Shared storage for an Auto Scaling web fleet',
      scenario: 'A fleet of Linux web servers across two AZs must share uploaded files.',
      steps: [
        'Create an encrypted EFS file system with mount targets in each AZ.',
        'Allow NFS (port 2049) from the web security group to the mount target security group.',
        'Mount EFS on every instance through user data or the launch template.',
        'Enable lifecycle management to move old files to EFS IA.',
      ],
    },
  ],
  diagram: {
    title: 'EFS shared across Availability Zones',
    nodes: [
      ['ec2a', 'EC2 instances (AZ-a)', 'compute', 0, 0],
      ['ec2b', 'EC2 instances (AZ-b)', 'compute', 0, 2],
      ['mt', 'EFS mount targets (NFS 2049)', 'storage', 1, 1],
      ['efs', 'EFS file system', 'storage', 2, 1],
      ['ia', 'EFS IA / Archive tiers', 'storage', 3, 1],
    ],
    edges: [
      ['ec2a', 'mt', 'NFS mount'],
      ['ec2b', 'mt', 'NFS mount'],
      ['mt', 'efs', 'Shared data'],
      ['efs', 'ia', 'Lifecycle'],
    ],
    steps: [
      'Instances in different AZs mount the same file system through a mount target in their own AZ.',
      'All instances see the same files with POSIX semantics and consistent reads.',
      'Lifecycle management transitions rarely used files to cheaper IA/Archive storage classes.',
    ],
  },
  questionTypes: [
    { pattern: 'Shared file storage for Linux across AZs', hint: 'EFS.' },
    { pattern: 'Windows shared file storage / SMB / Active Directory', hint: 'FSx for Windows File Server, not EFS.' },
    { pattern: 'Reduce EFS cost', hint: 'Lifecycle to IA/Archive; One Zone for non-critical data.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A web application runs on a fleet of Linux EC2 instances across multiple Availability Zones and requires a shared file system for user-uploaded content that scales automatically. Which service is the BEST fit?',
      options: ['Amazon EBS', 'Amazon EFS', 'EC2 instance store', 'Amazon S3 Glacier'],
      answer: ['B'],
      explanation: 'EFS is a shared, elastic NFS file system accessible from many instances in multiple AZs. EBS volumes attach to one instance (in one AZ).',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Much of the data on an EFS file system has not been accessed for 60 days. How can the company reduce storage cost with the least effort?',
      options: ['Delete the file system', 'Enable EFS lifecycle management to move infrequently accessed files to EFS IA', 'Copy the data to EBS', 'Switch to instance store'],
      answer: ['B'],
      explanation: 'Lifecycle management automatically transitions files not accessed for a set period to the lower-cost IA storage class.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company must encrypt an EFS file system both at rest and in transit. What should be configured?',
      options: ['Enable encryption at rest with KMS and mount using the EFS mount helper with TLS', 'Enable only S3 SSE', 'Use security groups only', 'Encryption cannot be enabled for EFS'],
      answer: ['A'],
      explanation: 'EFS supports KMS encryption at rest and TLS in transit via the mount helper.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A Windows application needs an SMB file share integrated with Microsoft Active Directory. Which service should be used instead of EFS?',
      options: ['Amazon FSx for Windows File Server', 'Amazon S3', 'Amazon EBS io2', 'AWS Storage Gateway Tape Gateway'],
      answer: ['A'],
      explanation: 'EFS supports NFS for Linux; FSx for Windows File Server provides native SMB with Active Directory integration.',
    },
  ],
  keyFacts: [
    'EFS is NFS for Linux; it is not supported on Windows - use FSx for Windows File Server.',
    'Data is stored across multiple AZs (Standard) or one AZ (One Zone); mount targets exist per AZ.',
    'Throughput modes: Elastic (default recommended), Provisioned, Bursting; performance modes: General Purpose, Max I/O.',
    'Storage classes: Standard, Infrequent Access, Archive; lifecycle management automates tiering.',
    'Security group on the mount target must allow inbound TCP 2049 (NFS).',
    'Pay for storage used (no pre-provisioning); can be replicated across Regions and backed up with AWS Backup.',
  ],
  traps: [
    { clue: 'Shared Linux file system, many instances/AZs', answer: 'EFS.' },
    { clue: 'Windows SMB + Active Directory', answer: 'FSx for Windows File Server.' },
    { clue: 'Single instance block storage', answer: 'EBS.' },
    { clue: 'HPC / ML high-throughput file system tied to S3', answer: 'FSx for Lustre.' },
  ],
  related: ['ebs', 'fsx', 's3', 'storage-gateway', 'backup', 'ecs'],
  sources: [
    { title: 'What is Amazon EFS?', url: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html' },
    { title: 'EFS storage classes', url: 'https://docs.aws.amazon.com/efs/latest/ug/storage-classes.html' },
    { title: 'EFS performance and throughput modes', url: 'https://docs.aws.amazon.com/efs/latest/ug/performance.html' },
    { title: 'Data encryption in Amazon EFS', url: 'https://docs.aws.amazon.com/efs/latest/ug/encryption.html' },
    { title: 'AWS CLI efs commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/efs/index.html' },
  ],
};
