import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Transcribe. Schema: see s3.js. */
export default {
  tagline: 'Automatic speech recognition: convert audio and video into searchable text.',
  intro: [
    'Amazon Transcribe is an automatic speech recognition (ASR) service that converts speech to text, for recorded audio files and for live streams.',
    'Features include speaker identification (diarisation), channel identification, automatic language identification, custom vocabularies and language models, punctuation, timestamps and confidence scores.',
    'It can redact or identify personally identifiable information in transcripts, and Call Analytics adds sentiment, call characteristics and summaries for contact-centre conversations.',
    'Batch jobs read media from S3 and write a JSON transcript to S3; streaming transcription uses a real-time API for live audio.',
    'Transcribe is speech to text; Polly is the reverse, and Comprehend or Translate often process the resulting text.',
  ],
  useCases: [
    { title: 'Contact-centre analytics', detail: 'Transcribe calls, redact PII and analyse sentiment.' },
    { title: 'Captions and subtitles', detail: 'Generate subtitles for video libraries.' },
    { title: 'Meeting notes and search', detail: 'Make recorded meetings searchable with timestamps.' },
  ],
  importance: {
    points: [
      'AI-services matching: "audio to text" or "transcribe calls" points to Transcribe.',
      'Often appears in pipelines with S3, Lambda, Comprehend and Translate.',
    ],
  },
  cli: [
    { command: 'aws transcribe start-transcription-job --transcription-job-name call-001 --media MediaFileUri=s3://recordings/call-001.mp3 --language-code en-US --output-bucket-name transcripts', description: 'Transcribe an audio file in S3.' },
    { command: 'aws transcribe get-transcription-job --transcription-job-name call-001', description: 'Check status and the transcript location.' },
    { command: 'aws transcribe create-vocabulary --vocabulary-name product-terms --language-code en-US --phrases "Kinesis" "DynamoDB"', description: 'Create a custom vocabulary.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): start a job with speaker labels',
        language: 'python',
        code: `import boto3

transcribe = boto3.client("transcribe")
transcribe.start_transcription_job(
    TranscriptionJobName="call-001",
    Media={"MediaFileUri": "s3://recordings/call-001.mp3"},
    LanguageCode="en-US",
    OutputBucketName="transcripts",
    Settings={"ShowSpeakerLabels": True, "MaxSpeakerLabels": 2},
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Searchable call archive',
      scenario: 'A support team wants to search thousands of call recordings for specific phrases.',
      steps: [
        'Call recordings land in S3, triggering a Lambda function.',
        'Lambda starts a Transcribe job with PII redaction enabled.',
        'Transcripts are indexed in OpenSearch for search and analysed with Comprehend.',
      ],
    },
  ],
  diagram: {
    title: 'Transcribe pipeline',
    nodes: [
      ['audio', 'Call recordings / live audio', 'external', 0, 1],
      ['tr', 'Amazon Transcribe', 'ml', 1, 1],
      ['vocab', 'Custom vocabulary, PII redaction', 'security', 1, 0],
      ['txt', 'Transcripts in S3', 'storage', 2, 1],
      ['comp', 'Comprehend sentiment', 'ml', 3, 1],
    ],
    edges: [
      ['audio', 'tr', 'Speech input'],
      ['vocab', 'tr', 'Tuning and redaction'],
      ['tr', 'txt', 'JSON transcript'],
      ['txt', 'comp', 'Analyse text'],
    ],
    steps: [
      'Audio files or live streams are sent to Transcribe.',
      'Custom vocabulary improves accuracy and PII can be redacted.',
      'Transcripts are stored in S3 and analysed by other services.',
    ],
  },
  questionTypes: [
    { pattern: 'Convert speech or calls to text', hint: 'Amazon Transcribe.' },
    { pattern: 'Transcribe vs Polly', hint: 'Speech to text vs text to speech.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company records customer calls and wants searchable text transcripts with speaker labels, with no ML expertise. Which service should be used?',
      options: ['Amazon Rekognition', 'Amazon Polly', 'Amazon Transcribe', 'Amazon Translate'],
      answer: ['C'],
      explanation: 'Transcribe converts speech to text and supports speaker identification.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Transcripts of customer calls must not contain card numbers or other PII. Which Transcribe feature helps?',
      options: ['PII redaction', 'Custom labels', 'Text-to-speech', 'Face search'],
      answer: ['A'],
      explanation: 'Transcribe can redact or identify PII in transcripts.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statements about Amazon Transcribe are true? (Select TWO.)',
      multi: true,
      options: ['It detects objects in video.', 'It converts text to speech.', 'It stores container images.', 'It supports batch jobs from S3 and real-time streaming.', 'Custom vocabularies can improve recognition of domain terms.'],
      answer: ['D', 'E'],
      explanation: 'Transcribe handles batch and streaming speech-to-text and supports custom vocabularies; text-to-speech is Polly.',
    },
  ],
  keyFacts: [
    'Automatic speech recognition; batch from S3 or streaming.',
    'Speaker and channel identification, custom vocabulary, automatic language identification, PII redaction.',
    'Call Analytics for contact-centre insights.',
    'Output is JSON transcripts in S3.',
  ],
  traps: [
    { clue: 'Audio to text', answer: 'Transcribe.' },
    { clue: 'Text to audio', answer: 'Polly.' },
  ],
  related: ['polly', 'comprehend', 'translate', 's3', 'lambda', 'opensearch'],
  sources: [
    { title: 'What is Amazon Transcribe?', url: 'https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html' },
    { title: 'Redacting or identifying PII in a transcription', url: 'https://docs.aws.amazon.com/transcribe/latest/dg/pii-redaction.html' },
    { title: 'AWS CLI transcribe commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/transcribe/index.html' },
  ],
};
