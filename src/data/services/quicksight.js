import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Quick (Quick Sight, formerly QuickSight). Schema: see s3.js. */
export default {
  tagline: 'Serverless business intelligence: build dashboards and visualisations on AWS and other data sources.',
  notice: {
    title: 'Naming: QuickSight is now Amazon Quick Sight',
    text: 'AWS documents that Amazon Quick evolved from Amazon QuickSight. The BI capability continues as Amazon Quick Sight inside Amazon Quick, and the existing QuickSight APIs, SDK names and IAM actions keep working unchanged. The current exam guide lists the service as Amazon Quick, and older questions still say QuickSight.',
  },
  intro: [
    'Amazon Quick Sight (formerly Amazon QuickSight) is the business intelligence feature of Amazon Quick: connect to data sources, build interactive dashboards and share or embed them in applications.',
    'It is serverless and scales to many readers; you do not provision or manage servers, and it pays by user or session rather than by hardware.',
    'Data sources include Amazon S3, Athena, Redshift, RDS, Aurora, OpenSearch, SaaS applications and on-premises databases; you can query directly or import data into SPICE, the in-memory calculation engine, for fast, scalable performance.',
    'Security features include row-level and column-level security, IAM and identity-provider integration (including IAM Identity Center and Active Directory), VPC connections to private data sources and encryption at rest.',
    'Authors build analyses and dashboards; readers consume them; embedded analytics place dashboards inside your own web applications and portals.',
    'Natural-language and AI features let users ask questions of their data and generate visuals or narratives; the exam focus is the BI role: visualise data from the analytics services.',
  ],
  useCases: [
    { title: 'Business dashboards', detail: 'Executives view sales and operations KPIs refreshed from Redshift or Athena.' },
    { title: 'Embedded analytics', detail: 'Provide customers with dashboards inside a SaaS product.' },
    { title: 'Self-service analysis of a data lake', detail: 'Analysts explore S3 data through Athena with Lake Formation permissions.' },
  ],
  importance: {
    points: [
      'Domain 3 analytics: the visualisation step after ingestion (Kinesis), transformation (Glue), storage (S3) and query (Athena/Redshift).',
      'Typical question: "which service creates interactive dashboards with minimal management?" The answer is Amazon Quick Sight (QuickSight).',
    ],
  },
  cli: [
    { command: 'aws quicksight list-dashboards --aws-account-id 111122223333', description: 'List dashboards (the CLI and APIs still use the quicksight namespace).' },
    { command: 'aws quicksight list-data-sets --aws-account-id 111122223333', description: 'List datasets.' },
    { command: 'aws quicksight create-ingestion --aws-account-id 111122223333 --data-set-id sales --ingestion-id refresh-1', description: 'Refresh a SPICE dataset.' },
    { command: 'aws quicksight describe-dashboard --aws-account-id 111122223333 --dashboard-id <id>', description: 'Show a dashboard\'s details and version.' },
    { command: 'aws quicksight generate-embed-url-for-registered-user --aws-account-id 111122223333 --user-arn <arn> --experience-configuration file://exp.json', description: 'Create a URL to embed a dashboard for a registered user.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): refresh a SPICE dataset',
        language: 'python',
        code: `import boto3, uuid

qs = boto3.client("quicksight")
resp = qs.create_ingestion(
    AwsAccountId="111122223333",
    DataSetId="sales",
    IngestionId=str(uuid.uuid4()),
)
print(resp["IngestionStatus"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Dashboard on a governed data lake',
      scenario: 'Analysts need self-service dashboards on S3 data, but each region manager may only see their own rows.',
      steps: [
        'Query curated Parquet data through Athena (Glue Data Catalog) or Redshift.',
        'Import into SPICE for speed, and schedule refreshes.',
        'Apply row-level security rules so each manager sees only their region.',
        'Publish the dashboard to readers or embed it in an internal portal.',
      ],
    },
  ],
  diagram: {
    title: 'Quick Sight dashboard pipeline',
    nodes: [
      ['src', 'S3, Athena, Redshift, RDS', 'storage', 0, 1],
      ['spice', 'SPICE in-memory engine', 'analytics', 1, 1],
      ['dash', 'Quick Sight dashboards', 'analytics', 2, 1],
      ['rls', 'Row-level security rules', 'security', 2, 0],
      ['users', 'Readers / embedded apps', 'actor', 3, 1],
    ],
    edges: [
      ['src', 'spice', 'Import or direct query'],
      ['spice', 'dash', 'Datasets'],
      ['rls', 'dash', 'Filters rows per user'],
      ['dash', 'users', 'Share or embed'],
    ],
    steps: [
      'Datasets connect to AWS and external sources; data can be imported into SPICE or queried directly.',
      'Authors build analyses and publish dashboards; row-level security restricts what each reader sees.',
      'Readers open dashboards in the console or embedded in applications.',
    ],
  },
  questionTypes: [
    { pattern: 'Interactive dashboards on AWS data', hint: 'Amazon Quick Sight (QuickSight).' },
    { pattern: 'Fast dashboard performance at scale', hint: 'SPICE in-memory engine.' },
    { pattern: 'Restrict rows per user in dashboards', hint: 'Row-level security.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company wants business users to build and share interactive dashboards on data in Amazon Athena and Amazon Redshift without managing any BI servers. Which service should be used?',
      options: ['Amazon EMR', 'Amazon Kinesis Data Streams', 'Amazon QuickSight (Amazon Quick Sight)', 'AWS Glue DataBrew'],
      answer: ['C'],
      explanation: 'QuickSight (now Quick Sight) is the serverless BI service for dashboards and visualisations on AWS data sources.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Dashboards on a large dataset load slowly when every query goes to the database. Which Quick Sight feature improves performance?',
      options: ['Route 53 latency routing', 'A larger EBS volume', 'SPICE', 'AWS Shield Advanced'],
      answer: ['C'],
      explanation: 'SPICE is the in-memory engine that stores imported data for fast, scalable queries.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Sales managers must see only the rows for their own region in a shared dashboard. Which feature should be used?',
      options: ['A VPC peering connection', 'Dashboard embedding', 'Row-level security', 'A bigger SPICE capacity'],
      answer: ['C'],
      explanation: 'Row-level security filters the data a user sees based on rules tied to the user or group.',
    },
  ],
  keyFacts: [
    'Serverless BI; Quick Sight was formerly QuickSight, with unchanged API and CLI names.',
    'SPICE = in-memory engine; data can alternatively be queried directly.',
    'Sources: S3, Athena, Redshift, RDS/Aurora, OpenSearch, SaaS, on-premises via VPC.',
    'Security: row-level and column-level security, IAM and SSO integration, encryption.',
    'Embedded analytics for customer-facing applications.',
  ],
  traps: [
    { clue: 'BI dashboards, visualisations', answer: 'Amazon Quick Sight (QuickSight).' },
    { clue: 'SQL queries on S3', answer: 'Athena (data source for Quick Sight).' },
    { clue: 'Data warehouse storage', answer: 'Redshift.' },
  ],
  related: ['athena', 'redshift', 'glue', 'lake-formation', 's3', 'opensearch'],
  sources: [
    { title: 'What is Amazon Quick?', url: 'https://docs.aws.amazon.com/quick/latest/userguide/what-is.html' },
    { title: 'Importing data into SPICE', url: 'https://docs.aws.amazon.com/quick/latest/userguide/spice.html' },
    { title: 'Row-level security', url: 'https://docs.aws.amazon.com/quick/latest/userguide/row-level-security.html' },
    { title: 'AWS CLI quicksight commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/quicksight/index.html' },
  ],
};
