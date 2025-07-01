-- ───────────────────────────────────────────────────────────────
--  RLS HOT-FIX - remove circular reference on public.usuarios
--      run:  psql -f scripts/16-fix-usuarios-policies.sql
-- ───────────────────────────────────────────────────────────────

-- 1. Make sure RLS is ON
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 2. Drop the buggy policy (if it exists)
DROP POLICY IF EXISTS "Users can update own data" ON public.usuarios;

-- 3. Re-create a SAFE version (no sub-query, no role lookup)
CREATE POLICY "Users can update own data"
    ON public.usuarios
    FOR UPDATE
    USING      (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 4.  Optional: ensure SELECT / INSERT / DELETE are also safe
DROP POLICY IF EXISTS "Users can view own data"   ON public.usuarios;
DROP POLICY IF EXISTS "Users can insert own data" ON public.usuarios;
DROP POLICY IF EXISTS "Users can delete own data" ON public.usuarios;

CREATE POLICY "Users can view own data"
    ON public.usuarios
    FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can insert own data"
    ON public.usuarios
    FOR INSERT
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can delete own data"
    ON public.usuarios
    FOR DELETE
    USING (id = auth.uid());
