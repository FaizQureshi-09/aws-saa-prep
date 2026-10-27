import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Organizations and service control policies. Schema: see s3.js. */
export default {
  tagline: 'Manage many AWS accounts centrally: consolidated billing, organizational units and guardrails with SCPs.',
  intro: [
    'AWS Organizations groups AWS accounts into a hierarchy: a management account, member accounts and organizational units (OUs).',
    'Service control policies (SCPs) set the maximum permissions for accounts or OUs; they never grant permissions and do not affect the management account.',
    'Consolidated billing combines usage from all accounts into one bill, giving volume discounts and sharing Reserved Instance and Savings Plans benefits across accounts.',
    'Other policy types include tag policies, backup policies and AI services opt-out policies; delegated administrators let member accounts run services such as GuardDuty or Security Hub for the organization.',
    'Multi-account strategy separates workloads (prod, dev, security, logging) to limit blast radius; AWS Control Tower builds a governed landing zone on top of Organizations.',
    'Integrates with CloudTrail (organization trail), AWS RAM, IAM Identity Center and AWS Config for organization-wide governance.',
  ],
  useCases: [
    { title: 'Enforce guardrails', detail: 'SCP denies leaving the organization, disabling CloudTrail or using non-approved Regions.' },
    { title: 'Consolidated billing and savings sharing', detail: 'One bill, pooled volume discounts, shared RI/Savings Plans.' },
    { title: 'Account isolation by environment', detail: 'Separate prod and dev accounts with different policies.' },
  ],
  importance: {
    points: [
      'Task 1.1 names multi-account strategies, Control Tower and SCPs; Task 4.x names multi-account billing and cost allocation.',
      'SCP evaluation (an SCP is a ceiling, not a grant) is a frequent trick.',
      'Pairs with IAM, Control Tower and IAM Identity Center.',
    ],
  },
  cli: [
    { command: 'aws organizations create-organization --feature-set ALL', description: 'Create an organization with all features.' },
    { command: 'aws organizations create-organizational-unit --parent-id r-abcd --name Production', description: 'Create an OU.' },
    { command: 'aws organizations create-account --email prod@example.com --account-name Prod', description: 'Create a member account.' },
    { command: 'aws organizations create-policy --name DenyLeaveOrg --type SERVICE_CONTROL_POLICY --content file://scp.json --description "Block leaving org"', description: 'Create an SCP.' },
    { command: 'aws organizations attach-policy --policy-id p-abc123 --target-id ou-abcd-1234', description: 'Attach an SCP to an OU.' },
    { command: 'aws organizations list-accounts', description: 'List all accounts.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'JSON: an SCP that denies disabling CloudTrail',
        language: 'json',
        code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Action": ["cloudtrail:StopLogging", "cloudtrail:DeleteTrail"],
    "Resource": "*"
  }]
}`,
      },
    ],
  },
  examples: [
    {
      title: 'Restrict Regions for all developer accounts',
      scenario: 'Developer accounts must only use ap-south-1 and us-east-1.',
      steps: [
        'Place developer accounts under a "Sandbox" OU.',
        'Attach an SCP that denies all actions when aws:RequestedRegion is not in the approved list (with exceptions for global services).',
        'Because SCPs set a ceiling, even account administrators cannot use other Regions.',
      ],
    },
  ],
  diagram: {
    title: 'Organization hierarchy with SCPs',
    nodes: [
      ['mgmt', 'Management account', 'security', 0, 1],
      ['root', 'Root / OUs', 'security', 1, 1],
      ['prod', 'Prod OU + accounts', 'compute', 2, 0],
      ['dev', 'Dev OU + accounts', 'compute', 2, 2],
      ['scp', 'SCP (maximum permissions)', 'security', 1, 0],
    ],
    edges: [
      ['mgmt', 'root', 'Manages'],
      ['root', 'prod', 'Contains'],
      ['root', 'dev', 'Contains'],
      ['scp', 'root', 'Attached to OU'],
    ],
    steps: [
      'The management account creates and manages the organization, billing and policies.',
      'Accounts are grouped into OUs (for example Prod and Dev).',
      'SCPs attached to the root or an OU limit what identities in those accounts can do, even administrators.',
    ],
  },
  questionTypes: [
    { pattern: 'Prevent actions across many accounts', hint: 'SCP at the OU or root level.' },
    { pattern: 'Consolidated billing benefits', hint: 'One bill, volume discounts, shared RI/Savings Plans.' },
    { pattern: 'SCP vs IAM policy', hint: 'SCP limits; IAM grants; effective permission is the intersection.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company wants to ensure that no one in any member account, including account administrators, can delete CloudTrail logs or stop logging. What should be used?',
      options: ['An IAM policy in each account', 'A service control policy attached to the organization root or OUs', 'An S3 bucket policy only', 'AWS Config rule only'],
      answer: ['B'],
      explanation: 'SCPs set maximum permissions for accounts and can deny actions regardless of IAM permissions granted inside the account.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A company with 20 AWS accounts wants to receive volume discounts and share Reserved Instance discounts across accounts. What should it use?',
      options: ['AWS Organizations with consolidated billing', 'Separate invoices per account', 'AWS Budgets only', 'Copy the RI to each account manually'],
      answer: ['A'],
      explanation: 'Consolidated billing in Organizations aggregates usage for tiered pricing and shares RI and Savings Plans benefits across accounts.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'An SCP allows only Amazon S3 actions for an OU. An IAM user in an account in that OU has an identity policy allowing ec2:RunInstances. What happens when the user launches an instance?',
      options: ['It succeeds', 'It is denied', 'It succeeds only with MFA', 'It succeeds in the management account only'],
      answer: ['B'],
      explanation: 'Effective permissions are the intersection of the SCP and identity policy; EC2 is not allowed by the SCP so the action is denied.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which statement about SCPs is correct?',
      options: ['SCPs grant permissions to IAM users', 'SCPs apply to the management account', 'SCPs define the maximum permissions available to member accounts', 'SCPs replace IAM policies'],
      answer: ['C'],
      explanation: 'SCPs only filter permissions; they do not grant them and do not apply to the management account.',
    },
  ],
  keyFacts: [
    'SCPs never grant permissions - they set a ceiling. Both the SCP and an identity/resource policy must allow an action.',
    'SCPs do not affect the management account and do not affect service-linked roles.',
    'Consolidated billing aggregates usage for volume tier pricing and shares Reserved Instances and Savings Plans.',
    'The organization needs "all features" (not just consolidated billing) to use SCPs.',
    'Control Tower sets up a governed multi-account landing zone using Organizations, SCP guardrails and Config.',
    'An account can belong to only one organization at a time.',
  ],
  traps: [
    { clue: 'Block an action even for admins in member accounts', answer: 'SCP.' },
    { clue: 'Pool discounts and one bill', answer: 'Organizations consolidated billing.' },
    { clue: 'Set up a governed multi-account environment fast', answer: 'AWS Control Tower.' },
    { clue: 'Grant cross-account permissions', answer: 'IAM roles/resource policies - not SCPs.' },
  ],
  related: ['iam', 'control-tower', 'iam-identity-center', 'cost-management', 'ram', 'cloudtrail'],
  sources: [
    { title: 'What is AWS Organizations?', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html' },
    { title: 'Service control policies (SCPs)', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html' },
    { title: 'Consolidated billing', url: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html' },
    { title: 'AWS CLI organizations commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/organizations/index.html' },
  ],
};
