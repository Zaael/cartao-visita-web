# 🪪 Web Business Card

> Um currículo diferente — inspirado nos clássicos cartõezinhos físicos de serviços, agora na versão web.

---

## 💡 Sobre o Projeto

O **Web Business Card** é um portfólio/currículo pessoal apresentado no formato de um cartão de visita digital. A ideia é resgatar a nostalgia dos cartõezinhos físicos de serviços que eram muito comuns antigamente — aqueles que você recebia de eletricistas, encanadores, dentistas — e trazer essa experiência para a web de forma criativa e memorável.

Em vez de um currículo tradicional e genérico, o projeto apresenta informações profissionais de forma compacta, direta e visualmente marcante, assim como um cartão de visita de verdade.

--- 

## ✨ Funcionalidades

- 📇 Layout inspirado em cartões de visita físicos
- 👤 Apresentação de informações pessoais e profissionais
- 🔗 Links para redes sociais e contato
- 📱 Design responsivo (mobile-first)
- ⚡ Performance otimizada com Gatsby

---

## 🛠️ Tecnologias

- [Gatsby](https://www.gatsbyjs.com/) — Framework React para geração de sites estáticos
- [React](https://react.dev/) — Biblioteca de UI
- [Docker](https://www.docker.com/) — Containerização do ambiente de desenvolvimento
- CSS / Styled Components *(adapte conforme o que estiver usando)*

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados

### Subindo o projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

# Suba o container
docker compose up
```

Acesse em: [http://localhost:8000](http://localhost:8000)

### Hot reload

O projeto está configurado para hot reload dentro do Docker. As seguintes variáveis de ambiente garantem que mudanças nos arquivos locais sejam refletidas automaticamente:

```yaml
environment:
  - CHOKIDAR_USEPOLLING=true
  - WATCHPACK_POLLING=true
```

---

## 📁 Estrutura do Projeto

```
.
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas do Gatsby
│   └── styles/         # Estilos globais
├── static/             # Arquivos estáticos (imagens, fontes)
├── docker-compose.yml
├── Dockerfile
├── gatsby-config.js
└── README.md
```

---

## 📄 Licença

Este projeto é de uso pessoal. Sinta-se à vontade para se inspirar. 🙂
