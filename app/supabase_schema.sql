-- ESQUEMA DE BANCO DE DADOS - ESCOLA TIA SOL
-- Skill: Database Design
-- Autor: Antigravity Agent

-- 1. Tabela de Turmas (Classes)
create table if not exists classes (
  id uuid default gen_random_uuid() primary key,
  name text not null, -- Ex: "Berçário I", "Maternal II"
  shift text not null check (shift in ('morning', 'afternoon', 'full_time')),
  capacity int not null default 15,
  created_at timestamptz default now()
);

-- 2. Tabela de Alunos (Students)
create table if not exists students (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  birth_date date not null,
  photo_url text,
  enrollment_status text default 'active' check (enrollment_status in ('active', 'inactive', 'pending')),
  class_id uuid references classes(id), -- Vínculo com turma
  medical_info text, -- Alergias, remédios
  created_at timestamptz default now()
);

-- 3. Tabela de Responsáveis (Guardians)
create table if not exists guardians (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  cpf text,
  address text,
  created_at timestamptz default now()
);

-- 4. Tabela Pivô Aluno-Responsável (Student_Guardians)
create table if not exists student_guardians (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id) on delete cascade,
  guardian_id uuid references guardians(id) on delete cascade,
  relationship_type text not null, -- Ex: 'mother', 'father', 'financial_responsible'
  is_emergency_contact boolean default false,
  created_at timestamptz default now()
);

-- 5. Tabela Financeira (Financial Charges/Transactions)
-- Unifica Receitas (Cobranças) e Despesas
create table if not exists financial_records (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  amount numeric(10,2) not null,
  type text not null check (type in ('income', 'expense')), -- Receita ou Despesa
  category text, -- Ex: 'tuition' (mensalidade), 'salary', 'maintenance'
  status text default 'pending' check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  due_date date not null,
  paid_at timestamptz,
  student_id uuid references students(id), -- Opcional: Se for cobrança de aluno
  guardian_id uuid references guardians(id), -- Opcional: Quem paga
  created_at timestamptz default now()
);

-- 6. Tabela Pedagógica / Diário (Daily Logs)
-- Substitui o MOCK_DATA do Pedagogical.jsx
create table if not exists daily_logs (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id) on delete cascade,
  date date default CURRENT_DATE,
  type text not null check (type in ('lunch', 'snack', 'nap', 'mood', 'hygiene', 'health')),
  status text not null, -- Ex: 'good' (comeu tudo), 'bad' (não comeu), 'normal'
  description text, -- Detalhes: "Dormiu 40min", "Chorou ao chegar"
  created_at timestamptz default now()
);

-- 7. Tabela de Avisos (Notices)
create table if not exists notices (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  target_audience text default 'all', -- 'all', 'class_id', 'guardians'
  target_class_id uuid references classes(id), -- Se for para turma específica
  priority text default 'normal' check (priority in ('normal', 'high', 'urgent')),
  expires_at date,
  created_at timestamptz default now()
);

-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- Habilitando RLS (por enquanto permitindo tudo para facilitar MVP, mas pronto para fechar)
alter table classes enable row level security;
alter table students enable row level security;
alter table guardians enable row level security;
alter table financial_records enable row level security;
alter table daily_logs enable row level security;
alter table notices enable row level security;

-- Policies "Public" (para MVP - Cuidado em produção!)
create policy "Allow public access" on classes for all using (true);
create policy "Allow public access" on students for all using (true);
create policy "Allow public access" on guardians for all using (true);
create policy "Allow public access" on student_guardians for all using (true);
create policy "Allow public access" on financial_records for all using (true);
create policy "Allow public access" on daily_logs for all using (true);
create policy "Allow public access" on notices for all using (true);

-- 8. Tabela de Funcionários (Staff)
create table if not exists staff (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null, -- Ex: 'Professor', 'Diretora', 'Cozinheira'
  phone text,
  email text,
  cpf text,
  birth_date date,
  status text default 'active' check (status in ('active', 'inactive', 'vacation')),
  created_at timestamptz default now()
);

-- Policy para Staff
alter table staff enable row level security;
create policy "Allow public access" on staff for all using (true);
