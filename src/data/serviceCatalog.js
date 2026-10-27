/**
 * Catalog of every service / topic that gets its own study page.
 * One entry per page; the long-form content for each id lives in
 * `src/data/services/<id>.js` and is loaded on demand.
 *
 * - `hours` is a RECOMMENDED study estimate for this site's 30-day plan
 *   (reading + a short hands-on lab + the page's practice questions). It is
 *   an editorial estimate, not an AWS figure.
 * - `tier` is an editorial priority (see `tiers` in categoriesData.js).
 * - `domains` lists the exam domains (1-4) the service is relevant to,
 *   cross-checked against the task statements in domainsData.js.
 *
 * @typedef {object} ServiceMeta
 * @property {string} id - url slug and content file name
 * @property {string} name - display name
 * @property {string} category - id from categoriesData
 * @property {'critical'|'high'|'medium'|'low'} tier - study priority
 * @property {number} hours - recommended study hours
 * @property {number[]} domains - relevant exam domains
 * @property {string} summary - one-line description for cards
 */

/** @type {ServiceMeta[]} */
export const serviceCatalog = [
  // ── Foundations ────────────────────────────────────────────────
  { id: 'global-infrastructure', name: 'AWS Global Infrastructure & Shared Responsibility', category: 'foundations', tier: 'high', hours: 1.5, domains: [1, 2], summary: 'Regions, Availability Zones, edge locations, Local Zones and who secures what.' },
  { id: 'well-architected', name: 'AWS Well-Architected Framework', category: 'foundations', tier: 'high', hours: 2, domains: [1, 2, 3, 4], summary: 'The six pillars and design principles the whole exam is built on.' },
  { id: 'dr-strategies', name: 'Disaster Recovery Strategies (RPO / RTO)', category: 'foundations', tier: 'high', hours: 1.5, domains: [2], summary: 'Backup & restore, pilot light, warm standby and multi-site active-active.' },

  // ── Security, Identity & Compliance ────────────────────────────
  { id: 'iam', name: 'AWS IAM', category: 'security', tier: 'critical', hours: 4, domains: [1], summary: 'Users, groups, roles, policies, STS and least-privilege access control.' },
  { id: 'organizations', name: 'AWS Organizations & SCPs', category: 'security', tier: 'high', hours: 1.5, domains: [1, 4], summary: 'Multi-account management, consolidated billing and service control policies.' },
  { id: 'control-tower', name: 'AWS Control Tower', category: 'security', tier: 'medium', hours: 0.75, domains: [1], summary: 'Automated multi-account landing zone with guardrails.' },
  { id: 'iam-identity-center', name: 'AWS IAM Identity Center', category: 'security', tier: 'medium', hours: 0.75, domains: [1], summary: 'Workforce single sign-on across accounts and applications.' },
  { id: 'kms', name: 'AWS KMS', category: 'security', tier: 'critical', hours: 2.5, domains: [1], summary: 'Managed encryption keys, key policies, envelope encryption and rotation.' },
  { id: 'secrets-manager', name: 'AWS Secrets Manager', category: 'security', tier: 'high', hours: 1, domains: [1, 2], summary: 'Store, retrieve and automatically rotate credentials and secrets.' },
  { id: 'acm', name: 'AWS Certificate Manager (ACM)', category: 'security', tier: 'high', hours: 0.75, domains: [1], summary: 'Provision, manage and auto-renew public and private TLS certificates.' },
  { id: 'cognito', name: 'Amazon Cognito', category: 'security', tier: 'high', hours: 1.25, domains: [1], summary: 'User sign-up/sign-in (user pools) and temporary AWS credentials (identity pools).' },
  { id: 'waf', name: 'AWS WAF', category: 'security', tier: 'high', hours: 1, domains: [1], summary: 'Layer 7 web application firewall for SQL injection, XSS and rate limiting.' },
  { id: 'shield', name: 'AWS Shield', category: 'security', tier: 'medium', hours: 0.5, domains: [1], summary: 'Managed DDoS protection: Standard (free) and Advanced.' },
  { id: 'guardduty', name: 'Amazon GuardDuty', category: 'security', tier: 'high', hours: 0.75, domains: [1], summary: 'Intelligent threat detection from CloudTrail, VPC Flow Logs and DNS logs.' },
  { id: 'inspector', name: 'Amazon Inspector', category: 'security', tier: 'medium', hours: 0.5, domains: [1], summary: 'Automated vulnerability scanning for EC2, container images and Lambda.' },
  { id: 'macie', name: 'Amazon Macie', category: 'security', tier: 'medium', hours: 0.5, domains: [1], summary: 'Discover and protect sensitive data (PII) in Amazon S3 using ML.' },
  { id: 'security-hub', name: 'AWS Security Hub', category: 'security', tier: 'medium', hours: 0.5, domains: [1], summary: 'Central view of security alerts and compliance checks across accounts.' },
  { id: 'directory-service', name: 'AWS Directory Service', category: 'security', tier: 'medium', hours: 0.75, domains: [1], summary: 'Managed Microsoft AD, AD Connector and Simple AD for directory integration.' },
  { id: 'cloudhsm', name: 'AWS CloudHSM', category: 'security', tier: 'low', hours: 0.5, domains: [1], summary: 'Dedicated single-tenant hardware security modules you control.' },
  { id: 'network-firewall', name: 'AWS Network Firewall', category: 'security', tier: 'low', hours: 0.5, domains: [1], summary: 'Managed stateful network firewall and intrusion prevention for VPCs.' },
  { id: 'firewall-manager', name: 'AWS Firewall Manager', category: 'security', tier: 'low', hours: 0.5, domains: [1], summary: 'Centrally configure WAF, Shield, security group and firewall rules across an organization.' },
  { id: 'detective', name: 'Amazon Detective', category: 'security', tier: 'low', hours: 0.5, domains: [1], summary: 'Investigate the root cause of security findings using graph analysis.' },
  { id: 'artifact', name: 'AWS Artifact', category: 'security', tier: 'low', hours: 0.25, domains: [1], summary: 'On-demand access to AWS compliance reports and agreements.' },
  { id: 'ram', name: 'AWS Resource Access Manager (RAM)', category: 'security', tier: 'low', hours: 0.5, domains: [1, 4], summary: 'Share resources such as subnets and Transit Gateways across accounts.' },

  // ── Networking & Content Delivery ──────────────────────────────
  { id: 'vpc', name: 'Amazon VPC', category: 'networking', tier: 'critical', hours: 5, domains: [1, 3, 4], summary: 'Subnets, route tables, gateways, security groups, NACLs, peering and endpoints.' },
  { id: 'elb', name: 'Elastic Load Balancing (ALB / NLB / GWLB)', category: 'networking', tier: 'critical', hours: 2.5, domains: [2, 3, 4], summary: 'Distribute traffic across targets: Application, Network and Gateway Load Balancers.' },
  { id: 'route53', name: 'Amazon Route 53', category: 'networking', tier: 'critical', hours: 2.5, domains: [2, 3], summary: 'Scalable DNS with health checks and routing policies for failover and latency.' },
  { id: 'cloudfront', name: 'Amazon CloudFront', category: 'networking', tier: 'high', hours: 2, domains: [2, 3, 4], summary: 'Global CDN with edge caching, OAC, signed URLs and Lambda@Edge.' },
  { id: 'global-accelerator', name: 'AWS Global Accelerator', category: 'networking', tier: 'medium', hours: 0.75, domains: [3, 4], summary: 'Static anycast IPs that route users over the AWS backbone to healthy endpoints.' },
  { id: 'direct-connect', name: 'AWS Direct Connect', category: 'networking', tier: 'high', hours: 1.25, domains: [1, 3, 4], summary: 'Dedicated private network connection from on-premises to AWS.' },
  { id: 'vpn', name: 'AWS Site-to-Site VPN & Client VPN', category: 'networking', tier: 'medium', hours: 0.75, domains: [1, 3, 4], summary: 'Encrypted IPsec tunnels over the internet for sites and remote users.' },
  { id: 'transit-gateway', name: 'AWS Transit Gateway', category: 'networking', tier: 'high', hours: 1.25, domains: [3, 4], summary: 'Hub-and-spoke network connecting VPCs and on-premises networks at scale.' },
  { id: 'privatelink', name: 'AWS PrivateLink & VPC Endpoints', category: 'networking', tier: 'high', hours: 1.25, domains: [1, 3, 4], summary: 'Private connectivity to AWS services and your own services without the internet.' },

  // ── Compute & Containers ───────────────────────────────────────
  { id: 'ec2', name: 'Amazon EC2', category: 'compute', tier: 'critical', hours: 4, domains: [2, 3, 4], summary: 'Virtual servers: instance families, purchasing options, placement groups, AMIs.' },
  { id: 'ec2-auto-scaling', name: 'Amazon EC2 Auto Scaling', category: 'compute', tier: 'critical', hours: 2, domains: [2, 3, 4], summary: 'Automatically add or remove instances to match demand and replace unhealthy ones.' },
  { id: 'lambda', name: 'AWS Lambda', category: 'compute', tier: 'critical', hours: 3.5, domains: [2, 3, 4], summary: 'Serverless, event-driven functions billed per millisecond of execution.' },
  { id: 'ecs', name: 'Amazon ECS', category: 'compute', tier: 'high', hours: 1.5, domains: [2, 3], summary: 'AWS-native container orchestration on EC2 or Fargate.' },
  { id: 'eks', name: 'Amazon EKS', category: 'compute', tier: 'medium', hours: 1, domains: [2, 3], summary: 'Managed Kubernetes control plane on AWS.' },
  { id: 'fargate', name: 'AWS Fargate', category: 'compute', tier: 'high', hours: 0.75, domains: [2, 3, 4], summary: 'Serverless compute engine for containers on ECS and EKS.' },
  { id: 'ecr', name: 'Amazon ECR', category: 'compute', tier: 'low', hours: 0.25, domains: [2], summary: 'Managed private container image registry.' },
  { id: 'batch', name: 'AWS Batch', category: 'compute', tier: 'low', hours: 0.5, domains: [3], summary: 'Run batch computing jobs at any scale on managed compute.' },
  { id: 'elastic-beanstalk', name: 'AWS Elastic Beanstalk', category: 'compute', tier: 'medium', hours: 0.75, domains: [2, 3], summary: 'Upload code; Beanstalk provisions and manages the environment.' },
  { id: 'outposts', name: 'AWS Outposts', category: 'compute', tier: 'low', hours: 0.5, domains: [4], summary: 'AWS infrastructure and services running in your own data center.' },

  // ── Storage ────────────────────────────────────────────────────
  { id: 's3', name: 'Amazon S3', category: 'storage', tier: 'critical', hours: 5, domains: [1, 2, 3, 4], summary: 'Object storage: storage classes, lifecycle, versioning, replication, security.' },
  { id: 'glacier', name: 'Amazon S3 Glacier', category: 'storage', tier: 'high', hours: 0.75, domains: [4], summary: 'Low-cost archival storage classes, retrieval options and Vault Lock.' },
  { id: 'ebs', name: 'Amazon EBS', category: 'storage', tier: 'critical', hours: 2.5, domains: [2, 3, 4], summary: 'Block storage volumes for EC2: SSD/HDD types, snapshots, encryption.' },
  { id: 'efs', name: 'Amazon EFS', category: 'storage', tier: 'high', hours: 1.5, domains: [3, 4], summary: 'Shared, elastic NFS file system for Linux workloads across AZs.' },
  { id: 'fsx', name: 'Amazon FSx', category: 'storage', tier: 'high', hours: 1.25, domains: [3, 4], summary: 'Managed Windows File Server, Lustre, NetApp ONTAP and OpenZFS file systems.' },
  { id: 'storage-gateway', name: 'AWS Storage Gateway', category: 'storage', tier: 'high', hours: 1.25, domains: [3, 4], summary: 'Hybrid storage gateways (File, Volume, Tape) connecting on-premises to AWS.' },
  { id: 'backup', name: 'AWS Backup', category: 'storage', tier: 'medium', hours: 0.75, domains: [1, 2, 4], summary: 'Centralized, policy-based backup across AWS services.' },

  // ── Database ───────────────────────────────────────────────────
  { id: 'rds', name: 'Amazon RDS', category: 'database', tier: 'critical', hours: 3.5, domains: [2, 3, 4], summary: 'Managed relational databases: Multi-AZ, read replicas, RDS Proxy, backups.' },
  { id: 'aurora', name: 'Amazon Aurora', category: 'database', tier: 'critical', hours: 2.5, domains: [2, 3, 4], summary: 'Cloud-native MySQL/PostgreSQL-compatible database with shared distributed storage.' },
  { id: 'dynamodb', name: 'Amazon DynamoDB', category: 'database', tier: 'critical', hours: 4, domains: [2, 3, 4], summary: 'Serverless NoSQL key-value database with single-digit-millisecond latency.' },
  { id: 'elasticache', name: 'Amazon ElastiCache', category: 'database', tier: 'high', hours: 1.5, domains: [3, 4], summary: 'In-memory caching with Redis OSS / Valkey and Memcached.' },
  { id: 'redshift', name: 'Amazon Redshift', category: 'database', tier: 'medium', hours: 1.25, domains: [3], summary: 'Petabyte-scale columnar data warehouse for analytics.' },
  { id: 'neptune', name: 'Amazon Neptune', category: 'database', tier: 'low', hours: 0.25, domains: [3], summary: 'Managed graph database for highly connected data.' },
  { id: 'documentdb', name: 'Amazon DocumentDB', category: 'database', tier: 'low', hours: 0.25, domains: [3], summary: 'MongoDB-compatible managed document database.' },
  { id: 'keyspaces', name: 'Amazon Keyspaces', category: 'database', tier: 'low', hours: 0.25, domains: [3], summary: 'Serverless Apache Cassandra-compatible wide-column database.' },
  { id: 'dms', name: 'AWS Database Migration Service (DMS)', category: 'migration', tier: 'high', hours: 1.25, domains: [3, 4], summary: 'Migrate databases with minimal downtime; homogeneous and heterogeneous (with SCT).' },

  // ── Application Integration ────────────────────────────────────
  { id: 'sqs', name: 'Amazon SQS', category: 'integration', tier: 'critical', hours: 2.5, domains: [2, 3], summary: 'Fully managed message queues to decouple and buffer workloads.' },
  { id: 'sns', name: 'Amazon SNS', category: 'integration', tier: 'critical', hours: 1.5, domains: [2, 3], summary: 'Pub/sub messaging and fan-out to queues, functions and endpoints.' },
  { id: 'eventbridge', name: 'Amazon EventBridge', category: 'integration', tier: 'high', hours: 1.5, domains: [2], summary: 'Serverless event bus with rules, schedules and SaaS/AWS event sources.' },
  { id: 'step-functions', name: 'AWS Step Functions', category: 'integration', tier: 'high', hours: 1.5, domains: [2], summary: 'Visual workflow orchestration with state machines and error handling.' },
  { id: 'api-gateway', name: 'Amazon API Gateway', category: 'integration', tier: 'high', hours: 2, domains: [2], summary: 'Create, secure, throttle and cache REST, HTTP and WebSocket APIs.' },
  { id: 'amazon-mq', name: 'Amazon MQ', category: 'integration', tier: 'low', hours: 0.5, domains: [2], summary: 'Managed ActiveMQ and RabbitMQ brokers for protocol-compatible migrations.' },

  // ── Analytics ──────────────────────────────────────────────────
  { id: 'kinesis', name: 'Amazon Kinesis', category: 'analytics', tier: 'high', hours: 2.5, domains: [3], summary: 'Real-time streaming: Data Streams, Data Firehose and Managed Service for Apache Flink.' },
  { id: 'msk', name: 'Amazon MSK', category: 'analytics', tier: 'low', hours: 0.5, domains: [3], summary: 'Managed Apache Kafka clusters.' },
  { id: 'athena', name: 'Amazon Athena', category: 'analytics', tier: 'high', hours: 1.25, domains: [3], summary: 'Serverless SQL queries directly against data in S3.' },
  { id: 'glue', name: 'AWS Glue', category: 'analytics', tier: 'high', hours: 1.25, domains: [3], summary: 'Serverless ETL and the Data Catalog for data lakes.' },
  { id: 'emr', name: 'Amazon EMR', category: 'analytics', tier: 'medium', hours: 0.75, domains: [3], summary: 'Managed big data clusters running Spark, Hadoop, Hive and Presto.' },
  { id: 'quicksight', name: 'Amazon Quick (Quick Sight)', category: 'analytics', tier: 'medium', hours: 0.5, domains: [3], summary: 'Business intelligence dashboards and visualizations (formerly QuickSight).' },
  { id: 'lake-formation', name: 'AWS Lake Formation', category: 'analytics', tier: 'medium', hours: 0.75, domains: [3], summary: 'Build, secure and govern data lakes with fine-grained access control.' },
  { id: 'opensearch', name: 'Amazon OpenSearch Service', category: 'analytics', tier: 'medium', hours: 0.75, domains: [3], summary: 'Managed search, log analytics and observability engine.' },

  // ── Management, Governance & Cost ──────────────────────────────
  { id: 'cloudwatch', name: 'Amazon CloudWatch', category: 'management', tier: 'critical', hours: 2.5, domains: [2, 3], summary: 'Metrics, logs, alarms, dashboards and events for monitoring and auto scaling.' },
  { id: 'cloudtrail', name: 'AWS CloudTrail', category: 'management', tier: 'high', hours: 1.25, domains: [1, 4], summary: 'Audit log of API calls and account activity.' },
  { id: 'config', name: 'AWS Config', category: 'management', tier: 'high', hours: 1, domains: [1], summary: 'Track resource configuration history and evaluate compliance rules.' },
  { id: 'cloudformation', name: 'AWS CloudFormation', category: 'management', tier: 'high', hours: 2, domains: [2], summary: 'Infrastructure as code with templates, stacks, change sets and drift detection.' },
  { id: 'systems-manager', name: 'AWS Systems Manager', category: 'management', tier: 'medium', hours: 1.25, domains: [2], summary: 'Operational hub: Session Manager, Parameter Store, Patch Manager, Run Command.' },
  { id: 'compute-optimizer', name: 'AWS Compute Optimizer', category: 'management', tier: 'low', hours: 0.25, domains: [4], summary: 'ML-based right-sizing recommendations for compute resources.' },
  { id: 'x-ray', name: 'AWS X-Ray', category: 'management', tier: 'low', hours: 0.5, domains: [2], summary: 'Distributed tracing to analyze and debug request flows.' },
  { id: 'cost-management', name: 'AWS Cost Management & Pricing Models', category: 'management', tier: 'high', hours: 2, domains: [4], summary: 'Cost Explorer, Budgets, CUR, tags, Savings Plans and purchasing options.' },

  // ── Migration & Transfer ───────────────────────────────────────
  { id: 'datasync', name: 'AWS DataSync', category: 'migration', tier: 'high', hours: 1, domains: [3, 4], summary: 'Automated, accelerated online data transfer between on-premises and AWS storage.' },
  { id: 'snow-family', name: 'AWS Snow Family', category: 'migration', tier: 'high', hours: 1, domains: [3, 4], summary: 'Physical devices for offline data transfer and edge computing.' },
  { id: 'transfer-family', name: 'AWS Transfer Family', category: 'migration', tier: 'medium', hours: 0.5, domains: [2, 4], summary: 'Managed SFTP, FTPS and FTP endpoints backed by S3 or EFS.' },
  { id: 'mgn', name: 'AWS Application Migration Service (MGN)', category: 'migration', tier: 'medium', hours: 0.75, domains: [2, 3], summary: 'Lift-and-shift servers to AWS with continuous block-level replication.' },

  // ── Machine Learning (managed AI services) ─────────────────────
  { id: 'rekognition', name: 'Amazon Rekognition', category: 'ml', tier: 'low', hours: 0.25, domains: [2], summary: 'Image and video analysis: objects, faces, text and moderation.' },
  { id: 'comprehend', name: 'Amazon Comprehend', category: 'ml', tier: 'low', hours: 0.25, domains: [2], summary: 'Natural language processing: sentiment, entities, key phrases and PII.' },
  { id: 'polly', name: 'Amazon Polly', category: 'ml', tier: 'low', hours: 0.25, domains: [2], summary: 'Text-to-speech with lifelike voices.' },
  { id: 'transcribe', name: 'Amazon Transcribe', category: 'ml', tier: 'low', hours: 0.25, domains: [2], summary: 'Automatic speech recognition (speech-to-text).' },
  { id: 'translate', name: 'Amazon Translate', category: 'ml', tier: 'low', hours: 0.25, domains: [2], summary: 'Neural machine translation between languages.' },
  { id: 'textract', name: 'Amazon Textract', category: 'ml', tier: 'low', hours: 0.25, domains: [2], summary: 'Extract text, forms and tables from scanned documents.' },
  { id: 'lex', name: 'Amazon Lex', category: 'ml', tier: 'low', hours: 0.25, domains: [2], summary: 'Build conversational chatbots with voice and text.' },
  { id: 'sagemaker', name: 'Amazon SageMaker AI', category: 'ml', tier: 'low', hours: 0.5, domains: [2], summary: 'Build, train and deploy custom machine learning models.' },
];

/** Lookup helper: service id -> catalog entry. */
export const serviceById = Object.fromEntries(serviceCatalog.map((service) => [service.id, service]));

/** Sum of recommended study hours across the whole catalog. */
export const totalCatalogHours = serviceCatalog.reduce((sum, service) => sum + service.hours, 0);
