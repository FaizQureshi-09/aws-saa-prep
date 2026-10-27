import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Lex. Schema: see s3.js. */
export default {
  tagline: 'Build conversational chatbots and voice bots with natural-language understanding.',
  intro: [
    'Amazon Lex is a fully managed service for building conversational interfaces (chatbots and voice bots) using the same deep learning technology that powers Amazon Alexa.',
    'A bot is defined by intents (what the user wants, such as BookHotel), sample utterances (how they say it), slots (the data needed, such as city and date) and a fulfilment action.',
    'Lex handles automatic speech recognition and natural-language understanding, so the same bot can serve voice and text channels.',
    'Fulfilment is usually an AWS Lambda function that calls back-end systems such as DynamoDB or a CRM; Lex integrates with Amazon Connect for contact-centre bots and with messaging platforms.',
    'Lex uses Polly for spoken replies; in comparison, Polly alone only speaks text and Transcribe alone only transcribes speech.',
  ],
  useCases: [
    { title: 'Customer-service chatbots', detail: 'Answer questions, reset passwords and check orders in chat.' },
    { title: 'Contact-centre self-service', detail: 'Voice bots in Amazon Connect that collect details before an agent joins.' },
    { title: 'Voice-enabled applications', detail: 'Add conversational ordering or booking to mobile and web apps.' },
  ],
  importance: {
    points: [
      'AI-services matching: "build a chatbot / conversational interface" means Amazon Lex.',
      'Know the building blocks (intents, utterances, slots, Lambda fulfilment) and the Connect integration.',
    ],
  },
  cli: [
    { command: 'aws lexv2-models list-bots', description: 'List Lex V2 bots.' },
    { command: 'aws lexv2-models create-bot --bot-name BookingBot --role-arn <role-arn> --data-privacy childDirected=false --idle-session-ttl-in-seconds 300', description: 'Create a bot.' },
    { command: 'aws lexv2-runtime recognize-text --bot-id <id> --bot-alias-id <alias> --locale-id en_US --session-id user1 --text "Book a hotel in Paris"', description: 'Send a text utterance to a bot.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): talk to a Lex V2 bot',
        language: 'python',
        code: `import boto3

lex = boto3.client("lexv2-runtime")
resp = lex.recognize_text(
    botId="ABCDEFGHIJ",
    botAliasId="TSTALIASID",
    localeId="en_US",
    sessionId="user1",
    text="Book a hotel in Paris",
)
print(resp["messages"][0]["content"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Hotel booking bot',
      scenario: 'A travel company wants a bot that books rooms on its website and in its phone line.',
      steps: [
        'Define a BookHotel intent with slots for city, check-in date and nights.',
        'Attach a Lambda function that checks availability and writes the booking to DynamoDB.',
        'Publish the bot to a web chat widget and connect it to Amazon Connect for voice.',
      ],
    },
  ],
  diagram: {
    title: 'Lex conversation flow',
    nodes: [
      ['user', 'Customer (voice or text)', 'actor', 0, 1],
      ['conn', 'Amazon Connect / web chat channel', 'integration', 1, 0],
      ['lex', 'Amazon Lex bot (intents, slots)', 'ml', 1, 1],
      ['lam', 'Lambda fulfilment', 'compute', 2, 1],
      ['db', 'DynamoDB / CRM', 'database', 3, 1],
    ],
    edges: [
      ['user', 'lex', 'Speaks or types'],
      ['conn', 'lex', 'Channel integration'],
      ['lex', 'lam', 'Fulfil intent'],
      ['lam', 'db', 'Look up or update'],
    ],
    steps: [
      'The customer talks or types on a channel such as Amazon Connect or a web chat.',
      'Lex recognises the intent and collects slot values through conversation.',
      'A Lambda function fulfils the request using back-end data and Lex replies.',
    ],
  },
  questionTypes: [
    { pattern: 'Build a chatbot or voice bot', hint: 'Amazon Lex.' },
    { pattern: 'Contact-centre bot', hint: 'Lex with Amazon Connect.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants to build a conversational chatbot for its website that understands user intent and collects order details. Which service should be used?',
      options: ['Amazon Textract', 'Amazon Comprehend', 'Amazon Translate', 'Amazon Lex'],
      answer: ['D'],
      explanation: 'Lex builds conversational interfaces with intent recognition and slot filling.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'What is typically used to fulfil a Lex intent by calling back-end systems?',
      options: ['An EBS volume', 'A Route 53 hosted zone', 'An AWS Lambda function', 'An S3 lifecycle rule'],
      answer: ['C'],
      explanation: 'Lambda code hooks run business logic for intent fulfilment and validation.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which are core building blocks of an Amazon Lex bot? (Select TWO.)',
      multi: true,
      options: ['Object keys', 'Hosted zones', 'Slots', 'Subnets', 'Intents'],
      answer: ['C', 'E'],
      explanation: 'Bots are made of intents, sample utterances and slots; the other options are unrelated.',
    },
  ],
  keyFacts: [
    'Conversational bots using Alexa technology; voice and text.',
    'Building blocks: intents, utterances, slots, fulfilment.',
    'Lambda for fulfilment; Amazon Connect integration for contact centres.',
    'Uses Polly for speech output and built-in speech recognition for input.',
  ],
  traps: [
    { clue: 'Chatbot or voice assistant', answer: 'Lex.' },
    { clue: 'Only convert text to speech', answer: 'Polly.' },
  ],
  related: ['polly', 'transcribe', 'lambda', 'dynamodb', 'comprehend'],
  sources: [
    { title: 'What is Amazon Lex V2?', url: 'https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html' },
    { title: 'How Amazon Lex V2 works', url: 'https://docs.aws.amazon.com/lexv2/latest/dg/how-it-works.html' },
    { title: 'AWS CLI lexv2-models commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/lexv2-models/index.html' },
  ],
};
