import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Certificate Manager. Schema: see s3.js. */
export default {
  tagline: 'Provision, manage and automatically renew TLS certificates for encryption in transit.',
  intro: [
    'AWS Certificate Manager (ACM) requests, stores and renews SSL/TLS certificates so you can encrypt traffic to your websites and APIs.',
    'Public certificates issued by ACM are free when used with integrated services such as Elastic Load Balancing, Amazon CloudFront and Amazon API Gateway.',
    'Domain ownership is proven with DNS validation (preferred - supports automatic renewal, easy with Route 53) or email validation.',
    'ACM renews managed certificates automatically, removing the manual expiry risk that causes outages.',
    'Certificates are Regional: for CloudFront the certificate must be requested in us-east-1; for ALB/API Gateway it must be in the same Region as the resource.',
    'AWS Private CA (a separate service) issues private certificates for internal resources; imported third-party certificates are not renewed automatically.',
  ],
  useCases: [
    { title: 'HTTPS on a load balancer', detail: 'Attach an ACM certificate to an ALB listener and terminate TLS there.' },
    { title: 'HTTPS for CloudFront and APIs', detail: 'Custom domain names with free managed certificates.' },
    { title: 'Avoid expiry outages', detail: 'Managed, automatic renewal replaces calendar reminders.' },
  ],
  importance: {
    points: [
      'Task 1.3 names ACM using TLS for encrypting data in transit and "renewing certificates".',
      'Frequent detail: CloudFront certificates live in us-east-1.',
      'Appears with ELB, CloudFront and API Gateway questions.',
    ],
  },
  cli: [
    { command: 'aws acm request-certificate --domain-name www.example.com --validation-method DNS --subject-alternative-names example.com', description: 'Request a public certificate with DNS validation.' },
    { command: 'aws acm describe-certificate --certificate-arn <arn>', description: 'See validation records and status.' },
    { command: 'aws acm list-certificates --region us-east-1', description: 'List certificates (use us-east-1 for CloudFront).' },
    { command: 'aws acm import-certificate --certificate fileb://cert.pem --private-key fileb://key.pem --certificate-chain fileb://chain.pem', description: 'Import a third-party certificate (not auto-renewed).' },
    { command: 'aws acm delete-certificate --certificate-arn <arn>', description: 'Delete an unused certificate.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): request a certificate',
        language: 'python',
        code: `import boto3

acm = boto3.client("acm", region_name="us-east-1")  # us-east-1 for CloudFront
resp = acm.request_certificate(
    DomainName="www.example.com",
    ValidationMethod="DNS",
    SubjectAlternativeNames=["example.com"],
)
print(resp["CertificateArn"])`,
      },
    ],
  },
  examples: [
    {
      title: 'HTTPS for a custom domain on CloudFront',
      scenario: 'A site must be served over HTTPS at www.example.com through CloudFront.',
      steps: [
        'Request an ACM certificate for www.example.com in us-east-1 with DNS validation.',
        'Create the validation CNAME in Route 53 (one click in the console).',
        'Attach the certificate and alternate domain name to the CloudFront distribution.',
        'Create a Route 53 alias record pointing to the distribution.',
      ],
    },
  ],
  diagram: {
    title: 'ACM certificate on a load balancer',
    nodes: [
      ['user', 'Browser', 'actor', 0, 1],
      ['alb', 'ALB / CloudFront (TLS)', 'network', 1, 1],
      ['acm', 'ACM certificate', 'security', 2, 1],
      ['r53', 'Route 53 DNS validation', 'network', 2, 0],
      ['app', 'Targets', 'compute', 1, 2],
    ],
    edges: [
      ['user', 'alb', 'HTTPS'],
      ['acm', 'alb', 'Provides cert'],
      ['r53', 'acm', 'Proves ownership'],
      ['alb', 'app', 'HTTP or HTTPS'],
    ],
    steps: [
      'You request a certificate and prove domain ownership with a DNS record (Route 53 can add it automatically).',
      'ACM issues the certificate and renews it automatically while the validation record remains.',
      'The load balancer or CloudFront uses the certificate to terminate TLS for browsers.',
    ],
  },
  questionTypes: [
    { pattern: 'Encrypt traffic in transit with least effort', hint: 'ACM certificate on ALB/CloudFront/API Gateway.' },
    { pattern: 'Avoid certificate expiry', hint: 'ACM managed renewal with DNS validation.' },
    { pattern: 'CloudFront custom domain', hint: 'Certificate must be in us-east-1.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company wants HTTPS on an Application Load Balancer with certificates that renew automatically and no certificate cost. Which solution should be used?',
      options: ['Purchase a certificate from a third party and import it into ACM', 'Request a public certificate from AWS Certificate Manager and attach it to the ALB listener', 'Generate a self-signed certificate on each target', 'Use an Elastic IP with a TLS-enabled script'],
      answer: ['B'],
      explanation: 'ACM public certificates are free for integrated services such as ALB and renew automatically. Imported certificates must be renewed manually.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'An architect wants to use an ACM certificate with a CloudFront distribution. In which Region must the certificate be requested?',
      options: ['The Region of the S3 origin', 'The Region closest to the users', 'us-east-1', 'Any Region'],
      answer: ['C'],
      explanation: 'CloudFront is a global service and reads ACM certificates from US East (N. Virginia).',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which ACM validation method allows certificates to be renewed automatically with the least manual effort when the domain is hosted in Route 53?',
      options: ['Email validation', 'DNS validation', 'Phone validation', 'HTTP file validation by uploading to EC2'],
      answer: ['B'],
      explanation: 'DNS validation uses a CNAME record that can stay in place, enabling automatic renewal; Route 53 can create it automatically.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company needs TLS certificates for internal services that are not reachable from the internet and wants them issued and renewed in a managed way. Which approach fits BEST?',
      options: ['A public ACM certificate for the internal hostname', 'A self-signed certificate installed manually on each server', 'A private certificate issued by AWS Private CA through ACM', 'An AWS KMS data key'],
      answer: ['C'],
      explanation: 'AWS Private CA issues private certificates for internal resources and ACM can manage and renew them. Public ACM certificates require validating a public domain.',
    },
  ],
  keyFacts: [
    'ACM public certificates are free when used with integrated AWS services (ELB, CloudFront, API Gateway).',
    'DNS validation supports hands-off renewal; keep the validation CNAME in the zone.',
    'Certificates are Regional; CloudFront requires us-east-1; ALB and API Gateway need the same Region as the resource.',
    'Imported certificates are not auto-renewed; ACM only auto-renews certificates it issued and that are in use or validated.',
    'ACM alone does not secure data at rest - that is KMS.',
    'For private/internal certificates use AWS Private CA.',
  ],
  traps: [
    { clue: 'Encrypt data in transit on ALB/CloudFront with auto renewal', answer: 'ACM certificate.' },
    { clue: 'CloudFront custom domain certificate', answer: 'ACM in us-east-1.' },
    { clue: 'Encrypt data at rest', answer: 'KMS - not ACM.' },
  ],
  related: ['elb', 'cloudfront', 'api-gateway', 'route53', 'kms'],
  sources: [
    { title: 'What is AWS Certificate Manager?', url: 'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html' },
    { title: 'DNS validation', url: 'https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html' },
    { title: 'Managed certificate renewal', url: 'https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html' },
    { title: 'AWS CLI acm commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/acm/index.html' },
  ],
};
