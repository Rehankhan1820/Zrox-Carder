// app/checkout/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    CreditCard,
    CheckCircle,
    Copy,
    Check,
    Shield,
    Zap,
    Clock,
    ChevronRight,
    AlertCircle,
    Sparkles,
    Lock
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const router = useRouter();
    const [cardData, setCardData] = useState(null);
    const [step, setStep] = useState(1);
    const [utr, setUtr] = useState("");
    const [utrError, setUtrError] = useState("");
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationComplete, setVerificationComplete] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("checkout_card");
        if (!stored) {
            router.push("/");
            return;
        }
        setCardData(JSON.parse(stored));
    }, [router]);

    const handleCopyUPI = () => {
        navigator.clipboard.writeText("beast@upi");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmitUTR = () => {
        if (!utr.trim()) {
            setUtrError("Please enter your transaction ID");
            return;
        }
        setUtrError("");
        setIsSubmitting(true);
        
        // Save order with Pending status
        const order = {
            id: Date.now(),
            productName: `${cardData.network.toUpperCase()} Card - ${cardData.card.limit}`,
            cardType: cardData.network.toUpperCase(),
            price: cardData.card.price,
            date: new Date().toLocaleDateString(),
            status: "Pending",
            cardDetails: cardData.card,
            utr: utr,
            orderDate: new Date().toISOString()
        };
        const existingOrders = JSON.parse(localStorage.getItem("task2_orders") || "[]");
        existingOrders.unshift(order);
        localStorage.setItem("task2_orders", JSON.stringify(existingOrders));
        localStorage.removeItem("checkout_card");

        // Simulate verification
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(3);
            // Auto-verify after 5 seconds
            setTimeout(() => {
                setIsVerifying(true);
                setTimeout(() => {
                    setIsVerifying(false);
                    setVerificationComplete(true);
                    // Update order status to Completed
                    const updatedOrders = JSON.parse(localStorage.getItem("task2_orders") || "[]");
                    const updated = updatedOrders.map(o => {
                        if (o.id === order.id) {
                            return { 
                                ...o, 
                                status: "Completed",
                                cardDetails: {
                                    ...o.cardDetails,
                                    cardNumber: generateFakeCardNumber(cardData.network),
                                    cvv: generateFakeCVV(),
                                    holderName: "USA CARD HOLDER"
                                }
                            };
                        }
                        return o;
                    });
                    localStorage.setItem("task2_orders", JSON.stringify(updated));
                }, 3000);
            }, 5000);
        }, 1500);
    };

    const generateFakeCardNumber = (network) => {
        const prefixes = {
            visa: "4",
            mastercard: "5",
            rupay: "6"
        };
        const prefix = prefixes[network] || "4";
        let number = prefix;
        for (let i = 0; i < 15; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number.replace(/(.{4})/g, '$1 ').trim();
    };

    const generateFakeCVV = () => {
        return Math.floor(100 + Math.random() * 900);
    };

    if (!cardData) {
        return (
            <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading checkout...</p>
                </div>
            </div>
        );
    }

    const { card, network } = cardData;

    return (
        <div className="min-h-screen bg-black text-white font-sans p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.push("/")}
                        className="p-2 rounded-lg hover:bg-white/10 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">T2</span>
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Task 2 Diamond
                        </span>
                    </div>
                </div>

                {/* Checkout Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                    <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-purple-400" />
                        Checkout
                    </h1>

                    {/* Steps */}
                    <div className="flex items-center gap-3 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        step === s
                                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                                            : step > s
                                                ? "bg-emerald-500 text-white"
                                                : "bg-white/10 text-gray-400"
                                    }`}
                                >
                                    {step > s ? <Check className="w-4 h-4" /> : s}
                                </div>
                                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-emerald-500" : "bg-white/10"}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Product Summary */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                                {network === "visa" ? "💳" : network === "mastercard" ? "💳" : "🪙"}
                            </span>
                            <span className="text-sm font-semibold text-gray-300 uppercase">{network} · 5 Cards</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Limit {card.limit} · Expiry {card.expiry}</span>
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                {card.price}
                            </span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-medium">Secure Checkout</span>
                                </div>
                                <h2 className="text-lg font-semibold">Scan & Pay via UPI</h2>
                                <p className="text-sm text-gray-400">Use any UPI app (GPay, PhonePe, Paytm, BHIM)</p>

                                <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 rounded-xl p-4 sm:p-6 border border-blue-500/30 text-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl animate-spin-slow" />
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl animate-spin-slow-delay" />

                                    <div className="relative flex items-center justify-center gap-2 mb-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-full">
                                            <Shield className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                                            <span className="text-[10px] sm:text-xs font-medium text-blue-300">Secured Payment</span>
                                        </div>
                                    </div>

                                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20 border-2 border-blue-400/30">
                                        <img
                                            src="/scanner.jpeg"
                                            alt="UPI QR Code"
                                            className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                                            onError={(e) => {
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3EQR Code%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                        <div className="absolute inset-0 overflow-hidden rounded-xl">
                                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white" />
                                    </div>

                                    <div className="relative flex flex-wrap items-center justify-center gap-2">
                                        <span className="text-xs sm:text-sm text-gray-400">UPI ID:</span>
                                        <span className="text-xs sm:text-sm font-semibold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                                            zeroxcarder@slc
                                        </span>
                                        <button
                                            onClick={handleCopyUPI}
                                            className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 transition border border-blue-400/20"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-300" />}
                                        </button>
                                    </div>
                                    {copied && <p className="text-xs text-emerald-400 mt-2 flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Copied!</p>}

                                    <div className="relative mt-3 flex items-center justify-center gap-4 text-[8px] sm:text-[10px] text-blue-300/50">
                                        <span className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            Secure
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                            Encrypted
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                            Verified
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                    <p className="text-xs text-amber-400">
                                        Pay the exact amount <strong>{card.price}</strong>. After successful payment, submit your UTR / transaction reference number in the next step.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition flex items-center justify-center gap-2"
                                >
                                    I've Paid · Enter UTR
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 text-amber-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">Step 2 of 3</span>
                                </div>
                                <h2 className="text-lg font-semibold">Submit UTR / Transaction ID</h2>
                                <p className="text-sm text-gray-400">Enter the UTR number from your payment app</p>

                                <div>
                                    <input
                                        type="text"
                                        value={utr}
                                        maxLength={12}
                                        onChange={(e) => setUtr(e.target.value)}
                                        placeholder="e.g. 1234567890"
                                        className={`w-full px-4 py-3 bg-white/5 border ${utrError ? "border-red-500" : "border-white/10"
                                            } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition`}
                                    />
                                    {utrError && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {utrError}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handleSubmitUTR}
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Payment"
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6 sm:py-8"
                            >
                                {!verificationComplete ? (
                                    <>
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">Order Placed!</h2>
                                        <p className="text-gray-400 text-sm sm:text-base mt-2">
                                            Your order has been placed successfully.
                                        </p>

                                        <div className="mt-4 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                            <div className="flex items-center gap-2 justify-center">
                                                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                                                <p className="text-xs sm:text-sm text-amber-400">
                                                    {isVerifying ? "✅ Verified Successfully!" : "Checking your UTR / Transaction ID..."}
                                                </p>
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                                                {isVerifying 
                                                    ? "Your payment has been verified. Card details are being generated..." 
                                                    : "We are verifying your payment. This usually takes 5-15 seconds."}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                                UTR: <span className="text-white font-mono">{utr}</span>
                                            </p>
                                            {isVerifying && (
                                                <div className="mt-2 flex items-center justify-center gap-2">
                                                    <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-[10px] text-emerald-400/70">Generating card details...</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">✅ Verified Successfully!</h2>
                                        <p className="text-gray-300 text-sm sm:text-base mt-2">
                                            Your UTR has been verified. Here are your card details:
                                        </p>

                                        {/* Fake Card Details */}
                                        <div className="mt-4 p-4 sm:p-5 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-cyan-600/30 rounded-xl border border-blue-500/30">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Lock className="w-4 h-4 text-blue-400" />
                                                    <span className="text-xs font-medium text-blue-300">USA Card Details</span>
                                                </div>
                                                <span className="text-xs text-gray-400">{network.toUpperCase()}</span>
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                                    <span className="text-xs text-gray-400">Card Number</span>
                                                    <span className="text-xs sm:text-sm font-mono text-white font-semibold">
                                                        {generateFakeCardNumber(network)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                                    <span className="text-xs text-gray-400">Card Holder</span>
                                                    <span className="text-xs sm:text-sm font-semibold text-white">USA CARD HOLDER</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                                    <span className="text-xs text-gray-400">Expiry</span>
                                                    <span className="text-xs sm:text-sm font-semibold text-white">{card.expiry}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                                    <span className="text-xs text-gray-400">CVV</span>
                                                    <span className="text-xs sm:text-sm font-mono text-white font-semibold">{generateFakeCVV()}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                                    <span className="text-xs text-gray-400">Limit</span>
                                                    <span className="text-xs sm:text-sm font-semibold text-white">{card.limit}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-center text-[10px] text-blue-300/50">
                                                ⚡ These are sample card details for demonstration purposes
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link
                                        href="/my-orders"
                                        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition text-center"
                                    >
                                        Go to My Orders
                                    </Link>
                                    <Link
                                        href="/#products"
                                        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm sm:text-base font-semibold hover:bg-white/20 transition text-center"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>

                                {!verificationComplete && (
                                    <p className="text-[10px] sm:text-xs text-gray-500 mt-3">
                                        You will receive a confirmation once your UTR is verified.
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-slow-delay {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                @keyframes scan {
                    0% { top: 0; opacity: 1; }
                    50% { top: 100%; opacity: 0.5; }
                    100% { top: 0; opacity: 1; }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
                .animate-spin-slow-delay {
                    animation: spin-slow-delay 10s linear infinite;
                }
                .animate-scan {
                    animation: scan 2.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}