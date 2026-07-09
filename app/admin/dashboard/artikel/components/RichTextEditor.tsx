"use client";

import { useEffect, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeContent?: (html: string) => void;
};

export default function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Tulis artikel...",
  onChangeContent,
}: Props) {
  const [content, setContent] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],

    content: defaultValue,

    onUpdate({ editor }) {
      const html = editor.getHTML();
      setContent(html);
      onChangeContent?.(html);
    },

    editorProps: {
      attributes: {
        class:
          "ProseMirror min-h-[350px] w-full px-5 py-4 outline-none text-gray-800 leading-8 text-[15px]",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
      console.log(editor);
    if (defaultValue !== editor.getHTML()) {
      editor.commands.setContent(defaultValue);
      setContent(defaultValue);
    }
  }, [defaultValue, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">

      {/* ================= TOOLBAR ================= */}

      <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 px-3 py-2">

        {/* Bold */}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 text-sm font-bold transition
          ${
            editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          B
        </button>

        {/* Italic */}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 text-sm italic transition
          ${
            editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          I
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Heading 1 */}

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded px-2 py-1 text-sm font-bold transition
          ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          H1
        </button>

        {/* Heading 2 */}

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded px-2 py-1 text-sm font-bold transition
          ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          H2
        </button>

        {/* Heading 3 */}

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded px-2 py-1 text-sm font-bold transition
          ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          H3
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />
        {/* Bullet List */}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-2 py-1 text-sm transition ${
            editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          • List
        </button>

        {/* Ordered List */}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-2 py-1 text-sm transition ${
            editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          1. List
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Blockquote */}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded px-2 py-1 text-sm transition ${
            editor.isActive("blockquote")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          ❝
        </button>

        {/* Code Block */}

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`rounded px-2 py-1 text-sm transition ${
            editor.isActive("codeBlock")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          {"</>"}
        </button>

        {/* Horizontal Rule */}

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded px-2 py-1 text-sm transition hover:bg-gray-200"
        >
          ─
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        {/* Undo */}

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded px-2 py-1 text-sm transition hover:bg-gray-200"
        >
          ↩
        </button>

        {/* Redo */}

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded px-2 py-1 text-sm transition hover:bg-gray-200"
        >
          ↪
        </button>

      </div>

      {/* ================= EDITOR ================= */}

      <EditorContent editor={editor} />

      <input
        type="hidden"
        name={name}
        value={content}
      />
    </div>
  );
}
