# Documentação Completa do Projeto - Escola Tia Sol

**Versão:** 2.0 (Produção Beta)
**Data:** 14/01/2026

---

## 1. Visão Geral do Projeto

A **Plataforma Escola Tia Sol** é um sistema web de gestão escolar desenvolvido sob medida para as necessidades de uma escola de educação infantil recreativa. O objetivo principal é substituir processos manuais por uma interface centralizada e moderna.

O projeto evoluiu de um MVP de Frontend para uma aplicação **Fullstack integrada ao Supabase**, com banco de dados real, autenticação e gestão financeira completa.

---

## 2. Stack Tecnológico

O projeto foi construído utilizando tecnologias modernas, priorizando performance e escalabilidade.

### Frontend
- **React (Vite)**: Framework principal.
- **TailwindCSS**: Estilização responsiva e Design System.
- **Lucide React**: Biblioteca de ícones.
- **React Router DOM**: Navegação SPA.

### Backend & Dados (Novo)
- **Supabase**: Backend-as-a-Service (BaaS).
  - **PostgreSQL**: Banco de dados relacional robusto.
  - **Auth**: Gerenciamento de sessões de usuário.
  - **RLS (Row Level Security)**: Políticas de segurança de dados.

---

## 3. Arquitetura de Dados (Database Schema)

O sistema opera com um banco de dados relacional normalizado. As principais tabelas são:

1.  **students**: Cadastro de alunos (nome, nascimento, foto, status).
2.  **guardians**: Cadastro de responsáveis (pais/financeiro).
3.  **student_guardians**: Tabela pivô para relacionar N alunos a N responsáveis.
4.  **classes**: Turmas e turnos (capacidade, período).
5.  **financial_records**: "Livro caixa" unificado.
    *   Gerencia **Receitas** (mensalidades) e **Despesas** (custos).
    *   Status: Pendente, Pago, Atrasado, Cancelado.
6.  **daily_logs**: Diário de classe digital (alimentação, sono, humor).
7.  **notices**: Mural de avisos (gerais ou por turma).
8.  **staff**: Gestão de funcionários e cargos.

---

## 4. Funcionalidades Detalhadas

### 4.1. Dashboard Inteligente
- Métricas em tempo real: Alunos Ativos, Receita Mensal, Inadimplência.
- Widgets de Aniversariantes do Mês.
- Acesso rápido aos módulos principais.

### 4.2. Gestão Financeira (Atualizado)
- **Controle Unificado**: Abas para Receitas e Despesas na mesma tela.
- **Cobranças**: Geração de registros financeiros vinculados a alunos/responsáveis.
- **Botões de Ação**: Baixa manual (marcar como pago), cancelamento e envio rápido via WhatsApp.

### 4.3. Diário de Classe (Mobile First)
- Interface otimizada para uso em celulares por professores.
- Registro rápido de atividades (Almoço, Soneca, etc).
- Linha do tempo visual do dia a dia da criança.

### 4.4. Comunicação
- **Mural de Avisos**: Envio de comunicados para toda a escola ou turmas específicas.
- Destaque visual para avisos urgentes.

### 4.5. Administrativo
- Cadastro completo de Alunos, Turmas e Funcionários.
- Gestão de vínculos familiares complexos (ex: um responsável para múltiplos alunos).

---

## 5. Guia de Configuração (Deploy)

Para rodar o projeto em um novo ambiente:

1.  **Configurar Supabase**:
    - Crie um projeto no [Supabase](https://supabase.com).
    - Execute o script SQL fornecido em `supabase_schema.sql` no Editor SQL do painel.
    - Isso criará todas as tabelas e políticas de segurança necessárias.

2.  **Variáveis de Ambiente**:
    - Crie um arquivo `.env` na raiz do projeto com:
      ```
      VITE_SUPABASE_URL=sua_url_aqui
      VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
      ```

3.  **Instalação e Execução**:
    ```bash
    npm install
    npm run dev
    ```

---

## 6. Próximos Passos (Roadmap Futuro)

1.  **Integração de Pagamentos Real**: Conectar API do Asaas/Stripe para baixa automática de boletos.
2.  **App dos Pais**: Criar uma área restrita para os pais visualizarem o diário (hoje é visão administrativa).
3.  **Relatórios PDF**: Gerar boletins e demonstrativos financeiros para impressão.

---

**Desenvolvido por**: Antigravity (Google Deepmind AI Agent)
**Para**: Escola Tia Sol
