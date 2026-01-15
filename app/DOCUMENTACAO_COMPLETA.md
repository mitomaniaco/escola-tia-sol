# Documentação Completa do Projeto - Escola Tia Sol

**Versão:** 1.0 (MVP Frontend)
**Data:** 14/01/2026

---

## 1. Visão Geral do Projeto

A **Plataforma Escola Tia Sol** é um sistema web de gestão escolar desenvolvido sob medida para as necessidades de uma escola de educação infantil recreativa. O objetivo principal é substituir processos manuais, planilhas e comunicações informais por uma interface centralizada, moderna e fácil de usar.

O projeto foca em agilidade para a rotina diária (diário de classe, avisos rápidos) e controle administrativo simplificado (financeiro, cadastros). Atualmente, o projeto encontra-se na fase de **MVP (Minimum Viable Product) de Frontend**, com todas as interfaces e fluxos visuais implementados e funcionais (mockados).

---

## 2. Stack Tecnológico

O projeto foi construído utilizando tecnologias modernas de desenvolvimento web, priorizando performance, manutenibilidade e experiência do usuário.

### Frontend

- **React (Vite)**: Framework principal para construção da interface. Utilizado o Vite como build tool pela sua velocidade extrema.
- **Javascript (ES6+)**: Linguagem de programação.
- **TailwindCSS**: Framework de estilização "utility-first", permitindo criação rápida de layouts responsivos e design system consistente (Cores: Laranja, Roxo, Verde e Azul).
- **React Router DOM**: Gerenciamento de rotas e navegação SPA (Single Page Application).
- **Lucide React**: Biblioteca de ícones leve e moderna.
- **Date-fns**: Biblioteca para manipulação de datas (leve e modular).

### Estrutura (Atual)

- **SPA (Single Page Application)**: O site não recarrega a cada clique; a navegação é fluida e instantânea.
- **Arquitetura Baseada em Componentes**: Interface modularizada (botões, inputs, cards, modais) para reutilização.

---

## 3. Estrutura do Projeto

A organização das pastas segue o padrão recomendado para aplicações React escaláveis:

```
app/
├── public/              # Arquivos estáticos (imagens, logo.png, favicon)
├── src/
│   ├── components/      # Componentes reutilizáveis (se houver abstrações futuras)
│   ├── contexts/        # Contextos globais (AuthContext para autenticação)
│   ├── lib/             # Utilitários e funções auxiliares (utils.js)
│   ├── pages/           # Páginas principais da aplicação (Views)
│   │   ├── ActivityForm.jsx       # Formulário de Atividade (Diário)
│   │   ├── Classes.jsx            # Listagem de Turmas
│   │   ├── ClassForm.jsx          # Cadastro de Turmas
│   │   ├── Dashboard.jsx          # Painel Principal
│   │   ├── Financial.jsx          # Painel Financeiro
│   │   ├── FinancialChargeForm.jsx # Nova Cobrança
│   │   ├── GuardianForm.jsx       # Cadastro de Responsáveis
│   │   ├── Guardians.jsx          # Listagem de Responsáveis
│   │   ├── Login.jsx              # Tela de Login
│   │   ├── NoticeForm.jsx         # Novo Aviso
│   │   ├── Notices.jsx            # Mural de Avisos
│   │   ├── Pedagogical.jsx        # Dashboard Pedagógico
│   │   ├── Staff.jsx              # Listagem de Funcionários
│   │   ├── StaffForm.jsx          # Cadastro de Funcionários
│   │   ├── StudentForm.jsx        # Cadastro de Alunos
│   │   └── Students.jsx           # Listagem de Alunos
│   ├── App.jsx          # Definição de Rotas e estrutura raiz
│   ├── Layout.jsx       # Estrutura base (Sidebar + Área de Conteúdo)
│   ├── main.jsx         # Ponto de entrada da aplicação
│   └── index.css        # Estilos globais e configuração do Tailwind
├── index.html           # HTML base
├── package.json         # Dependências e scripts do projeto
└── vite.config.js       # Configuração do Vite
```

---

## 4. Funcionalidades Detalhadas

### 4.1. Autenticação e Segurança

- **Login**: Tela de acesso com validação de campos.
- **Proteção de Rotas**: Usuários não logados são redirecionados automaticamente para o Login.
- **Contexto de Usuário**: Gerenciamento de estado global de sessão (simulado nesta fase).

### 4.2. Dashboard (Home)

- **Vvisão Geral**: Cards com métricas principais (Total de Alunos, Funcionários Ativos, Receita Mensal).
- **Acesso Rápido**: Botões de atalho para os módulos mais utilizados.
- **Feed de Atividades**: Lista cronológica de ações recentes no sistema.

### 4.3. Gestão de Alunos (Acadêmico)

- **Listagem**: Tabela com busca, filtros por nome/responsável e status (Ativo/Inativo).
- **Edição Rápida (Modal)**: Ao clicar em "Editar", um modal permite alterar dados principais (Nome, Idade, Status) sem sair da tela.
- **Cadastro Completo**: Formulário detalhado incluindo foto, contatos de emergência e dados de saúde.

### 4.4. Gestão de Turmas

- **Organização Visual**: Turmas agrupadas por nível (Berçário, Maternal, Jardim) e turno (Manhã, Tarde, Integral).
- **Indicadores de Capacidade**: Barras de progresso visuais mostrando ocupação das salas.
- **Detalhes**: Visualização rápida do professor responsável e total de alunos.

### 4.5. Gestão de Responsáveis (Guardians)

- **Vínculo Aluno-Responsável**: Módulo dedicado para gerenciar pais e responsáveis financeiros.
- **Edição em Modal**: Atualização ágil de contatos e grau de parentesco via pop-up.
- **Visualização Clara**: Lista mostra quais alunos estão vinculados a cada responsável.

### 4.6. Financeiro

- **Painel de Controle**: Abas separadas para "Receitas" e "Despesas".
- **Ações Inteligentes (Cobranças Pendentes)**:
  - **Botão Pix**: Simula cópia de código Pix.
  - **Botão QR Code**: Simula exibição de QR para pagamento.
  - **WhatsApp**: Gera link para envio da cobrança direto no Zap.
  - **Email**: Simula envio de fatura por email.
- **Lançamentos**: Formulário para criar novas cobranças (Mensalidades, Taxas, Material).

### 4.7. Pedagógico (Diário)

- **Diário de Classe**: Registro de atividades diárias (Alimentação, Soneca, Banheiro, Humor).
- **Interface Visual**: Uso de ícones e cores para facilitar a leitura rápida do dia da criança.

### 4.8. Comunicação (Avisos)

- **Mural Digital**: Listagem de comunicados enviados.
- **Envio Direcionado**: Possibilidade de enviar avisos para "Toda a Escola" ou "Turma Específica".
- **Prioridade**: Marcação visual para avisos "Urgentes".

---

## 5. Guia de Instalação e Execução

Para rodar o projeto localmente em sua máquina:

### Pré-requisitos

- **Node.js**: Versão 16 ou superior instalada.

### Passos

1. **Baixar o Projeto**: Copie os arquivos para uma pasta local.
2. **Abrir Terminal**: Navegue até a pasta raiz do projeto (`/app`).
3. **Instalar Dependências**:

   ```bash
   npm install
   ```

4. **Executar Servidor de Desenvolvimento**:

   ```bash
   npm run dev
   ```

5. **Acessar**: Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

---

## 6. Estado Atual e Técnicas Utilizadas

Atualmente, o projeto é um **MVP de Frontend**.

- **Dados Mockados**: As informações (listas de alunos, financeiro, etc.) são fixas no código (`MOCK_DATA`). Elas resetam se a página for recarregada.
- **Interatividade**: Toda a lógica de interface (abrir modais, validar formulários, navegação, filtros de busca) está funcionando perfeitamente.
- **Design Responsivo**: O layout se adapta a telas de desktop e tablets (com menu lateral recolhível em mobile, implementado via classes responsivas do Tailwind).

## 7. Próximos Passos (Roteiro de Desenvolvimento)

Para transformar este MVP em um produto final de produção, os passos seguintes são:

1. **Integração Backend (Supabase/Firebase)**:
   - Criar banco de dados real.
   - Substituir os `MOCK_DATA` por chamadas de API (Hooks `useEffect` + `fetch`).

2. **Sistema Financeiro Real**:
   - Integrar com gateway de pagamento (Asaas, Juno, Iugu) para gerar Boletos e Pix de verdade.

3. **Persistência de Sessão**:
   - Implementar autenticação real (JWT/Auth0) para segurança dos dados.

4. **Deploy**:
   - Hospedar o frontend na Vercel ou Netlify.

---

**Desenvolvido por**: Antigravity (Google Deepmind AI Agent)
**Para**: Escola Tia Sol
