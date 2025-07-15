
import React, { useState } from 'react';
import { UpvoteIcon, DownvoteIcon } from './icons';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import { doc, writeBatch, increment } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

interface VoteControlProps {
  initialVotes: number;
  answerId: string;
}

const VoteControl: React.FC<VoteControlProps> = ({ initialVotes, answerId }) => {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const { currentUser } = useAuth();

  const handleVote = async (type: 'up' | 'down') => {
    if (!currentUser) {
        alert("Please log in to vote.");
        return;
    }
    
    const answerRef = doc(db, 'answers', answerId);
    const userRef = doc(db, 'users', currentUser.id); // Assuming author of the answer needs reputation update
    const batch = writeBatch(db);

    let voteIncrement = 0;
    
    if (voted === type) { // Undoing vote
      voteIncrement = type === 'up' ? -1 : 1;
      setVoted(null);
    } else { // New or changed vote
      if (voted === 'up') voteIncrement = -1; // remove previous upvote
      if (voted === 'down') voteIncrement = 1; // remove previous downvote
      voteIncrement += type === 'up' ? 1 : -1; // add new vote
      setVoted(type);
    }

    if (voteIncrement !== 0) {
        batch.update(answerRef, { votes: increment(voteIncrement) });
        // You might want to update the answer author's reputation here as well
        // const answerDoc = await getDoc(answerRef);
        // if(answerDoc.exists()) {
        //    const authorId = answerDoc.data().authorId;
        //    const authorRef = doc(db, 'users', authorId);
        //    batch.update(authorRef, { reputation: increment(voteIncrement) });
        // }
        await batch.commit();
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 text-slate-500">
      <button 
        onClick={() => handleVote('up')}
        className={`p-1 rounded-full transition-colors ${voted === 'up' ? 'bg-orange-100 text-orange-500' : 'hover:bg-slate-200'}`}
        aria-label="Upvote"
        disabled={!currentUser}
      >
        <UpvoteIcon className="w-6 h-6" />
      </button>
      <span className="font-bold text-lg text-slate-800">{initialVotes}</span>
      <button 
        onClick={() => handleVote('down')}
        className={`p-1 rounded-full transition-colors ${voted === 'down' ? 'bg-blue-100 text-blue-500' : 'hover:bg-slate-200'}`}
        aria-label="Downvote"
        disabled={!currentUser}
      >
        <DownvoteIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default VoteControl;
