import { cookies } from 'next/headers';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { ChatWrapper } from '@/components/chat-wrapper';

export default async function ChatPage() {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  return (
    <ChatWrapper 
      initialChatModel={modelIdFromCookie?.value || DEFAULT_CHAT_MODEL}
    />
  );
} 