import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon FSx. Schema: see s3.js. */
export default {
  tagline: 'Managed third-party and open-source file systems: Windows File Server, Lustre, NetApp ONTAP and OpenZFS.',
  intro: [
    'Amazon FSx offers fully managed file systems built on popular file technologies so you can lift-and-shift applications that expect them.',
    'FSx for Windows File Server provides native SMB shares, NTFS, Active Directory integration, DFS namespaces and Multi-AZ options for Windows workloads.',
    'FSx for Lustre is a high-performance parallel file system for HPC, machine learning and media processing, with seamless S3 data repository integration.',
    'FSx for NetApp ONTAP provides multi-protocol access (NFS, SMB, iSCSI) with ONTAP features such as snapshots, cloning and data tiering.',
    'FSx for OpenZFS delivers NFS shares with ZFS features (snapshots, clones, compression) for migrating on-premises ZFS workloads.',
    'All support encryption at rest and in transit, backups, and access from on-premises over VPN or Direct Connect.',
  ],
  useCases: [
    { title: 'Windows shares and SQL Server', detail: 'Home directories and shared storage for Windows apps with AD authentication.' },
    { title: 'HPC and ML training', detail: 'Lustre delivers sub-millisecond latencies and very high throughput, loading data from S3.' },
    { title: 'Migrating NetApp or ZFS environments', detail: 'Keep existing tooling and protocols on AWS.' },
  ],
  importance: {
    points: [
      'The exam guide lists "Amazon FSx (for all types)" in scope and cites FSx in Tasks 3.1/4.1 storage selection.',
      'Main exam skill: map a requirement (SMB/AD, HPC, multi-protocol, ZFS) to the right FSx type.',
    ],
  },
  cli: [
    { command: 'aws fsx create-file-system --file-system-type WINDOWS --storage-capacity 1024 --subnet-ids subnet-a subnet-b --windows-configuration file://win.json', description: 'Create an FSx for Windows File Server file system.' },
    { command: 'aws fsx create-file-system --file-system-type LUSTRE --storage-capacity 1200 --subnet-ids subnet-a --lustre-configuration DeploymentType=SCRATCH_2,ImportPath=s3://my-data', description: 'Create a Lustre file system linked to an S3 bucket.' },
    { command: 'aws fsx describe-file-systems', description: 'List FSx file systems.' },
    { command: 'aws fsx create-backup --file-system-id fs-0abc', description: 'Take a backup.' },
    { command: 'aws fsx create-data-repository-association --file-system-id fs-0abc --file-system-path /ml --data-repository-path s3://my-data/ml', description: 'Link a Lustre path to S3.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list file systems',
        language: 'python',
        code: `import boto3

fsx = boto3.client("fsx")
for fs in fsx.describe_file_systems()["FileSystems"]:
    print(fs["FileSystemId"], fs["FileSystemType"], fs["StorageCapacity"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Speed up ML training data access',
      scenario: 'A training job needs very fast shared access to a large dataset stored in S3.',
      steps: [
        'Create an FSx for Lustre file system linked to the S3 bucket.',
        'Mount it on the GPU instances; data loads lazily from S3 at high throughput.',
        'Write results back to S3 and delete the scratch file system to save cost.',
      ],
    },
  ],
  diagram: {
    title: 'FSx for Lustre linked to S3',
    nodes: [
      ['s3', 'S3 data repository', 'storage', 0, 1],
      ['lustre', 'FSx for Lustre', 'storage', 1, 1],
      ['compute', 'HPC / ML compute cluster', 'compute', 2, 1],
      ['win', 'FSx for Windows (SMB + AD)', 'storage', 1, 0],
      ['ad', 'Active Directory', 'security', 2, 0],
    ],
    edges: [
      ['s3', 'lustre', 'Lazy load / sync'],
      ['lustre', 'compute', 'Parallel I/O'],
      ['win', 'lustre', 'Other FSx type'],
      ['ad', 'win', 'Authenticates'],
    ],
    steps: [
      'Lustre exposes S3 objects as files and caches them on a fast parallel file system.',
      'Compute clusters read and write at high throughput with sub-millisecond latency.',
      'For Windows workloads, FSx for Windows File Server provides SMB shares integrated with Active Directory.',
    ],
  },
  questionTypes: [
    { pattern: 'Pick the FSx type', hint: 'Windows/SMB/AD = Windows File Server; HPC/ML = Lustre; multi-protocol = ONTAP; ZFS = OpenZFS.' },
    { pattern: 'FSx vs EFS', hint: 'Linux NFS elastic general use = EFS; specialised needs = FSx.' },
    { pattern: 'Integrate file system with S3', hint: 'FSx for Lustre.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A machine learning team needs a shared file system that provides sub-millisecond latency and hundreds of GB/s of throughput, with direct access to training data stored in Amazon S3. Which service is the BEST fit?',
      options: ['Amazon EFS', 'Amazon FSx for Lustre', 'Amazon FSx for Windows File Server', 'Amazon EBS gp3'],
      answer: ['B'],
      explanation: 'FSx for Lustre is built for HPC/ML workloads with very high performance and native S3 integration.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company is migrating Windows file servers that use SMB shares and Active Directory permissions. Which AWS service should be used with the LEAST change?',
      options: ['Amazon EFS', 'Amazon FSx for Windows File Server', 'Amazon S3', 'Amazon FSx for Lustre'],
      answer: ['B'],
      explanation: 'FSx for Windows File Server provides fully managed SMB shares with NTFS and Active Directory integration.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'An application requires access to the same data over NFS, SMB and iSCSI. Which service supports all three protocols?',
      options: ['Amazon FSx for NetApp ONTAP', 'Amazon EFS', 'Amazon FSx for Lustre', 'Amazon S3'],
      answer: ['A'],
      explanation: 'FSx for NetApp ONTAP supports NFS, SMB and iSCSI.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A team migrating on-premises ZFS-based Linux file servers wants low-latency NFS access with ZFS snapshots and clones as a managed service. Which service fits?',
      options: ['Amazon FSx for Windows File Server', 'Amazon S3 Glacier', 'Amazon FSx for OpenZFS', 'Amazon EBS'],
      answer: ['C'],
      explanation: 'FSx for OpenZFS is the managed ZFS file system with NFS access, snapshots and clones.',
    },
  ],
  keyFacts: [
    'Four FSx types: Windows File Server (SMB/AD), Lustre (HPC/ML, S3 linked), NetApp ONTAP (NFS/SMB/iSCSI), OpenZFS (NFS).',
    'FSx for Lustre can be scratch (temporary, highest burst) or persistent (replicated within an AZ) deployment types.',
    'FSx for Windows supports Multi-AZ deployments with automatic failover and DFS namespaces.',
    'EFS supports only NFS (Linux); FSx fills gaps for Windows and specialised file system needs.',
    'FSx file systems support backups, encryption and access over VPN/Direct Connect.',
    'FSx for OpenZFS and FSx for NetApp ONTAP serve workloads migrating from ZFS or NetApp systems; ONTAP also supports SMB and iSCSI.',
  ],
  traps: [
    { clue: 'SMB / Active Directory / Windows', answer: 'FSx for Windows File Server.' },
    { clue: 'HPC / ML with S3 data', answer: 'FSx for Lustre.' },
    { clue: 'NFS + SMB + iSCSI', answer: 'FSx for NetApp ONTAP.' },
    { clue: 'Plain shared Linux storage', answer: 'EFS.' },
  ],
  related: ['efs', 'ebs', 's3', 'storage-gateway', 'directory-service', 'datasync'],
  sources: [
    { title: 'What is Amazon FSx?', url: 'https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html' },
    { title: 'Amazon FSx for Lustre', url: 'https://docs.aws.amazon.com/fsx/latest/LustreGuide/what-is.html' },
    { title: 'Amazon FSx for NetApp ONTAP', url: 'https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/what-is-fsx-ontap.html' },
    { title: 'Amazon FSx for OpenZFS', url: 'https://docs.aws.amazon.com/fsx/latest/OpenZFSGuide/what-is-fsx.html' },
    { title: 'AWS CLI fsx commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/fsx/index.html' },
  ],
};
