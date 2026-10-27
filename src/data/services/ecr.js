import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon ECR. Schema: see s3.js. */
export default {
  tagline: 'Fully managed, secure registry to store, manage and deploy container images.',
  intro: [
    'Amazon Elastic Container Registry (ECR) is a managed container image registry that stores, shares and deploys Docker and OCI images, with high availability and no registry servers to run.',
    'Private repositories are controlled with IAM and repository policies; Amazon ECR Public hosts public images; clients authenticate with a short-lived token from aws ecr get-login-password.',
    'Image scanning finds software vulnerabilities (basic scanning, or enhanced continuous scanning through Amazon Inspector) and tag immutability prevents tags from being overwritten.',
    'Lifecycle policies automatically expire old or untagged images to control storage cost; images are encrypted at rest (AES-256 or KMS).',
    'Replication copies images to other Regions or accounts, and ECR integrates directly with ECS, EKS, Fargate and Lambda container images, usually pulled over a VPC endpoint from private subnets.',
  ],
  useCases: [
    { title: 'CI/CD image store', detail: 'Build pipelines push versioned images that ECS or EKS deploy.' },
    { title: 'Secure image supply chain', detail: 'Scan on push and block deployments with critical vulnerabilities.' },
    { title: 'Multi-Region deployments', detail: 'Replicate images so each Region pulls locally.' },
  ],
  importance: {
    points: [
      'Domain 2 container architecture questions assume ECR as the AWS-native registry for ECS, EKS and Fargate.',
      'Know the cost and security features: lifecycle policies, scanning with Inspector, replication, VPC endpoints.',
    ],
  },
  cli: [
    { command: 'aws ecr create-repository --repository-name web --image-scanning-configuration scanOnPush=true', description: 'Create a repository with scan-on-push.' },
    { command: 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 111122223333.dkr.ecr.us-east-1.amazonaws.com', description: 'Authenticate Docker to your registry.' },
    { command: 'aws ecr put-lifecycle-policy --repository-name web --lifecycle-policy-text file://policy.json', description: 'Expire old images automatically.' },
    { command: 'aws ecr describe-images --repository-name web', description: 'List images and their scan status.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list images in a repository',
        language: 'python',
        code: `import boto3

ecr = boto3.client("ecr")
for img in ecr.describe_images(repositoryName="web")["imageDetails"]:
    print(img.get("imageTags"), img["imagePushedAt"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Build, scan and deploy a container',
      scenario: 'A pipeline builds a container image and must refuse images with critical vulnerabilities.',
      steps: [
        'Push the image to a private ECR repository with scan-on-push enabled.',
        'Check Inspector findings and fail the pipeline on critical findings.',
        'Deploy the passing image tag to ECS or EKS, pulling through a VPC endpoint.',
        'Use a lifecycle policy to remove untagged images after 14 days.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon ECR image flow',
    nodes: [
      ['dev', 'Developer / CI pipeline', 'actor', 0, 1],
      ['ecr', 'Amazon ECR private repository', 'storage', 1, 1],
      ['scan', 'Image scanning (Inspector)', 'security', 1, 0],
      ['rep', 'Replica in another Region/account', 'storage', 1, 2],
      ['run', 'ECS / EKS / Fargate / Lambda', 'compute', 2, 1],
    ],
    edges: [
      ['dev', 'ecr', 'docker push'],
      ['ecr', 'scan', 'Scans for CVEs'],
      ['ecr', 'rep', 'Replication'],
      ['ecr', 'run', 'Pull image'],
    ],
    steps: [
      'Images are pushed to a private repository after authenticating with an ECR token.',
      'Scanning checks for vulnerabilities and lifecycle policies clean up old images.',
      'Container services pull the image, optionally from a replica in their own Region.',
    ],
  },
  questionTypes: [
    { pattern: 'Where to store container images on AWS', hint: 'Amazon ECR.' },
    { pattern: 'Reduce image storage cost or scan images', hint: 'Lifecycle policies; image scanning.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A team needs a managed, private registry for Docker images that integrates with ECS and EKS and uses IAM for access control. Which service should be used?',
      options: ['Amazon ECR', 'Amazon EFS', 'Amazon S3 Glacier', 'AWS CodeCommit'],
      answer: ['A'],
      explanation: 'ECR is the AWS-managed container registry integrated with IAM, ECS, EKS and Fargate.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Thousands of untagged, old images are increasing repository storage cost. What is the BEST way to clean them up automatically?',
      options: ['Manually deleting images each month', 'AWS Backup', 'An ECR lifecycle policy', 'A larger EBS volume'],
      answer: ['C'],
      explanation: 'Lifecycle policies expire images by age or count automatically.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which ECR features help improve the security of container images? (Select TWO.)',
      multi: true,
      options: ['Route 53 health checks', 'Image scanning for vulnerabilities', 'Tag immutability', 'S3 Transfer Acceleration', 'Automatic Multi-AZ RDS failover'],
      answer: ['B', 'C'],
      explanation: 'ECR can scan images and prevent tags from being overwritten; the other options are unrelated.',
    },
  ],
  keyFacts: [
    'Managed private (and public) container registry; Docker and OCI images.',
    'Auth with IAM and a short-lived token; repository policies for sharing.',
    'Scan on push (basic or enhanced with Inspector), tag immutability, lifecycle policies.',
    'Cross-Region and cross-account replication; KMS encryption; VPC endpoints for private pulls.',
  ],
  traps: [
    { clue: 'Store and pull container images', answer: 'ECR.' },
    { clue: 'Run the containers', answer: 'ECS, EKS or Fargate.' },
  ],
  related: ['ecs', 'eks', 'fargate', 'inspector', 'lambda'],
  sources: [
    { title: 'What is Amazon ECR?', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html' },
    { title: 'Image scanning in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html' },
    { title: 'Lifecycle policies in Amazon ECR', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html' },
    { title: 'AWS CLI ecr commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ecr/index.html' },
  ],
};
