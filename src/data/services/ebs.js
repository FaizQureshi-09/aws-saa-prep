import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon EBS. Schema: see s3.js. */
export default {
  tagline: 'Persistent block storage volumes for EC2 - choose SSD or HDD types by IOPS, throughput and cost.',
  intro: [
    'Amazon EBS provides block-level volumes you attach to EC2 instances; data persists independently of the instance life cycle.',
    'A volume lives in a single Availability Zone and attaches to instances in that AZ; most volumes attach to one instance at a time (io1/io2 support Multi-Attach).',
    'SSD types: General Purpose gp3 (baseline 3,000 IOPS and 125 MiB/s, performance provisioned independently of size) and gp2; Provisioned IOPS io2 (including Block Express) and io1 for latency-sensitive databases.',
    'HDD types: Throughput Optimized st1 and Cold HDD sc1 for large sequential workloads; HDD volumes cannot be boot volumes.',
    'Snapshots are incremental backups stored durably by AWS (S3-backed); they can be copied across Regions, shared, automated with Data Lifecycle Manager or AWS Backup.',
    'Encryption uses AWS KMS and covers data at rest, data in transit between instance and volume, snapshots and volumes created from them; Elastic Volumes let you change type, size and IOPS without detaching.',
  ],
  useCases: [
    { title: 'Boot and data volumes', detail: 'Root volumes for instances and persistent application data.' },
    { title: 'Databases on EC2', detail: 'io2 / io2 Block Express for sustained, low-latency IOPS.' },
    { title: 'Big data and log processing', detail: 'st1 for throughput-intensive, sequential workloads at lower cost.' },
    { title: 'Backup and DR', detail: 'Snapshots copied to another Region for disaster recovery.' },
  ],
  importance: {
    points: [
      'Storage types and characteristics (block vs file vs object) are explicit in Tasks 2.1, 3.1 and 4.1; EBS volume-type selection is a named skill ("HDD vs SSD volume types").',
      'Expect questions on gp3 vs io2, snapshots, encryption and AZ boundaries.',
      'Frequent distractor: EBS cannot be shared across AZs - use EFS or S3 for shared storage.',
    ],
  },
  cli: [
    { command: 'aws ec2 create-volume --availability-zone ap-south-1a --size 100 --volume-type gp3 --iops 4000 --throughput 250 --encrypted', description: 'Create an encrypted gp3 volume with provisioned IOPS and throughput.' },
    { command: 'aws ec2 attach-volume --volume-id vol-0abc --instance-id i-0abc --device /dev/sdf', description: 'Attach a volume (same AZ as the instance).' },
    { command: 'aws ec2 modify-volume --volume-id vol-0abc --size 200 --volume-type io2 --iops 10000', description: 'Elastic Volumes: change size/type/IOPS while in use.' },
    { command: 'aws ec2 create-snapshot --volume-id vol-0abc --description "nightly"', description: 'Create a snapshot.' },
    { command: 'aws ec2 copy-snapshot --source-region ap-south-1 --source-snapshot-id snap-0abc --region us-east-1', description: 'Copy a snapshot to another Region.' },
    { command: 'aws ec2 enable-ebs-encryption-by-default', description: 'Encrypt all new volumes in the Region by default.' },
    { command: 'aws dlm create-lifecycle-policy --execution-role-arn <arn> --description "daily" --state ENABLED --policy-details file://policy.json', description: 'Automate snapshot creation and retention.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): snapshot and copy cross-Region',
        language: 'python',
        code: `import boto3

ec2 = boto3.client("ec2", region_name="ap-south-1")
snap = ec2.create_snapshot(VolumeId="vol-0abc1234", Description="nightly")
ec2.get_waiter("snapshot_completed").wait(SnapshotIds=[snap["SnapshotId"]])

dr = boto3.client("ec2", region_name="us-east-1")
dr.copy_snapshot(SourceRegion="ap-south-1", SourceSnapshotId=snap["SnapshotId"],
                 Encrypted=True)`,
      },
    ],
  },
  examples: [
    {
      title: 'Choose the right volume',
      scenario: 'A transactional database needs consistently low latency and high IOPS, while an analytics cluster scans multi-terabyte logs sequentially at the lowest cost.',
      steps: [
        'Database: Provisioned IOPS SSD (io2 / io2 Block Express) sized for the required IOPS.',
        'Analytics: Throughput Optimized HDD (st1); use sc1 for infrequently accessed cold data.',
        'Snapshot both nightly with Data Lifecycle Manager and copy critical snapshots to a second Region.',
      ],
    },
  ],
  diagram: {
    title: 'EBS volume, snapshots and cross-Region copy',
    nodes: [
      ['ec2', 'EC2 instance (AZ-a)', 'compute', 0, 1],
      ['vol', 'EBS volume (AZ-a)', 'storage', 1, 1],
      ['snap', 'Snapshot (stored in S3)', 'storage', 2, 1],
      ['dr', 'Snapshot copy (Region B)', 'storage', 3, 1],
      ['kms', 'KMS key', 'security', 1, 0],
    ],
    edges: [
      ['ec2', 'vol', 'Attached (same AZ)'],
      ['vol', 'snap', 'Incremental snapshot'],
      ['snap', 'dr', 'Copy to Region B'],
      ['kms', 'vol', 'Encrypts volume'],
    ],
    steps: [
      'A volume is created in one AZ and attached to an instance in that AZ.',
      'Snapshots capture the volume incrementally; only changed blocks are stored after the first snapshot.',
      'A snapshot can be copied to another Region (and re-encrypted) for disaster recovery, then restored as a new volume.',
    ],
  },
  questionTypes: [
    { pattern: 'Select the volume type', hint: 'gp3 default; io2 for sustained high IOPS; st1/sc1 for sequential, low-cost throughput.' },
    { pattern: 'Cross-AZ / cross-Region movement', hint: 'Snapshot, then restore in another AZ or copy to another Region.' },
    { pattern: 'Encryption requirements', hint: 'Encrypted volume implies encrypted snapshots; enable encryption by default.' },
    { pattern: 'Shared access across instances', hint: 'Multi-Attach (io1/io2, same AZ) or choose EFS instead.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A production relational database on EC2 requires sustained, low-latency performance with 50,000 provisioned IOPS. Which EBS volume type is the MOST appropriate?',
      options: ['Cold HDD (sc1)', 'Throughput Optimized HDD (st1)', 'Provisioned IOPS SSD (io2)', 'General Purpose SSD (gp3) at its baseline'],
      answer: ['C'],
      explanation: 'Provisioned IOPS SSD volumes are built for latency-sensitive, I/O-intensive databases and can deliver very high provisioned IOPS. HDD volumes are for throughput workloads; gp3 baseline is far below 50,000 IOPS.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A company stores 20 TB of infrequently accessed, sequentially read log data on EBS attached to an EC2 instance. The data does not need to be a boot volume, and cost must be minimised. Which volume type should be used?',
      options: ['gp3', 'io2', 'sc1 (Cold HDD)', 'Instance store'],
      answer: ['C'],
      explanation: 'Cold HDD (sc1) is the lowest-cost EBS option for infrequently accessed, sequential data. Instance store would lose the data when the instance stops.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An EBS volume in us-east-1a must be made available to an instance in us-east-1b. What should the solutions architect do?',
      options: ['Detach the volume and attach it to the instance in us-east-1b.', 'Create a snapshot and create a new volume from it in us-east-1b.', 'Enable Multi-Attach on the volume.', 'Change the volume\'s Availability Zone attribute.'],
      answer: ['B'],
      explanation: 'EBS volumes are bound to one Availability Zone. To use the data in another AZ, snapshot the volume and restore it as a new volume in the target AZ.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company requires all data on EBS volumes, including snapshots, to be encrypted. What is the MOST operationally efficient way to enforce this for new volumes in a Region?',
      options: ['Enable EBS encryption by default for the Region.', 'Tag every volume with an "encrypted" tag.', 'Manually encrypt each volume after creation.', 'Use an S3 bucket policy.'],
      answer: ['A'],
      explanation: 'Enabling encryption by default automatically encrypts new volumes (and snapshots created from them) in the Region using the chosen KMS key.',
    },
  ],
  keyFacts: [
    'EBS volumes are zonal: attach only to instances in the same AZ; snapshot to move across AZs or Regions.',
    'gp3: baseline 3,000 IOPS and 125 MiB/s regardless of size, with IOPS and throughput scalable independently; gp2: IOPS tied to size (3 IOPS per GiB with burst).',
    'io2 Block Express supports up to 256,000 IOPS; io1/io2 support Multi-Attach (same AZ, Nitro instances).',
    'st1 and sc1 are HDD types; they cannot be used as boot volumes.',
    'Snapshots are incremental, stored in S3 (managed by AWS); deleting an earlier snapshot does not affect the ability to restore later ones.',
    'Encrypted volume => encrypted snapshots; unencrypted snapshot can be encrypted by copying it with encryption enabled.',
    'Root volumes are deleted on instance termination by default; data volumes persist by default.',
    'Instance store is ephemeral, physically attached storage with very high IOPS - data is lost on stop/terminate.',
  ],
  traps: [
    { clue: 'Highest, sustained IOPS for a database', answer: 'io2 / io2 Block Express.' },
    { clue: 'Cheapest large sequential throughput', answer: 'st1 (frequent) or sc1 (infrequent).' },
    { clue: 'Move data to another AZ/Region', answer: 'Snapshot then restore/copy.' },
    { clue: 'Shared file system across many instances/AZs', answer: 'Amazon EFS, not EBS.' },
    { clue: 'Temporary, highest-speed scratch space', answer: 'Instance store.' },
  ],
  related: ['ec2', 'efs', 's3', 'backup', 'kms'],
  sources: [
    { title: 'Amazon EBS volumes', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html' },
    { title: 'Amazon EBS volume types', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html' },
    { title: 'Amazon EBS snapshots', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html' },
    { title: 'Amazon EBS encryption', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html' },
    { title: 'Amazon EBS Multi-Attach', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes-multi.html' },
    { title: 'AWS CLI ec2 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/index.html' },
  ],
};
