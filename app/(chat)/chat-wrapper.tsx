'use client';

import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';

interface ChatWrapperProps {
  id: string;
  selectedChatModel: string;
  selectedVisibilityType: 'public' | 'private';
  isReadonly: boolean;
}

export default function ChatWrapper({
  id,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: ChatWrapperProps) {
  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={selectedChatModel}
        selectedVisibilityType={selectedVisibilityType}
        isReadonly={isReadonly}
      />
      <DataStreamHandler id={id} />
    </>
  );
} 