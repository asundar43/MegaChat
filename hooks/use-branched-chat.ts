import { create } from 'zustand';

interface BranchedChatState {
  isVisible: boolean;
  chatId: string | undefined;
  isNewBranch: boolean;
  branchedFromMessageId: string | undefined;
  show: (chatId: string, isNewBranch?: boolean, branchedFromMessageId?: string) => void;
  hide: () => void;
}

export const useBranchedChat = create<BranchedChatState>((set) => ({
  isVisible: false,
  chatId: undefined,
  isNewBranch: false,
  branchedFromMessageId: undefined,
  show: (chatId: string, isNewBranch = false, branchedFromMessageId?: string) =>
    set({ isVisible: true, chatId, isNewBranch, branchedFromMessageId }),
  hide: () => set({ isVisible: false, chatId: undefined, isNewBranch: false, branchedFromMessageId: undefined }),
})); 