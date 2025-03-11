'use client';

import React from 'react';
import type { Attachment, Message } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import { BranchedChat } from './branched-chat';
import { useBranchedChat } from '@/hooks/use-branched-chat';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BranchConnection } from './branch-connection';

// Define a set of vibrant colors for branches
const BRANCH_COLORS = [
  '#FF5F7E', // Coral Pink
  '#4A9DFF', // Bright Blue
  '#FFB443', // Warm Orange
  '#22D3AA', // Turquoise
  '#985FFF', // Purple
  '#FF6B2C', // Deep Orange
  '#00C2A8', // Teal
  '#FF4F81', // Hot Pink
  '#36A2EB', // Sky Blue
  '#FFA600', // Amber
];

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const { branches, removeBranch } = useBranchedChat();
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  const mainChatWidth = `${100 / (branches.length + 1)}%`;

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-row w-full h-dvh">
      <div className={cn("flex flex-col min-w-0 bg-background transition-all", {
        "w-full": branches.length === 0,
        [`w-[${mainChatWidth}]`]: branches.length > 0,
      })}>
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
          className="relative z-10"
        />

        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
          branchedFromMessageId={undefined}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl relative z-10 border-t shadow-[0_-1px_2px_rgba(0,0,0,0.03)]">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <AnimatePresence>
        {branches.map((branch, index) => {
          const branchColor = BRANCH_COLORS[index % BRANCH_COLORS.length];
          return (
            <React.Fragment key={branch.chatId}>
              {branch.branchedFromMessageId && (
                <BranchConnection 
                  messageId={branch.branchedFromMessageId} 
                  targetBranchId={branch.chatId}
                  color={branchColor}
                />
              )}
              <BranchedChat
                chatId={branch.chatId}
                onClose={() => removeBranch(branch.chatId)}
                selectedChatModel={selectedChatModel}
                isNewBranch={branch.isNewBranch}
                branchedFromMessageId={branch.branchedFromMessageId}
                style={{ width: `${100 / (branches.length + 1)}%` }}
                color={branchColor}
              />
            </React.Fragment>
          );
        })}
      </AnimatePresence>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </div>
  );
}
