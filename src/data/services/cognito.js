import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Cognito. Schema: see s3.js. */
export default {
  tagline: 'Add sign-up, sign-in and access control to web and mobile apps, and give users temporary AWS credentials.',
  intro: [
    'Amazon Cognito provides customer identity management for applications: user directories, authentication and authorisation.',
    'User pools are user directories that handle sign-up/sign-in, MFA, password policies, a hosted login UI and issue JWT tokens; they can federate with social providers, SAML and OIDC.',
    'Identity pools (federated identities) exchange tokens from a user pool, social or other identity provider for temporary AWS credentials (through STS) so users can call AWS services such as S3 or DynamoDB directly.',
    'Identity pools also support unauthenticated (guest) identities with limited permissions.',
    'ALB and API Gateway integrate with Cognito user pools to authenticate requests before they reach your backend.',
    'Use Cognito for application users (customers); use IAM Identity Center for your workforce.',
  ],
  useCases: [
    { title: 'Customer sign-up and sign-in', detail: 'Add login with email, social providers and MFA to a mobile or web app.' },
    { title: 'Secure APIs', detail: 'API Gateway Cognito authorizer validates tokens issued by a user pool.' },
    { title: 'Direct AWS access from apps', detail: 'Identity pool credentials let a mobile app upload to a specific S3 prefix.' },
  ],
  importance: {
    points: [
      'Task 1.2 names Amazon Cognito as an example of a security service with appropriate use cases.',
      'Main exam decision: user pool (authentication/tokens) vs identity pool (AWS credentials) vs IAM Identity Center (workforce).',
    ],
  },
  cli: [
    { command: 'aws cognito-idp create-user-pool --pool-name app-users --policies PasswordPolicy={MinimumLength=10} --mfa-configuration OPTIONAL', description: 'Create a user pool.' },
    { command: 'aws cognito-idp create-user-pool-client --user-pool-id <pool-id> --client-name web --no-generate-secret', description: 'Create an app client.' },
    { command: 'aws cognito-idp admin-create-user --user-pool-id <pool-id> --username alice@example.com', description: 'Create a user as an administrator.' },
    { command: 'aws cognito-identity create-identity-pool --identity-pool-name app-identities --allow-unauthenticated-identities', description: 'Create an identity pool.' },
    { command: 'aws cognito-identity get-credentials-for-identity --identity-id <id> --logins cognito-idp.<region>.amazonaws.com/<pool-id>=<id-token>', description: 'Exchange a user pool token for AWS credentials.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): sign in a user (user password flow)',
        language: 'python',
        code: `import boto3

idp = boto3.client("cognito-idp", region_name="ap-south-1")
resp = idp.initiate_auth(
    ClientId="app-client-id",
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={"USERNAME": "alice@example.com", "PASSWORD": "S3cure!pass"},
)
id_token = resp["AuthenticationResult"]["IdToken"]`,
      },
    ],
  },
  examples: [
    {
      title: 'Mobile app uploads photos directly to S3',
      scenario: 'Signed-in users of a mobile app upload to their own S3 prefix without a backend proxy.',
      steps: [
        'Users sign in through a Cognito user pool and receive tokens.',
        'The app exchanges the token with an identity pool for temporary AWS credentials.',
        'The identity pool\'s authenticated role allows s3:PutObject only on arn:aws:s3:::photos/${cognito-identity.amazonaws.com:sub}/*.',
      ],
    },
  ],
  diagram: {
    title: 'Cognito user pool and identity pool',
    nodes: [
      ['app', 'Mobile / web app', 'actor', 0, 1],
      ['up', 'User pool (sign-in, JWT)', 'security', 1, 1],
      ['ip', 'Identity pool', 'security', 2, 1],
      ['sts', 'Temporary AWS credentials', 'security', 3, 1],
      ['api', 'API Gateway (Cognito authorizer)', 'integration', 1, 0],
    ],
    edges: [
      ['app', 'up', '1. Sign in'],
      ['up', 'ip', '2. Token'],
      ['ip', 'sts', '3. STS credentials'],
      ['up', 'api', 'Validates JWT'],
    ],
    steps: [
      'The user authenticates with the user pool (password, MFA or a social/SAML identity provider) and receives JWT tokens.',
      'The app can call API Gateway, which validates the token with a Cognito authorizer.',
      'To access AWS services directly, the app exchanges the token with an identity pool for temporary, role-scoped AWS credentials.',
    ],
  },
  questionTypes: [
    { pattern: 'Mobile/web user authentication', hint: 'Cognito user pool.' },
    { pattern: 'App users need AWS credentials', hint: 'Cognito identity pool (STS).' },
    { pattern: 'Workforce SSO vs customer identity', hint: 'IAM Identity Center for employees; Cognito for customers.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A mobile app must let customers sign up and sign in with email or social identities and secure its API Gateway endpoints with the issued tokens. Which service should be used?',
      options: ['AWS IAM Identity Center', 'Amazon Cognito user pools', 'AWS Directory Service Simple AD', 'AWS KMS'],
      answer: ['B'],
      explanation: 'User pools provide sign-up/sign-in, social federation and JWT tokens that API Gateway can validate with a Cognito authorizer.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Authenticated users of a web application must upload files directly to an S3 bucket from the browser using temporary AWS credentials. What should the architect configure?',
      options: ['Cognito identity pool mapped to an IAM role with limited S3 permissions', 'Share one IAM user\'s keys in the JavaScript', 'Make the bucket public', 'Use Route 53 geolocation routing'],
      answer: ['A'],
      explanation: 'Identity pools issue temporary credentials through STS for a role you define, enabling scoped direct access to AWS services.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants employees to sign in once to access multiple AWS accounts and business applications using the corporate directory. Which service is the best fit?',
      options: ['Amazon Cognito user pools', 'AWS IAM Identity Center', 'Amazon Cognito identity pools', 'AWS WAF'],
      answer: ['B'],
      explanation: 'IAM Identity Center is for workforce single sign-on to AWS accounts and applications; Cognito targets customer-facing application users.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A web application needs customer sign-up, sign-in, multi-factor authentication and a ready-made sign-in page with the LEAST development effort. What should be used?',
      options: ['IAM users with virtual MFA devices', 'A Cognito identity pool only', 'A Cognito user pool with MFA and the hosted UI', 'AWS Directory Service Simple AD'],
      answer: ['C'],
      explanation: 'User pools provide sign-up and sign-in, MFA and a hosted UI. Identity pools only exchange tokens for AWS credentials.',
    },
  ],
  keyFacts: [
    'User pool = user directory + authentication + JWT tokens; identity pool = exchanges tokens for temporary AWS credentials.',
    'User pools support MFA, password policies, hosted UI and federation with Google/Facebook/Apple, SAML and OIDC.',
    'Identity pools can give unauthenticated (guest) users a restricted role.',
    'ALB and API Gateway can authenticate directly against a Cognito user pool.',
    'Use Cognito for customers; IAM Identity Center for employees.',
    'Lambda triggers (for example pre sign-up and post confirmation) let you customise the user pool authentication flow.',
  ],
  traps: [
    { clue: 'Customer sign-up/sign-in for an app', answer: 'Cognito user pool.' },
    { clue: 'Browser/mobile app needs AWS credentials', answer: 'Cognito identity pool.' },
    { clue: 'Employee SSO to AWS accounts', answer: 'IAM Identity Center.' },
  ],
  related: ['iam', 'iam-identity-center', 'api-gateway', 'elb', 'waf'],
  sources: [
    { title: 'What is Amazon Cognito?', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html' },
    { title: 'Amazon Cognito user pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html' },
    { title: 'Amazon Cognito identity pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html' },
    { title: 'AWS CLI cognito-idp commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/cognito-idp/index.html' },
  ],
};
