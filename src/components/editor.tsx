"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo,
  Undo,
} from "lucide-react";

type EditorProps = {
  value?: JSONContent;
  onChange?: (value: JSONContent) => void;
};

export const Editor = ({ value, onChange }: EditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.parse(JSON.stringify(json)));
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-popover flex gap-2 rounded-lg border p-2">
        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-2 ${editor.isActive("bold") ? "bg-accent" : ""}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-2 ${editor.isActive("italic") ? "bg-accent" : ""}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        {/* Link */}
        <button
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              const url = prompt("Enter URL");
              if (url) {
                editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
              }
            }
          }}
          className={`rounded p-2 ${editor.isActive("link") ? "bg-accent" : ""}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded p-2 ${editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded p-2 ${editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-2 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-2 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded p-2"
          title="Undo"
        >
          <Undo size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded p-2"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      <div className="max-h-[400px] min-h-[400px] overflow-y-auto rounded-lg border p-4">
        <EditorContent
          editor={editor}
          className="leading-relaxed focus:outline-none [&_a]:text-blue-500 [&_a]:hover:underline [&_h1]:my-3 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-bold [&_li]:text-base [&_ol]:my-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:my-2 [&_p]:text-base [&_ul]:my-2 [&_ul]:ml-5 [&_ul]:list-disc"
        />
      </div>
    </div>
  );
};
