"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, MapPin, Mail, Home, Building2, Waves } from "lucide-react";
import Image from "next/image";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; content: string }>>([
    {
      type: "bot",
      content: "Hello! I'm IAPL, your virtual assistant. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const whatsappNumber = "254711082084";
  const whatsappMessage = "Hello, I'm interested in learning more about Inuka Afrika Properties.";

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! Welcome to Inuka Afrika Properties. How can I assist you today?";
    }

    // Company information
    if (lowerMessage.includes("about") || lowerMessage.includes("company") || lowerMessage.includes("who")) {
      return "Inuka Afrika Properties Limited is a leading real estate company with over 10 years of experience. We specialize in affordable residential, commercial, and beach properties in Kilifi County, including Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi.";
    }

    // Location/Office
    if (lowerMessage.includes("location") || lowerMessage.includes("office") || lowerMessage.includes("address") || lowerMessage.includes("where")) {
      return "Our head office is located at Links Road Opposite Kigothos Hotel, P.O. BOX 525-80100, Nyali, Mombasa, Kenya. Would you like to visit us or need directions?";
    }

    // Contact information
    if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email") || lowerMessage.includes("number")) {
      return `You can reach us at:\n📞 Phone: 0711 082084\n📧 Email: info@inukaproperties.co.ke\n📍 Office: Links Road Opposite Kigothos Hotel, Nyali, Mombasa\n\nWould you like to chat with us on WhatsApp?`;
    }

    // Properties for sale
    if (lowerMessage.includes("property") || lowerMessage.includes("properties") || lowerMessage.includes("sale") || lowerMessage.includes("buy") || lowerMessage.includes("plot") || lowerMessage.includes("land")) {
      return "We have various properties available including:\n🏠 Residential plots\n🏢 Commercial spaces\n🌊 Beachfront properties\n🌾 Farm land\n\nProperties are available in Mariakani, Mtwapa, Kikambala, Bofa, Chumani, Tezo, Msabaha, Mtondia, and Malindi. Would you like to see our available properties?";
    }

    // Pricing
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much") || lowerMessage.includes("affordable")) {
      return "Our properties range from affordable residential plots starting at KES 325,000 to premium beachfront developments. Prices vary by location and size. For specific pricing information, I can connect you with our sales team via WhatsApp.";
    }

    // Payment plans
    if (lowerMessage.includes("payment") || lowerMessage.includes("installment") || lowerMessage.includes("plan") || lowerMessage.includes("deposit")) {
      return "We offer flexible payment plans with deposits and monthly installments. Payment terms vary by property. For detailed payment plan information, let me connect you with our sales team on WhatsApp.";
    }

    // Site visit
    if (lowerMessage.includes("visit") || lowerMessage.includes("site") || lowerMessage.includes("viewing") || lowerMessage.includes("tour")) {
      return "We'd be happy to arrange a site visit for you! Site visits are available for all our properties. Let me connect you with our team on WhatsApp to schedule a convenient time.";
    }

    // Services
    if (lowerMessage.includes("service") || lowerMessage.includes("what do you") || lowerMessage.includes("offer")) {
      return "We offer comprehensive real estate services:\n✅ Property Sales (Residential, Commercial, Beach)\n✅ Property Management\n✅ Title Issuance\n✅ Feasibility Studies\n✅ Affordable Housing Solutions\n\nHow can we assist you?";
    }

    // Title deed
    if (lowerMessage.includes("title") || lowerMessage.includes("deed") || lowerMessage.includes("document")) {
      return "We facilitate smooth title issuance processes and have issued over 4,513 title deeds. Our legal team ensures all documentation is properly handled. For specific title deed inquiries, I can connect you with our legal team via WhatsApp.";
    }

    // Experience/Years
    if (lowerMessage.includes("experience") || lowerMessage.includes("years") || lowerMessage.includes("established") || lowerMessage.includes("founded")) {
      return "Inuka Afrika Properties was founded in 2016 and has over 10 years of excellence in the real estate industry. We have completed over 70 projects and served 10,000+ happy clients across the coastal region of Kenya.";
    }

    // Awards/Achievements
    if (lowerMessage.includes("award") || lowerMessage.includes("achievement") || lowerMessage.includes("recognition")) {
      return "We have won several awards including the 2022 Real Estate Investor of the Year Award. Our commitment to excellence and customer satisfaction has earned us recognition in the industry.";
    }

    // Default response - lead to WhatsApp
    return "I'm still learning, but I'd love to help! Let me connect you with our team on WhatsApp for personalized assistance.";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setInputValue("");

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setMessages((prev) => [...prev, { type: "bot", content: botResponse }]);

      // If response suggests WhatsApp, add a quick action
      if (botResponse.includes("WhatsApp") || botResponse.includes("connect")) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: "Would you like me to open WhatsApp for you?",
            },
          ]);
        }, 500);
      }
    }, 500);
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const quickQuestions = [
    "What properties do you have?",
    "Where is your office?",
    "What are your prices?",
    "Do you offer payment plans?",
  ];

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
                  </div>
                </motion.div>
              ))}
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
                      onClick={() => {
                        setInputValue(question);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
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

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-dark-200 rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-montserrat"
                />
                <button
                  onClick={handleSendMessage}
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

