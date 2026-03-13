import { useState, useRef } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { cn } from '../../../utils/cn'

interface ChatInputProps {
  onSend: (content: string, mediaUrl?: string | null) => Promise<void>
  onSendFile: (file: File) => Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSend, onSendFile, disabled }: ChatInputProps) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || sending || disabled) return
    setSending(true)
    try {
      await onSend(trimmed)
      setText('')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || sending || disabled) return
    e.target.value = ''
    setSending(true)
    try {
      await onSendFile(file)
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || sending}
        className={cn(
          'p-2 rounded-lg shrink-0',
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50'
        )}
        aria-label="Adjuntar archivo"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe un mensaje..."
        rows={1}
        disabled={disabled || sending}
        className={cn(
          'flex-1 min-h-[40px] max-h-32 resize-none rounded-xl px-4 py-2.5 text-sm',
          'border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800',
          'text-gray-900 dark:text-gray-100 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand',
          'disabled:opacity-50'
        )}
      />
      <button
        type="submit"
        disabled={!text.trim() || sending || disabled}
        className={cn(
          'p-2 rounded-xl shrink-0 bg-brand text-white',
          'hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Enviar"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}
