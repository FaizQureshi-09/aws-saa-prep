/**
 * Exam scope data: the current official in-scope and out-of-scope lists,
 * the differences against the 2023 exam-guide PDF, and one-line
 * references for in-scope services that do not get a dedicated study page.
 * Lists are copied from the current HTML exam guide (checked 27 Oct 2026);
 * AWS marks them "non-exhaustive and subject to change".
 */

/** Current in-scope services grouped by AWS's own categories. */
export const inScopeByCategory = [
  {
    category: 'Analytics',
    services: ['Amazon Athena', 'AWS Data Exchange', 'AWS Data Pipeline', 'Amazon EMR', 'AWS Glue', 'Amazon Kinesis', 'AWS Lake Formation', 'Amazon MSK', 'Amazon OpenSearch Service', 'Amazon Quick', 'Amazon Redshift'],
  },
  {
    category: 'Application Integration',
    services: ['Amazon AppFlow', 'Amazon EventBridge', 'Amazon MQ', 'Amazon SNS', 'Amazon SQS', 'AWS Step Functions'],
  },
  {
    category: 'AWS Cost Management',
    services: ['AWS Budgets', 'AWS Cost and Usage Report', 'AWS Cost Explorer', 'Savings Plans'],
  },
  {
    category: 'Compute',
    services: ['AWS Batch', 'Amazon EC2', 'Amazon EC2 Auto Scaling', 'AWS Elastic Beanstalk', 'AWS Outposts', 'AWS Serverless Application Repository', 'VMware Cloud on AWS', 'AWS Wavelength'],
  },
  {
    category: 'Containers',
    services: ['Amazon ECR', 'Amazon ECS', 'Amazon ECS Anywhere', 'Amazon EKS', 'Amazon EKS Anywhere', 'Amazon EKS Distro'],
  },
  {
    category: 'Database',
    services: ['Amazon Aurora', 'Amazon Aurora Serverless', 'Amazon DocumentDB', 'Amazon DynamoDB', 'Amazon ElastiCache', 'Amazon Keyspaces', 'Amazon Neptune', 'Amazon RDS', 'Amazon Redshift'],
  },
  {
    category: 'Developer Tools',
    services: ['AWS X-Ray'],
  },
  {
    category: 'Front-End Web and Mobile',
    services: ['AWS Amplify', 'Amazon API Gateway', 'AWS Device Farm'],
  },
  {
    category: 'Machine Learning',
    services: ['Amazon Comprehend', 'Amazon Lex', 'Amazon Polly', 'Amazon Rekognition', 'Amazon SageMaker AI', 'Amazon Textract', 'Amazon Transcribe', 'Amazon Translate'],
  },
  {
    category: 'Management and Governance',
    services: ['AWS Auto Scaling', 'AWS CLI', 'AWS CloudFormation', 'AWS CloudTrail', 'Amazon CloudWatch', 'AWS Compute Optimizer', 'AWS Config', 'AWS Control Tower', 'AWS Health Dashboard', 'AWS License Manager', 'Amazon Managed Grafana', 'Amazon Managed Service for Prometheus', 'AWS Management Console', 'AWS Organizations', 'AWS Proton', 'AWS Service Catalog', 'AWS Systems Manager', 'AWS Well-Architected Tool'],
  },
  {
    category: 'Media Services',
    services: ['Amazon Kinesis Video Streams'],
  },
  {
    category: 'Migration and Transfer',
    services: ['AWS Application Discovery Service', 'AWS Application Migration Service', 'AWS DataSync', 'AWS DMS', 'AWS Snow Family', 'AWS Transfer Family'],
  },
  {
    category: 'Networking and Content Delivery',
    services: ['AWS Client VPN', 'Amazon CloudFront', 'AWS Direct Connect', 'Elastic Load Balancing', 'AWS Global Accelerator', 'AWS PrivateLink', 'Amazon Route 53', 'AWS Site-to-Site VPN', 'AWS Transit Gateway', 'Amazon VPC'],
  },
  {
    category: 'Security, Identity, and Compliance',
    services: ['AWS Artifact', 'AWS Certificate Manager', 'AWS CloudHSM', 'Amazon Cognito', 'Amazon Detective', 'AWS Directory Service', 'AWS Firewall Manager', 'Amazon GuardDuty', 'AWS IAM Identity Center', 'Amazon Inspector', 'AWS KMS', 'Amazon Macie', 'AWS Network Firewall', 'AWS RAM', 'AWS Secrets Manager', 'AWS Security Hub', 'AWS Shield', 'AWS WAF', 'IAM'],
  },
  {
    category: 'Serverless',
    services: ['AWS Fargate', 'AWS Lambda'],
  },
  {
    category: 'Storage',
    services: ['AWS Backup', 'Amazon EBS', 'Amazon EFS', 'Amazon FSx (all types)', 'Amazon S3', 'Amazon S3 Glacier', 'AWS Storage Gateway'],
  },
];

/** Current out-of-scope services (you will NOT be tested on these). */
export const outOfScopeByCategory = [
  { category: 'Application Integration', services: ['Amazon MWAA'] },
  { category: 'Compute', services: ['Amazon Lightsail'] },
  { category: 'Database', services: ['Amazon RDS on VMware'] },
  {
    category: 'Developer Tools',
    services: ['AWS CDK', 'AWS CloudShell', 'AWS CodeArtifact', 'AWS CodeBuild', 'AWS CodeCommit', 'AWS CodeDeploy', 'Amazon Corretto', 'AWS Fault Injection Simulator', 'AWS Tools and SDKs'],
  },
  { category: 'Front-End Web and Mobile', services: ['Amazon Location Service'] },
  { category: 'Game Tech', services: ['Amazon GameLift'] },
  { category: 'Internet of Things', services: ['All services'] },
  {
    category: 'Machine Learning',
    services: ['Apache MXNet on AWS', 'AWS Deep Learning AMIs', 'AWS Deep Learning Containers', 'Amazon HealthLake', 'AWS Inferentia', 'Amazon Personalize', 'PyTorch on AWS', 'TensorFlow on AWS'],
  },
  { category: 'Management and Governance', services: ['AWS Console Mobile Application', 'AWS Distro for OpenTelemetry'] },
  {
    category: 'Media Services',
    services: ['AWS Elemental Appliances and Software', 'AWS Elemental MediaConnect', 'AWS Elemental MediaConvert', 'AWS Elemental MediaLive', 'AWS Elemental MediaPackage', 'AWS Elemental MediaTailor', 'Amazon IVS'],
  },
  { category: 'Migration and Transfer', services: ['Migration Evaluator'] },
  { category: 'Networking and Content Delivery', services: ['AWS Cloud Map'] },
  { category: 'Quantum Technologies', services: ['Amazon Braket'] },
  { category: 'Satellite', services: ['AWS Ground Station'] },
];

/**
 * Services listed in the 2023 exam-guide PDF (v1.1) but absent from the
 * current in-scope list. Only Elastic Transcoder's removal is stated by AWS
 * in its revision table; the rest come from our own comparison of the two
 * lists. `status` carries a verified lifecycle fact where AWS documents one.
 */
export const removedFromScope = [
  {
    name: 'Amazon Elastic Transcoder',
    note: 'AWS lists this as removed from the in-scope list in its revision history.',
    status: 'Removed per AWS revision history',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-revisions.html',
  },
  {
    name: 'Amazon QLDB',
    note: 'Not in the current in-scope list. AWS announced QLDB end of support on 31 July 2025 and recommends migrating to Aurora PostgreSQL.',
    status: 'End of support: 31 Jul 2025',
    url: 'https://aws.amazon.com/blogs/database/category/database/amazon-quantum-ledger-database/',
  },
  {
    name: 'Amazon Forecast',
    note: 'Not in the current in-scope list. AWS documentation states it is no longer available to new customers.',
    status: 'Closed to new customers',
    url: 'https://docs.aws.amazon.com/forecast/latest/dg/what-is-forecast.html',
  },
  {
    name: 'Amazon Fraud Detector',
    note: 'Not in the current in-scope list. AWS documentation states it is no longer open to new customers as of 7 November 2025.',
    status: 'Closed to new customers: 7 Nov 2025',
    url: 'https://docs.aws.amazon.com/frauddetector/latest/ug/what-is-frauddetector.html',
  },
  { name: 'AWS AppSync', note: 'In the 2023 PDF (Application Integration and Serverless); not in the current list.', status: 'Not in current list', url: 'https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html' },
  { name: 'Amazon Pinpoint', note: 'In the 2023 PDF (Front-End Web and Mobile); not in the current list.', status: 'Not in current list', url: 'https://docs.aws.amazon.com/pinpoint/latest/userguide/welcome.html' },
  { name: 'Amazon Kendra', note: 'In the 2023 PDF (Machine Learning); not in the current list.', status: 'Not in current list', url: 'https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html' },
  { name: 'AWS Trusted Advisor', note: 'In the 2023 PDF (Management and Governance); not in the current list. Still a useful 10-minute read for cost-optimization questions.', status: 'Not in current list', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html' },
  { name: 'AWS Migration Hub', note: 'In the 2023 PDF (Migration and Transfer); not in the current list.', status: 'Not in current list', url: 'https://docs.aws.amazon.com/migrationhub/latest/ug/whatishub.html' },
  { name: 'AWS Audit Manager', note: 'In the 2023 PDF (Security, Identity, and Compliance); not in the current list.', status: 'Not in current list', url: 'https://docs.aws.amazon.com/audit-manager/latest/userguide/what-is.html' },
];

/** Renames between the 2023 PDF and the current guide. */
export const renamedServices = [
  { from: 'Amazon QuickSight', to: 'Amazon Quick', note: 'AWS documents that Amazon Quick evolved from QuickSight; QuickSight continues as the "Quick Sight" BI feature and existing APIs keep QuickSight naming.' },
  { from: 'Amazon SageMaker', to: 'Amazon SageMaker AI', note: 'Name as it appears in the current in-scope list.' },
];

/**
 * In-scope services that get a one-line reference instead of a full page.
 * Each `purpose` restates the service's own AWS documentation summary at a
 * high level; `url` is the official doc landing page.
 */
export const quickReference = [
  { name: 'AWS Data Exchange', purpose: 'Find, subscribe to and use third-party data sets in AWS.', url: 'https://docs.aws.amazon.com/data-exchange/latest/userguide/what-is.html' },
  { name: 'AWS Data Pipeline', purpose: 'Older service for scheduling data movement and processing between AWS and on-premises sources. AWS documents it as in maintenance mode and closed to new customers - know it exists, do not invest study time.', url: 'https://docs.aws.amazon.com/datapipeline/latest/DeveloperGuide/what-is-datapipeline.html' },
  { name: 'Amazon AppFlow', purpose: 'Fully managed, no-code integration that securely transfers data between SaaS applications (for example Salesforce) and AWS services such as S3 and Redshift.', url: 'https://docs.aws.amazon.com/appflow/latest/userguide/what-is-appflow.html' },
  { name: 'AWS Serverless Application Repository', purpose: 'Managed repository to store, publish and deploy serverless applications.', url: 'https://docs.aws.amazon.com/serverlessrepo/latest/devguide/what-is-serverlessrepo.html' },
  { name: 'VMware Cloud on AWS', purpose: 'Run VMware vSphere-based workloads on AWS infrastructure to migrate or extend on-premises VMware environments.', url: 'https://aws.amazon.com/vmware/' },
  { name: 'AWS Wavelength', purpose: 'Embeds AWS compute and storage inside telecom providers\' 5G networks for ultra-low-latency applications.', url: 'https://docs.aws.amazon.com/wavelength/latest/developerguide/what-is-wavelength.html' },
  { name: 'Amazon ECS Anywhere', purpose: 'Run and manage ECS tasks on your own on-premises infrastructure from the ECS control plane.', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-anywhere.html' },
  { name: 'Amazon EKS Anywhere', purpose: 'Create and operate Kubernetes clusters on your own infrastructure using EKS-consistent tooling.', url: 'https://anywhere.eks.amazonaws.com/docs/overview/' },
  { name: 'Amazon EKS Distro', purpose: 'The same Kubernetes distribution that Amazon EKS uses, available to run anywhere.', url: 'https://distro.eks.amazonaws.com/' },
  { name: 'AWS Amplify', purpose: 'Tools and services for building and hosting full-stack web and mobile applications (auth, APIs, storage, hosting).', url: 'https://docs.amplify.aws/' },
  { name: 'AWS Device Farm', purpose: 'Test web and mobile apps on real browsers and physical devices in the cloud.', url: 'https://docs.aws.amazon.com/devicefarm/latest/developerguide/welcome.html' },
  { name: 'AWS License Manager', purpose: 'Track and manage software licenses (for example Microsoft, Oracle, SAP) across AWS and on-premises and enforce usage limits.', url: 'https://docs.aws.amazon.com/license-manager/latest/userguide/license-manager.html' },
  { name: 'Amazon Managed Grafana', purpose: 'Fully managed Grafana service to visualize operational metrics, logs and traces from multiple sources.', url: 'https://docs.aws.amazon.com/grafana/latest/userguide/what-is-Amazon-Managed-Service-Grafana.html' },
  { name: 'Amazon Managed Service for Prometheus', purpose: 'Managed, Prometheus-compatible monitoring for containerized workloads at scale.', url: 'https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-Amazon-Managed-Service-Prometheus.html' },
  { name: 'AWS Proton', purpose: 'Template-based infrastructure and deployment management for platform teams. AWS ended support on 7 October 2026 (documented notice) yet it is still in the in-scope list - expect it to be very rare.', url: 'https://docs.aws.amazon.com/proton/latest/userguide/doc-history.html' },
  { name: 'AWS Service Catalog', purpose: 'Create and govern catalogs of approved IT products (CloudFormation-based) for self-service, standardized provisioning.', url: 'https://docs.aws.amazon.com/servicecatalog/latest/adminguide/introduction.html' },
  { name: 'AWS Health Dashboard', purpose: 'Personalized view of AWS service health and events that affect your own resources and accounts.', url: 'https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html' },
  { name: 'Amazon Kinesis Video Streams', purpose: 'Securely stream video from connected devices to AWS for analytics, machine learning and playback.', url: 'https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/what-is-kinesis-video.html' },
  { name: 'AWS Application Discovery Service', purpose: 'Collects configuration, usage and dependency data from on-premises servers to plan migrations.', url: 'https://docs.aws.amazon.com/application-discovery/latest/userguide/what-is-appdiscovery.html' },
];
