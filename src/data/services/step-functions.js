import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Step Functions. Schema: see s3.js. */
export default {
  tagline: 'Visual workflow orchestration that coordinates Lambda functions and AWS services as state machines.',
  intro: [
    'AWS Step Functions orchestrates multi-step workflows as state machines defined in Amazon States Language (JSON), with a visual designer and execution history.',
    'State types include Task (do work), Choice (branching), Parallel, Map (iterate over items), Wait, Pass, Succeed and Fail.',
    'Built-in Retry and Catch handle errors with backoff, so you do not write orchestration logic in code.',
    'Two workflow types: Standard (up to one year, exactly-once execution, full audit history) and Express (up to five minutes, very high volume, at-least-once).',
    'Integrations with 200+ AWS services (Lambda, ECS/Fargate, DynamoDB, SNS, SQS, Glue...) and a "wait for callback" pattern with task tokens for human approval.',
    'Use Step Functions when a process has several coordinated steps; use SQS/SNS/EventBridge for simple decoupling.',
  ],
  useCases: [
    { title: 'Order processing and ETL pipelines', detail: 'Validate, charge, ship and notify with retries and compensation.' },
    { title: 'Human approval workflows', detail: 'Pause until a callback arrives.' },
    { title: 'Parallel data processing', detail: 'Map state fans out work across many items.' },
  ],
  importance: {
    points: [
      'Task 2.1 names workflow orchestration (AWS Step Functions) as required knowledge.',
      'Exam pattern: multi-step coordination with branching/retries = Step Functions; chaining Lambda from Lambda is an anti-pattern.',
    ],
  },
  cli: [
    { command: 'aws stepfunctions create-state-machine --name OrderFlow --definition file://flow.asl.json --role-arn <role-arn> --type STANDARD', description: 'Create a Standard state machine.' },
    { command: 'aws stepfunctions start-execution --state-machine-arn <arn> --input \'{"orderId":1001}\'', description: 'Start an execution.' },
    { command: 'aws stepfunctions describe-execution --execution-arn <arn>', description: 'Check status.' },
    { command: 'aws stepfunctions get-execution-history --execution-arn <arn>', description: 'Inspect each state transition.' },
    { command: 'aws stepfunctions send-task-success --task-token <token> --output \'{"approved":true}\'', description: 'Resume a callback-style task.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'JSON (Amazon States Language): retry and branch',
        language: 'json',
        code: `{
  "StartAt": "Charge",
  "States": {
    "Charge": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": { "FunctionName": "charge-card", "Payload.$": "$" },
      "Retry": [{ "ErrorEquals": ["States.TaskFailed"], "IntervalSeconds": 2, "MaxAttempts": 3, "BackoffRate": 2 }],
      "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "NotifyFailure" }],
      "Next": "Ship"
    },
    "Ship": { "Type": "Task", "Resource": "arn:aws:states:::lambda:invoke", "Parameters": { "FunctionName": "ship-order" }, "End": true },
    "NotifyFailure": { "Type": "Task", "Resource": "arn:aws:states:::sns:publish", "Parameters": { "TopicArn": "<arn>", "Message": "Charge failed" }, "End": true }
  }
}`,
      },
    ],
  },
  examples: [
    {
      title: 'Order workflow with error handling',
      scenario: 'Orders must be validated, charged and shipped; failures must retry and then notify.',
      steps: [
        'Model each step as a Task state calling a Lambda function.',
        'Add Retry with exponential backoff to the payment task.',
        'Catch unrecoverable errors and route to a notification state.',
        'Use Standard workflows for auditability of long-running orders.',
      ],
    },
  ],
  diagram: {
    title: 'Step Functions order workflow',
    nodes: [
      ['start', 'Start execution', 'actor', 0, 1],
      ['validate', 'Task: validate', 'compute', 1, 1],
      ['choice', 'Choice: in stock?', 'integration', 2, 1],
      ['ship', 'Task: ship order', 'compute', 3, 0],
      ['fail', 'Catch: notify (SNS)', 'integration', 3, 2],
    ],
    edges: [
      ['start', 'validate', 'Input'],
      ['validate', 'choice', 'Result'],
      ['choice', 'ship', 'Yes'],
      ['choice', 'fail', 'No / error'],
    ],
    steps: [
      'An execution starts with a JSON input.',
      'Task states call Lambda or other AWS services; Choice states branch on data.',
      'Retry and Catch handle failures declaratively; each transition is recorded in the execution history.',
    ],
  },
  questionTypes: [
    { pattern: 'Coordinate multiple steps with retries and branching', hint: 'Step Functions.' },
    { pattern: 'Standard vs Express', hint: 'Long, auditable = Standard; short, high-volume = Express.' },
    { pattern: 'Human approval in a workflow', hint: 'Callback pattern with task tokens.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'An order-processing workflow has several Lambda steps with conditional branching, retries and a wait for manual approval, and must have a visual audit trail. Which service should be used?',
      options: ['Amazon SQS', 'AWS Step Functions', 'Amazon SNS', 'AWS Batch'],
      answer: ['B'],
      explanation: 'Step Functions orchestrates multi-step workflows with branching, error handling, callbacks and a visual execution history.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A workflow runs for up to 3 months waiting for external events and requires exactly-once execution semantics. Which Step Functions workflow type should be used?',
      options: ['Express workflow', 'Standard workflow', 'Either type', 'Neither - Step Functions limits runs to 5 minutes'],
      answer: ['B'],
      explanation: 'Standard workflows can run up to one year with exactly-once execution; Express workflows are limited to five minutes.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A developer chains seven Lambda functions by having each invoke the next, and error handling has become unmanageable. What is the BEST improvement?',
      options: ['Replace the chain with a Step Functions state machine', 'Increase Lambda timeouts to 15 minutes', 'Merge everything into one huge function', 'Use an SNS topic between every function'],
      answer: ['A'],
      explanation: 'Step Functions externalises orchestration, retries and error handling so functions stay small and independent.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A workflow must process 100,000 items from a file in S3 in parallel with a configurable concurrency limit. Which Step Functions state fits BEST?',
      options: ['Pass state', 'Wait state', 'Map state (distributed mode)', 'Succeed state'],
      answer: ['C'],
      explanation: 'The Map state iterates over a collection, and distributed mode scales to very large datasets with a concurrency limit.',
    },
  ],
  keyFacts: [
    'Standard: up to 1 year, exactly-once, execution history retained; Express: up to 5 minutes, at-least-once, high throughput, cheaper per execution.',
    'States: Task, Choice, Parallel, Map, Wait, Pass, Succeed, Fail.',
    'Retry (with backoff) and Catch implement error handling in the definition.',
    'Integrates directly with many AWS services (optimised and AWS SDK integrations) without Lambda glue code.',
    'Callback with task token supports human or external-system approvals.',
    'Execution role (IAM) controls what the state machine can call.',
  ],
  traps: [
    { clue: 'Multi-step workflow, branching, retries', answer: 'Step Functions.' },
    { clue: 'Workflow longer than 5 minutes / exactly-once', answer: 'Standard workflow.' },
    { clue: 'Very high-volume short event processing', answer: 'Express workflow.' },
    { clue: 'Only decouple/buffer', answer: 'SQS/SNS, not Step Functions.' },
  ],
  related: ['lambda', 'sqs', 'sns', 'eventbridge', 'glue', 'ecs'],
  sources: [
    { title: 'What is AWS Step Functions?', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html' },
    { title: 'Standard vs Express workflows', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html' },
    { title: 'Error handling in Step Functions', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html' },
    { title: 'AWS CLI stepfunctions commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/stepfunctions/index.html' },
  ],
};
