import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Batch. Schema: see s3.js. */
export default {
  tagline: 'Run batch computing jobs at any scale on managed compute, including Spot capacity.',
  intro: [
    'AWS Batch plans, schedules and runs batch computing jobs as containers on managed compute, so you do not install or operate a batch scheduler or cluster.',
    'Core concepts: a job definition (container image, vCPU and memory, command), a job queue (priority and scheduling) and a compute environment (the EC2, Spot or Fargate capacity that runs the jobs).',
    'Batch provisions the right amount and type of capacity based on queued jobs and scales it back down when work is done; managed compute environments can use Spot Instances to cut cost.',
    'It supports array jobs (many similar tasks), job dependencies, multi-node parallel jobs and retry strategies; jobs run in containers, with images typically stored in ECR.',
    'There is no charge for AWS Batch itself, only for the underlying resources; choose it for long-running or large-scale batch workloads that do not fit Lambda\'s 15-minute limit.',
  ],
  useCases: [
    { title: 'Large-scale data processing', detail: 'Process thousands of files, renders or simulations in parallel.' },
    { title: 'Financial and scientific modelling', detail: 'Run Monte Carlo or genomics pipelines on Spot capacity.' },
    { title: 'Scheduled batch workloads', detail: 'EventBridge or Step Functions submit jobs on a schedule or on S3 events.' },
  ],
  importance: {
    points: [
      'Domain 3 compute: the answer to "run many containerised batch jobs with automatic provisioning, cheaply".',
      'Contrast with Lambda (short, event-driven), EMR (big data frameworks) and Step Functions (orchestration).',
    ],
  },
  cli: [
    { command: 'aws batch create-compute-environment --compute-environment-name spot-ce --type MANAGED --compute-resources file://ce.json --service-role <role-arn>', description: 'Create a managed compute environment (for example Spot).' },
    { command: 'aws batch create-job-queue --job-queue-name main --priority 1 --compute-environment-order order=1,computeEnvironment=spot-ce', description: 'Create a job queue.' },
    { command: 'aws batch register-job-definition --job-definition-name render --type container --container-properties file://job.json', description: 'Register a container job definition.' },
    { command: 'aws batch submit-job --job-name frame-001 --job-queue main --job-definition render', description: 'Submit a job.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): submit an array job',
        language: 'python',
        code: `import boto3

batch = boto3.client("batch")
job = batch.submit_job(
    jobName="render-frames",
    jobQueue="main",
    jobDefinition="render",
    arrayProperties={"size": 100},
)
print(job["jobId"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Render 10,000 frames on Spot',
      scenario: 'A studio renders thousands of frames overnight and wants the lowest cost.',
      steps: [
        'Package the renderer as a container image in ECR and register a job definition.',
        'Create a Spot-based managed compute environment and a job queue.',
        'Submit an array job; Batch scales instances up, runs the jobs and scales down.',
        'Write outputs to S3; retries cover Spot interruptions.',
      ],
    },
  ],
  diagram: {
    title: 'AWS Batch architecture',
    nodes: [
      ['sub', 'Job submission (API, EventBridge)', 'integration', 0, 1],
      ['jd', 'Job definition (container, vCPU, memory)', 'management', 1, 0],
      ['queue', 'Job queue', 'management', 1, 1],
      ['ce', 'Compute environment (EC2 / Spot / Fargate)', 'compute', 2, 1],
      ['out', 'S3 results', 'storage', 3, 1],
    ],
    edges: [
      ['sub', 'queue', 'Submit jobs'],
      ['jd', 'queue', 'Defines job'],
      ['queue', 'ce', 'Scheduler places jobs'],
      ['ce', 'out', 'Writes results'],
    ],
    steps: [
      'Jobs are submitted to a queue with a job definition describing the container.',
      'The scheduler launches or scales capacity in the compute environment and runs the jobs.',
      'Results land in S3 and capacity scales back down when the queue is empty.',
    ],
  },
  questionTypes: [
    { pattern: 'Run many batch jobs on managed, scalable compute', hint: 'AWS Batch.' },
    { pattern: 'Cheapest batch compute', hint: 'Batch with Spot compute environments.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A research team must run tens of thousands of container-based simulations that take up to several hours each, with automatic capacity provisioning at the lowest cost. Which service is MOST appropriate?',
      options: ['AWS Batch with Spot Instances', 'AWS Lambda', 'Amazon SQS only', 'Amazon RDS'],
      answer: ['A'],
      explanation: 'Batch schedules containerised jobs on managed, scalable capacity including Spot; Lambda is limited to 15 minutes.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which AWS Batch component defines the container image, vCPU and memory a job needs?',
      options: ['Job queue', 'Job definition', 'Service-linked role', 'Compute environment'],
      answer: ['B'],
      explanation: 'The job definition holds the container properties; the queue prioritises jobs and the compute environment supplies capacity.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statements about AWS Batch are true? (Select TWO.)',
      multi: true,
      options: ['It replaces Amazon S3.', 'There is no additional charge for AWS Batch itself; you pay for the resources used.', 'It is limited to 15-minute jobs.', 'It only runs on premises.', 'It can provision Spot Instances in managed compute environments.'],
      answer: ['B', 'E'],
      explanation: 'Batch is free; capacity (EC2, Spot, Fargate) is billed. Jobs can run far longer than Lambda\'s 15 minutes.',
    },
  ],
  keyFacts: [
    'Components: job definition, job queue, compute environment.',
    'Managed compute environments can use On-Demand, Spot or Fargate and scale to zero.',
    'Array jobs and dependencies for parallel pipelines; retries cover Spot interruptions.',
    'No charge for Batch itself, only for the resources it uses.',
  ],
  traps: [
    { clue: 'Containerised batch jobs, long-running, scalable', answer: 'AWS Batch.' },
    { clue: 'Short event-driven functions', answer: 'Lambda.' },
  ],
  related: ['ec2', 'fargate', 'ecr', 'lambda', 'step-functions', 'cost-management'],
  sources: [
    { title: 'What is AWS Batch?', url: 'https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html' },
    { title: 'AWS Batch compute environments', url: 'https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html' },
    { title: 'AWS CLI batch commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/batch/index.html' },
  ],
};
