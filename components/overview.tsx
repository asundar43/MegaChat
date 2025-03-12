import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <MessageIcon size={32} />
        </p>
        <p className="text-lg font-medium">
          Meet branchGPT - Where Every Chat Can Take Multiple Paths 🌳
        </p>
        <p>
          Ever wished you could explore different AI responses without starting over? Now you can. Branch your chats, explore multiple angles, and never lose your train of thought.
        </p>
        <p className="text-sm text-muted-foreground">
          💡 Branch chats instantly • 🔄 Switch between threads • 🔗 Share your discoveries
        </p>
        <p className="text-sm font-medium">
          Drop your question below and watch the magic unfold ✨
        </p>
      </div>
    </motion.div>
  );
};
