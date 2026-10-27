import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Polly. Schema: see s3.js. */
export default {
  tagline: 'Text-to-speech with lifelike voices in many languages.',
  intro: [
    'Amazon Polly turns text into lifelike speech using deep learning, so applications can talk to users in many languages and voices.',
    'You send plain text or SSML (Speech Synthesis Markup Language) and receive an audio stream in formats such as MP3, Ogg Vorbis or PCM; long text can be synthesised asynchronously with output delivered to S3.',
    'SSML and lexicons let you control pronunciation, pauses, emphasis and speaking rate, and speech marks give timing data for lip-sync or highlighting.',
    'Standard, neural and generative voice engines are available, with neural voices producing more natural speech.',
    'Polly speaks text; Transcribe does the reverse (speech to text), and Lex uses Polly for spoken chatbot responses.',
  ],
  useCases: [
    { title: 'Read articles aloud', detail: 'Turn blog posts or news into audio.' },
    { title: 'Voice for IVR and chatbots', detail: 'Spoken responses for contact centre bots (with Lex and Amazon Connect).' },
    { title: 'Accessibility', detail: 'Provide audio versions of content for visually impaired users.' },
  ],
  importance: {
    points: [
      'Matching question: "convert text to spoken audio" means Amazon Polly.',
      'Know the direction: Polly = text to speech; Transcribe = speech to text.',
    ],
  },
  cli: [
    { command: 'aws polly synthesize-speech --output-format mp3 --voice-id Joanna --text "Welcome to the course" welcome.mp3', description: 'Generate an MP3 from text.' },
    { command: 'aws polly describe-voices --language-code en-US', description: 'List available voices.' },
    { command: 'aws polly start-speech-synthesis-task --output-format mp3 --voice-id Joanna --output-s3-bucket-name audio-out --text file://article.txt', description: 'Synthesise long text asynchronously to S3.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): save speech as MP3',
        language: 'python',
        code: `import boto3

polly = boto3.client("polly")
resp = polly.synthesize_speech(Text="Hello from Polly", OutputFormat="mp3", VoiceId="Joanna")
with open("hello.mp3", "wb") as f:
    f.write(resp["AudioStream"].read())`,
      },
    ],
  },
  examples: [
    {
      title: 'Audio version of every blog post',
      scenario: 'A publisher wants an audio player on each article page.',
      steps: [
        'A Lambda function runs when a new article is published.',
        'It calls Polly to synthesise the text and stores the MP3 in S3.',
        'CloudFront serves the audio file to the website.',
      ],
    },
  ],
  diagram: {
    title: 'Polly text-to-speech',
    nodes: [
      ['text', 'Text or SSML', 'external', 0, 1],
      ['polly', 'Amazon Polly', 'ml', 1, 1],
      ['ssml', 'SSML and lexicons', 'integration', 1, 0],
      ['audio', 'MP3 audio in S3', 'storage', 2, 1],
      ['users', 'Listeners / IVR callers', 'actor', 3, 1],
    ],
    edges: [
      ['text', 'polly', 'Synthesise'],
      ['ssml', 'polly', 'Pronunciation control'],
      ['polly', 'audio', 'Audio stream'],
      ['audio', 'users', 'Playback'],
    ],
    steps: [
      'Text (optionally with SSML and lexicons) is sent to Polly.',
      'Polly returns a lifelike audio stream or saves it to S3.',
      'Applications play the audio for listeners.',
    ],
  },
  questionTypes: [
    { pattern: 'Convert text to speech', hint: 'Amazon Polly.' },
    { pattern: 'Polly vs Transcribe', hint: 'Text to speech vs speech to text.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants its mobile app to read news articles aloud in natural-sounding voices. Which service should be used?',
      options: ['Amazon Transcribe', 'Amazon Comprehend', 'Amazon Polly', 'Amazon Textract'],
      answer: ['C'],
      explanation: 'Polly converts text into lifelike speech.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'How can a developer control the pronunciation and pauses in Polly output?',
      options: ['Resize the EC2 instance', 'Use S3 lifecycle rules', 'Use SSML and lexicons', 'Enable CloudTrail'],
      answer: ['C'],
      explanation: 'SSML tags and pronunciation lexicons customise how Polly speaks the text.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statements about Amazon Polly are true? (Select TWO.)',
      multi: true,
      options: ['It supports SSML for controlling speech.', 'It converts text to speech.', 'It translates documents.', 'It detects faces in video.', 'It converts speech to text.'],
      answer: ['A', 'B'],
      explanation: 'Polly is text-to-speech with SSML support; Transcribe does speech-to-text and Translate handles translation.',
    },
  ],
  keyFacts: [
    'Text-to-speech (opposite of Transcribe).',
    'Inputs: plain text or SSML; outputs: MP3, Ogg Vorbis, PCM; async tasks write to S3.',
    'Lexicons customise pronunciation; speech marks give timing data.',
    'Standard, neural and generative voices.',
  ],
  traps: [
    { clue: 'Text to spoken audio', answer: 'Polly.' },
    { clue: 'Audio to text', answer: 'Transcribe.' },
  ],
  related: ['transcribe', 'lex', 'translate', 's3', 'lambda'],
  sources: [
    { title: 'What is Amazon Polly?', url: 'https://docs.aws.amazon.com/polly/latest/dg/what-is.html' },
    { title: 'Speech Synthesis Markup Language (SSML)', url: 'https://docs.aws.amazon.com/polly/latest/dg/ssml.html' },
    { title: 'AWS CLI polly commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/polly/index.html' },
  ],
};
