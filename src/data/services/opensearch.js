import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon OpenSearch Service. Schema: see s3.js. */
export default {
  tagline: 'Managed search and log analytics engine (OpenSearch/Elasticsearch) with dashboards.',
  intro: [
    'Amazon OpenSearch Service is a managed service that makes it easy to deploy, operate and scale OpenSearch clusters; a "domain" is synonymous with a cluster, and each EC2 instance in it is a node.',
    'OpenSearch is an open-source search and analytics engine used for full-text search, log analytics, real-time application monitoring and clickstream analysis; the service also supports legacy Elasticsearch OSS versions up to 7.10.',
    'AWS automatically detects and replaces failed nodes, supports Multi-AZ placement across two or three Availability Zones, dedicated master nodes for cluster management, and automated snapshots.',
    'Cost-effective UltraWarm and cold storage keep older, read-only data on S3-backed tiers, while hot data stays on fast instance storage.',
    'Data arrives from sources such as Amazon Data Firehose, Kinesis Data Streams, CloudWatch Logs, DynamoDB and S3; OpenSearch Dashboards visualises it.',
    'Security includes IAM, VPC placement, encryption at rest and node-to-node, fine-grained (index, document, field level) access control, and Cognito, SAML or basic authentication for Dashboards; an OpenSearch Serverless option removes cluster sizing.',
  ],
  useCases: [
    { title: 'Log and observability analytics', detail: 'Search application and infrastructure logs streamed from CloudWatch Logs or Firehose.' },
    { title: 'Full-text search for applications', detail: 'Product catalogue or site search with relevance ranking and filters.' },
    { title: 'Security analytics (SIEM)', detail: 'Correlate CloudTrail, VPC Flow and WAF logs with dashboards and alerts.' },
  ],
  importance: {
    points: [
      'Appears in Domain 3 analytics and in log-analytics designs; the answer for "search" or "near-real-time log analytics with dashboards".',
      'Contrast: OpenSearch for search and logs, Athena for SQL on S3, Redshift for warehousing, DynamoDB for key-value.',
    ],
  },
  cli: [
    { command: 'aws opensearch create-domain --domain-name logs --engine-version OpenSearch_2.19 --cluster-config InstanceType=r6g.large.search,InstanceCount=3,ZoneAwarenessEnabled=true --ebs-options EBSEnabled=true,VolumeType=gp3,VolumeSize=100', description: 'Create a three-node Multi-AZ domain.' },
    { command: 'aws opensearch describe-domain --domain-name logs', description: 'Check domain status and endpoint.' },
    { command: 'aws opensearch update-domain-config --domain-name logs --cluster-config InstanceCount=4', description: 'Scale the number of data nodes.' },
    { command: 'aws opensearch list-domain-names', description: 'List domains.' },
    { command: 'aws opensearch delete-domain --domain-name logs', description: 'Delete the domain.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): describe a domain',
        language: 'python',
        code: `import boto3

os_client = boto3.client("opensearch")
status = os_client.describe_domain(DomainName="logs")["DomainStatus"]
print(status["Endpoint"], status["EngineVersion"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Central application log search',
      scenario: 'Operations needs searchable, visual dashboards for logs from hundreds of instances, kept for a year at low cost.',
      steps: [
        'Stream logs with CloudWatch Logs subscription or Amazon Data Firehose into an OpenSearch domain.',
        'Build dashboards and alerts in OpenSearch Dashboards.',
        'Move indices older than a few weeks to UltraWarm and later cold storage.',
        'Restrict access with fine-grained access control and a VPC endpoint.',
      ],
    },
  ],
  diagram: {
    title: 'OpenSearch log analytics pipeline',
    nodes: [
      ['src', 'App logs (CloudWatch Logs / Firehose)', 'integration', 0, 1],
      ['dom', 'OpenSearch domain (data and master nodes)', 'analytics', 1, 1],
      ['uw', 'UltraWarm / cold storage', 'storage', 1, 2],
      ['dash', 'OpenSearch Dashboards', 'analytics', 2, 1],
      ['auth', 'Cognito / SAML / fine-grained access', 'security', 2, 0],
    ],
    edges: [
      ['src', 'dom', 'Stream logs'],
      ['dom', 'uw', 'Age out old data'],
      ['dom', 'dash', 'Search and visualise'],
      ['auth', 'dash', 'Authenticates users'],
    ],
    steps: [
      'Logs and events are streamed into an OpenSearch domain and indexed.',
      'Older indices move to UltraWarm and cold storage to reduce cost.',
      'Users search and build dashboards, authenticated through Cognito, SAML or IAM.',
    ],
  },
  questionTypes: [
    { pattern: 'Full-text search or log analytics with dashboards', hint: 'Amazon OpenSearch Service.' },
    { pattern: 'Keep old log data cheap but searchable', hint: 'UltraWarm / cold storage.' },
    { pattern: 'OpenSearch vs Athena vs Redshift', hint: 'Search and logs vs SQL on S3 vs warehouse.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company wants near-real-time search and dashboards over application logs streamed from CloudWatch Logs, with minimal infrastructure management. Which service should be used?',
      options: ['Amazon OpenSearch Service', 'Amazon RDS for PostgreSQL', 'Amazon ElastiCache for Redis', 'AWS Backup'],
      answer: ['A'],
      explanation: 'OpenSearch Service is built for log analytics and search with OpenSearch Dashboards.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Log indices older than 30 days are rarely searched but must remain queryable for a year at the lowest cost. Which OpenSearch Service feature helps?',
      options: ['Enabling Multi-AZ only', 'Adding dedicated master nodes', 'UltraWarm and cold storage', 'Switching to a smaller VPC'],
      answer: ['C'],
      explanation: 'UltraWarm and cold storage keep older read-only data on lower-cost S3-backed tiers.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An OpenSearch domain must survive the loss of an Availability Zone. What should be configured?',
      options: ['Multi-AZ placement of nodes across two or three AZs', 'A single large node', 'An S3 lifecycle rule', 'A Route 53 health check on the console'],
      answer: ['A'],
      explanation: 'Zone awareness spreads nodes and shard replicas across AZs so the domain tolerates an AZ failure.',
    },
  ],
  keyFacts: [
    'A domain is an OpenSearch cluster; managed service replaces failed nodes automatically.',
    'Multi-AZ (2 or 3 AZs), dedicated master nodes, automated snapshots for resilience.',
    'UltraWarm and cold storage reduce cost for older data.',
    'Ingestion from Firehose, Kinesis, CloudWatch Logs, DynamoDB and S3; OpenSearch Dashboards for visualisation.',
    'Security: IAM, VPC, encryption, fine-grained access control, Cognito/SAML for Dashboards; Serverless option available.',
  ],
  traps: [
    { clue: 'Full-text search, log analytics, dashboards', answer: 'OpenSearch Service.' },
    { clue: 'SQL queries over S3 files', answer: 'Athena.' },
    { clue: 'Key-value lookups at massive scale', answer: 'DynamoDB.' },
  ],
  related: ['cloudwatch', 'kinesis', 's3', 'athena', 'redshift', 'cognito'],
  sources: [
    { title: 'What is Amazon OpenSearch Service?', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html' },
    { title: 'UltraWarm storage for Amazon OpenSearch Service', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ultrawarm.html' },
    { title: 'Configuring a multi-AZ domain', url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html' },
    { title: 'AWS CLI opensearch commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/opensearch/index.html' },
  ],
};
