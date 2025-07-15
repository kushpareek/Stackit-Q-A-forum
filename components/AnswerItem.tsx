
import React from 'react';
import { Link } from 'react-router-dom';
import type { Answer } from '../types';
import VoteControl from './VoteControl';
import { CheckIcon } from './icons';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

interface AnswerItemProps {
  answer: Answer;
  questionAuthorId: string;
  onAccept: (answerId: string) => void;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, questionAuthorId, onAccept }) => {
  const { currentUser } = useAuth();
  const { user: author, loading: authorLoading } = useUser(answer.authorId);
  const isQuestionAuthor = currentUser?.id === questionAuthorId;

  const timeAgo = (date: Date): string => {
    if(!date) return "...";
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
    <div className="flex gap-4 py-5 border-b border-slate-200">
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <VoteControl initialVotes={answer.votes} answerId={answer.id} />
        {answer.isAccepted && (
          <div className="text-green-500" title="Accepted Answer">
            <CheckIcon className="w-8 h-8" />
          </div>
        )}
        {isQuestionAuthor && !answer.isAccepted && (
          <button 
            onClick={() => onAccept(answer.id)}
            className="p-1 rounded-full text-slate-400 border-2 border-slate-400 hover:text-green-500 hover:border-green-500 transition-colors"
            title="Mark as accepted answer"
          >
            <CheckIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="flex-grow">
        <div 
          className="prose max-w-none text-slate-800"
          dangerouslySetInnerHTML={{ __html: answer.content }} 
        />
        <div className="mt-4 flex justify-end">
          <div className="bg-blue-50 p-3 rounded-md text-sm min-w-[150px]">
            <div className="text-slate-500 mb-1">answered {timeAgo(answer.createdAt)}</div>
             {authorLoading ? <div className="h-6 w-24 bg-slate-200 rounded animate-pulse"></div> : author && (
                <Link to={`/users/${author.id}`} className="flex items-center gap-2 group">
                  <img src={author.avatarUrl} alt={author.name} className="w-6 h-6 rounded-full" />
                  <span className="text-blue-800 font-medium group-hover:underline">{author.name}</span>
                </Link>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;