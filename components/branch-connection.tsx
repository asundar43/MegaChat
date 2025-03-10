import { useEffect, useState } from 'react';

interface BranchConnectionProps {
  messageId: string;
}

export function BranchConnection({ messageId }: BranchConnectionProps) {
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    const updatePath = () => {
      // Find the source message and its AI icon
      const sourceMessage = document.querySelector(`[data-message-id="${messageId}"]`);
      const sourceIcon = sourceMessage?.querySelector('.size-8'); // The AI icon container

      // Find the first message in the branch chat and its AI icon
      const branchMessage = document.querySelector('[data-branch-window] [data-role="assistant"]');
      const branchIcon = branchMessage?.querySelector('.size-8');

      if (!sourceIcon || !branchIcon) return;

      const sourceRect = sourceIcon.getBoundingClientRect();
      const branchRect = branchIcon.getBoundingClientRect();

      // Get the computed transform matrix of the branch window
      const branchWindow = document.querySelector('[data-branch-window]');
      if (!branchWindow) return;
      
      const transform = window.getComputedStyle(branchWindow).transform;
      let adjustedX = branchRect.left;
      
      // If there's a transform, adjust the x position
      if (transform && transform !== 'none') {
        // Parse the matrix values
        const matrix = transform.match(/matrix.*\((.*)\)/)?.[1].split(', ').map(Number);
        if (matrix) {
          // The 4th value (index 3) in a 2D transform matrix is the X translation
          adjustedX = branchRect.left - (matrix[4] || 0);
        }
      }

      // Start from the center of the source AI icon
      const startX = sourceRect.left + sourceRect.width / 2;
      const startY = sourceRect.top + sourceRect.height / 2;

      // End at the center of the branch AI icon
      const endX = adjustedX + branchRect.width / 2;
      const endY = branchRect.top + branchRect.height / 2;

      // Find the message text content for height calculation
      const sourceText = sourceMessage?.querySelector('.flex.flex-col.gap-4');
      const sourceTextRect = sourceText?.getBoundingClientRect();
      
      // Calculate the curve with control points to clear all content
      const dx = endX - startX;
      const dy = endY - startY;
      
      // Calculate drop amount to clear all content
      const textClearance = sourceTextRect 
        ? (sourceTextRect.bottom - startY) + 40 // Increased padding to 40px
        : 80; // Increased fallback clearance
      
      // Control points
      // First drop straight down past text
      const c1x = startX;
      const c1y = startY + textClearance;
      
      // Curve out horizontally with more space
      const c2x = startX + dx * 0.15; // Reduced from 0.2 for smoother curve
      const c2y = startY + textClearance;
      
      // Middle point with more drop
      const midX = startX + dx * 0.5;
      const midY = startY + textClearance;
      
      // Start curving up with more space
      const c3x = startX + dx * 0.85; // Increased from 0.8 for smoother curve
      const c3y = startY + textClearance;
      
      // Final approach with more space
      const c4x = endX;
      const c4y = endY + 30; // Increased from 20px for more gradual approach
      
      const path = `
        M ${startX} ${startY}
        C ${c1x} ${c1y},
          ${c2x} ${c2y},
          ${midX} ${midY}
        C ${c3x} ${c3y},
          ${c4x} ${c4y},
          ${endX} ${endY}
      `;

      setPath(path);
    };

    // Update path initially and on window resize
    updatePath();
    window.addEventListener('resize', updatePath);
    
    // Update path more frequently during animations
    const interval = setInterval(updatePath, 16); // ~60fps

    // Also update on scroll events for both main chat and branch chat
    const scrollHandler = () => {
      requestAnimationFrame(updatePath);
    };
    document.querySelectorAll('.overflow-y-scroll').forEach(element => {
      element.addEventListener('scroll', scrollHandler, { passive: true });
    });

    // Create a mutation observer to watch for new messages
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          requestAnimationFrame(updatePath);
        }
      }
    });

    // Start observing the branch chat container for new messages
    const branchContainer = document.querySelector('[data-branch-window] .overflow-y-scroll');
    if (branchContainer) {
      observer.observe(branchContainer, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      window.removeEventListener('resize', updatePath);
      document.querySelectorAll('.overflow-y-scroll').forEach(element => {
        element.removeEventListener('scroll', scrollHandler);
      });
      clearInterval(interval);
      observer.disconnect();
    };
  }, [messageId]);

  if (!path) return null;

  return (
    <svg
      className="fixed inset-0 pointer-events-none"
      style={{ 
        position: 'fixed', 
        width: '100vw', 
        height: '100vh',
        zIndex: 100 // Lower z-index so it goes under messages
      }}
    >
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeDasharray="2 3"
        filter="drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
} 