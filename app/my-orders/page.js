// app/my-orders/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("task2_orders") || "[]");
    const now = new Date().getTime();
    
    const updatedOrders = storedOrders.map(order => {
      const orderTime = new Date(order.orderDate).getTime();
      const minutesDiff = (now - orderTime) / (1000 * 60);
      
      // Auto-cancel pending orders after 12 hours (720 minutes)
      if (order.status === "Pending" && minutesDiff > 720) {
        return { 
          ...order, 
          status: "Cancelled", 
          cancelReason: "Auto-cancelled: Payment verification timed out (12 hours)" 
        };
      }
      return order;
    });
    
    localStorage.setItem("task2_orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  const refreshOrders = () => {
    setIsRefreshing(true);
    loadOrders();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "Completed": return "Verified";
      case "Pending": return "Pending Verification";
      case "Cancelled": return "Cancelled";
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Completed": return <CheckCircle className="w-3 h-3 inline mr-1" />;
      case "Pending": return <Clock className="w-3 h-3 inline mr-1" />;
      case "Cancelled": return <XCircle className="w-3 h-3 inline mr-1" />;
      default: return <Clock className="w-3 h-3 inline mr-1" />;
    }
  };

  // Generate a fallback order ID if missing
  const generateOrderId = (index) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'BXP-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-3 sm:p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-lg hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
          <button
            onClick={refreshOrders}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs hover:bg-white/10 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Orders Count */}
        <div className="text-sm text-gray-400 mb-4">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl"
          >
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300">No Orders Yet</h3>
            <p className="text-sm text-gray-400 mt-1">Start shopping and build your collection</p>
            <Link
              href="/#products"
              className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/30 transition"
            >
              Browse Cards
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => {
                // Fallback values if order data missing
                const orderId = order.orderId || generateOrderId(index);
                const limit = order.cardLimit || "$285";
                const expiry = order.cardExpiry || "09/2029";
                const utr = order.utr || "56666666666666666666";
                const orderDate = order.date || "24 Jun 2026";
                const orderTime = order.time || "12:59 pm";
                const cardType = order.cardType || "VISA";
                const price = order.price || "₹700";
                const status = order.status || "Pending";
                const productName = order.productName || "5 Cards";
                
                return (
                  <motion.div
                    key={order.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white/5 border rounded-xl p-4 ${
                      status === "Pending" 
                        ? "border-amber-500/30" 
                        : status === "Completed"
                        ? "border-emerald-500/30"
                        : "border-red-500/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Left: Card Type & Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {cardType === "VISA" ? "💳" : cardType === "MASTERCARD" ? "💳" : "🪙"}
                          </span>
                          <span className="font-semibold">{cardType} · {productName}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {orderDate}, {orderTime}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                          <div>
                            <span className="text-gray-400">LIMIT</span>
                            <span className="block font-semibold text-white">{limit}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">EXPIRY</span>
                            <span className="block font-semibold text-white">{expiry}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price, Status, UTR, Order ID */}
                      <div className="flex flex-col items-end gap-1 text-right">
                        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                          {price}
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(status)}`}>
                          {getStatusIcon(status)}
                          {getStatusText(status)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          <span className="text-gray-500">UTR </span>
                          <span className="font-mono">{utr}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">Order ID: </span>
                          <span className="text-xs font-mono text-white">{orderId}</span>
                          <button
                            onClick={() => copyToClipboard(orderId, order.id)}
                            className="p-1 rounded hover:bg-white/10 transition"
                          >
                            {copiedId === order.id ? 
                              <Check className="w-3.5 h-3.5 text-emerald-400" /> : 
                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                            }
                          </button>
                        </div>
                        {status === "Cancelled" && (
                          <Link
                            href="/#products"
                            className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition"
                          >
                            Browse again →
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}