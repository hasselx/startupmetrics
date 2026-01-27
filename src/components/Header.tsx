import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

const Header = ({ title, showBack = false, onBack, rightElement }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between h-header px-4">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors tap-highlight-none"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          {title && (
            <h1 className="font-semibold text-lg truncate">{title}</h1>
          )}
        </div>
        {rightElement && (
          <div className="flex-shrink-0">{rightElement}</div>
        )}
      </div>
    </header>
  );
};

export default Header;
