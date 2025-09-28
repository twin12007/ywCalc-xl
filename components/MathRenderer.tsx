
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    MathJax: any;
  }
}

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.MathJax && contentRef.current) {
      window.MathJax.typesetPromise([contentRef.current]).catch((err: any) =>
        console.error('MathJax typeset error:', err)
      );
    }
  }, [content]);

  return <div ref={contentRef} className={className} dangerouslySetInnerHTML={{ __html: content }} />;
};

export default MathRenderer;
