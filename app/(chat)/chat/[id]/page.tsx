import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { auth } from '@/app/(auth)/auth';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertToUIMessages } from '@/lib/utils';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { ChatWrapper } from '@/components/chat-wrapper';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (chat.visibility === 'private') {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  return (
    <ChatWrapper 
      id={chat.id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      initialChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
      visibility={chat.visibility}
      isReadonly={session?.user?.id !== chat.userId}
    />
  );
}
