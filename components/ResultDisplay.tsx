import React, { useState } from 'react';
import type { GeneratedContent } from '../types';

interface ResultDisplayProps {
  isLoading: boolean;
  content: GeneratedContent;
  error: string | null;
}

const ClipboardIcon: React.FC<{ copied: boolean; className?: string }> = ({ copied, className = "h-5 w-5" }) => (
    copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-gray-400 group-hover:text-[var(--primary-accent)] transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    )
);

const Loader: React.FC<{ text?: string, subtext?: string }> = ({ text = "Analisando e gerando conteúdo...", subtext = "Isto é IA de ponta, pode levar alguns segundos." }) => (
    <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="w-12 h-12 border-4 border-[var(--primary-accent)] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-semibold">{text}</p>
        <p className="text-sm text-gray-500">{subtext}</p>
    </div>
);

// --- Reusable Content Display Components ---

const ListSection: React.FC<{ title: string; items: string[]; sectionId: string; onCopy: (text: string, id: string) => void; copiedId: string | null; hideTitle?: boolean }> = ({ title, items, sectionId, onCopy, copiedId, hideTitle = false }) => (
    <div className="mt-4 first:mt-0">
        {!hideTitle && <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{title}:</h3>}
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={`${sectionId}-${index}`} className="group flex items-center justify-between bg-gray-50 dark:bg-black/20 p-3 rounded-lg hover:shadow-sm transition-all duration-300 border border-[var(--border-light)] dark:border-[var(--border-dark)]">
                    <p className="flex-1 text-[var(--text-light)] dark:text-[var(--text-dark)] pr-4">
                        {item}
                    </p>
                    <button onClick={() => onCopy(item, `${sectionId}-${index}`)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={`Copiar ${title.slice(0, -1)}`}>
                        <ClipboardIcon copied={copiedId === `${sectionId}-${index}`} />
                    </button>
                </div>
            ))}
        </div>
    </div>
);

const PillSection: React.FC<{ title: string; items: string[]; sectionId: string; onCopy: (text: string, id: string) => void; copiedId: string | null; copyLabel: string }> = ({ title, items, sectionId, onCopy, copiedId, copyLabel }) => (
     <div className="mt-4 first:mt-0">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-[var(--text-light)] dark:text-[var(--text-dark)]">{title}:</h3>
            <button onClick={() => onCopy(items.join(', '), `${sectionId}-all`)} className="group flex items-center px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600" aria-label={`Copiar ${copyLabel}`}>
                <ClipboardIcon copied={copiedId === `${sectionId}-all`} />
                <span className="ml-2 text-gray-600 dark:text-gray-300">{copiedId === `${sectionId}-all` ? 'Copiado!' : `Copiar ${copyLabel}`}</span>
            </button>
        </div>
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-black/20 rounded-lg border border-[var(--border-light)] dark:border-[var(--border-dark)]">
            {items.map((item, index) => (<span key={`${sectionId}-${index}`} className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 text-sm font-medium rounded-full">{item}</span>))}
        </div>
    </div>
);

const ComplexContentSection: React.FC<{ title: string; items: string[]; sectionId: string; onCopy: (text: string, id:string) => void; copiedId: string | null; }> = ({ title, items, sectionId, onCopy, copiedId }) => (
    <div className="mt-4 first:mt-0">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-light)] dark:text-[var(--text-dark)]">{title}:</h3>
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={`${sectionId}-${index}`} className="group relative bg-gray-50 dark:bg-black/20 p-4 rounded-lg hover:shadow-sm transition-all duration-300 border border-[var(--border-light)] dark:border-[var(--border-dark)]">
                    <button onClick={() => onCopy(item, `${sectionId}-${index}`)} className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Copiar ${title.slice(0, -1)}`}>
                        <ClipboardIcon copied={copiedId === `${sectionId}-${index}`} />
                    </button>
                    <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">{item}</pre>
                </div>
            ))}
        </div>
    </div>
);

// --- Accordion Component ---

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; count: number; defaultOpen?: boolean }> = ({ title, children, count, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    if (count === 0) return null;

    return (
        <div className="border-b border-[var(--border-light)] dark:border-[var(--border-dark)] last:border-b-0">
            <h2>
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full p-5 font-semibold text-left text-[var(--text-light)] dark:text-[var(--text-dark)] hover:bg-gray-100/50 dark:hover:bg-gray-800/20 transition-colors" aria-expanded={isOpen}>
                    <div className="flex items-center">
                        <span className="text-lg">{title}</span>
                        <span className="ml-3 bg-indigo-100 text-[var(--primary-accent)] text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-indigo-900/50 dark:text-indigo-300">{count}</span>
                    </div>
                    <svg className={`w-6 h-6 transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </h2>
            <div className={`${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-700 ease-in-out`}>
                <div className="p-5 bg-white/50 dark:bg-black/10">{children}</div>
            </div>
        </div>
    );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, content, error }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    
    if (isLoading) return <Loader />;

    if (error) {
        return (
            <div className="mt-8 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-200 rounded-xl">
                <p className="font-bold">Ocorreu um erro:</p><p>{error}</p>
            </div>
        );
    }
    
    const hasContent = Object.values(content).some(val => Array.isArray(val) && val.length > 0);
    if (!hasContent) {
        return (
            <div className="mt-8 p-12 text-center border-2 border-dashed border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">Seu conteúdo de texto gerado por IA aparecerá aqui.</p>
            </div>
        );
    }

    const { 
        titles, descriptions, productPricing, tags, hashtags,
        socialMediaPosts, shortVideoScripts, fictionalTestimonials,
        longTailKeywords, metaTagsAndAltTexts, blogArticles, buyingGuides, faqs,
        promotionalPhrases, marketingEmails, priceVariations, discountCoupons, countdownPromos, popupCopies,
        landingPageCopies, competitorComparisons, interactiveQuizzes, chatbotScripts,
        groundingChunks 
    } = content;

    return (
        <section>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Passo 2: Revise o Conteúdo de Texto</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">Aqui está todo o material de marketing que a IA criou para você. Copie o que precisar!</p>
          <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl overflow-hidden border border-[var(--border-light)] dark:border-[var(--border-dark)]">
              <AccordionSection title="Conteúdo Essencial do Produto" defaultOpen count={titles.length + descriptions.length + productPricing.length + tags.length + hashtags.length}>
                  {titles.length > 0 && <ListSection title="Títulos Sugeridos" items={titles} sectionId="title" onCopy={handleCopy} copiedId={copiedId} hideTitle />}
                  {descriptions.length > 0 && <ComplexContentSection title="Descrições Sugeridas" items={descriptions} sectionId="desc" onCopy={handleCopy} copiedId={copiedId} />}
                  {productPricing.length > 0 && <ListSection title="Preço Sugerido (Shopee)" items={productPricing} sectionId="pricing" onCopy={handleCopy} copiedId={copiedId} />}
                  {tags.length > 0 && <PillSection title="Tags SEO Sugeridas" items={tags} sectionId="tag" onCopy={handleCopy} copiedId={copiedId} copyLabel="Tags" />}
                  {hashtags.length > 0 && <PillSection title="Hashtags Sugeridas" items={hashtags} sectionId="hashtag" onCopy={handleCopy} copiedId={copiedId} copyLabel="Hashtags" />}
              </AccordionSection>

              <AccordionSection title="Redes Sociais e Engajamento" count={socialMediaPosts.length + shortVideoScripts.length + fictionalTestimonials.length}>
                  {socialMediaPosts.length > 0 && <ListSection title="Posts para Redes Sociais" items={socialMediaPosts} sectionId="social" onCopy={handleCopy} copiedId={copiedId} />}
                  {shortVideoScripts.length > 0 && <ComplexContentSection title="Scripts para Vídeos Curtos" items={shortVideoScripts} sectionId="script" onCopy={handleCopy} copiedId={copiedId} />}
                  {fictionalTestimonials.length > 0 && <ComplexContentSection title="Depoimentos Fictícios" items={fictionalTestimonials} sectionId="testimonial" onCopy={handleCopy} copiedId={copiedId} />}
              </AccordionSection>

              <AccordionSection title="SEO Avançado e Marketing de Conteúdo" count={longTailKeywords.length + metaTagsAndAltTexts.length + blogArticles.length + buyingGuides.length + faqs.length}>
                  {longTailKeywords.length > 0 && <PillSection title="Keywords Long-Tail" items={longTailKeywords} sectionId="longtail" onCopy={handleCopy} copiedId={copiedId} copyLabel="Keywords" />}
                  {metaTagsAndAltTexts.length > 0 && <ListSection title="Meta Tags e Alt Text" items={metaTagsAndAltTexts} sectionId="meta" onCopy={handleCopy} copiedId={copiedId} />}
                  {blogArticles.length > 0 && <ListSection title="Ideias para Blog" items={blogArticles} sectionId="blog" onCopy={handleCopy} copiedId={copiedId} />}
                  {buyingGuides.length > 0 && <ListSection title="Guias de Compra" items={buyingGuides} sectionId="guide" onCopy={handleCopy} copiedId={copiedId} />}
                  {faqs.length > 0 && <ComplexContentSection title="Perguntas Frequentes (FAQ)" items={faqs} sectionId="faq" onCopy={handleCopy} copiedId={copiedId} />}
              </AccordionSection>

              <AccordionSection title="Campanhas de Vendas e Promoções" count={promotionalPhrases.length + marketingEmails.length + priceVariations.length + discountCoupons.length + countdownPromos.length + popupCopies.length}>
                  {promotionalPhrases.length > 0 && <ListSection title="Frases Promocionais" items={promotionalPhrases} sectionId="promo" onCopy={handleCopy} copiedId={copiedId} />}
                  {marketingEmails.length > 0 && <ComplexContentSection title="E-mails Marketing" items={marketingEmails} sectionId="email" onCopy={handleCopy} copiedId={copiedId} />}
                  {priceVariations.length > 0 && <ListSection title="Variações de Preço" items={priceVariations} sectionId="price" onCopy={handleCopy} copiedId={copiedId} />}
                  {discountCoupons.length > 0 && <ListSection title="Cupons de Desconto" items={discountCoupons} sectionId="coupon" onCopy={handleCopy} copiedId={copiedId} />}
                  {countdownPromos.length > 0 && <ListSection title="Textos para Contagem Regressiva" items={countdownPromos} sectionId="countdown" onCopy={handleCopy} copiedId={copiedId} />}
                  {popupCopies.length > 0 && <ListSection title="Textos para Pop-ups" items={popupCopies} sectionId="popup" onCopy={handleCopy} copiedId={copiedId} />}
              </AccordionSection>

              <AccordionSection title="Ferramentas Avançadas e Interativas" count={landingPageCopies.length + competitorComparisons.length + interactiveQuizzes.length + chatbotScripts.length}>
                  {landingPageCopies.length > 0 && <ComplexContentSection title="Textos para Landpages" items={landingPageCopies} sectionId="lp" onCopy={handleCopy} copiedId={copiedId} />}
                  {competitorComparisons.length > 0 && <ListSection title="Comparativos com Concorrentes" items={competitorComparisons} sectionId="compare" onCopy={handleCopy} copiedId={copiedId} />}
                  {interactiveQuizzes.length > 0 && <ComplexContentSection title="Quizzes Interativos" items={interactiveQuizzes} sectionId="quiz" onCopy={handleCopy} copiedId={copiedId} />}
                  {chatbotScripts.length > 0 && <ComplexContentSection title="Scripts para Chatbot" items={chatbotScripts} sectionId="chatbot" onCopy={handleCopy} copiedId={copiedId} />}
              </AccordionSection>

              {groundingChunks && groundingChunks.length > 0 && (
                <div className="p-5 bg-gray-50 dark:bg-black/20 border-t border-[var(--border-light)] dark:border-[var(--border-dark)]">
                  <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Fontes da Web:</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {groundingChunks.map((chunk, index) => ( chunk.web && ( <li key={index}><a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">{chunk.web.title || chunk.web.uri}</a></li>)))}
                  </ul>
                </div>
              )}
          </div>
        </section>
    );
};

export default ResultDisplay;