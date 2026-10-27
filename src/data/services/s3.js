/**
 * Study content for Amazon S3.
 *
 * Content schema (shared by every file in this folder):
 *  tagline, intro[5-6], useCases[{title,detail}], importance{points[]},
 *  cli[{command,description}], sdk{summary,snippets[{title,language,code}]},
 *  examples[{title,scenario,steps[],code?}], diagram (see utils/diagram.js),
 *  questionTypes[{pattern,hint}], questions[{source,domain,stem,options,answer,explanation}],
 *  keyFacts[], traps[{clue,answer}], related[], sources[{title,url}],
 *  notice?{title,text} (optional warning shown above the introduction, e.g. availability changes).
 * Question `source`: 'official' = AWS-authored sample question, 'mock' = original practice question.
 */
export default {
  tagline: 'Virtually unlimited object storage with 11 nines of durability - the most heavily tested storage service.',
  intro: [
    'Amazon S3 (Simple Storage Service) is regional object storage: you store objects (data + metadata, identified by a key) in buckets, accessed over HTTPS APIs - not a file system or block device.',
    'Objects can be 0 bytes to 5 TB each, a bucket holds an unlimited number of objects, and bucket names are globally unique while the data stays in the Region you pick.',
    'Designed for 99.999999999% (11 nines) durability; S3 Standard is designed for 99.99% availability and stores data across at least three Availability Zones.',
    'Storage classes (Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant/Flexible/Deep Archive) let you trade access speed and resilience for lower cost, and lifecycle rules move data between them automatically.',
    'Security layers: IAM and bucket policies, Block Public Access, encryption at rest (SSE-S3 by default, SSE-KMS, SSE-C) and in transit (TLS), Object Lock, versioning and MFA Delete.',
    'S3 is the hub of many architectures: static websites, data lakes (Athena, Glue, EMR), backups, log archives, software distribution via CloudFront, and event triggers for Lambda, SQS, SNS and EventBridge.',
  ],
  useCases: [
    { title: 'Data lake storage', detail: 'Store raw and curated data in S3 and query it in place with Athena, Redshift Spectrum or EMR.' },
    { title: 'Backup, archive and compliance', detail: 'Lifecycle objects to Glacier classes; use Object Lock (WORM) to meet retention regulations.' },
    { title: 'Static website and media hosting', detail: 'Serve assets from S3 behind CloudFront with Origin Access Control for HTTPS and private buckets.' },
    { title: 'Event-driven processing', detail: 'ObjectCreated events trigger Lambda, SQS, SNS or EventBridge pipelines (thumbnailing, ETL, virus scan).' },
    { title: 'Disaster recovery and data distribution', detail: 'Cross-Region Replication keeps a copy in another Region; Same-Region Replication aggregates logs or separates accounts.' },
  ],
  importance: {
    points: [
      'The single most referenced service across all four domains: access control and encryption (D1), durability and replication (D2), storage performance (D3) and storage-class/lifecycle cost optimisation (D4).',
      'Task 4.1 names S3 lifecycle management, storage tiering and Requester Pays explicitly; Task 3.1 names S3 as a core storage choice.',
      'Almost every architecture question has an S3 option as either the right answer (cheap, durable, serverless) or a plausible distractor - you must know when it does NOT fit (POSIX file system, low-latency block storage, relational queries).',
    ],
  },
  cli: [
    { command: 'aws s3 mb s3://my-bucket --region ap-south-1', description: 'Create (make) a bucket in a specific Region.' },
    { command: 'aws s3 cp report.pdf s3://my-bucket/reports/ --storage-class STANDARD_IA', description: 'Upload a file and set its storage class; the CLI uses multipart automatically for large files.' },
    { command: 'aws s3 sync ./site s3://my-bucket --delete', description: 'Sync a folder to a bucket; --delete removes remote objects that no longer exist locally.' },
    { command: 'aws s3 ls s3://my-bucket --recursive --human-readable --summarize', description: 'List objects with sizes and a total.' },
    { command: 'aws s3api put-bucket-versioning --bucket my-bucket --versioning-configuration Status=Enabled', description: 'Enable versioning (required for replication and Object Lock).' },
    { command: 'aws s3api put-bucket-lifecycle-configuration --bucket my-bucket --lifecycle-configuration file://lifecycle.json', description: 'Apply lifecycle rules (transitions, expiration, abort incomplete multipart uploads).' },
    { command: 'aws s3api put-public-access-block --bucket my-bucket --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true', description: 'Turn on all four Block Public Access settings.' },
    { command: 'aws s3api put-bucket-encryption --bucket my-bucket --server-side-encryption-configuration file://enc.json', description: 'Set default encryption (SSE-S3 or SSE-KMS with a key ARN).' },
    { command: 'aws s3 presign s3://my-bucket/file.zip --expires-in 900', description: 'Generate a pre-signed GET URL valid for 15 minutes.' },
    { command: 'aws s3api put-bucket-replication --bucket src-bucket --replication-configuration file://replication.json', description: 'Configure CRR/SRR (both buckets need versioning, and an IAM role for S3).' },
  ],
  sdk: {
    summary:
      'AWS SDKs exist for many languages (for example Python/Boto3, Java, JavaScript, .NET, Go). Note: "AWS Tools and SDKs" are listed as OUT of scope for SAA-C03, so you will not be asked to write SDK code - but you should recognise what pre-signed URLs and multipart uploads are.',
    snippets: [
      {
        title: 'Python (Boto3): upload with multipart settings and create a pre-signed URL',
        language: 'python',
        code: `import boto3
from boto3.s3.transfer import TransferConfig

s3 = boto3.client("s3", region_name="ap-south-1")

# Multipart kicks in above 100 MB, parts uploaded in parallel
config = TransferConfig(multipart_threshold=100 * 1024 * 1024, max_concurrency=10)
s3.upload_file("backup.tar.gz", "my-bucket", "backups/backup.tar.gz",
               ExtraArgs={"StorageClass": "STANDARD_IA", "ServerSideEncryption": "aws:kms"},
               Config=config)

# Temporary, private download link (valid 15 minutes)
url = s3.generate_presigned_url(
    "get_object",
    Params={"Bucket": "my-bucket", "Key": "backups/backup.tar.gz"},
    ExpiresIn=900,
)
print(url)`,
      },
      {
        title: 'Java (AWS SDK v2): put an object',
        language: 'java',
        code: `S3Client s3 = S3Client.builder().region(Region.AP_SOUTH_1).build();

PutObjectRequest request = PutObjectRequest.builder()
    .bucket("my-bucket")
    .key("reports/q3.pdf")
    .storageClass(StorageClass.STANDARD_IA)
    .serverSideEncryption(ServerSideEncryption.AWS_KMS)
    .build();

s3.putObject(request, RequestBody.fromFile(Path.of("q3.pdf")));`,
      },
    ],
  },
  examples: [
    {
      title: 'Cost-optimised log archive with lifecycle rules',
      scenario: 'Application logs are read daily for 30 days, rarely for the next 60, and must be kept for 7 years for audit, with retrieval within 12 hours acceptable.',
      steps: [
        'Land logs in S3 Standard.',
        'Lifecycle rule: transition to S3 Standard-IA after 30 days.',
        'Transition to S3 Glacier Deep Archive after 90 days (standard retrieval within 12 hours).',
        'Expire (delete) objects after 2,555 days (about 7 years).',
        'Add an AbortIncompleteMultipartUpload rule to avoid paying for orphaned parts.',
      ],
      code: {
        language: 'json',
        code: `{
  "Rules": [{
    "ID": "log-archive",
    "Status": "Enabled",
    "Filter": { "Prefix": "logs/" },
    "Transitions": [
      { "Days": 30, "StorageClass": "STANDARD_IA" },
      { "Days": 90, "StorageClass": "DEEP_ARCHIVE" }
    ],
    "Expiration": { "Days": 2555 },
    "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
  }]
}`,
      },
    },
    {
      title: 'Private bucket served securely through CloudFront',
      scenario: 'A static single-page app must be served over HTTPS on a custom domain while the bucket stays private.',
      steps: [
        'Keep Block Public Access ON for the bucket.',
        'Create a CloudFront distribution with the bucket as origin and an Origin Access Control (OAC).',
        'Add a bucket policy that allows only the CloudFront service principal for that distribution to s3:GetObject.',
        'Request an ACM certificate in us-east-1 for the custom domain and attach it to CloudFront.',
        'Point the domain (Route 53 alias record) at the distribution.',
      ],
    },
  ],
  diagram: {
    title: 'S3 object lifecycle, events and replication',
    nodes: [
      ['app', 'Client / Application', 'actor', 0, 1],
      ['kms', 'AWS KMS key (SSE-KMS)', 'security', 1, 0],
      ['std', 'S3 Standard bucket (versioning on)', 'storage', 1, 1],
      ['evt', 'Event notification', 'integration', 2, 2],
      ['fn', 'Lambda / SQS / SNS', 'compute', 3, 2],
      ['ia', 'S3 Standard-IA', 'storage', 2, 0],
      ['deep', 'Glacier Deep Archive', 'storage', 3, 0],
      ['crr', 'Replica bucket (another Region)', 'storage', 2, 1],
    ],
    edges: [
      ['app', 'std', '1. PUT / GET over HTTPS'],
      ['std', 'kms', '2. Encrypt (SSE-KMS)', 'dashed'],
      ['std', 'ia', '3. Lifecycle: day 30'],
      ['ia', 'deep', '4. Lifecycle: day 90'],
      ['std', 'crr', '5. Replication (CRR)'],
      ['std', 'evt', '6. ObjectCreated'],
      ['evt', 'fn', '7. Trigger processing'],
    ],
    steps: [
      'The client uploads and downloads objects over HTTPS; bucket and IAM policies decide who is allowed.',
      'With SSE-KMS, S3 asks KMS for a data key to encrypt each object (the caller needs kms permissions too).',
      'A lifecycle rule moves objects to Standard-IA after 30 days and to Glacier Deep Archive after 90 days to cut cost.',
      'Replication (requires versioning on source and destination) copies new objects to a bucket in another Region for DR or latency.',
      'Event notifications fire on object creation and trigger Lambda, SQS or SNS for downstream processing.',
    ],
  },
  questionTypes: [
    { pattern: 'Choose the cheapest storage class', hint: 'Match access frequency and retrieval time to Standard, Intelligent-Tiering, IA, One Zone-IA or a Glacier class - watch for minimum storage durations.' },
    { pattern: 'Lifecycle design', hint: 'Transition ordering (Standard to IA needs 30 days), expiration, noncurrent versions, abort incomplete multipart uploads.' },
    { pattern: 'Compliance and immutability', hint: 'Object Lock governance vs compliance mode, legal hold, Glacier Vault Lock, MFA Delete.' },
    { pattern: 'Security and access', hint: 'Bucket policy vs IAM vs ACL, Block Public Access, pre-signed URLs, OAC with CloudFront, cross-account access, CORS.' },
    { pattern: 'Encryption', hint: 'SSE-S3 vs SSE-KMS vs SSE-C vs client-side; who holds the keys; auditing key use with CloudTrail.' },
    { pattern: 'Performance and transfer', hint: 'Multipart upload, byte-range fetches, Transfer Acceleration, prefixes and request rates.' },
    { pattern: 'Replication and DR', hint: 'CRR/SRR prerequisites, replicating existing objects (S3 Batch Replication), replica ownership.' },
  ],
  questions: [
    {
      source: 'official',
      reference: 'AWS SAA-C03 Sample Exam Questions, Q4',
      domain: 1,
      stem: 'An analytics company is planning to offer a web analytics service to its users. The service will require that the users’ webpages include a JavaScript script that makes authenticated GET requests to the company’s Amazon S3 bucket. What must a solutions architect do to ensure that the script will successfully execute?',
      options: [
        'Enable cross-origin resource sharing (CORS) on the S3 bucket.',
        'Enable S3 Versioning on the S3 bucket.',
        'Provide the users with a signed URL for the script.',
        'Configure an S3 bucket policy to allow public execute privileges.',
      ],
      answer: ['A'],
      explanation: 'Web browsers block a script that originates from a server whose domain differs from the web page. Amazon S3 can be configured with CORS to send HTTP headers that allow the script to run. (AWS official explanation.)',
    },
    {
      source: 'official',
      reference: 'AWS SAA-C03 Sample Exam Questions, Q5',
      domain: 1,
      multi: true,
      stem: 'A company’s security team requires that all data stored in the cloud be encrypted at rest at all times using encryption keys stored on premises. Which encryption options meet these requirements? (Select TWO.)',
      options: [
        'Use server-side encryption with Amazon S3 managed encryption keys (SSE-S3).',
        'Use server-side encryption with AWS KMS managed encryption keys (SSE-KMS).',
        'Use server-side encryption with customer-provided encryption keys (SSE-C).',
        'Use client-side encryption to provide at-rest encryption.',
        'Use an AWS Lambda function invoked by Amazon S3 events to encrypt the data using the customer’s keys.',
      ],
      answer: ['C', 'D'],
      explanation: 'SSE-C lets S3 encrypt objects with a key you supply on each request (the key is not stored by AWS), and client-side encryption lets you encrypt before upload with keys that stay on premises. SSE-S3 and SSE-KMS keys are stored and managed by AWS. (AWS official explanation.)',
    },
    {
      source: 'mock',
      domain: 4,
      stem: 'Application logs are accessed frequently for the first 30 days, occasionally for the following 60 days, and then must be retained for 7 years for audit purposes. When an archived log is needed, retrieval within 12 hours is acceptable. Which lifecycle configuration is the MOST cost-effective?',
      options: [
        'Keep objects in S3 Standard for 7 years.',
        'Transition to S3 Standard-IA after 30 days and to S3 Glacier Deep Archive after 90 days.',
        'Transition to S3 One Zone-IA after 30 days and to S3 Glacier Instant Retrieval after 90 days.',
        'Store objects in S3 Intelligent-Tiering with the Deep Archive Access tier disabled.',
      ],
      answer: ['B'],
      explanation: 'Standard-IA suits data that is rarely accessed but needs millisecond access; Deep Archive is the lowest-cost class and its standard retrieval completes within 12 hours. Glacier Instant Retrieval costs more than Deep Archive and the audit data does not need instant access, and Standard is the most expensive for a 7-year retention.',
    },
    {
      source: 'mock',
      domain: 1,
      stem: 'A financial company must ensure that no user, including the AWS account root user, can delete or overwrite specific S3 objects for 5 years. Which solution meets this requirement?',
      options: [
        'Enable S3 Versioning and require MFA Delete on the bucket.',
        'Enable S3 Object Lock in governance mode with a 5-year retention period.',
        'Enable S3 Object Lock in compliance mode with a 5-year retention period.',
        'Add a bucket policy that denies s3:DeleteObject to all principals.',
      ],
      answer: ['C'],
      explanation: 'In compliance mode a protected object version cannot be overwritten or deleted by any user, including the root user, until the retention period expires. Governance mode can be bypassed by users with special permissions, MFA Delete can be turned off by the bucket owner, and a bucket policy can be changed by an administrator.',
    },
    {
      source: 'mock',
      domain: 2,
      stem: 'A company wants to replicate all objects in an existing S3 bucket, including objects uploaded before replication was configured, to a bucket in another AWS Region for disaster recovery. Which combination of actions is required in addition to creating the replication rule? (Select TWO.)',
      multi: true,
      options: [
        'Enable S3 Versioning on both the source and destination buckets.',
        'Enable S3 Transfer Acceleration on the destination bucket.',
        'Configure S3 Event Notifications to an SQS queue on the destination bucket.',
        'Run S3 Batch Replication to copy the pre-existing objects.',
        'Enable S3 Object Lock on the source bucket.',
      ],
      answer: ['A', 'D'],
      explanation: 'Replication requires versioning to be enabled on both the source and destination buckets. A replication rule replicates only objects created after the rule exists; S3 Batch Replication is the feature that replicates pre-existing objects. Transfer Acceleration, event notifications and Object Lock are not prerequisites for replication.',
    },
    {
      source: 'mock',
      domain: 3,
      stem: 'Users in Asia upload 8 GB video files to an S3 bucket in us-east-1 and report slow, failure-prone uploads over long distances. Which combination provides the BEST improvement?',
      options: [
        'Enable S3 Transfer Acceleration on the bucket and use multipart upload.',
        'Create the bucket in each Region and use S3 Cross-Region Replication.',
        'Place CloudFront in front of the bucket for uploads and use single PUT requests.',
        'Enable S3 Versioning and request a higher request-rate limit.',
      ],
      answer: ['A'],
      explanation: 'Transfer Acceleration routes uploads through the nearest CloudFront edge location onto the AWS backbone, and multipart upload parallelises the transfer and allows failed parts to be retried. A single PUT is limited to 5 GB, so an 8 GB object requires multipart upload anyway.',
    },
    {
      source: 'mock',
      domain: 4,
      stem: 'A company stores analytics data in S3 whose access patterns are unknown and change unpredictably over time. The team wants to minimise storage cost without operational effort and without retrieval fees. What should they use?',
      options: [
        'S3 Standard-IA with a 30-day lifecycle rule.',
        'S3 One Zone-IA for all objects.',
        'S3 Intelligent-Tiering.',
        'S3 Glacier Flexible Retrieval with Expedited retrievals.',
      ],
      answer: ['C'],
      explanation: 'S3 Intelligent-Tiering automatically moves objects between access tiers as patterns change and has no retrieval fees (it adds a small per-object monitoring fee). Standard-IA and One Zone-IA charge per-GB retrieval fees and assume infrequent access.',
    },
  ],
  keyFacts: [
    'Object size: 0 B to 5 TB. A single PUT is limited to 5 GB; AWS recommends multipart upload for objects of 100 MB or larger and requires it above 5 GB. Up to 10,000 parts per upload.',
    'Durability is 99.999999999% for all classes; availability: Standard 99.99%, Standard-IA / Intelligent-Tiering / Glacier Instant Retrieval 99.9%, One Zone-IA 99.5%.',
    'Minimum storage duration: Standard-IA and One Zone-IA 30 days; Glacier Instant and Flexible Retrieval 90 days; Glacier Deep Archive 180 days. IA classes bill a 128 KB minimum object size.',
    'Standard-IA and One Zone-IA add per-GB retrieval fees; Intelligent-Tiering has no retrieval fees but a monitoring fee, and objects under 128 KB are not auto-tiered.',
    'Request rates: at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second per partitioned prefix - spread keys across prefixes to scale.',
    'S3 offers strong read-after-write consistency for all PUTs and DELETEs. Replication needs versioning on both buckets and only replicates new objects unless you run S3 Batch Replication.',
    'Object Lock needs versioning. Compliance mode cannot be overridden by anyone (even root); governance mode can be bypassed with special permission. Legal hold has no retention period.',
    'Server-side encryption with S3-managed keys (SSE-S3) is applied by default to new objects. SSE-KMS adds auditable key use through CloudTrail but is subject to KMS request quotas.',
    'Transfer Acceleration uses CloudFront edge locations to speed long-distance transfers; Requester Pays makes the requester pay request and data-transfer costs.',
  ],
  traps: [
    { clue: 'Keys must stay on premises / customer holds the key', answer: 'SSE-C or client-side encryption (not SSE-S3 or SSE-KMS).' },
    { clue: 'Nobody, not even root, may delete', answer: 'Object Lock in compliance mode (or Glacier Vault Lock for vaults).' },
    { clue: 'Unknown or changing access pattern', answer: 'S3 Intelligent-Tiering.' },
    { clue: 'Browser JavaScript from another domain reads the bucket', answer: 'Configure CORS on the bucket.' },
    { clue: 'Temporary access for one user without IAM', answer: 'Pre-signed URL.' },
    { clue: 'HTTPS static site on a private bucket', answer: 'CloudFront with Origin Access Control and an ACM certificate (the S3 website endpoint is HTTP only).' },
    { clue: 'Replicate objects that already exist', answer: 'S3 Batch Replication (the replication rule alone covers only new objects).' },
  ],
  related: ['glacier', 'kms', 'cloudfront', 'iam', 'vpc', 'datasync', 'athena'],
  sources: [
    { title: 'What is Amazon S3? (User Guide)', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html' },
    { title: 'Understanding and managing Amazon S3 storage classes', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html' },
    { title: 'Managing the lifecycle of objects', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html' },
    { title: 'Replicating objects', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html' },
    { title: 'Locking objects with Object Lock', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html' },
    { title: 'Protecting data with encryption', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html' },
    { title: 'Optimizing Amazon S3 performance', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html' },
    { title: 'Uploading objects using multipart upload', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html' },
    { title: 'AWS CLI s3 command reference', url: 'https://docs.aws.amazon.com/cli/latest/reference/s3/index.html' },
    { title: 'Amazon S3 FAQs', url: 'https://aws.amazon.com/s3/faqs/' },
  ],
};
