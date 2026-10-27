import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Snow Family. Schema: see s3.js. */
export default {
  tagline: 'Physical, rugged devices that move bulk data into AWS offline and run compute at the edge.',
  notice: {
    title: 'Availability change (checked 27 Oct 2026)',
    text: 'AWS discontinued Snowcone on 12 Nov 2024, and since 7 Nov 2025 Snowball Edge is only available to existing customers; AWS now points new customers to DataSync, AWS Data Transfer Terminal, partner offline-transfer solutions and Outposts for edge computing. "AWS Snow Family" is still listed in the current SAA-C03 exam guide, so learn the concept and the decision rules, but do not plan a real project around ordering a device.',
  },
  intro: [
    'The AWS Snow Family is a set of physical devices that you load with data on site and ship to AWS, where the data is imported into Amazon S3 (or exported from S3 to you); it exists for datasets too large or networks too slow for online transfer.',
    'Snowball Edge comes in Storage Optimized (large local storage, roughly 210 TB in the current model) and Compute Optimized (more vCPUs, optional GPU) versions, and can run EC2-compatible instances and Lambda functions locally at the edge.',
    'Snowcone is the small, portable member (discontinued) and Snowmobile is the shipping-container truck for exabyte-scale moves; both appear in older exam material.',
    'Data on the device is encrypted at rest with 256-bit keys managed through AWS KMS, devices are tamper-resistant, and the shipping label is an E Ink display so the device routes itself to the right AWS facility.',
    'Typical triggers in a question: tens of terabytes to petabytes, a slow, expensive or unreliable network link, a transfer that would take weeks online, or an edge site with no connectivity that needs local processing.',
    'Alternatives to compare: DataSync (online, uses the network), Direct Connect (a dedicated network link, takes weeks to provision), Storage Gateway (ongoing hybrid access) and Transfer Family (SFTP/FTP into S3).',
  ],
  useCases: [
    { title: 'Large one-time data centre migration', detail: 'Ship hundreds of terabytes to S3 when the available bandwidth would need weeks or months.' },
    { title: 'Data collection in remote locations', detail: 'Collect and pre-process data at a ship, mine or field site without a reliable connection, then ship the device back.' },
    { title: 'Edge compute and storage', detail: 'Run EC2-compatible instances and Lambda locally where latency or connectivity rules out the Region.' },
    { title: 'Export data out of AWS', detail: 'Copy large S3 datasets onto a device for delivery to an on-premises location.' },
  ],
  importance: {
    points: [
      'Snow Family is on the current exam guide, and it is the standard answer for "move a very large dataset when the network is slow, costly or unavailable".',
      'The exam mostly tests the decision: Snow (offline) vs DataSync (online) vs Direct Connect (dedicated link) vs Storage Gateway (ongoing hybrid access).',
      'Domain 3 (data ingestion) and Domain 4 (cost-optimised transfer) questions use it; expect the dataset size and bandwidth to be given so you can judge the transfer time.',
    ],
  },
  cli: [
    { command: 'aws snowball create-job --job-type IMPORT --resources \'{"S3Resources":[{"BucketArn":"arn:aws:s3:::migration-bucket"}]}\' --address-id <address-id> --kms-key-arn <key-arn> --role-arn <role-arn> --snowball-type EDGE --shipping-option SECOND_DAY', description: 'Create an import job that loads a Snowball Edge into S3 (existing customers).' },
    { command: 'aws snowball list-jobs', description: 'List jobs and their states (for example PreparingAppliance, InTransitToCustomer, WithCustomer).' },
    { command: 'aws snowball describe-job --job-id <job-id>', description: 'See the details of one job, including the shipping and KMS settings.' },
    { command: 'aws snowball get-job-manifest --job-id <job-id>', description: 'Download the manifest used to unlock the device.' },
    { command: 'aws snowball get-job-unlock-code --job-id <job-id>', description: 'Get the unlock code for the device.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list Snow jobs and their states',
        language: 'python',
        code: `import boto3

snow = boto3.client("snowball")
for job in snow.list_jobs()["JobListEntries"]:
    print(job["JobId"], job["JobType"], job["JobState"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Move 400 TB over a slow link',
      scenario: 'A company must move 400 TB to S3 within a month; its internet link sustains 100 Mbps.',
      steps: [
        'Estimate the online time: 400 TB at 100 Mbps is far longer than a month, so online transfer fails the deadline.',
        'Create an import job, choose the devices and a KMS key, and specify the target S3 bucket.',
        'Copy the data to the devices on site, then ship them back; AWS imports the data to S3.',
        'Use DataSync afterwards for the small daily delta that keeps arriving.',
      ],
    },
  ],
  diagram: {
    title: 'Offline transfer with a Snowball Edge device',
    nodes: [
      ['dc', 'On-premises data', 'external', 0, 1],
      ['snow', 'Snowball Edge device', 'integration', 1, 1],
      ['kms', 'AWS KMS key', 'security', 1, 0],
      ['fac', 'AWS facility (import)', 'management', 2, 1],
      ['s3', 'Amazon S3 bucket', 'storage', 3, 1],
    ],
    edges: [
      ['dc', 'snow', 'Copy data'],
      ['kms', 'snow', 'Encrypts data'],
      ['snow', 'fac', 'Ship device', 'dashed'],
      ['fac', 's3', 'Import to bucket'],
    ],
    steps: [
      'You order a job and AWS ships an encrypted device to your site.',
      'You copy the data onto it; the data is encrypted with a key managed in AWS KMS.',
      'You ship the device back (the E Ink label routes it), and AWS imports the data into your S3 bucket.',
    ],
  },
  questionTypes: [
    { pattern: 'Petabyte-scale or slow-network migration', hint: 'Snow Family (offline) rather than online transfer.' },
    { pattern: 'Edge compute with no connectivity', hint: 'Snowball Edge Compute Optimized (or Outposts for new designs).' },
    { pattern: 'Online vs offline transfer decision', hint: 'Calculate transfer time from size and bandwidth; DataSync if the link is fast enough.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company must migrate 500 TB of data to Amazon S3. The data centre has a 50 Mbps internet connection that cannot be upgraded, and the migration must finish within three weeks. Which service meets the requirement?',
      options: ['AWS Snow Family devices', 'Amazon S3 Transfer Acceleration', 'AWS Storage Gateway File Gateway', 'AWS DataSync over the internet'],
      answer: ['A'],
      explanation: '500 TB over 50 Mbps would take many months, so an offline transfer with Snow Family devices is the only option that meets the three-week deadline.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A mining company collects sensor data at a remote site that has no network connectivity and needs to process it locally with EC2-compatible instances before sending results to AWS. Which AWS option fits this requirement?',
      options: ['AWS Snowball Edge Compute Optimized', 'AWS Direct Connect', 'Amazon CloudFront', 'Amazon Route 53'],
      answer: ['A'],
      explanation: 'Snowball Edge Compute Optimized provides local EC2-compatible compute and storage in disconnected environments, and the device is shipped back to AWS for data import.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A company can sustain 1 Gbps to AWS and must move 5 TB initially plus new files every night, with integrity validation and scheduling. What is the MOST appropriate and cost-effective choice?',
      options: ['A new Direct Connect connection just for 5 TB', 'AWS DataSync', 'A Snowball Edge device for the nightly files', 'Snowmobile'],
      answer: ['B'],
      explanation: 'At 1 Gbps, 5 TB transfers online in roughly half a day, and DataSync handles scheduled incremental syncs with verification. Offline devices are not needed.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statements about AWS Snowball Edge are true? (Select TWO.)',
      multi: true,
      options: ['It requires a Direct Connect connection to be installed first.', 'Data on the device is encrypted with keys managed through AWS KMS.', 'It provides SFTP endpoints for third-party partners.', 'It can only be used to export data from AWS.', 'Imported data is loaded into Amazon S3 when the device returns to AWS.'],
      answer: ['B', 'E'],
      explanation: 'Snowball Edge encrypts data with KMS-managed keys and imports it into S3 after shipping. It does not require Direct Connect, supports import and export, and SFTP endpoints belong to Transfer Family.',
    },
  ],
  keyFacts: [
    'Snow Family = offline physical transfer plus edge compute; data lands in Amazon S3.',
    'Snowball Edge Storage Optimized (about 210 TB) is for bulk data; Compute Optimized is for local processing (104 vCPU model, optional GPU).',
    'All data is encrypted with 256-bit keys managed in AWS KMS; devices are tamper-resistant.',
    'Rule of thumb: if the online transfer would take about a week or more, evaluate an offline device; compute time from dataset size and sustained bandwidth.',
    'Snowcone was discontinued on 12 Nov 2024; Snowball Edge is limited to existing customers since 7 Nov 2025; Snowmobile (up to 100 PB per truck) is the exabyte-scale legacy option.',
    'For new designs AWS recommends DataSync (online), Data Transfer Terminal (physical upload site), partner offline services, or Outposts (edge compute).',
  ],
  traps: [
    { clue: 'Petabytes, slow or unreliable network, deadline in weeks', answer: 'Snow Family.' },
    { clue: 'Fast network, recurring sync with verification', answer: 'DataSync.' },
    { clue: 'Continuous low-latency access to cloud storage from on premises', answer: 'Storage Gateway.' },
    { clue: 'Compute at a disconnected edge site', answer: 'Snowball Edge Compute Optimized (or Outposts for new builds).' },
  ],
  related: ['datasync', 'storage-gateway', 's3', 'direct-connect', 'outposts', 'transfer-family'],
  sources: [
    { title: 'AWS Snowball Edge availability change', url: 'https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html' },
    { title: 'AWS Snow device updates (AWS Storage Blog)', url: 'https://aws.amazon.com/blogs/storage/aws-snow-device-updates/' },
    { title: 'AWS Snowball Edge Developer Guide', url: 'https://docs.aws.amazon.com/snowball/latest/developer-guide/whatissnowball.html' },
    { title: 'AWS CLI snowball commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/snowball/index.html' },
  ],
};
