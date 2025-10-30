// Fix: Create the NotificationGenerator.tsx component file which was missing.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { EventType, StatusBarData, NotificationData } from '../types';
import AiAssetGeneratorModal from './AiAssetGeneratorModal';
import { generateSingleNotificationImage } from '../services/geminiService';

// --- Default Data & Assets ---
const defaultStatusBar: StatusBarData = { time: '14:27', signal: 'wifi', battery: '86%' };

const eventTypes: EventType[] = ["Venda Aprovada", "Pix Gerado", "Pedido Enviado", "Venda Cancelada", "Pix Expirado"];

const eventConfigs: { [key in EventType]: { accentColor: string, defaultProduct: string } } = {
    "Venda Aprovada": { accentColor: "#22c55e", defaultProduct: "Curso de Marketing Digital" },
    "Pix Gerado": { accentColor: "#3b82f6", defaultProduct: "E-book 'Vendas Online'" },
    "Pedido Enviado": { accentColor: "#f97316", defaultProduct: "Kit de Ferramentas Essenciais" },
    "Venda Cancelada": { accentColor: "#ef4444", defaultProduct: "Mentoria Individual" },
    "Pix Expirado": { accentColor: "#6b7280", defaultProduct: "Template Exclusivo" },
};

const deviceFrames = [
    { brand: 'Apple', models: ['iPhone 15 Pro (Titânio Natural)', 'iPhone 15 Pro (Titânio Azul)', 'iPhone 15 (Preto)', 'iPhone 15 (Rosa)', 'iPhone SE (Preto)'] },
    { brand: 'Samsung', models: ['Samsung Galaxy S24 Ultra (Cinza Titânio)', 'Samsung Galaxy S24 (Preto)', 'Samsung Galaxy Z Fold 5 (Azul Claro)', 'Samsung Galaxy Z Flip 5 (Creme)'] },
    { brand: 'Google', models: ['Google Pixel 8 Pro (Obsidian)', 'Google Pixel 8 (Hazel)', 'Google Pixel Fold (Porcelain)'] },
    { brand: 'Genérico', models: ['Smartphone Android Genérico (Preto)'] },
];

const defaultAppIcons = [
    { name: 'Nenhum', svg: '' },
    { name: 'Seta para Cima (Verde)', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m-7-7l7-7 7 7"/></svg>` },
    { name: 'Seta para Baixo (Vermelha)', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-7 7l7 7 7-7"/></svg>` },
    { name: 'Checkmark (Verde)', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`},
    { name: 'X (Vermelho)', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>` },
    { name: 'Carrinho de Compras', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>` },
    { name: 'Sino', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>` }
];

const defaultBg = {
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==",
    mimeType: "image/png"
};

// --- Type Definitions ---
type SimulatorType = 'framed' | 'frameless' | 'square';
type CustomAsset = { base64: string; mimeType: string; dataUrl: string; };

// --- Main Component ---
export const NotificationGenerator: React.FC = () => {
    // State for notification queue and editor
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [eventType, setEventType] = useState<EventType>("Venda Aprovada");
    const [value, setValue] = useState('R$ 1.297,00');
    const [product, setProduct] = useState(eventConfigs["Venda Aprovada"].defaultProduct);
    const [client, setClient] = useState('João da Silva');
    
    // State for screen customization
    const [deviceFrame, setDeviceFrame] = useState(deviceFrames[0].models[0]);
    const [statusBar] = useState<StatusBarData>(defaultStatusBar);
    const [customAppIcon, setCustomAppIcon] = useState<CustomAsset | null>(null);
    const [defaultAppIcon, setDefaultAppIcon] = useState(defaultAppIcons[1].svg);
    const [customBg, setCustomBg] = useState<CustomAsset | null>(null);
    
    // State for async operations
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [assetTypeToGenerate, setAssetTypeToGenerate] = useState<'appIcon' | null>(null);
    const [downloadingSimulator, setDownloadingSimulator] = useState<SimulatorType | null>(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const bgFileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setProduct(eventConfigs[eventType].defaultProduct);
    }, [eventType]);

    const handleAddNotification = () => {
        const newNotification: NotificationData = {
            eventType, value, product, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            client, paymentMethod: 'pix', paymentLogoSvg: '', accentColor: eventConfigs[eventType].accentColor
        };
        setNotifications(prev => [...prev, newNotification]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (asset: CustomAsset) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            const [mimeTypePart, base64Part] = dataUrl.split(';base64,');
            setter({ base64: base64Part, mimeType: mimeTypePart.split(':')[1], dataUrl });
        };
        reader.readAsDataURL(file);
    };

    const handleAiAssetSelect = (data: CustomAsset) => {
        if (assetTypeToGenerate === 'appIcon') {
            setCustomAppIcon(data);
            setDefaultAppIcon(''); // Clear default selection
        }
        setIsAiModalOpen(false);
    };

    const handleDownloadSimulator = async (type: SimulatorType) => {
        if (notifications.length === 0) {
            setDownloadError("Adicione pelo menos uma notificação à fila antes de baixar.");
            setTimeout(() => setDownloadError(null), 3000);
            return;
        }
        setDownloadingSimulator(type);
        setDownloadError(null);
        try {
            const appIconPayload = customAppIcon 
                ? { base64: customAppIcon.base64, mimeType: customAppIcon.mimeType } 
                : null;
            
            const backgroundPayload = customBg 
                ? { base64: customBg.base64, mimeType: customBg.mimeType } 
                : defaultBg;

            const base64Png = await generateSingleNotificationImage({
                notifications, statusBar, appIcon: appIconPayload, background: backgroundPayload, deviceFrame, frameType: type
            });

            // Convert PNG to JPG and trigger download
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                if(ctx){
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                    const link = document.createElement('a');
                    link.href = jpgDataUrl;
                    link.download = `notificacao_${type}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            };
            img.src = `data:image/png;base64,${base64Png}`;

        } catch (err) {
            const e = err as Error;
            setDownloadError(e.message || "Ocorreu um erro desconhecido.");
        } finally {
            setDownloadingSimulator(null);
        }
    };
    
    const currentAppIcon = customAppIcon?.dataUrl || (defaultAppIcon ? `data:image/svg+xml;base64,${btoa(defaultAppIcon)}` : null);
    const currentBgUrl = customBg?.dataUrl || `data:image/png;base64,${defaultBg.base64}`;

    return (
    <>
        <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)]">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
                {/* --- CONTROLS --- */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Editor */}
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20 border border-[var(--border-light)] dark:border-[var(--border-dark)] space-y-3">
                         <h3 className="text-lg font-bold">Editor de Notificação</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tipo de Evento</label>
                            <select value={eventType} onChange={e => setEventType(e.target.value as EventType)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-md focus:ring-1 focus:ring-[var(--primary-accent)] outline-none text-sm">
                                {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Valor</label>
                                <input type="text" value={value} onChange={e => setValue(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-md focus:ring-1 focus:ring-[var(--primary-accent)] outline-none text-sm" placeholder="R$ 1.297,00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Produto</label>
                                <input type="text" value={product} onChange={e => setProduct(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-md focus:ring-1 focus:ring-[var(--primary-accent)] outline-none text-sm" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
                            <input type="text" value={client} onChange={e => setClient(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-md focus:ring-1 focus:ring-[var(--primary-accent)] outline-none text-sm" placeholder="João da Silva" />
                        </div>
                        <button onClick={handleAddNotification} className="w-full px-4 py-2 gradient-bg text-white font-bold rounded-lg hover:opacity-90 text-sm">Adicionar à Fila</button>
                    </div>

                    {/* Fila */}
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20 border border-[var(--border-light)] dark:border-[var(--border-dark)]">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-lg font-bold">Fila para Geração</h3>
                             <button onClick={() => setNotifications([])} className="text-xs text-gray-500 hover:text-red-500">Limpar</button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {notifications.length > 0 ? notifications.map((n, i) => (
                                <div key={i} className="text-xs p-2 rounded bg-white dark:bg-gray-800 flex justify-between items-center">
                                    <span><b>{n.eventType}</b> - {n.product}</span>
                                    <button onClick={() => setNotifications(p => p.filter((_, idx) => idx !== i))} className="text-red-500 text-lg">&times;</button>
                                </div>
                            )) : <p className="text-xs text-gray-500 text-center py-4">A fila está vazia.</p>}
                        </div>
                    </div>
                    
                    {/* Customização */}
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-black/20 border border-[var(--border-light)] dark:border-[var(--border-dark)] space-y-3">
                         <h3 className="text-lg font-bold">Customização da Tela</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Moldura do Celular</label>
                            <select value={deviceFrame} onChange={e => setDeviceFrame(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-md focus:ring-1 focus:ring-[var(--primary-accent)] outline-none text-sm">
                                {deviceFrames.map(group => (
                                    <optgroup key={group.brand} label={group.brand}>
                                        {group.models.map(model => <option key={model} value={model}>{model}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ícone do App</label>
                                <select value={defaultAppIcon} onChange={e => {setDefaultAppIcon(e.target.value); setCustomAppIcon(null)}} className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-md focus:ring-1 focus:ring-[var(--primary-accent)] outline-none text-sm">
                                    {defaultAppIcons.map(icon => <option key={icon.name} value={icon.svg}>{icon.name}</option>)}
                                </select>
                            </div>
                             <div className="self-end grid grid-cols-2 gap-1">
                                <button onClick={() => { setAssetTypeToGenerate('appIcon'); setIsAiModalOpen(true); }} className="px-2 py-2 text-xs font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">Gerar IA</button>
                                <button onClick={() => { setAssetTypeToGenerate('appIcon'); document.getElementById('custom-icon-upload')?.click() }} className="px-2 py-2 text-xs font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">Upload</button>
                                <input id="custom-icon-upload" type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, setCustomAppIcon)} />
                             </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">Plano de Fundo</label>
                             <input type="file" ref={bgFileInputRef} className="hidden" accept="image/*" onChange={e => handleFileChange(e, setCustomBg)} />
                             <button onClick={() => bgFileInputRef.current?.click()} className="w-full px-3 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md">{customBg ? 'Alterar Imagem' : 'Carregar Imagem'}</button>
                        </div>
                    </div>
                     {downloadError && <p className="text-sm text-red-500 text-center">{downloadError}</p>}
                </div>

                {/* --- PREVIEWS --- */}
                <div className="lg:col-span-3 flex justify-center items-start">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        <SimulatorPreview title="Com Moldura" type="framed" onDownload={handleDownloadSimulator} isLoading={downloadingSimulator === 'framed'} device={deviceFrame}>
                            <NotificationScreen notifications={notifications} statusBar={statusBar} appIconUrl={currentAppIcon} backgroundUrl={currentBgUrl} />
                        </SimulatorPreview>
                        <SimulatorPreview title="Sem Moldura" type="frameless" onDownload={handleDownloadSimulator} isLoading={downloadingSimulator === 'frameless'}>
                            <NotificationScreen notifications={notifications} statusBar={statusBar} appIconUrl={currentAppIcon} backgroundUrl={currentBgUrl} />
                        </SimulatorPreview>
                        <SimulatorPreview title="Quadro Reto" type="square" onDownload={handleDownloadSimulator} isLoading={downloadingSimulator === 'square'}>
                            <NotificationScreen notifications={notifications} statusBar={statusBar} appIconUrl={currentAppIcon} backgroundUrl={currentBgUrl} />
                        </SimulatorPreview>
                    </div>
                </div>
            </div>
        </div>

        <AiAssetGeneratorModal 
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            onSelect={handleAiAssetSelect}
            assetType={assetTypeToGenerate}
        />
    </>
    );
};

// --- Sub-components for Preview ---

const SimulatorPreview: React.FC<{title: string, type: SimulatorType, onDownload: (type: SimulatorType) => void, isLoading: boolean, children: React.ReactNode, device?: string}> = ({title, type, onDownload, isLoading, children, device}) => {
    let containerClass = "w-full max-w-[280px] mx-auto transition-all duration-300 ";
    switch (type) {
        case 'framed': containerClass += "p-2.5 bg-zinc-800 rounded-[40px] shadow-2xl border-2 border-zinc-700"; break;
        case 'frameless': containerClass += "rounded-[32px] overflow-hidden shadow-lg"; break;
        case 'square': containerClass += "shadow-lg border border-gray-300 dark:border-gray-700"; break;
    }

    const deviceSpecificStyles = {
        notch: type === 'framed' && device?.includes('iPhone') && !device?.includes('SE'),
        dynamicIsland: type === 'framed' && device?.includes('iPhone 15'),
        punchHole: type === 'framed' && (device?.includes('Samsung') || device?.includes('Google')),
    };
    
    return (
        <div className="flex flex-col items-center gap-3">
            <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
            <div className={containerClass}>
                <div className={`relative bg-black overflow-hidden w-full aspect-[9/19.5] ${type === 'framed' ? 'rounded-[32px]' : ''}`}>
                    {deviceSpecificStyles.dynamicIsland && <div className="absolute top-[14px] left-1/2 -translate-x-1/2 h-[18px] w-[80px] bg-black rounded-full z-20"></div>}
                    {deviceSpecificStyles.punchHole && <div className="absolute top-[18px] left-1/2 -translate-x-1/2 h-[8px] w-[8px] bg-black rounded-full z-20 border border-zinc-700"></div>}
                    {children}
                </div>
            </div>
            <button onClick={() => onDownload(type)} disabled={isLoading} className="w-full max-w-[280px] mt-1 px-4 py-2 text-sm font-bold gradient-bg text-white rounded-lg hover:opacity-90 disabled:opacity-50">
                {isLoading ? 'Gerando...' : 'Download JPG'}
            </button>
        </div>
    )
};

const NotificationScreen: React.FC<{notifications: NotificationData[], statusBar: StatusBarData, appIconUrl: string | null, backgroundUrl: string}> = React.memo(({notifications, statusBar, appIconUrl, backgroundUrl}) => {
    return (
        <div className="absolute inset-0 text-white font-sans text-xs">
            {/* Background */}
            <img src={backgroundUrl} className="absolute inset-0 w-full h-full object-cover" alt="background"/>
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-9 px-6 flex justify-between items-center z-10 pt-2">
                <span className="font-bold text-xs w-12 text-center">{statusBar.time}</span>
                <div className="flex items-center gap-1.5 text-xs">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span>{statusBar.battery}</span>
                </div>
            </div>

            {/* Notifications */}
            <div className="absolute top-12 left-2 right-2 space-y-2">
                {notifications.slice(-4).map((n, i) => (
                    <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3">
                         <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-1.5">
                                {appIconUrl && <img src={appIconUrl} className="w-4 h-4 rounded-sm" alt="App Icon"/>}
                                <span className="text-xs font-semibold">Minha Loja</span>
                            </div>
                            <span className="text-xs text-gray-300">{n.time}</span>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm">{n.eventType}</span>
                            <span className="font-bold text-sm" style={{color: n.accentColor}}>{n.value}</span>
                        </div>
                         {n.eventType === "Venda Aprovada" && <span className="text-green-400 text-xs font-bold">✓ Aprovado</span>}
                        <p className="text-xs text-gray-200 truncate">Produto: {n.product} | Cliente: {n.client}</p>
                    </div>
                ))}
            </div>
        </div>
    );
});