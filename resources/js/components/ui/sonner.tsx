import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0B132B] group-[.toaster]:text-slate-100 group-[.toaster]:border-sky-500/40 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl dark:group-[.toaster]:bg-[#070D1E] dark:group-[.toaster]:border-sky-400/40",
          description: "group-[.toast]:text-sky-300/90 text-xs font-medium",
          actionButton:
            "group-[.toast]:bg-sky-500 group-[.toast]:text-white font-bold",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-300",
          error:
            "group-[.toaster]:border-rose-500/60 group-[.toaster]:bg-[#1E1014] group-[.toaster]:text-rose-300",
          success:
            "group-[.toaster]:border-sky-400/60 group-[.toaster]:bg-[#0B1530] group-[.toaster]:text-sky-200 shadow-sky-950/50",
          info:
            "group-[.toaster]:border-sky-400/60 group-[.toaster]:bg-[#0B1530] group-[.toaster]:text-sky-200",
        },
      }}
      position="top-right"
      richColors={false}
      closeButton
      {...props}
    />
  )
}

export { Toaster }
