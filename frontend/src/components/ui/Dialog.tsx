import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Dialog Root 组件
 */
const Dialog = DialogPrimitive.Root;

/**
 * Dialog Trigger 组件
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Dialog Portal 组件
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * Dialog Close 组件
 */
const DialogClose = DialogPrimitive.Close;

/**
 * Dialog Overlay 组件
 * 毛玻璃背景：surface-variant opacity 0.8 + blur 20px
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // 毛玻璃背景：surface-variant + opacity 0.8 + blur 20px
      'fixed inset-0 z-50',
      'bg-surface-variant/80 backdrop-blur-xl',
      // 过渡动画
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'duration-300',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * Dialog Content 组件接口
 */
export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** 隐藏关闭按钮 */
  hideClose?: boolean;
}

/**
 * Dialog Content 组件
 * 背景：surface-container-highest + rounded-2xl + shadow-lg
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, hideClose = false, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // 位置：居中
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg',
        'translate-x-[-50%] translate-y-[-50%]',
        // 背景：surface-container-highest + rounded-2xl + shadow-lg
        'bg-surface-container-highest rounded-2xl',
        'shadow-lg',
        // 无边框设计
        'border-0',
        // 内边距
        'p-6',
        // 过渡动画：300ms cubic-bezier
        'duration-300 ease-in-out',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        className
      )}
      {...props}
    >
      {children}
      {!hideClose && (
        <DialogPrimitive.Close
          className={cn(
            // 关闭按钮样式
            'absolute right-4 top-4',
            'rounded-lg p-2',
            'text-on-surface-variant',
            'transition-all duration-200 ease-in-out',
            'hover:bg-surface-container-high hover:text-on-surface',
            'focus:outline-none focus:bg-surface-container-high'
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">关闭</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * Dialog Header 组件
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

/**
 * Dialog Footer 组件
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

/**
 * Dialog Title 组件
 * 使用 Manrope 字体 + on-surface 颜色
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // Manrope 字体 + on-surface 颜色
      'font-display text-lg font-semibold leading-none tracking-tight text-on-surface',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * Dialog Description 组件
 * 使用 on-surface-variant 颜色
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-on-surface-variant', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};