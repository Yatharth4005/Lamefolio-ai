import { useState, useEffect, useRef } from "react";
import { getNotionBlocks } from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, FileText, Type, List, Image as ImageIcon, Code, Hash, Minus } from "lucide-react";

interface NotionRendererPanelProps {
  pageId: string | null;
  isGenerating: boolean;
}

export function NotionRendererPanel({ pageId, isGenerating }: NotionRendererPanelProps) {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const prevBlockIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pageId) return;

    const fetchBlocks = async () => {
      try {
        const response = await getNotionBlocks(pageId);
        if (response.success) {
          setBlocks(response.blocks);
        }
      } catch (err: any) {
        console.error("Failed to fetch blocks:", err);
      }
    };

    fetchBlocks();
    
    // Polling while generating
    let interval: any;
    if (isGenerating) {
      interval = setInterval(fetchBlocks, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pageId, isGenerating]);

  // Track which blocks are newly added in this poll
  const newBlockIds = new Set<string>();
  blocks.forEach(b => {
    if (b.id && !prevBlockIds.current.has(b.id)) {
      newBlockIds.add(b.id);
      prevBlockIds.current.add(b.id);
    }
  });

  if (!pageId && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground/20 space-y-4">
        <FileText className="w-12 h-12" />
        <p className="text-sm font-medium uppercase tracking-widest">No Active Preview</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white text-black overflow-y-auto custom-scrollbar p-8 md:p-12 font-sans selection:bg-blue-100">
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <AnimatePresence initial={false}>
          {blocks.length === 0 && isGenerating && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex items-center gap-3 text-gray-400 italic"
             >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initialing workspace...</span>
             </motion.div>
          )}

          {blocks.map((block, idx) => (
            <NotionBlock 
              key={block.id || idx} 
              block={block} 
              isGenerating={isGenerating} 
              isNew={block.id ? newBlockIds.has(block.id) : false} 
            />
          ))}
        </AnimatePresence>
        
        {isGenerating && (
            <motion.div 
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"
            />
        )}
      </div>
    </div>
  );
}

function NotionBlock({ block, isGenerating, isNew }: { block: any, isGenerating: boolean, isNew: boolean }) {
  const type = block.type;
  const content = block[type];

  const renderRichText = (richText: any[]) => {
    return richText.map((rt: any, i: number) => {
      const { annotations, text } = rt;
      let className = "";
      if (annotations.bold) className += "font-bold ";
      if (annotations.italic) className += "italic ";
      if (annotations.underline) className += "underline ";
      if (annotations.strikethrough) className += "line-through ";
      
      if (annotations.code) {
        return (
          <motion.code 
            key={i} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-100 px-1.5 py-0.5 rounded text-red-500 font-mono text-[0.9em]"
          >
            <TypewriterText text={text.content} />
          </motion.code>
        );
      }
      
      return (
        <motion.span 
          key={i} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={className}
        >
          <TypewriterText text={text.content} />
        </motion.span>
      );
    });
  };

  function TypewriterText({ text }: { text: string }) {
    if (!isNew) return <span>{text}</span>;
    
    return (
      <motion.span>
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, display: "none" }}
            animate={{ opacity: 1, display: "inline" }}
            transition={{
              duration: 0.01,
              delay: index * 0.02,
              ease: "linear",
            }}
          >
            {char}
          </motion.span>
        ))}
        {/* Cursor effect at the very end of the line if it's new */}
        {isGenerating && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-1.5 h-4 bg-purple-500 ml-0.5 align-middle"
          />
        )}
      </motion.span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      {(() => {
        switch (type) {
          case "paragraph":
            return (
              <p className="text-[16px] leading-relaxed text-gray-800 min-h-[1.5em]">
                {renderRichText(content.rich_text)}
              </p>
            );
          case "heading_1":
            return <h1 className="text-4xl font-bold mt-8 mb-4 border-b pb-2">{renderRichText(content.rich_text)}</h1>;
          case "heading_2":
            return <h2 className="text-2xl font-bold mt-6 mb-3">{renderRichText(content.rich_text)}</h2>;
          case "heading_3":
            return <h3 className="text-xl font-bold mt-4 mb-2">{renderRichText(content.rich_text)}</h3>;
          case "bulleted_list_item":
            return (
              <li className="ml-6 list-disc text-gray-800">
                {renderRichText(content.rich_text)}
              </li>
            );
          case "numbered_list_item":
            return (
              <li className="ml-6 list-decimal text-gray-800">
                {renderRichText(content.rich_text)}
              </li>
            );
          case "image":
             const url = content.type === "external" ? content.external.url : content.file.url;
             return (
               <div className="my-6 rounded-lg overflow-hidden border border-gray-100">
                 <img src={url} alt="Notion Image" className="w-full object-cover max-h-[400px]" />
               </div>
             );
          case "divider":
            return <hr className="my-8 border-gray-100" />;
          case "code":
            return (
              <pre className="p-4 bg-gray-50 rounded-lg overflow-x-auto my-4 border border-gray-100">
                <code className="text-sm font-mono text-gray-700">
                  {content.rich_text[0]?.text.content}
                </code>
              </pre>
            );
          case "callout":
             return (
                 <div className="flex gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg my-4 italic text-blue-800">
                    <div className="text-xl">{content.icon?.emoji || "💡"}</div>
                    <div>{renderRichText(content.rich_text)}</div>
                 </div>
             );
          default:
            return <div className="text-gray-300 text-[10px] uppercase tracking-tighter invisible group-hover:visible">{type} block placeholder</div>;
        }
      })()}
    </motion.div>
  );
}
