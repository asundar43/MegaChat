import { create } from 'zustand';

interface BranchedChatState {
  isVisible: boolean;
  chatId: string | null;
  show: (chatId: string) => void;
  hide: () => void;
}

export const useBranchedChat = create<BranchedChatState>((set) => ({
  isVisible: false,
  chatId: null,
  show: (chatId) => set({ isVisible: true, chatId }),
  hide: () => set({ isVisible: false, chatId: null }),
})); 