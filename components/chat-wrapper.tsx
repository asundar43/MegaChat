'use client';

import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { generateUUID } from '@/lib/utils';
import type { Message } from 'ai';

interface ChatWrapperProps {
  id?: string;
  initialMessages?: Message[];
  initialChatModel: string;
  visibility?: 'public' | 'private';
  isReadonly?: boolean;
}

export function ChatWrapper({ 
  id: existingId,
  initialMessages = [],
  initialChatModel,
  visibility = 'private',
  isReadonly = false
}: ChatWrapperProps) {
  const id = existingId || generateUUID();

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={initialMessages}
        selectedChatModel={initialChatModel}
        selectedVisibilityType={visibility}
        isReadonly={isReadonly}
      />
      <DataStreamHandler id={id} />
    </>
  );
} 