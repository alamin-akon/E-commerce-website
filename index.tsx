
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  MessageSquare,
  Package,
  Home,
  Smartphone,
  Utensils,
  Watch,
  User,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Lock,
  CreditCard,
  CheckCircle2,
  Zap,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Bell,
  Send
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---

type Page = 'home' | 'shop' | 'about' | 'contact' | 'privacy' | 'login' | 'checkout' | 'product-detail' | 'dashboard' | 'wishlist';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  benefits: string[];
}

interface CartItem extends Product {
  quantity: number;
}

interface UserProfile {
  name: string;
  email: string;
  orders: number;
}

// --- Enhanced Mock Data (More unique images) ---

const generateMockProducts = (): Product[] => {
  const categories = ["Electronics", "Kitchen", "Home", "Fashion", "Beauty", "Health"];
  const imageIds = [
    "photo-1523275335684-37898b6baf30", "photo-1505740420928-5e560c06d30e", 
    "photo-1542291026-7eec264c27ff", "photo-1572635196237-14b3f281503f", 
    "photo-1584990344610-52d12f719509", "photo-1546868871-70ca48370701", 
    "photo-1570222020676-00392ece874a", "photo-1511467687858-23d96c32e4ae", 
    "photo-1558317374-067fb5f30001", "photo-1503602642458-232111445657",
    "photo-1627123430984-71659a97a240", "photo-1581655353564-df123a1eb820",
    "photo-1526170375885-4d8ecf77b99f", "photo-1491553895911-0055eca6402d",
    "photo-1541099649105-f69ad21f3246", "photo-1512496015851-a90fb38ba796"
  ];

  const productNames = [
    "Premium Cookware", "Smart Watch Pro", "Electric Juicer", "Mechanical Keyboard",
    "Handheld Vacuum", "Noise Cancelling Headphones", "Non-stick Pan", "Power Bank",
    "Luxury Wallet", "Cotton Polo", "Digital Camera", "Running Shoes",
    "Modern Chair", "Classic Sneakers", "Canvas Backpack", "Smartphone S23"
  ];

  const products: Product[] = [];
  for (let i = 0; i < 52; i++) {
    const imgIndex = i % imageIds.length;
    const nameIndex = i % productNames.length;
    products.push({
      id: i + 1,
      name: `${productNames[nameIndex]} ${i > 15 ? `v${Math.floor(i/10)}` : ''}`,
      price: 1200 + (i * 150),
      originalPrice: 1800 + (i * 150),
      image: `https://images.unsplash.com/${imageIds[imgIndex]}?w=600&h=600&fit=crop`,
      category: categories[i % categories.length],
      rating: 4 + (Math.random() * 1),
      reviews: Math.floor(Math.random() * 500) + 10,
      badge: i % 7 === 0 ? "Hot" : (i % 5 === 0 ? "New" : undefined),
      description: "Experience premium quality with this top-rated product. Designed for durability and high performance, it offers exceptional value for daily use in Bangladeshi households.",
      benefits: [
        "High-quality material for long-lasting use",
        "Energy efficient design",
        "Easy to clean and maintain",
        "1-year official warranty included",
        "Best price guaranteed in the market"
      ]
    });
  }
  return products;
};

const PRODUCTS = generateMockProducts();

// --- Sub-Components ---

const StarRating = ({ rating, size = 12 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={size} 
        fill={i < Math.floor(rating) ? "#fbbf24" : "none"} 
        className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-200"}
      />
    ))}
  </div>
);

// --- Revised ProductCard Component ---
const ProductCard = ({ 
  product, 
  onAddToCart, 
  onBuyNow, 
  isWishlisted, 
  onToggleWishlist 
}: { 
  product: Product; 
  onAddToCart: (p: Product) => void; 
  onBuyNow: (p: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
}) => (
  <div className="group bg-white rounded-[2.5rem] p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2 relative h-full flex flex-col">
    {product.badge && (
      <span className="absolute top-8 left-8 z-10 bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
        {product.badge}
      </span>
    )}
    <button 
      onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
      className={`absolute top-8 right-8 z-10 p-2.5 rounded-2xl transition-all shadow-md ${isWishlisted ? 'bg-rose-600 text-white' : 'bg-white text-slate-400 hover:text-rose-600'}`}
    >
      <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
    </button>
    <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-gray-50 relative">
      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
    </div>
    <div className="px-2 flex-1 flex flex-col">
      <div className="flex items-center gap-1 mb-2">
        <StarRating rating={product.rating} />
        <span className="text-[9px] text-gray-400 font-bold">({product.reviews})</span>
      </div>
      <h4 className="font-black text-slate-900 text-sm mb-3 line-clamp-1 group-hover:text-rose-600 transition-colors">{product.name}</h4>
      <div className="flex items-center justify-between mt-auto mb-4">
        <div className="flex flex-col">
          <span className="text-lg font-black text-rose-600">৳{product.price}</span>
          <span className="text-[10px] text-gray-300 line-through font-bold">৳{product.originalPrice}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="bg-gray-100 text-slate-900 px-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={14} /> Cart
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
          className="bg-rose-600 text-white px-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
        >
          <Zap size={14} /> Buy Now
        </button>
      </div>
    </div>
  </div>
);

// --- New Dashboard Component ---
const Dashboard = ({ user, onLogout }: { user: UserProfile; onLogout: () => void }) => (
  <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border text-center">
          <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-white text-3xl font-black">
            {user.name[0]}
          </div>
          <h3 className="font-black text-slate-900">{user.name}</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Premium Member</p>
        </div>
        <nav className="bg-white rounded-[2rem] shadow-sm border p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 font-black rounded-xl">
            <LayoutDashboard size={18} /> <span className="text-sm">Overview</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
            <ShoppingBag size={18} /> <span className="text-sm">My Orders</span>
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all mt-4 border-t pt-4">
            <LogOut size={18} /> <span className="text-sm">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><ShoppingBag size={24} /></div>
            <div>
              <p className="text-2xl font-black">{user.orders}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border flex items-center gap-4">
            <div className="bg-rose-50 p-4 rounded-2xl text-rose-600"><Heart size={24} /></div>
            <div>
              <p className="text-2xl font-black">15</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wishlist Items</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border flex items-center gap-4">
            <div className="bg-green-50 p-4 rounded-2xl text-green-600"><Truck size={24} /></div>
            <div>
              <p className="text-2xl font-black">2</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">On Delivery</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border">
          <h3 className="text-xl font-black mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-2xl hover:border-rose-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-xl"><Package size={20} className="text-gray-400" /></div>
                  <div>
                    <h4 className="font-bold text-sm">Order #BD-982{i}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Processing Order</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-rose-600">৳2,450</p>
                  <p className="text-[10px] text-gray-400 font-bold">Oct {20+i}, 2023</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);

// --- Sidebar Component Fix ---
const Sidebar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  isOpen, 
  onClose 
}: { 
  selectedCategory: string; 
  setSelectedCategory: (c: string) => void; 
  isOpen: boolean;
  onClose: () => void;
}) => {
  const categories = ["All", "Electronics", "Kitchen", "Home", "Fashion", "Beauty", "Health"];
  
  return (
    <div className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:block ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={onClose}></div>
      <aside className="relative w-72 h-full bg-white lg:bg-transparent lg:w-64 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-10 lg:hidden">
           <h2 className="font-black text-xl">Filter</h2>
           <button onClick={onClose} className="p-2"><X size={24} /></button>
        </div>
        <div className="space-y-10">
          <div>
            <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-6">Categories</h4>
            <div className="space-y-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); onClose(); }}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-xl' : 'hover:bg-gray-100 text-slate-500'}`}
                >
                  {cat}
                  <ChevronRight size={14} className={selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity'} />
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white">
            <h4 className="font-black text-xs mb-4">Fast Delivery</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-bold mb-6">Free shipping on orders over ৳5000 in Dhaka city.</p>
            <Truck className="text-rose-600" size={32} />
          </div>
        </div>
      </aside>
    </div>
  );
};

// --- CartDrawer Component Fix ---
const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onRemove, 
  onCheckout 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose}></div>
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-8 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-rose-50 p-2 rounded-xl text-rose-600"><ShoppingCart size={20} /></div>
            <h2 className="text-xl font-black">Your Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-gray-100 mb-6" />
              <p className="text-gray-400 font-bold">Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm text-slate-900 truncate">{item.name}</h4>
                  <p className="text-rose-600 font-black text-xs mt-1">৳{item.price}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center bg-gray-50 rounded-lg p-1">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 hover:text-rose-600"><Minus size={14} /></button>
                      <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 hover:text-rose-600"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-gray-50 border-t space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">Order Total</span>
              <span className="text-2xl font-black text-slate-900">৳{total}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-rose-600 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-4"
            >
              PROCEED TO CHECKOUT <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- AIAssistant Component Fix ---
const AIAssistant = ({ products }: { products: Product[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Use the correct GoogleGenAI initialization and API call as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const productContext = products.slice(0, 10).map(p => `- ${p.name}: ৳${p.price}`).join('\n');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are a helpful, professional AI assistant for "SawariBD", a premium online store in Bangladesh.
          Keep responses concise and friendly. Help with product discovery and shipping info.
          Available Products Example:
          ${productContext}
          Shipping: ৳100 in Dhaka. Delivery: 2-3 days.`,
        }
      });

      // Extract text directly from the response object
      const aiText = response.text || "I'm sorry, I couldn't process your request right now.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my brain! Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[90] w-16 h-16 bg-rose-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        <span className="absolute right-20 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest pointer-events-none">Assistant</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[90] w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-[3rem] shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-950 p-6 text-white flex items-center gap-4">
             <div className="bg-rose-600 p-2.5 rounded-2xl"><Zap size={20} /></div>
             <div>
               <h4 className="font-black text-sm">Sawari Assistant</h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini</p>
             </div>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">👋 Hi! I'm the SawariBD AI. I can help you find products or answer store-related questions. How can I help?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-rose-600 text-white rounded-tr-none' : 'bg-white text-slate-800 shadow-sm border rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none shadow-sm border flex gap-1">
                  <div className="w-1.5 h-1.5 bg-rose-200 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl border focus-within:border-rose-600 transition-colors">
              <input 
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold px-3"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- App Main Component ---

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Home only shows 8 products
  const homeProductsSlice = useMemo(() => PRODUCTS.slice(0, 8), []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const wishlistProducts = useMemo(() => 
    PRODUCTS.filter(p => wishlistIds.includes(p.id))
  , [wishlistIds]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const buyNow = (product: Product) => {
    addToCart(product);
    navigate('checkout');
  };

  const toggleWishlist = (product: Product) => {
    setWishlistIds(prev => 
      prev.includes(product.id) 
        ? prev.filter(id => id !== product.id) 
        : [...prev, product.id]
    );
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const loginUser = () => {
    setCurrentUser({ name: "Rifat Ahmed", email: "rifat@sawaribd.com", orders: 12 });
    navigate('dashboard');
  };

  const renderContent = () => {
    if (currentPage === 'product-detail' && selectedProduct) {
      return (
        <ProductDetailView 
          product={selectedProduct} 
          onAddToCart={addToCart} 
          onBack={() => navigate('shop')} 
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return currentUser ? (
          <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />
        ) : (
          <LoginPage onBack={() => navigate('home')} onLogin={loginUser} />
        );
      case 'wishlist':
        return (
          <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500">
             <div className="text-center mb-12">
                <Heart className="mx-auto text-rose-600 mb-4" size={48} fill="currentColor" />
                <h2 className="text-4xl font-black text-slate-900">Your Wishlist</h2>
                <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-xs">Saved items you love</p>
             </div>
             {wishlistProducts.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed">
                 <ShoppingBag size={64} className="mx-auto text-gray-100 mb-6" />
                 <h4 className="text-xl font-black text-gray-500">Nothing here yet</h4>
                 <button onClick={() => navigate('shop')} className="mt-6 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Browse Catalog</button>
               </div>
             ) : (
               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                 {wishlistProducts.map(p => (
                   <ProductCard 
                     key={p.id} 
                     product={p} 
                     onAddToCart={addToCart} 
                     onBuyNow={buyNow}
                     isWishlisted={true}
                     onToggleWishlist={toggleWishlist}
                   />
                 ))}
               </div>
             )}
          </div>
        );
      case 'login': return <LoginPage onBack={() => navigate('home')} onLogin={loginUser} />;
      case 'checkout': return <CheckoutPage cart={cart} total={total} onBack={() => navigate('shop')} />;
      case 'contact': return <ContactPage />;
      case 'about': return <AboutPage />;
      case 'privacy': return <PrivacyPage />;
      case 'shop':
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Full Catalog</h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-5 py-2.5 rounded-full border">{filteredProducts.length} Items</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                    onBuyNow={buyNow}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 'home':
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 space-y-16">
              <div className="relative rounded-[3rem] overflow-hidden h-[250px] sm:h-[450px] group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop" 
                  className="w-full h-full object-cover brightness-[0.5] group-hover:scale-105 transition-transform duration-[4000ms]" 
                  alt="Banner"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-10 sm:px-20 text-white">
                  <span className="bg-rose-600 w-fit px-5 py-2 rounded-full text-[10px] font-black mb-8 animate-pulse tracking-[0.2em] shadow-2xl uppercase">Official SawariBD Store</span>
                  <h2 className="text-4xl sm:text-8xl font-black mb-8 tracking-tighter leading-[0.85]">ELEVATE<br/>YOUR HOME.</h2>
                  <div className="flex gap-4">
                    <button onClick={() => navigate('shop')} className="bg-white text-slate-900 px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-2xl flex items-center gap-4 group/btn">
                      EXPLORE SHOP <ArrowRight size={22} className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Trending Selection</h3>
                    <div className="h-1.5 w-12 bg-rose-600 rounded-full mt-2"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                  {homeProductsSlice.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                      onBuyNow={buyNow}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
                <div className="text-center mt-12">
                   <button onClick={() => navigate('shop')} className="px-10 py-4 border-2 border-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">View Full Catalog</button>
                </div>
              </div>

              <div className="py-12 bg-gray-50/50 rounded-[4rem] px-8">
                <div className="text-center mb-12">
                  <span className="text-rose-600 font-black uppercase tracking-[0.3em] text-[10px]">What Customers Say</span>
                  <h3 className="text-3xl font-black text-slate-900 mt-4">Top Rated Experiences</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {REVIEWS.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={review.avatar} className="w-12 h-12 rounded-2xl border" alt={review.user} />
                        <div>
                          <h4 className="text-sm font-black text-slate-800">{review.user}</h4>
                          <p className="text-[10px] text-gray-400 font-bold">{review.date}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                      <p className="text-sm text-gray-500 mt-4 leading-relaxed font-medium italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-rose-600 selection:text-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4 px-4 sm:px-8">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600"><Menu size={24} /></button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
              <div className="bg-rose-600 p-2 rounded-xl">
                <Package className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-black tracking-tighter hidden sm:block">SAWARI<span className="text-rose-600">BD</span></h1>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-2xl py-3.5 pl-14 pr-6 focus:ring-2 focus:ring-rose-500/20 text-sm font-bold placeholder:text-gray-400 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={() => currentUser ? navigate('dashboard') : navigate('login')} 
              className="p-2 text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-2"
            >
              <User size={22} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
            </button>
            <button onClick={() => navigate('wishlist')} className="p-2 text-slate-600 hover:text-rose-600 transition-colors relative">
              <Heart size={22} fill={wishlistIds.length > 0 ? "currentColor" : "none"} className={wishlistIds.length > 0 ? "text-rose-600" : ""} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistIds.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-slate-600 hover:text-rose-600 transition-colors relative group">
              <ShoppingCart size={22} />
              {cart.reduce((sum, i) => sum + i.quantity, 0) > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <footer className="bg-slate-950 text-white mt-20 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <div className="bg-rose-600 p-2.5 rounded-2xl">
                  <Package className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-black tracking-tighter">SAWARI<span className="text-rose-600">BD</span></h1>
              </div>
              <p className="text-slate-500 text-sm leading-[2] max-w-xs font-medium">
                Bangladesh's leading premium online destination. We bring you global quality with local trust. Every order is a promise.
              </p>
            </div>
            
            <div>
              <h4 className="font-black mb-10 text-rose-500 uppercase tracking-[0.2em] text-[10px]">Our Store</h4>
              <ul className="space-y-5 text-slate-500 text-sm font-bold">
                <li><button onClick={() => navigate('shop')} className="hover:text-white transition-colors">Catalog</button></li>
                <li><button onClick={() => navigate('wishlist')} className="hover:text-white transition-colors">Wishlist</button></li>
                <li><button onClick={() => navigate('dashboard')} className="hover:text-white transition-colors">Track Order</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-10 text-rose-500 uppercase tracking-[0.2em] text-[10px]">Information</h4>
              <ul className="space-y-5 text-slate-500 text-sm font-bold">
                <li><button onClick={() => navigate('about')} className="hover:text-white transition-colors">Our Story</button></li>
                <li><button onClick={() => navigate('contact')} className="hover:text-white transition-colors">Contact Center</button></li>
                <li><button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-10 text-rose-500 uppercase tracking-[0.2em] text-[10px]">Newsletter</h4>
              <p className="text-slate-500 text-xs mb-8 leading-relaxed font-bold">Get weekly updates on new arrivals and exclusive deals in Bangladesh.</p>
              <div className="flex gap-2 p-1.5 bg-slate-900 border border-slate-900 rounded-2xl focus-within:border-rose-600 transition-colors">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-transparent border-none rounded-xl text-sm flex-1 px-4 focus:ring-0 placeholder:text-slate-700 font-bold"
                />
                <button className="p-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all">
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
            <p>© 2024 SawariBD Official. Built with Gemini AI.</p>
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQty={(id, delta) => {
          setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
        }}
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
        onCheckout={() => { setIsCartOpen(false); navigate('checkout'); }}
      />

      <AIAssistant products={PRODUCTS} />
    </div>
  );
};

// --- Helper Components ---

const LoginPage = ({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) => (
  <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100">
      <div className="text-center mb-10">
        <div className="bg-rose-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-rose-600">
          <User size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Sign In</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-3">Access Bangladesh's Premium Shop</p>
      </div>
      <div className="space-y-6">
        <input type="email" placeholder="Email Address" className="w-full px-6 py-5 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 font-bold text-sm" />
        <input type="password" placeholder="Secure Password" className="w-full px-6 py-5 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-rose-500 font-bold text-sm" />
        <button onClick={onLogin} className="w-full py-6 bg-rose-600 text-white font-black rounded-3xl shadow-xl hover:bg-rose-700 transition-all uppercase tracking-[0.2em] text-xs">LOG IN NOW</button>
      </div>
    </div>
    <button onClick={onBack} className="mt-10 flex items-center gap-2 text-gray-400 hover:text-rose-600 mx-auto transition-colors font-black uppercase tracking-widest text-[10px]">
      <ArrowRight size={18} className="rotate-180" /> Back to Home
    </button>
  </div>
);

const CheckoutPage = ({ cart, total, onBack }: { cart: CartItem[]; total: number; onBack: () => void }) => (
  <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
    <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-rose-600 mb-10 font-black uppercase tracking-widest text-[10px]">
      <ArrowRight size={20} className="rotate-180" /> Modify Shopping Cart
    </button>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border">
          <h3 className="text-xl font-black mb-8">Shipping Information</h3>
          <div className="space-y-4">
            <input placeholder="Full Name" className="w-full text-white p-4 border rounded-2xl" />
            <input placeholder="Phone Number" className="w-full text-white p-4 border rounded-2xl" />
            <textarea placeholder="Address" className="w-full text-white p-4 border rounded-2xl" rows={3} />
          </div>
        </div>
      </div>
      <div className="bg-slate-950 p-10 rounded-[3rem] text-white">
        <h3 className="text-xl font-black mb-8">Order Summary</h3>
        <div className="space-y-4 border-b border-slate-900 pb-8 mb-8">
           <div className="flex justify-between text-sm text-slate-400"><span>Subtotal</span><span>৳{total}</span></div>
           <div className="flex justify-between text-sm text-slate-400"><span>Delivery</span><span>৳100</span></div>
        </div>
        <div className="flex justify-between text-2xl font-black text-rose-600"><span>Total</span><span>৳{total + 100}</span></div>
        <button className="w-full mt-10 py-5 bg-rose-600 text-white font-black rounded-2xl shadow-xl hover:bg-rose-700 transition-all">PLACE ORDER</button>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="max-w-4xl mx-auto py-20 px-4 text-center animate-in fade-in duration-700">
    <h2 className="text-5xl font-black text-slate-900 mb-8">Get In Touch</h2>
    <p className="text-gray-500 mb-16">We're here to help with any questions about our products or your orders.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
      <div className="p-10 bg-white rounded-3xl border text-center shadow-sm">
        <Mail className="mx-auto text-rose-600 mb-4" />
        <h4 className="font-bold">Email Support</h4>
        <p className="text-xs text-gray-400">help@sawaribd.com</p>
      </div>
      <div className="p-10 bg-white rounded-3xl border text-center shadow-sm">
        <Phone className="mx-auto text-rose-600 mb-4" />
        <h4 className="font-bold">Hotline</h4>
        <p className="text-xs text-gray-400">+880 1800 555 999</p>
      </div>
      <div className="p-10 bg-white rounded-3xl border text-center shadow-sm">
        <MapPin className="mx-auto text-rose-600 mb-4" />
        <h4 className="font-bold">Uttara Office</h4>
        <p className="text-xs text-gray-400">Dhaka, Bangladesh</p>
      </div>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="max-w-3xl mx-auto py-20 px-4 text-center animate-in fade-in duration-700">
    <h2 className="text-5xl font-black mb-8">Quality You Trust.</h2>
    <p className="text-lg text-slate-500 leading-relaxed">SawariBD is more than just a shop. We are a team of curators dedicated to bringing premium global brands to the doors of Bangladeshi families. Every product we sell goes through a rigorous quality check before it reaches your home.</p>
  </div>
);

const PrivacyPage = () => (
  <div className="max-w-2xl mx-auto py-20 px-4 text-center animate-in fade-in duration-700">
    <h2 className="text-4xl font-black mb-8">Privacy Policy</h2>
    <p className="text-gray-500 leading-relaxed font-medium">Your data is safe with us. We use encrypted payment gateways and never store your personal details without consent. Our AI assistant uses anonymous sessions to help improve your shopping experience.</p>
  </div>
);

const ProductDetailView = ({ product, onAddToCart, onBack }: { product: Product; onAddToCart: (p: Product) => void; onBack: () => void }) => (
  <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors font-bold group">
      <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back
    </button>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-[4rem] shadow-xl border border-gray-50">
      <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border">
        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
      </div>
      <div className="flex flex-col py-4">
        <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-rose-100 w-fit">
          {product.category}
        </span>
        <h1 className="text-4xl font-black text-slate-900 mt-6 mb-4">{product.name}</h1>
        <div className="flex items-center gap-4 mb-8">
          <StarRating rating={product.rating} size={20} />
          <span className="text-xs text-gray-400 font-bold">{product.reviews} Global Reviews</span>
        </div>
        <div className="text-4xl font-black text-rose-600 mb-10">৳{product.price}</div>
        <div className="p-8 bg-gray-50 rounded-[2.5rem] mb-10 border">
          <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
            <Zap size={18} className="text-rose-500" /> Essential Benefits
          </h4>
          <ul className="space-y-3">
            {product.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => onAddToCart(product)} className="w-full py-6 bg-rose-600 text-white font-black rounded-3xl shadow-xl hover:bg-rose-700 transition-all uppercase tracking-widest text-xs">ADD TO CART</button>
      </div>
    </div>
  </div>
);

// --- Mock Reviews ---
const REVIEWS = [
  { id: 1, user: "Sakib Al Hasan", avatar: "https://i.pravatar.cc/150?u=sakib", rating: 5, date: "2 days ago", comment: "Excellent quality product. Fast delivery in Dhaka." },
  { id: 2, user: "Nusrat Jahan", avatar: "https://i.pravatar.cc/150?u=nusrat", rating: 4, date: "1 week ago", comment: "The kitchen set is really premium. Value for money." },
  { id: 3, user: "Tanvir Ahmed", avatar: "https://i.pravatar.cc/150?u=tanvir", rating: 5, date: "3 days ago", comment: "Impressive packaging and genuine products." },
  { id: 4, user: "Farhana Islam", avatar: "https://i.pravatar.cc/150?u=farhana", rating: 5, date: "5 days ago", comment: "Best online shopping experience in BD so far." }
];

// Safe mounting
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
