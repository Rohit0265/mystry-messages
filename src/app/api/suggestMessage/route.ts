import { openai, OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('gpt-5'), // or openai.responses('gpt-5')
  messages: [
    { role: 'user', content: 'Your prompt here' }
  ],
  providerOptions: {
    openai: {
      parallelToolCalls: false,
      store: false,
      user: 'user_123',
      // ...
    } satisfies OpenAILanguageModelResponsesOptions,
  },
});