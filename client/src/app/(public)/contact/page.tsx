"use client";

import { useState, FormEvent } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiLoader, FiCheckCircle } from "react-icons/fi";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/contact", { name, email, message });
      if (res.success) {
        toast.success("Message submitted successfully!");
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(res.error || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: FiMail,
      title: "Email Us",
      value: "support@shoppilot.ai",
      desc: "Our response time is typically under 12 hours.",
    },
    {
      icon: FiPhone,
      title: "Call Support",
      value: "+1 (555) 390-1284",
      desc: "Available Monday to Friday, 9am - 6pm EST.",
    },
    {
      icon: FiMapPin,
      title: "Main Office",
      value: "100 Innovation Way, Suite 400",
      desc: "Boston, MA 02110, USA",
    },
    {
      icon: FiClock,
      title: "Support Hours",
      value: "24/7 Virtual Assistant",
      desc: "Live chat assistance is always online.",
    },
  ];

  return (
    <main className="flex-1 bg-background py-12 md:py-20 transition-colors duration-250">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Heading Header */}
        <div className="text-center max-w-xl mx-auto space-y-3 animate-premium-fade">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-heading">
            Get in Touch
          </h1>
          <p className="text-xs md:text-sm text-body/80 font-medium leading-relaxed">
            Have questions about our AI-powered recommendations, order statuses, or checkout processes? Send us a message and our support team will respond shortly.
          </p>
        </div>

        {/* Info Grid vs Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          {/* Contact details columns */}
          <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactDetails.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-5 shadow-xs flex items-start gap-4 transition-colors duration-250"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-muted leading-none">
                      {detail.title}
                    </h3>
                    <p className="text-xs font-bold text-heading">{detail.value}</p>
                    <p className="text-[11px] text-body/70 font-medium leading-normal">
                      {detail.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form wrapper layout */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm flex flex-col justify-center transition-colors duration-250">
            {submitted ? (
              /* Success card display */
              <div className="text-center py-12 space-y-5 animate-premium-fade">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                  <FiCheckCircle className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-heading">Message Sent!</h3>
                  <p className="text-xs text-body/75 max-w-sm mx-auto font-medium">
                    Thank you for contacting ShopPilot. Your message has been saved to our database, and a support representative will follow up via email shortly.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl border border-border hover:bg-bg-secondary px-5 py-2.5 text-xs font-bold text-heading transition-all cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* Standard form input elements */
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name-input" className="text-xs font-black uppercase tracking-wider text-muted">
                      Your Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-bg-secondary px-3.5 py-2.5 text-xs font-semibold text-heading placeholder:text-muted focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email-input" className="text-xs font-black uppercase tracking-wider text-muted">
                      Your Email
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-bg-secondary px-3.5 py-2.5 text-xs font-semibold text-heading placeholder:text-muted focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message-input" className="text-xs font-black uppercase tracking-wider text-muted">
                    Message
                  </label>
                  <textarea
                    id="message-input"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry in detail..."
                    disabled={loading}
                    className="w-full rounded-xl border border-border bg-bg-secondary px-3.5 py-2.5 text-xs font-semibold text-heading placeholder:text-muted focus:border-primary focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="h-4 w-4 animate-spin" />
                        Submitting Inquiry...
                      </>
                    ) : (
                      <>
                        <FiSend className="h-4 w-4" />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
