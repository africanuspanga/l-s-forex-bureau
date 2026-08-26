interface WhatsAppButtonProps {
  /** Digits only, with country code, e.g. "255743881309" */
  phone: string;
  message?: string;
  /** Set true if this site also renders MobileBottomNav, to sit above it on mobile */
  aboveBottomNav?: boolean;
}

export default function WhatsAppButton({
  phone,
  message = "Hello, I'd like to ask about your exchange rates.",
  aboveBottomNav = true,
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 active:scale-95 ${
        aboveBottomNav ? "bottom-24 lg:bottom-6" : "bottom-6"
      }`}
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.44 1.73 6.37L3.2 28.8l6.6-1.7a12.75 12.75 0 0 0 6.2 1.58h.005c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.68-12.8-12.68Zm0 23.36h-.004a10.6 10.6 0 0 1-5.4-1.48l-.387-.23-4.02 1.04 1.07-3.92-.253-.4a10.53 10.53 0 0 1-1.61-5.58c0-5.83 4.75-10.58 10.6-10.58 2.83 0 5.48 1.1 7.48 3.1a10.5 10.5 0 0 1 3.1 7.5c0 5.83-4.76 10.56-10.58 10.56Zm5.8-7.9c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.75-.99-2.39-.26-.63-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68 0 1.58 1.15 3.1 1.31 3.32.16.21 2.26 3.46 5.48 4.85.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
