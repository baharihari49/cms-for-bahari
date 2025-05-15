'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import TextAlign from '@tiptap/extension-text-align'
import { createLowlight } from 'lowlight'
import { common } from 'lowlight'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RefreshCcw
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ImageUploader } from '@/components/image-uploader'
import "./tiptap-editor.css"

interface TiptapEditorCoreProps {
  value: string;
  onChange: (content: string) => void;
}

export const TiptapEditorCore = ({ value, onChange }: TiptapEditorCoreProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false, // Disable default heading to use our custom configuration
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md mx-auto my-4 max-w-full',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-border',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border-b-2 border-border bg-muted text-muted-foreground font-medium px-3 py-2 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-border px-3 py-2 text-left',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
        HTMLAttributes: {
          class: 'rounded-md bg-muted p-4 my-2 overflow-x-auto',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] w-full border rounded-md p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-a:text-primary prose-img:rounded-md prose-pre:bg-muted prose-pre:p-4',
      },
    },
    // Penting: Set ini ke false untuk menghindari error hydration
    immediatelyRender: false,
  });

  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update editor content when value changes from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Fix hydration issues
  if (!isMounted) {
    return <div className="min-h-[300px] w-full border rounded-md p-4">Loading editor...</div>;
  }

  // Helper to check if link is active
  const setLink = () => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Add image
  const addImage = () => {
    if (!editor) return;
    setShowImageUploader(true);
  };
  
  // Handle image selected from uploader
  const handleImageSelected = (imageSrc: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: imageSrc }).run();
  };

  // Insert table
  const insertTable = () => {
    if (!editor) return;
    
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-editor w-full">
      <div className="border border-border rounded-t-md p-1 bg-muted flex flex-wrap gap-1 mb-1 w-full">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted-foreground/20' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted-foreground/20' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-muted-foreground/20' : ''}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-muted-foreground/20' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted-foreground/20' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted-foreground/20' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted-foreground/20' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'bg-muted-foreground/20' : ''}
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted-foreground/20' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted-foreground/20' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-muted-foreground/20' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={insertTable}
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted-foreground/20' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted-foreground/20' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted-foreground/20' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'bg-muted-foreground/20' : ''}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <RefreshCcw className="h-4 w-4 rotate-[-90deg]" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <RefreshCcw className="h-4 w-4 rotate-90" />
        </Button>
      </div>
      
      <EditorContent editor={editor} className="border rounded-b-md w-full" />
      
      {/* Mengatasi warning tippy dengan menambahkan wrapper div */}
      <div>
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ 
            duration: 100,
            appendTo: () => document.body, // Tambahkan ke body
            zIndex: 1000, // Tambahkan z-index tinggi
          }}
        >
          <div className="bg-popover text-popover-foreground shadow-md border rounded-md p-1 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-muted-foreground/20' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-muted-foreground/20' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={setLink}
              className={editor.isActive('link') ? 'bg-muted-foreground/20' : ''}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      </div>
      
      {/* Mengatasi warning tippy dengan menambahkan wrapper div */}
      <div>
        <FloatingMenu 
          editor={editor} 
          tippyOptions={{ 
            duration: 100,
            appendTo: () => document.body, // Tambahkan ke body
            zIndex: 1000, // Tambahkan z-index tinggi
          }}
        >
          <div className="bg-popover text-popover-foreground shadow-md border rounded-md p-1 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-muted-foreground/20' : ''}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-muted-foreground/20' : ''}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-muted-foreground/20' : ''}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'bg-muted-foreground/20' : ''}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>
        </FloatingMenu>
      </div>
      
      {/* Image Uploader Modal */}
      {showImageUploader && (
        <ImageUploader 
          onImageSelected={handleImageSelected}
          onClose={() => setShowImageUploader(false)}
        />
      )}
    </div>
  );
};