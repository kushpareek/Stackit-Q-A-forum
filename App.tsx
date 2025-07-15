
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QuestionPage from './pages/QuestionPage';
import ProfilePage from './pages/ProfilePage';
import AskQuestionModal from './components/AskQuestionModal';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import { useAuth } from './hooks/useAuth';
import { db } from './firebase/config';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const App: React.FC = () => {
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const { currentUser } = useAuth();

  const handleAskQuestionClick = () => {
    if (currentUser) {
      setAskModalOpen(true);
    } else {
      setAuthModal('login');
    }
  };

  const handleAddQuestion = async (title: string, description: string, tags: string[]) => {
    if (!currentUser) return;

    await addDoc(collection(db, "questions"), {
      title,
      description,
      tags,
      authorId: currentUser.id,
      views: 0,
      createdAt: serverTimestamp(),
    });
    setAskModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header 
        onAskQuestion={handleAskQuestionClick}
        onLoginClick={() => setAuthModal('login')}
        onSignUpClick={() => setAuthModal('signup')}
      />
      <main className="flex-grow">
        <Routes>
          <Route 
            path="/" 
            element={<HomePage onAskQuestion={handleAskQuestionClick} />} 
          />
          <Route 
            path="/question/:questionId" 
            element={<QuestionPage onLoginClick={() => setAuthModal('login')} />} 
          />
           <Route 
            path="/users/:userId" 
            element={<ProfilePage />}
          />
        </Routes>
      </main>
      {askModalOpen && (
        <AskQuestionModal 
          onClose={() => setAskModalOpen(false)} 
          onSubmit={handleAddQuestion} 
        />
      )}
      {authModal === 'login' && (
        <LoginModal 
            onClose={() => setAuthModal(null)}
            onSwitchToSignUp={() => setAuthModal('signup')}
        />
      )}
      {authModal === 'signup' && (
        <SignUpModal
            onClose={() => setAuthModal(null)}
            onSwitchToLogin={() => setAuthModal('login')}
        />
      )}
    </div>
  );
};

export default App;
