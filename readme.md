# MyWorld - Explorador de Filmes

Bem-vindo ao MyWorld, uma aplicação web elegante e interativa para descobrir, pesquisar e salvar os seus filmes favoritos. Utilizando a API do The Movie Database (TMDB), o MyWorld oferece uma experiência de utilizador fluida e moderna para todos os entusiastas de cinema.

## 🎬 Demonstração

![Demonstração do MyWorld](https://i.imgur.com/your-demo-image.gif)
*Substitua o link acima por um GIF ou imagem de demonstração do seu projeto.*

---

## ✨ Funcionalidades

O MyWorld vem com um conjunto completo de funcionalidades para explorar o universo do cinema:

-   **Descoberta de Filmes:** Ao carregar, a página principal exibe os filmes mais recentes e populares, mantendo-o atualizado com os grandes lançamentos.
-   **Pesquisa Inteligente:** Encontre qualquer filme que desejar com uma barra de pesquisa rápida e eficiente.
-   **Detalhes Completos:** Clique em qualquer filme para abrir um modal detalhado com informações como:
    -   Sinopse completa.
    -   Elenco principal com fotos.
    -   Diretor.
    -   Géneros, duração, orçamento e receita.
    -   Link direto para assistir ao trailer no YouTube.
-   **Lista de Favoritos:** Marque os seus filmes preferidos com um clique no ícone de coração. Eles são salvos localmente no seu navegador para que possa aceder à sua lista a qualquer momento.
-   **Scroll Infinito:** Role a página para baixo para carregar mais filmes automaticamente, sem interrupções.
-   **Design Responsivo:** A interface adapta-se perfeitamente a diferentes tamanhos de ecrã, desde desktops a telemóveis.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias e ferramentas:

-   **HTML5:** Para a estrutura semântica da aplicação.
-   **CSS3:** Para a estilização, utilizando variáveis CSS para um tema consistente e animações para uma experiência mais dinâmica.
-   **JavaScript (ES6+):** Para toda a lógica da aplicação, incluindo:
    -   Consumo de API com `fetch` e `async/await`.
    -   Manipulação do DOM para renderizar filmes e o modal.
    -   Gestão de eventos.
    -   Uso do `localStorage` para persistir os filmes favoritos.
-   **The Movie Database (TMDB) API:** Fonte de todos os dados sobre os filmes.
-   **Font Awesome:** Para os ícones, como o de favoritos (coração).
-   **Google Fonts:** Para as fontes 'Poppins' e 'Montserrat', que conferem um visual moderno à aplicação.

---

## 🚀 Como Executar o Projeto

Para executar o MyWorld na sua máquina local, siga estes passos simples:

### Pré-requisitos

-   Um navegador de internet moderno (ex: Google Chrome, Firefox).
-   Uma chave de API do [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api). O registo é gratuito.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/gabriel0090/trabalho-consumo-de-api.git](https://github.com/gabriel0090/trabalho-consumo-de-api.git)
    ```
    Ou simplesmente descarregue os arquivos `index.html`, `style.css` e `script.js`.

2.  **Adicione a sua chave de API:**
    -   Abra o arquivo `script.js`.
    -   Encontre a linha:
        ```javascript
        const API_KEY = 'dbbf332f69b91e7cd08695eb262ead92'; // Substitua pela sua chave
        ```
    -   Substitua o valor existente pela sua chave de API pessoal do TMDB.

3.  **Abra no navegador:**
    -   Navegue até à pasta onde guardou os arquivos.
    -   Abra o arquivo `index.html` diretamente no seu navegador. Pode fazer isso clicando com o botão direito no arquivo dentro do VS Code e selecionando "Open with Live Server" (se tiver a extensão) ou "Copy Path" e colando no seu navegador.

E pronto! A aplicação estará a funcionar localmente.