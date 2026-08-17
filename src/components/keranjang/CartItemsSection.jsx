import CartItem from "./CartItem.jsx";

export default function CartItemsSection({ items, onRemove, onUpdateQuantity }) {
    return (
        <section>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Produk</h2>

                    <span className="text-xs text-gray-400">{items.length} produk</span>
                </div>

                <div>
                    {items.map((item, index) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            index={index}
                            onRemove={onRemove}
                            onUpdateQuantity={onUpdateQuantity}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
