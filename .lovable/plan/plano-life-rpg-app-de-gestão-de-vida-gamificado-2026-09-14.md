# Plano: Life RPG — App de Gestão de Vida Gamificado

## Resumo do produto
Um app web responsivo onde tarefas, hábitos e desafios do dia a dia viram missões de RPG. Completar atividades gera XP e moedas, que fazem o personagem do usuário subir de nível e evoluir atributos. Visual com paleta de tons de fogo (laranja, âmbar, vermelho escuro, carvão).

## Escopo do MVP
Funcionalidades essenciais para a primeira versão:

1. **Autenticação com Lovable Cloud**
   - Cadastro e login com email/senha.
   - Perfil vinculado ao usuário criado automaticamente no signup.

2. **Perfil / Personagem**
   - Nome do personagem, nível, XP total, XP para o próximo nível.
   - Atributos: Força, Inteligência, Disciplina, Criatividade, Resiliência.
   - Moedas acumuladas.

3. **Tarefas como missões**
   - Criar tarefas com título, descrição opcional, dificuldade (Fácil, Médio, Difícil, Épico) e data de vencimento.
   - Completar tarefa gera XP e moedas conforme a dificuldade.
   - Lista de tarefas pendentes e concluídas.

4. **Dashboard / Tela inicial autenticada**
   - Resumo do personagem (nível, XP, atributos, moedas).
   - Tarefas do dia.
   - Ações rápidas: adicionar tarefa, completar tarefa.

## Decisões de design
- **Estilo visual**: RPG minimalista com paleta de fogo. Cores base: carvão, âmbar, laranja, vermelho escuro. Elementos sutis de jogo (barras de XP, badges de nível, ícones de missão) sem exageros de fantasia.
- **Experiência**: responsivo igual desde o início, funcionando bem em celular e desktop.
- **Gamificação**: cada tarefa concluída alimenta o mesmo personagem. Nível sobe ao atingir o XP necessário; atributos podem ser aumentados com pontos ganhos a cada nível.

## Arquitetura técnica
- **Framework**: TanStack Start (já configurado no projeto).
- **Backend**: Lovable Cloud (Supabase) para autenticação, banco de dados e RLS.
- **Clientes Supabase**:
  - Browser client para componentes e hooks.
  - `requireSupabaseAuth` em `createServerFn` para operações autenticadas.
- **Roteamento**:
  - `/` landing page pública com CTA para entrar.
  - `/auth` página de login/cadastro pública.
  - `/_authenticated/dashboard` home autenticada com resumo do personagem.
  - `/_authenticated/tasks` lista e criação de tarefas.
  - `/_authenticated/character` detalhes do personagem e atributos.

## Estrutura de dados

### `profiles`
- `id` uuid PK (referencia `auth.users(id)`)
- `user_id` uuid unique (referencia `auth.users(id)`)
- `character_name` text
- `level` integer default 1
- `xp` integer default 0
- `coins` integer default 0
- `attribute_points` integer default 0
- `strength`, `intelligence`, `discipline`, `creativity`, `resilience` integer default 0
- `created_at`, `updated_at` timestamps

### `tasks`
- `id` uuid PK
- `user_id` uuid (referencia `auth.users(id)`)
- `title` text
- `description` text nullable
- `difficulty` enum: easy, medium, hard, epic
- `due_date` date nullable
- `completed` boolean default false
- `completed_at` timestamp nullable
- `xp_reward` integer
- `coin_reward` integer
- `created_at`, `updated_at` timestamps

## Fluxos principais

### Cadastro
1. Usuário preenche email, senha e nome do personagem em `/auth`.
2. `signUp()` cria conta no Lovable Cloud.
3. Trigger cria registro em `profiles` com o nome do personagem.
4. Após confirmação de email, usuário é redirecionado para `/_authenticated/dashboard`.

### Login
1. Usuário entra com email/senha em `/auth`.
2. Após autenticação, redirecionamento para `/_authenticated/dashboard`.

### Criar tarefa
1. Em `/_authenticated/tasks`, usuário clica em "Nova missão".
2. Preenche título, descrição, dificuldade e data.
3. Tarefa é salva com `xp_reward` e `coin_reward` calculados pela dificuldade.

### Completar tarefa
1. Usuário marca tarefa como concluída.
2. Server function adiciona XP e moedas ao perfil.
3. Se XP atingir o limite do nível, sobe de nível e ganha pontos de atributo.

### Evoluir atributos
1. Em `/_authenticated/character`, usuário gasta pontos de atributo para aumentar Força, Inteligência, Disciplina, Criatividade ou Resiliência.

## Etapas de implementação

1. **Preparação do backend**
   - Ativar Lovable Cloud.
   - Habilitar autenticação por email/senha.
   - Criar migration com tabelas `profiles` e `tasks`, RLS, grants, trigger de criação de perfil e função de recompensa por tarefa concluída.

2. **Autenticação e rotas protegidas**
   - Criar `/auth` com formulários de login e cadastro.
   - Configurar layout `_authenticated/route.tsx` e rotas protegidas.
   - Atualizar `__root.tsx` com listener de auth state.

3. **Landing page pública**
   - Substituir placeholder de `src/routes/index.tsx` por landing com CTA.

4. **Dashboard do personagem**
   - Criar `/_authenticated/dashboard` com resumo de nível, XP, moedas e tarefas do dia.

5. **Gestão de tarefas**
   - Criar `/_authenticated/tasks` com lista, criação e conclusão de tarefas.
   - Implementar server function de recompensa (XP/moedas/nível).

6. **Tela do personagem**
   - Criar `/_authenticated/character` com atributos e distribuição de pontos.

7. **Ajustes visuais**
   - Aplicar paleta de tons de fogo no `src/styles.css`.
   - Refinar componentes com estilo RPG minimalista.

## Decisões pendentes
- O usuário escolherá o estilo visual específico depois; o MVP usará a paleta de tons de fogo como base.
- Sons/efeitos de level up e animações podem ser adicionados em versões futuras.
- Loja de recompensas e missões pré-definidas ficam fora do MVP.
