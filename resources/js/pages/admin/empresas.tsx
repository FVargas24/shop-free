import { Head, router } from '@inertiajs/react';
import { 
    Building2, Shield, Calendar, CheckCircle2, XCircle, Search, 
    ExternalLink, Plus, RefreshCw, Clock, ArrowUpRight, Store
} from 'lucide-react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Empresa {
    id: number;
    nombre_empresa: string;
    slug: string;
    celular?: string;
    activo: boolean;
    fecha_expiracion?: string;
    created_at: string;
    user?: User;
    productos_count: number;
    pedidos_count: number;
}

interface AdminEmpresasProps {
    empresas: Empresa[];
}

export default function AdminEmpresas({ empresas }: AdminEmpresasProps) {
    const [search, setSearch] = useState('');
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
    const [extendDays, setExtendDays] = useState(30);

    const filteredEmpresas = useMemo(() => {
        return empresas.filter(e => {
            const matchesName = e.nombre_empresa.toLowerCase().includes(search.toLowerCase());
            const matchesUser = e.user?.name.toLowerCase().includes(search.toLowerCase()) || e.user?.email.toLowerCase().includes(search.toLowerCase());
            return matchesName || matchesUser;
        });
    }, [empresas, search]);

    const handleToggleStatus = (empresa: Empresa) => {
        router.post(route('admin.empresas.toggle', { empresa: empresa.id }), {}, {
            preserveScroll: true,
        });
    };

    const handleExtend = () => {
        if (!selectedEmpresa) return;
        router.post(route('admin.empresas.extend', { empresa: selectedEmpresa.id }), {
            dias: extendDays,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsExtendModalOpen(false);
                setSelectedEmpresa(null);
            }
        });
    };

    const totalActive = empresas.filter(e => e.activo).length;
    const totalInactive = empresas.length - totalActive;

    return (
        <AppLayout breadcrumbs={[{ title: 'Super Admin', href: '/admin/empresas' }, { title: 'Empresas y Catálogos', href: '/admin/empresas' }]}>
            <Head title="Panel Super Admin - Catálogos y Tiendas" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                Gestión de Catálogos & Negocios
                            </h1>
                            <Badge variant="outline" className="bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 font-bold">
                                Super Admin
                            </Badge>
                        </div>
                       
                    </div>
                </div>

                {/* Métricas Generales */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Card className="border-border/80 bg-gradient-to-br from-card to-sky-50/20 dark:to-slate-900/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Negocios</CardTitle>
                            <Building2 className="h-4 w-4 text-sky-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-foreground">{empresas.length}</div>
                            <p className="text-[11px] text-muted-foreground">Catálogos registrados en la plataforma</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/80 bg-gradient-to-br from-card to-emerald-50/20 dark:to-emerald-950/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Tiendas Activas</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-emerald-600">{totalActive}</div>
                            <p className="text-[11px] text-muted-foreground">Visibles para los clientes finales</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/80 bg-gradient-to-br from-card to-rose-50/20 dark:to-rose-950/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Pausadas / Vencidas</CardTitle>
                            <XCircle className="h-4 w-4 text-rose-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-rose-600">{totalInactive}</div>
                            <p className="text-[11px] text-muted-foreground">Desactivadas o tiempo gratuito agotado</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtro y Tabla de Empresas */}
                <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 sm:p-6 border-b border-border/80">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-base font-bold">Listado de Empresas Registradas</CardTitle>
                                <CardDescription className="text-xs">
                                    Haz clic en el switch para activar/desactivar al instante el catálogo público.
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por negocio o usuario..."
                                    className="pl-8 h-9 text-xs rounded-xl"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-muted/40 text-muted-foreground uppercase font-bold text-[10px] tracking-wider border-b border-border/60">
                                <tr>
                                    <th className="py-3 px-4">Comercio / Tienda</th>
                                    <th className="py-3 px-4">Usuario Dueño</th>
                                    <th className="py-3 px-4 text-center">Productos</th>
                                    <th className="py-3 px-4 text-center">Pedidos</th>
                                    <th className="py-3 px-4">Vencimiento (1 Mes)</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filteredEmpresas.map((empresa) => {
                                    const isExpired = empresa.fecha_expiracion ? new Date(empresa.fecha_expiracion) < new Date() : false;
                                    const formattedExp = empresa.fecha_expiracion ? new Date(empresa.fecha_expiracion).toLocaleDateString() : 'Sin fecha';

                                    return (
                                        <tr key={empresa.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-8 w-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                                                        <Store className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-foreground block">{empresa.nombre_empresa}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">/{empresa.slug}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="font-medium text-foreground">{empresa.user?.name || 'Sin usuario'}</div>
                                                <div className="text-[10px] text-muted-foreground">{empresa.user?.email}</div>
                                            </td>

                                            <td className="py-3 px-4 text-center font-bold text-foreground">
                                                {empresa.productos_count}
                                            </td>

                                            <td className="py-3 px-4 text-center font-bold text-sky-600 dark:text-sky-400">
                                                {empresa.pedidos_count}
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span>{formattedExp}</span>
                                                </div>
                                                {isExpired && (
                                                    <span className="text-[9px] text-rose-500 font-bold uppercase block mt-0.5">Expirado</span>
                                                )}
                                            </td>

                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(empresa)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs ${
                                                        empresa.activo && !isExpired
                                                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-200'
                                                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 hover:bg-rose-200'
                                                    }`}
                                                >
                                                    {empresa.activo && !isExpired ? (
                                                        <>
                                                            <CheckCircle2 className="h-3 w-3" /> Activo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-3 w-3" /> Desactivado
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            <td className="py-3 px-4 text-right space-x-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 text-[11px] px-2 rounded-lg font-semibold hover:bg-sky-50 dark:hover:bg-sky-950 border-sky-200"
                                                    onClick={() => {
                                                        setSelectedEmpresa(empresa);
                                                        setIsExtendModalOpen(true);
                                                    }}
                                                >
                                                    Extender Mes
                                                </Button>

                                                <a
                                                    href={`/${empresa.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                                                    title="Ver Tienda"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredEmpresas.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                                            No se encontraron empresas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modal para Extender Tiempo */}
            <Dialog open={isExtendModalOpen} onOpenChange={setIsExtendModalOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Extender Período de Acceso
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Agrega más días de prueba o suscripción para <strong className="text-foreground">{selectedEmpresa?.nombre_empresa}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-3 gap-2">
                            {[15, 30, 60].map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => setExtendDays(d)}
                                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                                        extendDays === d
                                            ? 'bg-primary text-white border-primary shadow-xs'
                                            : 'bg-muted/40 hover:bg-muted text-foreground'
                                    }`}
                                >
                                    +{d} Días
                                </button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsExtendModalOpen(false)} className="rounded-xl">
                            Cancelar
                        </Button>
                        <Button size="sm" onClick={handleExtend} className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white">
                            Guardar Extensión
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
