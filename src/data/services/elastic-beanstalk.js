import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Elastic Beanstalk. Schema: see s3.js. */
export default {
  tagline: 'Upload your code; Elastic Beanstalk provisions and manages the load balancer, scaling and servers.',
  intro: [
    'AWS Elastic Beanstalk is a platform-as-a-service that deploys and scales web applications: you upload a source bundle (for example a ZIP or WAR file) and Beanstalk handles provisioning, load balancing, Auto Scaling and health monitoring.',
    'You keep full control of the underlying resources (EC2, ALB, Auto Scaling group, RDS) and there is no extra charge for Beanstalk itself; you pay only for the resources it creates.',
    'It supports platforms such as Java, .NET, Node.js, PHP, Python, Ruby, Go and Docker; platform updates and patching can be managed automatically.',
    'A web server environment serves HTTP requests, while a worker environment pulls jobs from an Amazon SQS queue for background processing.',
    'Deployment policies control risk and speed: all at once, rolling, rolling with additional batch, immutable and traffic splitting; blue/green is done by swapping environment CNAMEs.',
    'Behind the scenes Beanstalk uses CloudFormation to create resources; configuration can be customised with .ebextensions or saved configurations.',
  ],
  useCases: [
    { title: 'Deploy a web app without managing infrastructure', detail: 'Developers push code and get a scalable, load-balanced environment.' },
    { title: 'Lift-and-shift of simple applications', detail: 'Move Java, .NET or PHP apps to AWS with little re-architecture.' },
    { title: 'Background job processing', detail: 'A worker environment consumes an SQS queue.' },
  ],
  importance: {
    points: [
      'Appears in compute and deployment questions (Domains 2 and 3) as the answer for "deploy my code without managing servers, but I still want control of resources".',
      'Know the deployment policies and the difference between Beanstalk (PaaS), Lambda (functions) and CloudFormation (infrastructure as code).',
    ],
  },
  cli: [
    { command: 'eb init my-app --platform python-3.12 --region us-east-1', description: 'Initialise an application with the EB CLI.' },
    { command: 'eb create prod-env --elb-type application', description: 'Create an environment with an Application Load Balancer.' },
    { command: 'eb deploy', description: 'Deploy the current source bundle.' },
    { command: 'eb swap prod-env --destination_name prod-env-green', description: 'Swap CNAMEs for a blue/green cutover.' },
    { command: 'aws elasticbeanstalk describe-environments --application-name my-app', description: 'List environments and their health.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): check environment health',
        language: 'python',
        code: `import boto3

eb = boto3.client("elasticbeanstalk")
envs = eb.describe_environments(ApplicationName="my-app")["Environments"]
for env in envs:
    print(env["EnvironmentName"], env["Status"], env["Health"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Zero-downtime release with rollback safety',
      scenario: 'A production web app needs releases that never reduce capacity and can roll back quickly.',
      steps: [
        'Use the immutable deployment policy so new instances in a second Auto Scaling group serve traffic only after passing health checks.',
        'If the health checks fail, Beanstalk terminates the new instances and the old version keeps serving.',
        'For risky changes, create a second environment and swap CNAMEs (blue/green).',
      ],
    },
  ],
  diagram: {
    title: 'Elastic Beanstalk environment',
    nodes: [
      ['dev', 'Developer uploads source bundle', 'actor', 0, 1],
      ['eb', 'AWS Elastic Beanstalk', 'management', 1, 1],
      ['s3', 'Application versions in S3', 'storage', 1, 0],
      ['cw', 'CloudWatch health and logs', 'integration', 1, 2],
      ['env', 'ALB + Auto Scaling + EC2', 'compute', 2, 1],
      ['db', 'Amazon RDS (optional)', 'database', 3, 1],
    ],
    edges: [
      ['dev', 'eb', 'Upload code'],
      ['eb', 's3', 'Stores versions'],
      ['eb', 'cw', 'Monitors'],
      ['eb', 'env', 'Provisions'],
      ['env', 'db', 'Optional database'],
    ],
    steps: [
      'You upload a source bundle; Beanstalk stores the application version in S3.',
      'It provisions a load balancer, Auto Scaling group and EC2 instances (via CloudFormation) and deploys the code.',
      'Health and logs go to CloudWatch; deployment policies control how new versions roll out.',
    ],
  },
  questionTypes: [
    { pattern: 'Deploy code without managing infrastructure, keep resource control', hint: 'Elastic Beanstalk.' },
    { pattern: 'Choose a deployment policy', hint: 'Immutable or blue/green for safest; all at once for fastest.' },
    { pattern: 'Background workers from a queue', hint: 'Worker environment with SQS.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A developer wants to upload a Java web application and have AWS automatically provision the load balancer, Auto Scaling and servers, while still being able to access the underlying EC2 instances. Which service should be used?',
      options: ['Amazon S3 static website hosting', 'AWS Lambda', 'AWS Snowball Edge', 'AWS Elastic Beanstalk'],
      answer: ['D'],
      explanation: 'Beanstalk deploys and scales applications and exposes the underlying resources, with no extra charge beyond those resources.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which Elastic Beanstalk deployment policy launches a second Auto Scaling group and lets the old version keep serving if the new instances fail health checks?',
      options: ['Immutable', 'All at once', 'None of these; Beanstalk cannot roll back', 'Rolling on existing instances'],
      answer: ['A'],
      explanation: 'Immutable deployments use new instances in a separate group; on failure they are terminated and existing instances are untouched.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An Elastic Beanstalk application must process long-running background jobs placed on an SQS queue. Which environment tier is designed for this?',
      options: ['Web server environment', 'Worker environment', 'A static website environment', 'Single-instance with no queue'],
      answer: ['B'],
      explanation: 'Worker environments read messages from an SQS queue and process them in the background.',
    },
  ],
  keyFacts: [
    'Beanstalk = PaaS; you pay only for the underlying resources it creates.',
    'Environments: web server (HTTP) and worker (SQS).',
    'Deployment policies: all at once, rolling, rolling with additional batch, immutable, traffic splitting; blue/green via CNAME swap.',
    'Uses CloudFormation under the hood; customise with .ebextensions.',
    'Supports Java, .NET, Node.js, PHP, Python, Ruby, Go and Docker platforms.',
  ],
  traps: [
    { clue: 'Upload code, AWS handles provisioning, I keep access to EC2', answer: 'Elastic Beanstalk.' },
    { clue: 'No servers at all, event-driven code', answer: 'Lambda.' },
    { clue: 'Define infrastructure declaratively as templates', answer: 'CloudFormation.' },
  ],
  related: ['ec2', 'ec2-auto-scaling', 'elb', 'cloudformation', 'sqs', 'lambda'],
  sources: [
    { title: 'What is AWS Elastic Beanstalk?', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html' },
    { title: 'Deploying applications to Elastic Beanstalk environments', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html' },
    { title: 'Elastic Beanstalk environment tiers', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts-webserver.html' },
    { title: 'AWS CLI elasticbeanstalk commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/elasticbeanstalk/index.html' },
  ],
};
