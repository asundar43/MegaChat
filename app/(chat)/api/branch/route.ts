import { auth } from '@/app/(auth)/auth';
import { generateUUID } from '@/lib/utils';
import { saveChat, saveMessages } from '@/lib/db/queries';
import { Message } from 'ai';
import { generateTitleFromUserMessage } from '../../actions';

export async function POST(request: Request) {
  try {
    const { messages, messageId, chatId }: { messages: Array<Message>; messageId: string; chatId: string } =
      await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Find the index of the message to branch from
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) {
      return new Response('Message not found', { status: 404 });
    }

    // Create a new chat with messages up to the selected message
    const branchedMessages = messages.slice(0, messageIndex + 1);
    const newChatId = generateUUID();

    // Generate a title based on the message we're branching from
    const branchMessage = messages[messageIndex];
    const title = await generateTitleFromUserMessage({
      message: {
        id: generateUUID(),
        role: 'user',
        content: `Branch from: ${branchMessage.content}`,
      },
    });

    // Save the new chat with parent reference
    await saveChat({
      id: newChatId,
      userId: session.user.id,
      title,
      parentId: chatId,
    });

    // Save the branched messages
    await saveMessages({
      messages: branchedMessages.map((message) => ({
        id: generateUUID(),
        chatId: newChatId,
        role: message.role,
        content: message.content,
        createdAt: new Date(),
      })),
    });

    return Response.json({ chatId: newChatId }, { status: 200 });
  } catch (error) {
    console.error('Failed to branch chat:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 