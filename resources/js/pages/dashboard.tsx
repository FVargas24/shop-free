import { Head, usePage } from '@inertiajs/react';
import { Package, Clock, User, Phone, MapPin, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    pivot: {
        cantidad: number;
    };
}

interface Pedido {
    id: number;
    cliente: string;
    celular: string;
    departamento: string;
    pais: string;
    total: number;
    created_at: string;
    productos: Producto[];
}

interface DashboardProps {
    pedidos: Pedido[];
}

export default function Dashboard({ pedidos }: DashboardProps) {
    const { tenant } = usePage().props as any;
    const slug = tenant?.slug || '';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: `/${slug}/dashboard`,
        },
    ];
    const totalSales = pedidos.reduce((acc, p) => acc + Number(p.total), 0);
    const totalOrders = pedidos.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Administrador" />
            
            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border/90 bg-gradient-to-br from-card to-sky-50/30 dark:to-slate-900/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Ventas Totales</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">Bs. {totalSales.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">Ingresos brutos acumulados</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border/90 bg-gradient-to-br from-card to-sky-50/30 dark:to-slate-900/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Pedidos Recibidos</CardTitle>
                            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Clock className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">Órdenes totales registradas</p>
                        </CardContent>
                    </Card>
                    {/* Add more stats as needed */}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Pedidos Recientes</h2>
                            <p className="text-xs text-muted-foreground">Listado de órdenes recibidas en tu catálogo</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-border/90 hover:bg-sky-50/50 hover:text-sky-700 rounded-xl">Ver todos</Button>
                    </div>

                    <div className="grid gap-4">
                        {pedidos.length > 0 ? (
                            pedidos.map((pedido) => (
                                <Card key={pedido.id} className="overflow-hidden hover:border-sky-400/70 border-border/90 transition-all">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="flex-1 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-950/70 flex items-center justify-center text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-900">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-slate-900 dark:text-slate-100">{pedido.cliente}</h3>
                                                        <p className="text-xs text-muted-foreground">Pedido #{pedido.id} • {new Date(pedido.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100">
                                                    Nuevo
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4 text-sky-500" />
                                                    {pedido.celular || 'Sin celular'}
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4 text-sky-500" />
                                                    {pedido.departamento || 'Bolivia'}, {pedido.pais || 'Bolivia'}
                                                </div>
                                                <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-400">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    Bs. {Number(pedido.total || 0).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-t border-border/80 pt-4">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Productos</p>
                                                {pedido.productos && pedido.productos.map((prod) => (
                                                    <div key={prod.id} className="flex justify-between items-center text-sm py-0.5">
                                                        <span className="text-slate-800 dark:text-slate-200">{prod.pivot?.cantidad || 1}x {prod.nombre}</span>
                                                        <span className="font-medium text-slate-600 dark:text-slate-400">Bs. {(prod.precio * (prod.pivot?.cantidad || 1)).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/70 dark:bg-slate-900/40 md:w-56 p-6 flex flex-col justify-center gap-2.5 border-t md:border-t-0 md:border-l border-border/80">
                                            {pedido.celular ? (
                                                <a 
                                                    href={`https://wa.me/${pedido.celular.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(pedido.cliente)},%20te%20escribimos%20por%20tu%20pedido%20%23${pedido.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                    Contactar WhatsApp
                                                </a>
                                            ) : (
                                                <div className="text-xs text-center text-muted-foreground">Sin WhatsApp</div>
                                            )}
                                            <Button variant="outline" size="sm" className="w-full text-xs rounded-xl h-8 border-border/90 hover:bg-sky-50/60 hover:text-sky-700">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                                Procesar
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="border-dashed py-14 rounded-2xl">
                                <div className="text-center">
                                    <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <h3 className="text-base font-bold text-foreground">No hay pedidos registrados</h3>
                                    <p className="text-muted-foreground text-xs mt-1">Tus ventas aparecerán aquí una vez que los clientes realicen pedidos desde tu catálogo.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
