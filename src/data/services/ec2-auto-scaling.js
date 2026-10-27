import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon EC2 Auto Scaling. Schema: see s3.js. */
export default {
  tagline: 'Keep the right number of healthy EC2 instances running - automatically scaling with demand across Availability Zones.',
  intro: [
    'An Auto Scaling group (ASG) is a fleet of EC2 instances defined by a launch template plus minimum, desired and maximum capacity.',
    'The group spans multiple Availability Zones in one Region and rebalances capacity; it replaces instances that fail EC2 or load balancer health checks.',
    'Scaling policies adjust capacity: target tracking (hold a metric at a target), step and simple scaling (CloudWatch alarms), scheduled scaling and predictive scaling.',
    'Integrates with Elastic Load Balancing: new instances register with target groups and unhealthy ones are removed, giving high availability and elasticity.',
    'Mixed instances policies combine On-Demand and Spot capacity and multiple instance types to optimise cost.',
    'Lifecycle hooks pause launch or termination for custom actions; warm pools pre-initialise instances to shorten scale-out time; instance refresh rolls out new AMIs.',
  ],
  useCases: [
    { title: 'Elastic web tier', detail: 'Scale a fleet behind an Application Load Balancer on CPU or requests per target.' },
    { title: 'Self-healing single instance', detail: 'Min=max=1 replaces a failed server automatically.' },
    { title: 'Queue-driven workers', detail: 'Scale worker instances on an SQS backlog-per-instance metric.' },
    { title: 'Cost-optimised fleets', detail: 'Mix Spot and On-Demand with several instance types in one group.' },
  ],
  importance: {
    points: [
      'Scaling and high availability are core to Domains 2, 3 and 4 (Tasks 2.1, 3.2, 4.2).',
      'AWS\'s own sample questions use ASG + ALB multi-AZ designs and a step-scaling warm-up scenario.',
      'Know the policy types and which metric to scale on; this is a frequent decision point.',
    ],
  },
  cli: [
    { command: 'aws autoscaling create-auto-scaling-group --auto-scaling-group-name web-asg --launch-template LaunchTemplateName=web-lt,Version=\'$Latest\' --min-size 2 --max-size 6 --desired-capacity 2 --vpc-zone-identifier "subnet-a,subnet-b" --target-group-arns <tg-arn> --health-check-type ELB --health-check-grace-period 120', description: 'Create a multi-AZ ASG attached to a load balancer target group.' },
    { command: 'aws autoscaling put-scaling-policy --auto-scaling-group-name web-asg --policy-name cpu50 --policy-type TargetTrackingScaling --target-tracking-configuration file://tt.json', description: 'Add a target tracking policy (for example average CPU 50%).' },
    { command: 'aws autoscaling put-scheduled-update-group-action --auto-scaling-group-name web-asg --scheduled-action-name morning --recurrence "0 8 * * *" --min-size 4', description: 'Schedule capacity changes.' },
    { command: 'aws autoscaling describe-scaling-activities --auto-scaling-group-name web-asg', description: 'Inspect recent scale in/out events.' },
    { command: 'aws autoscaling start-instance-refresh --auto-scaling-group-name web-asg', description: 'Roll out a new launch template version gradually.' },
    { command: 'aws autoscaling set-desired-capacity --auto-scaling-group-name web-asg --desired-capacity 4', description: 'Manually set capacity.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): target tracking policy',
        language: 'python',
        code: `import boto3

asg = boto3.client("autoscaling")
asg.put_scaling_policy(
    AutoScalingGroupName="web-asg",
    PolicyName="cpu-target-50",
    PolicyType="TargetTrackingScaling",
    TargetTrackingConfiguration={
        "PredefinedMetricSpecification": {"PredefinedMetricType": "ASGAverageCPUUtilization"},
        "TargetValue": 50.0,
    },
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Highly available web tier',
      scenario: 'A web application on a single instance must survive an AZ failure and absorb daily traffic spikes.',
      steps: [
        'Create a launch template with the AMI, instance type, security group and role.',
        'Create an ASG across subnets in at least two AZs with min 2, max 8.',
        'Attach it to an ALB target group and use ELB health checks.',
        'Add a target tracking policy on ALBRequestCountPerTarget.',
        'Set an instance warm-up so new instances are not counted before they are ready.',
      ],
    },
  ],
  diagram: {
    title: 'Auto Scaling group behind a load balancer',
    nodes: [
      ['user', 'Users', 'actor', 0, 1],
      ['alb', 'Application Load Balancer', 'network', 1, 1],
      ['asg', 'Auto Scaling group (2+ AZs)', 'compute', 2, 1],
      ['cw', 'CloudWatch alarm / metric', 'integration', 2, 0],
      ['lt', 'Launch template', 'compute', 3, 1],
    ],
    edges: [
      ['user', 'alb', 'HTTPS requests'],
      ['alb', 'asg', 'Route to healthy'],
      ['cw', 'asg', 'Scale out / in'],
      ['lt', 'asg', 'Defines instances'],
    ],
    steps: [
      'Users send requests to the load balancer, which only sends traffic to healthy instances.',
      'CloudWatch metrics (CPU, request count per target, custom metrics) trigger scaling policies.',
      'The ASG launches instances using the launch template, spreading them across Availability Zones, and terminates extras when load drops.',
    ],
  },
  questionTypes: [
    { pattern: 'High availability for a web tier', hint: 'ASG across multiple AZs + ALB; database in Multi-AZ.' },
    { pattern: 'Pick the scaling policy', hint: 'Target tracking for steady metric goals, scheduled for known peaks, predictive for recurring patterns.' },
    { pattern: 'Slow-starting instances cause over-scaling', hint: 'Configure instance warm-up for step scaling policies.' },
    { pattern: 'Scale on queue depth', hint: 'Custom metric: SQS messages per instance.' },
  ],
  questions: [
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q8', domain: 2, multi: true,
      stem: 'A company has a two-tier application architecture that runs in public and private subnets. Amazon EC2 instances running the web application are in the public subnet and an EC2 instance for the database runs on the private subnet. The web application instances and the database are running in a single Availability Zone (AZ). Which combination of steps should a solutions architect take to provide high availability for this architecture? (Select TWO.)',
      options: [
        'Create new public and private subnets in the same AZ.',
        'Create an Amazon EC2 Auto Scaling group and Application Load Balancer spanning multiple AZs for the web application instances.',
        'Add the existing web application instances to an Auto Scaling group behind an Application Load Balancer.',
        'Create new public and private subnets in a new AZ. Create a database using an EC2 instance in the public subnet in the new AZ. Migrate the old database contents to the new database.',
        'Create new public and private subnets in the same VPC, each in a new AZ. Create an Amazon RDS Multi-AZ DB instance in the private subnets. Migrate the old database contents to the new DB instance.',
      ],
      answer: ['B', 'E'],
      explanation: 'Create new subnets in a new AZ to provide a redundant network. Create an Auto Scaling group with instances in two AZs behind the load balancer to ensure high availability of the web application and redistribution of web traffic between the two public AZs. Create an RDS DB instance in the two private subnets to make the database tier highly available too. (AWS official explanation.)',
    },
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q9', domain: 3,
      stem: 'A website runs a custom web application that receives a burst of traffic each day at noon. The users upload new pictures and content daily, but have been complaining of timeouts. The architecture uses Amazon EC2 Auto Scaling groups, and the application consistently takes 1 minute to initiate upon boot up before responding to user requests. How should a solutions architect redesign the architecture to better respond to changing traffic?',
      options: [
        'Configure a Network Load Balancer with a slow start configuration.',
        'Configure Amazon ElastiCache for Redis to offload direct requests from the EC2 instances.',
        'Configure an Auto Scaling step scaling policy with an EC2 instance warmup condition.',
        'Configure Amazon CloudFront to use an Application Load Balancer as the origin.',
      ],
      answer: ['C'],
      explanation: 'The current configuration puts new EC2 instances into service before they are able to respond to transactions, which can also cause over-scaling. With a step scaling policy you can specify the number of seconds it takes for a newly launched instance to warm up; until then it is not counted toward the group\'s aggregated metrics. (AWS official explanation.)',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company wants its web tier to keep average CPU utilization near 50% as traffic changes, with minimal configuration effort. Which scaling approach should be used?',
      options: ['Simple scaling with a manual cooldown calculation', 'Target tracking scaling on average CPU utilization', 'Scheduled scaling every hour', 'Manually changing the desired capacity'],
      answer: ['B'],
      explanation: 'Target tracking creates and manages the CloudWatch alarms for you and adjusts capacity to keep the metric at the target.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A batch processing application reads jobs from an Amazon SQS queue. Processing time per job is constant. The company wants the number of EC2 workers to scale with the backlog. Which metric is the MOST appropriate scaling signal?',
      options: ['CPU utilization of the workers', 'Number of messages visible in the queue divided by the number of running instances (backlog per instance)', 'Network out of the load balancer', 'Disk read operations'],
      answer: ['B'],
      explanation: 'Backlog per instance (queue length divided by the number of workers) directly measures how much work is waiting per worker and is the recommended custom metric for queue-based scaling.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An Auto Scaling group uses EC2 health checks only. An application process on one instance crashes, but the instance still passes EC2 status checks and keeps receiving traffic from the load balancer. What should be changed?',
      options: ['Enable ELB health checks for the Auto Scaling group.', 'Increase the group\'s maximum size.', 'Disable the load balancer.', 'Switch to a smaller instance type.'],
      answer: ['A'],
      explanation: 'EC2 status checks do not detect application failures. With ELB health checks enabled, the ASG treats instances that fail the load balancer\'s health check as unhealthy and replaces them.',
    },
  ],
  keyFacts: [
    'ASG capacity has three values: minimum, desired and maximum; scaling never goes outside min/max.',
    'Use launch templates (launch configurations are the legacy option); an ASG spans subnets in multiple AZs of one Region only.',
    'Health check types: EC2 (default) and ELB; use ELB checks so application-level failures replace instances.',
    'Policy types: target tracking (recommended), step, simple, scheduled and predictive scaling.',
    'Default termination policy first balances AZs, then picks instances based on launch template/configuration age and billing hour.',
    'The default cooldown for simple scaling is 300 seconds; use instance warm-up for step/target tracking policies.',
    'Mixed instances policy lets one group use multiple instance types and Spot + On-Demand purchase options.',
    'Lifecycle hooks (Pending:Wait, Terminating:Wait) let you run scripts before an instance enters service or terminates.',
  ],
  traps: [
    { clue: 'Instances take time to boot and scaling over-reacts', answer: 'Instance warm-up on the scaling policy.' },
    { clue: 'Known, predictable peak every morning', answer: 'Scheduled scaling (or predictive scaling for recurring patterns).' },
    { clue: 'Keep a metric at a target value', answer: 'Target tracking scaling policy.' },
    { clue: 'Workers consume from a queue', answer: 'Scale on SQS backlog per instance.' },
    { clue: 'Replace app-level failed instances', answer: 'ELB health checks on the ASG.' },
  ],
  related: ['ec2', 'elb', 'cloudwatch', 'sqs', 'rds'],
  sources: [
    { title: 'What is Amazon EC2 Auto Scaling?', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html' },
    { title: 'Scaling policies and types', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scale-based-on-demand.html' },
    { title: 'Target tracking scaling policies', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html' },
    { title: 'Health checks for Auto Scaling instances', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html' },
    { title: 'Lifecycle hooks', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html' },
    { title: 'AWS CLI autoscaling commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/autoscaling/index.html' },
  ],
};
