import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon S3 Glacier storage classes. Schema: see s3.js. */
export default {
  tagline: 'The lowest-cost archival storage - three S3 Glacier classes trading retrieval speed for price.',
  intro: [
    'The S3 Glacier storage classes are designed for long-term archival: Glacier Instant Retrieval (millisecond access), Glacier Flexible Retrieval (minutes to hours) and Glacier Deep Archive (hours, lowest cost).',
    'Objects stay in S3 buckets (you manage them with S3 APIs and lifecycle rules) but archived classes must be restored before they can be read.',
    'Retrieval options for Flexible Retrieval: Expedited (typically 1-5 minutes), Standard (3-5 hours) and Bulk (5-12 hours, lowest cost).',
    'Deep Archive offers Standard retrieval within 12 hours and Bulk within 48 hours; its minimum storage duration is 180 days (90 days for the other two classes).',
    'S3 Glacier Vault Lock (for original Glacier vaults) enforces compliance controls such as WORM policies that cannot be changed once locked; for S3 buckets use S3 Object Lock.',
    'Typical flow: write data to S3 Standard, then let lifecycle rules transition it to Glacier classes as it ages.',
  ],
  useCases: [
    { title: 'Compliance archives', detail: 'Retain records for years at minimal cost with WORM protection.' },
    { title: 'Media and backup archives', detail: 'Long-term tape replacement, often via Storage Gateway Tape Gateway.' },
    { title: 'Rarely accessed data with fast access needs', detail: 'Glacier Instant Retrieval for quarterly-access data in milliseconds.' },
  ],
  importance: {
    points: [
      'Task 4.1 covers storage tiering and lifecycle (cold tiering for object storage) and selecting the right archival solution.',
      'Know retrieval times and minimum durations - exam options often differ only in these details.',
    ],
  },
  cli: [
    { command: 'aws s3 cp backup.tar s3://archive-bucket/ --storage-class DEEP_ARCHIVE', description: 'Upload straight into Glacier Deep Archive.' },
    { command: 'aws s3api restore-object --bucket archive-bucket --key backup.tar --restore-request \'{"Days":7,"GlacierJobParameters":{"Tier":"Bulk"}}\'', description: 'Restore an archived object (temporary copy for 7 days) using Bulk retrieval.' },
    { command: 'aws s3api head-object --bucket archive-bucket --key backup.tar', description: 'Check restore status in the Restore header.' },
    { command: 'aws s3api put-bucket-lifecycle-configuration --bucket logs --lifecycle-configuration file://lifecycle.json', description: 'Transition objects to Glacier classes automatically.' },
    { command: 'aws glacier initiate-vault-lock --account-id - --vault-name records --policy file://lock-policy.json', description: 'Start a Vault Lock for an original Glacier vault.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): request a Bulk restore',
        language: 'python',
        code: `import boto3

s3 = boto3.client("s3")
s3.restore_object(
    Bucket="archive-bucket",
    Key="backup.tar",
    RestoreRequest={"Days": 7, "GlacierJobParameters": {"Tier": "Bulk"}},
)`,
      },
    ],
  },
  examples: [
    {
      title: '7-year retention at minimum cost',
      scenario: 'Financial records must be retained for 7 years; retrieval is rare and a delay of 12 hours is acceptable.',
      steps: [
        'Upload to S3 Standard, then lifecycle-transition to Glacier Deep Archive after 30 days.',
        'Apply S3 Object Lock in compliance mode (or Vault Lock for Glacier vaults) to enforce retention.',
        'Restore with Standard or Bulk retrieval when an audit requires the data.',
      ],
    },
  ],
  diagram: {
    title: 'Lifecycle into Glacier and restore',
    nodes: [
      ['std', 'S3 Standard', 'storage', 0, 1],
      ['gir', 'Glacier Instant Retrieval', 'storage', 1, 0],
      ['gfr', 'Glacier Flexible Retrieval', 'storage', 1, 1],
      ['gda', 'Glacier Deep Archive', 'storage', 2, 1],
      ['restore', 'Restored temporary copy', 'storage', 3, 1],
    ],
    edges: [
      ['std', 'gfr', 'Lifecycle rule'],
      ['gfr', 'gda', 'Age further'],
      ['gda', 'restore', 'RestoreObject'],
      ['gir', 'gfr', 'Colder tier'],
    ],
    steps: [
      'Lifecycle rules move aging objects from S3 Standard into a Glacier class.',
      'Objects in Flexible Retrieval and Deep Archive are not readable until a restore job completes.',
      'A restore creates a temporary readable copy for the number of days you request; the archived object remains.',
    ],
  },
  questionTypes: [
    { pattern: 'Lowest cost for long-term retention', hint: 'Glacier Deep Archive if hours of retrieval delay is acceptable.' },
    { pattern: 'Archive but need millisecond access', hint: 'Glacier Instant Retrieval.' },
    { pattern: 'Retrieval time requirements', hint: 'Expedited minutes, Standard hours, Bulk up to 12 hours (Deep Archive up to 48).' },
    { pattern: 'WORM compliance', hint: 'Vault Lock / S3 Object Lock.' },
  ],
  questions: [
    {
      source: 'mock', domain: 4,
      stem: 'A company must keep audit data for 10 years. It is accessed less than once a year, and retrieval within 12 hours is acceptable. What is the MOST cost-effective storage?',
      options: ['S3 Standard-IA', 'S3 Glacier Instant Retrieval', 'S3 Glacier Deep Archive', 'S3 One Zone-IA'],
      answer: ['C'],
      explanation: 'Deep Archive has the lowest storage cost and its Standard retrieval completes within 12 hours.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Medical images are rarely accessed (about once a quarter) but must be available in milliseconds when requested. Which class fits best?',
      options: ['S3 Glacier Flexible Retrieval', 'S3 Glacier Deep Archive', 'S3 Glacier Instant Retrieval', 'S3 Standard'],
      answer: ['C'],
      explanation: 'Glacier Instant Retrieval is designed for long-lived data accessed about once a quarter with millisecond retrieval.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A regulator requires that archived vault data cannot be modified or deleted for seven years, and the policy itself must be immutable after activation. Which feature should be used for an S3 Glacier vault?',
      options: ['An IAM policy', 'S3 Glacier Vault Lock policy', 'An S3 bucket policy', 'A KMS key policy'],
      answer: ['B'],
      explanation: 'Vault Lock lets you enforce compliance controls (like WORM) with a policy that cannot be changed once locked.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'An archived object in Glacier Flexible Retrieval is needed within about five minutes for an urgent investigation. Which retrieval option should be used?',
      options: ['Bulk', 'Standard', 'Expedited', 'Deep Archive Bulk'],
      answer: ['C'],
      explanation: 'Expedited retrievals typically complete in 1-5 minutes; Standard takes hours and Bulk the longest.',
    },
  ],
  keyFacts: [
    'Minimum storage duration: Glacier Instant and Flexible 90 days; Deep Archive 180 days (early deletion is charged for the remainder).',
    'Flexible Retrieval: Expedited 1-5 minutes, Standard 3-5 hours, Bulk 5-12 hours. Deep Archive: Standard within 12 hours, Bulk within 48 hours.',
    'Glacier Instant Retrieval gives millisecond access; the others require a restore first.',
    'Restored data is a temporary copy for the days you specify.',
    'Vault Lock (Glacier vaults) and Object Lock (S3 buckets) provide WORM retention.',
    'Archived objects carry extra metadata overhead (about 40 KB each) - avoid archiving huge numbers of tiny objects.',
  ],
  traps: [
    { clue: 'Cheapest, hours of delay OK', answer: 'Glacier Deep Archive.' },
    { clue: 'Archive + millisecond access', answer: 'Glacier Instant Retrieval.' },
    { clue: 'Urgent restore in minutes', answer: 'Expedited retrieval.' },
    { clue: 'Immutable retention', answer: 'Vault Lock / Object Lock compliance mode.' },
  ],
  related: ['s3', 'storage-gateway', 'backup', 'datasync'],
  sources: [
    { title: 'Understanding S3 Glacier storage classes', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/glacier-storage-classes.html' },
    { title: 'Working with archived objects', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/archived-objects.html' },
    { title: 'Restoring an archived object', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html' },
    { title: 'S3 Glacier Vault Lock', url: 'https://docs.aws.amazon.com/amazonglacier/latest/dev/vault-lock.html' },
    { title: 'Amazon S3 storage classes', url: 'https://aws.amazon.com/s3/storage-classes/' },
  ],
};
