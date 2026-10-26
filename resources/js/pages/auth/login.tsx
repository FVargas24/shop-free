import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: any;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout 
            title="Bienvenido de nuevo" 
            description="Ingresa tus credenciales para acceder a tu panel de administración"
        >
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    {status}
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={submit}>
                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-sky-500" /> Correo Electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="tunegocio@ejemplo.com"
                            className="h-11 rounded-xl text-xs bg-background/80 border-border/80 focus-visible:ring-sky-500"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="h-11 rounded-xl text-xs bg-background/80 border-border/80 pr-9 focus-visible:ring-sky-500"
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

                    <div className="flex items-center space-x-2 py-1">
                        <Checkbox 
                            id="remember" 
                            name="remember" 
                            tabIndex={3} 
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                            className="rounded-md border-border/80 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                        />
                        <Label htmlFor="remember" className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                            Mantener sesión iniciada
                        </Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-2 w-full h-11 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-98 cursor-pointer" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                Ingresando...
                            </>
                        ) : (
                            'Ingresar a mi Catálogo'
                        )}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-xs pt-2 border-t border-border/60">
                    ¿No tienes una cuenta aún?{' '}
                    <Link 
                        href={route('register')} 
                        className="font-bold text-sky-600 dark:text-sky-400 hover:underline" 
                        tabIndex={5}
                    >
                        Crear tienda gratis
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
