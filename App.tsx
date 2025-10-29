import React, { useState } from 'react';
import InputTabs from './components/InputTabs';
import ResultDisplay from './components/ResultDisplay';
import type { GeneratedContent } from './types';
import ProductMediaGenerator from './components/ProductMediaGenerator';
import BrandIdentityGenerator from './components/BrandIdentityGenerator';
import CompletionModal from './components/CompletionModal';
import NotificationGenerator from './components/NotificationGenerator';

const initialContentState: GeneratedContent = {
  // Conteúdo Essencial
  titles: [],
  descriptions: [],
  productPricing: [],
  tags: [],
  hashtags: [],

  // Redes Sociais e Engajamento
  socialMediaPosts: [],
  shortVideoScripts: [],
  fictionalTestimonials: [],
  
  // SEO Avançado e Marketing de Conteúdo
  longTailKeywords: [],
  metaTagsAndAltTexts: [],
  blogArticles: [],
  buyingGuides: [],
  faqs: [],

  // Campanhas de Vendas e Promoções
  promotionalPhrases: [],
  marketingEmails: [],
  priceVariations: [],
  discountCoupons: [],
  countdownPromos: [],
  popupCopies: [],

  // Ferramentas Avançadas e Interativas
  landingPageCopies: [],
  competitorComparisons: [],
  interactiveQuizzes: [],
  chatbotScripts: [],
  
  groundingChunks: [],
};

const Logo: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--primary-accent)" />
                <stop offset="100%" stopColor="var(--secondary-accent)" />
            </linearGradient>
        </defs>
        <path
            fill="url(#logoGradient)"
            d="M2 21V3h3.33L12 12l6.67-9H22v18h-3.33V7.69L12 16.69 5.33 7.69V21H2Z"
        />
    </svg>
);


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="relative bg-[var(--card-light)] dark:bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden backdrop-blur-sm">
     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--primary-accent)] to-[var(--secondary-accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="bg-indigo-100 dark:bg-indigo-900/50 text-[var(--primary-accent)] rounded-lg h-12 w-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-200">{children}</p>
    </div>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; avatar: string }> = ({ quote, name, role, avatar }) => (
    <div className="bg-[var(--card-light)] dark:bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] shadow-lg h-full flex flex-col">
        <p className="text-gray-600 dark:text-gray-400 flex-grow">"{quote}"</p>
        <div className="flex items-center mt-6">
            <img className="h-12 w-12 rounded-full object-cover" src={avatar} alt={name} />
            <div className="ml-4">
                <p className="font-bold">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
            </div>
        </div>
    </div>
);

const Button3D: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string }> = ({ children, onClick, className = '' }) => (
    <button onClick={onClick} className={`button-3d ${className}`}>
        <span className="button-3d-front">{children}</span>
        <style jsx>{`
            .button-3d {
                position: relative;
                display: inline-block;
                border: none;
                background: transparent;
                padding: 0;
                cursor: pointer;
                outline-offset: 4px;
                transition: filter 250ms;
                -webkit-tap-highlight-color: transparent;
            }
            .button-3d-front {
                display: block;
                position: relative;
                padding: 1rem 2.5rem;
                border-radius: 12px;
                font-size: 1.25rem;
                font-weight: bold;
                background-image: linear-gradient(to right, var(--primary-accent), var(--secondary-accent));
                color: white;
                transform: translateY(-6px);
                transition: transform 600ms cubic-bezier(.3, .7, .4, 1);
            }
            .button-3d:hover .button-3d-front {
                transform: translateY(-8px);
                transition: transform 250ms cubic-bezier(.3, .7, .4, 1.5);
            }
            .button-3d:active .button-3d-front {
                transform: translateY(-2px);
                transition: transform 34ms;
            }
            .button-3d:focus:not(:focus-visible) {
                outline: none;
            }
        `}</style>
    </button>
);


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(initialContentState);
  const [error, setError] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [workspaceActive, setWorkspaceActive] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleGeneration = (content: GeneratedContent) => {
    setGeneratedContent(content);
    if(content.titles.length > 0) {
      setShowCompletionModal(true);
    }
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setGeneratedContent(initialContentState);
    setSourceImage(null);
  };

  const handleSourceImage = (data: { base64: string; mimeType: string } | null) => {
    setSourceImage(data);
  };
  
  const hasContent = Object.values(generatedContent).some(val => Array.isArray(val) && val.length > 0);

  const resetToHome = () => {
    setWorkspaceActive(false);
    setGeneratedContent(initialContentState);
    setError(null);
    setSourceImage(null);
    setIsLoading(false);
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    const workspaceEl = document.getElementById('workspace');
    if (workspaceEl) {
      workspaceEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-light)] dark:text-[var(--text-dark)] font-sans transition-colors duration-300">
      <CompletionModal isOpen={showCompletionModal} onClose={handleCloseCompletionModal} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        {!workspaceActive ? (
          <div className="space-y-24 md:space-y-32">
            {/* Hero Section */}
            <header className="text-center py-16 md:py-24 relative overflow-hidden">
                <div 
                  className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_40%)]"
                  style={{backgroundImage: 'radial-gradient(circle at 50% 50%, var(--primary-accent) 0%, transparent 25%), radial-gradient(circle at 10% 20%, var(--secondary-accent) 0%, transparent 25%), radial-gradient(circle at 90% 80%, var(--primary-accent) 0%, transparent 25%)', opacity: 0.15, filter: 'blur(60px)'}}
                ></div>
                <div className="flex justify-center mb-6">
                  <Logo className="h-24 w-24" />
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tighter mb-4">
                    <span className="gradient-text">MEGAPOST</span>
                </h1>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter">
                    Sua Agência de Marketing em um Clique.
                </h2>
                <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    De posts virais a uma identidade visual completa. Crie tudo o que você precisa com o poder da IA generativa.
                </p>
                <div className="mt-10">
                    <Button3D onClick={() => setWorkspaceActive(true)}>
                        Começar a Criar Agora
                    </Button3D>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Uma Ferramenta, Potencial Ilimitado</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">O MEGAPOST é o seu time de marketing, design e redação, disponível 24/7.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard title="Textos que Convertem" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                        Gere títulos, descrições, posts para redes sociais, e-mails e roteiros de vídeo, otimizados para SEO e engajamento.
                    </FeatureCard>
                    <FeatureCard title="Mídia Visual de Impacto" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                        Transforme fotos de produtos em imagens profissionais, mockups realistas e banners para qualquer plataforma.
                    </FeatureCard>
                    <FeatureCard title="Identidade de Marca Instantânea" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517M11.414 15.414a2 2 0 01-2.828 0L8.586 12 11.414 9.172a2 2 0 012.828 0L17 12m-8.586 3.414a2 2 0 000 2.828l2.387.477a2 2 0 001.022.547M12 18a6 6 0 00-3.86-.517m0 0a6 6 0 01-3.86-.517M12 6a6 6 0 013.86.517m0 0a6 6 0 003.86.517M12 6a6 6 0 00-3.86.517M3.428 8.572a2 2 0 001.022.547l2.387.477a6 6 0 003.86-.517M7.172 9.172a2 2 0 010-2.828L8.586 5 11.414 7.828a2 2 0 010 2.828m0 0l2.829 2.829m-2.829-2.829l-2.828 2.828" /></svg>}>
                        Crie logos e banners profissionais em segundos a partir de uma simples ideia, com ou sem imagens de referência.
                    </FeatureCard>
                </div>
            </section>
            
            {/* Showcase Banner */}
            <section className="relative overflow-hidden rounded-2xl p-8 md:p-16 flex items-center justify-center text-center gradient-bg shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">Transforme Ideias em Realidade Visual</h2>
                    <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto">De um simples prompt a uma campanha visual completa. Veja o poder da IA em ação.</p>
                </div>
                 <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-white/10 rounded-full blur-3xl opacity-50"></div>
                 <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-white/10 rounded-full blur-3xl opacity-50"></div>
            </section>

            {/* Testimonials */}
            <section className="py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Amado por Criadores e Empreendedores</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">Veja o que nossos usuários estão dizendo sobre o impacto do MEGAPOST.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <TestimonialCard 
                        name="Juliana Silva"
                        role="Dona de E-commerce"
                        avatar="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        quote="O MEGAPOST economiza horas do meu dia. A qualidade dos textos e das imagens geradas é impressionante e aumentou minhas vendas na Shopee."
                    />
                    <TestimonialCard 
                        name="Carlos Andrade"
                        role="Social Media Manager"
                        avatar="https://i.pravatar.cc/150?u=a042581f4e29026704e"
                        quote="Criar conteúdo para múltiplos clientes era um desafio. Agora, com o MEGAPOST, eu gero campanhas completas em minutos. É revolucionário!"
                    />
                    <TestimonialCard 
                        name="Fernanda Lima"
                        role="Empreendedora Digital"
                        avatar="https://i.pravatar.cc/150?u=a042581f4e29026704f"
                        quote="Eu não tinha verba para contratar um designer. O gerador de logos e banners me deu uma identidade visual profissional por um custo zero. Incrível!"
                    />
                </div>
            </section>

             {/* Final CTA */}
             <section className="text-center py-16">
                 <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Pronto para Elevar seu Marketing?</h2>
                 <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
                    Junte-se a milhares de criadores que estão construindo marcas mais fortes e vendendo mais com MEGAPOST.
                 </p>
                 <Button3D onClick={() => setWorkspaceActive(true)}>
                    Criar minha Campanha Grátis
                </Button3D>
             </section>
          </div>
        ) : (
          <div id="workspace" className="max-w-7xl mx-auto mt-8">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Logo className="h-10 w-10"/>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text">MEGAPOST Workspace</h1>
                </div>
              <button onClick={resetToHome} className="px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Voltar ao Início
              </button>
            </header>

            <div className="space-y-16">
              
              {/* Standalone Brand Tools */}
              <section>
                 <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Ferramentas de Identidade Visual</h2>
                 <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">
                    Crie logos e banners profissionais de forma independente, a qualquer momento.
                 </p>
                 <BrandIdentityGenerator />
              </section>

              {/* Engagement Tools */}
              <section>
                 <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Ferramentas de Engajamento</h2>
                 <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">
                    Gere notificações de vendas para usar em vídeos e stories.
                 </p>
                 <NotificationGenerator />
              </section>


              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[var(--border-light)] dark:border-[var(--border-dark)]"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[var(--background-light)] dark:bg-[var(--background-dark)] px-4 text-sm font-medium text-gray-500">OU</span>
                </div>
              </div>
              
              {/* Product-based Campaign Generator */}
              <section>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Crie sua Campanha Completa</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">Forneça um produto (imagem, câmera ou link) para gerar textos e mídias visuais contextuais.</p>
                <div className="max-w-4xl mx-auto">
                  <InputTabs 
                    setIsLoading={setIsLoading} 
                    onGeneration={handleGeneration}
                    onError={handleError}
                    isLoading={isLoading}
                    onSourceImageReady={handleSourceImage}
                  />
                </div>
              </section>

              <ResultDisplay 
                isLoading={isLoading} 
                content={generatedContent}
                error={error} 
              />
              
              {hasContent && !isLoading && !error && sourceImage && (
                <ProductMediaGenerator
                    sourceImage={sourceImage}
                />
              )}
            </div>
          </div>
        )}

        <footer className="text-center mt-24 text-sm text-gray-500 dark:text-gray-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;