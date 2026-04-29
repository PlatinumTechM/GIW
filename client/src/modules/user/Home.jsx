import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const categoryImages = [
  {
    id: "natural-diamond",
    url: "/images/natural-diamonds.png",
    alt: "Natural Diamonds",
  },
  {
    id: "lab-grown-diamond",
    url: "/images/lab-grown-diamonds.png",
    alt: "Lab-Grown Diamonds",
  },
  {
    id: "jewelry",
    url: "/images/jewelry.png",
    alt: "Jewelry",
  },
  {
    id: "lab-grown-jewelry",
    url: "/images/lab-grown-jewelry.png",
    alt: "Lab-Grown Jewelry",
  },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const rolePath = user?.role?.toLowerCase() || 'buyer';

  const categories = [
    {
      id: "natural-diamond",
      title: "Natural Diamonds",
      path: `/${rolePath}/natural-diamonds`,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L4 8L12 22L20 8L12 2Z" />
          <path d="M12 2L8 8H16L12 2Z" />
          <path d="M4 8L8 8L12 22L4 8Z" />
          <path d="M20 8L16 8L12 22L20 8Z" />
        </svg>
      ),
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "lab-grown-diamond",
      title: "Lab-Grown Diamonds",
      path: `/${rolePath}/lab-grown-diamonds`,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2V6" />
          <path d="M12 18V22" />
          <path d="M4.93 4.93L7.76 7.76" />
          <path d="M16.24 16.24L19.07 19.07" />
          <path d="M2 12H6" />
          <path d="M18 12H22" />
          <path d="M4.93 19.07L7.76 16.24" />
          <path d="M16.24 7.76L19.07 4.93" />
        </svg>
      ),
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      id: "jewelry",
      title: "Jewelry",
      path: `/${rolePath}/jewelry`,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2L8 6" />
          <path d="M12 2L16 6" />
          <path d="M9 13C7.5 16 8 20 12 22C16 20 16.5 16 15 13" />
        </svg>
      ),
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      id: "lab-grown-jewelry",
      title: "Lab-Grown Jewelry",
      path: `/${rolePath}/lab-grown-jewelry`,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2L8 6" />
          <path d="M12 2L16 6" />
          <path d="M9 13C7.5 16 8 20 12 22C16 20 16.5 16 15 13" />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        </svg>
      ),
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
  ];

  useEffect(() => {
    if (user?.role === "Seller") {
      navigate(`/${rolePath}/diamond`, { replace: true });
    }
  }, [user, navigate, rolePath]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % categoryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-(--bg-primary) pt-0 pb-12">
      {/* Category Image Carousel - Full Width */}
      <div className="relative w-full h-48 md:h-72 overflow-hidden mb-8 shadow-lg bg-[#0F172A]">
        {categoryImages.map((image, index) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out bg-[#0F172A] ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Top Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm">
            {categoryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 shadow-lg ${
                  index === currentImageIndex
                    ? "bg-white w-8"
                    : "bg-white/70 hover:bg-white w-2"
                }`}
              />
            ))}
          </div>
          {/* Category Label */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {categoryImages[currentImageIndex].alt}
          </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2 text-center">
          Select Category
        </h1>
        <p className="text-(--text-secondary) text-center mb-8">
          Choose a category to browse our collection
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.path}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${category.iconBg} ${category.iconColor} shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-3`}
              >
                {category.icon}
              </div>
              <span className="relative text-sm font-semibold text-(--text-primary) group-hover:text-(--accent-primary) transition-colors duration-300">
                {category.title}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-(--accent-primary) to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
