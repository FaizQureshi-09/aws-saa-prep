import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Application Migration Service (MGN). Schema: see s3.js. */
export default {
  tagline: 'Lift-and-shift servers to AWS with continuous block-level replication and short cutover windows.',
  notice: {
    title: 'Naming: AWS Application Migration Service is now AWS Transform MGN',
    text: 'AWS\'s current documentation titles this service AWS Transform MGN, while the exam guide lists AWS Application Migration Service. They are the same service: the console path, API and CLI namespace (aws mgn) are unchanged, so learn it under both names.',
  },
  intro: [
    'AWS Application Migration Service (MGN) automates the migration of physical, virtual and cloud servers to AWS with minimal downtime, typically with cutover windows of minutes.',
    'It performs continuous, block-level replication of source servers into a low-cost staging area in your AWS account, and converts them so they boot and run natively on Amazon EC2 when launched.',
    'You install the AWS Replication Agent on each source server; supported sources include physical servers, VMware, Hyper-V and other clouds, across a broad range of Windows and Linux operating systems.',
    'Three configurable templates control behaviour: replication settings (staging resources), launch settings (target instance type, subnet and so on) and post-launch actions.',
    'You first launch test instances to validate the application without affecting the source, then perform a cutover to launch production instances and finalise the migration.',
    'Servers can be grouped into applications and waves to migrate at scale; MGN is for rehosting servers (lift-and-shift), while AWS DMS migrates databases and DataSync migrates file data.',
  ],
  useCases: [
    { title: 'Rehost data centre servers', detail: 'Move hundreds of VMs to EC2 quickly with little re-architecture.' },
    { title: 'Cross-cloud or cross-Region server migration', detail: 'Migrate workloads from another cloud or between AWS Regions.' },
    { title: 'Disaster recovery of servers', detail: 'Use continuous replication as the basis of a pilot-light-style recovery (AWS Elastic Disaster Recovery builds on the same technology).' },
  ],
  importance: {
    points: [
      'The migration questions in Domains 2 and 3 expect you to pick MGN for "lift-and-shift of servers with minimal downtime".',
      'Distinguish it from DMS (databases), DataSync (files) and Snow Family (offline bulk data).',
    ],
  },
  cli: [
    { command: 'aws mgn initialize-service', description: 'Initialise Application Migration Service in a Region (creates service roles).' },
    { command: 'aws mgn describe-source-servers --filters isArchived=false', description: 'List source servers being replicated.' },
    { command: 'aws mgn start-test --source-server-ids s-0abc123', description: 'Launch a test instance for a replicated server.' },
    { command: 'aws mgn start-cutover --source-server-ids s-0abc123', description: 'Launch the cutover instance.' },
    { command: 'aws mgn finalize-cutover --source-server-id s-0abc123', description: 'Mark the migration complete and stop replication.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list replicating servers',
        language: 'python',
        code: `import boto3

mgn = boto3.client("mgn")
resp = mgn.describe_source_servers(filters={"isArchived": False})
for s in resp["items"]:
    print(s["sourceServerID"], s["dataReplicationInfo"]["dataReplicationState"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Migrate a three-tier app with minutes of downtime',
      scenario: 'A company must move 40 on-premises VMs to AWS over a weekend window.',
      steps: [
        'Install the replication agent on each server; data replicates continuously to a staging area.',
        'Group servers into an application and wave, and set launch templates for instance types and subnets.',
        'Launch test instances to validate, then schedule the cutover.',
        'Cut over: stop the sources, launch the final instances and finalise.',
      ],
    },
  ],
  diagram: {
    title: 'MGN replication and cutover',
    nodes: [
      ['src', 'Source servers + replication agent', 'external', 0, 1],
      ['stage', 'Staging area (low-cost EC2 + EBS)', 'compute', 1, 1],
      ['test', 'Test instances', 'compute', 1, 0],
      ['tmpl', 'Launch and post-launch templates', 'management', 1, 2],
      ['prod', 'Production EC2 instances (cutover)', 'compute', 2, 1],
    ],
    edges: [
      ['src', 'stage', 'Continuous block replication'],
      ['stage', 'test', 'Test launch'],
      ['tmpl', 'stage', 'Instance settings'],
      ['stage', 'prod', 'Cutover launch'],
    ],
    steps: [
      'The agent replicates disks block-by-block to a staging area in your AWS account.',
      'You launch test instances to validate without touching the source.',
      'At cutover MGN launches production EC2 instances using the launch templates, with minutes of downtime.',
    ],
  },
  questionTypes: [
    { pattern: 'Lift-and-shift servers with minimal downtime', hint: 'AWS Application Migration Service (MGN).' },
    { pattern: 'Migrate databases vs servers vs files', hint: 'DMS vs MGN vs DataSync.' },
    { pattern: 'Test before cutting over', hint: 'MGN test instances.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants to migrate 100 on-premises virtual machines to Amazon EC2 with minimal downtime and few changes to the applications. Which service should be used?',
      options: ['AWS Snowcone', 'AWS Application Migration Service', 'AWS Database Migration Service', 'AWS DataSync'],
      answer: ['B'],
      explanation: 'MGN replicates servers continuously at block level and launches them on EC2, so cutover takes minutes.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Before cutting over, the team wants to verify that a replicated server boots and works correctly on AWS without affecting production. What should they do?',
      options: ['Create a new VPC', 'Launch a test instance from the replicated server', 'Copy the data to S3 manually', 'Stop the source server and hope'],
      answer: ['B'],
      explanation: 'MGN lets you launch test instances while replication continues, then perform the cutover when ready.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statement describes how AWS Application Migration Service replicates data?',
      options: ['A one-time image upload using Snowball only', 'Continuous block-level replication to a staging area in the customer\'s AWS account', 'Daily full file copies to Amazon S3', 'Database change data capture only'],
      answer: ['B'],
      explanation: 'MGN uses an agent for continuous block-level replication into low-cost staging resources, then converts and launches the servers.',
    },
  ],
  keyFacts: [
    'Rehost (lift-and-shift) of physical, virtual and cloud servers to EC2; supports many Windows and Linux versions.',
    'Agent-based continuous block-level replication into a staging area; cutover windows measured in minutes.',
    'Test launch first, then cutover, then finalise; group servers into applications and waves.',
    'Templates: replication, launch, post-launch.',
    'DMS for databases, DataSync for files; MGN for whole servers.',
  ],
  traps: [
    { clue: 'Rehost servers with minimal downtime', answer: 'MGN.' },
    { clue: 'Migrate a database engine or schema', answer: 'DMS (and Schema Conversion Tool).' },
    { clue: 'Copy file shares to S3 or EFS', answer: 'DataSync.' },
  ],
  related: ['dms', 'datasync', 'ec2', 'dr-strategies', 'snow-family', 'cloudformation'],
  sources: [
    { title: 'What is AWS Transform MGN (Application Migration Service)?', url: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-application-migration-service.html' },
    { title: 'Application Migration Service: how it works', url: 'https://docs.aws.amazon.com/mgn/latest/ug/what-is-mgn.html' },
    { title: 'AWS CLI mgn commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/mgn/index.html' },
  ],
};
