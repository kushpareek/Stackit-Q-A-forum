
import React from 'react';

interface TagBadgeProps {
  tag: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag }) => {
  return (
    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
      {tag}
    </span>
  );
};

export default TagBadge;
