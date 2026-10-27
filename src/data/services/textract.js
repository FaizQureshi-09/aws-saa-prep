import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Textract. Schema: see s3.js. */
export default {
  tagline: 'Extract text, forms and tables from scanned documents and images using machine learning.',
  intro: [
    'Amazon Textract automatically extracts printed text, handwriting, forms (key-value pairs) and tables from scanned documents, PDFs and images, going beyond simple optical character recognition (OCR).',
    'APIs include DetectDocumentText (raw text), AnalyzeDocument (forms, tables, queries and signatures), AnalyzeExpense (invoices and receipts) and AnalyzeID (identity documents).',
    'Single-page documents can be processed synchronously; multi-page PDFs and TIFFs use asynchronous operations that read from S3 and can notify through SNS.',
    'Output is structured JSON with blocks, relationships and confidence scores; low-confidence results can be sent to Amazon Augmented AI (A2I) for human review.',
    'Use Textract for documents, Rekognition for text appearing in natural scenes in photos, and Comprehend to understand the extracted text.',
  ],
  useCases: [
    { title: 'Automate forms and invoices', detail: 'Extract fields from invoices, tax forms and applications into a database.' },
    { title: 'Digitise archives', detail: 'Convert scanned paper records into searchable text.' },
    { title: 'Identity verification', detail: 'Read passports and driving licences with AnalyzeID.' },
  ],
  importance: {
    points: [
      'AI-services matching: "extract text, forms and tables from scanned documents" is Textract.',
      'Know the difference from Rekognition (images and scenes) and Comprehend (text understanding).',
    ],
  },
  cli: [
    { command: 'aws textract detect-document-text --document \'{"S3Object":{"Bucket":"scans","Name":"letter.png"}}\'', description: 'Extract raw text from a document image.' },
    { command: 'aws textract analyze-document --document \'{"S3Object":{"Bucket":"scans","Name":"form.png"}}\' --feature-types FORMS TABLES', description: 'Extract forms and tables.' },
    { command: 'aws textract analyze-expense --document \'{"S3Object":{"Bucket":"scans","Name":"invoice.png"}}\'', description: 'Extract fields from an invoice or receipt.' },
    { command: 'aws textract start-document-analysis --document-location \'{"S3Object":{"Bucket":"scans","Name":"report.pdf"}}\' --feature-types TABLES', description: 'Start asynchronous analysis of a multi-page PDF.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): extract lines of text',
        language: 'python',
        code: `import boto3

textract = boto3.client("textract")
resp = textract.detect_document_text(
    Document={"S3Object": {"Bucket": "scans", "Name": "letter.png"}}
)
for block in resp["Blocks"]:
    if block["BlockType"] == "LINE":
        print(block["Text"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Automated invoice processing',
      scenario: 'Accounts payable receives thousands of scanned invoices a month.',
      steps: [
        'Scanned invoices land in S3 and trigger a Lambda function.',
        'Lambda calls Textract AnalyzeExpense and receives vendor, date, line items and totals.',
        'Low-confidence fields go to Amazon A2I for human review; results are stored in DynamoDB or an ERP.',
      ],
    },
  ],
  diagram: {
    title: 'Textract document pipeline',
    nodes: [
      ['scan', 'Scanned PDFs and images in S3', 'storage', 0, 1],
      ['tx', 'Amazon Textract', 'ml', 1, 1],
      ['a2i', 'Human review (Amazon A2I)', 'actor', 1, 2],
      ['out', 'Text, forms, tables as JSON', 'storage', 2, 1],
      ['db', 'DynamoDB / Redshift / Comprehend', 'database', 3, 1],
    ],
    edges: [
      ['scan', 'tx', 'Document input'],
      ['tx', 'a2i', 'Low confidence'],
      ['tx', 'out', 'Structured output'],
      ['out', 'db', 'Store and analyse'],
    ],
    steps: [
      'Documents in S3 are submitted to Textract (synchronously or asynchronously).',
      'It returns text, form key-values and tables with confidence scores.',
      'Low-confidence items can be reviewed by people; results flow to databases or analytics.',
    ],
  },
  questionTypes: [
    { pattern: 'Extract text, forms and tables from scanned documents', hint: 'Amazon Textract.' },
    { pattern: 'Textract vs Rekognition vs Comprehend', hint: 'Documents vs images/scenes vs text meaning.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants to extract fields and tables from thousands of scanned invoices automatically. Which service should be used?',
      options: ['Amazon Polly', 'Amazon Rekognition', 'Amazon Lex', 'Amazon Textract'],
      answer: ['D'],
      explanation: 'Textract extracts text, forms and tables from scanned documents beyond basic OCR.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'After Textract extracts text from contracts, the company wants to identify the people, organisations and dates mentioned. Which service should process the text next?',
      options: ['Amazon Transcribe', 'Amazon Rekognition', 'Amazon Polly', 'Amazon Comprehend'],
      answer: ['D'],
      explanation: 'Comprehend performs entity recognition on text; Textract only extracts it.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statements about Amazon Textract are true? (Select TWO.)',
      multi: true,
      options: ['It converts speech to text.', 'Multi-page PDFs are processed with asynchronous operations.', 'It translates documents between languages.', 'It recognises faces in videos.', 'It can extract key-value pairs from forms and data from tables.'],
      answer: ['B', 'E'],
      explanation: 'Textract handles forms and tables and uses asynchronous APIs for multi-page documents. Speech and translation belong to other services.',
    },
  ],
  keyFacts: [
    'Extracts text, handwriting, forms (key-values) and tables; more than basic OCR.',
    'APIs: DetectDocumentText, AnalyzeDocument, AnalyzeExpense, AnalyzeID; async for multi-page PDFs.',
    'Outputs JSON with confidence; Amazon A2I enables human review.',
    'Pair with Comprehend (understanding) and S3/Lambda (automation).',
  ],
  traps: [
    { clue: 'Scanned forms, invoices, tables to data', answer: 'Textract.' },
    { clue: 'Objects and faces in photos', answer: 'Rekognition.' },
  ],
  related: ['rekognition', 'comprehend', 's3', 'lambda', 'dynamodb'],
  sources: [
    { title: 'What is Amazon Textract?', url: 'https://docs.aws.amazon.com/textract/latest/dg/what-is.html' },
    { title: 'Detecting and analyzing text in documents', url: 'https://docs.aws.amazon.com/textract/latest/dg/how-it-works.html' },
    { title: 'AWS CLI textract commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/textract/index.html' },
  ],
};
