import useStoreSettings from "../hooks/useStoreSettings.js";

import NewsletterSection from "./footer/NewsletterSection.jsx";
import BrandColumn from "./footer/BrandColumn.jsx";
import LinkColumn from "./footer/LinkColumn.jsx";
import TrustBar from "./footer/TrustBar.jsx";

import { shoppingLinks, serviceLinks } from "./footer/footerLinks.js";

export default function Footer() {
    const store = useStoreSettings();

    const instagramUrl = store.instagram
        ? `https://instagram.com/${store.instagram.replace(/^@/, "")}`
        : "#";

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            <NewsletterSection store={store} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12">
                    <BrandColumn store={store} instagramUrl={instagramUrl} />

                    <LinkColumn title="Belanja" links={shoppingLinks} className="lg:col-span-3" withChevron />

                    <LinkColumn
                        title="Bantuan & Informasi"
                        links={serviceLinks}
                        className="lg:col-span-4"
                    />
                </div>
            </div>

            <TrustBar store={store} />
        </footer>
    );
}
