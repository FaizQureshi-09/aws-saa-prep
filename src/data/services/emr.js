import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon EMR. Schema: see s3.js. */
export default {
  tagline: 'Managed big data platform for running Spark, Hadoop, Hive, Presto and other open-source frameworks at scale.',
  intro: [
    'Amazon EMR (Elastic MapReduce) runs open-source big data frameworks such as Apache Spark, Hadoop, Hive, Presto/Trino, HBase and Flink to process and analyse very large datasets.',
    'Deployment options: EMR on EC2 (clusters you size and tune), EMR on EKS (jobs on a Kubernetes cluster) and EMR Serverless (no clusters to manage).',
    'A cluster has a primary node (coordinates the cluster), core nodes (run tasks and store data in HDFS) and optional task nodes (compute only); task nodes are ideal for Spot Instances because losing them loses no data.',
    'EMRFS lets clusters read and write data directly in Amazon S3, so storage is decoupled from compute and clusters can be transient: launch, process, write results to S3, terminate to save cost.',
    'It supports instance fleets, managed scaling, Spot and Reserved capacity, Kerberos and KMS encryption, and integrates with Glue Data Catalog, Lake Formation and Step Functions.',
    'Choose EMR when you need custom frameworks, cluster-level control or lift-and-shift of existing Hadoop/Spark jobs; choose Glue for serverless ETL and Athena for ad-hoc SQL.',
  ],
  useCases: [
    { title: 'Large-scale ETL and batch analytics', detail: 'Spark jobs transforming terabytes of logs or clickstream data in S3.' },
    { title: 'Migrate on-premises Hadoop/Spark', detail: 'Lift existing jobs with little change and decouple storage into S3.' },
    { title: 'Machine learning data preparation', detail: 'Feature engineering with Spark before training in SageMaker.' },
  ],
  importance: {
    points: [
      'Domain 3 (data ingestion and transformation) lists EMR with Glue and Athena; questions ask which is most suitable for a given big data requirement.',
      'Cost tips tested: transient clusters, S3 as storage, Spot for task nodes.',
    ],
  },
  cli: [
    { command: 'aws emr create-cluster --name spark-etl --release-label emr-7.5.0 --applications Name=Spark --instance-type m5.xlarge --instance-count 3 --use-default-roles --auto-terminate', description: 'Create a transient Spark cluster that terminates when steps finish.' },
    { command: 'aws emr add-steps --cluster-id j-ABC123 --steps Type=Spark,Name=etl,ActionOnFailure=CONTINUE,Args=[--deploy-mode,cluster,s3://scripts/etl.py]', description: 'Submit a Spark job as a step.' },
    { command: 'aws emr list-clusters --active', description: 'List running clusters.' },
    { command: 'aws emr describe-cluster --cluster-id j-ABC123', description: 'Check cluster state and configuration.' },
    { command: 'aws emr terminate-clusters --cluster-ids j-ABC123', description: 'Shut down a cluster.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): launch a transient cluster',
        language: 'python',
        code: `import boto3

emr = boto3.client("emr")
resp = emr.run_job_flow(
    Name="spark-etl",
    ReleaseLabel="emr-7.5.0",
    Applications=[{"Name": "Spark"}],
    Instances={
        "InstanceGroups": [
            {"InstanceRole": "MASTER", "InstanceType": "m5.xlarge", "InstanceCount": 1},
            {"InstanceRole": "CORE", "InstanceType": "m5.xlarge", "InstanceCount": 2},
        ],
        "KeepJobFlowAliveWhenNoSteps": False,
    },
    JobFlowRole="EMR_EC2_DefaultRole",
    ServiceRole="EMR_DefaultRole",
)
print(resp["JobFlowId"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Nightly transient Spark cluster on Spot',
      scenario: 'A nightly job processes 20 TB of logs in S3 and must be as cheap as possible.',
      steps: [
        'EventBridge or Step Functions starts a transient EMR cluster each night.',
        'Use on-demand core nodes and Spot task nodes; data stays in S3 via EMRFS.',
        'Write results to S3 and terminate the cluster automatically.',
      ],
    },
  ],
  diagram: {
    title: 'Transient EMR cluster pattern',
    nodes: [
      ['sf', 'Step Functions / EventBridge schedule', 'integration', 1, 0],
      ['s3', 'S3 input data (EMRFS)', 'storage', 0, 1],
      ['emr', 'EMR cluster (primary, core, task)', 'analytics', 1, 1],
      ['spot', 'Task nodes on Spot', 'compute', 1, 2],
      ['out', 'S3 results / Athena / Redshift', 'storage', 2, 1],
    ],
    edges: [
      ['sf', 'emr', 'Launches cluster'],
      ['s3', 'emr', 'Reads data'],
      ['emr', 'spot', 'Scales cheaply'],
      ['emr', 'out', 'Writes results'],
    ],
    steps: [
      'A schedule launches a transient cluster and submits Spark steps.',
      'The job reads input from S3, using Spot task nodes for extra low-cost compute.',
      'Results are written to S3 and the cluster terminates to stop charges.',
    ],
  },
  questionTypes: [
    { pattern: 'Big data processing with Spark/Hadoop', hint: 'Amazon EMR.' },
    { pattern: 'Lowest-cost EMR design', hint: 'Transient cluster, S3 storage, Spot task nodes.' },
    { pattern: 'EMR vs Glue vs Athena', hint: 'Custom frameworks and control vs serverless ETL vs serverless SQL.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company wants to migrate its on-premises Hadoop and Spark jobs to AWS with minimal changes. Which service should it use?',
      options: ['Amazon SQS', 'Amazon EMR', 'Amazon Athena', 'AWS Lambda'],
      answer: ['B'],
      explanation: 'EMR runs the same open-source frameworks as managed clusters, which suits lift-and-shift of Hadoop and Spark.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A nightly EMR job can tolerate node interruptions and must be as cheap as possible. Which design is MOST cost-effective? (Select TWO.)',
      multi: true,
      options: ['Keep a large cluster running 24x7 with HDFS only', 'Use only On-Demand primary nodes for every role', 'Store data in S3 and terminate the cluster when the job finishes', 'Use Spot Instances for task nodes', 'Buy three-year Reserved Instances for a nightly job'],
      answer: ['C', 'D'],
      explanation: 'Task nodes hold no data so Spot is safe, and keeping data in S3 lets you terminate the cluster after each run.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which EMR node type is responsible for coordinating the cluster and resource management?',
      options: ['Task node', 'Primary node', 'Core node', 'Edge node'],
      answer: ['B'],
      explanation: 'The primary node manages the cluster; core nodes run tasks and store HDFS data; task nodes are compute-only.',
    },
  ],
  keyFacts: [
    'EMR runs Spark, Hadoop, Hive, Presto/Trino, HBase, Flink on EC2, EKS or Serverless.',
    'Node types: primary (coordinates), core (tasks + HDFS), task (compute only, ideal for Spot).',
    'EMRFS reads and writes S3, decoupling storage from compute and enabling transient clusters.',
    'Integrates with Glue Data Catalog and Lake Formation; encrypt with KMS.',
    'Prefer Glue for serverless ETL, Athena for ad-hoc SQL; EMR when you need control or specific frameworks.',
  ],
  traps: [
    { clue: 'Hadoop/Spark with custom frameworks or lift-and-shift', answer: 'EMR.' },
    { clue: 'Serverless ETL, no clusters', answer: 'Glue.' },
    { clue: 'Ad-hoc SQL on S3 files', answer: 'Athena.' },
  ],
  related: ['glue', 'athena', 's3', 'redshift', 'lake-formation', 'kinesis'],
  sources: [
    { title: 'What is Amazon EMR?', url: 'https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html' },
    { title: 'Understand cluster node types in Amazon EMR', url: 'https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-master-core-task-nodes.html' },
    { title: 'Amazon EMR on EKS', url: 'https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/emr-eks.html' },
    { title: 'AWS CLI emr commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/emr/index.html' },
  ],
};
