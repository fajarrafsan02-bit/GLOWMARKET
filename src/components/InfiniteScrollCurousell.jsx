import { ChevronRight, Pause, Play, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function InfiniteScrollCarousel() {
    const slides = [
        {
            id: 1,
            src: 'https://api.thepalacejeweler.com/upload/banner/1761129272-_TP%20-%20KV%20Oktober%202025%20-%20Banner%20Desktop%201440x720px.png',
            title: 'Promo Oktober 2025',
            description: 'Diskon spesial hingga 50%'
        },
        {
            id: 2,
            src: 'https://api.thepalacejeweler.com/upload/banner/1734699587-WhatsApp%20Image%202024-12-20%20at%2019.59.12.jpeg',
            title: 'Koleksi Terbaru',
            description: 'Perhiasan eksklusif edisi limited'
        },
        {
            id: 3,
            src: 'https://api.thepalacejeweler.com/upload/banner/1764045234-TP_BANNER%20GWP%20WEBSITE_DES_desktop%20%281%29.jpg',
            title: 'Gift Special',
            description: 'Dapatkan hadiah menarik setiap pembelian'
        },
        {
            id: 4,
            src: 'https://api.thepalacejeweler.com/upload/banner/1762229355-TP_Banner%20website_Dekstop.png',
            title: 'New Arrival',
            description: 'Koleksi musim dingin telah tiba'
        }
    ];

    const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];
    
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        if (!isPlaying || isHovered) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => prev + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, [isPlaying, isHovered]);

    useEffect(() => {
        if (currentSlide === 0) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(slides.length);
                setTimeout(() => setIsTransitioning(true), 50);
            }, 700);
            return () => clearTimeout(timeout);
        }
        
        if (currentSlide === slides.length + 1) {
            const timeout = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(1);
                setTimeout(() => setIsTransitioning(true), 50);
            }, 700);
            return () => clearTimeout(timeout);
        }
    }, [currentSlide, slides.length]);

    const goToPrevSlide = () => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev - 1);
    };

    const goToNextSlide = () => {
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev + 1);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="relative w-full mb-6">
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>

            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                    {extendedSlides.map((slide, index) => (
                        <div
                            key={`${slide.id}-${index}`}
                            className="absolute inset-0 w-full h-full ease-in-out"
                            style={{
                                transform: `translateX(${(index - currentSlide) * 100}%)`,
                                transition: isTransitioning ? 'transform 0.7s ease-in-out' : 'none',
                                zIndex: index === currentSlide ? 1 : 0
                            }}
                        >
                            <img
                                src={slide.src}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent"></div>

                            {index === currentSlide && (
                                <div 
                                    key={`content-${currentSlide}`}
                                    className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12 text-white"
                                    style={{
                                        animation: 'fadeIn 0.5s ease-out'
                                    }}
                                >
                                    <div className="max-w-7xl mx-auto">
                                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3">
                                            {slide.title}
                                        </h3>
                                        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-4 md:mb-6">
                                            {slide.description}
                                        </p>
                                        <button className="px-6 py-2 md:px-8 md:py-3 lg:px-10 lg:py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 text-base md:text-lg">
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={goToPrevSlide}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 md:p-4 rounded-full backdrop-blur-sm hover:scale-110 transition-all duration-300 group z-20"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-yellow-400" />
                    </button>

                    <button
                        onClick={goToNextSlide}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 md:p-4 rounded-full backdrop-blur-sm hover:scale-110 transition-all duration-300 group z-20"
                    >
                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-yellow-400" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/40 hover:bg-black/60 p-2 md:p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-20"
                    >
                        {isPlaying ?
                            <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" /> :
                            <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        }
                    </button>

                    <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-black/40 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full z-20">
                        <span className="text-white font-semibold text-sm md:text-base">
                            {currentSlide === 0 ? slides.length : (currentSlide === slides.length + 1 ? 1 : currentSlide)} / {slides.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}