import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Route 53. Schema: see s3.js. */
export default {
  tagline: 'Highly available DNS with health checks and routing policies for failover, latency and global traffic management.',
  intro: [
    'Amazon Route 53 is a scalable DNS service that also registers domain names and runs health checks on endpoints.',
    'Public hosted zones answer internet queries; private hosted zones answer queries only from associated VPCs.',
    'Alias records map a name (even the zone apex such as example.com) to AWS resources like CloudFront, ELB, API Gateway or S3 websites at no query charge; CNAME records cannot be used at the apex.',
    'Routing policies: simple, weighted, latency, failover, geolocation, geoproximity, multivalue answer and IP-based.',
    'Health checks monitor endpoints (and CloudWatch alarms or other health checks); failover and other policies can stop returning unhealthy records.',
    'Route 53 Resolver connects VPC and on-premises DNS using inbound and outbound endpoints and forwarding rules.',
  ],
  useCases: [
    { title: 'Multi-Region failover', detail: 'Failover records with health checks send users to a standby Region or static site when the primary fails.' },
    { title: 'Lowest-latency routing', detail: 'Latency records route users to the Region with the best latency.' },
    { title: 'Blue/green and canary releases', detail: 'Weighted records shift a percentage of traffic to a new version.' },
    { title: 'Hybrid DNS', detail: 'Resolver endpoints resolve on-premises names from the VPC and AWS names from on-premises.' },
  ],
  importance: {
    points: [
      'Route 53 is a named service in Tasks 2.2 and 3.4 and underpins every multi-Region and DR design.',
      'The exam loves routing-policy selection: failover vs latency vs weighted vs geolocation.',
      'Alias vs CNAME and private hosted zones are frequent detail questions.',
    ],
  },
  cli: [
    { command: 'aws route53 create-hosted-zone --name example.com --caller-reference 2026-01-01', description: 'Create a public hosted zone.' },
    { command: 'aws route53 change-resource-record-sets --hosted-zone-id Z123 --change-batch file://change.json', description: 'Create or update records (including alias and weighted records).' },
    { command: 'aws route53 create-health-check --caller-reference hc1 --health-check-config Type=HTTPS,FullyQualifiedDomainName=app.example.com,Port=443,ResourcePath=/health', description: 'Create an endpoint health check.' },
    { command: 'aws route53 list-resource-record-sets --hosted-zone-id Z123', description: 'List records in a zone.' },
    { command: 'aws route53 associate-vpc-with-hosted-zone --hosted-zone-id Z123 --vpc VPCRegion=ap-south-1,VPCId=vpc-0abc', description: 'Associate a VPC with a private hosted zone.' },
    { command: 'aws route53resolver create-resolver-endpoint --name inbound --direction INBOUND --security-group-ids sg-0abc --ip-addresses SubnetId=subnet-a SubnetId=subnet-b --creator-request-id r1', description: 'Create an inbound Resolver endpoint.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): upsert a failover alias record',
        language: 'python',
        code: `import boto3

r53 = boto3.client("route53")
r53.change_resource_record_sets(
    HostedZoneId="Z123EXAMPLE",
    ChangeBatch={"Changes": [{
        "Action": "UPSERT",
        "ResourceRecordSet": {
            "Name": "app.example.com", "Type": "A",
            "SetIdentifier": "primary", "Failover": "PRIMARY",
            "HealthCheckId": "abcdef11-2222-3333-4444-555555fedcba",
            "AliasTarget": {"HostedZoneId": "Z35SXDOTRQ7X7K",
                            "DNSName": "primary-alb-123.ap-south-1.elb.amazonaws.com",
                            "EvaluateTargetHealth": True},
        },
    }]},
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Active-passive failover to a static S3 site',
      scenario: 'An ALB-fronted app should fail over to a static "we are down" page hosted on S3 if its health check fails.',
      steps: [
        'Create a health check on the primary endpoint.',
        'Create a PRIMARY failover alias record to the ALB and associate the health check.',
        'Create a SECONDARY failover alias record to the S3 website endpoint (or CloudFront).',
        'Route 53 returns the secondary record only while the primary is unhealthy.',
      ],
    },
  ],
  diagram: {
    title: 'Route 53 failover routing',
    nodes: [
      ['user', 'User', 'actor', 0, 1],
      ['r53', 'Route 53 (failover policy)', 'network', 1, 1],
      ['hc', 'Health check', 'integration', 1, 0],
      ['primary', 'Primary: ALB (Region A)', 'compute', 2, 0],
      ['secondary', 'Secondary: S3/ALB (Region B)', 'storage', 2, 2],
    ],
    edges: [
      ['user', 'r53', '1. DNS query'],
      ['hc', 'r53', '2. Reports health'],
      ['r53', 'primary', '3. Healthy: answer'],
      ['r53', 'secondary', '4. Unhealthy: answer', 'dashed'],
    ],
    steps: [
      'The user\'s resolver asks Route 53 for the application name.',
      'Route 53 consults the health check status of the primary endpoint.',
      'If healthy, it answers with the primary record; if unhealthy, it answers with the secondary record, shifting users to the standby.',
    ],
  },
  questionTypes: [
    { pattern: 'Pick the routing policy', hint: 'Failover = DR; latency = performance; weighted = A/B and migration; geolocation = compliance by country.' },
    { pattern: 'Alias vs CNAME', hint: 'Zone apex must be an alias; aliases to AWS resources are free of query charges.' },
    { pattern: 'Private DNS', hint: 'Private hosted zone associated with VPCs; Resolver endpoints for hybrid.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company runs an application in two AWS Regions. Users should be sent to the Region that provides the lowest network latency, and traffic must avoid an unhealthy Region. Which Route 53 configuration meets this requirement?',
      options: ['Weighted routing with equal weights', 'Latency-based routing with health checks', 'Geolocation routing with a default record', 'Simple routing with two IP addresses'],
      answer: ['B'],
      explanation: 'Latency-based routing returns the lowest-latency Region, and associated health checks stop returning records for unhealthy endpoints.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company wants example.com (the zone apex) to point to a CloudFront distribution. Which record type should be used?',
      options: ['CNAME record', 'Alias record', 'MX record', 'NS record'],
      answer: ['B'],
      explanation: 'CNAME records cannot be created at the zone apex. A Route 53 alias record can point the apex to CloudFront and costs nothing for queries to AWS resources.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'During a migration, a company wants to send 10% of traffic to a new version of an application and 90% to the old one, and adjust the split over time. Which routing policy should be used?',
      options: ['Failover', 'Weighted', 'Geolocation', 'Latency'],
      answer: ['B'],
      explanation: 'Weighted routing distributes traffic by assigned weights, which is ideal for gradual rollouts and A/B testing.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Content must be served only to users in specific countries because of licensing agreements, with a different endpoint for each country. Which routing policy supports this?',
      options: ['Latency-based', 'Weighted', 'Geolocation', 'Multivalue answer'],
      answer: ['C'],
      explanation: 'Geolocation routing routes traffic based on the user\'s location (continent, country or state) and is used for localisation and compliance.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Instances in a VPC must resolve internal names such as db.corp.internal that must not be resolvable from the internet. What should be used?',
      options: ['A public hosted zone', 'A private hosted zone associated with the VPC', 'An Elastic IP', 'A CloudFront distribution'],
      answer: ['B'],
      explanation: 'A private hosted zone answers DNS queries only from the VPCs it is associated with.',
    },
  ],
  keyFacts: [
    'Alias records are free for queries to AWS resources and work at the zone apex; CNAME cannot be used at the apex.',
    'Failover routing needs a health check on the primary record; weighted records with weight 0 receive no traffic.',
    'Latency routing is based on measured latency between users and AWS Regions, not geography; geolocation is based on the user\'s location.',
    'Geoproximity routing shifts traffic toward or away from a resource using a bias (Traffic Flow).',
    'Health checks can monitor an endpoint, other health checks (calculated) or a CloudWatch alarm (for private resources).',
    'TTL controls how long resolvers cache a record; lower it before a planned migration.',
    'Private hosted zones need enableDnsHostnames and enableDnsSupport on the VPC.',
    'Route 53 can register domains and supports DNSSEC signing for public hosted zones.',
  ],
  traps: [
    { clue: 'Disaster recovery to another Region', answer: 'Failover routing policy with health checks.' },
    { clue: 'Send each user to the fastest Region', answer: 'Latency-based routing.' },
    { clue: 'Gradual traffic shift / canary', answer: 'Weighted routing.' },
    { clue: 'Restrict content by country', answer: 'Geolocation routing.' },
    { clue: 'Apex domain to an ELB or CloudFront', answer: 'Alias record.' },
  ],
  related: ['elb', 'cloudfront', 'global-accelerator', 'dr-strategies', 'vpc'],
  sources: [
    { title: 'What is Amazon Route 53?', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html' },
    { title: 'Choosing a routing policy', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html' },
    { title: 'Choosing between alias and non-alias records', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html' },
    { title: 'How health checks work', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html' },
    { title: 'AWS CLI route53 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/route53/index.html' },
  ],
};
