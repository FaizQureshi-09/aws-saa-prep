import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon SageMaker AI. Schema: see s3.js. */
export default {
  tagline: 'Build, train and deploy your own machine learning models when pre-trained AI services do not fit.',
  intro: [
    'Amazon SageMaker AI is a fully managed machine learning service for building, training and deploying custom ML models at scale; the current exam guide lists it as Amazon SageMaker AI.',
    'It covers the ML lifecycle: data labelling (Ground Truth), notebooks and Studio for development, managed training jobs (including Spot training), hyperparameter tuning, and model deployment to endpoints.',
    'Inference options include real-time endpoints, serverless inference, asynchronous inference for large payloads and batch transform for offline scoring; endpoints can auto scale.',
    'SageMaker JumpStart offers pre-built models and solutions, Autopilot builds models automatically from tabular data, and Model Monitor and Clarify track quality and bias.',
    'Training data and model artefacts normally live in Amazon S3, and SageMaker integrates with IAM, VPC, KMS and CloudWatch for security and operations.',
    'Choose SageMaker when you need a custom model; choose the pre-trained AI services (Rekognition, Comprehend, Textract, Transcribe, Polly, Translate, Lex) when a ready-made API covers the task.',
  ],
  useCases: [
    { title: 'Custom prediction models', detail: 'Churn, demand forecasting or fraud scoring trained on your own data.' },
    { title: 'Deploy models for real-time inference', detail: 'Low-latency endpoints that auto scale with traffic.' },
    { title: 'Batch scoring', detail: 'Score millions of records from S3 offline with batch transform.' },
  ],
  importance: {
    points: [
      'Appears as the "custom ML" answer in AI-services matching questions; the rest of the AI services are pre-trained APIs.',
      'You are not expected to know algorithms, only the service role and the S3, IAM and endpoint pattern.',
    ],
  },
  cli: [
    { command: 'aws sagemaker create-training-job --cli-input-json file://training-job.json', description: 'Start a managed training job from a JSON definition.' },
    { command: 'aws sagemaker create-endpoint --endpoint-name churn --endpoint-config-name churn-config', description: 'Deploy a model endpoint from an endpoint configuration.' },
    { command: 'aws sagemaker list-endpoints', description: 'List endpoints and their status.' },
    { command: 'aws sagemaker-runtime invoke-endpoint --endpoint-name churn --content-type text/csv --body fileb://sample.csv out.json', description: 'Send a prediction request.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): call a deployed endpoint',
        language: 'python',
        code: `import boto3

runtime = boto3.client("sagemaker-runtime")
resp = runtime.invoke_endpoint(
    EndpointName="churn",
    ContentType="text/csv",
    Body="42,1,0,350.5",
)
print(resp["Body"].read().decode())`,
      },
    ],
  },
  examples: [
    {
      title: 'Train and deploy a churn model',
      scenario: 'A telecom wants to predict customer churn from its own usage history.',
      steps: [
        'Store prepared training data in S3.',
        'Run a SageMaker training job (optionally on Spot) and save the model artefact to S3.',
        'Deploy it to an auto-scaling real-time endpoint.',
        'Call the endpoint from the application; monitor drift with Model Monitor.',
      ],
    },
  ],
  diagram: {
    title: 'SageMaker training to inference',
    nodes: [
      ['s3', 'Training data in S3', 'storage', 0, 1],
      ['studio', 'SageMaker Studio / notebooks', 'ml', 1, 0],
      ['train', 'Managed training job', 'ml', 1, 1],
      ['model', 'Model artefact in S3', 'storage', 2, 1],
      ['ep', 'Inference endpoint (auto scaling)', 'ml', 3, 1],
    ],
    edges: [
      ['s3', 'train', 'Training data'],
      ['studio', 'train', 'Prepare and launch'],
      ['train', 'model', 'Saves model'],
      ['model', 'ep', 'Deploy'],
    ],
    steps: [
      'Data scientists prepare data in S3 and develop in Studio or notebooks.',
      'A managed training job produces a model artefact stored in S3.',
      'The model is deployed to an endpoint that applications call for predictions.',
    ],
  },
  questionTypes: [
    { pattern: 'Custom ML model: build, train, deploy', hint: 'Amazon SageMaker AI.' },
    { pattern: 'Pre-trained API vs custom model', hint: 'Use AI services if a ready API fits; SageMaker if you need custom training.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A data science team needs to build, train and deploy a custom machine learning model using its own data, with managed infrastructure. Which service should be used?',
      options: ['Amazon Textract', 'Amazon SageMaker AI', 'Amazon Translate', 'Amazon Polly'],
      answer: ['B'],
      explanation: 'SageMaker provides managed training and deployment for custom ML models; the others are pre-trained task-specific APIs.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company must score a very large dataset in S3 once a night, without keeping an endpoint running. Which SageMaker option fits?',
      options: ['A permanent real-time endpoint', 'A larger notebook instance', 'Batch transform', 'Amazon Lex'],
      answer: ['C'],
      explanation: 'Batch transform scores data in S3 offline and shuts down when finished, avoiding endpoint costs.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Which options can reduce the cost of SageMaker training or inference? (Select TWO.)',
      multi: true,
      options: ['Keeping large endpoints idle 24x7', 'Storing data on instance store only', 'Disabling auto scaling for all endpoints', 'Serverless or batch inference for intermittent traffic', 'Managed Spot training'],
      answer: ['D', 'E'],
      explanation: 'Spot training uses spare capacity at a discount, and serverless or batch inference avoids paying for idle endpoints.',
    },
  ],
  keyFacts: [
    'SageMaker AI = custom ML lifecycle: label, build, train, tune, deploy, monitor.',
    'Inference: real-time, serverless, asynchronous and batch transform.',
    'Data and model artefacts in S3; secured with IAM, VPC and KMS.',
    'Use pre-trained AI services when they cover the use case.',
  ],
  traps: [
    { clue: 'Custom model training and hosting', answer: 'SageMaker AI.' },
    { clue: 'Ready-made API for images, text, speech', answer: 'Rekognition, Comprehend, Transcribe, etc.' },
  ],
  related: ['s3', 'rekognition', 'comprehend', 'glue', 'lambda', 'kms'],
  sources: [
    { title: 'What is Amazon SageMaker AI?', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html' },
    { title: 'Deploy models for inference', url: 'https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html' },
    { title: 'AWS CLI sagemaker commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/sagemaker/index.html' },
  ],
};
