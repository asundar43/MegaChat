import { create } from 'zustand';

interface BranchedChat {
  chatId: string;
  isNewBranch: boolean;
  branchedFromMessageId: string | undefined;
}

interface BranchedChatState {
  branches: BranchedChat[];
  addBranch: (chatId: string, isNewBranch?: boolean, branchedFromMessageId?: string) => void;
  removeBranch: (chatId: string) => void;
}

export const useBranchedChat = create<BranchedChatState>((set) => ({
  branches: [],
  addBranch: (chatId: string, isNewBranch = false, branchedFromMessageId?: string) =>
    set((state) => ({
      branches: [...state.branches, { chatId, isNewBranch, branchedFromMessageId }],
    })),
  removeBranch: (chatId: string) =>
    set((state) => ({
      branches: state.branches.filter(branch => branch.chatId !== chatId),
    })),
})); 