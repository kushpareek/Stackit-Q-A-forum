
import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { XIcon } from './icons';

interface AskQuestionModalProps {
  onClose: () => void;
  onSubmit: (title: string, description: string, tags: string[]) => void;
}

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && tags.length > 0) {
      onSubmit(title, description, tags);
    } else {
      alert('Please fill in all fields and add at least one tag.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Ask a Question</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How do I center a div?"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-slate-500 mt-1">Be specific and imagine you’re asking a question to another person.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <RichTextEditor value={description} onChange={setDescription} />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
              <div className="border border-slate-300 rounded-md p-2 flex flex-wrap gap-2 items-center">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium pl-3 pr-1 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-500 hover:text-blue-700">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="e.g. react, tailwindcss"
                  className="flex-grow p-1 focus:outline-none"
                />
              </div>
               <p className="text-xs text-slate-500 mt-1">Add up to 5 tags to describe what your question is about. Press Enter to add a tag.</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!title || !description || tags.length === 0}
            >
              Post Your Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionModal;
