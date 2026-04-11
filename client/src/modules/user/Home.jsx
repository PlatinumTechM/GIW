import { Link } from "react-router-dom";

const categories = [
  {
    id: "natural-diamond",
    title: "Natural Diamonds",
    path: "/natural-diamonds",
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
    path: "/lab-grown-diamonds",
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
    path: "/jewelry",
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
    path: "/lab-grown-jewelry",
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

const Home = () => {
  return (
    <div className="min-h-screen bg-(--bg-primary) pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2 text-center">
          Select Category
        </h1>
        <p className="text-(--text-secondary) text-center mb-8">
          Choose a category to browse our collection
        </p>

        <div className="space-y-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className="card flex items-center justify-between p-4 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${category.iconBg} ${category.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  {category.icon}
                </div>
                <span className="text-lg font-semibold text-(--text-primary)">
                  {category.title}
                </span>
              </div>
              <svg
                className="w-6 h-6 text-(--text-muted) group-hover:text-(--accent-primary) group-hover:translate-x-1 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
