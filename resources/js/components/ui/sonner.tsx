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
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:border-destructive/60 group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive",
          success:
            "group-[.toaster]:border-emerald-500/60 group-[.toaster]:bg-emerald-500/10 group-[.toaster]:text-emerald-700 dark:group-[.toaster]:text-emerald-300",
        },
      }}
      position="top-right"
      richColors
      closeButton
      {...props}
    />
  )
}

export { Toaster }
