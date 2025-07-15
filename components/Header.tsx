
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Notification } from '../types';
import { BellIcon } from './icons';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
    onAskQuestion: () => void;
    onLoginClick: () => void;
    onSignUpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAskQuestion, onLoginClick, onSignUpClick }) => {
  const { currentUser, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationToggle = () => {
      setShowNotifications(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-slate-800">
              Stack<span className="text-blue-600">It</span>
            </Link>
            {/* Future nav links could go here */}
          </div>

          <div className="flex items-center gap-4">
            <button
                onClick={onAskQuestion}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Ask Question
            </button>

            {currentUser ? (
              <>
                <div className="relative" ref={notificationRef}>
                  <button onClick={handleNotificationToggle} className="relative text-slate-600 hover:text-slate-800">
                    <BellIcon className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                      <NotificationDropdown 
                        notifications={notifications}
                        onClose={() => setShowNotifications(false)}
                      />
                  )}
                </div>
                <div className="flex items-center gap-2">
                    <Link to={`/users/${currentUser.id}`} title="View Profile">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                    </Link>
                    <span className="text-sm font-medium text-slate-700">{currentUser.name}</span>
                    <button onClick={logout} className="text-sm text-slate-600 hover:text-blue-600 ml-2">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={onLoginClick} className="text-sm font-medium text-slate-600 hover:text-blue-600">Log In</button>
                <button onClick={onSignUpClick} className="text-sm font-medium text-white bg-slate-800 px-3 py-1.5 rounded-md hover:bg-slate-900">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;