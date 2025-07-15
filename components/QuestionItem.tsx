
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Question, Answer } from '../types';
import TagBadge from './TagBadge';
import { MessageSquareIcon } from './icons';
import { useUser } from '../hooks/useUser';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

interface QuestionItemProps {
  question: Question;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const { user: author, loading: authorLoading } = useUser(question.authorId);
  const [answerCount, setAnswerCount] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // This is not perfectly efficient as it runs for every item.
    // In a production app, these counts would likely be denormalized onto the question document.
    const fetchAnswersInfo = async () => {
        const q = query(collection(db, "answers"), where("questionId", "==", question.id));
        const querySnapshot = await getDocs(q);
        let votes = 0;
        querySnapshot.forEach(doc => {
            votes += (doc.data() as Answer).votes;
        });
        setAnswerCount(querySnapshot.size);
        setTotalVotes(votes);
    }
    fetchAnswersInfo();
  }, [question.id]);

  const timeAgo = (date: Date): string => {
    if (!date) return '...';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };


  return (
    <div className="flex gap-4 p-4 border-b border-slate-200">
      <div className="flex-shrink-0 flex flex-col items-end gap-1 text-sm text-slate-600 w-20">
        <span className="font-medium text-slate-800">{totalVotes} votes</span>
        <span className="flex items-center gap-1 font-medium rounded-md px-2 py-1 text-slate-800">
          {answerCount} <MessageSquareIcon className="w-4 h-4" />
        </span>
        <span>{question.views} views</span>
      </div>
      <div className="flex-grow">
        <Link to={`/question/${question.id}`} className="block text-lg font-semibold text-blue-700 hover:text-blue-800 mb-2">
          {question.title}
        </Link>
        <div 
            className="text-sm text-slate-600 max-h-12 overflow-hidden relative"
        >
         {/* This is no longer safe without sanitization. Showing plain text instead. */}
         {question.description.replace(/<[^>]+>/g, '').substring(0, 150)}...
        </div>
        <div className="mt-3 flex justify-between items-end">
          <div>
            {question.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {authorLoading ? <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div> : author && (
              <Link to={`/users/${author.id}`} className="flex items-center gap-2 hover:bg-slate-100 p-1 rounded-md">
                  <img src={author.avatarUrl} alt={author.name} className="w-5 h-5 rounded-full" />
                  <span className="text-blue-700 font-medium">{author.name}</span>
              </Link>
            )}
            <span>asked {timeAgo(question.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;