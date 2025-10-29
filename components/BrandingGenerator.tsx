import React, { useState, useRef } from 'react';
import { generateBrandingAssets } from '../services/geminiService';

interface BrandingGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const AssetLoader: React.FC = () => (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const BrandingGenerator: React.FC<BrandingGeneratorProps> = ({ prompt, setPrompt }) => {
    const [referenceImage, setReferenceImage] = useState<{ base64: string; mimeType: string; dataUrl: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedAssets, setGeneratedAssets] = useState<{ logos: (string | null)[], shopeeBanners: (string | null)[], facebookBanners: (string | null)[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const [mimeTypePart, base64Part] = dataUrl.split(';base64,');
            const mimeType = mimeTypePart.split(':')[1];
            setReferenceImage({ base64: base64Part, mimeType, dataUrl });
        };
        reader.onerror = () => {
          setError("Falha ao ler o arquivo de imagem de referência.");
        }
    };
    
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Por favor, forneça uma descrição para a sua marca.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedAssets({
            logos: Array(4).fill('loading'),
            shopeeBanners: referenceImage ? Array(2).fill('loading') : [],
            facebookBanners: referenceImage ? Array(2).fill('loading') : [],
        });

        try {
            const assets = await generateBrandingAssets(prompt, referenceImage);
            setGeneratedAssets(assets);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Ocorreu um erro desconhecido ao gerar o conteúdo de branding.');
            setGeneratedAssets(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-12">
            <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl overflow-hidden border border-[var(--border-light)] dark:border-[var(--border-dark)]">
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Passo 2: Crie sua Identidade Visual</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                        Descreva sua marca, adicione uma imagem de referência para os banners e crie logos e capas para suas lojas.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                         <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ex: Um logo minimalista para uma marca de café chamada 'Aroma Celestial'"
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border-2 border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300 resize-none md:h-full"
                            rows={4}
                            disabled={isLoading}
                        />
                        <div className="flex flex-col gap-4">
                             <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="w-full px-4 py-3 border-2 border-dashed border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg text-gray-500 dark:text-gray-400 hover:border-[var(--primary-accent)] dark:hover:border-[var(--primary-accent)] hover:text-[var(--primary-accent)] dark:hover:text-[var(--primary-accent)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center bg-gray-50 dark:bg-black/20"
                                >
                                <UploadIcon className="h-5 w-5 mr-2"/>
                                <span>Imagem de Referência (Banners)</span>
                            </button>
                             {referenceImage && (
                                <div className="relative w-full max-w-xs mx-auto rounded-md shadow-sm overflow-hidden p-1 bg-gray-100 dark:bg-gray-900/50">
                                  <img src={referenceImage.dataUrl} alt="Referência" className="w-full rounded-sm" />
                                  <button onClick={() => setReferenceImage(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">&times;</button>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="mt-4">
                        <button
                            onClick={handleGenerate}
                            className="w-full px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Gerando Identidade Visual...' : 'Gerar Logos e Banners'}
                        </button>
                    </div>

                    {error && (
                         <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-200 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}

                    {generatedAssets && (
                        <>
                            {generatedAssets.logos.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold text-center mb-4">Logos Gerados</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {generatedAssets.logos.map((logo, index) => (
                                            <div key={`logo-${index}`} className="aspect-square rounded-lg border border-[var(--border-light)] dark:border-[var(--border-dark)] overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105">
                                                {logo === 'loading' ? <AssetLoader /> : logo ? (
                                                    <a href={`data:image/png;base64,${logo}`} download={`logo_${prompt.substring(0,10)}_${index + 1}.png`}>
                                                        <img src={`data:image/png;base64,${logo}`} alt={`Logo gerado ${index + 1}`} className="w-full h-full object-contain p-2" />
                                                    </a>
                                                ) : <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-red-500 p-2 text-center">Falha</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {generatedAssets.shopeeBanners.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold text-center mb-4">Banners para Shopee (2:1)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {generatedAssets.shopeeBanners.map((banner, index) => (
                                            <div key={`shopee-${index}`} className="aspect-[2/1] rounded-lg border border-[var(--border-light)] dark:border-[var(--border-dark)] overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105">
                                                {banner === 'loading' ? <AssetLoader /> : banner ? (
                                                     <a href={`data:image/png;base64,${banner}`} download={`banner_shopee_${prompt.substring(0,10)}_${index + 1}.png`}>
                                                        <img src={`data:image/png;base64,${banner}`} alt={`Banner Shopee ${index + 1}`} className="w-full h-full object-cover" />
                                                    </a>
                                                ): <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-red-500 p-2 text-center">Falha</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {generatedAssets.facebookBanners.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold text-center mb-4">Capas para Facebook (851:315)</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {generatedAssets.facebookBanners.map((banner, index) => (
                                            <div key={`facebook-${index}`} className="aspect-[851/315] rounded-lg border border-[var(--border-light)] dark:border-[var(--border-dark)] overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105">
                                                {banner === 'loading' ? <AssetLoader /> : banner ? (
                                                     <a href={`data:image/png;base64,${banner}`} download={`banner_facebook_${prompt.substring(0,10)}_${index + 1}.png`}>
                                                        <img src={`data:image/png;base64,${banner}`} alt={`Banner Facebook ${index + 1}`} className="w-full h-full object-cover" />
                                                    </a>
                                                ): <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-red-500 p-2 text-center">Falha</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandingGenerator;
