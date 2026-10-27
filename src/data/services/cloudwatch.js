import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon CloudWatch. Schema: see s3.js. */
export default {
  tagline: 'The monitoring and observability service: metrics, logs, alarms and dashboards for AWS and your applications.',
  intro: [
    'Amazon CloudWatch collects metrics (time-series numbers), logs (log groups and streams) and events, and lets you graph them on dashboards.',
    'AWS services publish metrics automatically; EC2 basic monitoring is every 5 minutes, detailed monitoring every 1 minute. Memory and disk-space metrics need the CloudWatch agent.',
    'Alarms watch a metric against a threshold and trigger actions: SNS notifications, Auto Scaling policies, or EC2 actions (stop, terminate, reboot, recover).',
    'CloudWatch Logs stores, searches and retains log data; metric filters turn log patterns into metrics and Logs Insights queries analyse them.',
    'Also includes composite alarms, anomaly detection, Synthetics canaries, Container Insights and cross-account/Region observability.',
    'EventBridge (formerly CloudWatch Events) reacts to state changes and schedules; CloudTrail answers "who did what", CloudWatch answers "how is it performing".',
  ],
  useCases: [
    { title: 'Auto Scaling signals', detail: 'Alarms on CPU, request count or custom metrics drive scale-out and scale-in.' },
    { title: 'Operational alerts', detail: 'Alarm to SNS to notify on-call engineers.' },
    { title: 'Centralised application logging', detail: 'Ship logs from EC2, Lambda and containers to log groups with retention policies.' },
    { title: 'Automatic recovery', detail: 'EC2 alarm action to recover an instance after a system status check failure.' },
  ],
  importance: {
    points: [
      'Monitoring metrics drive scaling and high availability in Tasks 2.2 and 3.2 ("identifying metrics and conditions to perform scaling actions").',
      'Distinguish CloudWatch (metrics/logs/alarms) from CloudTrail (API audit) and AWS Config (resource configuration).',
      'Common detail: EC2 does not report memory or disk usage without the agent.',
    ],
  },
  cli: [
    { command: 'aws cloudwatch put-metric-alarm --alarm-name high-cpu --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 80 --comparison-operator GreaterThanThreshold --evaluation-periods 2 --dimensions Name=InstanceId,Value=i-0abc --alarm-actions <sns-topic-arn>', description: 'Alarm when CPU averages above 80% for 10 minutes.' },
    { command: 'aws cloudwatch put-metric-data --namespace MyApp --metric-name QueueDepth --value 42 --unit Count', description: 'Publish a custom metric.' },
    { command: 'aws cloudwatch get-metric-statistics --namespace AWS/EC2 --metric-name CPUUtilization --dimensions Name=InstanceId,Value=i-0abc --start-time 2026-10-01T00:00:00Z --end-time 2026-10-02T00:00:00Z --period 3600 --statistics Average', description: 'Read metric statistics.' },
    { command: 'aws logs create-log-group --log-group-name /app/web && aws logs put-retention-policy --log-group-name /app/web --retention-in-days 30', description: 'Create a log group and set retention.' },
    { command: 'aws logs filter-log-events --log-group-name /app/web --filter-pattern "ERROR"', description: 'Search logs for a pattern.' },
    { command: 'aws logs put-metric-filter --log-group-name /app/web --filter-name errors --filter-pattern "ERROR" --metric-transformations metricName=ErrorCount,metricNamespace=MyApp,metricValue=1', description: 'Turn log lines into a metric.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): publish a custom metric',
        language: 'python',
        code: `import boto3

cw = boto3.client("cloudwatch")
cw.put_metric_data(
    Namespace="MyApp",
    MetricData=[{"MetricName": "QueueDepth", "Value": 42, "Unit": "Count"}],
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Alarm that notifies and scales',
      scenario: 'A web fleet must scale out when CPU is high and the on-call team must be told about sustained saturation.',
      steps: [
        'Create a CloudWatch alarm on the Auto Scaling group\'s average CPU > 70%.',
        'Attach the alarm to an Auto Scaling step scaling policy.',
        'Add an SNS topic action on the ALARM state to notify the on-call team.',
        'Install the CloudWatch agent to also report memory usage.',
      ],
    },
  ],
  diagram: {
    title: 'CloudWatch metrics, alarms and actions',
    nodes: [
      ['res', 'EC2 / ELB / Lambda', 'compute', 0, 1],
      ['cw', 'CloudWatch metrics and logs', 'integration', 1, 1],
      ['alarm', 'Alarm (threshold)', 'integration', 2, 1],
      ['sns', 'SNS notification', 'integration', 3, 0],
      ['asg', 'Auto Scaling policy', 'compute', 3, 2],
    ],
    edges: [
      ['res', 'cw', '1. Publish metrics'],
      ['cw', 'alarm', '2. Evaluate'],
      ['alarm', 'sns', '3a. Notify'],
      ['alarm', 'asg', '3b. Scale'],
    ],
    steps: [
      'AWS resources (and the CloudWatch agent) publish metrics and logs to CloudWatch.',
      'An alarm evaluates a metric against a threshold over several periods.',
      'When the alarm state changes it can notify people through SNS and trigger Auto Scaling or EC2 actions automatically.',
    ],
  },
  questionTypes: [
    { pattern: 'Which service for monitoring vs auditing?', hint: 'CloudWatch = performance; CloudTrail = API activity; Config = configuration history.' },
    { pattern: 'Memory or disk monitoring on EC2', hint: 'Install the CloudWatch agent (custom metrics).' },
    { pattern: 'Automatic response to a metric', hint: 'Alarm actions: SNS, Auto Scaling, EC2 recover/stop/terminate.' },
    { pattern: 'Search or retain logs', hint: 'CloudWatch Logs retention, metric filters, Logs Insights, export to S3.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company needs to monitor memory utilization on its EC2 instances and trigger an alarm when it exceeds 85%. What must be done?',
      options: ['Nothing - memory is a default EC2 metric', 'Install the CloudWatch agent to publish memory metrics and create an alarm on them', 'Enable CloudTrail data events', 'Use AWS Config rules'],
      answer: ['B'],
      explanation: 'EC2 publishes CPU, network and disk I/O metrics by default, but not operating-system-level metrics such as memory. The CloudWatch agent publishes them as custom metrics.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An EC2 instance occasionally becomes unresponsive due to an underlying hardware problem. The company wants it to be recovered automatically on the same host identity. Which feature should be used?',
      options: ['A CloudWatch alarm with the EC2 recover action on the system status check', 'An S3 lifecycle rule', 'A Route 53 health check only', 'An SQS dead-letter queue'],
      answer: ['A'],
      explanation: 'A CloudWatch alarm on StatusCheckFailed_System can use the recover action to automatically recover the instance, keeping its ID, private IP and Elastic IP.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which service should a solutions architect use to find out which IAM user terminated an EC2 instance yesterday?',
      options: ['Amazon CloudWatch metrics', 'AWS CloudTrail', 'VPC Flow Logs', 'AWS Trusted Advisor'],
      answer: ['B'],
      explanation: 'CloudTrail records API calls (who, when, from where). CloudWatch measures performance, not API actors.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company wants to be notified whenever the log lines of an application contain the word "FATAL". What is the MOST efficient approach?',
      options: ['Create a CloudWatch Logs metric filter, an alarm on the resulting metric, and an SNS action', 'Download logs daily and grep them', 'Use an EC2 instance to poll the logs', 'Enable S3 versioning'],
      answer: ['A'],
      explanation: 'Metric filters turn matching log events into a metric; an alarm on that metric can notify through SNS without custom code.',
    },
  ],
  keyFacts: [
    'EC2 basic monitoring publishes metrics every 5 minutes; detailed monitoring every 1 minute (extra cost). Custom metrics can be high-resolution (down to 1 second).',
    'Memory and disk-space utilisation are NOT default EC2 metrics - use the CloudWatch agent.',
    'Alarm states: OK, ALARM, INSUFFICIENT_DATA. Alarm actions: SNS, Auto Scaling, EC2 stop/terminate/reboot/recover.',
    'Log groups have configurable retention (default never expire); logs can be exported to S3 or streamed with subscription filters.',
    'Metric filters extract metrics from logs; Logs Insights runs interactive queries.',
    'CloudWatch is Regional; dashboards can show metrics across Regions and accounts.',
    'CloudTrail = audit of API calls; Config = configuration state/compliance; CloudWatch = performance and logs.',
  ],
  traps: [
    { clue: 'Memory or disk usage for EC2', answer: 'CloudWatch agent (custom metrics).' },
    { clue: 'Who made this API call?', answer: 'CloudTrail, not CloudWatch.' },
    { clue: 'Auto-recover a failed instance', answer: 'CloudWatch alarm recover action.' },
    { clue: 'Convert log text into an alert', answer: 'Metric filter + alarm + SNS.' },
  ],
  related: ['ec2-auto-scaling', 'sns', 'cloudtrail', 'config', 'eventbridge', 'x-ray'],
  sources: [
    { title: 'What is Amazon CloudWatch?', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html' },
    { title: 'Using Amazon CloudWatch alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html' },
    { title: 'Collect metrics and logs with the CloudWatch agent', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html' },
    { title: 'Amazon CloudWatch Logs', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html' },
    { title: 'AWS CLI cloudwatch commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/cloudwatch/index.html' },
  ],
};
