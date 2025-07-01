-- Adiciona a coluna "role" se ainda não existir
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer' 
  CHECK (role IN ('admin', 'rh', 'sst', 'viewer'));

-- Opcional: garanta que futuras atualizações no perfil alterem updated_at
-- (só cria o trigger se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_profiles_updated_at'
  ) THEN
    CREATE TRIGGER handle_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END;
$$;
