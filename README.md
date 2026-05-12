# 💓 PulseApp

PulseApp é um aplicativo mobile fullstack para **gerenciamento de lembretes pessoais**.  
Ele oferece uma experiência fluida com criação, edição, ativação/desativação e exclusão de lembretes, com filtros avançados por data, tags e repetição, além de alternância de temas claro e escuro.


## ⚙️ Tecnologias Utilizadas

### 💠 **Frontend (Aplicativo Mobile)**
- **React Native**: responsável pela interface, telas, navegação e experiência mobile.
- **TypeScript**: tipagem estática para maior segurança e previsibilidade.
- **React Hooks & Context API**: controle de estado global para autenticação e tema.
- **Componentização de UI**: modais, formulários, cards, botões e header totalmente reutilizáveis.
- **AsyncStorage**: persistência de token JWT no dispositivo.

### 💠 **Backend e Serviços**
- **ReminderApi (Node.js + Express)**

  API própria consumida pelo app para CRUD de lembretes, autenticação e ativação/desativação.
    - Endpoints principais:
    - `POST /auth/login` – login do usuário.
    - `GET /reminders` – lista lembretes.
    - `POST /reminders` – cria lembrete.
    - `PUT /reminders/:id` – atualiza lembrete.
    - `PATCH /reminders/:id/active` – ativa/desativa lembrete.
    - `DELETE /reminders/:id` – exclui lembrete.
- **Banco de Dados**
  - Supabase - usado para armazenar usuários e lembretes.

### 💠 **Comunicação e Manipulação de Dados**
- **Fetch / API Requests**  
  Utilizados para:  
  - consumir ReminderApi  
  - enviar e receber dados de lembretes  
  - autenticar usuários via token JWT
 
🔹 Confira no repositório: **[ReminderApi](https://github.com/jaquelinereiss/ReminderApi)**

## 💡 Funcionalidades Atuais

- 📝 **CRUD completo de lembretes**  
  Título, descrição, data, horário, repetição (diária, não repetir ou intervalo em horas) e tags.

- 🔎 **Filtros avançados e busca**  
  Por título, tag, estado (ativado/desativado), data e tipo de repetição.

- 🌗 **Tema claro e escuro**  
  Alternável via botão no header.

- 🛠 **Modais de criação e edição**  
  Formulários reutilizáveis para criar ou atualizar lembretes.

- 📅 **Data e hora com DateTimePicker**  
  Seleção intuitiva de data e horário para lembretes.

- 🏷 **Tags dinâmicas**  
  Adicionar, remover e filtrar lembretes por tags.


## 🧩 Arquitetura e Componentização

A arquitetura do PulseApp é modular e escalável:

- **Componentes reutilizáveis:** Header, Cards, Modais e Formulários.
- **Contextos globais:** ThemeContext e AuthContext.
- **Serviços separados:** reminderApi para requisições ao backend.
- **Navegação organizada** com React Navigation.
- **Código limpo e fácil de manter**, seguindo boas práticas de React Native e TypeScript.


## 🚀 Melhorias Futuras

- Notificações push para lembretes.
- Perfil de usuário e gerenciamento de conta.


## 👩‍💻 Autora

Desenvolvido por **[Jaqueline Reis](https://github.com/jaquelinereiss)** – desenvolvedora fullstack responsável pela concepção do produto, desenvolvimento do app mobile em React Native, construção da ReminderApi em Node.js/Express, integração com banco de dados, autenticação via JWT, definição da arquitetura e aplicação de boas práticas de código.
