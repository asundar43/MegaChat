import { ChatRequestOptions, Message } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { memo } from 'react';
import { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';

interface MessagesProps {
  chatId: string;
  messages: Array<Message>;
  isLoading: boolean;
  votes: Array<Vote> | undefined;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  isArtifactVisible: boolean;
  showRecommendations?: boolean;
  branchedFromMessageId?: string;
}

function PureMessages({
  chatId,
  messages,
  isLoading,
  votes,
  setMessages,
  reload,
  isReadonly,
  isArtifactVisible,
  showRecommendations = true,
  branchedFromMessageId,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
    >
      {messages.length === 0 && <Overview />}

      {branchedFromMessageId && (
        <div className="absolute left-[28px] top-0 bottom-0 w-px bg-gradient-to-b from-border to-transparent pointer-events-none" />
      )}

      {messages.map((message, index) => (
        <PreviewMessage
          chatId={chatId}
          key={message.id}
          message={message}
          messages={messages}
          isLoading={isLoading && index === messages.length - 1}
          index={index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          showRecommendations={showRecommendations}
          isBranchedFrom={message.id === branchedFromMessageId}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

function areEqual(prevProps: MessagesProps, nextProps: MessagesProps) {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  if (prevProps.isArtifactVisible !== nextProps.isArtifactVisible) return false;

  return true;
}

export const Messages = memo(PureMessages, areEqual);
