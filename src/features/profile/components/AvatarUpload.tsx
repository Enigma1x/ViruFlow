import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn'
import * as profilesService from '../../../services/profiles'
import { useAuthStore } from '../../../store/authStore'
import { toast } from '../../../store/toastStore'

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

interface AvatarUploadProps {
  userId: string
  avatarUrl: string | null
  fullName: string
}

export function AvatarUpload({ userId, avatarUrl, fullName }: AvatarUploadProps) {
  const setProfile = useAuthStore((s) => s.setProfile)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayUrl = previewUrl ?? avatarUrl

  const clearSelection = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedFile(null)
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearSelection()
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!selectedFile || !userId) return
    setUploading(true)
    try {
      const url = await profilesService.uploadAvatar(userId, selectedFile)
      const updated = await profilesService.updateProfile(userId, { avatar_url: url })
      setProfile(updated)
      clearSelection()
      toast.success('Foto de perfil actualizada')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al subir la foto')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    clearSelection()
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center text-2xl font-semibold overflow-hidden',
            'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            'ring-2 ring-gray-200 dark:ring-gray-600'
          )}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span aria-hidden>{getInitials(fullName)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-1.5 rounded-full bg-brand text-white shadow hover:opacity-90 disabled:opacity-50"
          aria-label="Cambiar foto"
        >
          <Camera className="w-4 h-4" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden
        />
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
            ) : null}
            Guardar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={uploading}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
