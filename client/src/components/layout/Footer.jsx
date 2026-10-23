import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageCircle
} from "lucide-react";
import { NewsletterSignup } from "../common/NewsletterSignup";
export const Footer = () => {
  const [policyModal, setPolicyModal] = useState(null);
  const openPolicy = (title, content) => {
    setPolicyModal({ title, content });
  };
  return <footer className="bg-[#1c050a] text-stone-300 border-t border-stone-800">
      {
    /* 1. Trust Pillars & Heritage Commitments Strip */
  }
      <div className="border-b border-stone-800/80 py-8 bg-[#28070e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-[#d4af37] shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Silk Mark Certified</h4>
                <p className="text-xs text-stone-400">100% Authentic Handloom Silk</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-[#d4af37] shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Free Insured Shipping</h4>
                <p className="text-xs text-stone-400">Pan-India express delivery above ₹2,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#d4af37] shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">7-Day Easy Returns</h4>
                <p className="text-xs text-stone-400">Hassle-free doorstep pickup policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#d4af37] shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Secure Payments</h4>
                <p className="text-xs text-stone-400">Razorpay UPI &amp; Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* 2. Main 5-Column Navigation Grid */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {
    /* Column 1: Brand Story & Social Media Links */
  }
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-9 h-9 rounded-lg bg-[#6b1426] text-[#f2ce6e] flex items-center justify-center border border-[#d4af37]/40 shadow-xs">
                <span className="font-serif text-lg font-bold">SS</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#f2ce6e]">
                  Saree Sansar
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-semibold mt-1">
                  Heritage Weaves of India
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Honoring India’s royal handloom traditions since generations. From the sacred ghats of Varanasi to the temple looms of Kanchipuram, we present authentic heirloom drapes crafted by master weavers.
            </p>

            {
    /* Direct Contact Coordinates */
  }
            <div className="pt-2 text-xs text-stone-400 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Heritage Craft Studio, Godowlia, Varanasi &amp; Connaught Place, New Delhi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>+91 98765 43210 (Mon-Sat, 10:00 AM – 7:30 PM IST)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>care@sareesansar.com</span>
              </div>
            </div>

            {
    /* Social Media Channels */
  }
            <div className="pt-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] mb-3">
                Follow Our Artisans &amp; Stories
              </h5>
              <div className="flex items-center gap-3">
                <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-[#2e0912] border border-stone-700 hover:border-[#d4af37] text-stone-400 hover:text-[#f2ce6e] flex items-center justify-center transition-colors"
    aria-label="Instagram"
  >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-[#2e0912] border border-stone-700 hover:border-[#d4af37] text-stone-400 hover:text-[#f2ce6e] flex items-center justify-center transition-colors"
    aria-label="Facebook"
  >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
    href="https://youtube.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-[#2e0912] border border-stone-700 hover:border-[#d4af37] text-stone-400 hover:text-[#f2ce6e] flex items-center justify-center transition-colors"
    aria-label="YouTube"
  >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-[#2e0912] border border-stone-700 hover:border-[#d4af37] text-stone-400 hover:text-[#f2ce6e] flex items-center justify-center transition-colors"
    aria-label="Twitter"
  >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
    href="https://wa.me/919876543210"
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full bg-[#2e0912] border border-stone-700 hover:border-emerald-500 text-stone-400 hover:text-emerald-400 flex items-center justify-center transition-colors"
    aria-label="WhatsApp Concierge"
  >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {
    /* Column 2: Quick Links */
  }
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f2ce6e] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home (राजसी संग्रह)
                </Link>
              </li>
              <li>
                <Link to="/products?category=banarasi-silk" className="hover:text-white transition-colors">
                  Banarasi Katan Silk
                </Link>
              </li>
              <li>
                <Link to="/products?category=kanjivaram-silk" className="hover:text-white transition-colors">
                  Kanchipuram Temple Silks
                </Link>
              </li>
              <li>
                <Link to="/products?category=chanderi-organza" className="hover:text-white transition-colors">
                  Chanderi &amp; Organza
                </Link>
              </li>
              <li>
                <Link to="/products?category=georgette-chiffon" className="hover:text-white transition-colors">
                  Banarasi Khaddi Georgette
                </Link>
              </li>
              <li>
                <Link to="/products?category=bridal-heritage" className="hover:text-white transition-colors">
                  Bridal Trousseau Masterpieces
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors font-medium text-[#f2ce6e]">
                  All Saree Collections
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Weaving Guilds Gallery
                </Link>
              </li>
            </ul>
          </div>

          {
    /* Column 3: Customer Support */
  }
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f2ce6e] mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <Link to="/order-tracking" className="hover:text-white transition-colors">
                  Track Your Order Status (ऑर्डर ट्रैक करें)
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  My Profile &amp; Addresses
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Sarees (Wishlist)
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  Instant Saree Search
                </Link>
              </li>
              <li>
                <a href="mailto:care@sareesansar.com" className="hover:text-white transition-colors">
                  Artisan Helpdesk (ईमेल सहायता)
                </a>
              </li>
              <li className="pt-2 border-t border-stone-800 space-y-1.5">
                <Link
    to="/download"
    className="inline-flex items-center gap-1 text-xs text-[#f2ce6e] hover:underline font-bold"
    title="View and download MERN Stack source code archives"
  >
                  <span>📦 Download MERN Code (.ZIP)</span>
                </Link>
                <Link to="/admin/login" className="block text-stone-500 hover:text-stone-300 transition-colors text-xs">
                  Administrative Portal
                </Link>
              </li>
            </ul>
          </div>

          {
    /* Column 4: Policies & Patron Circle Newsletter */
  }
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#f2ce6e] mb-4">
              Our Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400 mb-6">
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "7-Day Easy Returns & Exchange Policy",
      "We offer a 7-day doorstep return and exchange guarantee for all unworn sarees in original luxury box packaging with the Silk Mark security tag intact."
    )}
    className="hover:text-white transition-colors text-left cursor-pointer"
  >
                  7-Day Returns &amp; Exchange
                </button>
              </li>
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "Insured Express Shipping Policy",
      "Orders above \u20B92,000 enjoy complimentary 100% insured transit via BlueDart Air Express across all serviceable Indian PIN codes."
    )}
    className="hover:text-white transition-colors text-left cursor-pointer"
  >
                  Shipping &amp; Delivery Policy
                </button>
              </li>
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "Silk Mark & Purity Guarantee",
      "Every silk saree sold on Saree Sansar bears the official Silk Mark Organization of India certification verifying pure natural silk threads and tested zari."
    )}
    className="hover:text-white transition-colors text-left cursor-pointer"
  >
                  Silk Mark Purity Guarantee
                </button>
              </li>
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "Terms of Service & Handloom Variations",
      "Due to the authentic handmade nature of our handlooms, slight organic variations in weave tension and zari luster are natural hallmarks of artisan craftsmanship."
    )}
    className="hover:text-white transition-colors text-left cursor-pointer"
  >
                  Terms &amp; Artisan Craft Care
                </button>
              </li>
              <li>
                <button
    type="button"
    onClick={() => openPolicy(
      "Privacy & Payment Security",
      "Your data is secured with enterprise TLS encryption. Payment transactions are processed directly via PCI-DSS Level 1 compliant Razorpay gateway."
    )}
    className="hover:text-white transition-colors text-left cursor-pointer"
  >
                  Privacy &amp; Payment Security
                </button>
              </li>
            </ul>

            {
    /* Newsletter Subscription Component */
  }
            <div className="pt-3 border-t border-stone-800">
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {
    /* 3. Bottom Legal & Certification Bar */
  }
        <div className="border-t border-stone-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {(/* @__PURE__ */ new Date()).getFullYear()} Saree Sansar Heritage Handlooms Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-stone-400">Handcrafted in Varanasi &amp; Kanchipuram</span>
            <span>·</span>
            <span className="text-stone-400">Silk Mark Certified</span>
            <span>·</span>
            <span className="text-stone-400">Razorpay 256-bit Encrypted</span>
          </div>
        </div>
      </div>

      {
    /* Policy Details Modal Dialog */
  }
      {policyModal && <div
    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    onClick={() => setPolicyModal(null)}
  >
          <div
    className="bg-[#24060d] border border-[#d4af37]/40 text-stone-200 rounded-xl max-w-md w-full p-6 shadow-2xl relative"
    onClick={(e) => e.stopPropagation()}
  >
            <h3 className="font-serif text-lg font-bold text-[#f2ce6e] mb-3">
              {policyModal.title}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-6">
              {policyModal.content}
            </p>
            <div className="flex justify-end">
              <button
    type="button"
    onClick={() => setPolicyModal(null)}
    className="px-4 py-1.5 bg-[#d4af37] text-stone-950 text-xs font-semibold rounded-md hover:bg-[#e2b342] transition-colors cursor-pointer"
  >
                Close (समझ गए)
              </button>
            </div>
          </div>
        </div>}
    </footer>;
};
export default Footer;
