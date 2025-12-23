import { MapPin, Clock, Phone, Mail, Facebook, Instagram, Youtube, Shield, Sparkles, CreditCard, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [openSection, setOpenSection] = useState("");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Deskripsi */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Fajar Gold
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                Toko perhiasan emas terpercaya sejak 1985. Menyediakan emas murni 24K bersertifikat Antam dengan desain elegan dan modern.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Shield className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">Sertifikat Resmi</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">Garansi Lifetime</span>
              </div>
            </div>
          </div>

          {/* Navigasi Cepat - Accordion di Mobile */}
          <div className="border-t border-gray-200 dark:border-gray-800 md:border-none pt-4 md:pt-0">
            <button 
              onClick={() => toggleSection("navigasi")}
              className="w-full flex items-center justify-between md:hidden mb-2"
            >
              <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">Navigasi</h4>
              <ChevronDown className={`w-5 h-5 transition-transform ${openSection === "navigasi" ? "rotate-180" : ""}`} />
            </button>
            <h4 className="hidden md:block text-lg font-bold text-amber-600 dark:text-amber-400 mb-5">Navigasi</h4>
            
            <ul className={`space-y-3 ${openSection === "navigasi" ? "block" : "hidden md:block"}`}>
              {[
                { name: "Katalog Produk", href: "/katalog" },
                { name: "Promo & Diskon", href: "/promo" },
                { name: "Pesanan Saya", href: "/pesanan" },
                { name: "Wishlist", href: "/wishlist" },
                { name: "Tentang Kami", href: "/tentang" },
                { name: "Kontak", href: "/kontak" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition font-medium text-sm md:text-base"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori Populer - Accordion di Mobile */}
          <div className="border-t border-gray-200 dark:border-gray-800 md:border-none pt-4 md:pt-0">
            <button 
              onClick={() => toggleSection("kategori")}
              className="w-full flex items-center justify-between md:hidden mb-2"
            >
              <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400">Kategori Populer</h4>
              <ChevronDown className={`w-5 h-5 transition-transform ${openSection === "kategori" ? "rotate-180" : ""}`} />
            </button>
            <h4 className="hidden md:block text-lg font-bold text-amber-600 dark:text-amber-400 mb-5">Kategori Populer</h4>
            
            <div className={`grid grid-cols-2 gap-3 ${openSection === "kategori" ? "block" : "hidden md:grid"}`}>
              {[
                "Cincin Kawin",
                "Kalung Emas",
                "Gelang",
                "Anting",
                "Liontin",
                "Logam Mulia",
                "Set Perhiasan",
                "Emas Batangan",
              ].map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition font-medium"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Kontak & Sosial Media */}
          <div className="space-y-6 border-t border-gray-200 dark:border-gray-800 md:border-none pt-4 md:pt-0">
            <div>
              <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-5">Hubungi Kami</h4>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Jl. Ahmad Yani No. 197<br />
                    Kota Bandung, Jawa Barat
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-sm">09:00 - 20:00 WIB</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <span className="text-sm">+62 22 1234 5678</span>
                </p>
              </div>
            </div>

            {/* Sosial Media - Compact */}
            <div>
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3 uppercase tracking-wider">Ikuti Kami</h4>
              <div className="flex gap-3">
                <a href="#" className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-600 dark:hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white transition">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-600 dark:hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white transition">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-600 dark:hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white transition">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 dark:border-gray-800 mt-8 md:mt-12 pt-8 text-center">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-500">
            © 2025 <span className="font-bold text-amber-600 dark:text-amber-400">Fajar Gold Jewelry</span>. 
            <span className="block sm:inline sm:ml-1">Hak cipta dilindungi.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}