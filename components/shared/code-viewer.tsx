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
  language?: string;
  className?: string;
}

export function CodeViewer({ code, className }: CodeViewerProps) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none w-full break-words",
        className
      )}
    >
      {/* @ts-ignore */}
      <ReactMarkdown
        components={{
          // 1. Override tag <pre> bawaan markdown agar tidak double wrapper
          pre: ({ children }) => <>{children}</>,

          // 2. Override tag <code>
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeContent = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code
                  className="bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-200 dark:border-slate-700 break-words"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : "text"}
                code={codeContent}
              />
            );
          },

          // 3. Fix elemen lain - PENTING: gunakan <div> untuk paragraph, bukan <p>
          h1: (props) => (
            <h1
              className="text-3xl font-bold mt-8 mb-4 text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-800"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-xl font-bold mt-5 mb-2 text-slate-900 dark:text-white"
              {...props}
            />
          ),
          // Gunakan <div> untuk paragraph agar tidak error hydration
          p: (props) => (
            <div
              className="mb-4 leading-7 text-slate-700 dark:text-slate-300"
              {...props}
            />
          ),
          ul: (props) => (
            <ul
              className="list-disc list-outside ml-6 mb-4 text-slate-700 dark:text-slate-300 space-y-1"
              {...props}
            />
          ),
          ol: (props) => (
            <ol
              className="list-decimal list-outside ml-6 mb-4 text-slate-700 dark:text-slate-300 space-y-1"
              {...props}
            />
          ),
          li: (props) => <li className="pl-1" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-indigo-500 pl-4 italic my-4 bg-slate-50 dark:bg-slate-900/50 py-2 rounded-r text-slate-600 dark:text-slate-400"
              {...props}
            />
          ),
          a: (props) => (
            <a
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
              {...props}
            />
          ),
          strong: (props) => (
            <strong
              className="font-bold text-slate-900 dark:text-white"
              {...props}
            />
          ),
          em: (props) => (
            <em
              className="italic text-slate-700 dark:text-slate-300"
              {...props}
            />
          ),
        }}
      >
        {code}
      </ReactMarkdown>
    </div>
  );
}

// --- KOMPONEN EDITOR DENGAN 'GRID HACK' ---
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success("Kode berhasil disalin!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    // HACK: 'grid' di sini memaksa child min-width 0, mencegah overflow
    <div className="grid my-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#1e1e1e] shadow-lg not-prose">
      {/* Header */}
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
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      {/* Content Wrapper dengan Scrollbar */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        {/* PENTING: 
            1. min-w-full -> agar background hitam selalu penuh
            2. float-left -> trik lama untuk memaksa parent expand sesuai konten lebar
            3. style minWidth -> fallback
        */}
        <div className="min-w-full float-left" style={{ minWidth: "100%" }}>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            PreTag="div" // Jangan pakai <pre> bawaan
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              background: "transparent",
              fontSize: "13px",
              lineHeight: "1.6",
              fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: "3em",
              paddingRight: "1em",
              color: "#6e7681",
              textAlign: "right",
              userSelect: "none",
            }}
            wrapLines={false} // Matikan wrapLines agar scroll horizontal aktif
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
