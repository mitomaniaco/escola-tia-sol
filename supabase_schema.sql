-- Arquivo de Definição de Esquema - Escola Tia Sol (Supabase/PostgreSQL)
-- Gerado por: Antigravity (Database Architect Agent)
-- Data: 2026-01-14

-- Habilita extensão para UUIDs se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABELAS ESTRUTURAIS (Turmas e Staff)
-- ==========================================

-- Tabela de Turmas
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- Ex: "Berçário I", "Maternal II"
    shift TEXT NOT NULL CHECK (shift IN ('morning', 'afternoon', 'full_time')), -- Turno
    capacity INTEGER NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Funcionários (Staff)
-- Nota: O login real será via Supabase Auth (tabela auth.users).
-- Esta tabela guarda dados complementares do perfil.
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Vínculo com usuário do Supabase Auth (opcional se ainda não tiver login)
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'assistant', 'financial')),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 2. NÚCLEO ACADÊMICO (Alunos e Responsáveis)
-- ==========================================

-- Tabela de Alunos
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    class_id UUID REFERENCES classes(id), -- Turma atual
    enrollment_status TEXT NOT NULL DEFAULT 'active' CHECK (enrollment_status IN ('active', 'inactive', 'pending')),
    photo_url TEXT, -- URL da foto no Storage
    health_info TEXT, -- Alergias, observações médicas
    emergency_contact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Responsáveis (Guardians)
CREATE TABLE guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT, -- Pode ser NULL se não tiver email, mas idealmente deve ter
    phone TEXT NOT NULL,
    cpf TEXT, -- Importante para emissão de boletos/NF
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela Pivô: Relacionamento Aluno <-> Responsável (N:N)
CREATE TABLE student_guardians (
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    guardian_id UUID REFERENCES guardians(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL, -- "father", "mother", "grandparent", "uncle", "other"
    is_financial_responsible BOOLEAN DEFAULT false, -- Define quem recebe a cobrança
    PRIMARY KEY (student_id, guardian_id)
);

-- ==========================================
-- 3. MÓDULO PEDAGÓGICO (Diário)
-- ==========================================

-- Tabela de Atividades Diárias (Diário de Classe)
CREATE TABLE daily_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES staff(id), -- Quem registrou (Professor)
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT NOT NULL CHECK (category IN ('food', 'sleep', 'diaper', 'mood', 'health', 'note')),

    -- Campos flexíveis para detalhes (JSONB seria opção, mas colunas explícitas são mais simples p/ queries iniciais)
    status TEXT, -- Ex: "aceitou_tudo", "recusou", "dormiu_bem"
    description TEXT, -- Observações livres
    timestamp TIMESTAMPTZ DEFAULT now(), -- Hora exata do evento

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Avisos (Notices)
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('all', 'class', 'individual')),
    target_id UUID, -- Se for para turma específica ou aluno específico (NULL se for 'all')
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    author_id UUID REFERENCES staff(id),
    expires_at TIMESTAMPTZ, -- Data para o aviso sair do mural
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 4. MÓDULO FINANCEIRO
-- ==========================================

-- Tabela de Cobranças (Charges)
CREATE TABLE financial_charges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    guardian_id UUID REFERENCES guardians(id), -- Quem vai pagar
    title TEXT NOT NULL, -- Ex: "Mensalidade Janeiro/2026"
    amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_method TEXT, -- "pix", "boleto", "cash" (preenchido ao pagar)
    paid_at TIMESTAMPTZ,

    -- Campos para integração futura (Asaas/Iugu/Stripe)
    external_transaction_id TEXT,
    boleto_url TEXT,
    pix_code TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Despesas (Expenses - Contas a Pagar da Escola)
CREATE TABLE financial_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL, -- Ex: "Conta de Luz", "Salário Professores"
    amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    category TEXT, -- "utility", "payroll", "maintenance", "supplies"
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- 5. POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- ==========================================
-- Nota: Habilitar RLS é essencial para produção.
-- Por enquanto, deixarei comentado para facilitar testes iniciais,
-- mas a estrutura já prevê isso.

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Exemplo de política (leitura pública para autenticados - refinar depois):
-- CREATE POLICY "Allow read access for authenticated users" ON students FOR SELECT TO authenticated USING (true);
