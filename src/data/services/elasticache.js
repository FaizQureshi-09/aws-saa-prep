import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon ElastiCache. Schema: see s3.js. */
export default {
  tagline: 'Managed in-memory caching with Redis OSS / Valkey and Memcached for microsecond latency.',
  intro: [
    'Amazon ElastiCache is a managed in-memory data store used as a cache or fast database to cut latency and offload read-heavy databases.',
    'Engines: Redis OSS / Valkey (rich data structures, persistence, replication, Multi-AZ with automatic failover, pub/sub, sorted sets) and Memcached (simple, multi-threaded, no persistence or replication).',
    'Redis-compatible clusters support replicas, backups (snapshots), encryption at rest and in transit, authentication, and cluster mode for sharding across nodes.',
    'Typical caching strategies: lazy loading (cache-aside) loads data on a miss; write-through updates the cache on every write; both can use TTLs to bound staleness.',
    'ElastiCache Serverless scales automatically without capacity planning; node-based clusters let you choose node types and counts.',
    'Common uses: database query caching, session stores, leaderboards, real-time analytics and rate limiting.',
  ],
  useCases: [
    { title: 'Speed up a database', detail: 'Cache frequent queries in front of RDS or Aurora.' },
    { title: 'Session storage for stateless web tiers', detail: 'Store user sessions in Redis so any instance can serve any user.' },
    { title: 'Leaderboards and counters', detail: 'Redis sorted sets for real-time rankings.' },
  ],
  importance: {
    points: [
      'Tasks 2.1, 3.3 and 4.3 name caching strategies and ElastiCache explicitly.',
      'Key exam skill: pick Redis vs Memcached, and ElastiCache vs DAX (DynamoDB-only cache) vs CloudFront (edge cache).',
    ],
  },
  cli: [
    { command: 'aws elasticache create-replication-group --replication-group-id sessions --replication-group-description "session store" --engine redis --cache-node-type cache.r7g.large --num-cache-clusters 2 --automatic-failover-enabled --multi-az-enabled --at-rest-encryption-enabled --transit-encryption-enabled', description: 'Create a Multi-AZ Redis replication group.' },
    { command: 'aws elasticache create-cache-cluster --cache-cluster-id web-cache --engine memcached --cache-node-type cache.t4g.small --num-cache-nodes 3', description: 'Create a Memcached cluster.' },
    { command: 'aws elasticache describe-replication-groups', description: 'See endpoints and status.' },
    { command: 'aws elasticache create-snapshot --replication-group-id sessions --snapshot-name nightly', description: 'Create a Redis backup.' },
    { command: 'aws elasticache modify-replication-group --replication-group-id sessions --apply-immediately --cache-node-type cache.r7g.xlarge', description: 'Scale up node type.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python: cache-aside (lazy loading) with Redis',
        language: 'python',
        code: `import json, redis

cache = redis.Redis(host="sessions.xxxxxx.cache.amazonaws.com", port=6379, ssl=True)

def get_product(product_id):
    key = f"product:{product_id}"
    hit = cache.get(key)
    if hit:
        return json.loads(hit)
    product = db_query_product(product_id)         # slow database call
    cache.setex(key, 300, json.dumps(product))     # TTL 5 minutes
    return product`,
      },
    ],
  },
  examples: [
    {
      title: 'Offload a read-heavy database',
      scenario: 'Product-catalog queries hit the database repeatedly, causing latency and cost.',
      steps: [
        'Deploy a Multi-AZ Redis replication group in private subnets.',
        'Implement lazy loading with a TTL in the application.',
        'Invalidate or update keys on writes (write-through for hot items).',
        'Monitor hit ratio and evictions in CloudWatch.',
      ],
    },
  ],
  diagram: {
    title: 'Cache-aside with ElastiCache',
    nodes: [
      ['app', 'Application', 'compute', 0, 1],
      ['cache', 'ElastiCache (Redis)', 'database', 1, 1],
      ['db', 'RDS / Aurora', 'database', 2, 1],
      ['replica', 'Replica (Multi-AZ)', 'database', 1, 2],
    ],
    edges: [
      ['app', 'cache', '1. Check cache'],
      ['cache', 'db', '2. Miss: query DB'],
      ['cache', 'replica', 'Replication', 'dashed'],
    ],
    steps: [
      'The application checks the cache first; a hit returns in microseconds.',
      'On a miss it reads from the database, then stores the result in the cache with a TTL.',
      'Redis replicas in another AZ give high availability and automatic failover.',
    ],
  },
  questionTypes: [
    { pattern: 'Reduce database load / latency', hint: 'ElastiCache in front of the database.' },
    { pattern: 'Redis vs Memcached', hint: 'Persistence, replication, Multi-AZ, data structures = Redis; simple, multi-threaded caching = Memcached.' },
    { pattern: 'Session management for stateless servers', hint: 'ElastiCache for Redis (or DynamoDB).' },
    { pattern: 'DynamoDB microsecond reads', hint: 'DAX, not ElastiCache.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A web application stores sessions in memory on each EC2 instance, which breaks when Auto Scaling replaces instances. The company needs a highly available, low-latency shared session store. Which solution is BEST?',
      options: ['Amazon ElastiCache for Redis with Multi-AZ', 'EBS volume attached to all instances', 'Amazon S3 Glacier', 'An RDS read replica'],
      answer: ['A'],
      explanation: 'Redis with replicas and automatic failover provides a fast shared session store that makes web instances stateless.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statement correctly differentiates ElastiCache for Redis from Memcached?',
      options: ['Memcached supports replication and persistence; Redis does not', 'Redis supports replication, persistence and Multi-AZ failover; Memcached does not', 'Both are identical in features', 'Only Memcached supports sorted sets'],
      answer: ['B'],
      explanation: 'Redis offers replication, snapshots, Multi-AZ and rich data structures; Memcached is a simpler, multi-threaded cache without persistence or replication.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Repeated identical read queries to an RDS database drive up its cost and CPU. Which change reduces database load MOST effectively?',
      options: ['Add an ElastiCache layer and cache query results', 'Increase the RDS instance size indefinitely', 'Disable automated backups', 'Enable Multi-AZ'],
      answer: ['A'],
      explanation: 'Caching frequent query results absorbs repeated reads in memory, reducing database CPU and allowing a smaller instance.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company wants a caching strategy that guarantees the cache always contains the latest data after each database write. Which strategy should it use?',
      options: ['Lazy loading with a long TTL', 'Write-through', 'No caching', 'Cache eviction only'],
      answer: ['B'],
      explanation: 'Write-through updates the cache whenever the database is written, keeping it current at the cost of extra write latency and possibly unused cached data.',
    },
  ],
  keyFacts: [
    'Redis OSS/Valkey: persistence, replicas, Multi-AZ with auto failover, backups, pub/sub, sorted sets, cluster mode. Memcached: simple, multi-threaded, no persistence or replication.',
    'Lazy loading (cache-aside) = cache populated on miss, may serve stale data until TTL; write-through = cache updated on every write.',
    'ElastiCache lives inside a VPC and is accessed via private endpoints; secure with security groups, TLS and AUTH/IAM.',
    'DAX is the purpose-built cache for DynamoDB; CloudFront caches at the edge; ElastiCache caches database and application data.',
    'ElastiCache Serverless removes capacity planning; Global Datastore replicates Redis across Regions.',
    'Security options include encryption at rest (KMS), encryption in transit (TLS) and Redis AUTH with role-based access control; place clusters in private subnets with restrictive security groups.',
  ],
  traps: [
    { clue: 'Microsecond latency caching for RDS queries', answer: 'ElastiCache.' },
    { clue: 'Microsecond latency for DynamoDB reads', answer: 'DAX.' },
    { clue: 'Persistence/replication/failover needed', answer: 'Redis, not Memcached.' },
    { clue: 'Stateless web tier sessions', answer: 'ElastiCache Redis session store.' },
  ],
  related: ['rds', 'aurora', 'dynamodb', 'cloudfront', 'ec2-auto-scaling'],
  sources: [
    { title: 'What is Amazon ElastiCache?', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html' },
    { title: 'Caching strategies', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html' },
    { title: 'Choosing an engine (Redis/Valkey vs Memcached)', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/SelectEngine.html' },
    { title: 'High availability using replication groups', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Replication.html' },
    { title: 'AWS CLI elasticache commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/elasticache/index.html' },
  ],
};
