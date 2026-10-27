import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS CloudFormation. Schema: see s3.js. */
export default {
  tagline: 'Infrastructure as code: describe AWS resources in a template and provision them repeatably as a stack.',
  intro: [
    'AWS CloudFormation provisions and manages AWS resources from declarative JSON or YAML templates; the set of resources created from a template is a stack.',
    'Templates have sections such as Parameters, Mappings, Conditions, Resources and Outputs and use intrinsic functions like !Ref, !GetAtt and !Sub.',
    'Change sets preview what an update will change before you apply it; if a stack operation fails, CloudFormation rolls back automatically.',
    'Drift detection reports resources that were changed outside CloudFormation; StackSets deploy stacks to multiple accounts and Regions.',
    'DeletionPolicy (Retain, Snapshot) protects data resources, and stack policies protect critical resources from accidental updates.',
    'CloudFormation is free; you pay for the resources it creates. It enables immutable, repeatable environments and fast disaster-recovery rebuilds.',
  ],
  useCases: [
    { title: 'Repeatable environments', detail: 'Identical dev, test and prod stacks from one template.' },
    { title: 'Disaster recovery rebuilds', detail: 'Recreate infrastructure in another Region quickly.' },
    { title: 'Multi-account governance', detail: 'StackSets roll out baseline resources (IAM roles, Config) everywhere.' },
  ],
  importance: {
    points: [
      'Task 2.2 mentions automation strategies to ensure infrastructure integrity and immutable infrastructure; CloudFormation is the core IaC service.',
      'The AWS CDK is out of scope but compiles to CloudFormation, so the concepts apply.',
    ],
  },
  cli: [
    { command: 'aws cloudformation validate-template --template-body file://stack.yaml', description: 'Check template syntax.' },
    { command: 'aws cloudformation deploy --template-file stack.yaml --stack-name web --parameter-overrides Env=prod --capabilities CAPABILITY_IAM', description: 'Create or update a stack (via change set).' },
    { command: 'aws cloudformation create-change-set --stack-name web --change-set-name preview --template-body file://stack.yaml', description: 'Preview changes.' },
    { command: 'aws cloudformation describe-stack-events --stack-name web', description: 'Troubleshoot stack events.' },
    { command: 'aws cloudformation detect-stack-drift --stack-name web', description: 'Start drift detection.' },
    { command: 'aws cloudformation delete-stack --stack-name web', description: 'Delete the stack and its resources (respecting DeletionPolicy).' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'YAML: an S3 bucket that is retained on stack deletion',
        language: 'yaml',
        code: `AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  Env:
    Type: String
    AllowedValues: [dev, prod]
Resources:
  DataBucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      BucketName: !Sub "my-data-\${Env}-\${AWS::AccountId}"
      VersioningConfiguration:
        Status: Enabled
Outputs:
  BucketArn:
    Value: !GetAtt DataBucket.Arn`,
      },
    ],
  },
  examples: [
    {
      title: 'Safe production update',
      scenario: 'A template change must be reviewed before touching production resources.',
      steps: [
        'Create a change set for the production stack.',
        'Review adds, modifications and replacements (replacement of a database is a red flag).',
        'Set DeletionPolicy: Snapshot on databases.',
        'Execute the change set; CloudFormation rolls back if anything fails.',
      ],
    },
  ],
  diagram: {
    title: 'CloudFormation stack lifecycle',
    nodes: [
      ['tpl', 'Template (YAML/JSON) in S3/Git', 'management', 0, 1],
      ['cs', 'Change set (preview)', 'integration', 1, 1],
      ['stack', 'CloudFormation stack', 'integration', 2, 1],
      ['res', 'AWS resources', 'compute', 3, 1],
      ['drift', 'Drift detection', 'security', 2, 0],
    ],
    edges: [
      ['tpl', 'cs', 'Submit'],
      ['cs', 'stack', 'Execute'],
      ['stack', 'res', 'Create / update'],
      ['drift', 'stack', 'Compare actual'],
    ],
    steps: [
      'You author a template describing the desired infrastructure.',
      'A change set shows what will be created, updated or replaced.',
      'Executing it creates or updates the stack, which provisions resources and rolls back on failure.',
      'Drift detection compares live resources with the template to find manual changes.',
    ],
  },
  questionTypes: [
    { pattern: 'Repeatable, automated infrastructure', hint: 'CloudFormation (or CDK/Terraform outside the exam scope).' },
    { pattern: 'Deploy to many accounts/Regions', hint: 'StackSets.' },
    { pattern: 'Protect data on stack deletion', hint: 'DeletionPolicy Retain/Snapshot.' },
    { pattern: 'Preview update impact', hint: 'Change sets.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants to create identical environments in multiple Regions repeatably and recreate its infrastructure quickly during disaster recovery. Which approach is BEST?',
      options: ['Manually create resources in the console', 'Define the infrastructure in CloudFormation templates', 'Write documentation and follow it step by step', 'Take EBS snapshots only'],
      answer: ['B'],
      explanation: 'Infrastructure as code makes environments repeatable and quickly reproducible in any Region.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An administrator must roll out the same IAM roles and Config settings to 50 accounts across several Regions. Which CloudFormation feature should be used?',
      options: ['Nested stacks only', 'CloudFormation StackSets', 'Change sets only', 'Stack policies'],
      answer: ['B'],
      explanation: 'StackSets deploy a stack to multiple accounts and Regions from one operation.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A stack contains an RDS database. The team wants a final backup retained if the stack is accidentally deleted. What should be set on the database resource?',
      options: ['DeletionPolicy: Snapshot', 'UpdatePolicy: Delete', 'A security group', 'A stack output'],
      answer: ['A'],
      explanation: 'DeletionPolicy Snapshot creates a snapshot before the resource is deleted; Retain keeps the resource.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Someone changed a security group manually in the console after a stack was deployed. How can the team identify such out-of-band changes?',
      options: ['CloudFormation drift detection', 'Route 53 health checks', 'A larger instance type', 'Trusted Advisor only'],
      answer: ['A'],
      explanation: 'Drift detection compares actual resource configuration with the stack template.',
    },
  ],
  keyFacts: [
    'Stack = group of resources from one template; rollback on failure is automatic by default.',
    'Change sets preview updates; some property changes cause replacement of the resource.',
    'StackSets deploy across accounts/Regions; nested stacks reuse templates.',
    'DeletionPolicy: Delete (default), Retain, Snapshot (for supported resources).',
    'Drift detection finds manual changes; stack policies prevent unintended updates.',
    'CloudFormation itself has no charge; custom resources (Lambda-backed) extend it.',
  ],
  traps: [
    { clue: 'Repeatable infrastructure, DR rebuilds', answer: 'CloudFormation.' },
    { clue: 'Multi-account/Region rollout', answer: 'StackSets.' },
    { clue: 'Detect manual changes', answer: 'Drift detection.' },
    { clue: 'Keep a database after stack deletion', answer: 'DeletionPolicy Retain/Snapshot.' },
  ],
  related: ['dr-strategies', 'systems-manager', 'organizations', 'config', 'elastic-beanstalk'],
  sources: [
    { title: 'What is AWS CloudFormation?', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html' },
    { title: 'Template anatomy', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html' },
    { title: 'Updating stacks using change sets', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html' },
    { title: 'Detecting unmanaged configuration changes (drift)', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html' },
    { title: 'AWS CLI cloudformation commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/cloudformation/index.html' },
  ],
};
