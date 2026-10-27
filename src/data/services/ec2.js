import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon EC2. Schema: see s3.js. */
export default {
  tagline: 'Resizable virtual servers in the cloud - choose the instance family, purchasing option and storage that fit the workload.',
  intro: [
    'Amazon EC2 provides virtual machines (instances) launched from an Amazon Machine Image (AMI) with a chosen instance type, networking, storage and security group.',
    'Instance families target workloads: general purpose (M, T), compute optimized (C), memory optimized (R, X), storage optimized (I, D) and accelerated computing (P, G, Inf, Trn).',
    'Purchasing options trade commitment for price: On-Demand, Savings Plans, Reserved Instances, Spot Instances (up to 90% discount, can be interrupted), Dedicated Hosts and Capacity Reservations.',
    'Storage: EBS volumes persist independently of the instance; instance store is physically attached, very fast, and its data is lost when the instance stops or terminates.',
    'Placement groups control placement: cluster (low latency), spread (isolate critical instances) and partition (large distributed systems such as Hadoop or Cassandra).',
    'Instances get permissions from IAM roles (instance profile), network protection from security groups, and can run bootstrap scripts through user data.',
  ],
  useCases: [
    { title: 'Lift-and-shift and legacy apps', detail: 'Run existing servers with full OS control and licence-specific software.' },
    { title: 'Elastic web and application tiers', detail: 'Pair with Auto Scaling and a load balancer for scalable, highly available fleets.' },
    { title: 'Batch and fault-tolerant processing on Spot', detail: 'Use Spot Instances for stateless, interruptible jobs at the lowest price.' },
    { title: 'High-performance and GPU workloads', detail: 'Cluster placement groups, enhanced networking and accelerated instances for HPC and ML.' },
  ],
  importance: {
    points: [
      'Compute is in every domain: Task 3.2 (elastic compute), 4.2 (instance family, size and purchasing options) and 2.1/2.2 (scaling and availability).',
      'Purchasing-option and hibernation questions appear in AWS\'s own sample set; expect several cost and availability scenarios.',
      'Know when EC2 is the answer (full OS control, lift-and-shift) and when serverless or containers are better.',
    ],
  },
  cli: [
    { command: 'aws ec2 run-instances --image-id ami-0abc --instance-type t3.micro --subnet-id subnet-0abc --security-group-ids sg-0abc --iam-instance-profile Name=AppProfile --count 1', description: 'Launch an instance with a role and security group.' },
    { command: 'aws ec2 describe-instances --filters Name=instance-state-name,Values=running', description: 'List running instances.' },
    { command: 'aws ec2 stop-instances --instance-ids i-0abc --hibernate', description: 'Hibernate an instance enabled for hibernation (saves RAM to the EBS root volume).' },
    { command: 'aws ec2 create-image --instance-id i-0abc --name web-v2', description: 'Create an AMI from a running instance.' },
    { command: 'aws ec2 request-spot-fleet --spot-fleet-request-config file://fleet.json', description: 'Request a Spot Fleet.' },
    { command: 'aws ec2 create-placement-group --group-name hpc --strategy cluster', description: 'Create a cluster placement group.' },
    { command: 'aws ec2 describe-instance-types --filters Name=memory-info.size-in-mib,Values=16384', description: 'Find instance types by attributes.' },
    { command: 'aws ssm start-session --target i-0abc', description: 'Open a shell through Session Manager (no SSH port or key needed).' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): launch an instance with a role',
        language: 'python',
        code: `import boto3

ec2 = boto3.resource("ec2", region_name="ap-south-1")
instances = ec2.create_instances(
    ImageId="ami-0abc1234567890def",
    InstanceType="t3.micro",
    MinCount=1,
    MaxCount=1,
    SubnetId="subnet-0abc",
    SecurityGroupIds=["sg-0abc"],
    IamInstanceProfile={"Name": "AppProfile"},
    TagSpecifications=[{"ResourceType": "instance",
                        "Tags": [{"Key": "Name", "Value": "web-1"}]}],
)
print(instances[0].id)`,
      },
    ],
  },
  examples: [
    {
      title: 'Mix purchasing options to cut cost',
      scenario: 'A steady baseline of web servers runs 24x7, with unpredictable bursts and a nightly batch job that can be interrupted.',
      steps: [
        'Cover the always-on baseline with a Compute Savings Plan or Reserved Instances.',
        'Handle bursts with On-Demand instances in an Auto Scaling group.',
        'Run the interruptible batch job on Spot Instances with checkpointing.',
        'Review utilisation with Compute Optimizer and Cost Explorer.',
      ],
    },
  ],
  diagram: {
    title: 'EC2 instance and its supporting services',
    nodes: [
      ['ami', 'AMI (OS + software)', 'compute', 0, 1],
      ['ec2', 'EC2 instance', 'compute', 1, 1],
      ['ebs', 'EBS volume (persistent)', 'storage', 2, 0],
      ['sg', 'Security group', 'security', 2, 1],
      ['role', 'IAM role (instance profile)', 'security', 2, 2],
    ],
    edges: [
      ['ami', 'ec2', '1. Launch from AMI'],
      ['ec2', 'ebs', '2. Root/data volume'],
      ['sg', 'ec2', '3. Filters traffic'],
      ['role', 'ec2', '4. Temp credentials'],
    ],
    steps: [
      'An AMI provides the operating system and software image used to launch the instance.',
      'EBS volumes provide persistent block storage that survives stop/start.',
      'The security group acts as a stateful virtual firewall around the instance\'s network interface.',
      'The IAM role attached through an instance profile gives the instance temporary credentials to call AWS APIs.',
    ],
  },
  questionTypes: [
    { pattern: 'Choose the cheapest purchasing option', hint: 'Steady = Savings Plans/RI; spiky = On-Demand; interruptible = Spot; compliance licensing = Dedicated Host.' },
    { pattern: 'Pick an instance family', hint: 'Memory-intensive databases = R/X; CPU-bound = C; GPU = P/G; high IOPS local storage = I.' },
    { pattern: 'Stop and resume with memory state', hint: 'Hibernation saves RAM contents to the EBS root volume.' },
    { pattern: 'Fast failover on a private IP', hint: 'Move a secondary elastic network interface to a standby instance.' },
    { pattern: 'Low-latency vs fault-tolerant placement', hint: 'Cluster for low latency, spread/partition for failure isolation.' },
  ],
  questions: [
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q2', domain: 4,
      stem: 'A solutions architect wants to design a solution to save costs for Amazon EC2 instances that do not need to run during a 2-week company shutdown. The applications running on the EC2 instances store data in instance memory that must be present when the instances resume operation. Which approach should the solutions architect recommend to shut down and resume the EC2 instances?',
      options: [
        'Modify the application to store the data on instance store volumes. Reattach the volumes while restarting them.',
        'Snapshot the EC2 instances before stopping them. Restore the snapshot after restarting the instances.',
        'Run the applications on EC2 instances enabled for hibernation. Hibernate the instances before the 2-week company shutdown.',
        'Note the Availability Zone for each EC2 instance before stopping it. Restart the instances in the same Availability Zones after the 2-week company shutdown.',
      ],
      answer: ['C'],
      explanation: 'Hibernating EC2 instances save the contents of instance memory to an Amazon EBS root volume. When the instances restart, the instance memory contents are reloaded. (AWS official explanation.)',
    },
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q3', domain: 2,
      stem: 'A company plans to run a monitoring application on an Amazon EC2 instance in a VPC. Connections are made to the EC2 instance using the instance\'s private IPv4 address. A solutions architect needs to design a solution that will allow traffic to be quickly directed to a standby EC2 instance if the application fails and becomes unreachable. Which approach will meet these requirements?',
      options: [
        'Deploy an Application Load Balancer configured with a listener for the private IP address and register the primary EC2 instance with the load balancer. Upon failure, de-register the instance and register the standby EC2 instance.',
        'Configure a custom DHCP option set. Configure DHCP to assign the same private IP address to the standby EC2 instance when the primary EC2 instance fails.',
        'Attach a secondary elastic network interface to the EC2 instance configured with the private IP address. Move the network interface to the standby EC2 instance if the primary EC2 instance becomes unreachable.',
        'Associate an Elastic IP address with the network interface of the primary EC2 instance. Disassociate the Elastic IP from the primary instance upon failure and associate it with a standby EC2 instance.',
      ],
      answer: ['C'],
      explanation: 'A secondary elastic network interface can be added to an EC2 instance. While primary network interfaces cannot be detached from an instance, secondary network interfaces can be detached and attached to a different EC2 instance. (AWS official explanation.)',
    },
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q6', domain: 4,
      stem: 'A company uses Amazon EC2 Reserved Instances to run its data processing workload. The nightly job typically takes 7 hours to run and must finish within a 10-hour time window. The company anticipates temporary increases in demand at the end of each month that will cause the job to run over the time limit with the capacity of the current resources. Once started, the processing job cannot be interrupted before completion. The company wants to implement a solution that would provide increased resource capacity as cost-effectively as possible. What should a solutions architect do to accomplish this?',
      options: [
        'Deploy On-Demand Instances during periods of high demand.',
        'Create a second EC2 reservation for additional instances.',
        'Deploy Spot Instances during periods of high demand.',
        'Increase the EC2 instance size in the EC2 reservation to support the increased workload.',
      ],
      answer: ['A'],
      explanation: 'While Spot Instances would be the least costly option, they are not suitable for jobs that cannot be interrupted or must complete within a certain time period. On-Demand Instances would be billed for the number of seconds they are running. (AWS official explanation.)',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A research team runs a stateless, fault-tolerant image-rendering job that can be restarted from checkpoints. The job must be completed at the lowest possible cost. Which EC2 purchasing option should the team choose?',
      options: ['On-Demand Instances', 'Spot Instances', 'Dedicated Hosts', 'Standard Reserved Instances for 3 years'],
      answer: ['B'],
      explanation: 'Spot Instances offer the deepest discounts and suit interruptible, checkpointed workloads. Reserved Instances and Dedicated Hosts are for steady or licence-bound usage; On-Demand costs more.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A high-performance computing application requires the lowest possible network latency between tightly coupled EC2 instances. Which feature should the solutions architect use?',
      options: [
        'A spread placement group across multiple Regions',
        'A cluster placement group in a single Availability Zone',
        'A partition placement group across three Availability Zones',
        'An Auto Scaling group with instances in every Availability Zone',
      ],
      answer: ['B'],
      explanation: 'A cluster placement group packs instances close together inside one Availability Zone for low-latency, high-throughput networking. Spread and partition groups prioritise fault isolation instead.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'An in-memory analytics workload processes very large datasets entirely in RAM and is currently CPU-idle but memory-constrained. Which EC2 instance family is the BEST fit?',
      options: ['Compute optimized (C)', 'Memory optimized (R/X)', 'Storage optimized (I)', 'General purpose burstable (T)'],
      answer: ['B'],
      explanation: 'Memory optimized instances provide a high memory-to-vCPU ratio for in-memory databases and analytics. Compute optimized instances target CPU-bound work.',
    },
  ],
  keyFacts: [
    'Spot Instances can be up to 90% cheaper than On-Demand but can be reclaimed with a two-minute interruption notice - use them only for fault-tolerant work.',
    'Reserved Instances and Savings Plans commit to 1 or 3 years; Compute Savings Plans also apply to Fargate and Lambda and are the most flexible.',
    'Stopping an instance keeps EBS volumes; terminating deletes the root volume by default; instance store data is lost on stop or terminate.',
    'Hibernation writes RAM to the EBS root volume so the instance resumes with its in-memory state; you do not pay for compute while hibernated (only EBS and Elastic IP).',
    'Placement groups: cluster = low latency in one AZ; spread = each instance on distinct hardware (up to 7 running instances per AZ per group); partition = isolated groups of racks.',
    'A secondary network interface can be detached and attached to another instance (keeping its private IP) - a classic fast-failover pattern.',
    'An AMI is Regional; copy it to use it in another Region. Security group changes apply immediately to running instances.',
    'IMDSv2 (session-oriented metadata) is the more secure option for the instance metadata service.',
  ],
  traps: [
    { clue: 'Interruptible, flexible start time, lowest cost', answer: 'Spot Instances.' },
    { clue: 'Steady 24x7 usage for 1-3 years', answer: 'Savings Plans or Reserved Instances.' },
    { clue: 'Resume with RAM contents intact after stopping', answer: 'EC2 hibernation.' },
    { clue: 'Bring-your-own server-bound licences / compliance', answer: 'Dedicated Hosts.' },
    { clue: 'Shell access without opening port 22', answer: 'Systems Manager Session Manager.' },
  ],
  related: ['ec2-auto-scaling', 'ebs', 'elb', 'vpc', 'cost-management', 'iam'],
  sources: [
    { title: 'What is Amazon EC2?', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html' },
    { title: 'Amazon EC2 instance types', url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html' },
    { title: 'Instance purchasing options', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html' },
    { title: 'Hibernate your Amazon EC2 instance', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html' },
    { title: 'Placement groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html' },
    { title: 'Spot Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html' },
    { title: 'AWS CLI ec2 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/index.html' },
  ],
};
