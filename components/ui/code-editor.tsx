"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  return (
    // 🔥 PERBAIKAN UTAMA:
    // 1. w-full: Agar lebar mengikuti parent
    // 2. rounded-xl & border: Agar ada bingkai rapi
    // 3. overflow-hidden: Mencegah editor "bocor" keluar container
    <div className="w-full border border-slate-200 dark:border-slate-800 bg-[#1e1e1e] overflow-hidden">


      {/* Area Editor */}
      <CodeMirror
        value={value}
        height="400px"
        theme={vscodeDark}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
        onChange={(val) => onChange(val)}
        placeholder={placeholder}
        className="text-sm font-mono" // text-sm lebih pas untuk coding
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: true,
          tabSize: 2,
        }}
        // Opsional: CSS tambahan agar scrollbar rapi
        style={{ fontSize: 14 }}
      />
    </div>
  );
}
