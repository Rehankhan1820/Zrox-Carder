// app/page.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  CheckCircle,
  Menu,
  X,
  ShoppingBag,
  User,
  LogOut
} from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("visa");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("task2_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("task2_user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  const categories = ["visa", "mastercard", "rupay"];

  const cardData = {
    visa: [
      { id: 1, limit: "$130", expiry: "03/2029", price: "₹500", refundable: true, inStock: true, cardsCount: 2 },

      { id: 2, limit: "$250", expiry: "08/2029", price: "₹850", refundable: true, inStock: false, cardsCount: 0 },

      { id: 3, limit: "$400", expiry: "12/2029", price: "₹1250", refundable: true, inStock: true, cardsCount: 14 },

      { id: 4, limit: "$600", expiry: "05/2030", price: "₹1800", refundable: true, inStock: false, cardsCount: 0, badge: "HOT DEAL" },

      { id: 5, limit: "$850", expiry: "09/2030", price: "₹2600", refundable: true, inStock: true, cardsCount: 18 },

      { id: 6, limit: "$1200", expiry: "02/2031", price: "₹4200", refundable: true, inStock: false, cardsCount: 0 },

      { id: 7, limit: "$1800", expiry: "08/2031", price: "₹6800", refundable: true, inStock: true, cardsCount: 9 },
    ],

    mastercard: [
      { id: 1, limit: "$120", expiry: "04/2029", price: "₹500", refundable: true, inStock: true, cardsCount: 3 },
      { id: 2, limit: "$240", expiry: "10/2029", price: "₹950", refundable: true, inStock: false, cardsCount: 0 },
      { id: 3, limit: "$400", expiry: "01/2030", price: "₹1450", refundable: true, inStock: true, cardsCount: 11 },
      { id: 4, limit: "$600", expiry: "07/2030", price: "₹2250", refundable: true, inStock: false, cardsCount: 0, badge: "BEST VALUE" },
      { id: 5, limit: "$850", expiry: "11/2030", price: "₹3400", refundable: true, inStock: true, cardsCount: 16 },
      { id: 6, limit: "$1300", expiry: "03/2031", price: "₹5100", refundable: true, inStock: false, cardsCount: 0 },
      { id: 7, limit: "$2200", expiry: "09/2031", price: "₹7900", refundable: true, inStock: true, cardsCount: 7 },
    ],

    rupay: [
      { id: 1, limit: "₹9,500", expiry: "05/2029", price: "₹500", refundable: true, inStock: true, cardsCount: 4 },
      { id: 2, limit: "₹15,000", expiry: "11/2029", price: "₹800", refundable: true, inStock: false, cardsCount: 0 },
      { id: 3, limit: "₹30,000", expiry: "03/2030", price: "₹1300", refundable: true, inStock: true, cardsCount: 20 },
      { id: 4, limit: "₹50,000", expiry: "08/2030", price: "₹1900", refundable: true, inStock: false, cardsCount: 0, badge: "TOP SELLER" },
      { id: 5, limit: "₹80,000", expiry: "12/2030", price: "₹2900", refundable: true, inStock: true, cardsCount: 15 },
      { id: 6, limit: "₹1,20,000", expiry: "04/2031", price: "₹4300", refundable: true, inStock: false, cardsCount: 0 },
      { id: 7, limit: "₹2,00,000", expiry: "10/2031", price: "₹7200", refundable: true, inStock: true, cardsCount: 6 },
    ],
  };

  const getNetworkIcon = (category) => {
    const icons = { visa: "💳", mastercard: "💳", rupay: "🪙" };
    return icons[category] || "💳";
  };

  const handleBuyNow = (card, network) => {
    const user = localStorage.getItem("task2_user");
    if (!user) {
      window.location.href = "/login";
      return;
    }
    localStorage.setItem("checkout_card", JSON.stringify({ card, network }));
    window.location.href = "/checkout";
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Task 2 Diamond"
                  className="h-14 w-14 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hidden sm:inline">
                  Task 2 Diamond
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
              {isLoggedIn && (
                <Link href="/my-orders" className="text-gray-300 hover:text-white transition flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  My Orders
                </Link>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-gray-300 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {user?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    <LogOut className="w-4 h-4 inline mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition">
                    Login
                  </Link>
                  <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/30 transition">
                    Signup
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-b border-white/10"
            >
              <div className="px-4 py-4 space-y-3">
                <Link href="/" className="block text-gray-300 hover:text-white transition" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                {isLoggedIn && (
                  <Link href="/my-orders" className="block text-gray-300 hover:text-white transition flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingBag className="w-4 h-4" />
                    My Orders
                  </Link>
                )}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  {isLoggedIn ? (
                    <>
                      <span className="px-4 py-2 text-center text-sm text-gray-300">👋 {user?.name}</span>
                      <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="px-4 py-2 text-center text-sm font-medium bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="px-4 py-2 text-center text-sm font-medium bg-white/10 rounded-lg hover:bg-white/20 transition" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                      <Link href="/signup" className="px-4 py-2 text-center text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white hover:shadow-lg transition" onClick={() => setIsMenuOpen(false)}>
                        Signup
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Task 2 Diamond"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Premium Digital
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Card Marketplace
              </span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Fast Delivery • Secure Access • Trusted by Thousands of Customers
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#products"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 group"
              >
                Explore Cards
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> 10,000+ Cards Sold</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> 4.9 ★ Rating</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> 24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CARD CATEGORY SECTION ===== */}
      <section id="products" className="py-16 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Select Card Type & Package
            </h2>
            <p className="text-gray-400">Choose your preferred card network</p>
          </div>
          <div className="mb-8 text-center">
            <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-purple-500/30">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                🚀 NEW STOCK UPDATE
              </span>
              <p className="text-gray-300 text-sm mt-1">
                Fresh inventory has arrived. Limited stock available on selected cards.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
              >
                <span className="mr-2">{getNetworkIcon(cat)}</span>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {cardData[activeCategory].map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -8 }}
                  className={`
                    group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 
                    transition-all duration-300 hover:shadow-xl 
                    ${card.inStock ? "hover:border-purple-500/50" : "border-red-500/20"}
                    ${card.badge
                      ? "border-blue-400/60 shadow-[0_0_30px_rgba(59,130,246,0.25)] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] border"
                      : "border border-white/10 hover:shadow-purple-500/10"
                    }
                  `}
                >
                  {card.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white">
                      {card.badge}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getNetworkIcon(activeCategory)}</span>
                        <span className="text-xs font-medium text-gray-500 uppercase">{activeCategory}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {card.inStock ? `${card.cardsCount} Cards` : "0 Cards"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {card.refundable && (
                        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Refundable</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${card.inStock
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-red-400 bg-red-400/10"
                        }`}>
                        {card.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Limit</span>
                      <span className="text-xl font-bold text-white">{card.limit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Expiry</span>
                      <span className="text-white font-medium">{card.expiry}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-gray-400 text-sm">Price</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        {card.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyNow(card, activeCategory)}
                    disabled={!card.inStock}
                    className={`w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${card.inStock
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/30"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {card.inStock ? "Buy Now" : "Out of Stock"}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}