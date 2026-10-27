import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Translate. Schema: see s3.js. */
export default {
  tagline: 'Fast, neural machine translation of text between languages.',
  intro: [
    'Amazon Translate is a neural machine translation service that translates text between many supported languages with a simple API.',
    'It offers real-time translation of short text and asynchronous batch translation of large document sets stored in S3 (plain text, HTML, Word and similar formats).',
    'Custom terminology lets you force specific translations for brand names, product terms and acronyms, and Active Custom Translation adapts output to your own parallel data.',
    'It can detect the source language automatically and can be combined with Transcribe (for speech), Polly (to speak the result) and Comprehend (to analyse text).',
    'There is no model to train or server to manage; you pay for the characters translated.',
  ],
  useCases: [
    { title: 'Localise websites and apps', detail: 'Translate UI strings, help articles and product descriptions.' },
    { title: 'Multilingual customer support', detail: 'Translate chat and tickets in real time.' },
    { title: 'Translate document archives', detail: 'Batch-translate files in S3.' },
  ],
  importance: {
    points: [
      'Part of the "match the AI service to the requirement" group: language translation means Amazon Translate.',
      'Remember the combinations: Transcribe, Translate and Polly form a speech-to-speech translation pipeline.',
    ],
  },
  cli: [
    { command: 'aws translate translate-text --text "Good morning" --source-language-code en --target-language-code es', description: 'Translate a short text in real time.' },
    { command: 'aws translate import-terminology --name brand-terms --merge-strategy OVERWRITE --terminology-data file=terms.csv,Format=CSV', description: 'Upload a custom terminology.' },
    { command: 'aws translate start-text-translation-job --input-data-config S3Uri=s3://docs/in/,ContentType=text/plain --output-data-config S3Uri=s3://docs/out/ --data-access-role-arn <role-arn> --source-language-code en --target-language-codes fr de --job-name batch1', description: 'Translate documents in S3 in batch.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): translate a sentence',
        language: 'python',
        code: `import boto3

translate = boto3.client("translate")
resp = translate.translate_text(
    Text="Welcome to our store",
    SourceLanguageCode="en",
    TargetLanguageCode="fr",
)
print(resp["TranslatedText"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Speech-to-speech translation',
      scenario: 'A meeting app must let participants hear each other in their own language.',
      steps: [
        'Transcribe converts speech to text in real time.',
        'Translate converts the text to each target language.',
        'Polly speaks the translated text to each listener.',
      ],
    },
  ],
  diagram: {
    title: 'Translate in a pipeline',
    nodes: [
      ['src', 'Source text (app or S3)', 'external', 0, 1],
      ['tr', 'Amazon Translate', 'ml', 1, 1],
      ['term', 'Custom terminology', 'integration', 1, 0],
      ['out', 'Translated text', 'storage', 2, 1],
      ['users', 'Global users', 'actor', 3, 1],
    ],
    edges: [
      ['src', 'tr', 'Translate request'],
      ['term', 'tr', 'Preferred terms'],
      ['tr', 'out', 'Translated output'],
      ['out', 'users', 'Localised content'],
    ],
    steps: [
      'Text is sent to Translate with source and target language codes.',
      'Custom terminology keeps brand and product terms consistent.',
      'The translated text is stored or shown to users.',
    ],
  },
  questionTypes: [
    { pattern: 'Translate text between languages', hint: 'Amazon Translate.' },
    { pattern: 'Keep brand terms untranslated or fixed', hint: 'Custom terminology.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A global company wants to translate customer support messages between many languages in near real time without building models. Which service should be used?',
      options: ['Amazon Lex', 'Amazon Translate', 'Amazon Polly', 'Amazon Rekognition'],
      answer: ['B'],
      explanation: 'Translate provides managed neural machine translation through an API.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company needs product names to always be translated in a specific way. Which feature should be used?',
      options: ['AWS Glue crawlers', 'Custom terminology', 'Amazon Polly lexicons', 'S3 Object Lock'],
      answer: ['B'],
      explanation: 'Custom terminology defines how specific terms must be translated.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which services would form a pipeline that listens to speech in one language and speaks it in another? (Select THREE.)',
      multi: true,
      options: ['Amazon Translate', 'Amazon Transcribe', 'Amazon Polly', 'Amazon Rekognition', 'Amazon Textract'],
      answer: ['A', 'B', 'C'],
      explanation: 'Transcribe converts speech to text, Translate converts the language and Polly converts text back to speech.',
    },
  ],
  keyFacts: [
    'Neural machine translation; real-time and batch (S3) modes.',
    'Custom terminology for consistent brand and product terms; automatic source language detection.',
    'No models to train; pay per character translated.',
    'Often chained with Transcribe and Polly.',
  ],
  traps: [
    { clue: 'Translate text between languages', answer: 'Translate.' },
    { clue: 'Detect language and sentiment of text', answer: 'Comprehend.' },
  ],
  related: ['transcribe', 'polly', 'comprehend', 's3', 'lambda'],
  sources: [
    { title: 'What is Amazon Translate?', url: 'https://docs.aws.amazon.com/translate/latest/dg/what-is.html' },
    { title: 'Custom terminology', url: 'https://docs.aws.amazon.com/translate/latest/dg/how-custom-terminology.html' },
    { title: 'AWS CLI translate commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/translate/index.html' },
  ],
};
