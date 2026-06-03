import { useState, type ReactNode, type TextareaHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { Check, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useToast } from './Toast'

function cx(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

export function Button({
  variant = 'default',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' | 'ghost' }) {
  const styles = {
    default: 'bg-surface-2 hover:bg-border text-fg border border-border',
    primary: 'bg-accent text-accent-fg hover:opacity-90 border border-transparent',
    ghost: 'bg-transparent hover:bg-surface-2 text-muted hover:text-fg border border-transparent',
  }[variant]
  return (
    <button
      className={cx(
        'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        styles,
        className,
      )}
      {...props}
    />
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted/80">{hint}</span>}
    </label>
  )
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      spellCheck={false}
      className={cx(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm leading-relaxed text-fg outline-none transition focus:border-accent resize-y min-h-32',
        className,
      )}
      {...props}
    />
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-fg outline-none transition focus:border-accent',
        className,
      )}
      {...props}
    />
  )
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        'rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none transition focus:border-accent cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-fg">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-surface-2 border border-border',
        )}
      >
        <span
          className={cx(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </button>
      {label}
    </label>
  )
}

export function CopyButton({ value, label = 'Kopyala' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  const { t } = useTranslation()
  return (
    <Button
      variant="ghost"
      disabled={!value}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          toast(t('common.copied'))
          setTimeout(() => setCopied(false), 1200)
        } catch {
          toast(t('common.copyFailed'))
        }
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {label}
    </Button>
  )
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
      {children}
    </div>
  )
}

export function Output({ value, mono = true }: { value: string; mono?: boolean }) {
  return (
    <pre
      className={cx(
        'w-full overflow-auto rounded-lg border border-border bg-surface px-3 py-2 text-sm whitespace-pre-wrap break-words min-h-32 text-fg',
        mono && 'font-mono',
      )}
    >
      {value}
    </pre>
  )
}

export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('flex flex-wrap items-center gap-3', className)}>{children}</div>
}
