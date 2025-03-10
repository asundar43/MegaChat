import { auth } from '@/app/(auth)/auth';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { convertToUIMessages } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('Chat ID is required', { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id: chatId });

    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }

    if (chat.visibility === 'private' && chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const messages = await getMessagesByChatId({ id: chatId });
    return Response.json(convertToUIMessages(messages));
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 