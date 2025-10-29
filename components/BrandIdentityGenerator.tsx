import React, { useState, useEffect, useRef } from 'react';
import { generateLogos, generateBanners } from '../services/geminiService';

interface BrandIdentityGeneratorProps {
  brandingPrompt: string;
  sourceImage: { base64: string; mimeType: string; };
}

// --- Helper Components ---
const Loader: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
        <div className={`${small ? 'w-8 h-8 border-2' : 'w-12 h-12 border-4'} border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin`}></div>
    </div>
);

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);


const AssetGrid: React.FC<{ assets: (string | null)[], assetType: 'logo' | 'banner', prompt: string }> = ({ assets, assetType, prompt }) => {
    if (assets.length === 0) return null;
    
    const aspectClass = assetType === 'logo' ? 'aspect-square' : 'aspect-video';
    const objectFitClass = assetType === 'logo' ? 'object-contain p-2' : 'object-cover';

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-center mb-4 capitalize">{assetType}s Gerados</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {assets.map((asset, index) => (
                    <div key={`${assetType}-${index}`} className={`${aspectClass} rounded-lg border border-[var(--border-light)] dark:border-[var(--border-dark)] overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105`}>
                        {asset === 'loading' ? <Loader small /> : asset ? (
                            <a href={`data:image/png;base64,${asset}`} download={`${assetType}_${prompt.substring(0,10)}_${index + 1}.png`}>
                                <img src={`data:image/png;base64,${asset}`} alt={`${assetType} gerado ${index + 1}`} className={`w-full h-full ${objectFitClass}`} />
                            </a>
                        ) : <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-red-500 p-2 text-center">Falha</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};


const BrandIdentityGenerator: React.FC<BrandIdentityGeneratorProps> = ({ brandingPrompt, sourceImage }) => {
    const [logoPrompt, setLogoPrompt] = useState('');
    const [isGeneratingLogos, setIsGeneratingLogos] = useState(false);
    const [logosError, setLogosError] = useState<string | null>(null);
    const [generatedLogos, setGeneratedLogos] = useState<(string | null)[]>([]);

    const [bannerPrompt, setBannerPrompt] = useState('');
    const [isGeneratingBanners, setIsGeneratingBanners] = useState(false);
    const [bannersError, setBannersError] = useState<string | null>(null);
    const [generatedBanners, setGeneratedBanners] = useState<(string | null)[]>([]);
    const [referenceImage, setReferenceImage] = useState<{ base64: string; mimeType: string; dataUrl: string; } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLogoPrompt(brandingPrompt);
        setBannerPrompt(brandingPrompt);
    }, [brandingPrompt]);

    useEffect(() => {
        if (sourceImage) {
            setReferenceImage({ ...sourceImage, dataUrl: `data:${sourceImage.mimeType};base64,${sourceImage.base64}` });
        }
    }, [sourceImage]);

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
        reader.onerror = () => setBannersError("Falha ao ler o arquivo de imagem de referência.");
    };
    
    const handleGenerateLogos = async () => {
        if (!logoPrompt.trim()) { setLogosError("Por favor, forneça uma descrição para a sua marca."); return; }
        setIsGeneratingLogos(true);
        setLogosError(null);
        setGeneratedLogos(Array(10).fill('loading'));
        try {
            const assets = await generateLogos(logoPrompt);
            setGeneratedLogos(assets);
        } catch (err) {
            const error = err as Error;
            setLogosError(error.message || 'Ocorreu um erro desconhecido ao gerar os logos.');
            setGeneratedLogos([]);
        } finally { setIsGeneratingLogos(false); }
    };

    const handleGenerateBanners = async () => {
        if (!bannerPrompt.trim()) { setBannersError("Por favor, forneça uma descrição para a sua marca."); return; }
        setIsGeneratingBanners(true);
        setBannersError(null);
        setGeneratedBanners(Array(10).fill('loading'));
        try {
            const assets = await generateBanners(bannerPrompt, referenceImage);
            setGeneratedBanners(assets);
        } catch (err) {
            const error = err as Error;
            setBannersError(error.message || 'Ocorreu um erro desconhecido ao gerar os banners.');
            setGeneratedBanners([]);
        } finally { setIsGeneratingBanners(false); }
    };

    return (
        <section>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Passo 4: Crie a Identidade da Marca</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">
                Crie logos e banners profissionais para estabelecer uma identidade visual forte e consistente.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] p-6">
                    <h3 className="text-2xl font-bold text-center mb-4">Gerador de Logo Profissional</h3>
                    <textarea
                        value={logoPrompt}
                        onChange={(e) => setLogoPrompt(e.target.value)}
                        placeholder="Ex: Um logo minimalista para uma marca de café chamada 'Aroma Celestial'"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300 resize-none"
                        rows={3}
                        disabled={isGeneratingLogos}
                    />
                    <button
                        onClick={handleGenerateLogos}
                        className="mt-4 w-full px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
                        disabled={isGeneratingLogos}
                    >
                        {isGeneratingLogos ? 'Gerando Logos...' : 'Gerar 10 Logos'}
                    </button>
                    {logosError && <p className="mt-4 text-sm text-red-500 text-center">{logosError}</p>}
                    <AssetGrid assets={generatedLogos} assetType="logo" prompt={logoPrompt} />
                </div>

                <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] p-6">
                    <h3 className="text-2xl font-bold text-center mb-4">Gerador de Banners (16:9)</h3>
                    <textarea
                        value={bannerPrompt}
                        onChange={(e) => setBannerPrompt(e.target.value)}
                        placeholder="Ex: Banner para uma promoção de inverno na 'Aroma Celestial'"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300 resize-none"
                        rows={3}
                        disabled={isGeneratingBanners}
                    />
                    <div className="mt-4">
                        <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleImageUpload} className="hidden" disabled={isGeneratingBanners}/>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isGeneratingBanners}
                            className="w-full px-4 py-3 border-2 border-dashed border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg text-gray-500 dark:text-gray-400 hover:border-[var(--primary-accent)] dark:hover:border-[var(--primary-accent)] hover:text-[var(--primary-accent)] dark:hover:text-[var(--primary-accent)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center bg-gray-50/50 dark:bg-black/20"
                        >
                            <UploadIcon className="h-5 w-5 mr-2"/>
                            <span>Imagem de Referência (Opcional)</span>
                        </button>
                        {referenceImage && (
                            <div className="mt-2 relative w-full max-w-xs mx-auto rounded-md shadow-sm overflow-hidden p-1 bg-gray-100 dark:bg-gray-900/50">
                                <img src={referenceImage.dataUrl} alt="Referência" className="w-full rounded-sm" />
                                <button onClick={() => setReferenceImage(null)} disabled={isGeneratingBanners} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black">&times;</button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleGenerateBanners}
                        className="mt-4 w-full px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
                        disabled={isGeneratingBanners}
                    >
                        {isGeneratingBanners ? 'Gerando Banners...' : 'Gerar 10 Banners'}
                    </button>
                    {bannersError && <p className="mt-4 text-sm text-red-500 text-center">{bannersError}</p>}
                    <AssetGrid assets={generatedBanners} assetType="banner" prompt={bannerPrompt} />
                </div>
            </div>
        </section>
    );
};

export default BrandIdentityGenerator;
