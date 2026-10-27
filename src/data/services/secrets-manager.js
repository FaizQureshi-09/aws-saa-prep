import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Secrets Manager. Schema: see s3.js. */
export default {
  tagline: 'Store, retrieve and automatically rotate database credentials, API keys and other secrets.',
  intro: [
    'AWS Secrets Manager stores secrets (credentials, API keys, tokens) encrypted with AWS KMS and returns them to applications through API calls instead of hard-coded values.',
    'Automatic rotation uses a Lambda function on a schedule; built-in rotation exists for Amazon RDS, Aurora, Redshift and DocumentDB credentials.',
    'Access is controlled with IAM policies and resource-based policies (including cross-account); secrets are versioned with staging labels such as AWSCURRENT and AWSPREVIOUS.',
    'Secrets can be replicated to other Regions for multi-Region applications and DR.',
    'RDS and other services can manage the master user password in Secrets Manager for you.',
    'Compared with Systems Manager Parameter Store: Secrets Manager adds native rotation and cross-Region replication (with a per-secret cost); Parameter Store SecureString is cheaper/free for simple configuration values.',
  ],
  useCases: [
    { title: 'Database credentials without hard-coding', detail: 'Applications fetch credentials at runtime; rotation updates the database and the secret together.' },
    { title: 'Third-party API keys', detail: 'Store and audit access to SaaS tokens.' },
    { title: 'Cross-account secret sharing', detail: 'Resource policy lets another account read a secret.' },
  ],
  importance: {
    points: [
      'Task 1.2 lists "application configuration and credentials security" and AWS Secrets Manager by name; Task 2.1 uses it as a managed-service example.',
      'Common decision: Secrets Manager vs Parameter Store vs environment variables.',
      'Pairs with RDS, Lambda and KMS in credential-rotation scenarios.',
    ],
  },
  cli: [
    { command: 'aws secretsmanager create-secret --name prod/db --secret-string \'{"username":"app","password":"S3cure!"}\'', description: 'Create a secret.' },
    { command: 'aws secretsmanager get-secret-value --secret-id prod/db', description: 'Retrieve the current secret value.' },
    { command: 'aws secretsmanager rotate-secret --secret-id prod/db --rotation-lambda-arn <arn> --rotation-rules AutomaticallyAfterDays=30', description: 'Enable automatic rotation every 30 days.' },
    { command: 'aws secretsmanager replicate-secret-to-regions --secret-id prod/db --add-replica-regions Region=us-east-1', description: 'Replicate a secret to another Region.' },
    { command: 'aws secretsmanager put-resource-policy --secret-id prod/db --resource-policy file://policy.json', description: 'Attach a resource policy (cross-account access).' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): fetch a database secret',
        language: 'python',
        code: `import boto3, json

sm = boto3.client("secretsmanager", region_name="ap-south-1")
secret = json.loads(sm.get_secret_value(SecretId="prod/db")["SecretString"])
conn_args = {"user": secret["username"], "password": secret["password"]}`,
      },
    ],
  },
  examples: [
    {
      title: 'Rotate an RDS password automatically',
      scenario: 'Policy requires database credentials to change every 30 days without application downtime.',
      steps: [
        'Store the RDS credentials in Secrets Manager and enable rotation with the managed rotation Lambda.',
        'Applications call GetSecretValue (cache it) rather than storing the password.',
        'The IAM role of the application allows secretsmanager:GetSecretValue on that secret only.',
      ],
    },
  ],
  diagram: {
    title: 'Secrets Manager with automatic rotation',
    nodes: [
      ['app', 'Application (IAM role)', 'compute', 0, 1],
      ['sm', 'Secrets Manager secret', 'security', 1, 1],
      ['rot', 'Rotation Lambda', 'compute', 2, 0],
      ['db', 'RDS database', 'database', 2, 2],
      ['kms', 'KMS key', 'security', 1, 0],
    ],
    edges: [
      ['app', 'sm', '1. GetSecretValue'],
      ['kms', 'sm', 'Encrypts secret'],
      ['sm', 'rot', '2. Rotate on schedule'],
      ['rot', 'db', '3. Change password'],
    ],
    steps: [
      'The application, using its IAM role, retrieves the current secret value at runtime.',
      'Secrets Manager encrypts the secret with a KMS key.',
      'On the rotation schedule it invokes a Lambda function that sets a new password in the database and updates the secret.',
    ],
  },
  questionTypes: [
    { pattern: 'Rotate credentials automatically', hint: 'Secrets Manager with a rotation Lambda (native for RDS).' },
    { pattern: 'Secrets Manager vs Parameter Store', hint: 'Rotation and replication = Secrets Manager; cheap config/strings = Parameter Store.' },
    { pattern: 'Avoid hard-coded credentials', hint: 'IAM role + Secrets Manager lookup.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company\'s policy requires database passwords to rotate every 30 days automatically with no application code changes beyond fetching the secret at runtime. Which solution meets this requirement?',
      options: ['Store the password in a text file on S3', 'Store the password in AWS Secrets Manager and enable automatic rotation', 'Store the password in an environment variable', 'Store the password in the AMI'],
      answer: ['B'],
      explanation: 'Secrets Manager supports scheduled rotation (natively for RDS) and applications simply retrieve the current value at runtime.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'An application needs to store non-sensitive configuration strings and a few encrypted parameters at the lowest cost, with no need for automatic rotation. Which service is MOST appropriate?',
      options: ['AWS Secrets Manager for each value', 'AWS Systems Manager Parameter Store', 'Amazon RDS', 'AWS CloudHSM'],
      answer: ['B'],
      explanation: 'Parameter Store provides hierarchical parameters (including encrypted SecureString) with a free standard tier; Secrets Manager adds rotation at a per-secret cost.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A Lambda function must read a database secret. Which is the BEST way to authorise it?',
      options: ['Embed an IAM user\'s access keys in the function code', 'Grant secretsmanager:GetSecretValue on the specific secret to the function\'s execution role', 'Make the secret publicly readable', 'Store the secret in the function\'s environment variables in plain text'],
      answer: ['B'],
      explanation: 'Least privilege through the execution role avoids long-term keys and plain-text secrets.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An application deployed in two Regions needs the same database credentials available locally in each Region. What should be configured?',
      options: ['Replicate the secret to the second Region using Secrets Manager multi-Region replication', 'Copy the password into user data manually', 'Use a single Region secret for both and accept cross-Region calls only', 'Store the password in DNS TXT records'],
      answer: ['A'],
      explanation: 'Secrets Manager can replicate secrets to other Regions so each Region reads locally and rotation stays in sync.',
    },
  ],
  keyFacts: [
    'Secrets are encrypted with KMS (AWS managed or customer managed key) and every access is logged in CloudTrail.',
    'Native automatic rotation supports RDS, Aurora, Redshift and DocumentDB; other secret types use a custom rotation Lambda.',
    'Versions use staging labels AWSCURRENT / AWSPREVIOUS / AWSPENDING during rotation.',
    'Multi-Region replication and cross-account access (resource policy) are supported.',
    'Parameter Store: free standard tier, hierarchies, SecureString; no built-in rotation.',
    'Applications should cache secret values rather than call the API on every request.',
  ],
  traps: [
    { clue: 'Automatic credential rotation', answer: 'Secrets Manager.' },
    { clue: 'Cheap application configuration values', answer: 'Systems Manager Parameter Store.' },
    { clue: 'No hard-coded credentials in code', answer: 'IAM role + Secrets Manager.' },
    { clue: 'Master password for RDS managed for you', answer: 'RDS-managed master user password in Secrets Manager.' },
  ],
  related: ['kms', 'iam', 'rds', 'lambda', 'systems-manager'],
  sources: [
    { title: 'What is AWS Secrets Manager?', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html' },
    { title: 'Rotate AWS Secrets Manager secrets', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html' },
    { title: 'Replicate secrets across Regions', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/replicate-secrets.html' },
    { title: 'AWS CLI secretsmanager commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/index.html' },
  ],
};
