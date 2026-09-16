-- Tipo enum para dificuldade das tarefas
CREATE TYPE public.task_difficulty AS ENUM ('easy', 'medium', 'hard', 'epic');

-- Tabela de perfis/personagens
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    character_name text NOT NULL,
    level integer NOT NULL DEFAULT 1,
    xp integer NOT NULL DEFAULT 0,
    coins integer NOT NULL DEFAULT 0,
    attribute_points integer NOT NULL DEFAULT 0,
    strength integer NOT NULL DEFAULT 0,
    intelligence integer NOT NULL DEFAULT 0,
    discipline integer NOT NULL DEFAULT 0,
    creativity integer NOT NULL DEFAULT 0,
    resilience integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Tabela de tarefas/missões
CREATE TABLE public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    difficulty public.task_difficulty NOT NULL DEFAULT 'easy',
    due_date date,
    completed boolean NOT NULL DEFAULT false,
    completed_at timestamp with time zone,
    xp_reward integer NOT NULL DEFAULT 0,
    coin_reward integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Grants para a API do Lovable Cloud
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;

GRANT USAGE ON TYPE public.task_difficulty TO authenticated;
GRANT USAGE ON TYPE public.task_difficulty TO service_role;

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Políticas para tasks
CREATE POLICY "Users can read own tasks"
    ON public.tasks
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own tasks"
    ON public.tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks"
    ON public.tasks
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks"
    ON public.tasks
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Função para calcular XP necessário para o próximo nível
CREATE OR REPLACE FUNCTION public.xp_for_level(_level integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT _level * 100;
$$;

-- Função para completar tarefa e aplicar recompensas
CREATE OR REPLACE FUNCTION public.complete_task(_task_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_id uuid;
    _xp_reward integer;
    _coin_reward integer;
    _profile public.profiles%ROWTYPE;
    _next_level_xp integer;
    _levels_gained integer := 0;
BEGIN
    -- Recupera a tarefa e verifica propriedade
    SELECT user_id, xp_reward, coin_reward
    INTO _user_id, _xp_reward, _coin_reward
    FROM public.tasks
    WHERE id = _task_id AND completed = false;

    IF _user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Task not found or already completed');
    END IF;

    IF _user_id <> auth.uid() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
    END IF;

    -- Marca tarefa como concluída
    UPDATE public.tasks
    SET completed = true,
        completed_at = now(),
        updated_at = now()
    WHERE id = _task_id;

    -- Atualiza perfil com recompensas
    UPDATE public.profiles
    SET xp = xp + _xp_reward,
        coins = coins + _coin_reward,
        updated_at = now()
    WHERE user_id = _user_id
    RETURNING * INTO _profile;

    -- Verifica level up
    _next_level_xp := public.xp_for_level(_profile.level);
    WHILE _profile.xp >= _next_level_xp LOOP
        _levels_gained := _levels_gained + 1;
        UPDATE public.profiles
        SET level = level + 1,
            xp = xp - _next_level_xp,
            attribute_points = attribute_points + 3,
            updated_at = now()
        WHERE user_id = _user_id
        RETURNING * INTO _profile;
        _next_level_xp := public.xp_for_level(_profile.level);
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'xp_gained', _xp_reward,
        'coins_gained', _coin_reward,
        'levels_gained', _levels_gained,
        'profile', row_to_json(_profile)
    );
END;
$$;

-- Função para distribuir pontos de atributo
CREATE OR REPLACE FUNCTION public.spend_attribute_point(_attribute text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _profile public.profiles%ROWTYPE;
    _valid_attributes text[] := ARRAY['strength', 'intelligence', 'discipline', 'creativity', 'resilience'];
BEGIN
    IF NOT (_attribute = ANY(_valid_attributes)) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid attribute');
    END IF;

    SELECT * INTO _profile
    FROM public.profiles
    WHERE user_id = auth.uid();

    IF _profile.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
    END IF;

    IF _profile.attribute_points <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'No attribute points available');
    END IF;

    UPDATE public.profiles
    SET attribute_points = attribute_points - 1,
        updated_at = now(),
        strength = CASE WHEN _attribute = 'strength' THEN strength + 1 ELSE strength END,
        intelligence = CASE WHEN _attribute = 'intelligence' THEN intelligence + 1 ELSE intelligence END,
        discipline = CASE WHEN _attribute = 'discipline' THEN discipline + 1 ELSE discipline END,
        creativity = CASE WHEN _attribute = 'creativity' THEN creativity + 1 ELSE creativity END,
        resilience = CASE WHEN _attribute = 'resilience' THEN resilience + 1 ELSE resilience END
    WHERE user_id = auth.uid()
    RETURNING * INTO _profile;

    RETURN jsonb_build_object('success', true, 'profile', row_to_json(_profile));
END;
$$;

-- Trigger para criar perfil automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, character_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'character_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Índices úteis
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_completed ON public.tasks(completed);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
