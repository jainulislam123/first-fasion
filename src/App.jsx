import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
} from "react";
import {
  ShoppingBag,
  LayoutDashboard,
  LogOut,
  Search,
  Share2,
  Trash2,
  Edit,
  Save,
  X,
  User,
  Check,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Maximize2,
  Plus,
} from "lucide-react";

// --- CONTEXT DEFINITIONS ---
const ProductContext = createContext();
const AuthContext = createContext();
const NavigationContext = createContext();

// --- PROVIDERS ---

const NavigationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("home");
  const navigate = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };
  return (
    <NavigationContext.Provider value={{ currentPage, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("ecommerce_user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (username, password) => {
    // Check for specific user OR the demo admin credentials mentioned in the UI hint
    if (
      (username === "bikrambhai" && password === "bikram@shop") ||
      (username === "admin" && password === "admin123")
    ) {
      const userData = { username: username, role: "admin" };
      setUser(userData);
      localStorage.setItem("ecommerce_user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecommerce_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Data Generation
  const generateDummyData = () => {
    const fashionImages = [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop", // Saree
      "https://images.pexels.com/photos/8330427/pexels-photo-8330427.jpeg", // Ethnic/Bridal
      "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?q=80&w=600&auto=format&fit=crop", // Kurti
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop", // Western
      "https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg", // Dress
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop", // Gown
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop", // Dress
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600&auto=format&fit=crop", // Black Dress
      "https://images.unsplash.com/photo-1610030468706-9a6dbad49b0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNhcmVlfGVufDB8fDB8fHww", // Casual
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop", // Stylish
      "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FyZWV8ZW58MHx8MHx8fDA%3D", // Modern
      "https://plus.unsplash.com/premium_photo-1682092039530-584ae1d9da7f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FyZWV8ZW58MHx8MHx8fDA%3D", // Saree/Traditional
    ];

    const fashionNames = [
      "Royal Banarasi Silk Saree",
      "Bridal Lehenga Choli",
      "Embroidered Kurti Set",
      "Chic Floral Summer Dress",
      "Elegant Black Evening Gown",
      "Stylish Maxi Dress",
      "Designer Party Wear",
      "Classic Black Cocktail Dress",
      "Casual Denim Jumpsuit",
      "Trendy Fashion Top",
      "Modern Western Outfit",
      "Traditional Kanjivaram Saree",
    ];

    const fashionCategories = [
      "Sarees",
      "Lehengas",
      "Kurtis",
      "Dresses",
      "Gowns",
      "Dresses",
      "Party Wear",
      "Dresses",
      "Western",
      "Tops",
      "Western",
      "Sarees",
    ];

    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: fashionNames[i] || `Premium Cloth ${i + 1}`,
      price:
        [
          4500, 12500, 1850, 1200, 3200, 2100, 2800, 1500, 1950, 850, 2200,
          5500,
        ][i] || Math.floor(Math.random() * 2000) + 500,
      image: fashionImages[i % fashionImages.length],
      description:
        "Elevate your style with this exquisite piece. Crafted with premium quality fabric to ensure comfort and elegance for every occasion. Perfect for the modern woman.",
      category: fashionCategories[i] || "Fashion",
    }));
  };

  useEffect(() => {
    const stored = localStorage.getItem("ecommerce_products_v1");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      const initial = generateDummyData();
      setProducts(initial);
      localStorage.setItem("ecommerce_products_v1", JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("ecommerce_products_v1", JSON.stringify(products));
    }
  }, [products, loading]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      price: parseFloat(product.price),
    };
    setProducts([newProduct, ...products]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, ...updatedData, price: parseFloat(updatedData.price) }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// --- COMPONENTS ---

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { navigate, currentPage } = useContext(NavigationContext);

  const handleLogout = () => {
    logout();
    navigate("home");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div
          className="flex items-center gap-2 text-2xl font-extrabold text-blue-600 cursor-pointer "
          onClick={() => navigate("home")}
        >
          First
          <img
            src="https://i.postimg.cc/cL1VRZCF/firstfaion.png"
            alt="firstfasion"
            className="w-10 h-10 object-contain"
          />
          <span className="w-35">Fashion</span>
        </div>

        {/* Marquee Section */}
        <div className="flex items-center  text-sm md:text-base font-bold text-red-500 cursor-pointer overflow-hidden w-full   py-1 px-2 rounded-lg">
          <marquee>
            ***Shop local, shine global. ***Your local connection to quality.
            ***Near is dear, clear is cleaner. ***Small store, big trust .
          </marquee>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate("home")}
            className={`font-medium transition-colors ${
              currentPage === "home"
                ? "text-blue-600"
                : "text-slate-600 hover:text-blue-600 pl-2"
            }`}
          >
            Shop
          </button>
          <button
            className={`font-medium transition-colors ${
              currentPage === "home"
                ? "text-blue-600"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            <a href="tel:+919064053338" className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
            </a>
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("admin")}
                className={`font-medium transition-colors ${
                  currentPage === "admin"
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("login")}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// ** HERO SLIDER **
const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      id: 1,
      image:
        "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?q=80&w=1170&auto=format&fit=crop",
      title: "New Season Arrivals",
      subtitle: "Check out all the trends",
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/5490975/pexels-photo-5490975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Modern Styles",
      subtitle: "Elevate your wardrobe",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1659614002067-b35ae837c19f?q=80&w=1174&auto=format&fit=crop",
      title: "Traditional Essentials",
      subtitle: "Embrace your roots",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="relative w-full h-[370px] md:h-[550px] overflow-hidden mb-10 bg-slate-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out flex items-center justify-center ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto backdrop-blur-sm bg-black/10 p-8 rounded-2xl">
            <h2 className="text-3xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl mb-8 drop-shadow-md text-slate-100">
              {slide.subtitle}
            </p>
            <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 cursor-pointer">
              <a
                href="https://api.whatsapp.com/send?phone=919064053338&text=hi"
                target="_blank"
                rel="noreferrer"
              >
                Shop Now
              </a>
            </button>
          </div>
        </div>
      ))}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition-all duration-300 z-20"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition-all duration-300 z-20"
        onClick={nextSlide}
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

// ** PRODUCT CARD **
const ProductCard = ({ product, onOpenModal }) => {
  const [imgError, setImgError] = useState(false);

  const handleShare = (e) => {
    e.stopPropagation();

    // Fallback share logic for iframe/embedded environments
    const shareText = `Check out ${product.name} - ₹${product.price} on First Fashion!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: shareText,
          url: shareUrl,
        })
        .catch(console.error);
    } else {
      // Create a temporary textarea to copy to clipboard
      const textArea = document.createElement("textarea");
      textArea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert(
          "Product Info Copied! You can now paste it on Facebook or WhatsApp."
        );
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div
        className="relative h-64 w-full bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onOpenModal(product)}
      >
        <img
          src={
            imgError
              ? `https://ui-avatars.com/api/?name=${product.name}&background=f1f5f9&color=64748b&size=400`
              : product.image
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium">
            <Maximize2 className="w-4 h-4" /> Quick View
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold uppercase rounded-full shadow-sm">
            {product.category || "Item"}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          {product.category || "General"}
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-50">
          <p className="text-xl font-extrabold text-blue-600">
            ₹{parseFloat(product.price).toFixed(2)}
          </p>
          <button
            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ** PRODUCT MODAL **
const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-red-500 rounded-full transition-all z-10 shadow-sm"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center overflow-y-auto bg-white">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider w-fit mb-4">
            {product.category}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            {product.name}
          </h2>
          <p className="text-3xl font-bold text-blue-600 mb-6">
            ₹{parseFloat(product.price).toFixed(2)}
          </p>
          <p className="text-slate-500 leading-relaxed mb-8 text-lg">
            {product.description ||
              "Experience premium quality and elegant design."}
          </p>
          <div className="flex gap-4 mt-auto">
            <button className="flex-1 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 transition-all duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ** LOCATION SECTION **
const LocationSection = () => {
  return (
    <div className="w-full bg-white py-16 md:py-24 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Visit Our Store
          </h2>
          <p className="text-lg text-slate-500">
            Find us at the heart of the city.
          </p>
        </div>
        <div className="w-full h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-lg mb-10 border border-slate-100 bg-slate-100 relative">
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 z-0">
            Loading Map...
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57852.62003698983!2d88.09681203665166!3d25.00729312517396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fafdc4bb4f265f%3A0xd2f3ad3661f39c5a!2sMalda%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1766059966911!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, position: "relative", zIndex: 10 }}
            allowFullScreen=""
            loading="lazy"
            title="Shop Location"
          ></iframe>
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Address</h4>
              <p className="text-slate-500">First Fashion Street, Malda</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Phone</h4>
              <p className="text-slate-500">+91 90640 53338</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Email</h4>
              <p className="text-slate-500">bikramsarkar22291@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ** FOOTER **
const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <ShoppingBag className="w-6 h-6" /> First Fashion
            </div>
            <p className="text-slate-400 leading-relaxed">
              Premium quality products for your modern lifestyle.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Shop", "About Us", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white hover:pl-2 transition-all block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {[
                "Shipping Policy",
                "Returns & Refunds",
                "FAQ",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white hover:pl-2 transition-all block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:-translate-y-1 transition-all text-white"
                >
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} First Fashion. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// --- PAGES ---

const Home = () => {
  const { products, loading } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // Handle Deep Linking from URL parameters
  useEffect(() => {
    if (!loading && products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get("product");
      if (productId) {
        const foundProduct = products.find((p) => p.id === parseInt(productId));
        if (foundProduct) {
          setSelectedProduct(foundProduct);
        }
      }
    }
  }, [loading, products]);

  // Update URL when opening/closing modal
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    // Push new state with query param (simulated for SPA)
    // In a real router, you would use useSearchParams or useNavigate
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "All" || p.category === selectedCategory)
    );
    if (sortOrder === "low") result.sort((a, b) => a.price - b.price);
    else if (sortOrder === "high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, searchTerm, sortOrder, selectedCategory]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">
        Loading catalog...
      </div>
    );

  return (
    <>
      <HeroSlider />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Curated Collection
          </h1>
          <p className="text-lg text-slate-500">
            Discover premium quality items tailored for you.
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Sort by Price</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
      <LocationSection />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </>
  );
};

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } =
    useContext(ProductContext);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const resetForm = () => {
    setFormData({ name: "", price: "", image: "", category: "" });
    setIsEditing(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) updateProduct(isEditing, formData);
    else addProduct(formData);
    resetForm();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800000) {
        alert("Image is too large! Please select an image under 800KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (product) => {
    setFormData(product);
    setIsEditing(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">
            Manage your inventory and pricing.
          </p>
        </div>
        {!showForm && (
          <button
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-all"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mb-10 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="e.g. Leather Satchel"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="">Select Category...</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home</option>
                <option value="Office">Office</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {formData.image && (
                  <div className="w-16 h-16 shrink-0 rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Max 800KB. Upload directly from your device.
              </p>
            </div>
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-5 h-5" />{" "}
                {isEditing ? "Update Product" : "Save Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-slate-500 mb-6">
              This action cannot be undone. Are you sure you want to remove this
              item?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 shadow-md"
                onClick={() => {
                  deleteProduct(deleteId);
                  setDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">
                  Image
                </th>
                <th className="p-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">
                  Product Name
                </th>
                <th className="p-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 font-semibold text-slate-500 text-sm uppercase tracking-wider">
                  Price
                </th>
                <th className="p-4 font-semibold text-slate-500 text-sm uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt="mini"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      onError={(e) =>
                        (e.target.src =
                          "https://ui-avatars.com/api/?background=f1f5f9&color=64748b")
                      }
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      ID: {product.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase">
                      {product.category || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEditClick(product)}
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => setDeleteId(product.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-400">
                    No products available. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);

  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate("admin");
    } else {
      setError("Invalid credentials. Hint: admin / admin123");
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter your username.");
      return;
    }
    if (
      username.toLowerCase() === "admin" ||
      username.toLowerCase() === "bikrambhai"
    ) {
      setSuccess("Reset link sent to registered email.");
      setError("");
    } else {
      setError('Username not found. Try "admin".');
      setSuccess("");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        {view === "login" ? (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-200">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Welcome Back
              </h2>
              <p className="text-slate-500 mt-1">
                Sign in to manage your store
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your User Name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="text-right mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setView("forgot");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5">
                Sign In
              </button>

              <div className="mt-6 text-center text-sm text-slate-400">
                Use <strong className="text-slate-600">admin</strong> /{" "}
                <strong className="text-slate-600">admin123</strong> to test
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Reset Password
              </h2>
              <p className="text-slate-500 mt-1">
                Enter your username to proceed
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                <Check className="w-4 h-4" /> {success}
              </div>
            )}

            {!success ? (
              <form onSubmit={handleReset}>
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                  Send Reset Link
                </button>
              </form>
            ) : null}

            <button
              onClick={() => {
                setView("login");
                setError("");
                setSuccess("");
              }}
              className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const MainLayout = () => {
  const { currentPage } = useContext(NavigationContext);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex-1">
        {currentPage === "home" && <Home />}
        {currentPage === "admin" && <Admin />}
        {currentPage === "login" && <Login />}
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ProductProvider>
          <MainLayout />
        </ProductProvider>
      </AuthProvider>
    </NavigationProvider>
  );
};

export default App;
