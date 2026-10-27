import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Storage Gateway. Schema: see s3.js. */
export default {
  tagline: 'Hybrid cloud storage: give on-premises applications low-latency access to AWS storage through standard protocols.',
  intro: [
    'AWS Storage Gateway is a hybrid storage service that connects on-premises applications to cloud storage using NFS, SMB, iSCSI and virtual tape interfaces.',
    'A gateway runs on-premises as a virtual machine (VMware, Hyper-V, KVM), a hardware appliance, or in EC2, and caches frequently used data locally for low latency.',
    'S3 File Gateway exposes NFS/SMB file shares backed by Amazon S3 objects (any S3 class, with lifecycle policies) - good for backups, archives and data lake ingestion.',
    'Volume Gateway presents iSCSI block volumes: cached volumes keep primary data in AWS with a local cache; stored volumes keep primary data on-premises and back up snapshots to AWS.',
    'Tape Gateway presents a virtual tape library to existing backup software and archives tapes to S3, S3 Glacier or Deep Archive.',
    'Data is encrypted in transit and at rest; bandwidth is optimised and uploads are asynchronous.',
  ],
  useCases: [
    { title: 'Move file shares to S3 without changing apps', detail: 'S3 File Gateway presents NFS/SMB to on-premises clients.' },
    { title: 'Replace physical tape', detail: 'Tape Gateway integrates with existing backup software.' },
    { title: 'Cloud-backed block storage and DR', detail: 'Volume Gateway snapshots go to AWS as EBS snapshots.' },
  ],
  importance: {
    points: [
      'Tasks 3.1, 3.5 and 4.1 name Storage Gateway for hybrid storage and data transfer.',
      'Know which gateway type fits file, block (cached vs stored) and tape needs.',
    ],
  },
  cli: [
    { command: 'aws storagegateway activate-gateway --activation-key <key> --gateway-name onprem-gw --gateway-timezone GMT+5:30 --gateway-region ap-south-1 --gateway-type FILE_S3', description: 'Activate an S3 File Gateway.' },
    { command: 'aws storagegateway create-nfs-file-share --client-token t1 --gateway-arn <arn> --role <role-arn> --location-arn arn:aws:s3:::share-bucket', description: 'Create an NFS share backed by S3.' },
    { command: 'aws storagegateway create-cached-iscsi-volume --gateway-arn <arn> --volume-size-in-bytes 1099511627776 --target-name vol1 --network-interface-id 10.0.0.10 --client-token t2', description: 'Create a cached iSCSI volume.' },
    { command: 'aws storagegateway list-gateways', description: 'List gateways.' },
    { command: 'aws storagegateway create-tapes --gateway-arn <arn> --tape-size-in-bytes 107374182400 --client-token t3 --num-tapes-to-create 2 --tape-barcode-prefix TST', description: 'Create virtual tapes.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list gateways',
        language: 'python',
        code: `import boto3

sg = boto3.client("storagegateway")
for gw in sg.list_gateways()["Gateways"]:
    print(gw["GatewayName"], gw["GatewayType"], gw["GatewayOperationalState"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Back up file servers to S3 with local performance',
      scenario: 'Office file servers need cloud-backed storage but users still expect SMB shares and fast access to recent files.',
      steps: [
        'Deploy an S3 File Gateway VM on-premises with a local cache disk.',
        'Create an SMB file share mapped to an S3 bucket.',
        'Use S3 lifecycle rules to move old files to cheaper classes.',
      ],
    },
  ],
  diagram: {
    title: 'S3 File Gateway',
    nodes: [
      ['clients', 'On-premises clients (NFS/SMB)', 'external', 0, 1],
      ['gw', 'Storage Gateway + local cache', 'storage', 1, 1],
      ['s3', 'Amazon S3 bucket', 'storage', 2, 1],
      ['gl', 'Glacier via lifecycle', 'storage', 3, 1],
      ['kms', 'Encryption (KMS)', 'security', 2, 0],
    ],
    edges: [
      ['clients', 'gw', 'File protocols'],
      ['gw', 's3', 'Async upload (HTTPS)'],
      ['s3', 'gl', 'Lifecycle'],
      ['kms', 's3', 'Encrypts objects'],
    ],
    steps: [
      'Clients read and write files over NFS or SMB; recently used data is served from the gateway\'s local cache.',
      'The gateway uploads changes to S3 as objects in the background.',
      'S3 features (versioning, lifecycle, replication, encryption) then apply to the data.',
    ],
  },
  questionTypes: [
    { pattern: 'Hybrid file access to S3', hint: 'S3 File Gateway.' },
    { pattern: 'Replace tape backups', hint: 'Tape Gateway.' },
    { pattern: 'Block storage hybrid', hint: 'Volume Gateway cached vs stored.' },
    { pattern: 'Storage Gateway vs DataSync', hint: 'Gateway = ongoing hybrid access; DataSync = bulk or scheduled transfers.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company\'s on-premises applications use NFS file shares. They want to store the data in Amazon S3 while retaining low-latency access to frequently used files with no application changes. Which solution is BEST?',
      options: ['AWS Storage Gateway - S3 File Gateway', 'Amazon EFS mounted over the internet', 'AWS Snowball Edge only', 'Amazon FSx for Lustre'],
      answer: ['A'],
      explanation: 'S3 File Gateway exposes NFS/SMB shares backed by S3 and caches recent data locally.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A company wants to eliminate its physical tape library but keep its existing backup software and archive to the cheapest long-term AWS storage. Which gateway type should it deploy?',
      options: ['File Gateway', 'Volume Gateway (cached)', 'Tape Gateway', 'None - tape cannot be virtualised'],
      answer: ['C'],
      explanation: 'Tape Gateway provides a virtual tape library compatible with major backup software and archives to S3 Glacier/Deep Archive.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'An application needs low-latency access to the entire dataset on-premises, but wants asynchronous backups of point-in-time snapshots to AWS. Which configuration should be used?',
      options: ['Volume Gateway - stored volumes', 'Volume Gateway - cached volumes', 'S3 File Gateway', 'Tape Gateway'],
      answer: ['A'],
      explanation: 'Stored volumes keep the full primary dataset on-premises for low latency and back up snapshots to AWS; cached volumes keep primary data in AWS.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'On-premises applications need iSCSI block storage where the full dataset lives in AWS and only frequently accessed data is cached locally. Which configuration fits?',
      options: ['Volume Gateway in stored volume mode', 'Volume Gateway in cached volume mode', 'S3 File Gateway', 'Tape Gateway'],
      answer: ['B'],
      explanation: 'Cached volumes keep the primary data in AWS and cache hot data on premises; stored volumes keep the entire dataset locally.',
    },
  ],
  keyFacts: [
    'Gateway types: S3 File Gateway (NFS/SMB to S3), Volume Gateway (iSCSI; cached or stored), Tape Gateway (virtual tapes).',
    'Cached volumes: primary data in AWS, frequently used data cached on-premises; stored volumes: primary data on-premises with async backup to AWS.',
    'The gateway runs as a VM, hardware appliance or in EC2 and always needs a local cache disk.',
    'File Gateway stores files as native S3 objects, so S3 lifecycle, versioning and replication apply.',
    'Volume snapshots are stored as EBS snapshots in S3.',
    'Use DataSync for scheduled or one-time bulk transfers; Storage Gateway for ongoing hybrid access.',
  ],
  traps: [
    { clue: 'On-prem apps need NFS/SMB backed by S3', answer: 'S3 File Gateway.' },
    { clue: 'Replace tape backup infrastructure', answer: 'Tape Gateway.' },
    { clue: 'One-time or scheduled bulk migration', answer: 'DataSync (or Snow Family).' },
  ],
  related: ['s3', 'datasync', 'glacier', 'ebs', 'backup', 'snow-family'],
  sources: [
    { title: 'What is AWS Storage Gateway?', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/WhatIsStorageGateway.html' },
    { title: 'S3 File Gateway', url: 'https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html' },
    { title: 'Volume Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/WhatIsStorageGateway.html' },
    { title: 'Tape Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/tgw/WhatIsStorageGateway.html' },
    { title: 'AWS CLI storagegateway commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/storagegateway/index.html' },
  ],
};
