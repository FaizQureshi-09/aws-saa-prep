import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Artifact. Schema: see s3.js. */
export default {
  tagline: 'Self-service portal for AWS compliance reports and agreements.',
  intro: [
    'AWS Artifact is a central, self-service resource for on-demand access to AWS security and compliance reports and for reviewing and accepting online agreements.',
    'Artifact Reports include AWS audit documents such as SOC reports, PCI attestations and ISO certifications that auditors request to verify AWS controls.',
    'Artifact Agreements let you review, accept and manage agreements such as a Business Associate Addendum (BAA) for HIPAA, for an account or on behalf of an organization.',
    'Access is controlled with IAM permissions, so you can limit who may download reports or accept agreements; there is no charge for using Artifact.',
    'Artifact documents AWS\'s side of the shared responsibility model; your own configuration compliance is checked with services such as AWS Config, Security Hub and Audit-style tooling.',
  ],
  useCases: [
    { title: 'Provide evidence to auditors', detail: 'Download SOC 2 or ISO reports to demonstrate AWS infrastructure compliance.' },
    { title: 'Sign HIPAA agreements', detail: 'Accept the AWS BAA before running protected health information workloads.' },
  ],
  importance: {
    points: [
      'Domain 1 governance: the answer for "where do I get AWS compliance reports or accept a compliance agreement".',
      'Not a scanning tool: it provides AWS\'s documents, not an assessment of your own environment.',
    ],
  },
  cli: [
    { command: 'aws artifact list-reports', description: 'List available compliance reports.' },
    { command: 'aws artifact get-report-metadata --report-id <report-id>', description: 'Get details of a report.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list reports',
        language: 'python',
        code: `import boto3

artifact = boto3.client("artifact", region_name="us-east-1")
for r in artifact.list_reports()["reports"]:
    print(r["name"], r["series"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Prepare for a customer audit',
      scenario: 'A customer asks for proof that the underlying infrastructure meets SOC 2 and ISO 27001.',
      steps: [
        'Open AWS Artifact in the console with an IAM principal that has the needed permissions.',
        'Download the relevant SOC and ISO reports (accepting the terms where required).',
        'Share them with the customer under the stated confidentiality terms.',
      ],
    },
  ],
  diagram: {
    title: 'Getting compliance documents from Artifact',
    nodes: [
      ['user', 'Compliance officer (IAM permission)', 'actor', 0, 1],
      ['art', 'AWS Artifact', 'management', 1, 1],
      ['rep', 'Reports (SOC, PCI, ISO)', 'storage', 1, 0],
      ['agr', 'Agreements (BAA, NDA)', 'storage', 1, 2],
      ['aud', 'Auditors / customers', 'external', 2, 1],
    ],
    edges: [
      ['user', 'art', 'Signs in'],
      ['art', 'rep', 'Download reports'],
      ['art', 'agr', 'Accept agreements'],
      ['art', 'aud', 'Provide evidence'],
    ],
    steps: [
      'An authorised user opens AWS Artifact.',
      'They download reports or accept agreements.',
      'The documents are shared with auditors or customers as compliance evidence.',
    ],
  },
  questionTypes: [
    { pattern: 'Obtain AWS compliance reports or sign a BAA', hint: 'AWS Artifact.' },
    { pattern: 'Check my resources for compliance', hint: 'AWS Config / Security Hub, not Artifact.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'An auditor asks for AWS\'s SOC 2 report. Where can the company download it on demand?',
      options: ['AWS Artifact', 'Amazon Inspector', 'AWS Trusted Advisor only', 'AWS CloudTrail'],
      answer: ['A'],
      explanation: 'Artifact provides on-demand access to AWS security and compliance reports.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A healthcare company must accept a Business Associate Addendum with AWS before processing protected health information. Where can it do this online?',
      options: ['AWS Artifact Agreements', 'AWS Backup', 'Amazon Macie', 'AWS KMS'],
      answer: ['A'],
      explanation: 'Artifact Agreements lets you review and accept agreements such as the HIPAA BAA.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which statement about AWS Artifact is true?',
      options: ['It records API calls', 'It scans your resources for vulnerabilities', 'It is used to encrypt data', 'It provides AWS compliance documents and has no additional charge'],
      answer: ['D'],
      explanation: 'Artifact is a document portal; scanning is Inspector and API logging is CloudTrail.',
    },
  ],
  keyFacts: [
    'Artifact Reports: SOC, PCI, ISO and other AWS audit documents on demand.',
    'Artifact Agreements: review and accept agreements such as the HIPAA BAA.',
    'Access is controlled with IAM; no additional charge.',
    'It documents AWS\'s responsibilities, not your own resource compliance.',
  ],
  traps: [
    { clue: 'Download AWS compliance reports', answer: 'Artifact.' },
    { clue: 'Evaluate my resources against rules', answer: 'AWS Config.' },
  ],
  related: ['config', 'security-hub', 'organizations', 'cloudtrail'],
  sources: [
    { title: 'What is AWS Artifact?', url: 'https://docs.aws.amazon.com/artifact/latest/ug/what-is-aws-artifact.html' },
    { title: 'Managing agreements in AWS Artifact', url: 'https://docs.aws.amazon.com/artifact/latest/ug/managing-agreements.html' },
    { title: 'AWS CLI artifact commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/artifact/index.html' },
  ],
};
