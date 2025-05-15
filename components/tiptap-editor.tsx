'use client'
import dynamic from 'next/dynamic'

// Komponen ini akan diimpor secara dinamis tanpa SSR
const TiptapEditorWithoutSSR = dynamic(
  () => import('@/components/tiptap-editor-core').then((mod) => mod.TiptapEditorCore), 
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-[300px] border rounded-md p-4 w-full">
        Loading editor...
      </div>
    ),
  }
)

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  return (
    <div className="tiptap-editor-wrapper w-full">
      <TiptapEditorWithoutSSR value={value} onChange={onChange} />
    </div>
  );
};