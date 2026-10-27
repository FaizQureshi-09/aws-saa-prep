import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS IAM Identity Center. Schema: see s3.js. */
export default {
  tagline: 'Workforce single sign-on: one login to many AWS accounts and applications, with temporary credentials.',
  intro: [
    'AWS IAM Identity Center (the successor to AWS Single Sign-On) is the recommended way to give your workforce access to multiple AWS accounts and business applications from a single place.',
    'The identity source can be the built-in Identity Center directory, Microsoft Active Directory (AWS Managed Microsoft AD or AD Connector) or an external identity provider (for example Okta or Microsoft Entra ID) using SAML 2.0, with SCIM for automatic user and group provisioning.',
    'Permission sets are templates of IAM policies; assigning a permission set to a user or group for an account creates an IAM role in that account, so users get short-lived credentials instead of long-term access keys.',
    'It integrates with AWS Organizations so you can assign access across every account in the organization from the management or a delegated administrator account.',
    'Users sign in at an access portal URL; the AWS CLI can authenticate with aws sso login, and supports attribute-based access control using user attributes as tags.',
    'It is for the workforce (employees); use Amazon Cognito for customers of your own applications.',
  ],
  useCases: [
    { title: 'SSO to many AWS accounts', detail: 'Employees pick an account and role in the portal; no per-account IAM users.' },
    { title: 'Connect corporate directory to AWS', detail: 'Use existing Active Directory or an external IdP as the source of truth for identities and groups.' },
    { title: 'SSO to SaaS and custom SAML apps', detail: 'Provide one portal for AWS accounts and cloud applications.' },
  ],
  importance: {
    points: [
      'Domain 1 (Task 1.1, secure access to AWS resources) expects you to prefer federation and temporary credentials over IAM users with long-term keys; IAM Identity Center is the standard answer for workforce access.',
      'Frequently contrasted with IAM users, IAM roles with SAML federation and Amazon Cognito.',
    ],
  },
  cli: [
    { command: 'aws sso configure', description: 'Configure the CLI with an Identity Center start URL and Region.' },
    { command: 'aws sso login --profile dev', description: 'Authenticate in the browser and get temporary credentials for the profile.' },
    { command: 'aws sso-admin list-instances', description: 'Find the Identity Center instance ARN and identity store ID.' },
    { command: 'aws sso-admin create-permission-set --name ReadOnly --instance-arn <instance-arn> --session-duration PT8H', description: 'Create a permission set with an 8-hour session.' },
    { command: 'aws sso-admin create-account-assignment --instance-arn <instance-arn> --target-id 111122223333 --target-type AWS_ACCOUNT --permission-set-arn <ps-arn> --principal-type GROUP --principal-id <group-id>', description: 'Assign a group to an account with a permission set.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list permission sets',
        language: 'python',
        code: `import boto3

sso = boto3.client("sso-admin")
instance_arn = sso.list_instances()["Instances"][0]["InstanceArn"]
for arn in sso.list_permission_sets(InstanceArn=instance_arn)["PermissionSets"]:
    detail = sso.describe_permission_set(InstanceArn=instance_arn, PermissionSetArn=arn)
    print(detail["PermissionSet"]["Name"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Federate corporate Okta to 40 AWS accounts',
      scenario: 'The security team wants staff to sign in with corporate credentials and MFA and removes all IAM users.',
      steps: [
        'Enable IAM Identity Center in the organization and set Okta as the external identity provider (SAML + SCIM).',
        'Create permission sets such as Admin, Developer and ReadOnly.',
        'Assign Okta-synced groups to accounts with the right permission sets.',
        'Staff open the portal or run aws sso login and receive temporary credentials.',
      ],
    },
  ],
  diagram: {
    title: 'IAM Identity Center sign-in flow',
    nodes: [
      ['user', 'Workforce user', 'actor', 0, 1],
      ['ic', 'IAM Identity Center portal', 'security', 1, 1],
      ['src', 'Identity source (AD / external IdP)', 'external', 1, 0],
      ['app', 'SAML business apps', 'external', 1, 2],
      ['ps', 'Permission sets', 'security', 2, 1],
      ['acct', 'AWS accounts and IAM roles', 'management', 3, 1],
    ],
    edges: [
      ['user', 'ic', 'Signs in (MFA)'],
      ['src', 'ic', 'Authenticates users'],
      ['ic', 'app', 'SSO to apps'],
      ['ic', 'ps', 'Assignments'],
      ['ps', 'acct', 'Temporary role session'],
    ],
    steps: [
      'The user signs in at the access portal; identities come from AD or an external IdP.',
      'Group assignments map the user to permission sets in specific accounts.',
      'Identity Center creates roles in those accounts and hands out temporary credentials; the user can also launch SAML apps.',
    ],
  },
  questionTypes: [
    { pattern: 'Workforce SSO across many accounts', hint: 'IAM Identity Center.' },
    { pattern: 'Use corporate directory/IdP without IAM users', hint: 'Identity Center with AD or SAML + SCIM.' },
    { pattern: 'Workforce vs customer identities', hint: 'Identity Center = employees; Cognito = application customers.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company has 30 AWS accounts in AWS Organizations and wants employees to sign in once with their corporate credentials and get access to the accounts they need, without creating IAM users. Which service should be used?',
      options: ['Amazon Cognito user pools', 'AWS IAM Identity Center', 'AWS Directory Service Simple AD only', 'AWS KMS'],
      answer: ['B'],
      explanation: 'IAM Identity Center provides workforce SSO to multiple accounts with temporary credentials and integrates with corporate identity sources.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'In IAM Identity Center, what defines the set of permissions that a user receives in a specific AWS account?',
      options: ['A Route 53 hosted zone', 'A permission set', 'A security group', 'A KMS key policy'],
      answer: ['B'],
      explanation: 'A permission set is a collection of IAM policies assigned to users or groups for accounts; Identity Center creates the corresponding roles.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company\'s external identity provider supports SAML 2.0 and SCIM. How can users and groups be integrated with IAM Identity Center with the LEAST manual work?',
      options: ['Configure the IdP as the identity source and use SCIM to provision users and groups automatically', 'Export users to a CSV file each week', 'Manually create every user in IAM', 'Create an Amazon RDS database of users'],
      answer: ['A'],
      explanation: 'SAML handles authentication and SCIM automatically synchronises users and groups into Identity Center.',
    },
  ],
  keyFacts: [
    'IAM Identity Center is the recommended workforce SSO service; it replaced AWS SSO.',
    'Identity sources: Identity Center directory, Active Directory, external IdP (SAML 2.0 + SCIM).',
    'Permission sets become IAM roles in target accounts; credentials are temporary.',
    'Works with AWS Organizations, supports MFA and attribute-based access control.',
    'For customer sign-in to your apps use Amazon Cognito instead.',
  ],
  traps: [
    { clue: 'Employees SSO to many AWS accounts', answer: 'IAM Identity Center.' },
    { clue: 'Sign-up and sign-in for a mobile app\'s customers', answer: 'Amazon Cognito.' },
    { clue: 'Avoid long-term access keys for people', answer: 'Federation / Identity Center with temporary credentials.' },
  ],
  related: ['iam', 'organizations', 'directory-service', 'cognito', 'control-tower'],
  sources: [
    { title: 'What is IAM Identity Center?', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html' },
    { title: 'Permission sets', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/permissionsetsconcept.html' },
    { title: 'Connect to your external identity provider', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html' },
    { title: 'AWS CLI sso-admin commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/sso-admin/index.html' },
  ],
};
