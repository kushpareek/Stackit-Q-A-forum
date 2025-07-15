import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import QuestionItem from '../components/QuestionItem';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { SpinnerIcon } from '../components/icons';

interface HomePageProps {
  onAskQuestion: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAskQuestion }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const questionsData: Question[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const newQuestion: Question = { 
          id: doc.id,
          title: data.title,
          description: data.description,
          tags: data.tags,
          authorId: data.authorId,
          views: data.views,
          createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date(),
        };
        questionsData.push(newQuestion);
      });
      setQuestions(questionsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-slate-800">All Questions</h1>
        <button
          onClick={onAskQuestion}
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Ask Question
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold">{loading ? '...' : questions.length} questions</h2>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center items-center p-10">
              <SpinnerIcon className="w-10 h-10 text-blue-600" />
            </div>
          ) : questions.length > 0 ? (
            questions.map(question => (
              <QuestionItem key={question.id} question={question} />
            ))
          ) : (
            <p className="p-6 text-slate-500">No questions have been asked yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;