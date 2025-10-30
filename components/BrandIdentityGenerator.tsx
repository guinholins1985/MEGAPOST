
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateLogos, generateBanners } from '../services/geminiService';

type ReferenceImage = {
    base64: string;
    mimeType: string;
    dataUrl: string;
}

// --- Helper Components ---
const Loader: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
        <div className={`${small ? 'w-8 h-8 border-2' : 'w-12 h-12 border-4'} border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin`}></div>
    </div>
);

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AssetGrid: React.FC<{ assets: (string | null)[], assetType: 'logo' | 'banner', prompt: string }> = ({ assets, assetType, prompt }) => {
    if (assets.length === 0) return null;
    
    const aspectClass = assetType === 'logo' ? 'aspect-square' : 'aspect-video';
    const objectFitClass = assetType === 'logo' ? 'object-contain p-2' : 'object-cover';

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-center mb-4 capitalize">{assetType}s Gerados</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {assets.map((asset, index) => (
                    <div key={`${assetType}-${index}`} className={`${aspectClass} rounded-lg border border-[var(--border-light)] dark:border-[var(--border-dark)] overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105 group relative`}>
                        {asset === 'loading' ? <Loader small /> : asset ? (
                            <>
                                <img src={`data:image/png;base64,${asset}`} alt={`${assetType} gerado ${index + 1}`} className={`w-full h-full ${objectFitClass}`} />
                                <a href={`data:image/png;base64,${asset}`} download={`${assetType}_${prompt.substring(0,10)}_${index + 1}.png`} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </a>
                            </>
                        ) : <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-red-500 p-2 text-center">Falha</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const BrandIdentityGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'logo' | 'banner'>('logo');
    
    // Logo State
    const [logoPrompt, setLogoPrompt] = useState('');
    const [logoStyle, setLogoStyle] = useState('Padrão');
    const [isGeneratingLogos, setIsGeneratingLogos] = useState(false);
    const [logosError, setLogosError] = useState<string | null>(null);
    const [generatedLogos, setGeneratedLogos] = useState<(string | null)[]>([]);
    const [logoReferenceImage, setLogoReferenceImage] = useState<ReferenceImage | null>(null);
    const logoFileInputRef = useRef<HTMLInputElement>(null);

    // Banner State
    const [bannerPrompt, setBannerPrompt] = useState('');
    const [bannerStyle, setBannerStyle] = useState('Padrão');
    const [isGeneratingBanners, setIsGeneratingBanners] = useState(false);
    const [bannersError, setBannersError] = useState<string | null>(null);
    const [generatedBanners, setGeneratedBanners] = useState<(string | null)[]>([]);
    const [bannerReferenceImage, setBannerReferenceImage] = useState<ReferenceImage | null>(null);
    const bannerFileInputRef = useRef<HTMLInputElement>(null);

    // Camera State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const brandStyles = ['Padrão', 'Minimalista', 'Moderno', 'Vintage', 'Corporativo', 'Divertido'];
    
    const stopCamera = useCallback(() => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setIsCameraOpen(false);
    }, [stream]);

    const startCamera = async () => {
      stopCamera(); 
      setIsCameraOpen(true);
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setStream(stream);
      } catch (err) {
          console.error("Camera error:", err);
          const errorSetter = activeTab === 'logo' ? setLogosError : setBannersError;
          errorSetter("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    };

    useEffect(() => {
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const [mimeTypePart, base64Part] = dataUrl.split(';base64,');
            const mimeType = mimeTypePart.split(':')[1];
            const imageSetter = activeTab === 'logo' ? setLogoReferenceImage : setBannerReferenceImage;
            imageSetter({ base64: base64Part, mimeType, dataUrl });
        };
        reader.onerror = () => {
            const errorSetter = activeTab === 'logo' ? setLogosError : setBannersError;
            errorSetter("Falha ao ler o arquivo de imagem.");
        }
    };

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const [mimeTypePart, base64Part] = dataUrl.split(';base64,');
            const mimeType = mimeTypePart.split(':')[1];
            const imageSetter = activeTab === 'logo' ? setLogoReferenceImage : setBannerReferenceImage;
            imageSetter({ base64: base64Part, mimeType, dataUrl });
            stopCamera();
        }
    };
    
    const handleGenerateLogos = async () => {
        if (!logoPrompt.trim()) { setLogosError("Por favor, forneça uma descrição para a sua marca."); return; }
        setIsGeneratingLogos(true);
        setLogosError(null);
        setGeneratedLogos(Array(10).fill('loading'));
        try {
            const assets = await generateLogos(logoPrompt, logoStyle, logoReferenceImage);
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
            const assets = await generateBanners(bannerPrompt, bannerStyle, bannerReferenceImage);
            setGeneratedBanners(assets);
        } catch (err) {
            const error = err as Error;
            setBannersError(error.message || 'Ocorreu um erro desconhecido ao gerar os banners.');
            setGeneratedBanners([]);
        } finally { setIsGeneratingBanners(false); }
    };
    
    const TabButton: React.FC<{ target: 'logo' | 'banner', children: React.ReactNode }> = ({ target, children }) => (
        <button
            onClick={() => setActiveTab(target)}
            className={`w-1/2 py-3 px-4 text-center font-semibold transition-all duration-300 flex items-center justify-center rounded-lg
            ${activeTab === target 
                ? 'gradient-bg text-white shadow-md' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
        >
            {children}
        </button>
    );

    const CameraUI = () => (
        <div className="mt-4 space-y-3">
            <div className="w-full bg-black rounded-lg overflow-hidden border border-[var(--border-dark)] shadow-lg">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto aspect-video object-cover" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
                <button onClick={handleCapture} className="w-full px-4 py-2 gradient-bg text-white font-bold rounded-lg hover:opacity-90 flex items-center justify-center shadow-md">
                    <CameraIcon/> Capturar
                </button>
                 <button onClick={stopCamera} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    Cancelar
                </button>
            </div>
        </div>
    );

    const ReferenceImageUI = ({image, onRemove}: {image: ReferenceImage | null, onRemove: () => void}) => {
        if(!image) return null;
        return (
            <div className="mt-4 relative w-full max-w-xs mx-auto rounded-md shadow-sm overflow-hidden p-1 bg-gray-100 dark:bg-gray-900/50">
                <img src={image.dataUrl} alt="Referência" className="w-full rounded-sm" />
                <button onClick={onRemove} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black">&times;</button>
            </div>
        )
    };
    
    const isGenerating = isGeneratingLogos || isGeneratingBanners;

    return (
        <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)]">
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-black/20">
                <div className="flex space-x-2 bg-gray-100 dark:bg-black/25 p-1 rounded-xl max-w-md mx-auto">
                    <TabButton target='logo'>Gerador de Logo</TabButton>
                    <TabButton target='banner'>Gerador de Banner</TabButton>
                </div>
            </div>

            <div className="p-6">
                {/* Logo Tab Content */}
                <div style={{ display: activeTab === 'logo' ? 'block' : 'none' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Descreva sua marca ou ideia</label>
                            <textarea value={logoPrompt} onChange={(e) => setLogoPrompt(e.target.value)} placeholder="Ex: Um logo para uma cafeteria chamada 'Aroma Celestial', com um grão de café e uma estrela." className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] outline-none transition-all duration-300 resize-none" rows={3} disabled={isGeneratingLogos}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estilo Visual</label>
                            <select value={logoStyle} onChange={(e) => setLogoStyle(e.target.value)} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] outline-none" disabled={isGeneratingLogos}>
                                {brandStyles.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <input type="file" accept="image/png, image/jpeg, image/webp" ref={logoFileInputRef} onChange={handleImageUpload} className="hidden" disabled={isGeneratingLogos}/>
                        <button onClick={() => logoFileInputRef.current?.click()} disabled={isGeneratingLogos} className="w-full px-3 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50">
                            <UploadIcon /> Imagem de Referência
                        </button>
                         <button onClick={startCamera} disabled={isGeneratingLogos} className="w-full px-3 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50">
                            <CameraIcon /> Usar Câmera
                        </button>
                    </div>
                    {isCameraOpen && activeTab === 'logo' ? <CameraUI /> : <ReferenceImageUI image={logoReferenceImage} onRemove={() => setLogoReferenceImage(null)} />}
                    <button onClick={handleGenerateLogos} className="mt-6 w-full px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105" disabled={isGeneratingLogos}>
                        {isGeneratingLogos ? 'Gerando Logos...' : 'Gerar 10 Logos'}
                    </button>
                    {logosError && <p className="mt-4 text-sm text-red-500 text-center">{logosError}</p>}
                    <AssetGrid assets={generatedLogos} assetType="logo" prompt={logoPrompt} />
                </div>

                {/* Banner Tab Content */}
                <div style={{ display: activeTab === 'banner' ? 'block' : 'none' }}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Descreva sua campanha ou ideia</label>
                            <textarea value={bannerPrompt} onChange={(e) => setBannerPrompt(e.target.value)} placeholder="Ex: Banner para uma promoção de inverno na 'Aroma Celestial', destacando bebidas quentes." className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] outline-none transition-all duration-300 resize-none" rows={3} disabled={isGeneratingBanners}/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estilo Visual</label>
                            <select value={bannerStyle} onChange={(e) => setBannerStyle(e.target.value)} className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] outline-none" disabled={isGeneratingBanners}>
                                {brandStyles.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <input type="file" accept="image/png, image/jpeg, image/webp" ref={bannerFileInputRef} onChange={handleImageUpload} className="hidden" disabled={isGeneratingBanners}/>
                        <button onClick={() => bannerFileInputRef.current?.click()} disabled={isGeneratingBanners} className="w-full px-3 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50">
                            <UploadIcon /> Imagem de Referência
                        </button>
                         <button onClick={startCamera} disabled={isGeneratingBanners} className="w-full px-3 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50">
                            <CameraIcon /> Usar Câmera
                        </button>
                    </div>
                    {isCameraOpen && activeTab === 'banner' ? <CameraUI /> : <ReferenceImageUI image={bannerReferenceImage} onRemove={() => setBannerReferenceImage(null)} />}
                    <button onClick={handleGenerateBanners} className="mt-6 w-full px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105" disabled={isGeneratingBanners}>
                        {isGeneratingBanners ? 'Gerando Banners...' : 'Gerar 10 Banners'}
                    </button>
                    {bannersError && <p className="mt-4 text-sm text-red-500 text-center">{bannersError}</p>}
                    <AssetGrid assets={generatedBanners} assetType="banner" prompt={bannerPrompt} />
                </div>
            </div>
        </div>
    );
};

export default BrandIdentityGenerator;
