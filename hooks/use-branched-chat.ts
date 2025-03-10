import { create } from 'zustand';

interface BranchedChatState {
  isVisible: boolean;
  chatId: string | null;
  isNewBranch: boolean;
  branchedFromMessageId: string | null;
  show: (chatId: string, isNewBranch?: boolean, branchedFromMessageId?: string | null) => void;
  hide: () => void;
}

export const useBranchedChat = create<BranchedChatState>((set) => ({
  isVisible: false,
  chatId: null,
  isNewBranch: false,
  branchedFromMessageId: null,
  show: (chatId: string, isNewBranch = false, branchedFromMessageId = null) =>
    set({ isVisible: true, chatId, isNewBranch, branchedFromMessageId }),
  hide: () => set({ isVisible: false, chatId: null, isNewBranch: false, branchedFromMessageId: null }),
})); 