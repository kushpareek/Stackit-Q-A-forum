
import React from 'react';
import { Link } from 'react-router-dom';
import type { Notification } from '../types';
import { MessageSquareIcon, BellIcon } from './icons';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'NEW_ANSWER': return <MessageSquareIcon className="w-5 h-5 text-blue-500" />;
      case 'MENTION': return <div className="w-5 h-5 text-purple-500 font-bold">@</div>;
      case 'COMMENT': return <MessageSquareIcon className="w-5 h-5 text-green-500" />;
      case 'OTHER': return <BellIcon className="w-5 h-5 text-slate-500" />;
      default: return <BellIcon className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
      <div className="p-3 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <Link 
              key={notif.id} 
              to={notif.link} 
              onClick={onClose}
              className={`flex items-start gap-3 p-3 hover:bg-slate-100 transition-colors ${!notif.isRead ? 'bg-blue-50' : ''}`}
            >
              <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
              <p className="text-sm text-slate-700">{notif.content}</p>
              {!notif.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2 ml-auto"></div>}
            </Link>
          ))
        ) : (
          <p className="text-sm text-slate-500 p-4 text-center">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
