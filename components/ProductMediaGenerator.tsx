import React, { useState } from 'react';
import { generateVisualContent } from '../services/geminiService';
import type { GeneratedImage, ImageType } from '../types';

interface ProductMediaGeneratorProps {
  sourceImage: { base64: string; mimeType: string; };
}

// --- Helper Components ---
const Loader: React.FC<{ small?: boolean }> = ({ small = false }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
        <div className={`${small ? 'w-8 h-8 border-2' : 'w-12 h-12 border-4'} border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin`}></div>
    </div>
);

// --- Image Generation Logic & UI ---

const initialImageState: GeneratedImage = { base64: null, isLoading: false, error: null };

const ImageGeneratorCard: React.FC<{
    title: string;
    description: string;
    imageState: GeneratedImage;
    onGenerate: () => void;
}> = ({ title, description, imageState, onGenerate }) => (
    <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-[var(--border-light)] dark:border-[var(--border-dark)] flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
        <div className="flex-1 w-full">
            <h4 className="font-bold text-[var(--text-light)] dark:text-[var(--text-dark)]">{title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
        <div className="w-full sm:w-32 md:w-48 h-32 flex-shrink-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-[var(--border-light)] dark:border-[var(--border-dark)] relative group">
            {imageState.isLoading && <Loader small />}
            {imageState.error && <p className="text-xs text-red-500 text-center p-2">{imageState.error}</p>}
            {imageState.base64 && (
                <a href={`data:image/png;base64,${imageState.base64}`} download={`${title.replace(/\s+/g, '_')}.png`} className="w-full h-full">
                    <img src={`data:image/png;base64,${imageState.base64}`} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Download
                    </div>
                </a>
            )}
        </div>
        <button 
            onClick={onGenerate} 
            disabled={imageState.isLoading}
            className="w-full sm:w-auto px-5 py-2.5 gradient-bg text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-sm transform hover:scale-105"
        >
            {imageState.isLoading ? 'Aguarde...' : 'Gerar'}
        </button>
    </div>
);

// --- Definitions for different image types ---
type VisualMediaItem = { id: ImageType; title: string; description: string; prompt: string; };
type VisualMediaCategory = { categoryTitle: string; items: VisualMediaItem[]; };

const visualMediaCategories: VisualMediaCategory[] = [
    {
        categoryTitle: "Imagens de Produto Profissionais",
        items: [
            { id: 'white_background', title: "Fundo Branco (Marketplace)", description: "Ideal para Amazon, Mercado Livre. Remove o fundo e cria uma imagem limpa.", prompt: "Keeping the original product's exact position, angle, and composition, remove the background completely and replace it with a clean, professional, solid white background. The product should be perfectly lit. Generate a photorealistic 4K image." },
            { id: 'instagram_post_promo', title: "Post Instagram (1:1)", description: "Imagem de lifestyle, quadrada, com espaço para adicionar texto promocional.", prompt: "Using the exact product from the original image, place it into a new scene for an Instagram post (1:1 aspect ratio). The product's angle, lighting, and composition must remain identical to the original. Create a visually appealing lifestyle photo around it, featuring a person happily using or interacting with the product. Leave empty space where promotional text could be added later." },
            { id: 'facebook_post_ad', title: "Anúncio para Facebook (1.91:1)", description: "Imagem horizontal otimizada para anúncios, com espaço para chamada de ação (CTA).", prompt: "Using the exact product from the original image, place it into a new scene for a Facebook ad (1.91:1 aspect ratio). The product's appearance, angle, and composition must remain identical to the original. The new scene should be eye-catching and show a person enjoying the benefits of the product, with clean space for a call-to-action to be added later." },
        ]
    },
    {
        categoryTitle: "Mockups Realistas",
        items: [
            { id: 'mockup_with_model_lifestyle', title: "Mockup com Modelo (Uso Cotidiano)", description: "Mostra o produto sendo usado em um cenário do dia a dia para criar conexão.", prompt: "Recreate the original image, keeping the product's composition, angle, and appearance exactly the same. Place this unchanged product into a realistic lifestyle mockup showing it being used by a person in a home environment. The scene should feel authentic and relatable. The image aspect ratio should be 4:5." },
            { id: 'mockup_product_focused', title: "Mockup Foco no Produto", description: "Produto em um ambiente estilizado (mármore, madeira) com iluminação dramática.", prompt: "Keeping the product's exact appearance and composition from the original image, place it on a stylish, minimalist surface (like marble or wood). Enhance the scene with dramatic lighting and realistic shadows to create a premium feel. This is a hero shot." },
        ]
    },
    {
        categoryTitle: "Banners e Mídias Verticais",
        items: [
            { id: 'banner_promo_coupon', title: "Banner Promocional (16:9)", description: "Banner para topo de site ou anúncios, com área para um código de cupom.", prompt: "Create a compelling promotional banner (16:9 aspect ratio). The banner must feature the product exactly as it appears in the original image, preserving its composition and angle. Design an eye-catching background around it, with a clear area where a coupon code can be added later." },
            { id: 'banner_facebook_cover', title: "Capa para Facebook", description: "Banner largo (formato ~2.7:1) para a capa da sua página do Facebook.", prompt: "Create a wide banner image for a Facebook cover photo (approximately 2.7:1 aspect ratio). Take the product from the original image, keeping its composition and appearance identical, and place it prominently on the right side of the banner. The overall design should be clean and professional, with empty space on the left for text and profile elements to be added." },
            { id: 'vertical_tiktok_reels', title: "Mídia para TikTok/Reels (9:16)", description: "Imagem vertical que simula um frame de vídeo, otimizada para engajamento.", prompt: "Create a high-energy, visually engaging image for a TikTok video or Instagram Reel (9:16 aspect ratio). The image must feature the product exactly as it is in the original photo, maintaining its composition perfectly. Build a scene around it with a person interacting with the product in a fun and dynamic way. The style should be modern and trendy, with empty space for text overlays." },
            { id: 'vertical_whatsapp_status', title: "Status para WhatsApp (9:16)", description: "Imagem vertical para compartilhar ofertas e novidades diretamente no Status.", prompt: "Create a clean and clear image for a WhatsApp Status update (9:16 aspect ratio). The image must showcase the product with its original composition and angle perfectly preserved. Place it against a simple, attractive new background. Ensure there is plenty of empty space for adding promotional text later." }
        ]
    },
    {
        categoryTitle: "Efeitos e Mídias Dinâmicas",
        items: [
            { id: 'effect_3d_shadow', title: "Efeito Sombra Realista", description: "Adiciona uma sombra 3D sutil para dar profundidade e realismo ao produto.", prompt: "Take the original image and, without altering the product or its composition in any way, add a realistic, soft 3D shadow underneath it to create a sense of depth and make it pop from the background." },
            { id: 'effect_floating', title: "Efeito Flutuante", description: "Faz o produto parecer que está flutuando, adicionando um toque moderno.", prompt: "Take the original image and, keeping the product's composition identical, place it on a clean, simple background and add a subtle shadow effect directly beneath it to create a modern 'floating' illusion." },
        ]
    },
    {
        categoryTitle: "Conteúdos Educativos e Complementares",
        items: [
            { id: 'infographic_benefits', title: "Infográfico Simples de Benefícios", description: "Imagem (1:1) com ícones e espaço para destacar 3 benefícios do produto.", prompt: "Create a simple, visually appealing infographic template for an Instagram post (1:1 aspect ratio). Feature the product from the original image, maintaining its exact composition. Arrange placeholders for three key benefits around the product, using modern icons, but without any text. Leave clean areas for text to be added later." },
            { id: 'youtube_thumbnail', title: "Thumbnail para YouTube (16:9)", description: "Cria uma thumbnail otimizada para cliques (CTR) com espaço para título.", prompt: "Generate a high-click-through-rate (CTR) YouTube thumbnail (16:9 aspect ratio). The thumbnail must feature the product exactly as it appears in the original image, with identical composition. Place a person with an expressive, excited, or surprised facial expression next to the product. The overall image should be vibrant and high-contrast, with significant empty space for a catchy title to be added later." }
        ]
    }
];

// --- Main Component ---
const ProductMediaGenerator: React.FC<ProductMediaGeneratorProps> = ({ sourceImage }) => {
    const [generatedImages, setGeneratedImages] = useState<Record<ImageType, GeneratedImage>>({
      white_background: { ...initialImageState }, instagram_post_promo: { ...initialImageState }, facebook_post_ad: { ...initialImageState },
      instagram_story_promo: { ...initialImageState }, mockup_with_model_lifestyle: { ...initialImageState }, mockup_with_model_professional: { ...initialImageState },
      mockup_product_focused: { ...initialImageState }, mockup_close_up: { ...initialImageState }, banner_promo_coupon: { ...initialImageState },
      banner_seasonal_bf: { ...initialImageState }, banner_facebook_cover: { ...initialImageState }, template_instagram_post: { ...initialImageState },
      template_instagram_story: { ...initialImageState }, vertical_tiktok_reels: { ...initialImageState }, vertical_whatsapp_status: { ...initialImageState },
      effect_3d_shadow: { ...initialImageState }, effect_floating: { ...initialImageState }, infographic_benefits: { ...initialImageState }, youtube_thumbnail: { ...initialImageState },
    });

    const handleGenerateProductImage = async (type: ImageType, prompt: string) => {
        setGeneratedImages(prev => ({ ...prev, [type]: { base64: null, isLoading: true, error: null } }));
        try {
            const base64Result = await generateVisualContent(sourceImage.base64, sourceImage.mimeType, prompt);
            setGeneratedImages(prev => ({ ...prev, [type]: { base64: base64Result, isLoading: false, error: null } }));
        } catch (err) {
            const error = err as Error;
            setGeneratedImages(prev => ({ ...prev, [type]: { base64: null, isLoading: false, error: error.message } }));
        }
    };

    return (
        <section>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Passo 3: Gere Mídia de Produto</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">
              Use a imagem original do seu produto para criar uma variedade de mídias para marketplaces, redes sociais e anúncios.
            </p>

            <div className="space-y-8">
                {visualMediaCategories.map(category => (
                    <div key={category.categoryTitle}>
                        <h3 className="text-xl font-semibold mb-4 text-[var(--text-light)] dark:text-[var(--text-dark)] border-b pb-2 border-[var(--border-light)] dark:border-[var(--border-dark)]">{category.categoryTitle}</h3>
                        <div className="space-y-4">
                            {category.items.map(item => (
                                <ImageGeneratorCard 
                                    key={item.id}
                                    title={item.title}
                                    description={item.description}
                                    imageState={generatedImages[item.id]}
                                    onGenerate={() => handleGenerateProductImage(item.id, item.prompt)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductMediaGenerator;
