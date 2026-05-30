# Fenix LinkedIn Content Engine

Ferramenta estratégica para criação de conteúdo de alta performance no LinkedIn, desenvolvida para a **FG Soluções Comerciais | Fenix Global** — representação comercial da Geradores Capanema.

## Sobre a Ferramenta

O Fenix LinkedIn Content Engine permite criar posts estratégicos para o LinkedIn com foco em:

- **Geração de autoridade** no setor de grupos geradores de energia
- **Prospecção comercial** indireta via conteúdo relevante
- **Atração de parceiros** e representantes comerciais
- **Desenvolvimento de negócios** em múltiplos segmentos industriais e agroindustriais

---

## Pré-requisitos

- Node.js 18+ instalado
- npm 9+ (ou yarn/pnpm)

---

## Instalação e Execução

```bash
# 1. Acesse o diretório do projeto
cd fenix-linkedin-engine

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
# http://localhost:5173
```

### Build para produção

```bash
npm run build
npm run preview
```

---

## Como Usar

### 1. Gerar Conteúdo
1. Acesse **"Gerar Conteúdo"** no menu lateral
2. Preencha o **Tema Principal** (obrigatório)
3. Selecione o **Segmento de Mercado** e o **Tipo de Conteúdo**
4. Escolha o **Tom de Voz** adequado ao objetivo
5. Opcionalmente, adicione CTA, fonte de referência e observações
6. Clique em **"Gerar Conteúdo com IA"**
7. Edite o texto gerado se necessário
8. Copie ou salve na biblioteca

### 2. Biblioteca de Posts
- Acesse **"Biblioteca"** para ver todos os posts salvos
- Filtre por **status** (rascunho, aprovado, publicado), **segmento** ou pesquise por texto
- Altere o status diretamente no card do post
- Edite, copie ou exclua posts

### 3. Calendário Editorial
- Acesse **"Calendário Editorial"** para ver a sugestão semanal de temas
- Cada dia tem uma estratégia específica:
  - **Segunda:** Autoridade técnica
  - **Terça:** Oportunidade de mercado
  - **Quarta:** Conteúdo educativo
  - **Quinta:** Parceria comercial
  - **Sexta:** Storytelling ou post institucional
- Clique em **"Criar post de [dia]"** para ir direto ao gerador com configurações pré-definidas

---

## Tipos de Conteúdo Disponíveis

| Tipo | Objetivo |
|------|----------|
| Post de Autoridade | Posicionamento como referência técnica |
| Post Comercial | Apresentação direta da solução |
| Post Educativo | Conteúdo de valor para o público |
| Storytelling | Conexão emocional e humanização da marca |
| Oportunidade de Mercado | Despertar interesse e senso de urgência |
| Prospecção Indireta | Atrair leads sem abordagem direta |
| Atração de Parceiros | Recrutar representantes e parceiros |
| Post Institucional | Fortalecer a marca da FG Soluções |
| Roteiro de Vídeo Curto | Script para Reels e vídeos no LinkedIn |
| Carrossel para LinkedIn | Estrutura completa de carrossel |

---

## Segmentos Atendidos

- Avicultura e integração avícola
- Agronegócio em geral
- Frigoríficos
- Cooperativas agropecuárias
- Construção civil
- Condomínios residenciais e comerciais
- Saúde (hospitais e clínicas)
- Data centers
- Indústria
- Saneamento
- Locadoras de equipamentos
- Suprimentos e compras
- Parceiros e representantes comerciais

---

## Integração com API de IA (Próximos Passos)

O projeto está estruturado para integrar com qualquer API de IA. Para substituir a geração local por IA real:

### Com a API da Anthropic (Claude)

```typescript
// src/utils/contentGeneratorAI.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY })

export async function generateContentWithAI(data: ContentFormData): Promise<GeneratedContent> {
  const prompt = buildPrompt(data) // use o contexto existente do contentGenerator.ts

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  return parseAIResponse(message.content[0])
}
```

### Com a API da OpenAI

```typescript
// src/utils/contentGeneratorAI.ts
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: buildPrompt(data) }],
  }),
})
```

### Configuração do ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_ANTHROPIC_API_KEY=sua_chave_aqui
# ou
VITE_OPENAI_API_KEY=sua_chave_aqui
```

**Importante:** Para aplicações em produção, as chamadas à API de IA devem ser feitas via backend para proteger as chaves de API.

---

## Estrutura do Projeto

```
fenix-linkedin-engine/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Layout principal com sidebar
│   ├── pages/
│   │   ├── Home.tsx            # Página inicial
│   │   ├── ContentGenerator.tsx # Gerador de conteúdo
│   │   ├── Library.tsx         # Biblioteca de posts
│   │   └── Calendar.tsx        # Calendário editorial
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   ├── utils/
│   │   ├── contentGenerator.ts # Engine de geração de conteúdo
│   │   └── storage.ts          # CRUD LocalStorage
│   ├── App.tsx                 # Roteamento
│   ├── main.tsx                # Entry point
│   └── index.css               # Estilos Tailwind
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## Stack Tecnológica

- **React 18** — Interface de usuário
- **TypeScript** — Tipagem estática
- **Tailwind CSS** — Estilização utilitária
- **Vite** — Build tool e dev server
- **React Router DOM** — Navegação SPA
- **Lucide React** — Ícones
- **date-fns** — Formatação de datas
- **LocalStorage** — Persistência de dados (primeira versão)

---

## Empresa

**FG Soluções Comerciais | Fenix Global**  
Representação comercial, desenvolvimento de negócios e expansão de vendas no mercado de grupos geradores diesel.

**Representação:** Geradores Capanema — Fabricante brasileira de grupos geradores de energia.
