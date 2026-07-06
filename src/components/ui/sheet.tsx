import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close
const SheetPortal = DialogPrimitive.Portal

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm transition-opacity duration-300',
        'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
        className,
      )}
      {...props}
    />
  )
}

interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  title: string
  description?: string
}

function SheetContent({ className, children, title, description, ...props }: SheetContentProps) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xs flex-col border-l border-line bg-surface p-6',
          'transition-transform duration-300 ease-out',
          'data-[state=closed]:translate-x-full data-[state=open]:translate-x-0',
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
        ) : null}
        <DialogPrimitive.Close className="absolute right-4 top-4 text-muted transition-colors hover:text-text">
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Fechar menu</span>
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent }
