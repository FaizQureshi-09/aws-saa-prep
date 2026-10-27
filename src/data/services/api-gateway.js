import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon API Gateway. Schema: see s3.js. */
export default {
  tagline: 'Create, publish, secure, throttle and monitor REST, HTTP and WebSocket APIs at any scale.',
  intro: [
    'Amazon API Gateway is a fully managed service that acts as the "front door" for applications to reach backends such as Lambda functions, HTTP services and other AWS services.',
    'API types: REST APIs (full-featured: caching, usage plans, request validation), HTTP APIs (simpler, lower latency and cost) and WebSocket APIs (two-way real-time communication).',
    'Endpoint types: edge-optimized (via CloudFront), Regional and private (only reachable from a VPC through an interface endpoint).',
    'Security options: IAM (SigV4), Cognito user pool authorizers, Lambda authorizers, resource policies, mutual TLS, API keys with usage plans, and AWS WAF integration.',
    'Traffic management: throttling (account and per-route limits), usage plans, response caching on REST APIs, stage variables and canary deployments.',
    'Custom domain names use ACM certificates; logs and metrics flow to CloudWatch; the default integration timeout is 29 seconds.',
  ],
  useCases: [
    { title: 'Serverless REST backends', detail: 'API Gateway + Lambda + DynamoDB without any servers.' },
    { title: 'Public API monetisation or partner access', detail: 'API keys and usage plans enforce quotas and throttling.' },
    { title: 'Real-time chat and notifications', detail: 'WebSocket APIs maintain persistent connections.' },
  ],
  importance: {
    points: [
      'Task 2.1 names API creation and management with Amazon API Gateway (REST API).',
      'Frequent decision points: authorizer type, throttling/caching, edge vs Regional endpoint, and the 29-second timeout.',
    ],
  },
  cli: [
    { command: 'aws apigateway create-rest-api --name orders-api --endpoint-configuration types=REGIONAL', description: 'Create a Regional REST API.' },
    { command: 'aws apigateway create-deployment --rest-api-id abc123 --stage-name prod', description: 'Deploy the API to a stage.' },
    { command: 'aws apigateway update-stage --rest-api-id abc123 --stage-name prod --patch-operations op=replace,path=/cacheClusterEnabled,value=true', description: 'Enable stage caching.' },
    { command: 'aws apigateway create-usage-plan --name basic --throttle burstLimit=100,rateLimit=50 --quota limit=10000,period=MONTH', description: 'Create a usage plan with throttling and quota.' },
    { command: 'aws apigatewayv2 create-api --name http-api --protocol-type HTTP --target <lambda-arn>', description: 'Create a quick HTTP API integrated with Lambda.' },
    { command: 'aws apigateway create-authorizer --rest-api-id abc123 --name cognito --type COGNITO_USER_POOLS --provider-arns <pool-arn> --identity-source method.request.header.Authorization', description: 'Add a Cognito authorizer.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python: Lambda proxy integration handler',
        language: 'python',
        code: `import json

def handler(event, context):
    order_id = event["pathParameters"]["orderId"]
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"orderId": order_id, "status": "SHIPPED"}),
    }`,
      },
    ],
  },
  examples: [
    {
      title: 'Serverless API with Cognito authentication',
      scenario: 'A mobile app needs a secure, scalable API with no servers.',
      steps: [
        'Create a REST API with a /orders resource and Lambda proxy integration.',
        'Add a Cognito user pool authorizer so only signed-in users can call it.',
        'Enable stage caching and throttling limits; attach AWS WAF.',
        'Map a custom domain with an ACM certificate.',
      ],
    },
  ],
  diagram: {
    title: 'API Gateway in front of Lambda',
    nodes: [
      ['client', 'Mobile / web client', 'actor', 0, 1],
      ['apigw', 'API Gateway (auth, throttle, cache)', 'integration', 1, 1],
      ['fn', 'Lambda function', 'compute', 2, 1],
      ['ddb', 'DynamoDB', 'database', 3, 1],
      ['cog', 'Cognito authorizer', 'security', 1, 0],
    ],
    edges: [
      ['client', 'apigw', 'HTTPS request'],
      ['cog', 'apigw', 'Validates token'],
      ['apigw', 'fn', 'Integration'],
      ['fn', 'ddb', 'Read / write'],
    ],
    steps: [
      'The client calls the API over HTTPS.',
      'API Gateway authenticates (Cognito/IAM/Lambda authorizer), applies throttling and optional caching.',
      'It invokes the backend (Lambda here), which uses DynamoDB; the response is returned to the client.',
    ],
  },
  questionTypes: [
    { pattern: 'Expose Lambda functions as a REST API', hint: 'API Gateway.' },
    { pattern: 'Protect and throttle an API', hint: 'Usage plans, throttling, WAF, authorizers.' },
    { pattern: 'REST vs HTTP API', hint: 'HTTP API cheaper/faster; REST API for caching, usage plans, request validation.' },
    { pattern: 'API Gateway timeout', hint: 'Default max 29 seconds - use async patterns for long work.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants to expose a Lambda function as a public HTTPS API that automatically scales, supports throttling, and authenticates users with a Cognito user pool. Which service combination is MOST appropriate?',
      options: ['Amazon API Gateway with a Cognito authorizer', 'An EC2 instance running NGINX', 'AWS Direct Connect', 'Amazon Route 53 only'],
      answer: ['A'],
      explanation: 'API Gateway integrates natively with Lambda, provides throttling and supports Cognito user pool authorizers.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A REST API serves read-heavy requests that rarely change, and the Lambda backend cost is rising. How can the architect reduce backend invocations?',
      options: ['Enable API Gateway stage caching with a TTL', 'Switch to a larger Lambda memory size', 'Remove authentication', 'Use a WebSocket API'],
      answer: ['A'],
      explanation: 'REST API stage caching stores responses for a TTL, reducing calls to the backend and improving latency.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An API Gateway integration with a Lambda function that runs about 2 minutes returns timeouts to clients. What is the BEST redesign?',
      options: ['Increase the Lambda timeout to 15 minutes only', 'Return immediately (async) and let clients poll or receive results via a queue/notification', 'Remove API Gateway', 'Use a smaller instance'],
      answer: ['B'],
      explanation: 'API Gateway\'s integration timeout is about 29 seconds by default, so long-running work should be asynchronous (SQS/Step Functions) with a status endpoint or callback.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A private API must be accessible only from within a VPC, with no internet exposure. Which API Gateway endpoint type should be used?',
      options: ['Edge-optimized', 'Regional', 'Private', 'Public WebSocket'],
      answer: ['C'],
      explanation: 'Private APIs are reachable only through interface VPC endpoints from inside the VPC.',
    },
  ],
  keyFacts: [
    'REST API: caching, usage plans, API keys, request validation, canary; HTTP API: lower cost/latency, JWT authorizers, fewer features; WebSocket API: persistent two-way connections.',
    'Endpoint types: edge-optimized, Regional, private.',
    'Default integration timeout is 29 seconds; design long operations asynchronously.',
    'Authorizers: IAM, Cognito user pools, Lambda (custom); plus resource policies and mutual TLS.',
    'Throttling protects backends; usage plans + API keys meter and limit third-party consumers.',
    'Attach AWS WAF to REST APIs for Layer 7 protection; use ACM certificates for custom domains.',
  ],
  traps: [
    { clue: 'Managed front door for Lambda with throttling and auth', answer: 'API Gateway.' },
    { clue: 'Cache API responses', answer: 'API Gateway stage cache (REST API).' },
    { clue: 'Long-running request over 29 seconds', answer: 'Async pattern (SQS/Step Functions) instead of synchronous call.' },
    { clue: 'Real-time bidirectional messaging', answer: 'WebSocket API.' },
  ],
  related: ['lambda', 'cognito', 'waf', 'dynamodb', 'cloudfront', 'acm'],
  sources: [
    { title: 'What is Amazon API Gateway?', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html' },
    { title: 'Choose between REST APIs and HTTP APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html' },
    { title: 'Throttle requests to your REST APIs', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html' },
    { title: 'Enable API caching', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html' },
    { title: 'AWS CLI apigateway commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/apigateway/index.html' },
  ],
};
