import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon EKS. Schema: see s3.js. */
export default {
  tagline: 'Managed Kubernetes on AWS: AWS runs the control plane, you choose how the worker nodes run.',
  intro: [
    'Amazon Elastic Kubernetes Service (EKS) is a managed, certified Kubernetes-conformant service, so existing Kubernetes applications and tooling work without refactoring.',
    'In standard EKS, AWS manages the Kubernetes control plane (API servers and etcd) and runs it across multiple Availability Zones; you manage the data plane unless you choose EKS Auto Mode, which also manages nodes.',
    'Worker compute options are managed node groups (EC2 with automated provisioning and updates), self-managed EC2 nodes, AWS Fargate (serverless pods) and EKS Auto Mode; EKS Anywhere and Hybrid Nodes extend Kubernetes to your own data centres.',
    'Security integrates IAM with Kubernetes: IAM roles control who can reach the cluster API, and IAM roles for service accounts or EKS Pod Identity give individual pods least-privilege access to AWS services.',
    'Networking uses the Amazon VPC CNI so pods get VPC IP addresses; the AWS Load Balancer Controller provisions ALBs and NLBs for Kubernetes Ingress and Service resources.',
    'Pick EKS over ECS when you need Kubernetes portability, its ecosystem or existing Kubernetes skills; pick ECS when you want the simplest AWS-native container orchestration.',
  ],
  useCases: [
    { title: 'Run existing Kubernetes workloads on AWS', detail: 'Migrate clusters without changing manifests or Helm charts.' },
    { title: 'Hybrid and multi-cloud portability', detail: 'Same Kubernetes API on AWS, on premises (EKS Anywhere / Hybrid Nodes) and elsewhere.' },
    { title: 'Microservices at scale', detail: 'Autoscale pods and nodes (Karpenter, Cluster Autoscaler or Auto Mode) behind ALBs.' },
  ],
  importance: {
    points: [
      'Domain 2 (decoupled, scalable architectures) and Domain 3 (high-performing compute) include container orchestration choices: ECS vs EKS vs Fargate vs Lambda.',
      'The usual trigger words are "Kubernetes", "portability" or "existing Kubernetes tooling", which point to EKS.',
    ],
  },
  cli: [
    { command: 'aws eks create-cluster --name prod --role-arn <role-arn> --resources-vpc-config subnetIds=subnet-0a,subnet-0b,securityGroupIds=sg-0abc', description: 'Create the managed control plane.' },
    { command: 'aws eks create-nodegroup --cluster-name prod --nodegroup-name workers --node-role <node-role-arn> --subnets subnet-0a subnet-0b --scaling-config minSize=2,maxSize=6,desiredSize=3', description: 'Add a managed node group.' },
    { command: 'aws eks update-kubeconfig --name prod', description: 'Configure kubectl for the cluster.' },
    { command: 'aws eks create-fargate-profile --cluster-name prod --fargate-profile-name apps --pod-execution-role-arn <role-arn> --selectors namespace=apps', description: 'Run pods in the apps namespace on Fargate.' },
    { command: 'aws eks describe-cluster --name prod', description: 'Show cluster status and endpoint.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list clusters and their versions',
        language: 'python',
        code: `import boto3

eks = boto3.client("eks")
for name in eks.list_clusters()["clusters"]:
    info = eks.describe_cluster(name=name)["cluster"]
    print(name, info["version"], info["status"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Kubernetes microservices behind an ALB',
      scenario: 'A team already uses Kubernetes and wants to move to AWS with minimal change.',
      steps: [
        'Create an EKS cluster across three AZs and a managed node group (or use Auto Mode).',
        'Install the AWS Load Balancer Controller and create an Ingress that provisions an ALB.',
        'Use IAM roles for service accounts so pods read from S3 without static keys.',
        'Scale pods with the Horizontal Pod Autoscaler and nodes with Karpenter or Cluster Autoscaler.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon EKS architecture',
    nodes: [
      ['dev', 'kubectl / CI pipeline', 'actor', 0, 1],
      ['cp', 'EKS control plane (managed, multi-AZ)', 'management', 1, 1],
      ['ng', 'Managed node groups (EC2)', 'compute', 1, 0],
      ['fg', 'Fargate pods', 'compute', 1, 2],
      ['alb', 'Application Load Balancer (Ingress)', 'network', 2, 1],
      ['users', 'Clients', 'actor', 3, 1],
    ],
    edges: [
      ['dev', 'cp', 'Kubernetes API calls'],
      ['cp', 'ng', 'Schedules pods'],
      ['cp', 'fg', 'Serverless pods'],
      ['cp', 'alb', 'LB controller'],
      ['alb', 'users', 'Serves traffic'],
    ],
    steps: [
      'You or a CI pipeline send Kubernetes API requests to the managed control plane.',
      'The control plane schedules pods onto EC2 managed node groups or Fargate.',
      'The AWS Load Balancer Controller creates an ALB that exposes services to clients.',
    ],
  },
  questionTypes: [
    { pattern: 'Run Kubernetes on AWS without managing the control plane', hint: 'Amazon EKS.' },
    { pattern: 'ECS vs EKS', hint: 'Kubernetes portability = EKS; simplest AWS-native = ECS.' },
    { pattern: 'Serverless pods / no node management', hint: 'EKS on Fargate or EKS Auto Mode.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company runs production workloads on Kubernetes on premises and wants to move to AWS while keeping its existing manifests and tooling, and without operating the control plane. Which service should be used?',
      options: ['AWS Elastic Beanstalk', 'Amazon ECS', 'Amazon EKS', 'AWS Lambda'],
      answer: ['C'],
      explanation: 'EKS is managed Kubernetes and is conformant, so existing Kubernetes manifests work; AWS runs the control plane.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'An EKS team wants to run pods without provisioning or patching EC2 worker nodes. Which option achieves this?',
      options: ['Run the pods on AWS Fargate', 'Use Direct Connect', 'Use an EBS volume', 'Use larger EC2 instances'],
      answer: ['A'],
      explanation: 'EKS supports Fargate, which runs each pod in its own managed compute (EKS Auto Mode also manages nodes).',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Pods in an EKS cluster need read access to one S3 bucket. What is the MOST secure approach?',
      options: ['Give the node role full administrator access', 'Make the bucket public', 'Store an access key in the container image', 'Use IAM roles for service accounts (or EKS Pod Identity) with a least-privilege policy'],
      answer: ['D'],
      explanation: 'IAM roles for service accounts / Pod Identity give pods short-lived credentials scoped to their own role.',
    },
  ],
  keyFacts: [
    'EKS = managed Kubernetes control plane, multi-AZ; you pay per cluster plus the compute you use.',
    'Compute: managed node groups, self-managed nodes, Fargate, Auto Mode; hybrid with EKS Anywhere or Hybrid Nodes.',
    'IAM controls API access; IRSA or Pod Identity give pods IAM permissions.',
    'VPC CNI gives pods VPC IPs; AWS Load Balancer Controller provisions ALB/NLB.',
    'Choose EKS for Kubernetes needs; ECS for simpler AWS-native orchestration.',
  ],
  traps: [
    { clue: 'Kubernetes portability or existing Kubernetes tooling', answer: 'Amazon EKS.' },
    { clue: 'Simplest AWS-native container service', answer: 'Amazon ECS.' },
    { clue: 'No servers to manage for containers', answer: 'Fargate (with ECS or EKS).' },
  ],
  related: ['ecs', 'fargate', 'ecr', 'elb', 'ec2-auto-scaling', 'iam'],
  sources: [
    { title: 'What is Amazon EKS?', url: 'https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html' },
    { title: 'Manage compute resources by using nodes', url: 'https://docs.aws.amazon.com/eks/latest/userguide/eks-compute.html' },
    { title: 'Grant Kubernetes workloads access to AWS using service accounts', url: 'https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html' },
    { title: 'AWS CLI eks commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/eks/index.html' },
  ],
};
