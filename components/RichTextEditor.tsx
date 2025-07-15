
import React, { useEffect, useRef } from 'react';

// Quill is loaded from CDN in index.html, so we declare it here to satisfy TypeScript
declare const Quill: any;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: placeholder || 'Write your content here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });

      // Set initial value
      if (value) {
        quillInstance.current.root.innerHTML = value;
      }
      
      quillInstance.current.on('text-change', () => {
        onChange(quillInstance.current.root.innerHTML);
      });
    }

    // Cleanup
    return () => {
        if (quillInstance.current && quillInstance.current.container) {
             // This is a bit of a hack to prevent errors on fast unmounts
             // as Quill's destroy method might not be available immediately.
             const container = quillInstance.current.container;
             quillInstance.current = null;
             if (container && container.parentNode) {
                //  container.parentNode.removeChild(container);
             }
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync value from React state to Quill editor
  useEffect(() => {
    if (quillInstance.current) {
      if (quillInstance.current.root.innerHTML !== value) {
        // Use a timeout to avoid clashes with user input
        setTimeout(() => {
            if (quillInstance.current && !quillInstance.current.hasFocus()) {
                 quillInstance.current.root.innerHTML = value;
            }
        }, 0);
      }
    }
  }, [value]);

  return <div ref={editorRef}></div>;
};

export default RichTextEditor;
