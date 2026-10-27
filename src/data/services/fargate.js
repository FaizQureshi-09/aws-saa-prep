import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Fargate. Schema: see s3.js. */
export default {
  tagline: 'Run containers without managing servers - serverless compute for Amazon ECS and EKS.',
  intro: [
    'AWS Fargate is a serverless compute engine for containers: you specify the CPU and memory a task needs and AWS provisions and manages the underlying compute.',
    'It works with both Amazon ECS and Amazon EKS; there are no EC2 instances to patch, scale or right-size.',
    'Each task runs in its own isolated environment with its own elastic network interface, so security groups and VPC networking apply per task.',
    'You pay for the vCPU and memory resources requested for the duration the task runs (billed per second with a minimum); Fargate Spot offers discounted capacity for interruptible tasks.',
    'It is a good fit for variable or bursty container workloads; for steady, large, specialised workloads EC2 launch types (with Savings Plans) may cost less.',
    'Compared with Lambda: Fargate has no 15-minute limit, supports any container, and suits long-running services and batch jobs.',
  ],
  useCases: [
    { title: 'Long-running microservices', detail: 'Containerised APIs without cluster capacity management.' },
    { title: 'Batch and scheduled jobs', detail: 'Run jobs that exceed Lambda limits, triggered by EventBridge or Step Functions.' },
    { title: 'Interruptible workloads at lower cost', detail: 'Fargate Spot for fault-tolerant tasks.' },
  ],
  importance: {
    points: [
      'Fargate is named repeatedly in Tasks 2.1, 3.2 and 4.2 as the serverless container option and a "cost-effective compute service" alongside Lambda and EC2.',
      'Decision matrix: Lambda (event functions), Fargate (serverless containers), EC2 (full control).',
    ],
  },
  cli: [
    { command: 'aws ecs create-service --cluster prod --service-name api --task-definition api:1 --launch-type FARGATE --desired-count 2 --network-configuration "awsvpcConfiguration={subnets=[subnet-a,subnet-b],securityGroups=[sg-0abc],assignPublicIp=DISABLED}"', description: 'Run a service on Fargate in private subnets.' },
    { command: 'aws ecs run-task --cluster prod --launch-type FARGATE --task-definition etl:2 --network-configuration "awsvpcConfiguration={subnets=[subnet-a],securityGroups=[sg-0abc]}"', description: 'Run a one-off Fargate task.' },
    { command: 'aws ecs put-cluster-capacity-providers --cluster prod --capacity-providers FARGATE FARGATE_SPOT --default-capacity-provider-strategy capacityProvider=FARGATE_SPOT,weight=1', description: 'Enable Fargate and Fargate Spot capacity providers.' },
    { command: 'aws ecs describe-tasks --cluster prod --tasks <task-arn>', description: 'Inspect a task (status, ENI, stop reason).' },
    { command: 'aws ecs update-service --cluster prod --service api --desired-count 4', description: 'Scale a Fargate service to four tasks.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): run a Fargate task',
        language: 'python',
        code: `import boto3

ecs = boto3.client("ecs")
ecs.run_task(
    cluster="prod",
    launchType="FARGATE",
    taskDefinition="etl:2",
    networkConfiguration={"awsvpcConfiguration": {
        "subnets": ["subnet-a"], "securityGroups": ["sg-0abc"], "assignPublicIp": "DISABLED"}},
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Serverless batch processing beyond Lambda limits',
      scenario: 'A nightly 45-minute data transformation must run without managing servers.',
      steps: [
        'Package the job as a container image in ECR.',
        'Create a task definition sized to the job (for example 2 vCPU, 8 GB).',
        'Trigger it with an EventBridge schedule that runs a Fargate task.',
        'Optionally use Fargate Spot if the job tolerates interruption.',
      ],
    },
  ],
  diagram: {
    title: 'Fargate task placement',
    nodes: [
      ['trigger', 'EventBridge schedule / ALB', 'integration', 0, 1],
      ['ecs', 'ECS / EKS control plane', 'compute', 1, 1],
      ['task', 'Fargate task (own ENI)', 'compute', 2, 1],
      ['vpc', 'Private subnet + security group', 'network', 2, 0],
      ['logs', 'CloudWatch Logs', 'integration', 2, 2],
    ],
    edges: [
      ['trigger', 'ecs', 'Start task'],
      ['ecs', 'task', 'Provision compute'],
      ['vpc', 'task', 'Networking'],
      ['task', 'logs', 'Container logs'],
    ],
    steps: [
      'A schedule, queue or load balancer target registration causes ECS/EKS to start a task.',
      'Fargate provisions isolated compute sized to the task definition and attaches an ENI in your subnet.',
      'The task runs, logs to CloudWatch, and you are billed for the task\'s vCPU and memory while it runs.',
    ],
  },
  questionTypes: [
    { pattern: 'Run containers with no servers', hint: 'Fargate.' },
    { pattern: 'Lambda vs Fargate vs EC2', hint: 'Lambda < 15 min event functions; Fargate for containers/long jobs; EC2 for control and steady cost optimisation.' },
    { pattern: 'Reduce cost of interruptible containers', hint: 'Fargate Spot.' },
  ],
  questions: [
    {
      source: 'mock', domain: 4,
      stem: 'A company runs a nightly 40-minute containerised ETL job and wants the lowest operational overhead and no idle servers. Which compute option fits BEST?',
      options: ['AWS Lambda', 'AWS Fargate tasks triggered on a schedule', 'A 24x7 EC2 Reserved Instance', 'An always-running ECS cluster on EC2'],
      answer: ['B'],
      explanation: 'Fargate runs containers serverlessly without time limits and you pay only while the task runs; Lambda\'s 15-minute limit rules it out.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statement about AWS Fargate is correct?',
      options: ['You must patch the underlying instances', 'It works with both Amazon ECS and Amazon EKS', 'It can only run Lambda functions', 'It requires a minimum of 10 EC2 instances'],
      answer: ['B'],
      explanation: 'Fargate is the serverless compute engine for containers on both ECS and EKS; no instances are managed by the customer.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A fault-tolerant, interruptible set of container tasks must run at the lowest possible cost. What should be used?',
      options: ['Fargate On-Demand only', 'Fargate Spot capacity provider', 'Dedicated Hosts', 'Standard Reserved Instances'],
      answer: ['B'],
      explanation: 'Fargate Spot offers discounted compute for interruption-tolerant tasks.',
    },
    {
      source: 'mock', domain: 3,
      stem: "Which task remains the customer's responsibility when running containers on AWS Fargate?",
      options: ['Patching the host operating system', 'Provisioning the EC2 instances of the cluster', 'Defining the container image and the task CPU and memory sizes', 'Managing the container runtime hosts'],
      answer: ['C'],
      explanation: 'Fargate removes server and host management; you still build the image and choose the task size.',
    },
  ],
  keyFacts: [
    'Fargate is serverless for containers: no instance management; billed for task vCPU and memory while running.',
    'Supported by ECS and EKS; each task gets its own ENI (awsvpc).',
    'Fargate Spot gives a discount for interruptible tasks, which can be reclaimed with a short warning.',
    'Use Fargate when you want to avoid cluster capacity planning; use EC2 launch type for specialised instance types, GPUs or maximum cost optimisation at steady scale.',
    'No 15-minute time limit as in Lambda; long-running services are supported.',
    'You pay for the vCPU and memory requested by tasks for the time they run, not for whole instances.',
  ],
  traps: [
    { clue: 'Serverless containers', answer: 'Fargate.' },
    { clue: 'Job longer than 15 minutes, containerised', answer: 'Fargate (not Lambda).' },
    { clue: 'Need GPUs or specific instance types', answer: 'ECS/EKS on EC2.' },
  ],
  related: ['ecs', 'eks', 'lambda', 'ecr', 'eventbridge'],
  sources: [
    { title: 'AWS Fargate for Amazon ECS', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html' },
    { title: 'AWS Fargate for Amazon EKS', url: 'https://docs.aws.amazon.com/eks/latest/userguide/fargate.html' },
    { title: 'Fargate capacity providers', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html' },
    { title: 'AWS Fargate', url: 'https://aws.amazon.com/fargate/' },
  ],
};
