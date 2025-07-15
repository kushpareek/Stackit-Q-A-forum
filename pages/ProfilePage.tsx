import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import type { Question, Answer } from '../types';
import { CalendarIcon, SpinnerIcon } from '../components/icons';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading: userLoading } = useUser(userId);
  const [activeTab, setActiveTab] = useState<'questions' | 'answers'>('questions');
  const [userContent, setUserContent] = useState<{questions: Question[], answers: Answer[]}>({questions: [], answers: []});
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchContent = async () => {
      setContentLoading(true);
      
      const questionsQuery = query(collection(db, "questions"), where("authorId", "==", userId), orderBy("createdAt", "desc"));
      const questionsSnapshot = await getDocs(questionsQuery);
      const questions: Question[] = questionsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            tags: data.tags,
            authorId: data.authorId,
            views: data.views,
            createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date(),
          };
      });
      
      const answersQuery = query(collection(db, "answers"), where("authorId", "==", userId), orderBy("createdAt", "desc"));
      const answersSnapshot = await getDocs(answersQuery);
      const answers: Answer[] = answersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            authorId: data.authorId,
            content: data.content,
            votes: data.votes,
            isAccepted: data.isAccepted,
            createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date(),
            questionId: data.questionId,
          };
      });

      setUserContent({ questions, answers });
      setContentLoading(false);
    };

    fetchContent();
  }, [userId]);
  
  const answeredQuestionIds = useMemo(() => [...new Set(userContent.answers.map(a => a.questionId))], [userContent.answers]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);

  useEffect(() => {
      if(answeredQuestionIds.length === 0) {
        setAnsweredQuestions([]);
        return;
      }
      
      const fetchAnsweredQuestions = async () => {
          const idsToFetch = answeredQuestionIds.slice(0, 30);
          if (idsToFetch.length === 0) return;

          const q = query(collection(db, "questions"), where("__name__", "in", idsToFetch));
          const snapshot = await getDocs(q);
          const questionsMap = new Map<string, Question>();

          snapshot.docs.forEach(doc => {
            const data = doc.data();
            questionsMap.set(doc.id, {
                id: doc.id,
                title: data.title,
                description: data.description,
                tags: data.tags,
                authorId: data.authorId,
                views: data.views,
                createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date(),
            });
          });

          const orderedQuestions = userContent.answers
            .map(answer => questionsMap.get(answer.questionId))
            .filter((question): question is Question => !!question);
        
          const uniqueQuestions = Array.from(new Map(orderedQuestions.map(q => [q.id, q])).values());

          setAnsweredQuestions(uniqueQuestions);
      };
      fetchAnsweredQuestions();

  }, [userContent.answers, answeredQuestionIds]);

  if (userLoading) {
    return <div className="flex justify-center items-center h-64"><SpinnerIcon className="w-12 h-12 text-blue-600"/></div>;
  }
  
  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">User not found</h1>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back to home</Link>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return '...';
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };
  
  const StatCard: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
            <img src={user.avatarUrl.replace('/40/40', '/128/128')} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-slate-200" />
            <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-500">
              <CalendarIcon className="w-4 h-4" />
              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mt-6">
            <h2 className="text-lg font-semibold mb-3 text-slate-700">Stats</h2>
            <div className="flex justify-around">
                <StatCard value={user.reputation || 0} label="Reputation" />
                <StatCard value={userContent.questions.length} label="Questions" />
                <StatCard value={userContent.answers.length} label="Answers" />
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          <div className="border-b border-slate-200 mb-6">
            <nav className="flex gap-4">
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-2 px-1 font-semibold ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Questions ({userContent.questions.length})
              </button>
              <button
                onClick={() => setActiveTab('answers')}
                className={`py-2 px-1 font-semibold ${activeTab === 'answers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Answers ({userContent.answers.length})
              </button>
            </nav>
          </div>
          
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm min-h-[200px]">
            {contentLoading ? <div className="p-6 text-center"><SpinnerIcon className="w-8 h-8 text-blue-600 mx-auto" /></div> : 
            <>
              {activeTab === 'questions' && (
                  <div>
                      {userContent.questions.length > 0 ? userContent.questions.map(q => (
                         <ProfileContentItem key={q.id} question={q} type="question" answers={userContent.answers} />
                      )) : <p className="p-6 text-slate-500">This user hasn't asked any questions yet.</p>}
                  </div>
              )}
              {activeTab === 'answers' && (
                  <div>
                       {userContent.answers.length > 0 ? answeredQuestions.map(q => (
                         <ProfileContentItem key={`${q.id}-${userContent.answers.find(a=>a.questionId === q.id)?.id}`} question={q} type="answer" answers={userContent.answers} />
                      )) : <p className="p-6 text-slate-500">This user hasn't answered any questions yet.</p>}
                  </div>
              )}
            </>
            }
          </div>
        </main>
      </div>
    </div>
  );
};

const ProfileContentItem: React.FC<{question: Question, type: 'question' | 'answer', answers?: Answer[]}> = ({ question, type, answers = [] }) => {
    
    const relevantAnswer = type === 'answer' ? answers.find(a => a.questionId === question.id) : null;
    const votes = relevantAnswer ? relevantAnswer.votes : 0;
    const value = type === 'question' ? (answers.filter(a => a.questionId === question.id).length) : votes;
    const label = type === 'question' ? 'answers' : 'votes';
    const date = type === 'question' ? question.createdAt : relevantAnswer?.createdAt;

    return (
        <div className="flex items-center gap-4 p-4 border-b border-slate-200 last:border-b-0">
            <div className="flex items-center justify-center w-20 text-center text-sm bg-slate-100 p-2 rounded-md flex-shrink-0">
                <span className="font-bold text-slate-700 mr-1.5">{value}</span> 
                <span className="text-slate-500">{label}</span>
            </div>
            <div className="flex-grow">
                <Link to={`/question/${question.id}`} className="text-blue-700 hover:underline">{question.title}</Link>
            </div>
            <div className="text-xs text-slate-500 flex-shrink-0 ml-4">
                {date instanceof Date ? date.toLocaleDateString() : ''}
            </div>
        </div>
    )
}

export default ProfilePage;