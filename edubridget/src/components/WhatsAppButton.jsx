import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "250788123456";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 animate-bounce cursor-pointer"
      aria-label="Chat on WhatsApp">
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppButton;
