import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon ECS. Schema: see s3.js. */
export default {
  tagline: 'AWS-native container orchestration that runs Docker containers on EC2 or serverless on Fargate.',
  intro: [
    'Amazon Elastic Container Service (ECS) is a fully managed container orchestrator: you define tasks and services, and ECS schedules containers across a cluster.',
    'A task definition describes containers (image, CPU, memory, ports, environment, logging); a service keeps a desired number of tasks running and integrates with load balancers.',
    'Launch types: Fargate (serverless, no instances to manage) or EC2 (you manage a fleet of container instances); ECS Anywhere runs tasks on your own servers.',
    'Two IAM roles matter: the task role (permissions for your application) and the task execution role (pulls images from ECR and writes logs).',
    'Service auto scaling adjusts task count on CloudWatch metrics; the ALB supports dynamic port mapping and path-based routing to containers.',
    'Images are stored in Amazon ECR; awsvpc networking gives each task its own elastic network interface and security group.',
  ],
  useCases: [
    { title: 'Microservices on containers', detail: 'ALB path routing to separate ECS services with independent scaling.' },
    { title: 'Lift-and-shift of containerised apps', detail: 'Move Docker workloads to AWS without managing Kubernetes.' },
    { title: 'Batch and background workers', detail: 'Run tasks on a schedule or from queues using Fargate.' },
  ],
  importance: {
    points: [
      'Container orchestration (ECS vs EKS) is named in Tasks 2.1 and 3.2; "how to migrate applications into containers" is a listed knowledge item.',
      'Typical decision: ECS (simpler, AWS-native) vs EKS (Kubernetes) vs Lambda (functions), and EC2 vs Fargate launch type.',
    ],
  },
  cli: [
    { command: 'aws ecs create-cluster --cluster-name prod', description: 'Create a cluster.' },
    { command: 'aws ecs register-task-definition --cli-input-json file://taskdef.json', description: 'Register a task definition.' },
    { command: 'aws ecs create-service --cluster prod --service-name web --task-definition web:3 --desired-count 3 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-a,subnet-b],securityGroups=[sg-0abc]}" --load-balancers targetGroupArn=<tg-arn>,containerName=web,containerPort=80', description: 'Create a load-balanced Fargate service.' },
    { command: 'aws ecs update-service --cluster prod --service web --desired-count 6', description: 'Scale a service manually.' },
    { command: 'aws ecs run-task --cluster prod --task-definition batch-job --launch-type FARGATE --network-configuration ...', description: 'Run a one-off task.' },
    { command: 'aws ecs list-tasks --cluster prod --service-name web', description: 'List running tasks.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): scale an ECS service',
        language: 'python',
        code: `import boto3

ecs = boto3.client("ecs")
ecs.update_service(cluster="prod", service="web", desiredCount=6)`,
      },
    ],
  },
  examples: [
    {
      title: 'Containerised web service on Fargate',
      scenario: 'A team wants to run a containerised API with no servers to patch, behind HTTPS.',
      steps: [
        'Push the image to Amazon ECR.',
        'Register a task definition with the image, CPU and memory, and a task role.',
        'Create a Fargate service across two private subnets attached to an ALB target group.',
        'Add service auto scaling on CPU or ALBRequestCountPerTarget.',
      ],
    },
  ],
  diagram: {
    title: 'ECS service on Fargate behind an ALB',
    nodes: [
      ['user', 'Users', 'actor', 0, 1],
      ['alb', 'Application Load Balancer', 'network', 1, 1],
      ['svc', 'ECS service (Fargate tasks)', 'compute', 2, 1],
      ['ecr', 'Amazon ECR images', 'compute', 3, 1],
      ['cw', 'CloudWatch autoscaling', 'integration', 2, 0],
    ],
    edges: [
      ['user', 'alb', 'HTTPS'],
      ['alb', 'svc', 'Target group'],
      ['svc', 'ecr', 'Pull image'],
      ['cw', 'svc', 'Scale tasks'],
    ],
    steps: [
      'Users reach the ALB, which forwards to healthy ECS tasks registered in a target group.',
      'The ECS service keeps the desired number of tasks running and replaces failed ones.',
      'Tasks pull their container images from ECR; CloudWatch metrics drive service auto scaling.',
    ],
  },
  questionTypes: [
    { pattern: 'Containers with least operational overhead', hint: 'ECS or EKS on Fargate.' },
    { pattern: 'ECS vs EKS', hint: 'Choose EKS when Kubernetes compatibility/portability is required; otherwise ECS is simpler.' },
    { pattern: 'Task permissions', hint: 'Task role for the app; execution role for pulling images/logging.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants to run containerised microservices on AWS without managing EC2 instances or Kubernetes. Which solution has the LEAST operational overhead?',
      options: ['Amazon ECS with the Fargate launch type', 'Self-managed Docker on EC2', 'Amazon EKS with self-managed nodes', 'AWS Elastic Beanstalk on a single instance'],
      answer: ['A'],
      explanation: 'ECS on Fargate removes both instance management and Kubernetes operations.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A containerised application running as an ECS task needs to read from a DynamoDB table. How should permissions be granted?',
      options: ['Embed IAM user access keys in the container image', 'Attach an IAM task role with DynamoDB permissions to the task definition', 'Make the table public', 'Use the container instance profile for every task regardless of need'],
      answer: ['B'],
      explanation: 'The ECS task role gives each task least-privilege temporary credentials; keys in images are insecure.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A team already uses Kubernetes manifests and wants to keep them portable while using managed control-plane operations on AWS. Which service should be used?',
      options: ['Amazon ECS', 'Amazon EKS', 'AWS Lambda', 'Amazon Lightsail'],
      answer: ['B'],
      explanation: 'EKS provides a managed Kubernetes control plane compatible with upstream Kubernetes tooling.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'An ECS service behind an Application Load Balancer must add and remove tasks automatically based on average CPU utilisation. What should be configured?',
      options: ['A Route 53 failover record', 'An S3 event notification', 'ECS service auto scaling with a target tracking policy', 'An AWS Backup plan'],
      answer: ['C'],
      explanation: 'ECS service auto scaling adjusts the desired task count using CloudWatch metrics such as CPU utilisation.',
    },
  ],
  keyFacts: [
    'ECS building blocks: cluster, task definition, task, service; launch types EC2 or Fargate.',
    'Task role = permissions for application code; execution role = pull images from ECR and send logs to CloudWatch.',
    'awsvpc network mode gives every task its own ENI and security group (required for Fargate).',
    'The ALB integrates with ECS using dynamic port mapping so multiple tasks per instance can share a host.',
    'Service auto scaling and capacity providers scale tasks and (for EC2) the underlying instances.',
    'ECR is the managed registry; ECR image scanning and lifecycle policies help with security and cost.',
  ],
  traps: [
    { clue: 'Containers, no servers to manage', answer: 'Fargate (ECS or EKS).' },
    { clue: 'Need Kubernetes', answer: 'Amazon EKS.' },
    { clue: 'Container needs AWS API access', answer: 'IAM task role.' },
    { clue: 'Short, event-driven code under 15 minutes', answer: 'Lambda rather than containers.' },
  ],
  related: ['fargate', 'eks', 'ecr', 'elb', 'cloudwatch'],
  sources: [
    { title: 'What is Amazon ECS?', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html' },
    { title: 'Amazon ECS task definitions', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html' },
    { title: 'Amazon ECS task IAM role', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html' },
    { title: 'Amazon ECS services', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html' },
    { title: 'AWS CLI ecs commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ecs/index.html' },
  ],
};
