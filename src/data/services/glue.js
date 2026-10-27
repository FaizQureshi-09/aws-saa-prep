import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Glue. Schema: see s3.js. */
export default {
  tagline: 'Serverless data integration: ETL jobs plus the central Data Catalog for data lakes.',
  intro: [
    'AWS Glue is a serverless data integration service for discovering, preparing, moving and transforming data for analytics and machine learning.',
    'The Glue Data Catalog is a central metadata repository (databases, tables, partitions) used by Athena, EMR, Redshift Spectrum and Lake Formation.',
    'Crawlers scan data stores (S3, JDBC databases) to infer schemas and populate the catalog automatically.',
    'ETL jobs run Apache Spark (or Python shell/Ray) on serverless capacity measured in DPUs; job bookmarks track processed data; triggers and workflows orchestrate multi-step pipelines.',
    'A classic use is transforming data between formats, for example converting CSV to partitioned Parquet for cheaper, faster Athena queries.',
    'Glue Studio provides visual job authoring and Glue DataBrew offers no-code data preparation.',
  ],
  useCases: [
    { title: 'Build and maintain a data lake catalog', detail: 'Crawlers keep table definitions current for Athena and Redshift Spectrum.' },
    { title: 'Format conversion and cleansing', detail: 'CSV/JSON to Parquet, deduplicate, join and enrich.' },
    { title: 'Scheduled and event-driven ETL', detail: 'Triggers/workflows or Step Functions/EventBridge start jobs.' },
  ],
  importance: {
    points: [
      'Task 3.5 names AWS Glue as the data transformation service and lists transforming data between formats (.csv to .parquet).',
      'Exam hint: serverless ETL = Glue; ad-hoc SQL = Athena; custom cluster big data = EMR.',
    ],
  },
  cli: [
    { command: 'aws glue create-crawler --name sales-crawler --role <role-arn> --database-name sales --targets \'{"S3Targets":[{"Path":"s3://lake/sales/"}]}\'', description: 'Create a crawler for an S3 prefix.' },
    { command: 'aws glue start-crawler --name sales-crawler', description: 'Run the crawler.' },
    { command: 'aws glue get-tables --database-name sales', description: 'List catalog tables.' },
    { command: 'aws glue create-job --name csv-to-parquet --role <role-arn> --command Name=glueetl,ScriptLocation=s3://scripts/etl.py --glue-version 4.0 --number-of-workers 5 --worker-type G.1X', description: 'Create a Spark ETL job.' },
    { command: 'aws glue start-job-run --job-name csv-to-parquet', description: 'Run the job.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'PySpark (Glue job): CSV to Parquet',
        language: 'python',
        code: `from awsglue.context import GlueContext
from pyspark.context import SparkContext

glue = GlueContext(SparkContext.getOrCreate())
frame = glue.create_dynamic_frame.from_catalog(database="sales", table_name="orders_csv")
glue.write_dynamic_frame.from_options(
    frame=frame,
    connection_type="s3",
    connection_options={"path": "s3://lake/orders_parquet/", "partitionKeys": ["year", "month"]},
    format="parquet",
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Prepare data for Athena',
      scenario: 'Raw CSV files land in S3 daily and must be queryable quickly and cheaply.',
      steps: [
        'A crawler discovers the raw CSV schema into the Data Catalog.',
        'A Glue job converts the data to partitioned, compressed Parquet in a curated prefix.',
        'A second crawler (or job) registers the curated table.',
        'Analysts query the curated table in Athena.',
      ],
    },
  ],
  diagram: {
    title: 'Glue ETL and Data Catalog',
    nodes: [
      ['raw', 'S3 raw data (CSV)', 'storage', 0, 1],
      ['crawler', 'Glue crawler', 'analytics', 1, 0],
      ['job', 'Glue ETL job (Spark)', 'analytics', 1, 1],
      ['cur', 'S3 curated (Parquet)', 'storage', 2, 1],
      ['cat', 'Data Catalog', 'analytics', 2, 0],
    ],
    edges: [
      ['raw', 'job', 'Read'],
      ['crawler', 'cat', 'Registers schema'],
      ['job', 'cur', 'Write Parquet'],
      ['crawler', 'job', 'Table metadata'],
    ],
    steps: [
      'Crawlers infer schemas and register tables in the Data Catalog.',
      'The ETL job reads raw data, transforms it (format, columns, joins) and writes Parquet to the curated zone.',
      'Athena, Redshift Spectrum and EMR use the catalog to query the curated data.',
    ],
  },
  questionTypes: [
    { pattern: 'Serverless ETL / transform formats', hint: 'AWS Glue.' },
    { pattern: 'Discover schemas automatically', hint: 'Glue crawler + Data Catalog.' },
    { pattern: 'Glue vs EMR', hint: 'Glue serverless and managed; EMR for custom frameworks and cluster control.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company receives CSV files in S3 and needs a serverless way to convert them to Parquet and keep a searchable catalog of schemas. Which service meets both needs?',
      options: ['AWS Glue', 'Amazon EC2 running a cron job', 'Amazon SQS', 'AWS Config'],
      answer: ['A'],
      explanation: 'Glue jobs perform serverless ETL (including format conversion) and the Data Catalog stores schema metadata.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'New partitions appear in an S3 data lake every day and must be registered so Athena can query them. What is the LEAST operational effort approach?',
      options: ['Run a Glue crawler on a schedule to update the Data Catalog', 'Manually run ALTER TABLE statements daily', 'Rewrite the data to EBS', 'Use a cron job on EC2 to run SQL'],
      answer: ['A'],
      explanation: 'Crawlers detect new partitions and schema changes automatically and update the catalog.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statements about the AWS Glue Data Catalog are true? (Select TWO.)',
      multi: true,
      options: ['It is a central metadata repository for tables and partitions.', 'It is used by Athena, EMR and Redshift Spectrum.', 'It stores the actual data files.', 'It must be deployed on EC2.', 'It replaces S3.'],
      answer: ['A', 'B'],
      explanation: 'The Data Catalog stores metadata only and is shared by several analytics services; the data remains in S3 or other stores.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A daily Glue ETL job reads a growing S3 prefix and should process only the files that arrived since its last run. Which feature helps?',
      options: ['Glue crawler classifiers', 'Glue job bookmarks', 'A larger number of DPUs', 'Data Catalog tags'],
      answer: ['B'],
      explanation: 'Job bookmarks track already processed data so subsequent runs handle only new data.',
    },
  ],
  keyFacts: [
    'Glue is serverless; ETL jobs scale in DPUs; job bookmarks avoid reprocessing data.',
    'Data Catalog = metadata (databases, tables, partitions); data stays in S3/JDBC sources.',
    'Crawlers infer schema and detect partitions; classifiers recognise formats.',
    'Common pattern: CSV/JSON raw zone to Parquet curated zone for Athena.',
    'Glue integrates with Lake Formation for fine-grained permissions on the catalog and data.',
    'Jobs can be started by schedules, triggers, workflows or EventBridge; Glue DataBrew offers no-code data preparation.',
  ],
  traps: [
    { clue: 'Serverless ETL', answer: 'Glue.' },
    { clue: 'Convert CSV to Parquet', answer: 'Glue job (or Athena CTAS).' },
    { clue: 'Shared schema metadata across analytics services', answer: 'Glue Data Catalog.' },
  ],
  related: ['athena', 's3', 'lake-formation', 'redshift', 'emr', 'step-functions'],
  sources: [
    { title: 'What is AWS Glue?', url: 'https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html' },
    { title: 'AWS Glue Data Catalog', url: 'https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html' },
    { title: 'Using crawlers to populate the Data Catalog', url: 'https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html' },
    { title: 'AWS CLI glue commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/glue/index.html' },
  ],
};
