import React from 'react';

const ShowcaseGallery: React.FC = () => {
    
    // Updated image set for a more vibrant and diverse showcase
    const images = [
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-1.jpg",
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-2.jpg",
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-3.jpg",
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-4.jpg",
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-5.jpg",
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-6.jpg",
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-7.jpg",
      "https://storage.googleapis.com/aistudio-hosting/megapost-showcase-v3/showcase-v3-8.jpg",
    ];

    const allImages = [...images, ...images]; // Duplicate for seamless loop

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
             <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--background-light)] via-transparent to-[var(--background-light)] dark:from-[var(--background-dark)] dark:via-transparent dark:to-[var(--background-dark)]" />
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Transforme Ideias em Realidade Visual</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto">De um simples prompt a uma campanha visual completa. Veja o poder da IA em ação.</p>
            </div>

            <div className="relative w-full overflow-hidden">
                {/* Gradient fade overlays for a more robust cross-browser effect */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[var(--background-light)] dark:from-[var(--background-dark)] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[var(--background-light)] dark:from-[var(--background-dark)] to-transparent z-10 pointer-events-none"></div>

                <div className="flex animate-scroll w-max">
                    {allImages.map((src, index) => (
                        <div key={index} className="w-[400px] h-[300px] flex-shrink-0 mx-4 rounded-2xl shadow-xl overflow-hidden border-2 border-[var(--border-light)] dark:border-[var(--border-dark)]">
                            <img 
                                src={src} 
                                alt={`Showcase image ${index + 1}`} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShowcaseGallery;