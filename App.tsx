import React, { useState, useEffect, useRef } from 'react';
import InputTabs from './components/InputTabs';
import ResultDisplay from './components/ResultDisplay';
import type { GeneratedContent } from './types';
import ProductMediaGenerator from './components/ProductMediaGenerator';
import BrandIdentityGenerator from './components/BrandIdentityGenerator';
import CompletionModal from './components/CompletionModal';
import { NotificationGenerator } from './components/NotificationGenerator';
import ShowcaseGallery from './components/ShowcaseGallery';

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
  socialMediaBios: [],
  
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
  adCopies: [],
  ctas: [],
  welcomeEmails: [],
  slogans: [],
  viralHooks: [],

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
    <div className="bg-[var(--card-light)] dark:bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] shadow-lg h-full flex flex-col hover:border-[var(--primary-accent)] transition-colors">
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

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(initialContentState);
  const [error, setError] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [workspaceActive, setWorkspaceActive] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCreating = () => {
    setWorkspaceActive(true);
    setTimeout(() => {
        workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
      
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled || workspaceActive ? 'py-3 bg-[var(--background-light)]/80 dark:bg-[var(--background-dark)]/80 backdrop-blur-lg border-b border-[var(--border-light)] dark:border-[var(--border-dark)] shadow-sm' : 'py-6'}`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
              <a href="#" onClick={(e) => { e.preventDefault(); resetToHome(); }} className="flex items-center gap-2">
                  <Logo className="h-8 w-8"/>
                  <span className="font-bold text-xl hidden sm:inline">MEGAPOST</span>
              </a>
              <button onClick={handleStartCreating} className="px-4 py-2 text-sm font-semibold gradient-bg text-white rounded-lg transition-transform hover:scale-105 glow-on-hover">
                  Começar a Criar
              </button>
          </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 pt-24">
        
        {!workspaceActive ? (
          <div className="space-y-24 md:space-y-32">
            {/* Hero Section */}
            <header className="text-center py-16 md:py-24 relative overflow-hidden">
              <div 
                  className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_50%)]"
                  style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, var(--primary-accent) 0%, transparent 20%), radial-gradient(circle at 10% 20%, var(--secondary-accent) 0%, transparent 25%), radial-gradient(circle at 90% 80%, var(--primary-accent) 0%, transparent 25%)',
                      opacity: 0.15,
                      filter: 'blur(80px)',
                  }}
              />

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter mb-4 uppercase">
                    <span className="gradient-text">MEGAPOST</span>
                </h1>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                    Sua Agência de Marketing em um Clique.
                </h2>
                <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    De posts virais a uma identidade visual completa. Crie tudo o que você precisa com o poder da IA generativa.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button onClick={handleStartCreating} className="px-8 py-4 text-lg font-bold gradient-bg text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] transition-all duration-300 shadow-lg transform hover:scale-105 glow-on-hover">
                        Começar a Criar Agora
                    </button>
                </div>
                 <div className="mt-8 flex justify-center items-center">
                    <div className="flex -space-x-2 overflow-hidden">
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--background-light)] dark:ring-[var(--background-dark)]" src="https://i.pravatar.cc/40?u=a" alt=""/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--background-light)] dark:ring-[var(--background-dark)]" src="https://i.pravatar.cc/40?u=b" alt=""/>
                        <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--background-light)] dark:ring-[var(--background-dark)]" src="https://i.pravatar.cc/40?u=c" alt=""/>
                    </div>
                    <p className="ml-3 text-sm text-gray-500">Junte-se a +10.000 criadores</p>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Uma Ferramenta, Potencial Ilimitado</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">O MEGAPOST é o seu time de marketing, design e redação, disponível 24/7.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard title="Textos que Convertem" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.707 2.293a1 1 0 0 0-1.414 0l-18 18a1 1 0 0 0 0 1.414a1 1 0 0 0 .707.293a1 1 0 0 0 .707-.293l18-18a1 1 0 0 0 0-1.414Z"/><path d="m19.274 6.55-4.243-4.242a1 1 0 0 0-1.414 0L2.383 13.54a1.002 1.002 0 0 0-.293.708v4.242a1 1 0 0 0 1 1h4.242a1 1 0 0 0 .707-.293l11.235-11.234a1 1 0 0 0 0-1.415ZM7.49 17.51H5.414v-2.076l7.849-7.849l2.076 2.076Z"/></svg>}>
                        Gere títulos, descrições, posts para redes sociais, e-mails e roteiros de vídeo, otimizados para SEO e engajamento.
                    </FeatureCard>
                    <FeatureCard title="Mídia Visual de Impacto" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3H8C4.691 3 2 5.691 2 9v6c0 3.309 2.691 6 6 6h8c3.309 0 6-2.691 6-6V9c0-3.309-2.691-6-6-6zm4 12c0 2.206-1.794 4-4 4H8c-2.206 0-4-1.794-4-4V9c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v6z"/><path d="m14.829 7.414-2.586 2.586a2 2 0 0 0 0 2.828l2.586 2.586a1 1 0 0 0 1.414-1.414L13.414 12l2.829-2.829a1 1 0 0 0-1.414-1.414zM8 12a1 1 0 1 0 0-2a1 1 0 0 0 0 2z"/></svg>}>
                        Transforme fotos de produtos em imagens profissionais, mockups realistas e banners para qualquer plataforma.
                    </FeatureCard>
                    <FeatureCard title="Identidade de Marca Instantânea" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10c5.515 0 10-4.486 10-10S17.515 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M12 10c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z"/></svg>}>
                        Crie logos e banners profissionais em segundos a partir de uma simples ideia, com ou sem imagens de referência.
                    </FeatureCard>
                </div>
            </section>
            
            <ShowcaseGallery />

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
                 <button onClick={handleStartCreating} className="px-8 py-4 text-lg font-bold gradient-bg text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] transition-all duration-300 shadow-lg transform hover:scale-105 glow-on-hover">
                    Criar minha Campanha Grátis
                </button>
             </section>
          </div>
        ) : (
          <div id="workspace" ref={workspaceRef} className="max-w-7xl mx-auto mt-8">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">MEGAPOST Workspace</h1>
            </header>

            <div className="space-y-16">
              
              <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] p-6 md:p-8">
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
              </div>

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

              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[var(--border-light)] dark:border-[var(--border-dark)]"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[var(--background-light)] dark:bg-[var(--background-dark)] px-4 text-sm font-medium text-gray-500">FERRAMENTAS ADICIONAIS</span>
                </div>
              </div>

              <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] p-6 md:p-8">
                 <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Ferramentas de Identidade Visual</h2>
                 <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">
                    Crie logos e banners profissionais de forma independente, a qualquer momento.
                 </p>
                 <BrandIdentityGenerator />
              </div>

              <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)] p-6 md:p-8">
                 <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Ferramentas de Engajamento</h2>
                 <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">
                    Gere notificações de vendas para usar em vídeos e stories.
                 </p>
                 <NotificationGenerator />
              </div>

            </div>
          </div>
        )}

        <footer className="text-center mt-24 py-8 border-t border-[var(--border-light)] dark:border-[var(--border-dark)] text-sm text-gray-500 dark:text-gray-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;