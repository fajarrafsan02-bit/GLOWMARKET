import SidebarMenuItem from "./SidebarMenuItem.jsx";

export default function SidebarNav({ menuGroups, activeMenu, onMenuClick, mobile }) {
    return (
        <nav className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-5">
                {menuGroups.map((group) => (
                    <div key={group.label}>
                        <p className="px-3 mb-2 text-[9px] font-semibold tracking-[0.16em] text-gray-400">
                            {group.label}
                        </p>

                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <SidebarMenuItem
                                    key={item.key}
                                    item={item}
                                    active={activeMenu === item.key}
                                    onSelect={() => onMenuClick(item, mobile)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    );
}
