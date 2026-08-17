import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

import { Link } from "react-router-dom";

export default function BrandColumn({ store, instagramUrl }) {
    return (
        <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center">
                <img
                    src={store.logo || "/logo.png"}
                    alt={store.name}
                    className="h-10 xs:h-12 sm:h-20 w-auto max-w-[180px] xs:max-w-[240px] object-contain"
                />
            </Link>

            <p className="mt-3 sm:mt-4 max-w-md text-xs sm:text-sm leading-5 sm:leading-6 text-gray-500 dark:text-gray-400">
                {store.description}
            </p>

            {/* Contact */}
            <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5 text-gray-400" />

                    <span>{store.address}</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-gray-400" />

                    <a
                        href={`tel:${store.phone.replace(/\s/g, "")}`}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        {store.phone}
                    </a>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-gray-400" />

                    <a
                        href={`mailto:${store.email}`}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        {store.email}
                    </a>
                </div>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2.5">
                <a
                    href={instagramUrl}
                    target={instagramUrl === "#" ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={`Instagram ${store.name}`}
                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-amber-500 hover:text-white transition-colors"
                >
                    <Instagram className="w-4 h-4" />
                </a>

                <a
                    href="#"
                    aria-label={`Facebook ${store.name}`}
                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-amber-500 hover:text-white transition-colors"
                >
                    <Facebook className="w-4 h-4" />
                </a>

                <a
                    href="#"
                    aria-label={`YouTube ${store.name}`}
                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-amber-500 hover:text-white transition-colors"
                >
                    <Youtube className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
