import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import type { Question, Answer } from '../types';
import AnswerItem from '../components/AnswerItem';
import TagBadge from '../components/TagBadge';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp, query, where, onSnapshot, orderBy, writeBatch } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { SpinnerIcon } from '../components/icons';

interface QuestionPageProps {
  onLoginClick: () => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ onLoginClick }) => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (!questionId) return;

    const fetchQuestion = async () => {
      const questionRef = doc(db, 'questions', questionId);
      try {
        await updateDoc(questionRef, { views: increment(1) });
      } catch (e) {
        console.warn("Could not increment view count, likely due to offline mode or permissions.");
      }
      
      const docSnap = await getDoc(questionRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQuestion({
          id: docSnap.id,
          title: data.title,
          description: data.description,
          tags: data.tags,
          authorId: data.authorId,
          views: data.views,
          createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date(),
        });
      } else {
        console.log("No such question!");
      }
      setLoading(false);
    };
    fetchQuestion();

    const answersQuery = query(collection(db, 'answers'), where('questionId', '==', questionId), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(answersQuery, (querySnapshot) => {
      const answersData: Answer[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        answersData.push({
          id: doc.id,
          content: data.content,
          questionId: data.questionId,
          authorId: data.authorId,
          votes: data.votes,
          isAccepted: data.isAccepted,
          createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date(),
        });
      });
      setAnswers(answersData);
    });

    return () => unsubscribe();
  }, [questionId]);


  const handlePostAnswer = async () => {
    if (newAnswer.trim() && questionId && currentUser) {
      await addDoc(collection(db, 'answers'), {
        content: newAnswer,
        questionId,
        authorId: currentUser.id,
        votes: 0,
        isAccepted: false,
        createdAt: serverTimestamp(),
      });
      setNewAnswer('');
    }
  };

  const handleAcceptAnswer = async (answerIdToAccept: string) => {
    if (!questionId || !currentUser || currentUser.id !== question?.authorId) return;
  
    const batch = writeBatch(db);
  
    const previouslyAccepted = answers.find(a => a.isAccepted);
    if (previouslyAccepted && previouslyAccepted.id !== answerIdToAccept) {
      const prevRef = doc(db, 'answers', previouslyAccepted.id);
      batch.update(prevRef, { isAccepted: false });
    }
  
    const newRef = doc(db, 'answers', answerIdToAccept);
    batch.update(newRef, { isAccepted: true });
  
    await batch.commit();
  };
  
  const timeAgo = (date: Date): string => {
    if (!date) return '...';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return `asked ${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `asked ${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `asked ${Math.floor(interval)} minutes ago`;
    return `asked ${Math.floor(seconds)} seconds ago`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><SpinnerIcon className="w-12 h-12 text-blue-600"/></div>;
  }

  if (!question) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="pb-4 mb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{question.title}</h1>
        <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{timeAgo(question.createdAt)}</span>
            <span>Viewed {question.views} times</span>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-full">
            <div className="prose max-w-none mb-6 text-slate-800" dangerouslySetInnerHTML={{ __html: question.description }} />
            <div className="flex gap-2 mb-8">
                {question.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">{answers.length} Answers</h2>
            <div className="space-y-4">
              {answers
                .sort((a,b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0) || b.votes - a.votes)
                .map(answer => (
                  <AnswerItem 
                    key={answer.id} 
                    answer={answer} 
                    questionAuthorId={question.authorId}
                    onAccept={handleAcceptAnswer}
                  />
              ))}
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Answer</h2>
                {currentUser ? (
                    <div>
                        <RichTextEditor value={newAnswer} onChange={setNewAnswer} />
                        <button 
                            onClick={handlePostAnswer}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={!newAnswer.trim()}
                        >
                            Post Your Answer
                        </button>
                    </div>
                ) : (
                    <div className="p-4 border rounded-md bg-slate-100 text-center">
                      <p className="text-slate-700">You must be <button onClick={onLoginClick} className="text-blue-600 hover:underline font-semibold">logged in</button> to post an answer.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;