import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Rekognition. Schema: see s3.js. */
export default {
  tagline: 'Pre-trained image and video analysis: objects, faces, text and unsafe content, with no ML expertise.',
  intro: [
    'Amazon Rekognition is a fully managed computer vision service that analyses images and videos using deep learning, with no machine learning expertise or model training required.',
    'Image features include object and scene detection (labels), face detection and comparison, face search against a collection of known faces, celebrity recognition, text in images, personal protective equipment detection and content moderation.',
    'Video analysis works on stored videos in S3 and on live streams from Amazon Kinesis Video Streams; results can be published to SNS.',
    'Rekognition Custom Labels lets you train a model to find objects or scenes specific to your business using a small number of labelled images.',
    'For exam purposes treat it as the "images and video" member of the AI services: Textract is for documents, Comprehend for text, Transcribe for speech.',
  ],
  useCases: [
    { title: 'Content moderation', detail: 'Detect unsafe or inappropriate images and video before publishing.' },
    { title: 'Identity verification', detail: 'Compare a selfie with an ID photo, or search a collection of faces.' },
    { title: 'Media search and cataloguing', detail: 'Tag images and video with labels for searchable archives.' },
  ],
  importance: {
    points: [
      'AI services appear as "match the requirement to the right managed service" questions; image or video analysis maps to Rekognition.',
      'You are not expected to know model details, only the use case and S3/Lambda integration pattern.',
    ],
  },
  cli: [
    { command: 'aws rekognition detect-labels --image \'{"S3Object":{"Bucket":"photos","Name":"cat.jpg"}}\' --max-labels 10', description: 'Detect objects and scenes in an image.' },
    { command: 'aws rekognition detect-moderation-labels --image \'{"S3Object":{"Bucket":"uploads","Name":"img.jpg"}}\'', description: 'Check an image for unsafe content.' },
    { command: 'aws rekognition create-collection --collection-id staff', description: 'Create a face collection for searching.' },
    { command: 'aws rekognition search-faces-by-image --collection-id staff --image \'{"S3Object":{"Bucket":"uploads","Name":"visitor.jpg"}}\'', description: 'Search for a face in a collection.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): label an image in S3',
        language: 'python',
        code: `import boto3

rek = boto3.client("rekognition")
resp = rek.detect_labels(
    Image={"S3Object": {"Bucket": "photos", "Name": "cat.jpg"}},
    MaxLabels=5,
)
for label in resp["Labels"]:
    print(label["Name"], round(label["Confidence"], 1))`,
      },
    ],
  },
  examples: [
    {
      title: 'Moderate user uploads',
      scenario: 'A photo-sharing app must block unsafe images automatically.',
      steps: [
        'Users upload images to S3, which triggers a Lambda function.',
        'Lambda calls Rekognition DetectModerationLabels.',
        'Unsafe images are quarantined and the result is stored in DynamoDB.',
      ],
    },
  ],
  diagram: {
    title: 'Rekognition image pipeline',
    nodes: [
      ['s3', 'Images / video in S3', 'storage', 0, 1],
      ['lam', 'Lambda function', 'compute', 1, 1],
      ['rek', 'Amazon Rekognition', 'ml', 2, 1],
      ['kvs', 'Kinesis Video Streams (live)', 'integration', 2, 0],
      ['ddb', 'Results in DynamoDB', 'database', 3, 1],
    ],
    edges: [
      ['s3', 'lam', 'ObjectCreated event'],
      ['lam', 'rek', 'DetectLabels'],
      ['kvs', 'rek', 'Live video'],
      ['rek', 'ddb', 'Labels, faces'],
    ],
    steps: [
      'An upload triggers a Lambda function (or live video arrives from Kinesis Video Streams).',
      'Rekognition analyses the media and returns labels, faces, text or moderation results.',
      'Results are stored for search, alerts or automated decisions.',
    ],
  },
  questionTypes: [
    { pattern: 'Analyse images or video (objects, faces, moderation)', hint: 'Amazon Rekognition.' },
    { pattern: 'Pick the AI service for the data type', hint: 'Images = Rekognition; documents = Textract; text = Comprehend; speech = Transcribe.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A social app must automatically detect inappropriate content in user-uploaded images without building ML models. Which service should be used?',
      options: ['Amazon Textract', 'Amazon Comprehend', 'Amazon Polly', 'Amazon Rekognition'],
      answer: ['D'],
      explanation: 'Rekognition provides pre-trained content moderation for images and video.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which tasks can Amazon Rekognition perform? (Select TWO.)',
      multi: true,
      options: ['Detect objects and scenes in images', 'Translate documents', 'Transcribe phone calls', 'Detect and compare faces', 'Convert text to speech'],
      answer: ['A', 'D'],
      explanation: 'Rekognition analyses faces, objects, scenes, text in images and moderation; speech and translation are other services.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A company needs to detect its own custom product defects in photos using a few hundred labelled images. Which Rekognition capability helps?',
      options: ['Amazon Polly lexicons', 'Rekognition celebrity recognition', 'AWS Glue crawlers', 'Rekognition Custom Labels'],
      answer: ['D'],
      explanation: 'Custom Labels trains a model for business-specific objects with a small labelled dataset.',
    },
  ],
  keyFacts: [
    'Pre-trained computer vision for images and video; no ML expertise needed.',
    'Features: labels, faces (detect, compare, search), celebrities, text in images, moderation, PPE.',
    'Stored video in S3 and live streams via Kinesis Video Streams; Custom Labels for specific objects.',
    'Typical architecture: S3 upload event triggers Lambda that calls Rekognition.',
  ],
  traps: [
    { clue: 'Faces, objects, moderation in images/video', answer: 'Rekognition.' },
    { clue: 'Extract text and forms from scanned documents', answer: 'Textract.' },
  ],
  related: ['textract', 'comprehend', 's3', 'lambda', 'sagemaker'],
  sources: [
    { title: 'What is Amazon Rekognition?', url: 'https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html' },
    { title: 'Moderating content', url: 'https://docs.aws.amazon.com/rekognition/latest/dg/moderation.html' },
    { title: 'AWS CLI rekognition commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/rekognition/index.html' },
  ],
};
