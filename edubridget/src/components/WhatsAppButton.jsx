import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "250788123456";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 inset-safe-bottom inset-safe-right bg-green-500 text-white min-h-[48px] min-w-[48px] p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors motion-safe:animate-bounce flex items-center justify-center [touch-action:manipulation]"
      aria-label="Chat on WhatsApp">
      <MessageCircle className="h-6 w-6 shrink-0" />
    </a>
  );
};

export default WhatsAppButton;
