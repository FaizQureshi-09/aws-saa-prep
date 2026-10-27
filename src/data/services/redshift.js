import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Redshift. Schema: see s3.js. */
export default {
  tagline: 'A fully managed, columnar, massively parallel data warehouse for fast SQL analytics on large datasets.',
  intro: [
    'Amazon Redshift is a petabyte-scale cloud data warehouse built for online analytical processing (OLAP): complex SQL queries and aggregations over large volumes of structured data.',
    'It uses columnar storage, data compression and massively parallel processing (MPP) across compute nodes coordinated by a leader node; it is based on PostgreSQL but is not meant for high-volume OLTP workloads (use RDS or Aurora).',
    'Deployment options: provisioned clusters (RA3 nodes separate compute from Redshift Managed Storage so you scale them independently) and Redshift Serverless, which scales automatically and charges for the capacity used.',
    'Redshift Spectrum queries data directly in Amazon S3 without loading it, and COPY loads data in parallel from S3, DynamoDB and other sources; federated queries reach operational databases such as RDS and Aurora.',
    'Resilience and protection: automated and manual snapshots stored in S3 (can be copied cross-Region), Multi-AZ deployments for RA3, encryption with KMS, VPC isolation, and audit logging.',
    'Concurrency Scaling adds temporary capacity for bursts of queries, data sharing lets clusters share live data without copying it, and Redshift integrates with Amazon Quick, Glue, Lake Formation and Kinesis.',
  ],
  useCases: [
    { title: 'Enterprise data warehouse and BI', detail: 'Central store for reporting with Amazon Quick or other BI tools.' },
    { title: 'Query a data lake', detail: 'Redshift Spectrum joins warehouse tables with exabytes of data in S3.' },
    { title: 'Near-real-time analytics', detail: 'Stream from Kinesis or MSK into Redshift using streaming ingestion.' },
    { title: 'Secure data sharing', detail: 'Share live datasets across clusters and accounts without copies.' },
  ],
  importance: {
    points: [
      'Domain 3 (high-performing databases and analytics): the answer to "complex analytical SQL over large data / data warehouse".',
      'The exam contrasts it with Athena (serverless ad-hoc queries on S3), RDS/Aurora (OLTP), DynamoDB (key-value) and EMR (custom big-data frameworks).',
    ],
  },
  cli: [
    { command: 'aws redshift create-cluster --cluster-identifier dwh --node-type ra3.xlplus --number-of-nodes 2 --master-username admin --master-user-password <password> --encrypted', description: 'Create an encrypted RA3 cluster.' },
    { command: 'aws redshift describe-clusters --cluster-identifier dwh', description: 'Check cluster status and endpoint.' },
    { command: 'aws redshift create-cluster-snapshot --cluster-identifier dwh --snapshot-identifier dwh-manual-1', description: 'Take a manual snapshot.' },
    { command: 'aws redshift enable-snapshot-copy --cluster-identifier dwh --destination-region us-west-2 --retention-period 7', description: 'Copy snapshots to another Region for DR.' },
    { command: 'aws redshift-data execute-statement --cluster-identifier dwh --database dev --db-user admin --sql "SELECT count(*) FROM sales"', description: 'Run SQL through the Redshift Data API (no driver needed).' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): run SQL with the Redshift Data API',
        language: 'python',
        code: `import boto3

rsd = boto3.client("redshift-data")
run = rsd.execute_statement(
    ClusterIdentifier="dwh",
    Database="dev",
    DbUser="admin",
    Sql="SELECT region, SUM(amount) FROM sales GROUP BY region",
)
print(run["Id"])`,
      },
      {
        title: 'SQL: load Parquet files from S3',
        language: 'sql',
        code: `COPY sales
FROM 's3://company-lake/curated/sales/'
IAM_ROLE 'arn:aws:iam::111122223333:role/RedshiftCopyRole'
FORMAT AS PARQUET;`,
      },
    ],
  },
  examples: [
    {
      title: 'Warehouse plus data lake',
      scenario: 'Analysts need fast dashboards on 5 years of sales plus occasional queries on 10 years of raw logs in S3.',
      steps: [
        'Load recent, frequently queried data into Redshift tables with COPY.',
        'Register the older data in the Glue Data Catalog and query it through Redshift Spectrum.',
        'Connect Amazon Quick to Redshift for dashboards.',
        'Copy snapshots to a second Region for disaster recovery.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon Redshift architecture',
    nodes: [
      ['s3', 'S3 data lake', 'storage', 0, 1],
      ['rs', 'Redshift (leader + compute nodes)', 'database', 1, 1],
      ['snap', 'Snapshots in S3 (cross-Region)', 'storage', 1, 0],
      ['spec', 'Redshift Spectrum (query S3 in place)', 'analytics', 1, 2],
      ['bi', 'Amazon Quick / SQL clients', 'analytics', 2, 1],
    ],
    edges: [
      ['s3', 'rs', 'COPY load'],
      ['rs', 'snap', 'Automated snapshots'],
      ['rs', 'spec', 'External tables'],
      ['rs', 'bi', 'SQL and BI queries'],
    ],
    steps: [
      'Data is loaded in parallel from S3 into columnar tables on the compute nodes.',
      'Spectrum lets the same queries read S3 data without loading it.',
      'Snapshots are stored in S3 and can be copied cross-Region; BI tools and SQL clients query the cluster.',
    ],
  },
  questionTypes: [
    { pattern: 'Data warehouse / complex analytical SQL on large data', hint: 'Amazon Redshift.' },
    { pattern: 'Query S3 data from the warehouse without loading it', hint: 'Redshift Spectrum.' },
    { pattern: 'Redshift vs Athena vs RDS', hint: 'Warehouse vs serverless S3 queries vs OLTP.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company needs to run complex analytical SQL queries and aggregations across petabytes of structured sales data, with dashboards for business users. Which service is MOST appropriate?',
      options: ['Amazon DynamoDB', 'Amazon Redshift', 'Amazon ElastiCache', 'Amazon RDS for MySQL'],
      answer: ['B'],
      explanation: 'Redshift is a columnar MPP data warehouse designed for large-scale analytics (OLAP), not OLTP.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A Redshift cluster must query historical data stored as Parquet in S3 without loading it into the cluster. Which feature enables this?',
      options: ['Redshift Concurrency Scaling', 'Redshift Spectrum', 'Redshift Enhanced VPC Routing only', 'AWS DataSync'],
      answer: ['B'],
      explanation: 'Spectrum runs SQL against S3 data in place using external tables defined in the Glue Data Catalog.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company needs to be able to restore its Redshift data warehouse in another Region if a Regional failure occurs. What is the simplest approach?',
      options: ['Move the cluster to a larger node type', 'Enable cross-Region snapshot copy', 'Write a nightly script that exports each table to CSV by hand', 'Add a read replica'],
      answer: ['B'],
      explanation: 'Redshift can automatically copy snapshots to another Region, from which a new cluster can be restored.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statements about Amazon Redshift are true? (Select TWO.)',
      multi: true,
      options: ['It is designed for high-volume single-row transactional updates.', 'It stores data in a columnar format and uses massively parallel processing.', 'RA3 nodes let you scale compute and managed storage independently.', 'It is a serverless key-value store with single-digit millisecond latency.', 'It cannot be encrypted.'],
      answer: ['B', 'C'],
      explanation: 'Redshift is a columnar MPP warehouse and RA3 separates compute from storage. It is not an OLTP or key-value database and supports KMS encryption.',
    },
  ],
  keyFacts: [
    'Columnar, compressed, MPP data warehouse for OLAP; not for OLTP.',
    'Options: provisioned (RA3 nodes, managed storage) or Redshift Serverless.',
    'Spectrum queries S3 in place; COPY loads from S3/DynamoDB; federated queries reach RDS/Aurora.',
    'Snapshots in S3 with cross-Region copy; Multi-AZ for RA3; KMS encryption.',
    'Concurrency Scaling for query bursts; data sharing across clusters/accounts.',
  ],
  traps: [
    { clue: 'Complex SQL analytics on huge structured datasets, BI', answer: 'Redshift.' },
    { clue: 'Ad-hoc SQL on S3 with no infrastructure', answer: 'Athena.' },
    { clue: 'Transactional workload with joins', answer: 'RDS or Aurora.' },
  ],
  related: ['athena', 's3', 'glue', 'quicksight', 'lake-formation', 'kinesis'],
  sources: [
    { title: 'What is Amazon Redshift?', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html' },
    { title: 'Amazon Redshift Spectrum', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c-using-spectrum.html' },
    { title: 'Amazon Redshift snapshots and backups', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html' },
    { title: 'AWS CLI redshift commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/redshift/index.html' },
  ],
};
