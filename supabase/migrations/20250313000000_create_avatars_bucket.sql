-- Bucket para fotos de perfil (avatars).
-- Ejecuta este SQL en el Supabase Dashboard → SQL Editor si la subida de foto devuelve 400.
-- Ver: https://supabase.com/docs/guides/storage/security/access-control

-- 1. Crear el bucket (si ya existe, omite o comenta esta parte)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- 2. Políticas para que los usuarios autenticados puedan subir y actualizar su avatar
-- Lectura pública (para que la URL del avatar funcione sin login)
create policy "Avatar images are publicly accessible"
on storage.objects for select
using (bucket_id = 'avatars');

-- Solo usuarios autenticados pueden subir; solo en su carpeta (userId)
create policy "Users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (auth.jwt()->>'sub')
);

-- Solo el dueño puede actualizar (reemplazar avatar con upsert)
create policy "Users can update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (auth.jwt()->>'sub')
)
with check (bucket_id = 'avatars');
