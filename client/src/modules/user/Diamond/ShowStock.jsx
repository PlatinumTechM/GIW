import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";

const ShowStock = ({ type, filters }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stock/${type}`);
        const data = await response.json();
        setItems(data || getMockData(type));
      } catch (error) {
        console.error("Error fetching stock:", error);
        setItems(getMockData(type));
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [type]);

  const getMockData = (category) => {
    const shapes = ["Round", "Oval", "Pear", "Cushion", "Emerald", "Princess"];
    const colors = ["D", "E", "F", "G", "H"];
    const clarities = ["VVS1", "VVS2", "VS1", "VS2"];

    return Array.from({ length: 12 }, (_, i) => ({
      id: `${category}-${i + 1}`,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      carat: (0.5 + Math.random() * 3).toFixed(2),
      color: colors[Math.floor(Math.random() * colors.length)],
      clarity: clarities[Math.floor(Math.random() * clarities.length)],
      cut: "EX",
      polish: "EX",
      symmetry: "EX",
      fluorescence: "None",
      price: Math.floor(5000 + Math.random() * 50000),
      image: `/images/diamond-${(i % 4) + 1}.jpg`,
      available: Math.random() > 0.3,
    }));
  };

  const toggleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filters?.shapes?.length > 0 && !filters.shapes.includes(item.shape)) return false;
    if (filters?.available && !item.available) return false;
    if (filters?.caratMin && parseFloat(item.carat) < parseFloat(filters.caratMin)) return false;
    if (filters?.caratMax && parseFloat(item.carat) > parseFloat(filters.caratMax)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-48 bg-(--bg-tertiary) rounded-t-2xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-(--bg-tertiary) rounded w-3/4" />
              <div className="h-4 bg-(--bg-tertiary) rounded w-1/2" />
              <div className="h-8 bg-(--bg-tertiary) rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-(--border)"
            checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
            onChange={() => {
              if (selectedItems.length === filteredItems.length) {
                setSelectedItems([]);
              } else {
                setSelectedItems(filteredItems.map(item => item.id));
              }
            }}
          />
          <span className="text-sm text-(--text-secondary)">
            Select {selectedItems.length > 0 ? selectedItems.length : "1 - 48"} out of <span className="text-(--text-primary) font-medium">{filteredItems.length.toLocaleString()}</span> Results Found
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-(--bg-tertiary) rounded-lg transition-colors" title="List View">
            <svg className="w-5 h-5 text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="p-2 hover:bg-(--bg-tertiary) rounded-lg transition-colors" title="Grid View">
            <svg className="w-5 h-5 text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 bg-(--bg-tertiary) flex items-center justify-center overflow-hidden">
              <div className="absolute top-3 left-3 z-10">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-(--border)"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </div>
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                <svg className="w-16 h-16 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2L4 8L12 22L20 8L12 2Z" />
                </svg>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-(--text-muted) hover:text-(--error) hover:scale-110 transition-all duration-300">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className={`badge ${item.available ? 'badge-success' : 'badge-warning'}`}>
                  {item.available ? 'Available' : 'On Request'}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <div className="w-2 h-2 rounded-full bg-(--success)"></div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-(--text-primary)">
                  {item.shape} {item.carat}ct {item.color} {item.clarity}
                </h3>
                <button className="p-1 hover:bg-(--bg-tertiary) rounded transition-colors">
                  <svg className="w-4 h-4 text-(--text-muted)" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-(--text-secondary) mb-3">
                {item.cut} · {item.polish} · {item.symmetry} · {item.fluorescence}
              </p>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold text-(--accent-primary)">
                    ${item.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-(--text-muted)">Total Price</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-xl bg-(--bg-tertiary) flex items-center justify-center text-(--text-secondary) hover:bg-(--accent-light) hover:text-(--accent-primary) transition-all duration-300">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-(--accent-primary) flex items-center justify-center text-white hover:bg-(--accent-secondary) transition-all duration-300">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowStock;
