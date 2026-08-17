import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function ProductDetailBreadcrumb({ product }) {
    return (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Beranda
            </Link>

            <ChevronRight className="w-3 h-3 shrink-0" />

            <Link
                to="/katalog"
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
                Katalog
            </Link>

            {product?.kategori && (
                <>
                    <ChevronRight className="w-3 h-3 shrink-0" />

                    <Link
                        to={`/katalog?kategori=${encodeURIComponent(product.kategori)}`}
                        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        {product.kategori}
                    </Link>
                </>
            )}

            <ChevronRight className="w-3 h-3 shrink-0" />

            <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                {product?.nama}
            </span>
        </nav>
    );
}
