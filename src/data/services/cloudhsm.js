import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS CloudHSM. Schema: see s3.js. */
export default {
  tagline: 'Dedicated, single-tenant hardware security modules in your VPC where you alone control the keys.',
  intro: [
    'AWS CloudHSM provides dedicated hardware security modules (HSMs) in the AWS Cloud, validated to FIPS 140 Level 3, for generating and using your own cryptographic keys.',
    'You create a cluster of HSMs across multiple Availability Zones inside your VPC; AWS manages the hardware, but only you manage the keys and the HSM users, and AWS cannot see or recover your key material.',
    'Applications use standard APIs (PKCS#11, Java JCE, Microsoft CNG/KSP, OpenSSL) through the CloudHSM client to sign, encrypt and perform key operations.',
    'Compared with AWS KMS (multi-tenant, fully managed, deeply integrated with AWS services), CloudHSM is chosen for single-tenancy, full key control or contractual compliance requirements.',
    'KMS can use a CloudHSM cluster as a custom key store, so AWS services keep using KMS APIs while the key material stays in your own HSMs.',
  ],
  useCases: [
    { title: 'Regulatory single-tenant key storage', detail: 'Meet requirements that keys live in dedicated HSMs that the customer controls.' },
    { title: 'Offload TLS and signing', detail: 'SSL/TLS offload for web servers and certificate authority private keys.' },
    { title: 'Database transparent data encryption', detail: 'Store master keys for Oracle TDE or similar in your HSM.' },
  ],
  importance: {
    points: [
      'A Domain 1 data-protection option; the exam question is almost always KMS vs CloudHSM.',
      'Trigger words: "dedicated hardware", "single-tenant", "customer-controlled keys that AWS cannot access", "FIPS 140 Level 3".',
    ],
  },
  cli: [
    { command: 'aws cloudhsmv2 create-cluster --hsm-type hsm2m.medium --subnet-ids subnet-0a subnet-0b', description: 'Create a CloudHSM cluster in two subnets.' },
    { command: 'aws cloudhsmv2 create-hsm --cluster-id cluster-abc --availability-zone us-east-1a', description: 'Add an HSM to the cluster in an AZ.' },
    { command: 'aws cloudhsmv2 describe-clusters', description: 'List clusters and their HSMs.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list CloudHSM clusters',
        language: 'python',
        code: `import boto3

hsm = boto3.client("cloudhsmv2")
for c in hsm.describe_clusters()["Clusters"]:
    print(c["ClusterId"], c["State"], len(c["Hsms"]), "HSM(s)")`,
      },
    ],
  },
  examples: [
    {
      title: 'Customer-controlled keys for a regulated workload',
      scenario: 'A payment processor must keep signing keys in dedicated hardware that AWS cannot access.',
      steps: [
        'Create a CloudHSM cluster with HSMs in two or more AZs.',
        'Initialise the cluster, create crypto users and install the CloudHSM client on application servers.',
        'Generate keys inside the HSMs and sign through PKCS#11.',
        'Optionally expose them to AWS services through a KMS custom key store.',
      ],
    },
  ],
  diagram: {
    title: 'CloudHSM cluster',
    nodes: [
      ['app', 'Application (PKCS#11 / JCE client)', 'compute', 0, 1],
      ['cluster', 'CloudHSM cluster (HSMs in 2+ AZs)', 'security', 1, 1],
      ['kms', 'KMS custom key store', 'security', 1, 0],
      ['bak', 'Encrypted backups', 'storage', 1, 2],
    ],
    edges: [
      ['app', 'cluster', 'Crypto operations'],
      ['kms', 'cluster', 'Keys stay in HSM'],
      ['cluster', 'bak', 'Automatic backups'],
    ],
    steps: [
      'Applications call the HSMs through standard crypto APIs and the CloudHSM client.',
      'The cluster spans AZs for availability; keys are generated and used only inside the HSMs.',
      'Backups are encrypted, and KMS can use the cluster as a custom key store.',
    ],
  },
  questionTypes: [
    { pattern: 'Dedicated hardware / single-tenant key control', hint: 'AWS CloudHSM.' },
    { pattern: 'KMS vs CloudHSM', hint: 'Managed multi-tenant (KMS) vs customer-controlled dedicated HSM (CloudHSM).' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company must store encryption keys in dedicated single-tenant hardware that only the company can manage, to satisfy a regulator. Which service should be used?',
      options: ['AWS Certificate Manager', 'AWS CloudHSM', 'AWS Secrets Manager', 'AWS KMS with AWS managed keys'],
      answer: ['B'],
      explanation: 'CloudHSM provides dedicated HSMs where the customer exclusively controls the keys.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which API standards can applications use to work with AWS CloudHSM? (Select TWO.)',
      multi: true,
      options: ['PKCS#11', 'DNS', 'SMTP', 'Java Cryptography Extension (JCE)', 'FTP'],
      answer: ['A', 'D'],
      explanation: 'CloudHSM supports PKCS#11, JCE, CNG/KSP and OpenSSL integrations.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A team wants AWS services such as S3 to use KMS keys whose key material stays in the company\'s own HSMs. What should be configured?',
      options: ['A KMS custom key store backed by CloudHSM', 'An S3 bucket policy', 'An AWS owned key', 'A Route 53 resolver rule'],
      answer: ['A'],
      explanation: 'A custom key store links KMS to a CloudHSM cluster so key material remains in your HSMs.',
    },
  ],
  keyFacts: [
    'Dedicated single-tenant HSMs validated to FIPS 140 Level 3, deployed in your VPC.',
    'You control keys and HSM users; AWS cannot access or recover your keys.',
    'Cluster across AZs for high availability; automatic encrypted backups.',
    'APIs: PKCS#11, JCE, CNG/KSP, OpenSSL; KMS custom key store integration.',
  ],
  traps: [
    { clue: 'Dedicated hardware, customer-only key control', answer: 'CloudHSM.' },
    { clue: 'Managed encryption integrated with most AWS services', answer: 'KMS.' },
  ],
  related: ['kms', 'secrets-manager', 'acm', 'vpc'],
  sources: [
    { title: 'What is AWS CloudHSM?', url: 'https://docs.aws.amazon.com/cloudhsm/latest/userguide/introduction.html' },
    { title: 'AWS KMS custom key stores', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/key-store-overview.html' },
    { title: 'AWS CLI cloudhsmv2 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/cloudhsmv2/index.html' },
  ],
};
