import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Control Tower. Schema: see s3.js. */
export default {
  tagline: 'The fastest way to set up and govern a secure multi-account AWS environment with ready-made controls.',
  intro: [
    'AWS Control Tower orchestrates AWS Organizations, AWS Service Catalog and IAM Identity Center to build a landing zone: a well-architected, multi-account baseline for security and compliance.',
    'It creates a Security organizational unit containing a Log Archive account (central logs) and an Audit account (security and compliance review), and sets up organization-wide logging.',
    'Controls (earlier called guardrails) are high-level governance rules: preventive controls use service control policies (SCPs), detective controls use AWS Config rules, and proactive controls use CloudFormation hooks.',
    'Controls are categorised as mandatory, strongly recommended or elective, and are applied to organizational units (OUs) so new accounts inherit them.',
    'Account Factory is a configurable account template (built on Service Catalog) that lets teams provision new, pre-configured accounts quickly and consistently.',
    'A dashboard shows enrolled accounts, enabled controls and non-compliant resources; drift detection reports changes that move the landing zone away from its baseline.',
  ],
  useCases: [
    { title: 'Start a multi-account environment', detail: 'Stand up a governed landing zone in under an hour instead of scripting Organizations, SCPs and logging by hand.' },
    { title: 'Self-service account vending', detail: 'Give teams pre-approved accounts through Account Factory with baseline networking and roles.' },
    { title: 'Continuous governance', detail: 'Enable preventive controls (for example deny disallowed Regions) and detective controls on every OU.' },
  ],
  importance: {
    points: [
      'Appears in Domain 1 (design secure access and workloads) as the managed way to apply organization-wide guardrails; the exam also lists AWS Organizations and IAM Identity Center next to it.',
      'The common question is "which service sets up a multi-account environment with best practices and the least effort?" - Control Tower, not hand-built Organizations.',
    ],
  },
  cli: [
    { command: 'aws controltower list-landing-zones', description: 'List the landing zone in the account.' },
    { command: 'aws controltower list-enabled-controls --target-identifier <ou-arn>', description: 'Show controls enabled on an OU.' },
    { command: 'aws controltower enable-control --control-identifier <control-arn> --target-identifier <ou-arn>', description: 'Enable a control (guardrail) on an OU.' },
    { command: 'aws controltower get-control-operation --operation-identifier <operation-id>', description: 'Check the status of a control operation.' },
    { command: 'aws servicecatalog provision-product --product-name "AWS Control Tower Account Factory" --provisioning-artifact-name <version> --provisioned-product-name team-a-dev --provisioning-parameters Key=AccountName,Value=team-a-dev Key=AccountEmail,Value=team-a-dev@example.com Key=SSOUserEmail,Value=admin@example.com Key=SSOUserFirstName,Value=Team Key=SSOUserLastName,Value=Admin Key=ManagedOrganizationalUnit,Value="Workloads"', description: 'Vend a new account through Account Factory (Service Catalog).' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): enable a control on an OU',
        language: 'python',
        code: `import boto3

ct = boto3.client("controltower")
resp = ct.enable_control(
    controlIdentifier="arn:aws:controltower:us-east-1::control/EXAMPLE_CONTROL_ID",
    targetIdentifier="arn:aws:organizations::111122223333:ou/o-exampleorgid/ou-examplerootid-exampleouid",
)
print(resp["operationIdentifier"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Governed accounts for several product teams',
      scenario: 'A company needs separate dev, test and prod accounts per team with centralised logging and region restrictions.',
      steps: [
        'Launch the Control Tower landing zone from the management account and choose the home Region.',
        'Create OUs (for example Workloads-Dev and Workloads-Prod) and enable controls on each OU.',
        'Use Account Factory so teams provision their own accounts with approved settings.',
        'Review non-compliant resources and drift in the dashboard; audit through the Audit account.',
      ],
    },
  ],
  diagram: {
    title: 'AWS Control Tower landing zone',
    nodes: [
      ['admin', 'Cloud administrator', 'actor', 0, 1],
      ['ct', 'AWS Control Tower', 'management', 1, 1],
      ['org', 'AWS Organizations + IAM Identity Center', 'management', 1, 0],
      ['af', 'Account Factory', 'integration', 1, 2],
      ['ctl', 'Controls (SCPs, Config rules)', 'security', 2, 1],
      ['accts', 'Member accounts in OUs', 'compute', 3, 1],
      ['logs', 'Log Archive and Audit accounts', 'storage', 3, 2],
    ],
    edges: [
      ['admin', 'ct', 'Launches landing zone'],
      ['ct', 'org', 'Builds on'],
      ['ct', 'af', 'Provides'],
      ['ct', 'ctl', 'Enables controls'],
      ['ctl', 'accts', 'Governs'],
      ['accts', 'logs', 'Central logs'],
    ],
    steps: [
      'An administrator launches Control Tower, which sets up Organizations, IAM Identity Center and the Security OU.',
      'Controls (SCPs for prevention, Config rules for detection) are enabled on OUs.',
      'Teams use Account Factory to create accounts that inherit the controls, and logs flow to the Log Archive account.',
    ],
  },
  questionTypes: [
    { pattern: 'Set up a multi-account environment with best practices quickly', hint: 'AWS Control Tower.' },
    { pattern: 'Preventive vs detective controls', hint: 'Preventive = SCPs; detective = AWS Config rules.' },
    { pattern: 'Self-service creation of governed accounts', hint: 'Account Factory.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company is moving to a multi-account strategy and wants a pre-configured landing zone with centralised logging and security guardrails, with the LEAST operational effort. Which service should be used?',
      options: ['AWS Resource Access Manager', 'AWS CloudFormation StackSets written from scratch', 'AWS Control Tower', 'Amazon GuardDuty'],
      answer: ['C'],
      explanation: 'Control Tower automates landing zone setup with best-practice accounts, logging and controls on top of Organizations.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'In AWS Control Tower, which AWS capability implements preventive controls?',
      options: ['VPC flow logs', 'Service control policies (SCPs)', 'Amazon Inspector assessments', 'AWS Backup vaults'],
      answer: ['B'],
      explanation: 'Preventive controls use SCPs to stop disallowed actions; detective controls use AWS Config rules.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Application teams need to create new AWS accounts on demand that automatically follow the organization\'s baseline configuration. Which Control Tower feature supports this?',
      options: ['Cost Explorer', 'AWS Shield Advanced', 'Account Factory', 'Amazon Macie'],
      answer: ['C'],
      explanation: 'Account Factory is a configurable template for provisioning new accounts with approved baselines.',
    },
  ],
  keyFacts: [
    'Control Tower builds a landing zone on Organizations, Service Catalog and IAM Identity Center.',
    'Default Security OU holds the Log Archive and Audit accounts.',
    'Controls: preventive (SCP), detective (AWS Config rule), proactive (CloudFormation hook); guidance levels mandatory, strongly recommended, elective.',
    'Account Factory provisions new accounts from a template; drift detection reports landing zone divergence.',
    'Control Tower governs; it does not replace Organizations - it extends it.',
  ],
  traps: [
    { clue: 'Best-practice multi-account setup with minimal effort', answer: 'Control Tower.' },
    { clue: 'Block an action across accounts', answer: 'SCP (preventive control).' },
    { clue: 'Detect non-compliant configuration', answer: 'AWS Config rule (detective control).' },
  ],
  related: ['organizations', 'iam-identity-center', 'config', 'cloudtrail', 'cloudformation'],
  sources: [
    { title: 'What is AWS Control Tower?', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' },
    { title: 'How controls work in AWS Control Tower', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/how-controls-work.html' },
    { title: 'Provision and manage accounts with Account Factory', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/account-factory.html' },
    { title: 'AWS CLI controltower commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/controltower/index.html' },
  ],
};
