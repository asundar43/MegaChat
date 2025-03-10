import { create } from 'zustand';

interface BranchedChatState {
  isVisible: boolean;
  chatId: string | null;
  isNewBranch: boolean;
  show: (chatId: string, isNewBranch?: boolean) => void;
  hide: () => void;
}

export const useBranchedChat = create<BranchedChatState>((set) => ({
  isVisible: false,
  chatId: null,
  isNewBranch: false,
  show: (chatId: string, isNewBranch = false) =>
    set({ isVisible: true, chatId, isNewBranch }),
  hide: () => set({ isVisible: false, chatId: null, isNewBranch: false }),
})); 