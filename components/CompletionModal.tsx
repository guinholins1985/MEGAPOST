import React from 'react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] rounded-2xl shadow-2xl w-full max-w-md text-center p-8 border border-[var(--border-light)] dark:border-[var(--border-dark)] transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="mx-auto mb-6 h-20 w-20 relative">
          <div className="h-full w-full rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <svg className="h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <style jsx>{`
            .animate-fade-in-scale {
              animation: fadeInScale 0.4s ease-out forwards;
            }
            @keyframes fadeInScale {
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
        <h3 id="modal-title" className="text-2xl font-bold gradient-text">Campanha Gerada!</h3>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Seu conteúdo de marketing completo está pronto para ser explorado.
        </p>
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] transition-all duration-300 shadow-lg transform hover:scale-105 glow-on-hover"
          >
            Ver meu conteúdo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;
