# IdeaAtlas
## What is it ?
IdeaAtlas is Brain storming visualisation web tool for creating knowledge graphs
## About Project
- School project for my final 2 semesters at Gymnasium Arabska
- school year 2024/25
- Vue

# Linux Setup

clone this repo

```bash
git clone https://github.com/gyarab/2024-4e-prochazka-IdeaAtlas.git
```

install bun

```bash
curl -fsSL https://bun.sh/install | bash
```
go to the project directory
```bash
cd 2024-4e-prochazka-IdeaAtlas
```
```bash
cd idea-atlas
```

install dependencies:

```bash
bun install
```
# Setup for windows

clone this repo

```bash
git clone https://github.com/gyarab/2024-4e-prochazka-IdeaAtlas.git
```

install bun (on windows)

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

go to the project directory
```bash
cd 2024-4e-prochazka-IdeaAtlas
```
```bash
cd idea-atlas
```

install dependencies:

```bash
bun install
```

# Development Server

Start the development server on `http://localhost:3000`:

```bash
# bun
bun run dev
```

# Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.



# Project structure guide


## bun.lockb

is a lock file created by the Bun JavaScript runtime to capture the exact versions of all dependencies installed in a project.
