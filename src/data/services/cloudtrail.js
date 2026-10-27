import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS CloudTrail. Schema: see s3.js. */
export default {
  tagline: 'The audit log of your AWS account: who called which API, from where and when.',
  intro: [
    'AWS CloudTrail records API calls and account activity made through the console, CLI, SDKs and other AWS services, giving governance, compliance and auditing visibility.',
    'Event history keeps the last 90 days of management events by default; create a trail to deliver logs to S3 for long-term retention and optionally to CloudWatch Logs.',
    'Management events (control-plane actions) are logged by default; data events (for example S3 object-level and Lambda invoke activity) and Insights events (unusual activity) must be enabled and cost extra.',
    'Trails can be multi-Region and organization-wide (AWS Organizations) so one trail captures all accounts and Regions.',
    'Log file integrity validation produces signed digest files so you can prove logs were not altered; logs can be encrypted with KMS.',
    'CloudTrail Lake lets you store events and query them with SQL; CloudTrail answers "who did what", while CloudWatch answers "how is it performing" and Config answers "what changed in configuration".',
  ],
  useCases: [
    { title: 'Security investigation', detail: 'Find which identity deleted a resource or changed a security group.' },
    { title: 'Compliance evidence', detail: 'Long-term immutable logs in S3 with integrity validation.' },
    { title: 'Detect risky activity', detail: 'EventBridge/CloudWatch alarms on events such as root login or console sign-in without MFA.' },
  ],
  importance: {
    points: [
      'Appears in security (Domain 1) and governance scenarios; distinguishing CloudTrail from CloudWatch and Config is a frequent test.',
      'Know defaults: 90-day event history, management events on, data events off.',
    ],
  },
  cli: [
    { command: 'aws cloudtrail create-trail --name org-trail --s3-bucket-name audit-logs --is-multi-region-trail --is-organization-trail --enable-log-file-validation', description: 'Create an organization-wide multi-Region trail with log validation.' },
    { command: 'aws cloudtrail start-logging --name org-trail', description: 'Start logging.' },
    { command: 'aws cloudtrail put-event-selectors --trail-name org-trail --advanced-event-selectors file://data-events.json', description: 'Enable S3 data events.' },
    { command: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=TerminateInstances', description: 'Search the last 90 days of events.' },
    { command: 'aws cloudtrail validate-logs --trail-arn <arn> --start-time 2026-10-01T00:00:00Z', description: 'Verify log file integrity.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): who terminated instances?',
        language: 'python',
        code: `import boto3

ct = boto3.client("cloudtrail")
events = ct.lookup_events(
    LookupAttributes=[{"AttributeKey": "EventName", "AttributeValue": "TerminateInstances"}],
    MaxResults=10,
)["Events"]
for e in events:
    print(e["EventTime"], e.get("Username"), e["EventName"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Tamper-evident audit logging for an organization',
      scenario: 'Auditors require immutable, centralised API logs from all accounts and Regions.',
      steps: [
        'Create an organization trail from the management account that logs all Regions.',
        'Deliver logs to a dedicated S3 bucket in a security account with Object Lock and a restrictive bucket policy.',
        'Enable log file integrity validation and SSE-KMS.',
        'Send events to CloudWatch Logs and alarm on critical activity such as root usage.',
      ],
    },
  ],
  diagram: {
    title: 'CloudTrail logging flow',
    nodes: [
      ['api', 'API calls (console/CLI/SDK)', 'actor', 0, 1],
      ['ct', 'AWS CloudTrail', 'integration', 1, 1],
      ['s3', 'S3 log bucket (+ validation)', 'storage', 2, 1],
      ['cwl', 'CloudWatch Logs / alarms', 'integration', 1, 0],
      ['athena', 'Athena / CloudTrail Lake', 'analytics', 2, 2],
    ],
    edges: [
      ['api', 'ct', 'Records activity'],
      ['ct', 's3', 'Delivers log files'],
      ['ct', 'cwl', 'Optional stream'],
      ['s3', 'athena', 'Query logs'],
    ],
    steps: [
      'Every API call is recorded as an event with identity, time, source IP and parameters.',
      'A trail delivers events to S3 for long-term retention (and optionally to CloudWatch Logs for alerting).',
      'Logs are queried with Athena or CloudTrail Lake during investigations.',
    ],
  },
  questionTypes: [
    { pattern: 'Who made an API call?', hint: 'CloudTrail.' },
    { pattern: 'Retain audit logs beyond 90 days', hint: 'Create a trail to S3.' },
    { pattern: 'Prove logs were not altered', hint: 'Log file integrity validation.' },
    { pattern: 'CloudTrail vs CloudWatch vs Config', hint: 'API audit vs metrics/logs vs resource configuration history.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A security engineer needs to determine which IAM principal deleted an S3 bucket last week. Which service provides this information?',
      options: ['AWS CloudTrail', 'Amazon CloudWatch metrics', 'AWS Trusted Advisor', 'Amazon Inspector'],
      answer: ['A'],
      explanation: 'CloudTrail records management events including who called DeleteBucket and when.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company must retain API activity logs for 7 years and be able to show auditors that the logs have not been modified. Which combination should be used? (Select TWO.)',
      multi: true,
      options: ['A CloudTrail trail delivering to an S3 bucket', 'CloudTrail log file integrity validation', 'CloudTrail event history only', 'An EBS snapshot of the instance', 'A security group rule'],
      answer: ['A', 'B'],
      explanation: 'Event history covers only 90 days; a trail to S3 provides long-term retention and integrity validation provides tamper evidence.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which events are NOT logged by a default CloudTrail trail unless explicitly enabled?',
      options: ['Management events such as RunInstances', 'Data events such as S3 GetObject', 'Console sign-in events', 'IAM CreateUser events'],
      answer: ['B'],
      explanation: 'Data events (S3 object-level operations, Lambda invocations) must be turned on and are billed separately.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants every API call in all accounts and Regions of its AWS Organizations organization logged centrally, with member accounts unable to modify or delete the trail. What should be created?',
      options: ['A separate trail in every member account', 'CloudWatch metric filters in each account', 'An organization trail created from the management account', 'VPC Flow Logs in each VPC'],
      answer: ['C'],
      explanation: 'An organization trail logs events for all member accounts and cannot be changed or removed by them.',
    },
  ],
  keyFacts: [
    'Event history: last 90 days of management events, no setup; trails deliver to S3 for longer retention.',
    'Management events are on by default; data events and Insights events are optional (extra cost).',
    'Organization trails and multi-Region trails centralise logging.',
    'Log file integrity validation uses signed digest files; encrypt with SSE-KMS.',
    'CloudTrail Lake provides SQL queries over an event data store.',
    'CloudTrail is Regional unless configured as a multi-Region trail; global service events are logged in us-east-1 by default.',
  ],
  traps: [
    { clue: 'Who deleted or changed something', answer: 'CloudTrail.' },
    { clue: 'Detect configuration drift / compliance of resources', answer: 'AWS Config.' },
    { clue: 'Performance metrics and alarms', answer: 'CloudWatch.' },
    { clue: 'Keep logs > 90 days', answer: 'Create a trail to S3.' },
  ],
  related: ['cloudwatch', 'config', 's3', 'guardduty', 'organizations', 'kms'],
  sources: [
    { title: 'What is AWS CloudTrail?', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' },
    { title: 'Viewing events with CloudTrail event history', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html' },
    { title: 'Validating CloudTrail log file integrity', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html' },
    { title: 'Creating a trail for an organization', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/creating-trail-organization.html' },
    { title: 'AWS CLI cloudtrail commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/cloudtrail/index.html' },
  ],
};
