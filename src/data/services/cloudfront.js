import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon CloudFront. Schema: see s3.js. */
export default {
  tagline: 'A global content delivery network that caches content at edge locations close to users.',
  intro: [
    'Amazon CloudFront is a CDN: users are routed to a nearby edge location that returns cached content or fetches it from your origin, lowering latency and origin load.',
    'Origins can be Amazon S3, an Application Load Balancer, EC2, API Gateway, MediaStore/MediaPackage or any custom HTTP server; origin groups provide failover.',
    'Behaviors map URL path patterns to origins and cache settings (TTL, headers, cookies, query strings); invalidations remove objects before they expire.',
    'Security: HTTPS with ACM certificates (in us-east-1), Origin Access Control to keep S3 buckets private, signed URLs/cookies for private content, geo restriction, AWS WAF and automatic AWS Shield Standard.',
    'Edge compute: CloudFront Functions (lightweight viewer request/response) and Lambda@Edge (richer, at regional edge) customise requests and responses.',
    'CloudFront also accelerates dynamic and upload traffic over the AWS backbone and is cost-effective: data transfer from AWS origins to CloudFront is not charged.',
  ],
  useCases: [
    { title: 'Static website and asset delivery', detail: 'Cache images, scripts and video segments close to viewers.' },
    { title: 'Secure private content', detail: 'Signed URLs or cookies for paid or per-user content.' },
    { title: 'Global dynamic applications', detail: 'ALB/API origins accelerated over the AWS network with TLS termination at the edge.' },
    { title: 'Protect and offload origins', detail: 'Absorb traffic spikes and attacks at the edge with WAF and Shield.' },
  ],
  importance: {
    points: [
      'Named in Tasks 2.1, 3.4 and 4.4 ("edge accelerators", "CDN", "edge networking services", "strategic needs for CDNs and edge caching").',
      'CloudFront vs Global Accelerator and S3 Transfer Acceleration is a favourite distinction.',
    ],
  },
  cli: [
    { command: 'aws cloudfront create-distribution --distribution-config file://dist.json', description: 'Create a distribution.' },
    { command: 'aws cloudfront create-invalidation --distribution-id E123 --paths "/index.html" "/css/*"', description: 'Invalidate cached objects.' },
    { command: 'aws cloudfront list-distributions', description: 'List distributions.' },
    { command: 'aws cloudfront create-origin-access-control --origin-access-control-config file://oac.json', description: 'Create an OAC for a private S3 origin.' },
    { command: 'aws cloudfront get-distribution-config --id E123', description: 'Read a distribution\'s configuration.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): invalidate a path',
        language: 'python',
        code: `import boto3, time

cf = boto3.client("cloudfront")
cf.create_invalidation(
    DistributionId="E123EXAMPLE",
    InvalidationBatch={
        "Paths": {"Quantity": 1, "Items": ["/index.html"]},
        "CallerReference": str(time.time()),
    },
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Private S3 content over HTTPS with failover',
      scenario: 'A site must be fast worldwide, keep its bucket private, and survive an origin failure.',
      steps: [
        'Create a CloudFront distribution with the S3 bucket as origin using Origin Access Control.',
        'Block public access on the bucket and allow only CloudFront in the bucket policy.',
        'Add an origin group with a second bucket in another Region as failover.',
        'Attach an ACM certificate (us-east-1) and AWS WAF.',
      ],
    },
  ],
  diagram: {
    title: 'CloudFront with an S3 origin',
    nodes: [
      ['user', 'Viewers', 'actor', 0, 1],
      ['edge', 'CloudFront edge location', 'network', 1, 1],
      ['s3', 'S3 origin (private, OAC)', 'storage', 2, 1],
      ['waf', 'AWS WAF / Shield', 'security', 1, 0],
      ['acm', 'ACM cert (us-east-1)', 'security', 1, 2],
    ],
    edges: [
      ['user', 'edge', '1. HTTPS request'],
      ['waf', 'edge', 'Filters'],
      ['edge', 's3', '2. Cache miss'],
      ['acm', 'edge', 'TLS cert'],
    ],
    steps: [
      'The viewer is routed to the nearest edge location; WAF and Shield inspect the request.',
      'On a cache hit the edge responds immediately; on a miss it fetches the object from the origin using Origin Access Control.',
      'The edge caches the object for its TTL and serves later viewers directly.',
    ],
  },
  questionTypes: [
    { pattern: 'Reduce latency for global users', hint: 'CloudFront for cacheable content; Global Accelerator for non-HTTP or dynamic TCP/UDP.' },
    { pattern: 'Keep S3 private but serve publicly', hint: 'CloudFront with Origin Access Control.' },
    { pattern: 'Restrict content to paying users', hint: 'Signed URLs or signed cookies.' },
    { pattern: 'Cost reduction', hint: 'Caching reduces origin requests and data-transfer-out cost; price classes limit edge locations.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company serves static assets from S3 to users worldwide and wants lower latency while keeping the bucket private. Which solution meets these requirements?',
      options: ['Make the bucket public and use S3 Transfer Acceleration', 'Use CloudFront with Origin Access Control and a bucket policy that allows only CloudFront', 'Replicate the bucket to every Region and use latency routing', 'Use a NAT gateway'],
      answer: ['B'],
      explanation: 'CloudFront caches content at the edge and OAC lets the origin bucket stay private, readable only through the distribution.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A video platform sells premium videos and must ensure that only paying customers can download them from CloudFront for a limited time. What should be used?',
      options: ['Geo restriction', 'CloudFront signed URLs or signed cookies', 'An S3 bucket in a private subnet', 'Route 53 weighted routing'],
      answer: ['B'],
      explanation: 'Signed URLs/cookies grant time-limited access to private content distributed through CloudFront.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'An application needs static IP addresses and acceleration for TCP and UDP traffic to endpoints in multiple Regions. Which service is more appropriate than CloudFront?',
      options: ['AWS Global Accelerator', 'Amazon Route 53 simple routing', 'Amazon S3 Transfer Acceleration', 'AWS Direct Connect'],
      answer: ['A'],
      explanation: 'Global Accelerator provides static anycast IPs and routes non-HTTP TCP/UDP traffic over the AWS backbone; CloudFront is optimised for cacheable HTTP content.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A company wants to reduce data-transfer cost and origin load for frequently requested objects on a public website. What should it do?',
      options: ['Increase the origin instance size', 'Place CloudFront in front of the origin and set appropriate cache TTLs', 'Disable HTTPS', 'Use a larger NAT gateway'],
      answer: ['B'],
      explanation: 'Caching at the edge reduces requests to the origin and the origin\'s outbound data transfer, lowering cost and improving performance.',
    },
  ],
  keyFacts: [
    'ACM certificates for CloudFront must be in us-east-1; AWS WAF web ACLs for CloudFront use the CLOUDFRONT scope (us-east-1).',
    'Origin Access Control (OAC) replaces Origin Access Identity (OAI) for securing S3 origins.',
    'Signed URLs protect a single file; signed cookies protect multiple files without changing URLs.',
    'Invalidations remove cached objects before TTL expiry; versioned file names are a cheaper alternative.',
    'Lambda@Edge runs at regional edge caches; CloudFront Functions run at edge locations for lightweight transformations.',
    'Origin groups provide automatic failover between a primary and secondary origin.',
    'Price classes trade edge-location coverage for lower price.',
    'CloudFront supports WebSocket and field-level encryption; Shield Standard is included at no additional cost.',
  ],
  traps: [
    { clue: 'Global static content delivery, lower latency and cost', answer: 'CloudFront.' },
    { clue: 'Keep S3 private behind a CDN', answer: 'Origin Access Control.' },
    { clue: 'Static IPs, TCP/UDP, non-cacheable', answer: 'Global Accelerator.' },
    { clue: 'Restrict by country at the CDN', answer: 'CloudFront geo restriction.' },
    { clue: 'Time-limited access to private content', answer: 'Signed URL / signed cookie.' },
  ],
  related: ['s3', 'elb', 'waf', 'shield', 'acm', 'global-accelerator', 'route53'],
  sources: [
    { title: 'What is Amazon CloudFront?', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' },
    { title: 'Restricting access to an Amazon S3 origin (OAC)', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html' },
    { title: 'Serving private content with signed URLs and cookies', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html' },
    { title: 'Optimizing high availability with origin failover', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/high_availability_origin_failover.html' },
    { title: 'AWS CLI cloudfront commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/cloudfront/index.html' },
  ],
};
