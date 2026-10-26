import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgeDollarSign, BarChart3, BookOpenCheck, BotMessageSquare, Boxes, ExternalLink, Globe, LayoutGrid, Package, Sparkles, Store, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

// mainNavItems should be moved or redefined within AppSidebar to access props

export function AppSidebar() {
    const { tenant } = usePage().props as any;
    const slug = tenant?.slug || '';

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: `/${slug}/dashboard`,
            icon: LayoutGrid,
        },
        {
            title: 'Productos',
            url: `/${slug}/productos`,
            icon: Package,
        },
        {
            title: 'Personalizar Catálogo',
            url: `/${slug}/personalizar`,
            icon: Store,
        },
        {
            title: 'Inventarios',
            url: '#',
            icon: Boxes,
            locked: true,
        },
        {
            title: 'Ventas',
            url: '#',
            icon: BadgeDollarSign,
            locked: true,
        },
        {
            title: 'Cuadernos Admin',
            url: '#',
            icon: BookOpenCheck,
            locked: true,
        },
        {
            title: 'Sucursales',
            url: '#',
            icon: Store,
            locked: true,
        },
        {
            title: 'Reportes',
            url: '#',
            icon: BarChart3,
            locked: true,
        },
        {
            title: 'Cajas',
            url: '#',
            icon: Wallet,
            locked: true,
        },
        {
            title: 'WhatsApp Bot',
            url: '#',
            icon: BotMessageSquare,
            locked: true,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-slate-800/60 bg-gradient-to-b from-[#0B132B] via-[#0F1B3B] to-[#0A1128] text-slate-100 shadow-[2px_0_24px_rgba(3,7,18,0.2)]">
            <SidebarHeader className="p-4 border-b border-white/[0.08]">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/[0.06] rounded-2xl transition-all">
                            <Link href={`/${slug}/dashboard`} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-3 px-1">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-3 border-t border-white/[0.08] bg-black/15 backdrop-blur-xs">
                <a
                    href={`/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500/15 to-blue-600/15 hover:from-sky-500/25 hover:to-blue-600/25 text-sky-200 hover:text-white border border-sky-400/25 hover:border-sky-400/40 text-xs font-semibold transition-all shadow-xs group"
                >
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                        <span>Ver Tienda Online</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 text-sky-300" />
                </a>
            </SidebarFooter>
        </Sidebar>
    );
}
