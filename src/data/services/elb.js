import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Elastic Load Balancing. Schema: see s3.js. */
export default {
  tagline: 'Distribute incoming traffic across healthy targets in multiple Availability Zones.',
  intro: [
    'Elastic Load Balancing (ELB) automatically spreads traffic across targets such as EC2 instances, containers, IP addresses and Lambda functions, and only sends traffic to healthy ones.',
    'Application Load Balancer (ALB) works at Layer 7: path/host/header-based routing, HTTP/HTTPS/gRPC, WebSockets, redirects, OIDC/Cognito authentication, AWS WAF integration and Lambda targets.',
    'Network Load Balancer (NLB) works at Layer 4: TCP, UDP and TLS, extreme throughput and ultra-low latency, one static or Elastic IP per Availability Zone, and PrivateLink support.',
    'Gateway Load Balancer (GWLB) works at Layer 3 and uses GENEVE to insert third-party virtual appliances (firewalls, IDS/IPS) transparently.',
    'Load balancers span multiple AZs; cross-zone load balancing spreads traffic evenly across all registered targets in every enabled AZ.',
    'TLS termination uses ACM certificates (with SNI for multiple domains); sticky sessions and connection draining (deregistration delay) are configurable.',
  ],
  useCases: [
    { title: 'Scalable web applications', detail: 'ALB in front of an Auto Scaling group across AZs for high availability.' },
    { title: 'Microservices and containers', detail: 'ALB path-based routing to ECS/EKS services with dynamic port mapping.' },
    { title: 'Static IP, TCP/UDP or extreme performance', detail: 'NLB for gaming, IoT, financial feeds, or when clients allow-list fixed IPs.' },
    { title: 'Inline security appliances', detail: 'GWLB to scale virtual firewalls and traffic inspection.' },
  ],
  importance: {
    points: [
      'Load balancing is named in Tasks 2.1, 2.2, 3.4 and 4.2 - choosing ALB vs NLB vs GWLB is an explicit skill.',
      'Nearly every highly available architecture question includes a load balancer.',
      'Know the feature differences cold: Layer 7 features vs static IP/Layer 4.',
    ],
  },
  cli: [
    { command: 'aws elbv2 create-load-balancer --name web-alb --subnets subnet-a subnet-b --security-groups sg-0abc --type application', description: 'Create an internet-facing ALB across two subnets.' },
    { command: 'aws elbv2 create-target-group --name web-tg --protocol HTTP --port 80 --vpc-id vpc-0abc --health-check-path /health', description: 'Create a target group with a health check path.' },
    { command: 'aws elbv2 register-targets --target-group-arn <tg-arn> --targets Id=i-0abc Id=i-0def', description: 'Register instances.' },
    { command: 'aws elbv2 create-listener --load-balancer-arn <alb-arn> --protocol HTTPS --port 443 --certificates CertificateArn=<acm-arn> --default-actions Type=forward,TargetGroupArn=<tg-arn>', description: 'Create an HTTPS listener with an ACM certificate.' },
    { command: 'aws elbv2 create-rule --listener-arn <listener-arn> --priority 10 --conditions Field=path-pattern,Values=\'/api/*\' --actions Type=forward,TargetGroupArn=<api-tg>', description: 'Add path-based routing.' },
    { command: 'aws elbv2 describe-target-health --target-group-arn <tg-arn>', description: 'Check target health.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): check target health',
        language: 'python',
        code: `import boto3

elbv2 = boto3.client("elbv2")
health = elbv2.describe_target_health(TargetGroupArn="arn:aws:elasticloadbalancing:...:targetgroup/web-tg/abc")
for target in health["TargetHealthDescriptions"]:
    print(target["Target"]["Id"], target["TargetHealth"]["State"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Path-based routing for microservices',
      scenario: 'One domain must route /api/* to an API service and everything else to a web service, over HTTPS.',
      steps: [
        'Create an ALB in public subnets with a security group allowing 443.',
        'Create two target groups (api-tg, web-tg) and register services/instances.',
        'Add an HTTPS listener with an ACM certificate; default action forwards to web-tg.',
        'Add a rule: path /api/* forwards to api-tg.',
      ],
    },
  ],
  diagram: {
    title: 'Application Load Balancer routing',
    nodes: [
      ['user', 'Users', 'actor', 0, 1],
      ['alb', 'ALB (HTTPS listener)', 'network', 1, 1],
      ['web', 'Web target group', 'compute', 2, 0],
      ['api', 'API target group', 'compute', 2, 2],
      ['acm', 'ACM certificate', 'security', 1, 0],
    ],
    edges: [
      ['user', 'alb', 'HTTPS (443)'],
      ['acm', 'alb', 'TLS termination'],
      ['alb', 'web', 'Default rule'],
      ['alb', 'api', 'Path /api/*'],
    ],
    steps: [
      'Users connect over HTTPS; the ALB terminates TLS using a certificate from ACM.',
      'Listener rules match on path, host or headers.',
      'Requests are forwarded to the right target group, and only to targets that pass health checks.',
    ],
  },
  questionTypes: [
    { pattern: 'Which load balancer type?', hint: 'HTTP/HTTPS routing = ALB; TCP/UDP, static IP, extreme performance = NLB; appliance insertion = GWLB.' },
    { pattern: 'Path or host-based routing', hint: 'Always ALB listener rules.' },
    { pattern: 'Preserve client IP / static Elastic IP', hint: 'NLB; for ALB use X-Forwarded-For header.' },
    { pattern: 'Cross-zone and cost', hint: 'Cross-zone is on by default for ALB; for NLB it is off by default and inter-AZ transfer is charged.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company needs to route requests for /images/* and /videos/* to different groups of EC2 instances behind one HTTPS endpoint. Which load balancer should be used?',
      options: ['Classic Load Balancer', 'Application Load Balancer', 'Network Load Balancer', 'Gateway Load Balancer'],
      answer: ['B'],
      explanation: 'Only the Application Load Balancer supports path-based routing rules at Layer 7.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A game server application uses UDP and requires ultra-low latency and a static IP address that clients can allow-list. Which solution meets these requirements?',
      options: ['Application Load Balancer with an Elastic IP', 'Network Load Balancer with an Elastic IP per Availability Zone', 'Amazon CloudFront with an ALB origin', 'Gateway Load Balancer'],
      answer: ['B'],
      explanation: 'NLB handles TCP/UDP at Layer 4 with very low latency and supports static Elastic IP addresses per AZ. ALB does not support UDP or static IPs.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company must inspect all traffic entering its VPC using a third-party virtual firewall appliance fleet that scales automatically and is transparent to applications. Which AWS service should be used?',
      options: ['AWS Shield Advanced', 'Gateway Load Balancer', 'Application Load Balancer', 'Amazon CloudFront'],
      answer: ['B'],
      explanation: 'Gateway Load Balancer is designed to deploy, scale and manage third-party virtual appliances, forwarding traffic with GENEVE encapsulation.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'During deployments, in-flight requests to terminating instances are being dropped. Which load balancer setting helps requests complete gracefully?',
      options: ['Increase the health check interval', 'Configure connection draining (deregistration delay)', 'Enable sticky sessions', 'Add more listener rules'],
      answer: ['B'],
      explanation: 'The deregistration delay keeps existing connections open while a target is deregistered so in-flight requests can complete.',
    },
  ],
  keyFacts: [
    'ALB = Layer 7 (HTTP/HTTPS/gRPC); NLB = Layer 4 (TCP/UDP/TLS); GWLB = Layer 3 + GENEVE; Classic Load Balancer is the legacy option.',
    'Only NLB gives a static IP / Elastic IP per AZ and can preserve the client source IP natively; ALB passes the client IP in X-Forwarded-For.',
    'ALB targets: instances, IPs, Lambda functions; supports authentication (OIDC, Cognito) and AWS WAF.',
    'Cross-zone load balancing is on by default for ALB; off by default for NLB and GWLB (enabling it can incur data transfer charges).',
    'Health checks decide routing; combine with Auto Scaling ELB health checks for self-healing.',
    'Use SNI on ALB/NLB listeners to serve several TLS certificates from one load balancer.',
    'Deregistration delay (connection draining) defaults to 300 seconds.',
    'Load balancers need subnets in at least two AZs for high availability.',
  ],
  traps: [
    { clue: 'Path-based or host-based routing', answer: 'Application Load Balancer.' },
    { clue: 'Static IP / UDP / millions of requests per second', answer: 'Network Load Balancer.' },
    { clue: 'Third-party firewall or IDS appliances inline', answer: 'Gateway Load Balancer.' },
    { clue: 'Authenticate users at the load balancer', answer: 'ALB with OIDC or Cognito authentication.' },
  ],
  related: ['ec2-auto-scaling', 'acm', 'waf', 'route53', 'vpc', 'privatelink'],
  sources: [
    { title: 'What is Elastic Load Balancing?', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html' },
    { title: 'What is an Application Load Balancer?', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html' },
    { title: 'What is a Network Load Balancer?', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html' },
    { title: 'What is a Gateway Load Balancer?', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html' },
    { title: 'AWS CLI elbv2 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/elbv2/index.html' },
  ],
};
