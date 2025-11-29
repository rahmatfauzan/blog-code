"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  code: string;
  language?: string; // Opsional, karena markdown akan mendeteksi sendiri
  className?: string;
}

export function CodeViewer({ code, className }: CodeViewerProps) {
  // Custom Components untuk React Markdown
  const components = {
    // 1. HEADINGS
    h1: ({ ...props }) => (
      <h1
        className="text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800"
        {...props}
      />
    ),
    h2: ({ ...props }) => (
      <h2
        className="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white"
        {...props}
      />
    ),
    h3: ({ ...props }) => (
      <h3
        className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white"
        {...props}
      />
    ),

    // 2. PARAGRAPH & LIST (FIX HYDRATION ERROR)
    // Kita ganti tag <p> menjadi <div> agar jika ada block element di dalamnya, tidak error.
    p: ({ ...props }) => (
      <div
        className="leading-7 text-slate-700 dark:text-slate-300 mb-4"
        {...props}
      />
    ),
    ul: ({ ...props }) => (
      <ul
        className="list-disc list-outside ml-6 mb-4 text-slate-700 dark:text-slate-300 space-y-1"
        {...props}
      />
    ),
    li: ({ ...props }) => <li className="pl-1" {...props} />,
    blockquote: ({ ...props }) => (
      <blockquote
        className="border-l-4 border-indigo-500 pl-4 italic my-4 bg-slate-50 dark:bg-slate-900/50 py-2 rounded-r text-slate-600 dark:text-slate-400"
        {...props}
      />
    ),

    // 3. CODE BLOCK HANDLER
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const codeContent = String(children).replace(/\n$/, "");

      // Case A: Inline Code (contoh: `npm install`)
      if (inline) {
        return (
          <code
            className="bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200 dark:border-slate-700"
            {...props}
          >
            {children}
          </code>
        );
      }

      // Case B: Block Code (```js ... ```)
      return (
        <CodeBlock language={match ? match[1] : "text"} code={codeContent} />
      );
    },
  };

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      {/* @ts-ignore - Type definition react-markdown terkadang konflik dengan custom components, aman diabaikan */}
      <ReactMarkdown components={components}>{code}</ReactMarkdown>
    </div>
  );
}

// --- SUB COMPONENT: Tampilan Editor Khusus ---
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success("Kode berhasil disalin!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border-slate-200 dark:border-slate-800 bg-[#1e1e1e] shadow-lg">
      {/* Header Bar (Mac Style) */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#3e3e42]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 ml-2 opacity-70 uppercase">
            <Terminal className="w-3 h-3" />
            {language}
          </span>
        </div>

        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-all"
          title="Copy Code"
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-green-500 animate-in zoom-in duration-200" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      {/* Syntax Highlighter Area */}
      <div className="text-sm overflow-x-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent", // Transparan agar ikut warna bg parent #1e1e1e
            fontSize: "14px",
            lineHeight: "1.6",
            fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "#6e7681",
            textAlign: "right",
            userSelect: "none",
          }}
          wrapLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
