# Absolute Enable Right Click & Copy

Userscript para **Violentmonkey/Tampermonkey** que ativa clique direito e cópia em qualquer site, removendo todas as proteções de cópia, seleção e menu de contexto.

Baseado na extensão Firefox [Absolute Enable Right Click](https://addons.mozilla.org/pt-BR/firefox/addon/absolute-enable-right-click/).

## Instalação

[![GreasyFork](https://img.shields.io/badge/GreasyFork-Instalar-FF6700?style=for-the-badge&logo=greasyfork&logoColor=white)](https://greasyfork.org/pt-BR/scripts/588000-absolute-enable-right-click-copy)

1. Instale o [Violentmonkey](https://violentmonkey.github.io/) ou [Tampermonkey](https://www.tampermonkey.net/) no seu navegador
2. Clique no botão "Instalar" acima ou acesse a página do script no [GreasyFork](https://greasyfork.org/pt-BR/scripts/588000-absolute-enable-right-click-copy)
3. Confirme a instalação

Ou importe diretamente via URL raw:
```
https://raw.githubusercontent.com/LucianoSkx/absolute-enable-right-click-violentmonkey/main/absolute-enable-right-click.user.js
```

## Funcionalidades

- Ativa clique direito em qualquer site
- Remove proteções de cópia de texto (`user-select: none`)
- Remove sobreposições e mensagens de bloqueio de cópia
- Remove restrições de arrastar e soltar
- Remove classes CSS anti-cópia (`noselect`, `no-select`, `unselectable`, etc.)
- Funciona com conteúdo dinâmico (SPA, AJAX)
- Suporta todos os sites (`*://*/*`)
- **Ativa/desativa pelo painel do ViolentMonkey** — use os comandos do menu do script
- **Atalho de teclado** — `Ctrl+Shift+R` para alternar rapidamente

## Como ativar/desativar

O script pode ser ativado e desativado de três formas:

### 1. Pelo painel do ViolentMonkey (recomendado)

Clique no ícone do ViolentMonkey na barra de extensões → encontre o script → clique nos **três pontos** → escolha:
- **✅ Ativar script** — ativa todas as proteções
- **❌ Desativar script** — remove todas as proteções e limpa o DOM
- **🔄 Alternar ativação** — inverte o estado atual

### 2. Atalho de teclado

Pressione `Ctrl+Shift+R` em qualquer página para alternar o script ligado/desligado. Uma notificação aparecerá confirmando a ação.

### 3. Estado persistente

O estado (ativado/desativado) é salvo automaticamente e persiste entre recarregamentos de página e navegações.

## Como funciona

O script usa três técnicas principais:

1. **Interceptação de eventos** — bloqueia `contextmenu`, `copy`, `cut`, `selectstart` e `dragstart`
2. **Injeção de CSS** — sobrescreve propriedades `user-select` e `cursor` com `!important`
3. **MutationObserver** — monitora mudanças no DOM para aplicar correções em conteúdo dinâmico.

## Licença

MIT

## Créditos

- [Absolute Enable Right Click](https://addons.mozilla.org/pt-BR/firefox/addon/absolute-enable-right-click/) — extensão original
- [Luciano.Oliveirals](https://greasyfork.org/pt-BR/users/1301195-luciano-inf) — autor do userscript
