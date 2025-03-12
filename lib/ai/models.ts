export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'GPT-4 Optimized Mini',
    description: 'Fast and efficient GPT-4o-mini model for quick responses',
  },
  {
    id: 'chat-model-large',
    name: 'GPT-4 Optimized',
    description: 'Full GPT-4o model for complex tasks and detailed responses',
  },
  {
    id: 'chat-model-reasoning',
    name: 'O3 Mini with Reasoning',
    description: 'O3-mini model with enhanced reasoning capabilities',
  },
];
