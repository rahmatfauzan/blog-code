"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  code: string;
  language: string;
  className?: string;
}

export function CodeViewer({ code, language, className }: CodeViewerProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setIsCopied(true);

    // Reset icon setelah 2 detik
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#1e1e1e]",
        className
      )}
    >
      {/* Header Bar (Mac OS Style / Terminal Style) */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 text-xs text-slate-400 font-mono flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            {language.toLowerCase()}
          </span>
        </div>

        {/* Tombol Copy */}
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700"
          title="Copy Code"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      {/* Area Code */}
      <div className="text-sm overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent", // Biar ngikut background parent
            fontSize: "0.9rem",
            lineHeight: "1.6",
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#6e7681",
            textAlign: "right",
          }}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
