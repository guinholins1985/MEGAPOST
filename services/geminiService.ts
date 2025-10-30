// Fix: Create the geminiService.ts file to handle all Gemini API interactions.
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { GeneratedContent, NotificationData, StatusBarData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for the main content generation
const contentGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        // Conteúdo Essencial
        titles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 15 títulos de produtos chamativos e otimizados para SEO." },
        descriptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 4 descrições de produtos detalhadas, persuasivas e com foco nos benefícios." },
        productPricing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 1 sugestão de preço, incluindo uma justificativa curta. Ex: 'R$ 99,90 - Preço competitivo para o mercado'." },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 25 tags/palavras-chave relevantes para SEO e marketplaces." },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 25 hashtags populares para redes sociais (Instagram, TikTok)." },
        
        // Redes Sociais e Engajamento
        socialMediaPosts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 25 frases para posts criativos em redes sociais (Instagram, Facebook, Twitter)." },
        shortVideoScripts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 3 roteiros curtos (gancho, desenvolvimento, CTA) para vídeos (Reels, TikTok)." },
        fictionalTestimonials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 3 depoimentos fictícios de clientes satisfeitos, destacando um benefício cada." },
        socialMediaBios: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 sugestões de bio para perfis de redes sociais (Instagram/TikTok) focadas no produto." },
        
        // SEO Avançado e Marketing de Conteúdo
        longTailKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 12 palavras-chave de cauda longa para blogs e SEO, focadas em intenção de compra." },
        metaTagsAndAltTexts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 7 sugestões de meta descriptions e alt texts para imagens, otimizados para SEO." },
        blogArticles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 4 ideias de títulos e um breve resumo para posts de blog otimizados para SEO." },
        buyingGuides: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 ideias para guias de compra, comparando o produto com alternativas ou explicando como escolher." },
        faqs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 7 perguntas frequentes (FAQ) com respostas claras e concisas sobre o produto." },

        // Campanhas de Vendas e Promoções
        promotionalPhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 25 frases promocionais de impacto, focadas em gatilhos mentais (escassez, urgência)." },
        marketingEmails: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 4 textos para e-mail marketing (lançamento, promoção, nutrição, recuperação de carrinho)." },
        priceVariations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 3 variações de preço para testes A/B ou promoções." },
        discountCoupons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 3 ideias de cupons de desconto (ex: 'PRIMEIRACOMPRA10')." },
        countdownPromos: { type: Type.ARRAY, items: { type: 'STRING' }, description: "Array com 2 textos para promoções com contagem regressiva." },
        popupCopies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 textos curtos para pop-ups de site." },
        adCopies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 7 textos curtos e diretos (copy) para anúncios pagos (Facebook Ads, Google Ads)." },
        ctas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 7 chamadas para ação (CTAs) claras e eficazes para botões e links." },
        welcomeEmails: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 textos completos para e-mails de boas-vindas para novos clientes ou leads." },
        slogans: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 7 slogans publicitários curtos e memoráveis para a marca ou produto." },
        viralHooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 7 frases de gancho (hooks) projetadas para se tornarem virais em vídeos curtos." },

        // Ferramentas Avançadas e Interativas
        landingPageCopies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 blocos de texto (headlines e CTAs) para uma landing page." },
        competitorComparisons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 pontos de comparação com um concorrente fictício." },
        interactiveQuizzes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 ideias para quizzes interativos relacionados ao produto." },
        chatbotScripts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array com 2 scripts simples para um chatbot de vendas." },
    },
};

const parseJsonResponse = (jsonString: string): GeneratedContent => {
    try {
        const parsed = JSON.parse(jsonString);
        // Ensure all fields are arrays of strings, fallback to empty array if missing
        const content: GeneratedContent = {
            titles: Array.isArray(parsed.titles) ? parsed.titles : [],
            descriptions: Array.isArray(parsed.descriptions) ? parsed.descriptions : [],
            productPricing: Array.isArray(parsed.productPricing) ? parsed.productPricing : [],
            tags: Array.isArray(parsed.tags) ? parsed.tags : [],
            hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
            socialMediaPosts: Array.isArray(parsed.socialMediaPosts) ? parsed.socialMediaPosts : [],
            shortVideoScripts: Array.isArray(parsed.shortVideoScripts) ? parsed.shortVideoScripts : [],
            fictionalTestimonials: Array.isArray(parsed.fictionalTestimonials) ? parsed.fictionalTestimonials : [],
            socialMediaBios: Array.isArray(parsed.socialMediaBios) ? parsed.socialMediaBios : [],
            longTailKeywords: Array.isArray(parsed.longTailKeywords) ? parsed.longTailKeywords : [],
            metaTagsAndAltTexts: Array.isArray(parsed.metaTagsAndAltTexts) ? parsed.metaTagsAndAltTexts : [],
            blogArticles: Array.isArray(parsed.blogArticles) ? parsed.blogArticles : [],
            buyingGuides: Array.isArray(parsed.buyingGuides) ? parsed.buyingGuides : [],
            faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
            promotionalPhrases: Array.isArray(parsed.promotionalPhrases) ? parsed.promotionalPhrases : [],
            marketingEmails: Array.isArray(parsed.marketingEmails) ? parsed.marketingEmails : [],
            priceVariations: Array.isArray(parsed.priceVariations) ? parsed.priceVariations : [],
            discountCoupons: Array.isArray(parsed.discountCoupons) ? parsed.discountCoupons : [],
            countdownPromos: Array.isArray(parsed.countdownPromos) ? parsed.countdownPromos : [],
            popupCopies: Array.isArray(parsed.popupCopies) ? parsed.popupCopies : [],
            adCopies: Array.isArray(parsed.adCopies) ? parsed.adCopies : [],
            ctas: Array.isArray(parsed.ctas) ? parsed.ctas : [],
            welcomeEmails: Array.isArray(parsed.welcomeEmails) ? parsed.welcomeEmails : [],
            slogans: Array.isArray(parsed.slogans) ? parsed.slogans : [],
            viralHooks: Array.isArray(parsed.viralHooks) ? parsed.viralHooks : [],
            landingPageCopies: Array.isArray(parsed.landingPageCopies) ? parsed.landingPageCopies : [],
            competitorComparisons: Array.isArray(parsed.competitorComparisons) ? parsed.competitorComparisons : [],
            interactiveQuizzes: Array.isArray(parsed.interactiveQuizzes) ? parsed.interactiveQuizzes : [],
            chatbotScripts: Array.isArray(parsed.chatbotScripts) ? parsed.chatbotScripts : [],
            groundingChunks: [],
        };
        return content;
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", e);
        throw new Error("A resposta da IA não estava no formato JSON esperado. Tente novamente.");
    }
}


export const generateContentFromImage = async (base64: string, mimeType: string): Promise<GeneratedContent> => {
    const model = 'gemini-2.5-flash';
    
    const imagePart = { inlineData: { data: base64, mimeType } };
    const textPart = {
        text: `Analise a imagem deste produto e gere uma campanha de marketing completa em português do Brasil. O objetivo é vender este produto em marketplaces como Shopee e em redes sociais. Forneça o conteúdo estritamente no formato JSON especificado no schema.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: contentGenerationSchema,
            }
        });

        const jsonString = response.text;
        const parsedContent = parseJsonResponse(jsonString);
        return parsedContent;
    } catch (error) {
        console.error("Error generating content from image:", error);
        throw new Error("Falha ao gerar conteúdo a partir da imagem. Verifique o console para mais detalhes.");
    }
};

export const generateContentFromUrl = async (url: string): Promise<GeneratedContent> => {
    const model = 'gemini-2.5-flash';

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `A partir da URL de produto '${url}', gere uma campanha de marketing completa em português do Brasil. O objetivo é vender este produto em marketplaces como Shopee e em redes sociais. Forneça o conteúdo estritamente no formato JSON, aderindo ao schema fornecido.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: contentGenerationSchema,
            }
        });
        
        const jsonString = response.text;
        const parsedContent = parseJsonResponse(jsonString);
        
        if (response.candidates && response.candidates[0].groundingMetadata?.groundingChunks) {
            parsedContent.groundingChunks = response.candidates[0].groundingMetadata.groundingChunks;
        }

        return parsedContent;
    } catch (error) {
        console.error("Error generating content from URL:", error);
        throw new Error("Falha ao gerar conteúdo a partir do link. A URL pode estar inacessível ou o conteúdo pode ser inválido.");
    }
};

export const generateVisualContent = async (base64: string, mimeType: string, prompt: string): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("Nenhuma imagem foi gerada pela IA.");

    } catch (error) {
        console.error("Error generating visual content:", error);
        throw new Error("Falha ao gerar a mídia visual. Tente novamente.");
    }
};


const generateAssets = async (
    prompt: string, 
    style: string, 
    referenceImage: { base64: string; mimeType: string; } | null, 
    count: number,
    aspectRatio: "1:1" | "16:9"
): Promise<(string | null)[]> => {
    
    const fullPrompt = `Estilo ${style}. ${prompt}`;
    
    // If there is a reference image, use image editing model
    if (referenceImage) {
        const model = 'gemini-2.5-flash-image';
        // We can only generate one image at a time with this model
        const promises = Array(count).fill(null).map(async () => {
            try {
                const response = await ai.models.generateContent({
                    model: model,
                    contents: {
                        parts: [
                            { inlineData: { data: referenceImage.base64, mimeType: referenceImage.mimeType } },
                            { text: fullPrompt },
                        ],
                    },
                    config: {
                        responseModalities: [Modality.IMAGE],
                    },
                });
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        return part.inlineData.data;
                    }
                }
                return null;
            } catch (e) {
                console.error("Error in single image generation with reference:", e);
                return null;
            }
        });
        return Promise.all(promises);
    }
    
    // If no reference, use Imagen
    const model = 'imagen-4.0-generate-001';
    try {
        const response = await ai.models.generateImages({
            model: model,
            prompt: fullPrompt,
            config: {
                numberOfImages: count,
                outputMimeType: 'image/png', // Using PNG for potential transparency in logos
                aspectRatio: aspectRatio,
            },
        });

        return response.generatedImages.map(img => img.image.imageBytes);

    } catch (error) {
        console.error("Error generating image assets:", error);
        throw new Error("Falha ao gerar os assets visuais. Tente um prompt diferente.");
    }
};


export const generateLogos = async (prompt: string, style: string, referenceImage: { base64: string; mimeType: string; } | null): Promise<(string | null)[]> => {
    const logoPrompt = `Um logo vetorial, minimalista, com design flat, centrado em um fundo branco sólido para: ${prompt}`;
    return generateAssets(logoPrompt, style, referenceImage, 10, '1:1');
};

export const generateBanners = async (prompt: string, style: string, referenceImage: { base64: string; mimeType: string; } | null): Promise<(string | null)[]> => {
    const bannerPrompt = `Um banner promocional para web, com iluminação cinematográfica, alta resolução, 4k. O banner é sobre: ${prompt}`;
    return generateAssets(bannerPrompt, style, referenceImage, 10, '16:9');
};


export const generateImageAssets = async (prompt: string, count: number, aspectRatio: "1:1" | "9:16" = "1:1"): Promise<(string | null)[]> => {
    const model = 'imagen-4.0-generate-001';
    try {
        const response = await ai.models.generateImages({
            model: model,
            prompt: prompt,
            config: {
                numberOfImages: count,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
            },
        });

        return response.generatedImages.map(img => img.image.imageBytes);
    } catch (error) {
        console.error("Error generating image assets:", error);
        throw new Error("Falha ao gerar os assets visuais. Tente um prompt diferente.");
    }
};

// --- NOTIFICATION GENERATOR SERVICES ---

type FrameType = 'framed' | 'frameless' | 'square';
type SingleNotificationPayload = {
    notifications: NotificationData[];
    statusBar: StatusBarData;
    appIcon: { base64: string; mimeType: string; } | null;
    background: { base64: string; mimeType: string; };
    deviceFrame: string;
    frameType: FrameType;
};

const getDeviceFramePrompt = (frameType: FrameType, deviceFrame: string): string => {
    switch (frameType) {
        case 'framed':
            return `A tela deve ser renderizada dentro de um mockup fotorrealista de um '${deviceFrame}'.`;
        case 'frameless':
            return 'A imagem deve ser apenas a tela, com cantos levemente arredondados, como um print de tela.';
        case 'square':
            return 'A imagem deve ser apenas a tela, com cantos retos (90 graus), sem nenhuma moldura.';
        default:
            return '';
    }
};

const buildBasePrompt = (notifications: NotificationData[], statusBar: StatusBarData) => {
    const notificationsHtml = notifications.map(n => `
        <div class="notification" style="background-color: rgba(40, 40, 40, 0.8); backdrop-filter: blur(10px); border-radius: 20px; padding: 15px; margin-bottom: 10px; border: 1px solid rgba(80, 80, 80, 0.5);">
            <div class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 15px; font-weight: 600; color: white; margin-left: 8px;">Minha Loja</span>
                </div>
                <span style="font-size: 15px; color: #BBB;">${n.time}</span>
            </div>
            <div class="content" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <span style="font-size: 17px; font-weight: bold; color: white;">${n.eventType}</span>
                <span style="font-size: 17px; font-weight: bold; color: ${n.accentColor};">${n.value}</span>
            </div>
            <div class="details" style="font-size: 15px; color: #DDD;">
                Produto: ${n.product} | Cliente: ${n.client}
            </div>
        </div>
    `).join('');

    return `
        Gere uma imagem fotorrealista de uma tela de celular (proporção 9:19.5).
        A barra de status no topo deve mostrar "${statusBar.time}" à esquerda, e ícones de ${statusBar.signal} e bateria com ${statusBar.battery} à direita.
        Abaixo da barra de status, renderize as seguintes notificações, usando este HTML como guia para o conteúdo e estilo. O app icon deve ser exibido à esquerda do nome da loja no cabeçalho de cada notificação.
        ${notificationsHtml}
    `;
};

export const generateSingleNotificationImage = async (payload: SingleNotificationPayload): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    
    const parts: any[] = [];
    parts.push({
        text: `
            ${buildBasePrompt(payload.notifications, payload.statusBar)}
            ${getDeviceFramePrompt(payload.frameType, payload.deviceFrame)}
        `
    });

    parts.push({ inlineData: { data: payload.background.base64, mimeType: payload.background.mimeType } });
    if(payload.appIcon) {
        parts.push({ text: "Use esta imagem como o ícone do aplicativo:" });
        parts.push({ inlineData: { data: payload.appIcon.base64, mimeType: payload.appIcon.mimeType } });
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("Nenhuma imagem foi gerada pela IA.");

    } catch (error) {
        console.error("Error generating single notification image:", error);
        throw new Error("Falha ao gerar a imagem da notificação. Tente novamente.");
    }
};