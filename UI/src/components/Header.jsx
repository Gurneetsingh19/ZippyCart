import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export const Header = ({ title, showBack = true, rightElement, className }) => {
  const navigate = useNavigate();

  return (
    <header className={clsx("flex items-center justify-between p-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100", className)}>
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 mr-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
};
