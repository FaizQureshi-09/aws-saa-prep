import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Comprehend. Schema: see s3.js. */
export default {
  tagline: 'Natural language processing: sentiment, entities, key phrases, language and PII in text.',
  intro: [
    'Amazon Comprehend is a managed natural language processing (NLP) service that finds insights and relationships in text without requiring ML expertise.',
    'Built-in analysis includes sentiment (positive, negative, neutral, mixed), entities (people, places, organisations), key phrases, dominant language, syntax and topic modelling.',
    'It can detect and redact personally identifiable information (PII) in text, which supports privacy and compliance workflows.',
    'Custom classification and custom entity recognition let you train models on your own labelled data to categorise documents or find domain-specific terms.',
    'You can analyse text in real time with synchronous APIs or process large document sets asynchronously from S3; Amazon Comprehend Medical is a separate service for clinical text.',
  ],
  useCases: [
    { title: 'Customer feedback analysis', detail: 'Score sentiment of reviews, emails and support tickets.' },
    { title: 'PII redaction', detail: 'Find and mask names, addresses and card numbers before sharing text.' },
    { title: 'Document classification', detail: 'Route documents by topic with a custom classifier.' },
  ],
  importance: {
    points: [
      'Exam questions match text analytics requirements (sentiment, entities, language, PII) to Comprehend.',
      'Often combined with Transcribe (calls to text), Translate (language) and S3/Lambda pipelines.',
    ],
  },
  cli: [
    { command: 'aws comprehend detect-sentiment --text "The delivery was late but support was great" --language-code en', description: 'Get the sentiment of a text.' },
    { command: 'aws comprehend detect-entities --text "Alice flew to Paris on Monday" --language-code en', description: 'Extract entities.' },
    { command: 'aws comprehend detect-pii-entities --text "Call me on 555-0100" --language-code en', description: 'Find PII in text.' },
    { command: 'aws comprehend start-sentiment-detection-job --input-data-config S3Uri=s3://reviews/in/ --output-data-config S3Uri=s3://reviews/out/ --data-access-role-arn <role-arn> --language-code en --job-name reviews', description: 'Analyse a large set of documents asynchronously.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): sentiment of a review',
        language: 'python',
        code: `import boto3

comprehend = boto3.client("comprehend")
resp = comprehend.detect_sentiment(Text="Great product, slow shipping", LanguageCode="en")
print(resp["Sentiment"], resp["SentimentScore"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Analyse call-centre conversations',
      scenario: 'A company wants sentiment trends from thousands of recorded calls.',
      steps: [
        'Transcribe converts recordings in S3 to text.',
        'Comprehend scores sentiment and extracts key phrases from each transcript.',
        'Results go to S3 and are visualised in Amazon Quick.',
      ],
    },
  ],
  diagram: {
    title: 'Comprehend text analysis',
    nodes: [
      ['docs', 'Reviews, emails, tickets in S3', 'storage', 0, 1],
      ['custom', 'Custom classifier (optional)', 'ml', 1, 0],
      ['comp', 'Amazon Comprehend', 'ml', 1, 1],
      ['out', 'Sentiment, entities, PII', 'analytics', 2, 1],
      ['dash', 'Dashboards / alerts', 'analytics', 3, 1],
    ],
    edges: [
      ['docs', 'comp', 'Text input'],
      ['custom', 'comp', 'Custom model'],
      ['comp', 'out', 'NLP insights'],
      ['out', 'dash', 'Visualise'],
    ],
    steps: [
      'Text from S3 or an application is sent to Comprehend.',
      'It returns sentiment, entities, key phrases, language and PII findings.',
      'Insights are stored and visualised or used to trigger workflows.',
    ],
  },
  questionTypes: [
    { pattern: 'Sentiment, entities, key phrases, PII in text', hint: 'Amazon Comprehend.' },
    { pattern: 'Choose the AI service for the data type', hint: 'Text = Comprehend; speech = Transcribe; images = Rekognition.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A retailer wants to determine whether thousands of customer reviews are positive or negative without building a model. Which service should be used?',
      options: ['Amazon Comprehend', 'Amazon Rekognition', 'Amazon Polly', 'Amazon Lex'],
      answer: ['A'],
      explanation: 'Comprehend provides sentiment analysis for text through a simple API.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which Comprehend capability helps meet privacy requirements before text is shared?',
      options: ['Syntax analysis only', 'PII detection and redaction', 'Topic modelling only', 'Dominant language detection only'],
      answer: ['B'],
      explanation: 'Comprehend can detect PII entities in text so they can be masked or removed.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which are built-in Amazon Comprehend analyses? (Select TWO.)',
      multi: true,
      options: ['Face comparison', 'Entity recognition', 'Speech recognition', 'Dominant language detection', 'Text-to-speech'],
      answer: ['B', 'D'],
      explanation: 'Comprehend detects entities, sentiment, key phrases and language. Text-to-speech is Polly, speech recognition is Transcribe, faces are Rekognition.',
    },
  ],
  keyFacts: [
    'Managed NLP: sentiment, entities, key phrases, language, syntax, topics, PII.',
    'Custom classification and entity recognition with your labelled data.',
    'Real-time (synchronous) and batch (asynchronous from S3) processing.',
    'Comprehend Medical is a separate service for clinical text.',
  ],
  traps: [
    { clue: 'Understand meaning and sentiment of text', answer: 'Comprehend.' },
    { clue: 'Convert audio to text first', answer: 'Transcribe.' },
  ],
  related: ['transcribe', 'translate', 'textract', 's3', 'lambda'],
  sources: [
    { title: 'What is Amazon Comprehend?', url: 'https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html' },
    { title: 'Detecting PII entities', url: 'https://docs.aws.amazon.com/comprehend/latest/dg/how-pii.html' },
    { title: 'AWS CLI comprehend commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/comprehend/index.html' },
  ],
};
