"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, FileDown, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getChatbotResponse, peekNamedPropertyIds } from "@/lib/chatbot/getResponse";
import { submitChatbotInquiry } from "@/lib/chatbot/inquiry";
import { applyLivePropertyDetail, getStaticChatbotKnowledge, mergeLiveChatbotKnowledge } from "@/lib/chatbot/knowledge";
import { hasInquiryContact, hasPriceIntent, parseChatContact } from "@/lib/chatbot/pricing";
import { normalizeChatText } from "@/lib/chatbot/text";
import type { ChatLink, ChatbotInquiryDraft, ChatbotKnowledge } from "@/lib/chatbot/types";
import { loadSavedContact } from "@/lib/leads/contactAutofill";
import { BOOK_VISIT_HASH, useBookSiteVisit } from "@/components/BookSiteVisitContext";

type ChatMessage = {
  type: "user" | "bot";
  content: string;
  links?: ChatLink[];
};

const isBookVisitHref = (href: string) =>
  href === BOOK_VISIT_HASH || href.startsWith("/book-site-visit") || href.startsWith("/?book-visit");

const Chatbot = () => {
  const { openBookSiteVisit } = useBookSiteVisit();
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [knowledge, setKnowledge] = useState<ChatbotKnowledge>(() => getStaticChatbotKnowledge());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      content:
        "Hello! I'm IAPL, your virtual assistant. Ask me about any project, blog article, prices, payment plans — or download our listings, company profile, and maps.",
      links: [
        { label: "Browse properties", href: "/for-sale" },
        { label: "Blogs & guides", href: "/iapl-insider/blogs" },
        { label: "Downloads", href: "/testimonials/downloads" },
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [pendingInquiry, setPendingInquiry] = useState<ChatbotInquiryDraft | null>(null);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "" });
  const [inquiryBusy, setInquiryBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const knowledgeRef = useRef(knowledge);
  knowledgeRef.current = knowledge;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show popup when user first accesses the website
  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("iapl-popup-shown");
    if (!popupShown && !isOpen) {
      setShowPopup(true);
      sessionStorage.setItem("iapl-popup-shown", "true");
    }
  }, [isOpen]);

  // Hide popup when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowPopup(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;
    const loadLiveKnowledge = async () => {
      try {
        const [propertiesRes, downloadsRes, blogsRes, newsRes] = await Promise.all([
          fetch("/api/content/properties"),
          fetch("/api/content/downloads"),
          fetch("/api/content/blogs"),
          fetch("/api/content/news"),
        ]);
        const propertiesJson = propertiesRes.ok ? await propertiesRes.json() : {};
        const downloadsJson = downloadsRes.ok ? await downloadsRes.json() : {};
        const blogsJson = blogsRes.ok ? await blogsRes.json() : {};
        const newsJson = newsRes.ok ? await newsRes.json() : {};
        if (cancelled) return;
        setKnowledge(
          mergeLiveChatbotKnowledge(
            getStaticChatbotKnowledge(),
            propertiesJson.properties,
            downloadsJson.items,
            blogsJson.posts,
            newsJson.items
          )
        );
      } catch {
        // Static catalog already loaded.
      }
    };
    void loadLiveKnowledge();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshLiveKnowledge = async (propertyId?: number) => {
    try {
      const [propertiesRes, downloadsRes, blogsRes, newsRes] = await Promise.all([
        fetch("/api/content/properties", { cache: "no-store" }),
        fetch("/api/content/downloads", { cache: "no-store" }),
        fetch("/api/content/blogs", { cache: "no-store" }),
        fetch("/api/content/news", { cache: "no-store" }),
      ]);
      const propertiesJson = propertiesRes.ok ? await propertiesRes.json() : {};
      const downloadsJson = downloadsRes.ok ? await downloadsRes.json() : {};
      const blogsJson = blogsRes.ok ? await blogsRes.json() : {};
      const newsJson = newsRes.ok ? await newsRes.json() : {};
      let next = mergeLiveChatbotKnowledge(
        getStaticChatbotKnowledge(),
        propertiesJson.properties,
        downloadsJson.items,
        blogsJson.posts,
        newsJson.items
      );
      if (propertyId) {
        const detailRes = await fetch(`/api/content/properties/${propertyId}`, { cache: "no-store" });
        if (detailRes.ok) {
          const detailJson = await detailRes.json();
          if (detailJson.property) {
            next = applyLivePropertyDetail(next, detailJson.property);
          }
        }
      }
      knowledgeRef.current = next;
      setKnowledge(next);
      return next;
    } catch {
      return knowledgeRef.current;
    }
  };

  const confirmInquirySubmitted = (name: string) => {
    setPendingInquiry(null);
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        content: `Thanks ${name}. I’ve sent your question to our sales team — it now appears on the admin inquiries dashboard and they will follow up shortly.`,
        links: [{ label: "Or continue on WhatsApp", href: BOOK_VISIT_HASH }],
      },
    ]);
  };

  const trySubmitInquiry = async (
    draft: ChatbotInquiryDraft,
    contact: { name?: string; email?: string; phone?: string }
  ) => {
    if (!hasInquiryContact(contact) || !contact.name) return false;
    setInquiryBusy(true);
    const ok = await submitChatbotInquiry({
      draft,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setInquiryBusy(false);
    if (ok) {
      confirmInquirySubmitted(contact.name);
      return true;
    }
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        content: "I couldn’t file that inquiry just now. Please try again or use the contact form.",
        links: [{ label: "Contact us", href: "/contact-us" }],
      },
    ]);
    return false;
  };

  const handleSendMessage = async (rawMessage?: string) => {
    const userMessage = (rawMessage ?? inputValue).trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setInputValue("");

    if (pendingInquiry) {
      const parsed = parseChatContact(userMessage);
      const merged = {
        name: parsed.name || inquiryForm.name,
        email: parsed.email || inquiryForm.email,
        phone: parsed.phone || inquiryForm.phone,
      };
      setInquiryForm((prev) => ({
        name: merged.name || prev.name,
        email: merged.email || prev.email,
        phone: merged.phone || prev.phone,
      }));
      if (hasInquiryContact(merged)) {
        await trySubmitInquiry(pendingInquiry, merged);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "I still need your name and either a phone number or email so the team can follow up.",
        },
      ]);
      return;
    }

    const lastBotText = [...messages].reverse().find((message) => message.type === "bot")?.content;
    let knowledgeNow = knowledgeRef.current;

    if (hasPriceIntent(normalizeChatText(userMessage))) {
      setCheckingPrice(true);
      const ids = peekNamedPropertyIds(userMessage, knowledgeNow);
      knowledgeNow = await refreshLiveKnowledge(ids[0]);
      setCheckingPrice(false);
    }

    const reply = getChatbotResponse(userMessage, knowledgeNow, { lastBotText });
    setMessages((prev) => [...prev, { type: "bot", content: reply.text, links: reply.links }]);

    if (reply.collectInquiry) {
      const saved = loadSavedContact();
      setPendingInquiry(reply.collectInquiry);
      setInquiryForm({
        name: saved.name || "",
        email: saved.email || "",
        phone: saved.phone || "",
      });
      if (hasInquiryContact(saved) && saved.name) {
        await trySubmitInquiry(reply.collectInquiry, saved);
      }
    } else if (reply.openWhatsApp) {
      void handleWhatsAppClick();
    } else if (reply.suggestWhatsApp) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "Would you like me to open WhatsApp for you?" },
        ]);
      }, 500);
    }
  };

  const handleWhatsAppClick = async () => {
    const { openBookSiteVisitSmart } = await import("@/lib/leads/captureLead");
    const result = await openBookSiteVisitSmart({ source: "chatbot" });
    if (result === "form") {
      openBookSiteVisit({ source: "chatbot" });
    }
  };

  const handleBookVisitLink = () => {
    setIsOpen(false);
    openBookSiteVisit({ source: "chatbot" });
  };

  const quickQuestions = [
    "What properties do you have?",
    "Why should I invest?",
    "Download brochures and maps",
    "Do you offer payment plans?",
  ];

  const isFileLink = (href: string) => /\.pdf($|\?)/i.test(href) || href.startsWith("/downloads/");

  return (
    <>
      {/* Popup Message */}
      <AnimatePresence>
        {showPopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 bg-white rounded-lg shadow-2xl p-4 border border-dark-200 max-w-[200px] md:max-w-[250px]"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Image
                  src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg"
                  alt="IAPL Logo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-dark-900 mb-1 font-montserrat">
                  We are here. Let's Talk
                </p>
                <p className="text-xs text-dark-600 font-montserrat">
                  Click to start a conversation
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-dark-400 hover:text-dark-600 transition flex-shrink-0"
                aria-label="Close popup"
              >
                <X size={16} />
              </button>
            </div>
            {/* Arrow pointing to chat button */}
            <div className="absolute bottom-0 right-6 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowPopup(false);
        }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-primary-600 text-white rounded-full p-3 md:p-4 shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <>
            <MessageCircle size={24} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-96 max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl flex flex-col h-[500px] md:h-[600px] max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-8rem)] border border-dark-200"
          >
            {/* Chat Header */}
            <div className="bg-primary-600 text-white p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Image
                    src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1767347012/Iinuka_properties_logo_xq372f.jpg"
                    alt="IAPL Logo"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold font-montserrat">IAPL Assistant</h3>
                  <p className="text-xs text-white/80 font-montserrat">Usually replies instantly</p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 font-montserrat ${
                      message.type === "user"
                        ? "bg-primary-600 text-white"
                        : "bg-white text-dark-900 shadow-sm border border-dark-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    {message.links && message.links.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1.5">
                        {message.links.map((link) => {
                          const file = isFileLink(link.href);
                          const className =
                            "inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-2 hover:underline";
                          const colorClass = message.type === "user" ? "text-white" : "text-primary-700";
                          if (isBookVisitHref(link.href)) {
                            return (
                              <button
                                key={`${link.href}-${link.label}`}
                                type="button"
                                onClick={handleBookVisitLink}
                                className={`${className} ${colorClass} text-left`}
                              >
                                <ExternalLink size={12} />
                                {link.label}
                              </button>
                            );
                          }
                          if (file || link.href.startsWith("http")) {
                            return (
                              <a
                                key={`${link.href}-${link.label}`}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${className} ${colorClass}`}
                              >
                                {file ? <FileDown size={12} /> : <ExternalLink size={12} />}
                                {link.label}
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={`${link.href}-${link.label}`}
                              href={link.href}
                              className={`${className} ${colorClass}`}
                            >
                              <ExternalLink size={12} />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {checkingPrice && (
                <p className="text-xs text-dark-500 font-montserrat italic">Checking the latest published price…</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-white border-t border-dark-200">
                <p className="text-xs text-dark-600 mb-2 font-montserrat">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100 transition font-montserrat"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            {messages.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-green-50 border-t border-green-200"
              >
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 font-montserrat"
                >
                  <Phone size={18} />
                  Continue on WhatsApp
                </button>
              </motion.div>
            )}

            {pendingInquiry && (
              <div className="px-4 py-3 bg-primary-50 border-t border-primary-100 space-y-2">
                <p className="text-xs font-semibold text-primary-800 font-montserrat">
                  {pendingInquiry.kind === "price"
                    ? "Send this price request to our sales team"
                    : "Send this question to our sales team"}
                </p>
                <input
                  type="text"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg text-sm font-montserrat"
                />
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone (0711…)"
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg text-sm font-montserrat"
                />
                <input
                  type="email"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email (optional if you share a phone)"
                  className="w-full px-3 py-2 border border-dark-200 rounded-lg text-sm font-montserrat"
                />
                <button
                  type="button"
                  disabled={inquiryBusy || !hasInquiryContact(inquiryForm)}
                  onClick={() => void trySubmitInquiry(pendingInquiry, inquiryForm)}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 font-montserrat"
                >
                  {inquiryBusy ? "Sending…" : "Send to sales team"}
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-dark-200 rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-montserrat"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center font-montserrat"
                  disabled={!inputValue.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
              <button
                onClick={handleWhatsAppClick}
                className="mt-2 w-full text-xs text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1 font-montserrat"
              >
                <Phone size={14} />
                Or chat with us on WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

