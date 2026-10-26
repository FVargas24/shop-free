import { Head, useForm, Link } from '@inertiajs/react';
import { 
    LoaderCircle, 
    Building2, 
    User, 
    Mail, 
    Lock, 
    Phone, 
    Briefcase, 
    ChevronRight, 
    ChevronLeft, 
    CheckCircle2, 
    Check, 
    Eye,
    EyeOff
} from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthLayout from '@/layouts/auth-layout';
import { cn } from '@/lib/utils';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    nombre_empresa: string;
    celular: string;
    tipo: string;
    [key: string]: any;
}

interface CountryConfig {
    name: string;
    code: string;
    dial: string;
    flag: string;
    length: number;
    validPrefixes?: string[];
}

const COUNTRIES: CountryConfig[] = [
    { name: 'Bolivia', code: 'BO', dial: '+591', flag: '🇧🇴', length: 8, validPrefixes: ['5', '6', '7'] },
    { name: 'Perú', code: 'PE', dial: '+51', flag: '🇵🇪', length: 9, validPrefixes: ['9'] },
    { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷', length: 10 },
    { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱', length: 9 },
    { name: 'Colombia', code: 'CO', dial: '+57', flag: '🇨🇴', length: 10, validPrefixes: ['3'] },
    { name: 'Ecuador', code: 'EC', dial: '+593', flag: '🇪🇨', length: 9, validPrefixes: ['9'] },
    { name: 'México', code: 'MX', dial: '+52', flag: '🇲🇽', length: 10 },
    { name: 'Paraguay', code: 'PY', dial: '+595', flag: '🇵🇾', length: 9 },
    { name: 'Uruguay', code: 'UY', dial: '+598', flag: '🇺🇾', length: 8 },
    { name: 'Brasil', code: 'BR', dial: '+55', flag: '🇧🇷', length: 11 },
    { name: 'Estados Unidos', code: 'US', dial: '+1', flag: '🇺🇸', length: 10 },
    { name: 'España', code: 'ES', dial: '+34', flag: '🇪🇸', length: 9 },
];

const businessTypes = [
    'Restaurante / Comida / Cafetería',
    'Tienda de Ropa / Moda / Accesorios',
    'Servicios Técnicos / Reparaciones',
    'Educación / Cursos / Talleres',
    'Salud / Belleza / Barbería / Spa',
    'Tecnología / Computación / Celulares',
    'Entretenimiento / Eventos / Fiestas',
    'Ferretería / Materiales / Hogar',
    'Venta de Productos Varios / Bazar',
    'Otro Emprendimiento',
];

export default function Register() {
    const [step, setStep] = useState(1);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // Selector de país y celular
    const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);
    const [countrySearch, setCountrySearch] = useState('');
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [phoneRaw, setPhoneRaw] = useState('');
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nombre_empresa: '',
        celular: '',
        tipo: '',
    });

    // Paises filtrados por búsqueda
    const filteredCountries = COUNTRIES.filter(c => {
        if (!countrySearch.trim()) return true;
        const q = countrySearch.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q);
    });

    const handlePhoneChange = (val: string) => {
        const cleaned = val.replace(/\D/g, '');
        const maxLen = selectedCountry.length;
        const trimmed = cleaned.slice(0, maxLen);
        setPhoneRaw(trimmed);

        if (!trimmed) {
            setPhoneError('Ingresa tu número de WhatsApp');
            setData('celular', '');
            return;
        }

        if (selectedCountry.code === 'BO') {
            const firstDigit = trimmed.charAt(0);
            if (!['6', '7', '5'].includes(firstDigit)) {
                setPhoneError('En Bolivia los celulares inician con 6 o 7 (o 5)');
            } else if (trimmed.length < 8) {
                setPhoneError(`Faltan ${8 - trimmed.length} dígitos (deben ser 8)`);
            } else {
                setPhoneError(null);
            }
        } else if (selectedCountry.validPrefixes && selectedCountry.validPrefixes.length > 0) {
            const firstDigit = trimmed.charAt(0);
            if (!selectedCountry.validPrefixes.includes(firstDigit)) {
                setPhoneError(`En ${selectedCountry.name} suele iniciar con ${selectedCountry.validPrefixes.join(', ')}`);
            } else if (trimmed.length < selectedCountry.length) {
                setPhoneError(`Faltan ${selectedCountry.length - trimmed.length} dígitos`);
            } else {
                setPhoneError(null);
            }
        } else {
            if (trimmed.length < selectedCountry.length) {
                setPhoneError(`Faltan ${selectedCountry.length - trimmed.length} dígitos`);
            } else {
                setPhoneError(null);
            }
        }

        setData('celular', `${selectedCountry.dial} ${trimmed}`);
    };

    const handleSelectCountry = (country: CountryConfig) => {
        setSelectedCountry(country);
        setIsCountryDropdownOpen(false);
        setCountrySearch('');
        if (phoneRaw) {
            const trimmed = phoneRaw.slice(0, country.length);
            setPhoneRaw(trimmed);
            setData('celular', `${country.dial} ${trimmed}`);
        }
    };

    const validateStep = (currentStep: number) => {
        clearErrors();
        if (currentStep === 1) {
            if (!data.nombre_empresa.trim()) return false;
            if (!data.tipo) return false;
            if (!phoneRaw || phoneRaw.length < selectedCountry.length) {
                setPhoneError(`Ingresa tu número completo (${selectedCountry.length} dígitos)`);
                return false;
            }
            if (selectedCountry.code === 'BO' && !['6', '7', '5'].includes(phoneRaw.charAt(0))) {
                setPhoneError('En Bolivia el número debe iniciar con 6, 7 o 5');
                return false;
            }
        } else if (currentStep === 2) {
            if (!data.name.trim() || !data.email.trim() || !data.password || !data.password_confirmation) return false;
            if (data.password !== data.password_confirmation) return false;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!validateStep(1) || !validateStep(2)) return;

        setIsSimulatingLoad(true);
        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
            },
            onSuccess: () => {
                setIsSimulatingLoad(false);
                setIsSuccessOpen(true);
            },
            onError: () => {
                setIsSimulatingLoad(false);
                if (errors.email || errors.name || errors.password) setStep(2);
                else if (errors.nombre_empresa || errors.tipo || errors.celular) setStep(1);
            }
        });
    };

    const steps = [
        { id: 1, label: 'Negocio', icon: Building2 },
        { id: 2, label: 'Cuenta', icon: User },
        { id: 3, label: 'Confirmar', icon: Eye },
    ];

    return (
        <AuthLayout 
            title={step === 3 ? "Verifica y Comienza" : "Crea tu Tienda Gratis"} 
            description={
                step === 1 ? "Paso 1: Información de tu negocio para configurar tu catálogo digital" :
                step === 2 ? "Paso 2: Datos de acceso para administrar tus productos y pedidos" :
                "Paso 3: Todo listo. Revisa tu información antes de activar tu mes gratis"
            }
        >
            <Head title="Registro de Tienda Gratis" />
            
            {/* Stepper Visual */}
            <div className="mb-8 relative">
                <div className="flex justify-between items-center relative z-10 px-4">
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-1.5">
                            <div className={cn(
                                "h-11 w-11 flex items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-xs",
                                step >= s.id 
                                    ? "bg-sky-600 border-sky-600 text-white shadow-sky-600/25 shadow-md scale-105" 
                                    : "bg-card border-border/80 text-muted-foreground"
                            )}>
                                {step > s.id ? <Check className="h-5 w-5 stroke-[2.5]" /> : <s.icon className="h-5 w-5" />}
                            </div>
                            <span className={cn(
                                "text-[11px] uppercase font-black tracking-wider transition-colors duration-300",
                                step >= s.id ? "text-sky-600 dark:text-sky-400" : "text-muted-foreground"
                            )}>{s.label}</span>
                        </div>
                    ))}
                </div>
                {/* Connecting Line */}
                <div className="absolute top-5 left-6 right-6 h-[2px] bg-border/60 -z-0">
                    <div 
                        className="h-full bg-gradient-to-r from-sky-600 to-blue-700 transition-all duration-500 ease-in-out" 
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                
                {/* Paso 1: Información de la Empresa */}
                {step === 1 && (
                    <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-400">
                        <div className="grid gap-1.5">
                            <Label htmlFor="nombre_empresa" className="flex items-center justify-between font-bold text-xs text-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="h-4 w-4 text-sky-600" />
                                    Nombre de tu Tienda o Empresa *
                                </span>
                                <span className="text-[10px] text-muted-foreground font-normal">EN MAYÚSCULAS</span>
                            </Label>
                            <Input
                                id="nombre_empresa"
                                required
                                value={data.nombre_empresa}
                                onChange={(e) => setData('nombre_empresa', e.target.value.toUpperCase())}
                                disabled={processing}
                                placeholder="EJ: BOUTIQUE ELEGANTE, BURGER QUEEN..."
                                className="h-11 rounded-xl text-xs uppercase font-bold tracking-wide shadow-2xs"
                                autoFocus
                            />
                            <InputError message={errors.nombre_empresa} />
                            <p className="text-[11px] text-muted-foreground">
                                Tu catálogo estará disponible en: <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">/{data.nombre_empresa ? data.nombre_empresa.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'tu-tienda'}</span>
                            </p>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="tipo" className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                                <Briefcase className="h-4 w-4 text-sky-600" /> Rubro / Tipo de Negocio *
                            </Label>
                            <Select 
                                value={data.tipo} 
                                onValueChange={(value) => setData('tipo', value)}
                                disabled={processing}
                            >
                                <SelectTrigger className="h-11 rounded-xl text-xs font-semibold shadow-2xs">
                                    <SelectValue placeholder="Selecciona el rubro de tu negocio" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl max-h-60">
                                    {businessTypes.map((type) => (
                                        <SelectItem key={type} value={type} className="text-xs py-2 font-medium">
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipo} />
                        </div>

                        {/* CELULAR CON BUSCADOR DE PAÍS */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="celular" className="flex items-center justify-between font-bold text-xs text-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Phone className="h-4 w-4 text-emerald-600" />
                                    Celular / WhatsApp para Pedidos *
                                </span>
                                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold">
                                    {phoneRaw.length}/{selectedCountry.length} dígitos
                                </span>
                            </Label>

                            <div className="relative">
                                <div className="flex gap-2">
                                    {/* Botón Selector de País */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                            className="h-11 px-3 rounded-xl border border-input bg-card hover:bg-muted flex items-center gap-1.5 text-xs font-semibold shadow-2xs transition-colors shrink-0"
                                        >
                                            <span className="text-lg leading-none">{selectedCountry.flag}</span>
                                            <span className="font-mono text-muted-foreground">{selectedCountry.dial}</span>
                                            <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${isCountryDropdownOpen ? 'rotate-90' : ''}`} />
                                        </button>

                                        {/* Dropdown de Países con Buscador */}
                                        {isCountryDropdownOpen && (
                                            <div className="absolute left-0 bottom-full mb-1 z-50 w-72 max-h-64 rounded-xl border border-border bg-popover/95 backdrop-blur-md shadow-xl flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
                                                <div className="p-2 border-b bg-muted/40">
                                                    <input
                                                        type="text"
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        placeholder="Buscar país o código..."
                                                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:outline-none focus:ring-1 focus:ring-sky-500"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="overflow-y-auto max-h-52 divide-y divide-border/40">
                                                    {filteredCountries.map((c) => (
                                                        <button
                                                            key={c.code}
                                                            type="button"
                                                            onClick={() => handleSelectCountry(c)}
                                                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-accent hover:text-accent-foreground transition-colors ${
                                                                selectedCountry.code === c.code ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold' : ''
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-base leading-none">{c.flag}</span>
                                                                <span>{c.name}</span>
                                                            </div>
                                                            <span className="font-mono text-[11px] text-muted-foreground font-semibold">{c.dial}</span>
                                                        </button>
                                                    ))}
                                                    {filteredCountries.length === 0 && (
                                                        <div className="p-4 text-center text-xs text-muted-foreground">
                                                            No se encontró el país
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input de número telefónico */}
                                    <div className="relative flex-1">
                                        <Input
                                            id="celular"
                                            type="tel"
                                            inputMode="numeric"
                                            required
                                            value={phoneRaw}
                                            onChange={(e) => handlePhoneChange(e.target.value)}
                                            disabled={processing}
                                            placeholder={selectedCountry.code === 'BO' ? 'Ej: 71234567 o 60012345' : 'Número de celular'}
                                            maxLength={selectedCountry.length}
                                            className={`h-11 rounded-xl text-xs font-mono font-bold tracking-wider shadow-2xs ${
                                                phoneError ? 'border-destructive focus-visible:ring-destructive' : ''
                                            }`}
                                        />
                                    </div>
                                </div>

                                {phoneError ? (
                                    <p className="text-[11px] text-destructive mt-1 flex items-center gap-1 font-medium">
                                        <span className="h-1.5 w-1.5 rounded-full bg-destructive inline-block" />
                                        {phoneError}
                                    </p>
                                ) : phoneRaw.length === selectedCountry.length ? (
                                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Número válido ({selectedCountry.name})
                                    </p>
                                ) : null}
                            </div>
                            <InputError message={errors.celular} />
                        </div>

                        <Button 
                            type="button" 
                            onClick={nextStep} 
                            disabled={!data.nombre_empresa.trim() || !data.tipo || !phoneRaw || phoneRaw.length < selectedCountry.length || !!phoneError}
                            className="mt-2 h-11 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-md shadow-sky-600/20"
                        >
                            Continuar al Paso 2 <ChevronRight className="h-4 w-4 ml-1.5" />
                        </Button>
                    </div>
                )}

                {/* Paso 2: Información de la Cuenta */}
                {step === 2 && (
                    <div className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-400">
                        <div className="grid gap-1.5">
                            <Label htmlFor="name" className="flex items-center justify-between font-bold text-xs text-foreground">
                                <span className="flex items-center gap-1.5">
                                    <User className="h-4 w-4 text-sky-600" /> Tu Nombre Completo *
                                </span>
                                <span className="text-[10px] text-muted-foreground font-normal">EN MAYÚSCULAS</span>
                            </Label>
                            <Input
                                id="name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value.toUpperCase())}
                                disabled={processing}
                                placeholder="EJ: JUAN PÉREZ ARCE"
                                className="h-11 rounded-xl text-xs uppercase font-bold tracking-wide shadow-2xs"
                                autoFocus
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                                <Mail className="h-4 w-4 text-sky-600" /> Correo Electrónico para Acceder *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value.toLowerCase())}
                                disabled={processing}
                                placeholder="tu-correo@ejemplo.com"
                                className="h-11 rounded-xl text-xs font-semibold shadow-2xs"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                                <Label htmlFor="password" title="Mínimo 8 caracteres" className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                                    <Lock className="h-4 w-4 text-sky-600" /> Contraseña *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="••••••••"
                                        className="h-11 rounded-xl text-xs pr-9 shadow-2xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                        tabIndex={-1}
                                        title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password_confirmation" className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                                    <Lock className="h-4 w-4 text-sky-600" /> Confirmar *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showPasswordConfirm ? 'text' : 'password'}
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        placeholder="••••••••"
                                        className="h-11 rounded-xl text-xs pr-9 shadow-2xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                        tabIndex={-1}
                                        title={showPasswordConfirm ? "Ocultar confirmación" : "Ver confirmación"}
                                    >
                                        {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>

                        {data.password && data.password_confirmation && data.password !== data.password_confirmation && (
                            <p className="text-[11px] text-destructive font-medium">Las contraseñas no coinciden.</p>
                        )}

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <Button type="button" onClick={prevStep} variant="outline" className="h-11 rounded-xl text-xs font-bold">
                                <ChevronLeft className="h-4 w-4 mr-1.5" /> Anterior
                            </Button>
                            <Button 
                                type="button" 
                                onClick={nextStep} 
                                disabled={!data.name.trim() || !data.email.trim() || !data.password || data.password.length < 8 || data.password !== data.password_confirmation}
                                className="h-11 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-md shadow-sky-600/20"
                            >
                                Siguiente <ChevronRight className="h-4 w-4 ml-1.5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Paso 3: Revisión Final */}
                {step === 3 && (
                    <div className="animate-in fade-in zoom-in-95 duration-400 space-y-5">
                        <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400 tracking-wider">Plan Seleccionado</span>
                                    <h4 className="font-extrabold text-sm text-foreground">Plan Gratuito (1 Mes de Prueba)</h4>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    Bs. 0 / GRATIS
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" /> Resumen del Negocio
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-xs bg-card p-3 rounded-xl border border-border/60">
                                    <div>
                                        <p className="text-[11px] text-muted-foreground">Tienda</p>
                                        <p className="font-bold text-foreground truncate">{data.nombre_empresa}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-muted-foreground">Rubro</p>
                                        <p className="font-bold text-foreground truncate">{data.tipo}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[11px] text-muted-foreground">WhatsApp para Pedidos</p>
                                        <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                            <span>{selectedCountry.flag}</span>
                                            <span>{data.celular}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-1">
                                <h3 className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" /> Administrador de la Cuenta
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-xs bg-card p-3 rounded-xl border border-border/60">
                                    <div>
                                        <p className="text-[11px] text-muted-foreground">Propietario</p>
                                        <p className="font-bold text-foreground truncate">{data.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-muted-foreground">Email de Ingreso</p>
                                        <p className="font-semibold text-foreground truncate">{data.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button type="button" onClick={prevStep} variant="outline" className="h-11 rounded-xl text-xs font-bold" disabled={isSimulatingLoad}>
                                <ChevronLeft className="h-4 w-4 mr-1.5" /> Volver
                            </Button>
                            <Button 
                                type="submit" 
                                className="h-11 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-lg shadow-sky-600/25" 
                                disabled={processing || isSimulatingLoad}
                            >
                                {(processing || isSimulatingLoad) ? (
                                    <><LoaderCircle className="h-4 w-4 animate-spin mr-2" /> Creando Tu Tienda...</>
                                ) : (
                                    "¡Activar Mi Tienda Gratis!"
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-muted-foreground text-center text-xs mt-2">
                    ¿Ya tienes una cuenta registrada?{' '}
                    <Link href={route('login')} className="font-bold text-sky-600 dark:text-sky-400 underline-offset-4 hover:underline">
                        Inicia sesión aquí
                    </Link>
                </div>
            </form>

            {/* Success Congratulation Modal */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="sm:max-w-md text-center py-16 rounded-[2.5rem] border-none shadow-2xl">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 mb-8 border border-green-100 dark:border-green-900/50">
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 animate-in zoom-in spin-in-90 duration-500" />
                    </div>
                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">¡Felicidades!</DialogTitle>
                        <DialogDescription className="text-lg text-muted-foreground px-4">
                            Tu cuenta ha sido creada exitosamente. Estamos preparándolo todo para que comiences a gestionar tu negocio.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-10 px-8">
                        <div className="flex items-center justify-center gap-3 text-primary font-bold">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            <span>Redirigiendo a tu panel...</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthLayout>
    );
}
