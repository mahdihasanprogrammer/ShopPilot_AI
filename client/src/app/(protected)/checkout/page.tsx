"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { api } from "@/lib/api";
import { getCart, clearCart, getCartTotal, CartItem } from "@/lib/cart";
import {
  FiArrowLeft,
  FiShoppingBag,
  FiCreditCard,
  FiLock,
  FiUser,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiPackage,
} from "react-icons/fi";
import { RiSparklingFill } from "react-icons/ri";

// ---- Stripe loader (lazy — only if publishable key is set) ----
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// ---- Shipping form shape ----
interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const EMPTY_FORM: ShippingForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

// ---- Order summary component ----
function OrderSummary({ cart }: { cart: CartItem[] }) {
  const subtotal = getCartTotal(cart);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h2 className="text-base font-extrabold text-text-neutral mb-5 flex items-center gap-2">
          <FiShoppingBag className="h-4.5 w-4.5 text-primary" />
          Order Summary
        </h2>

        {cart.length === 0 ? (
          <div className="text-center py-8 text-text-neutral/40 text-xs font-semibold">
            <FiPackage className="h-8 w-8 mx-auto mb-2 opacity-30" />
            Your cart is empty
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-12 w-12 rounded-xl object-cover border border-black/[0.04]"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-black/[0.03] flex items-center justify-center">
                    <FiShoppingBag className="h-5 w-5 text-text-neutral/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text-neutral truncate">{item.title}</p>
                  <p className="text-[11px] text-text-neutral/50 font-medium">Qty: {item.qty}</p>
                </div>
                <span className="text-xs font-extrabold text-text-neutral shrink-0">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-black/[0.04] pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-xs text-text-neutral/60 font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-text-neutral/60 font-semibold">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-text-neutral border-t border-black/[0.04] pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Free shipping note */}
      {getCartTotal(cart) < 75 && cart.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs font-semibold text-amber-700">
          Add ${(75 - getCartTotal(cart)).toFixed(2)} more for free shipping!
        </div>
      )}

      {/* Security badge */}
      <div className="flex items-center gap-2 text-[11px] text-text-neutral/40 font-medium px-1">
        <FiLock className="h-3.5 w-3.5 text-primary/40 shrink-0" />
        Payments secured by Stripe. Your card info is never stored on our servers.
      </div>
    </div>
  );
}

// ---- Inner checkout form (needs Stripe context if real Stripe) ----
function CheckoutForm({
  cart,
  onSuccess,
  useSimulated,
}: {
  cart: CartItem[];
  onSuccess: (orderId: string) => void;
  useSimulated: boolean;
}) {
  const stripe = useSimulated ? null : useStripe();
  const elements = useSimulated ? null : useElements();
  const { data: session } = useSession();

  const [form, setForm] = useState<ShippingForm>({
    ...EMPTY_FORM,
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
  });
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [cardError, setCardError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const subtotal = getCartTotal(cart);
  const shipping = subtotal > 75 ? 0 : 9.99;
  const totalAmount = subtotal + shipping;

  function validate(): boolean {
    const e: Partial<ShippingForm> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.zip.trim()) e.zip = "ZIP code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) return;

    setLoading(true);
    setCardError(null);
    setStep("processing");

    try {
      // 1. Create payment intent
      const intentRes = await api.post<{
        clientSecret: string;
        paymentIntentId: string;
        simulated?: boolean;
      }>("/payments/create-payment-intent", {
        amount: Math.round(totalAmount * 100), // cents
        currency: "usd",
      });

      if (!intentRes.success || !intentRes.data) {
        setCardError(intentRes.error || "Failed to create payment intent.");
        setStep("form");
        setLoading(false);
        return;
      }

      const { clientSecret, paymentIntentId, simulated } = intentRes.data;
      let confirmedIntentId = paymentIntentId;

      if (!simulated && stripe && elements) {
        // 2a. Real Stripe confirmation
        const cardEl = elements.getElement(CardElement);
        if (!cardEl) {
          setCardError("Card element not found.");
          setStep("form");
          setLoading(false);
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardEl,
            billing_details: {
              name: form.fullName,
              email: form.email,
            },
          },
        });

        if (error) {
          setCardError(error.message || "Payment failed. Please check your card details.");
          setStep("form");
          setLoading(false);
          return;
        }

        confirmedIntentId = paymentIntent?.id || paymentIntentId;
      }
      // 2b. Simulated — skip actual Stripe confirmation, treat as succeeded

      // 3. Save order
      const orderRes = await api.post<{ _id: string; id: string }>("/orders", {
        items: cart.map((c) => ({
          productId: c.productId,
          title: c.title,
          price: c.price,
          qty: c.qty,
        })),
        totalAmount,
        stripePaymentIntentId: confirmedIntentId,
        shippingAddress: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      });

      if (!orderRes.success || !orderRes.data) {
        setCardError(orderRes.error || "Order could not be placed. Please try again.");
        setStep("form");
        setLoading(false);
        return;
      }

      clearCart();
      setStep("success");
      onSuccess(orderRes.data._id || orderRes.data.id || "");
    } catch (err: any) {
      setCardError(err.message || "Something went wrong.");
      setStep("form");
      setLoading(false);
    }
  };

  const field = (
    name: keyof ShippingForm,
    label: string,
    placeholder: string,
    type = "text",
    colSpan = "col-span-2"
  ) => (
    <div className={colSpan}>
      <label className="block text-[11px] font-bold text-text-neutral/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => {
          setForm((prev) => ({ ...prev, [name]: e.target.value }));
          if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
        }}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-text-neutral placeholder:text-text-neutral/30 focus:outline-none transition-all bg-white/60 ${
          errors[name]
            ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-black/[0.06] focus:border-primary focus:ring-2 focus:ring-primary/10"
        }`}
      />
      {errors[name] && (
        <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
          <FiAlertCircle className="h-3 w-3" /> {errors[name]}
        </p>
      )}
    </div>
  );

  if (step === "processing") {
    return (
      <div className="card-premium p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-bold text-text-neutral">Processing your payment…</p>
        <p className="text-xs text-text-neutral/50 font-medium">Please don't close this page</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping info */}
      <div className="card-premium p-6">
        <h2 className="text-base font-extrabold text-text-neutral mb-5 flex items-center gap-2">
          <FiMapPin className="h-4.5 w-4.5 text-primary" />
          Shipping Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {field("fullName", "Full Name", "Jane Smith", "text", "col-span-2")}
          {field("email", "Email Address", "jane@example.com", "email", "col-span-2 sm:col-span-1")}
          {field("phone", "Phone (optional)", "+1 555 000 0000", "tel", "col-span-2 sm:col-span-1")}
          {field("address", "Street Address", "123 Main Street", "text", "col-span-2")}
          {field("city", "City", "New York", "text", "col-span-2 sm:col-span-1")}
          {field("state", "State / Province", "NY", "text", "col-span-1")}
          {field("zip", "ZIP / Postal Code", "10001", "text", "col-span-1")}
          <div className="col-span-2">
            <label className="block text-[11px] font-bold text-text-neutral/50 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <select
              value={form.country}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
              className="w-full rounded-xl border border-black/[0.06] bg-white/60 px-4 py-3 text-sm font-medium text-text-neutral focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="BD">Bangladesh</option>
              <option value="IN">India</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="card-premium p-6">
        <h2 className="text-base font-extrabold text-text-neutral mb-5 flex items-center gap-2">
          <FiCreditCard className="h-4.5 w-4.5 text-primary" />
          Payment Details
        </h2>

        {useSimulated ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3.5 text-xs font-semibold text-amber-700 space-y-1">
            <p className="font-extrabold">🧪 Test Mode (Simulated)</p>
            <p>No Stripe publishable key set. Payment will be simulated successfully.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Test card hint */}
            <div className="rounded-xl border border-primary/10 bg-primary/[0.03] px-4 py-3 text-xs font-semibold text-primary/80">
              <span className="font-extrabold">Test card:</span>{" "}
              <code className="font-mono bg-primary/10 rounded px-1.5 py-0.5 text-[11px]">
                4242 4242 4242 4242
              </code>
              {" "}· Any future expiry · Any 3-digit CVC
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-neutral/50 uppercase tracking-wider mb-1.5">
                Card Details
              </label>
              <div className="rounded-xl border border-black/[0.06] bg-white/60 px-4 py-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "14px",
                        fontFamily: "var(--font-sans), sans-serif",
                        color: "#1f2937",
                        "::placeholder": { color: "#9ca3af" },
                        iconColor: "#7c3aed",
                      },
                      invalid: { color: "#ef4444", iconColor: "#ef4444" },
                    },
                    hidePostalCode: true,
                  }}
                  onChange={(e) => {
                    if (e.error) setCardError(e.error.message);
                    else setCardError(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {cardError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 flex items-start gap-2">
            <FiAlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {cardError}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || cart.length === 0}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg hover:bg-primary-dark transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        <FiLock className="h-4 w-4" />
        Place Order · ${(getCartTotal(cart) + (getCartTotal(cart) > 75 ? 0 : 9.99)).toFixed(2)}
      </button>
    </form>
  );
}

// ---- Success screen ----
function SuccessScreen({ orderId }: { orderId: string }) {
  const router = useRouter();
  return (
    <div className="card-premium p-12 flex flex-col items-center justify-center gap-6 text-center animate-premium-fade">
      <div className="h-20 w-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        <FiCheckCircle className="h-10 w-10 text-emerald-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-text-neutral">Order Placed!</h2>
        <p className="text-sm text-text-neutral/60 font-medium">
          Thank you for your purchase. We'll email you a confirmation shortly.
        </p>
        {orderId && (
          <p className="text-xs text-text-neutral/40 font-mono mt-1">
            Order ID: #{orderId.slice(-8).toUpperCase()}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={() => router.push("/dashboard/user/orders")}
          className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all"
        >
          View My Orders
        </button>
        <button
          onClick={() => router.push("/products")}
          className="flex-1 rounded-xl border border-black/[0.06] bg-white/70 px-6 py-3 text-sm font-bold text-text-neutral hover:bg-white transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// ---- Page wrapper ----
export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const useSimulated = !stripePublishableKey;

  // Load cart
  useEffect(() => {
    setCart(getCart());
    const sync = () => setCart(getCart());
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  const handleSuccess = useCallback((id: string) => {
    setOrderId(id);
    setSucceeded(true);
  }, []);

  if (isPending) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!session?.user) {
    router.push("/login?callbackUrl=/checkout");
    return null;
  }

  return (
    <main className="flex-1 bg-background min-h-screen">
      {/* Header */}
      <div className="border-b border-black/[0.04] bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/products" className="flex items-center gap-2 text-xs font-bold text-text-neutral/60 hover:text-primary transition-colors">
            <FiArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center gap-1.5">
            <RiSparklingFill className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-base font-bold text-transparent">
              ShopPilot AI
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-neutral/50">
            <FiLock className="h-3.5 w-3.5 text-primary/60" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {succeeded ? (
          <SuccessScreen orderId={orderId} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left: forms */}
            <div>
              {useSimulated ? (
                <CheckoutForm cart={cart} onSuccess={handleSuccess} useSimulated />
              ) : (
                <Elements stripe={stripePromise}>
                  <CheckoutForm cart={cart} onSuccess={handleSuccess} useSimulated={false} />
                </Elements>
              )}
            </div>

            {/* Right: order summary */}
            <div className="lg:sticky lg:top-24">
              <OrderSummary cart={cart} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
