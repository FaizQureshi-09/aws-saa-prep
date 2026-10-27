import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Athena. Schema: see s3.js. */
export default {
  tagline: 'Serverless interactive SQL queries directly on data in Amazon S3 - pay per data scanned.',
  intro: [
    'Amazon Athena is a serverless, interactive query service that lets you analyse data in S3 using standard SQL with no infrastructure to manage.',
    'You define tables over S3 data (typically in the AWS Glue Data Catalog) and query formats such as CSV, JSON, Parquet, ORC and Avro; results are written to an S3 location.',
    'You pay for the amount of data each query scans, so columnar formats (Parquet/ORC), compression and partitioning dramatically reduce cost and speed up queries.',
    'Athena queries AWS service logs (CloudTrail, ALB, VPC Flow Logs, S3 access logs) and can query other sources through federated query connectors (Lambda).',
    'Workgroups separate teams, enforce per-query data limits and track cost; integrates with QuickSight, Glue and Lake Formation.',
    'Use Athena for ad-hoc analysis; use Redshift for sustained, complex warehouse workloads and EMR for large custom big-data processing.',
  ],
  useCases: [
    { title: 'Ad-hoc analysis of a data lake', detail: 'Query S3 data on demand without loading it anywhere.' },
    { title: 'Log analysis', detail: 'Investigate ALB, CloudTrail and VPC Flow Logs with SQL.' },
    { title: 'Reporting backends', detail: 'QuickSight dashboards on Athena tables.' },
  ],
  importance: {
    points: [
      'Task 3.5 names Amazon Athena as an analytics service with appropriate use cases.',
      'Exam hint: "query S3 data with SQL, serverless, least overhead" = Athena; reduce cost by Parquet + partitioning + compression.',
    ],
  },
  cli: [
    { command: 'aws athena start-query-execution --query-string "SELECT status, count(*) FROM alb_logs GROUP BY status" --query-execution-context Database=logs --result-configuration OutputLocation=s3://athena-results/', description: 'Run a query.' },
    { command: 'aws athena get-query-execution --query-execution-id <id>', description: 'Check query state.' },
    { command: 'aws athena get-query-results --query-execution-id <id>', description: 'Fetch results.' },
    { command: 'aws athena create-work-group --name analytics --configuration BytesScannedCutoffPerQuery=10737418240', description: 'Create a workgroup with a per-query scan limit.' },
    { command: 'aws athena list-databases --catalog-name AwsDataCatalog', description: 'List databases in the Data Catalog.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'SQL: convert CSV to partitioned Parquet with CTAS',
        language: 'sql',
        code: `CREATE TABLE logs_parquet
WITH (
  format = 'PARQUET',
  external_location = 's3://analytics-bucket/logs_parquet/',
  partitioned_by = ARRAY['year', 'month']
) AS
SELECT *, year(ts) AS year, month(ts) AS month
FROM logs_csv;`,
      },
    ],
  },
  examples: [
    {
      title: 'Cut Athena cost by 90%',
      scenario: 'Daily queries scan large uncompressed CSV files and are slow and expensive.',
      steps: [
        'Convert data to Parquet (Glue job or Athena CTAS) so queries read only needed columns.',
        'Partition by date so queries read only relevant partitions.',
        'Compress the files and avoid tiny files.',
        'Use workgroup scan limits to cap runaway queries.',
      ],
    },
  ],
  diagram: {
    title: 'Athena over an S3 data lake',
    nodes: [
      ['user', 'Analyst / QuickSight', 'actor', 0, 1],
      ['athena', 'Amazon Athena (SQL)', 'analytics', 1, 1],
      ['glue', 'Glue Data Catalog', 'analytics', 1, 0],
      ['s3', 'S3 data (Parquet, partitioned)', 'storage', 2, 1],
      ['res', 'S3 query results', 'storage', 1, 2],
    ],
    edges: [
      ['user', 'athena', 'SQL query'],
      ['glue', 'athena', 'Table schemas'],
      ['athena', 's3', 'Scans data'],
      ['athena', 'res', 'Writes results'],
    ],
    steps: [
      'An analyst or BI tool submits a SQL query.',
      'Athena reads table definitions from the Glue Data Catalog and scans only the needed S3 data.',
      'Results are returned and also written to an S3 results location.',
    ],
  },
  questionTypes: [
    { pattern: 'SQL on S3, serverless', hint: 'Athena.' },
    { pattern: 'Reduce Athena cost/time', hint: 'Parquet/ORC, compression, partitioning, workgroup limits.' },
    { pattern: 'Athena vs Redshift vs EMR', hint: 'Ad-hoc serverless vs data warehouse vs big-data clusters.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company stores years of log files in Amazon S3 and wants analysts to run occasional SQL queries with no servers to manage and pay only per query. Which service should be used?',
      options: ['Amazon Athena', 'Amazon Redshift provisioned cluster', 'Amazon RDS', 'Amazon EMR cluster running 24x7'],
      answer: ['A'],
      explanation: 'Athena queries S3 data using SQL with no infrastructure and charges per data scanned.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Athena queries over large CSV files are slow and costly. Which TWO changes reduce cost and improve performance? (Select TWO.)',
      multi: true,
      options: ['Convert the data to a columnar format such as Parquet', 'Partition the data by commonly filtered columns such as date', 'Store the data in many small uncompressed files', 'Use a larger Athena instance size', 'Move the data to EBS'],
      answer: ['A', 'B'],
      explanation: 'Columnar formats and partitioning reduce the amount of data scanned, which lowers cost and speeds up queries. Athena has no instance sizes.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which service provides the schema metadata (tables and partitions) that Athena commonly uses to query S3 data?',
      options: ['AWS Glue Data Catalog', 'Amazon DynamoDB', 'AWS Config', 'Amazon Inspector'],
      answer: ['A'],
      explanation: 'The Glue Data Catalog is the central metadata repository used by Athena, EMR and Redshift Spectrum.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Which statement about Amazon Athena pricing is correct?',
      options: ['It is billed per hour for a running cluster', 'It is billed based on the amount of data scanned by each query', 'It is billed per user per month', 'It is billed only for the S3 storage of query results'],
      answer: ['B'],
      explanation: 'Athena is serverless and charges for the data each query scans, which is why compression, columnar formats and partitioning reduce cost.',
    },
  ],
  keyFacts: [
    'Serverless; billed per data scanned (so format, compression and partitioning are the main cost levers).',
    'Queries data in place in S3; supports CSV, JSON, Parquet, ORC and Avro.',
    'Uses the Glue Data Catalog for table metadata; results are written to an S3 location.',
    'Workgroups enforce per-query scan limits and separate teams\' cost and settings.',
    'Federated queries read other sources (RDS, DynamoDB, on-premises) through Lambda connectors.',
    'Access can be governed with Lake Formation permissions.',
  ],
  traps: [
    { clue: 'Ad-hoc SQL on S3, no servers', answer: 'Athena.' },
    { clue: 'Reduce data scanned', answer: 'Parquet + partitions + compression.' },
    { clue: 'Sustained complex BI workloads on structured warehouse', answer: 'Redshift.' },
  ],
  related: ['s3', 'glue', 'lake-formation', 'quicksight', 'redshift', 'emr'],
  sources: [
    { title: 'What is Amazon Athena?', url: 'https://docs.aws.amazon.com/athena/latest/ug/what-is.html' },
    { title: 'Top 10 performance tuning tips for Athena', url: 'https://aws.amazon.com/blogs/big-data/top-10-performance-tuning-tips-for-amazon-athena/' },
    { title: 'Partitioning data in Athena', url: 'https://docs.aws.amazon.com/athena/latest/ug/partitions.html' },
    { title: 'Using workgroups', url: 'https://docs.aws.amazon.com/athena/latest/ug/workgroups-manage-queries-control-costs.html' },
    { title: 'AWS CLI athena commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/athena/index.html' },
  ],
};
