import React, { useState } from 'react';
import { generateImageAssets } from '../services/geminiService';

const Loader: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
        <div className={`${small ? 'w-8 h-8 border-2' : 'w-12 h-12 border-4'} border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin`}></div>
    </div>
);

interface AiAssetGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (data: { base64: string; mimeType: string; dataUrl: string; }) => void;
  assetType: 'appIcon' | 'customBackground' | null;
}

const AiAssetGeneratorModal: React.FC<AiAssetGeneratorModalProps> = ({ isOpen, onClose, onSelect, assetType }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<(string | null)[]>([]);

  if (!isOpen || !assetType) return null;

  const config = {
    appIcon: {
      title: 'Gerar Ícone de App com IA',
      placeholder: 'Ex: uma fatia de limão verde, estilo flat design',
      promptPrefix: 'minimalist vector app icon, flat design, centered on a solid white background, for: ',
      aspect: 'aspect-square',
      objectFit: 'object-contain p-1'
    },
    customBackground: {
      title: 'Gerar Plano de Fundo com IA',
      placeholder: 'Ex: um gradiente suave com tons de azul e roxo',
      promptPrefix: 'beautiful abstract phone wallpaper, subtle, high resolution, 4k, cinematic lighting, related to: ',
      aspect: 'aspect-[9/16]',
      objectFit: 'object-cover'
    }
  }[assetType];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Por favor, digite uma descrição.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAssets(Array(6).fill('loading'));
    try {
      const fullPrompt = config.promptPrefix + prompt;
      // Fix: Pass the correct aspect ratio to the asset generator service
      // based on the asset type being generated.
      const aspectRatio = config.aspect === 'aspect-square' ? '1:1' : '9:16';
      const result = await generateImageAssets(fullPrompt, 6, aspectRatio);
      setAssets(result);
    } catch (err) {
      const e = err as Error;
      setError(e.message);
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAsset = (base64: string) => {
    const mimeType = 'image/png'; // Gemini image gen is png
    onSelect({
      base64,
      mimeType,
      dataUrl: `data:${mimeType};base64,${base64}`
    });
    // Reset state for next time
    setPrompt('');
    setAssets([]);
    setError(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] rounded-2xl shadow-2xl w-full max-w-2xl text-center p-6 border border-[var(--border-light)] dark:border-[var(--border-dark)] transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
      >
        <style jsx>{`
            .animate-fade-in-scale { animation: fadeInScale 0.4s ease-out forwards; }
            @keyframes fadeInScale { to { transform: scale(1); opacity: 1; } }
        `}</style>

        <div className="flex justify-between items-center mb-4">
            <h3 id="modal-title" className="text-xl font-bold">{config.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={config.placeholder}
                className="w-full flex-grow px-3 py-2 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] outline-none resize-none"
                rows={2}
                disabled={isLoading}
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-5 py-2 gradient-bg text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
                {isLoading ? 'Gerando...' : 'Gerar'}
            </button>
        </div>
        
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-4 min-h-[150px]">
            {assets.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {assets.map((asset, index) => (
                        <div key={index} className={`${config.aspect} rounded-md border border-[var(--border-light)] dark:border-[var(--border-dark)] overflow-hidden bg-gray-100 dark:bg-gray-800`}>
                            {asset === 'loading' ? (
                                <Loader small />
                            ) : asset ? (
                                <button onClick={() => handleSelectAsset(asset)} className="w-full h-full block group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] rounded-md">
                                    <img src={`data:image/png;base64,${asset}`} alt={`Asset ${index + 1}`} className={`w-full h-full ${config.objectFit} transition-transform group-hover:scale-110`} />
                                </button>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-red-500 p-1">Falha</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AiAssetGeneratorModal;