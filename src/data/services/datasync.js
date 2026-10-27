import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS DataSync. Schema: see s3.js. */
export default {
  tagline: 'Automated, accelerated online data transfer between on-premises, other clouds and AWS storage.',
  intro: [
    'AWS DataSync is a managed service that copies file or object data to, from and between AWS storage services over the network.',
    'Supported on-premises sources include NFS, SMB, HDFS and object storage; AWS locations include S3, EFS and the FSx file systems; it also reaches other cloud object stores such as Google Cloud Storage and Azure Blob Storage.',
    'An on-premises DataSync agent (a VM you deploy) reads from the local storage; for AWS-to-AWS copies no agent is needed.',
    'It uses a purpose-built protocol with parallel, multi-threaded transfer, encrypts data in transit and validates data integrity, and can run through a VPC endpoint so traffic need not cross the public internet.',
    'Tasks can be scheduled (hourly, daily, weekly), filtered with include/exclude patterns and bandwidth-throttled; they copy only changed data after the first run, which suits recurring syncs.',
    'Typical purposes are one-time migrations, archiving cold data to S3 Glacier storage classes, replicating data for protection, and moving data for in-cloud processing.',
  ],
  useCases: [
    { title: 'Migrate a file server to Amazon EFS or FSx', detail: 'Copy NFS or SMB shares with permissions and metadata preserved.' },
    { title: 'Archive cold data', detail: 'Send old on-premises data straight to S3 Glacier Flexible Retrieval or Deep Archive.' },
    { title: 'Recurring sync for analytics', detail: 'Nightly copy of new files into S3 so Athena, EMR or SageMaker can process them.' },
    { title: 'Move data between AWS storage services', detail: 'S3 to EFS, or EFS in one Region to EFS in another, without custom scripts.' },
  ],
  importance: {
    points: [
      'AWS positions DataSync as the online transfer tool for large datasets; it appears in migration questions as the answer when the data must move over an existing network link quickly and repeatedly.',
      'The exam contrasts it with Snow Family (offline devices), Storage Gateway (ongoing hybrid access) and Transfer Family (SFTP/FTP endpoints): read the requirement words carefully.',
      'Domain 3 (data ingestion) and Domain 4 (cost-optimised transfer and storage) both draw on it.',
    ],
  },
  cli: [
    { command: 'aws datasync create-agent --agent-name onprem-agent --activation-key <key>', description: 'Register a deployed on-premises agent using its activation key.' },
    { command: 'aws datasync create-location-nfs --server-hostname nas.example.com --subdirectory /export/data --on-prem-config AgentArns=<agent-arn>', description: 'Define the NFS source location.' },
    { command: 'aws datasync create-location-s3 --s3-bucket-arn arn:aws:s3:::company-archive --s3-config BucketAccessRoleArn=<role-arn> --s3-storage-class DEEP_ARCHIVE', description: 'Define an S3 destination that stores objects in Glacier Deep Archive.' },
    { command: 'aws datasync create-task --source-location-arn <src-arn> --destination-location-arn <dst-arn> --name nightly-sync --schedule ScheduleExpression="cron(0 2 * * ? *)"', description: 'Create a task that runs every night at 02:00 UTC.' },
    { command: 'aws datasync start-task-execution --task-arn <task-arn>', description: 'Run a task immediately.' },
    { command: 'aws datasync describe-task-execution --task-execution-arn <execution-arn>', description: 'Check progress, bytes transferred and verification result.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): start a task and read its status',
        language: 'python',
        code: `import boto3

ds = boto3.client("datasync")
run = ds.start_task_execution(TaskArn="arn:aws:datasync:us-east-1:111122223333:task/task-0abc")
detail = ds.describe_task_execution(TaskExecutionArn=run["TaskExecutionArn"])
print(detail["Status"], detail.get("BytesTransferred"))`,
      },
    ],
  },
  examples: [
    {
      title: 'Migrate an NFS file share to Amazon EFS',
      scenario: 'A company has a 40 TB NFS share and a 1 Gbps Direct Connect link; the cutover must be repeatable and verified.',
      steps: [
        'Deploy the DataSync agent as a VM near the NFS server and activate it.',
        'Create an NFS source location and an EFS destination location (mount target in a private subnet).',
        'Create a task with data verification enabled and run it once for the bulk copy.',
        'Run the task again just before cutover; only changed files are transferred.',
      ],
    },
  ],
  diagram: {
    title: 'DataSync from on-premises to AWS',
    nodes: [
      ['nas', 'On-premises NFS / SMB storage', 'external', 0, 1],
      ['agent', 'DataSync agent (VM)', 'integration', 1, 1],
      ['ds', 'AWS DataSync service', 'integration', 2, 1],
      ['s3', 'Amazon S3 / Glacier', 'storage', 3, 0],
      ['efs', 'Amazon EFS / FSx', 'storage', 3, 2],
    ],
    edges: [
      ['nas', 'agent', 'Reads files'],
      ['agent', 'ds', 'Encrypted transfer'],
      ['ds', 's3', 'Writes objects'],
      ['ds', 'efs', 'Writes files'],
    ],
    steps: [
      'The agent in your data centre reads files from the NFS or SMB source.',
      'It sends them to the DataSync service over the internet, Direct Connect or a VPC endpoint, encrypted and in parallel.',
      'DataSync writes to the destination and verifies integrity; scheduled runs copy only changes.',
    ],
  },
  questionTypes: [
    { pattern: 'Move large datasets online, repeatedly, with verification', hint: 'AWS DataSync.' },
    { pattern: 'DataSync vs Snow Family', hint: 'Network available and time allows = DataSync; poor or no connectivity, petabytes = Snow.' },
    { pattern: 'DataSync vs Storage Gateway', hint: 'One-off or scheduled copy = DataSync; ongoing local access to cloud-backed data = Storage Gateway.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company must copy 30 TB from an on-premises NFS server to Amazon S3 over its existing 1 Gbps link and then keep the data in sync nightly. The solution must verify data integrity and require minimal custom code. Which service should be used?',
      options: ['AWS Snowball Edge only', 'A custom script using the AWS CLI sync command run by cron on every server', 'AWS Storage Gateway Volume Gateway', 'AWS DataSync'],
      answer: ['D'],
      explanation: 'DataSync is built for scheduled, verified online transfers from NFS/SMB sources and copies only changed data after the first run.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company wants to migrate an SMB file share to Amazon FSx for Windows File Server with the least operational overhead. Which service can copy the data?',
      options: ['Amazon SQS', 'AWS Glue', 'Amazon Kinesis Data Firehose', 'AWS DataSync'],
      answer: ['D'],
      explanation: 'DataSync supports SMB sources and FSx for Windows File Server destinations.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Which statements about AWS DataSync are true? (Select TWO.)',
      multi: true,
      options: ['It can only copy data between two S3 buckets.', 'It can run on a schedule and transfer only changed files after the first run.', 'It requires physical devices to be shipped to AWS.', 'It validates data integrity during transfer.', 'It provides SFTP endpoints for external partners.'],
      answer: ['B', 'D'],
      explanation: 'Scheduling, incremental copies and integrity validation are core DataSync features. Shipping devices is Snow Family; SFTP endpoints are AWS Transfer Family.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A company wants to move rarely used on-premises archives to the lowest-cost AWS storage over its network. Which approach is MOST appropriate?',
      options: ['Copy the files to an EBS gp3 volume', 'Use DataSync with an S3 Glacier Deep Archive destination', 'Store the files in Amazon ElastiCache', 'Use Amazon EFS Standard'],
      answer: ['B'],
      explanation: 'DataSync can write directly into S3 Glacier storage classes, which are the lowest-cost options for cold archives.',
    },
  ],
  keyFacts: [
    'DataSync copies file/object data online; sources include NFS, SMB, HDFS, object storage and other clouds; destinations include S3, EFS and FSx.',
    'An agent is required for on-premises sources; AWS-to-AWS transfers use no agent.',
    'Features: scheduling, include/exclude filters, bandwidth limits, incremental transfers, encryption in transit, integrity verification.',
    'Can use a VPC endpoint so data does not traverse the public internet; works over Direct Connect too.',
    'Can write to S3 storage classes directly, including Glacier Flexible Retrieval and Deep Archive.',
    'Choose Snow Family when the network is too slow, unreliable or the dataset is too large for the time available.',
  ],
  traps: [
    { clue: 'Online, scheduled, verified file transfer to AWS', answer: 'DataSync.' },
    { clue: 'No network or weeks to transfer petabytes', answer: 'Snow Family.' },
    { clue: 'SFTP/FTPS access for external partners into S3/EFS', answer: 'Transfer Family.' },
    { clue: 'Local apps keep using NFS/SMB with cloud backing', answer: 'Storage Gateway (File Gateway).' },
  ],
  related: ['snow-family', 'storage-gateway', 'transfer-family', 's3', 'efs', 'fsx'],
  sources: [
    { title: 'What is AWS DataSync?', url: 'https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html' },
    { title: 'How AWS DataSync transfers work', url: 'https://docs.aws.amazon.com/datasync/latest/userguide/how-datasync-transfer-works.html' },
    { title: 'Working with AWS DataSync locations', url: 'https://docs.aws.amazon.com/datasync/latest/userguide/working-with-locations.html' },
    { title: 'AWS CLI datasync commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/datasync/index.html' },
  ],
};
