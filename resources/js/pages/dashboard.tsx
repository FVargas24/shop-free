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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Bs. {totalSales.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Ingresos brutos acumulados</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pedidos Recibidos</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">Órdenes totales registradas</p>
                        </CardContent>
                    </Card>
                    {/* Add more stats as needed */}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Pedidos Recientes</h2>
                        <Button variant="outline" size="sm">Ver todos</Button>
                    </div>

                    <div className="grid gap-4">
                        {pedidos.length > 0 ? (
                            pedidos.map((pedido) => (
                                <Card key={pedido.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="flex-1 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold">{pedido.cliente}</h3>
                                                        <p className="text-xs text-muted-foreground">Pedido #{pedido.id} • {new Date(pedido.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                                    Nuevo
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    {pedido.celular || 'Sin celular'}
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    {pedido.departamento || 'Bolivia'}, {pedido.pais || 'Bolivia'}
                                                </div>
                                                <div className="flex items-center gap-2 font-bold text-primary">
                                                    <ShoppingBag className="h-4 w-4" />
                                                    Bs. {Number(pedido.total || 0).toFixed(2)}
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-t pt-4">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Productos</p>
                                                {pedido.productos && pedido.productos.map((prod) => (
                                                    <div key={prod.id} className="flex justify-between items-center text-sm">
                                                        <span>{prod.pivot?.cantidad || 1}x {prod.nombre}</span>
                                                        <span className="text-muted-foreground">Bs. {(prod.precio * (prod.pivot?.cantidad || 1)).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-muted/20 md:w-52 p-6 flex flex-col justify-center gap-2.5 border-t md:border-t-0 md:border-l border-border/60">
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
                                            <Button variant="outline" size="sm" className="w-full text-xs rounded-xl h-8">
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
