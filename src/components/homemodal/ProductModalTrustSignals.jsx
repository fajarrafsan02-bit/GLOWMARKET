import { ShieldCheck, Truck, PackageCheck } from "lucide-react";

const TRUST_ITEMS = [
    {
        icon: ShieldCheck,
        title: "Authentic",
        desc: "Keaslian",
    },
    {
        icon: Truck,
        title: "Delivery",
        desc: "Aman",
    },
    {
        icon: PackageCheck,
        title: "Packaging",
        desc: "Terjamin",
    },
];

export default function ProductModalTrustSignals() {
    return (
        <div className="mt-3 sm:mt-5 grid grid-cols-3 border border-gray-200 dark:border-gray-800 rounded-lg">
            {TRUST_ITEMS.map((item) => {
                const IconComp = item.icon;

                return (
                    <div
                        key={item.title}
                        className="px-1.5 py-2 sm:py-3 flex flex-col items-center text-center gap-1 border-r last:border-r-0 border-gray-200 dark:border-gray-800"
                    >
                        <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />

                        <div>
                            <p className="text-[9px] sm:text-[10px] font-semibold text-gray-800 dark:text-gray-200">
                                {item.title}
                            </p>

                            <p className="text-[8px] sm:text-[9px] text-gray-400">{item.desc}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
