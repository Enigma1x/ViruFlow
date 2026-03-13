import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import { toast } from '../../store/toastStore'
import * as profilesService from '../../services/profiles'
import { AvatarUpload } from './components/AvatarUpload'
import { cn } from '../../utils/cn'

const profileFormSchema = z.object({
  full_name: z.string().min(1, 'El nombre es obligatorio'),
  username: z
    .string()
    .optional()
    .refine(
      (v) => !v || (v.length >= 3 && v.length <= 30 && /^[a-z0-9_]+$/.test(v)),
      'Usuario: 3-30 caracteres, solo minúsculas, números y _'
    ),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function Profile() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      full_name: '',
      username: '',
    },
  })

  useEffect(() => {
    if (profile) {
      reset({ full_name: profile.full_name, username: profile.username ?? '' })
    }
  }, [profile?.id, profile?.full_name, profile?.username, reset])

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) return
    const result = profileFormSchema.safeParse(data)
    if (!result.success) {
      result.error.errors.forEach((err) => {
        const path = err.path[0]
        if (path) toast.error(String(err.message))
      })
      return
    }
    try {
      const updated = await profilesService.updateProfile(user.id, {
        full_name: result.data.full_name,
        username: result.data.username ?? null,
      })
      setProfile(updated)
      toast.success('Perfil actualizado')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al guardar')
    }
  }

  if (!user || !profile) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Perfil
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Inicia sesión para ver tu perfil.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Perfil
      </h2>

      <AvatarUpload
        userId={user.id}
        avatarUrl={profile.avatar_url}
        fullName={profile.full_name}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="profile-full_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Nombre completo
          </label>
          <input
            id="profile-full_name"
            type="text"
            {...register('full_name')}
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-gray-900 dark:text-gray-100',
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand',
              errors.full_name && 'border-red-500 dark:border-red-500'
            )}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="profile-email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={profile.email ?? ''}
            readOnly
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="profile-username"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Usuario
          </label>
          <input
            id="profile-username"
            type="text"
            {...register('username')}
            placeholder="usuario_opcional"
            className={cn(
              'w-full px-3 py-2 rounded-lg border text-gray-900 dark:text-gray-100',
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand',
              errors.username && 'border-red-500 dark:border-red-500'
            )}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rol
          </span>
          <p className="text-gray-900 dark:text-gray-100 capitalize">
            {profile.role}
          </p>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Puesto
          </span>
          <p className="text-gray-900 dark:text-gray-100">
            {profile.job_title ?? '—'}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'px-4 py-2 rounded-lg bg-brand text-white font-medium',
            'hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
