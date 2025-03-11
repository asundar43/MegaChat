'use client';

import React, { useEffect } from 'react';
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
import { ResizableDivider } from './resizable-divider';

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

  // Track widths of each panel (main chat + branches)
  const [panelWidths, setPanelWidths] = useState<number[]>([]);

  // Initialize panel widths when branches change
  useEffect(() => {
    const totalPanels = branches.length + 1;
    const equalWidth = 100 / totalPanels;
    setPanelWidths(new Array(totalPanels).fill(equalWidth));
  }, [branches.length]);

  // Handle resizing between panels
  const handleResize = (index: number, delta: number) => {
    setPanelWidths(currentWidths => {
      if (!currentWidths.length) return currentWidths;

      const newWidths = [...currentWidths];
      const totalWidth = newWidths.reduce((sum, width) => sum + width, 0);
      
      // Convert delta to percentage
      const deltaPercent = (delta / window.innerWidth) * 100;
      
      // Ensure minimum width of 15%
      const minWidth = 15;
      const leftNewWidth = newWidths[index] + deltaPercent;
      const rightNewWidth = newWidths[index + 1] - deltaPercent;
      
      if (leftNewWidth < minWidth || rightNewWidth < minWidth) return currentWidths;
      
      newWidths[index] = leftNewWidth;
      newWidths[index + 1] = rightNewWidth;
      
      return newWidths;
    });
  };

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
      <div 
        className="flex flex-col min-w-0 bg-background transition-all relative"
        style={{ width: `${panelWidths[0] || 100}%` }}
      >
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

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full relative z-10 border-t shadow-[0_-1px_2px_rgba(0,0,0,0.03)]">
          <div className="w-full max-w-3xl mx-auto">
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
          </div>
        </form>

        {branches.length > 0 && (
          <ResizableDivider
            color={BRANCH_COLORS[0]}
            onResize={(delta) => handleResize(0, delta)}
          />
        )}
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
              <div className="relative" style={{ width: `${panelWidths[index + 1] || 0}%` }}>
                <BranchedChat
                  chatId={branch.chatId}
                  onClose={() => removeBranch(branch.chatId)}
                  selectedChatModel={selectedChatModel}
                  isNewBranch={branch.isNewBranch}
                  branchedFromMessageId={branch.branchedFromMessageId}
                  color={branchColor}
                />
                {index < branches.length - 1 && (
                  <ResizableDivider
                    color={BRANCH_COLORS[(index + 1) % BRANCH_COLORS.length]}
                    onResize={(delta) => handleResize(index + 1, delta)}
                  />
                )}
              </div>
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
