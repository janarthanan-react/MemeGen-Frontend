import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is MemeHub really 100% free to use?',
    answer:
      'Yes! MemeHub is completely free to browse, customize, and download unlimited memes. You can access our full library of 500,000+ templates, add custom text layers, stickers, and filters, and export in crystal-clear HD with no hidden subscriptions required.',
  },
  {
    id: 'faq-2',
    question: 'How does the AI Meme Generator work?',
    answer:
      'Our AI model understands context, internet irony, and cultural tropes. When you type a prompt (like "A cat working on a laptop, looking stressed"), the AI automatically writes punchy top/bottom captions and matches them with appropriate expressive visual templates or generated artwork.',
  },
  {
    id: 'faq-3',
    question: 'Can I upload my own custom images, photos, and GIFs?',
    answer:
      'Absolutely! Click "Create a Meme" or drag and drop any image (PNG, JPG, WebP) or video/GIF directly into the editor. Your personal uploads remain secure and private to your device unless you explicitly publish them to the community explore feed.',
  },
  {
    id: 'faq-4',
    question: 'Are downloaded memes free of intrusive watermarks?',
    answer:
      'Yes. Unlike other tools that slap massive watermarks across the center of your creation, free exports include only a subtle, clean micro-badge. MemeHub Pro members can export 100% watermark-free or upload their own branded creator logos.',
  },
  {
    id: 'faq-5',
    question: 'Can I use memes created on MemeHub for commercial or brand social media?',
    answer:
      'Yes. Content creators, marketing agencies, and startup founders routinely use MemeHub to power their social media growth. Memes fall under transformative parody and fair use in most jurisdictions.',
  },
  {
    id: 'faq-6',
    question: 'What perks do I unlock with MemeHub Pro?',
    answer:
      'MemeHub Pro unlocks an ad-free workspace, unlimited high-speed AI meme generation, 4K ultra-sharp exports, custom team watermarks, GIF animations tools, and priority rendering so your viral posts are always first to trend.',
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="scroll-mt-24 space-y-10" aria-label="Frequently Asked Questions">
      <div id="help" className="sr-only" />
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help & Clarity</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Everything you need to know about features, formats, and community sharing.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3 text-left">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-blue-400 ring-2 ring-blue-500/10 shadow-md'
                  : 'border-slate-200/90 hover:border-blue-300 hover:shadow-md shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-slate-900 text-sm sm:text-base cursor-pointer group active:scale-[0.99] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#1463E9] focus-visible:outline-none"
                aria-expanded={isOpen}
              >
                <span className="group-hover:text-[#1463E9] transition-colors">{item.question}</span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${
                    isOpen ? 'rotate-180 bg-[#EFF6FF] text-[#1463E9]' : 'bg-slate-100 text-slate-500 group-hover:bg-[#EFF6FF] group-hover:text-[#1463E9]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still have questions CTA */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Have more questions? Check out our{' '}
          <a href="#help" className="text-blue-600 font-semibold hover:underline">
            Help Center
          </a>{' '}
          or join the discussion in our{' '}
          <a href="#community" className="text-blue-600 font-semibold hover:underline">
            Discord Community
          </a>
          .
        </p>
      </div>
    </section>
  );
};
