import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Transfer Family. Schema: see s3.js. */
export default {
  tagline: 'Fully managed SFTP, FTPS, FTP and AS2 endpoints that read and write Amazon S3 and Amazon EFS.',
  intro: [
    'AWS Transfer Family is a managed service for transferring files into and out of AWS storage over SFTP, FTPS, FTP, AS2 and browser-based transfers, without running any file transfer servers.',
    'It reads and writes Amazon S3 buckets or Amazon EFS file systems, so existing partners can keep using their current clients (OpenSSH, WinSCP, FileZilla) and configurations.',
    'Server endpoints can be public or hosted inside a VPC; VPC endpoints can use Elastic IP addresses, security groups and, with Global Accelerator, a fixed address for firewall allow-listing.',
    'Authentication can be service-managed (SSH keys), an AWS Managed Microsoft AD or custom identity provider via a Lambda function or API Gateway (for example Okta or Cognito-backed users).',
    'Users are mapped to IAM roles and logical home directories, so each user is limited to a prefix or directory; managed workflows can copy, tag, scan or decrypt files after upload.',
    'Transfer Family is the answer when external parties must exchange files with AWS using legacy file transfer protocols; for bulk migration of your own data use DataSync, and for hybrid file access use Storage Gateway.',
  ],
  useCases: [
    { title: 'Partner and vendor uploads to a data lake', detail: 'Third parties drop files via SFTP straight into S3 for processing by Glue or Athena.' },
    { title: 'Migrate an existing SFTP server', detail: 'Lift-and-shift a self-managed SFTP server to a managed endpoint with the same hostname.' },
    { title: 'B2B document exchange', detail: 'AS2 for supply-chain and payment documents with signing and encryption.' },
  ],
  importance: {
    points: [
      'Lives in the exam\'s migration and transfer group; the recurring trigger is "SFTP/FTP/FTPS" in the stem.',
      'Know how it differs from DataSync (bulk online copy), Storage Gateway (hybrid file access) and S3 Transfer Acceleration (faster uploads over HTTP).',
    ],
  },
  cli: [
    { command: 'aws transfer create-server --protocols SFTP --domain S3 --endpoint-type VPC --endpoint-details SubnetIds=subnet-0a,VpcId=vpc-0abc --identity-provider-type SERVICE_MANAGED', description: 'Create an SFTP server backed by S3 in a VPC.' },
    { command: 'aws transfer create-user --server-id s-0abc --user-name partner1 --role <role-arn> --home-directory /partner-bucket/partner1', description: 'Add a user restricted to a home directory.' },
    { command: 'aws transfer import-ssh-public-key --server-id s-0abc --user-name partner1 --ssh-public-key-body file://key.pub', description: 'Register the user\'s public SSH key.' },
    { command: 'aws transfer list-servers', description: 'List Transfer Family servers.' },
    { command: 'aws transfer describe-server --server-id s-0abc', description: 'Show the server endpoint and protocols.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): create an SFTP server and a user',
        language: 'python',
        code: `import boto3

transfer = boto3.client("transfer")
server = transfer.create_server(
    Protocols=["SFTP"],
    Domain="S3",
    IdentityProviderType="SERVICE_MANAGED",
)
transfer.create_user(
    ServerId=server["ServerId"],
    UserName="partner1",
    Role="arn:aws:iam::111122223333:role/TransferS3Access",
    HomeDirectory="/partner-bucket/partner1",
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Replace a self-managed SFTP server',
      scenario: 'A company runs an SFTP server on EC2 for partner uploads and wants to remove the operational work.',
      steps: [
        'Create a Transfer Family SFTP server with an S3 domain and a VPC endpoint with an Elastic IP.',
        'Create users mapped to prefixes in the bucket and import their SSH keys.',
        'Point the existing DNS name at the new endpoint with Route 53.',
        'Trigger processing with an S3 event notification or a managed workflow.',
      ],
    },
  ],
  diagram: {
    title: 'Transfer Family with S3 or EFS storage',
    nodes: [
      ['partner', 'Partner (SFTP/FTPS client)', 'external', 0, 1],
      ['tf', 'Transfer Family endpoint', 'integration', 1, 1],
      ['idp', 'Identity provider (managed, AD, custom)', 'security', 1, 0],
      ['efs', 'Amazon EFS (alternative)', 'storage', 1, 2],
      ['s3', 'Amazon S3 bucket', 'storage', 2, 1],
      ['proc', 'Lambda / Glue processing', 'compute', 3, 1],
    ],
    edges: [
      ['partner', 'tf', 'SFTP / FTPS / FTP'],
      ['idp', 'tf', 'Authenticates'],
      ['tf', 'efs', 'Or EFS'],
      ['tf', 's3', 'Files become objects'],
      ['s3', 'proc', 'Event triggers'],
    ],
    steps: [
      'The partner connects with a standard client; the identity provider authenticates the user.',
      'Transfer Family maps the user to an IAM role and home directory and writes to S3 (or EFS).',
      'S3 events or managed workflows start downstream processing.',
    ],
  },
  questionTypes: [
    { pattern: 'SFTP/FTP/FTPS to S3 or EFS without managing servers', hint: 'AWS Transfer Family.' },
    { pattern: 'Allow-list a fixed IP for partners', hint: 'VPC endpoint with Elastic IP (or Global Accelerator).' },
    { pattern: 'Transfer Family vs DataSync vs Storage Gateway', hint: 'Protocol endpoints vs bulk copy vs hybrid access.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'External partners must upload files to Amazon S3 using SFTP. The company wants to avoid running and patching servers. Which service should be used?',
      options: ['Amazon EC2 running an SFTP daemon', 'AWS DataSync', 'AWS Transfer Family', 'AWS Snowball Edge'],
      answer: ['C'],
      explanation: 'Transfer Family provides fully managed SFTP, FTPS and FTP endpoints backed by S3 or EFS.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Each partner using a Transfer Family SFTP server must only see its own folder in the S3 bucket. What should be configured?',
      options: ['A shared SSH key for all users', 'A public bucket policy', 'A home directory and IAM role per user', 'A NAT gateway'],
      answer: ['C'],
      explanation: 'Users are mapped to IAM roles and logical home directories that restrict access to their prefix.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A partner firewall allows traffic only to a small fixed set of IP addresses. How can the company provide a stable endpoint for a Transfer Family server?',
      options: ['Use the default public endpoint whose IP can change', 'Use a different Region each day', 'Use a CloudFront distribution in front of SFTP', 'Use a VPC-hosted endpoint with an Elastic IP address'],
      answer: ['D'],
      explanation: 'A VPC endpoint can be associated with Elastic IP addresses so partners can allow-list fixed IPs.',
    },
  ],
  keyFacts: [
    'Protocols: SFTP, FTPS, FTP, AS2 and browser-based transfers; storage: S3 or EFS.',
    'Endpoint types: public or VPC-hosted (with Elastic IPs and security groups).',
    'Identity: service-managed keys, AWS Managed Microsoft AD, or custom provider via Lambda/API Gateway.',
    'Users map to IAM roles and home directories; managed workflows process files after upload.',
    'Not for bulk migration of internal data (DataSync) or ongoing hybrid mounts (Storage Gateway).',
  ],
  traps: [
    { clue: 'SFTP, FTPS or FTP into S3', answer: 'Transfer Family.' },
    { clue: 'Bulk scheduled copy from on-premises NFS/SMB', answer: 'DataSync.' },
    { clue: 'Local NFS/SMB access backed by S3', answer: 'Storage Gateway File Gateway.' },
  ],
  related: ['datasync', 'storage-gateway', 's3', 'efs', 'directory-service', 'iam'],
  sources: [
    { title: 'What is AWS Transfer Family?', url: 'https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html' },
    { title: 'Working with identity providers', url: 'https://docs.aws.amazon.com/transfer/latest/userguide/authentication-and-authorization.html' },
    { title: 'Creating a server in a VPC', url: 'https://docs.aws.amazon.com/transfer/latest/userguide/create-server-in-vpc.html' },
    { title: 'AWS CLI transfer commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/transfer/index.html' },
  ],
};
