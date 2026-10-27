import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Lake Formation. Schema: see s3.js. */
export default {
  tagline: 'Build, secure and govern a data lake with fine-grained, centrally managed permissions.',
  intro: [
    'AWS Lake Formation helps you centrally govern, secure and share data for analytics and machine learning, with fine-grained access control over data in Amazon S3 and its metadata in the AWS Glue Data Catalog.',
    'It adds its own permission model on top of IAM: you grant or revoke permissions on databases, tables, columns, rows and cells, much like a relational database, instead of writing many S3 bucket and IAM policies.',
    'Permissions are enforced across integrated services such as Amazon Athena, Redshift Spectrum, Amazon EMR, AWS Glue and Amazon Quick, so a user sees the same governed view whichever tool they use.',
    'LF-Tags (tag-based access control) scale governance: tag databases, tables and columns, and grant permissions on tag expressions rather than on thousands of individual resources.',
    'Data filters give row-level and cell-level security to protect sensitive data such as PII, and cross-account sharing lets you share catalog resources with other accounts or organizations.',
    'Lake Formation can ingest data from databases with blueprints, uses Glue crawlers to catalog it, and logs data access through AWS CloudTrail for auditing.',
  ],
  useCases: [
    { title: 'Central data governance', detail: 'One place to define who can read which tables, columns and rows.' },
    { title: 'Share data across accounts', detail: 'Producer accounts share governed tables with consumer accounts without copying data.' },
    { title: 'Protect sensitive columns', detail: 'Hide PII columns from analysts while allowing aggregate analysis.' },
  ],
  importance: {
    points: [
      'The Domain 1 and Domain 3 service for "fine-grained access control to data lake data".',
      'Know the split of roles: S3 stores, Glue catalogs and transforms, Athena/Redshift/EMR query, Lake Formation governs.',
    ],
  },
  cli: [
    { command: 'aws lakeformation register-resource --resource-arn arn:aws:s3:::company-lake --use-service-linked-role', description: 'Register an S3 location with Lake Formation.' },
    { command: 'aws lakeformation grant-permissions --principal DataLakePrincipalIdentifier=arn:aws:iam::111122223333:role/Analyst --permissions SELECT --resource \'{"Table":{"DatabaseName":"sales","Name":"orders"}}\'', description: 'Grant SELECT on a table.' },
    { command: 'aws lakeformation create-lf-tag --tag-key Confidentiality --tag-values public confidential', description: 'Create an LF-Tag.' },
    { command: 'aws lakeformation add-lf-tags-to-resource --resource \'{"Table":{"DatabaseName":"sales","Name":"orders"}}\' --lf-tags TagKey=Confidentiality,TagValues=confidential', description: 'Attach the tag to a table.' },
    { command: 'aws lakeformation list-permissions', description: 'Review granted permissions.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): grant column-level SELECT',
        language: 'python',
        code: `import boto3

lf = boto3.client("lakeformation")
lf.grant_permissions(
    Principal={"DataLakePrincipalIdentifier": "arn:aws:iam::111122223333:role/Analyst"},
    Resource={
        "TableWithColumns": {
            "DatabaseName": "sales",
            "Name": "orders",
            "ColumnNames": ["order_id", "region", "amount"],
        }
    },
    Permissions=["SELECT"],
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Let analysts query a lake but not see PII',
      scenario: 'A data lake table contains customer emails that only the privacy team may read.',
      steps: [
        'Register the S3 location and catalog the table with Glue.',
        'Grant analysts SELECT on all columns except email (column-level permissions).',
        'Use Athena to query; Lake Formation enforces the column filter automatically.',
        'Audit access through CloudTrail.',
      ],
    },
  ],
  diagram: {
    title: 'Lake Formation governance',
    nodes: [
      ['s3', 'S3 data lake', 'storage', 0, 1],
      ['cat', 'Glue Data Catalog', 'analytics', 1, 1],
      ['lf', 'Lake Formation permissions', 'security', 2, 1],
      ['tags', 'LF-Tags and data filters', 'security', 2, 0],
      ['eng', 'Athena / Redshift Spectrum / EMR', 'analytics', 3, 1],
    ],
    edges: [
      ['cat', 's3', 'Describes data'],
      ['cat', 'lf', 'Secured by'],
      ['tags', 'lf', 'Column and row rules'],
      ['lf', 'eng', 'Scoped access'],
    ],
    steps: [
      'The Glue Data Catalog describes the S3 data; Lake Formation registers the location.',
      'Administrators grant permissions with LF-Tags and filters at database, table, column and row level.',
      'Integrated engines request access and Lake Formation vends only the permitted data.',
    ],
  },
  questionTypes: [
    { pattern: 'Fine-grained (column/row) access to a data lake', hint: 'Lake Formation.' },
    { pattern: 'Share governed tables across accounts', hint: 'Lake Formation cross-account sharing.' },
    { pattern: 'Scale permissions across thousands of tables', hint: 'LF-Tags (tag-based access control).' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company stores data in an S3 data lake queried through Athena and needs to restrict specific analysts to certain columns and rows without writing complex bucket policies. Which service should be used?',
      options: ['AWS KMS', 'AWS Lake Formation', 'Amazon Macie', 'AWS WAF'],
      answer: ['B'],
      explanation: 'Lake Formation provides centrally managed column, row and cell-level permissions enforced across Athena, Redshift Spectrum, EMR and Glue.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A data lake has thousands of tables and the administrator wants to manage permissions with a small number of rules based on data classification. Which Lake Formation feature supports this?',
      options: ['CloudFront signed URLs', 'Individual S3 object ACLs', 'VPC security groups', 'LF-Tags (tag-based access control)'],
      answer: ['D'],
      explanation: 'LF-Tags let you grant permissions on tag expressions, scaling governance across many resources.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statement about AWS Lake Formation is true?',
      options: ['It stores the data itself instead of Amazon S3', 'It manages permissions on data catalog resources and S3 data used by analytics services', 'It is a content delivery network', 'It is a streaming ingestion service'],
      answer: ['B'],
      explanation: 'The data stays in S3 (and the metadata in the Glue Data Catalog); Lake Formation governs access to them.',
    },
  ],
  keyFacts: [
    'Lake Formation adds a database-style grant/revoke model on top of IAM for S3 data and the Glue Data Catalog.',
    'Enforced in Athena, Redshift Spectrum, EMR, Glue and Amazon Quick.',
    'LF-Tags provide tag-based access control; data filters give row and cell-level security.',
    'Supports cross-account sharing of catalog resources; access is logged in CloudTrail.',
    'It does not store data (S3 does) and does not run queries (Athena/Redshift/EMR do).',
  ],
  traps: [
    { clue: 'Column or row-level permissions on a data lake', answer: 'Lake Formation.' },
    { clue: 'Discover PII in S3', answer: 'Macie.' },
    { clue: 'Schema metadata and ETL', answer: 'Glue.' },
  ],
  related: ['glue', 'athena', 's3', 'redshift', 'emr', 'iam'],
  sources: [
    { title: 'What is AWS Lake Formation?', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html' },
    { title: 'Lake Formation tag-based access control', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/tag-based-access-control.html' },
    { title: 'Data filtering and cell-level security', url: 'https://docs.aws.amazon.com/lake-formation/latest/dg/data-filtering.html' },
    { title: 'AWS CLI lakeformation commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/lakeformation/index.html' },
  ],
};
