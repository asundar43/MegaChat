import { useChat, Message } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';
import { useSidebar } from './ui/sidebar';
import { useEffect } from 'react';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { toast } from 'sonner';
import { generateUUID } from '@/lib/utils';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { BranchIcon, CrossIcon } from './icons';
import { Button } from './ui/button';
import { Chat } from '@/lib/db/schema';

interface BranchedChatProps {
  chatId: string;
  onClose: () => void;
  selectedChatModel: string;
  isNewBranch?: boolean;
  branchedFromMessageId?: string;
}

export function BranchedChat({ 
  chatId, 
  onClose, 
  selectedChatModel,
  isNewBranch = false,
  branchedFromMessageId
}: BranchedChatProps) {
  const { width: windowWidth } = useWindowSize();
  const { open: isSidebarOpen } = useSidebar();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  const { data: chat, error } = useSWR<Chat>(`/api/chat?id=${chatId}`, fetcher);
  const { data: messagesData } = useSWR<Array<Message>>(
    `/api/messages?chatId=${chatId}`,
    fetcher,
  );

  useEffect(() => {
    if (error) {
      console.error('Failed to fetch chat:', error);
      toast.error('Failed to load chat details');
    }
  }, [error]);

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
    id: chatId,
    body: { id: chatId, selectedChatModel },
    initialMessages: messagesData || [],
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onError: () => {
      toast.error('An error occurred, please try again!');
    },
  });

  const { data: votes } = useSWR(`/api/vote?chatId=${chatId}`, fetcher);

  return (
    <motion.div
      className="flex flex-col h-full w-[50%] border-l border-border bg-background relative"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground">
            <BranchIcon size={14} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-medium">
              Branched Chat
            </h2>
            <p className="text-xs text-muted-foreground">
              {error ? 'Error loading chat' : chat?.title || 'Loading...'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-auto p-0"
          onClick={onClose}
        >
          <CrossIcon />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Messages
          chatId={chatId}
          messages={messages}
          isLoading={isLoading}
          votes={votes}
          setMessages={setMessages}
          reload={reload}
          isReadonly={false}
          isArtifactVisible={false}
          showRecommendations={isNewBranch}
          branchedFromMessageId={branchedFromMessageId}
        />
      </div>

      <div className="p-4 border-t">
        <MultimodalInput
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          attachments={[]}
          setAttachments={() => {}}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
      </div>
    </motion.div>
  );
} 