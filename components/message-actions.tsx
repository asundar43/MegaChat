import type { Message } from 'ai';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';
import { useRouter } from 'next/navigation';

import type { Vote } from '@/lib/db/schema';
import { useBranchedChat } from '@/hooks/use-branched-chat';

import { BranchIcon, CopyIcon, ThumbDownIcon, ThumbUpIcon } from './icons';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { memo } from 'react';
import equal from 'fast-deep-equal';

interface MessageActionsProps {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
  messages: Message[];
  showRecommendations?: boolean;
}

function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
  messages,
  showRecommendations = true,
}: MessageActionsProps) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();
  const router = useRouter();
  const { addBranch } = useBranchedChat();

  const handleBranch = async () => {
    try {
      const response = await fetch('/api/branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          messageId: message.id,
          chatId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to branch chat');
      }

      const { chatId: branchedChatId } = await response.json();
      addBranch(branchedChatId, true, message.id);
    } catch (error) {
      console.error('Failed to branch chat:', error);
      toast.error('Failed to branch chat');
    }
  };

  if (isLoading || message.role === 'user') {
    return null;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2 items-center opacity-0 group-hover/message:opacity-100 [&_[data-radix-popper-content-wrapper]]:!z-[9999]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast.success('Copied to clipboard!');
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        {showRecommendations && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="py-1 px-2 h-fit relative bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-none shadow-lg animate-pulse"
                onClick={handleBranch}
              >
                <div className="text-white">
                  <BranchIcon />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Branch this response</span>
                <span className="text-xs text-muted-foreground">Explore a different path from here</span>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={async () => {
                const upvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: 'up',
                  }),
                });

                toast.promise(upvote, {
                  loading: 'Upvoting Response...',
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return [];

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id,
                        );

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: true,
                          },
                        ];
                      },
                      { revalidate: false },
                    );

                    return 'Upvoted Response!';
                  },
                  error: 'Failed to upvote response.',
                });
              }}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1 relative z-[9999]">
              <span className="font-medium">Upvote Response</span>
            </div>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const downvote = fetch('/api/vote', {
                  method: 'PATCH',
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: 'down',
                  }),
                });

                toast.promise(downvote, {
                  loading: 'Downvoting Response...',
                  success: () => {
                    mutate<Array<Vote>>(
                      `/api/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return [];

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id,
                        );

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: false,
                          },
                        ];
                      },
                      { revalidate: false },
                    );

                    return 'Downvoted Response!';
                  },
                  error: 'Failed to downvote response.',
                });
              }}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1 relative z-[9999]">
              <span className="font-medium">Downvote Response</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
