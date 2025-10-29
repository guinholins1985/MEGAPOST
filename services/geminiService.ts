import { GoogleGenAI } from "@google/genai";
import type { GeneratedContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const commonPrompt = `
Gere o seguinte conteúdo em português do Brasil, de forma clara e organizada, usando as seções demarcadas por '###'. Seja criativo e foque em conversão.

### Títulos
15 títulos de marketing chamativos e otimizados para SEO. Formate como uma lista numerada.

### Descrições
3 descrições de produto persuasivas, que comuniquem alto valor. Formate como uma lista numerada.

### Preço Sugerido (Shopee)
Estime o preço médio de mercado para este produto. Se um link for fornecido, use-o como referência principal. Com base nisso, sugira um preço de venda para a Shopee. Apresente o cálculo, assumindo uma taxa de 20% da Shopee (comissão + programa de frete grátis). Formate como uma lista: "Preço Base Médio:", "Taxa Shopee (20%):", "Preço de Venda Sugerido:".

### Tags SEO
25 tags SEO relevantes. Formate como UMA ÚNICA LINHA de palavras separadas por vírgulas.

### Hashtags
25 hashtags populares e relevantes. Formate como UMA ÚNICA LINHA de hashtags separadas por vírgulas.

### Frases para Redes Sociais
25 frases para postagens em redes sociais. Formate como uma lista numerada.

### Scripts para Vídeos Curtos
3 scripts para vídeos curtos (Reels/TikTok) de 15-30 segundos. Formate cada script com "### Script [Número]" e depois "Cena 1:", "Cena 2:", etc.

### Depoimentos Fictícios
3 depoimentos fictícios. Formate como uma lista numerada, com um nome fictício.

### Keywords Long-Tail
12 keywords long-tail para SEO. Formate como uma lista numerada.

### Meta Tags e Alt Text
7 meta descriptions e alt texts para imagens. Formate como uma lista numerada, indicando se é "Meta:" ou "Alt Text:".

### Artigos para Blog
4 ideias de títulos e um breve resumo para artigos de blog. Formate como uma lista numerada.

### Guias de Compra
3 ideias para guias de compra comparativos. Formate como uma lista numerada.

### Perguntas Frequentes (FAQ)
7 perguntas e respostas frequentes sobre o produto. Formate cada item como uma nova linha começando com "P: [Pergunta]" seguido de uma nova linha com "R: [Resposta]".

### Frases Promocionais
25 frases promocionais de venda, curtas e impactantes. Formate como uma lista numerada.

### E-mails Marketing
4 e-mails marketing (lançamento, promoção, pós-venda). Formate cada e-mail com "### E-mail [Número]", "Assunto:" e "Corpo:".

### Variações de Preço
4 sugestões de variações de preço e descontos. Formate como uma lista numerada.

### Cupons de Desconto
7 ideias de cupons de desconto (códigos e descrições). Formate como uma lista numerada.

### Contagens Regressivas
3 textos para banners de contagem regressiva. Formate como uma lista numerada.

### Pop-ups Promocionais
4 textos para pop-ups promocionais. Formate como uma lista numerada.

### Landpages Simples
2 estruturas de texto para landpages. Formate cada uma com "### Landpage [Número]" e seções como "Título:", "Benefícios:", "CTA:".

### Comparativos com Concorrentes
2 exemplos de textos para uma tabela comparativa. Formate como uma lista numerada.

### Quizzes Interativos
3 ideias de quizzes interativos. Formate como uma lista numerada com título e exemplos de perguntas.

### Chatbots de Atendimento
2 exemplos de scripts para chatbots com respostas a dúvidas frequentes. Formate com "### Chatbot [Número]" e depois "Usuário:" e "Bot:".
`;

const parseResponse = (responseText: string): Omit<GeneratedContent, 'groundingChunks'> => {
    const sections = {
        // Conteúdo Essencial
        titles: '### Títulos',
        descriptions: '### Descrições',
        productPricing: '### Preço Sugerido (Shopee)',
        tags: '### Tags SEO',
        hashtags: '### Hashtags',
        // Redes Sociais e Engajamento
        socialMediaPosts: '### Frases para Redes Sociais',
        shortVideoScripts: '### Scripts para Vídeos Curtos',
        fictionalTestimonials: '### Depoimentos Fictícios',
        // SEO Avançado e Marketing de Conteúdo
        longTailKeywords: '### Keywords Long-Tail',
        metaTagsAndAltTexts: '### Meta Tags e Alt Text',
        blogArticles: '### Artigos para Blog',
        buyingGuides: '### Guias de Compra',
        faqs: '### Perguntas Frequentes (FAQ)',
        // Campanhas de Vendas e Promoções
        promotionalPhrases: '### Frases Promocionais',
        marketingEmails: '### E-mails Marketing',
        priceVariations: '### Variações de Preço',
        discountCoupons: '### Cupons de Desconto',
        countdownPromos: '### Contagens Regressivas',
        popupCopies: '### Pop-ups Promocionais',
        // Ferramentas Avançadas e Interativas
        landingPageCopies: '### Landpages Simples',
        competitorComparisons: '### Comparativos com Concorrentes',
        interactiveQuizzes: '### Quizzes Interativos',
        chatbotScripts: '### Chatbots de Atendimento',
    };

    const sectionKeys = Object.keys(sections) as (keyof typeof sections)[];
    const parsedData: { [key: string]: string } = {};

    for (let i = 0; i < sectionKeys.length; i++) {
        const currentKey = sectionKeys[i];
        const startTag = sections[currentKey];
        const endTag = i + 1 < sectionKeys.length ? sections[sectionKeys[i + 1]] : undefined;
        
        let content = responseText.split(startTag)[1] || '';
        if (endTag) {
            content = content.split(endTag)[0] || '';
        }
        parsedData[currentKey] = content.trim();
    }
    
    const listParser = (text: string) => text.split('\n').map(l => l.trim().replace(/^\d+\.\s*/, '')).filter(Boolean);
    const commaParser = (text: string) => text.split(',').map(t => t.trim().replace(/\.$/, '')).filter(Boolean);
    const hashtagParser = (text: string) => commaParser(text).map(t => t.startsWith('#') ? t : `#${t}`);

    return {
        titles: listParser(parsedData.titles),
        descriptions: listParser(parsedData.descriptions),
        productPricing: listParser(parsedData.productPricing),
        tags: commaParser(parsedData.tags),
        hashtags: hashtagParser(parsedData.hashtags),
        socialMediaPosts: listParser(parsedData.socialMediaPosts),
        shortVideoScripts: parsedData.shortVideoScripts.split(/###\s*Script\s*\d+/).map(s => s.trim()).filter(Boolean),
        fictionalTestimonials: listParser(parsedData.fictionalTestimonials),
        longTailKeywords: listParser(parsedData.longTailKeywords),
        metaTagsAndAltTexts: listParser(parsedData.metaTagsAndAltTexts),
        blogArticles: listParser(parsedData.blogArticles),
        buyingGuides: listParser(parsedData.buyingGuides),
        faqs: parsedData.faqs.split(/\n?P:\s*/).map(l => l.trim()).filter(Boolean).map(l => `P: ${l}`),
        promotionalPhrases: listParser(parsedData.promotionalPhrases),
        marketingEmails: parsedData.marketingEmails.split(/###\s*E-mail\s*\d+/).map(e => e.trim()).filter(Boolean),
        priceVariations: listParser(parsedData.priceVariations),
        discountCoupons: listParser(parsedData.discountCoupons),
        countdownPromos: listParser(parsedData.countdownPromos),
        popupCopies: listParser(parsedData.popupCopies),
        landingPageCopies: parsedData.landingPageCopies.split(/###\s*Landpage\s*\d+/).map(l => l.trim()).filter(Boolean),
        competitorComparisons: listParser(parsedData.competitorComparisons),
        interactiveQuizzes: listParser(parsedData.interactiveQuizzes),
        chatbotScripts: parsedData.chatbotScripts.split(/###\s*Chatbot\s*\d+/).map(s => s.trim()).filter(Boolean),
    };
};

const generate = async (parts: any[]): Promise<GeneratedContent> => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("A API não retornou conteúdo.");
    }
    const parsedContent = parseResponse(responseText);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { ...parsedContent, groundingChunks };
}

export const generateContentFromImage = async (base64Data: string, mimeType: string): Promise<GeneratedContent> => {
  try {
    const prompt = `Analise a imagem deste produto e estime um preço de mercado.${commonPrompt}`;
    const imagePart = { inlineData: { data: base64Data, mimeType } };
    const textPart = { text: prompt };
    return await generate([imagePart, textPart]);
  } catch (error) {
    console.error("Error generating content from image:", error);
    throw new Error("Falha ao gerar conteúdo a partir da imagem. Tente novamente.");
  }
};

export const generateContentFromUrl = async (productUrl: string): Promise<GeneratedContent> => {
    try {
        const prompt = `Com base nas informações encontradas na web sobre o produto no link a seguir: ${productUrl}.${commonPrompt}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const responseText = response.text;
        if (!responseText) {
            throw new Error("A API não retornou conteúdo.");
        }
        const parsedContent = parseResponse(responseText);
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        return { ...parsedContent, groundingChunks };
    } catch (error) {
        console.error("Error generating content from URL:", error);
        throw new Error("Falha ao gerar conteúdo a partir do link. Verifique a URL e tente novamente.");
    }
};