import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Identity and Access Management (IAM). Schema: see s3.js. */
export default {
  tagline: 'Controls WHO can do WHAT on WHICH AWS resources - the foundation of every secure architecture.',
  intro: [
    'IAM is a global, free service that authenticates identities (users, roles, federated users) and authorizes their API calls using JSON policies.',
    'Identities: IAM users (long-term credentials), groups (collections of users), and roles (temporary credentials assumed by people, AWS services or other accounts).',
    'Everything is denied by default; an explicit Allow is needed, and an explicit Deny always wins over any Allow.',
    'Policy types: identity-based, resource-based (for example S3 bucket policies, role trust policies), permissions boundaries, SCPs (AWS Organizations) and session policies.',
    'Roles are preferred over access keys: EC2, Lambda and ECS get temporary credentials automatically, and cross-account access uses AWS STS AssumeRole.',
    'Best practice: lock away the root user (MFA, no access keys), grant least privilege, use groups/roles, rotate credentials and review access with IAM Access Analyzer.',
  ],
  useCases: [
    { title: 'Give an application AWS access without keys', detail: 'Attach an IAM role (instance profile) to EC2, a task role to ECS, or an execution role to Lambda.' },
    { title: 'Cross-account access', detail: 'A role in the target account trusts the source account; users call sts:AssumeRole to get temporary credentials.' },
    { title: 'Enterprise federation', detail: 'Let corporate identities sign in through SAML 2.0 / OIDC or IAM Identity Center and assume roles.' },
    { title: 'Guardrails for delegated admins', detail: 'Permissions boundaries limit the maximum permissions a delegated administrator can grant.' },
  ],
  importance: {
    points: [
      'Domain 1 (30% of the exam) starts with IAM: Task 1.1 covers users, groups, roles, policies, STS, cross-account access and MFA.',
      'IAM appears inside almost every other topic: bucket policies, Lambda execution roles, KMS key policies, Organizations SCPs.',
      'Most security questions reduce to "use a role, not keys" and "apply least privilege".',
    ],
  },
  cli: [
    { command: 'aws sts get-caller-identity', description: 'Show which account and identity your credentials resolve to.' },
    { command: 'aws iam create-role --role-name AppRole --assume-role-policy-document file://trust.json', description: 'Create a role with its trust policy (who may assume it).' },
    { command: 'aws iam attach-role-policy --role-name AppRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess', description: 'Attach an AWS managed permissions policy to a role.' },
    { command: 'aws sts assume-role --role-arn arn:aws:iam::222222222222:role/AuditRole --role-session-name audit', description: 'Get temporary credentials for a role (cross-account).' },
    { command: 'aws iam create-policy --policy-name ReadReports --policy-document file://policy.json', description: 'Create a customer managed policy.' },
    { command: 'aws iam simulate-principal-policy --policy-source-arn <user-arn> --action-names s3:GetObject', description: 'Test whether an identity is allowed an action.' },
    { command: 'aws iam generate-credential-report && aws iam get-credential-report', description: 'Audit users, MFA status and access-key age.' },
    { command: 'aws iam put-role-permissions-boundary --role-name DevRole --permissions-boundary <policy-arn>', description: 'Set the maximum permissions a role can have.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): assume a cross-account role',
        language: 'python',
        code: `import boto3

sts = boto3.client("sts")
creds = sts.assume_role(
    RoleArn="arn:aws:iam::222222222222:role/AuditRole",
    RoleSessionName="audit-session",
    DurationSeconds=3600,
)["Credentials"]

s3 = boto3.client(
    "s3",
    aws_access_key_id=creds["AccessKeyId"],
    aws_secret_access_key=creds["SecretAccessKey"],
    aws_session_token=creds["SessionToken"],
)
print(s3.list_buckets()["Buckets"])`,
      },
    ],
  },
  examples: [
    {
      title: 'EC2 application reads from S3 with no stored keys',
      scenario: 'A web server must read objects from one S3 bucket. Hard-coding access keys is not allowed.',
      steps: [
        'Create a role whose trust policy allows ec2.amazonaws.com to assume it.',
        'Attach a policy that allows only s3:GetObject on arn:aws:s3:::reports-bucket/*.',
        'Attach the role to the instance through an instance profile.',
        'The SDK on the instance retrieves rotating temporary credentials automatically.',
      ],
      code: {
        language: 'json',
        code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::reports-bucket/*"
  }]
}`,
      },
    },
  ],
  diagram: {
    title: 'Cross-account role assumption with STS',
    nodes: [
      ['dev', 'Developer (Account A)', 'actor', 0, 1],
      ['sts', 'AWS STS', 'security', 1, 1],
      ['role', 'IAM role (Account B)', 'security', 2, 1],
      ['s3', 'S3 bucket (Account B)', 'storage', 3, 1],
      ['trust', 'Trust policy trusts Account A', 'security', 2, 0],
    ],
    edges: [
      ['dev', 'sts', '1. AssumeRole'],
      ['sts', 'role', '2. Check trust policy'],
      ['trust', 'role', 'Attached to role'],
      ['role', 's3', '3. Use temp credentials'],
    ],
    steps: [
      'The developer authenticates in Account A and calls sts:AssumeRole for the role ARN in Account B (their own identity policy must allow sts:AssumeRole).',
      'STS checks the role\'s trust policy to confirm Account A is allowed to assume it.',
      'STS returns temporary credentials (access key, secret key, session token); the developer uses them with the role\'s permissions.',
    ],
  },
  questionTypes: [
    { pattern: 'Give an AWS resource access to another AWS service', hint: 'The answer is an IAM role, not an access key stored on the instance.' },
    { pattern: 'Cross-account access', hint: 'Role in the resource account + trust policy + sts:AssumeRole, or a resource-based policy.' },
    { pattern: 'Least privilege and guardrails', hint: 'Permissions boundary vs SCP vs identity policy; explicit deny always wins.' },
    { pattern: 'Root user and MFA best practices', hint: 'Enable MFA, remove root access keys, use roles for daily work.' },
    { pattern: 'Federation', hint: 'IAM Identity Center, SAML 2.0 or OIDC providers, Cognito identity pools for app users.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'An application running on Amazon EC2 instances needs to read objects from an Amazon S3 bucket. The security team prohibits storing long-term credentials on the instances. What should a solutions architect do?',
      options: [
        'Create an IAM user, generate access keys and store them in the instance user data.',
        'Create an IAM role with the required S3 permissions and attach it to the instances through an instance profile.',
        'Store the access keys in an encrypted file on an EBS volume attached to each instance.',
        'Add the instances\' public IP addresses to the S3 bucket policy.',
      ],
      answer: ['B'],
      explanation: 'An IAM role attached through an instance profile gives the instance automatically rotated temporary credentials, so no long-term keys exist on the instance. Keys in user data or on disk are long-term credentials; IP-based bucket policies do not grant IAM permissions to the application.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company\'s auditors in AWS account 111111111111 must read logs stored in an S3 bucket in account 222222222222, following the principle of least privilege and without creating IAM users in the second account. Which solution meets this requirement?',
      options: [
        'Create an IAM user in account 222222222222 and share the access keys with the auditors.',
        'Create a role in account 222222222222 with read-only S3 access that trusts account 111111111111, and have the auditors assume it.',
        'Make the bucket public and share the URL with the auditors.',
        'Attach AdministratorAccess to the auditors\' IAM group in account 111111111111.',
      ],
      answer: ['B'],
      explanation: 'A cross-account role with a trust policy for the auditor account lets auditors obtain temporary, least-privilege credentials through sts:AssumeRole. Shared keys and public buckets are insecure, and administrator access violates least privilege.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'An IAM user has an identity-based policy that allows s3:DeleteBucket. The user\'s AWS account is in an organization where a service control policy (SCP) does not allow s3:DeleteBucket. What is the result when the user tries to delete a bucket?',
      options: [
        'The request succeeds because the identity-based policy allows it.',
        'The request is denied because SCPs define the maximum permissions available in the account.',
        'The request succeeds only if the user has MFA enabled.',
        'The request succeeds because SCPs do not apply to IAM users.',
      ],
      answer: ['B'],
      explanation: 'SCPs set the maximum permissions for accounts (including their IAM users and roles). An action not allowed by the SCP is denied regardless of identity-based policies.',
    },
    {
      source: 'mock', domain: 1, multi: true,
      stem: 'Which actions follow AWS best practices for protecting the AWS account root user? (Select TWO.)',
      options: [
        'Enable multi-factor authentication (MFA) on the root user.',
        'Create access keys for the root user for use by automation scripts.',
        'Use the root user for daily administrative tasks.',
        'Do not create root access keys and use IAM roles/users with least privilege for everyday work.',
        'Share the root credentials with the security team in a shared document.',
      ],
      answer: ['A', 'D'],
      explanation: 'Protect the root user with MFA and avoid root access keys; do daily work with least-privilege IAM identities. Using root for routine work, sharing its credentials or creating root keys for automation are anti-patterns.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants a central team to create IAM roles for application teams, but the roles must never be able to grant more than a defined set of permissions, even if a team attaches AdministratorAccess. Which feature enforces this?',
      options: [
        'IAM permissions boundary',
        'IAM group membership',
        'Amazon Cognito user pool',
        'S3 bucket policy',
      ],
      answer: ['A'],
      explanation: 'A permissions boundary sets the maximum permissions an IAM identity can have; effective permissions are the intersection of the identity policy and the boundary.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Employees sign in with their corporate Active Directory credentials. The company wants single sign-on to the AWS Management Console across several AWS accounts with the least administrative effort. What should the solutions architect use?',
      options: [
        'Create an IAM user for each employee in every AWS account.',
        'Use AWS IAM Identity Center connected to the corporate directory and assign permission sets to accounts.',
        'Share one IAM user\'s access keys among employees.',
        'Create an S3 bucket policy for each employee.',
      ],
      answer: ['B'],
      explanation: 'IAM Identity Center provides workforce SSO across accounts and integrates with Active Directory, assigning permission sets without per-account IAM users.',
    },
  ],
  keyFacts: [
    'IAM is a global service: users, groups, roles and policies are not tied to a Region.',
    'Policy evaluation: everything is implicitly denied; an explicit Allow grants access; an explicit Deny always overrides any Allow.',
    'Roles provide temporary credentials (via STS); IAM users have long-term credentials - prefer roles for applications and cross-account access.',
    'A role has two policy parts: the trust policy (who can assume it) and permissions policies (what it can do).',
    'SCPs and permissions boundaries never grant permissions - they only limit the maximum.',
    'Resource-based policies (S3, SQS, KMS, Lambda) can grant cross-account access without assuming a role.',
    'Enable MFA on the root user and all privileged users; delete or avoid root access keys.',
    'IAM Access Analyzer finds resources shared outside your account/organization; the credential report lists user credential status.',
  ],
  traps: [
    { clue: 'Application on EC2/Lambda/ECS needs AWS access', answer: 'IAM role (instance profile / execution role / task role) - never embedded keys.' },
    { clue: 'Another AWS account needs access', answer: 'Cross-account role with trust policy + sts:AssumeRole (or a resource-based policy).' },
    { clue: 'Restrict what even admins in an account can do', answer: 'Service control policy from AWS Organizations.' },
    { clue: 'Delegate role creation but cap permissions', answer: 'Permissions boundary.' },
    { clue: 'Mobile/web app users need temporary AWS credentials', answer: 'Amazon Cognito identity pools.' },
  ],
  related: ['organizations', 'iam-identity-center', 'kms', 'cognito', 'control-tower'],
  sources: [
    { title: 'What is IAM?', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html' },
    { title: 'IAM security best practices', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
    { title: 'Policy evaluation logic', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' },
    { title: 'IAM roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' },
    { title: 'Permissions boundaries', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html' },
    { title: 'AWS CLI iam commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/iam/index.html' },
  ],
};
