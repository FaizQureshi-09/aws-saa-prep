import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS KMS. Schema: see s3.js. */
export default {
  tagline: 'Create and control the encryption keys used to protect your data across AWS services.',
  intro: [
    'AWS Key Management Service (KMS) creates and manages cryptographic keys; keys never leave KMS unencrypted, and KMS is integrated with most AWS storage, database and messaging services.',
    'Key types: AWS owned keys (invisible, free), AWS managed keys (aws/s3, aws/ebs - rotate automatically) and customer managed keys (you control policy, rotation, deletion).',
    'Access is controlled by the key policy (always required) combined with IAM policies and grants; every use is logged in AWS CloudTrail.',
    'Envelope encryption: KMS generates a data key (GenerateDataKey); the data key encrypts the data locally and is stored encrypted under the KMS key. The Encrypt API directly handles only small payloads (up to 4 KB).',
    'Keys are Regional; multi-Region keys let you use the same key material in more than one Region (for example for global tables or cross-Region replication).',
    'Customer managed keys support optional automatic rotation (yearly), a scheduled deletion waiting period (7-30 days), imported key material and custom key stores backed by CloudHSM.',
  ],
  useCases: [
    { title: 'Encrypt data at rest', detail: 'SSE-KMS for S3, EBS, RDS, DynamoDB, SQS and more using customer managed keys.' },
    { title: 'Audit and control key use', detail: 'Restrict who can use a key and review every use in CloudTrail.' },
    { title: 'Cross-account encrypted sharing', detail: 'Grant another account use of a key through the key policy.' },
    { title: 'Application-level encryption', detail: 'Envelope encryption with GenerateDataKey for large objects.' },
  ],
  importance: {
    points: [
      'Task 1.3 explicitly tests encrypting data at rest with KMS, access policies for encryption keys and rotating keys.',
      'KMS is the default answer for managed key control; CloudHSM is the answer when you need dedicated hardware control.',
      'Many questions combine KMS with S3, EBS, RDS and cross-account sharing.',
    ],
  },
  cli: [
    { command: 'aws kms create-key --description "app data key" --key-usage ENCRYPT_DECRYPT', description: 'Create a symmetric customer managed key.' },
    { command: 'aws kms create-alias --alias-name alias/app-data --target-key-id <key-id>', description: 'Create a friendly alias.' },
    { command: 'aws kms enable-key-rotation --key-id <key-id>', description: 'Turn on automatic yearly rotation.' },
    { command: 'aws kms encrypt --key-id alias/app-data --plaintext fileb://secret.txt --output text --query CiphertextBlob', description: 'Encrypt a small payload (4 KB maximum).' },
    { command: 'aws kms generate-data-key --key-id alias/app-data --key-spec AES_256', description: 'Get a data key for envelope encryption.' },
    { command: 'aws kms put-key-policy --key-id <key-id> --policy-name default --policy file://key-policy.json', description: 'Set the key policy.' },
    { command: 'aws kms schedule-key-deletion --key-id <key-id> --pending-window-in-days 7', description: 'Schedule deletion (7-30 day waiting period).' },
    { command: 'aws kms replicate-key --key-id <mrk-id> --replica-region us-east-1', description: 'Replicate a multi-Region key.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): envelope encryption data key',
        language: 'python',
        code: `import boto3

kms = boto3.client("kms")
resp = kms.generate_data_key(KeyId="alias/app-data", KeySpec="AES_256")

plaintext_key = resp["Plaintext"]        # use locally to encrypt data, then discard
encrypted_key = resp["CiphertextBlob"]   # store next to the encrypted data

# Later: recover the data key to decrypt
data_key = kms.decrypt(CiphertextBlob=encrypted_key)["Plaintext"]`,
      },
    ],
  },
  examples: [
    {
      title: 'SSE-KMS bucket with a restricted key',
      scenario: 'Sensitive reports in S3 must be encrypted with a key that only the analytics role may use, with every use auditable.',
      steps: [
        'Create a customer managed KMS key; key policy allows the analytics role (kms:Decrypt, kms:GenerateDataKey).',
        'Set the bucket default encryption to SSE-KMS with that key.',
        'The analytics role needs both S3 and KMS permissions to read objects.',
        'Review kms:Decrypt events in CloudTrail for audits.',
      ],
    },
  ],
  diagram: {
    title: 'KMS envelope encryption',
    nodes: [
      ['app', 'Application / AWS service', 'compute', 0, 1],
      ['kms', 'AWS KMS (KMS key)', 'security', 1, 1],
      ['dk', 'Data key (plaintext + encrypted)', 'security', 2, 1],
      ['data', 'Encrypted data + encrypted data key', 'storage', 3, 1],
      ['trail', 'CloudTrail log', 'integration', 1, 0],
    ],
    edges: [
      ['app', 'kms', '1. GenerateDataKey'],
      ['kms', 'dk', '2. Returns data key'],
      ['dk', 'data', '3. Encrypt data locally'],
      ['kms', 'trail', 'Every call logged', 'dashed'],
    ],
    steps: [
      'The application (or an AWS service on its behalf) asks KMS for a data key under a KMS key.',
      'KMS returns the key in plaintext and in encrypted form.',
      'The plaintext data key encrypts the data locally and is then discarded; the encrypted data key is stored with the data.',
      'To decrypt, the encrypted data key is sent to KMS, which checks the key policy before returning the plaintext key. All calls are logged in CloudTrail.',
    ],
  },
  questionTypes: [
    { pattern: 'Who can use a key?', hint: 'Key policy first, then IAM policy/grants; cross-account needs both sides.' },
    { pattern: 'Choose the encryption approach', hint: 'KMS for managed control and auditing; CloudHSM for dedicated HSM and full control.' },
    { pattern: 'Rotate keys with least effort', hint: 'Enable automatic rotation on customer managed keys.' },
    { pattern: 'Encrypt across Regions', hint: 'Multi-Region keys, or re-encrypt snapshots when copying.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company must encrypt data in Amazon S3 with keys it controls, audit every use of the key, and rotate the key annually with minimal operational effort. Which solution meets these requirements?',
      options: ['SSE-S3', 'SSE-KMS with a customer managed key and automatic rotation enabled', 'Client-side encryption with keys in a text file', 'SSE-C with keys stored on EC2'],
      answer: ['B'],
      explanation: 'SSE-KMS with a customer managed key gives control over the key policy, CloudTrail logs every use, and KMS can rotate the key automatically each year.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A user can read an S3 object encrypted with SSE-KMS only if which permissions are in place?',
      options: ['Only s3:GetObject', 's3:GetObject and permission to use the KMS key (kms:Decrypt)', 'Only kms:Decrypt', 'AdministratorAccess is required'],
      answer: ['B'],
      explanation: 'For SSE-KMS objects the caller needs access to the object and permission to use the KMS key (through the key policy and/or IAM).',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company requires dedicated, single-tenant hardware security modules whose keys are under the company\'s exclusive control for compliance. Which service meets this?',
      options: ['AWS KMS with an AWS managed key', 'AWS CloudHSM', 'AWS Secrets Manager', 'AWS Certificate Manager'],
      answer: ['B'],
      explanation: 'CloudHSM provides dedicated, customer-controlled HSMs. KMS is a multi-tenant managed service (although it can use CloudHSM as a custom key store).',
    },
    {
      source: 'mock', domain: 1,
      stem: 'An application must encrypt files of several gigabytes. Why is envelope encryption used instead of calling KMS Encrypt directly on the file?',
      options: ['The Encrypt API only accepts up to 4 KB of data, so a data key encrypts the file locally', 'KMS cannot decrypt data', 'S3 does not support encryption', 'Envelope encryption is cheaper than any other method for 1 KB data'],
      answer: ['A'],
      explanation: 'The Encrypt API handles small payloads (up to 4 KB). For larger data KMS generates a data key that encrypts the data locally; KMS protects the data key.',
    },
  ],
  keyFacts: [
    'KMS keys are Regional (except multi-Region keys); symmetric keys never leave KMS in plaintext.',
    'Key types: AWS owned, AWS managed (rotated automatically), customer managed (you control policy and rotation).',
    'The key policy is the primary access mechanism; without it (or IAM allowed through the policy) no one can use the key.',
    'Direct Encrypt is limited to 4 KB; use GenerateDataKey and envelope encryption for larger data.',
    'Automatic rotation (optional, customer managed keys) creates new key material yearly and keeps old material to decrypt older data.',
    'Deleting a key is irreversible after a 7-30 day waiting period; data encrypted under it becomes unrecoverable.',
    'KMS usage is logged in CloudTrail; request rates are subject to quotas shared by services using the key (relevant for high-throughput SSE-KMS on S3).',
    'To copy an encrypted snapshot or object to another Region you re-encrypt with a key in the destination Region (or use a multi-Region key).',
  ],
  traps: [
    { clue: 'Customer controls and audits the key', answer: 'SSE-KMS with a customer managed key.' },
    { clue: 'Exclusive, dedicated HSM', answer: 'CloudHSM.' },
    { clue: 'Large object encryption', answer: 'Envelope encryption (GenerateDataKey).' },
    { clue: 'Key material must stay on premises', answer: 'SSE-C / client-side encryption (or external key store).' },
    { clue: 'Rotate with the least effort', answer: 'Enable automatic key rotation.' },
  ],
  related: ['s3', 'ebs', 'rds', 'cloudhsm', 'secrets-manager', 'cloudtrail'],
  sources: [
    { title: 'What is AWS Key Management Service?', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html' },
    { title: 'Key policies in AWS KMS', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html' },
    { title: 'Rotating AWS KMS keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html' },
    { title: 'Envelope encryption (cryptographic details)', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping' },
    { title: 'Multi-Region keys', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html' },
    { title: 'AWS CLI kms commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/kms/index.html' },
  ],
};
