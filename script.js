// --- Elementos do HTML ---
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.searchBtn');
const movieContainer = document.getElementById('movieContainer');
const modal = document.getElementById('movieModal');
const favoritesBtn = document.getElementById('favoritesBtn');
const homeBtn = document.getElementById('homeBtn');

// --- Sua chave da API do TMDB ---
const API_KEY = 'dbbf332f69b91e7cd08695eb262ead92';

// --- Variáveis de controle ---
let currentPage = 1;
let currentQuery = '';
let isLoading = false;
let favorites = getFavoritesFromStorage();

// --- Funções de busca e renderização de cards (sem alterações) ---
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}
async function fetchAndDisplayMovies(page = 1, query = '') {
    if (isLoading) return;
    isLoading = true;
    const isSearching = query !== '';
    const today = getTodayDateString();
    const url = isSearching
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}&language=pt-BR`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=primary_release_date.desc&page=${page}&primary_release_date.lte=${today}&vote_count.gte=500`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro na API (código: ${response.status})`);
        const data = await response.json();
        renderMovieCards(data.results, page === 1);
        currentPage = page;
        currentQuery = query;
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        movieContainer.innerHTML = `<p style="color: #E50914; text-align: center;">${error.message}</p>`;
    } finally {
        isLoading = false;
    }
}
function renderMovieCards(movies, shouldClear) {
    if (!movies) return;
    if (shouldClear) movieContainer.innerHTML = '';
    movies.forEach(movie => {
        if (!movie.poster_path) return;
        const isFavorited = favorites.includes(movie.id);
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        const rating = movie.vote_average.toFixed(1);
        movieCard.innerHTML = `
            <div class="favorite-icon ${isFavorited ? 'active' : ''}" data-movie-id="${movie.id}">
                <i class="fa-solid fa-heart"></i>
            </div>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" data-movie-id="${movie.id}" class="movie-poster">
            <div class="rating">⭐ ${rating}</div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
            </div>
        `;
        movieContainer.appendChild(movieCard);
        movieCard.querySelector('.movie-poster').addEventListener('click', (e) => {
            openModal(e.currentTarget.dataset.movieId);
        });
        movieCard.querySelector('.favorite-icon').addEventListener('click', (e) => {
            toggleFavorite(parseInt(e.currentTarget.dataset.movieId), e.currentTarget);
        });
    });
}

// --- Funções de Favoritos (sem alterações) ---
function getFavoritesFromStorage() {
    const favsJSON = localStorage.getItem('movieFavorites');
    return favsJSON ? JSON.parse(favsJSON) : [];
}
function saveFavoritesToStorage() {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
}
function toggleFavorite(movieId, iconElement) {
    const movieIndex = favorites.indexOf(movieId);
    if (movieIndex > -1) {
        favorites.splice(movieIndex, 1);
        iconElement.classList.remove('active');
    } else {
        favorites.push(movieId);
        iconElement.classList.add('active');
    }
    saveFavoritesToStorage();
}
async function displayFavorites() {
    movieContainer.innerHTML = '<p style="color: #a0a0a0;">Carregando seus filmes favoritos...</p>';
    if (favorites.length === 0) {
        movieContainer.innerHTML = '<p style="color: #a0a0a0; text-align: center;">Você ainda não adicionou nenhum filme aos favoritos.</p>';
        return;
    }
    const favoriteMoviesData = [];
    for (const movieId of favorites) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`;
        try {
            const response = await fetch(url);
            const movieData = await response.json();
            favoriteMoviesData.push(movieData);
        } catch (error) {
            console.error(`Erro ao buscar o filme favorito com ID ${movieId}:`, error);
        }
    }
    renderMovieCards(favoriteMoviesData, true);
}

// --- **NOVA FUNÇÃO DO MODAL** ---
async function openModal(movieId) {
    // Busca todas as informações do filme em paralelo para mais performance
    const [details, credits, videos] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=pt-BR`).then(res => res.json()),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=pt-BR`).then(res => res.json())
    ]);

    // Lógica para formatar os dados
    const director = credits.crew.find(member => member.job === 'Director')?.name || 'N/A';
    const cast = credits.cast.slice(0, 10); // Pega os 10 primeiros do elenco
    const trailer = videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}min` : 'N/A';

    // Monta o HTML do novo modal
    modal.innerHTML = `
        <div class="modal-backdrop" style="background-image: url('https://image.tmdb.org/t/p/original${details.backdrop_path}')">
            <span class="close-btn">&times;</span>
            <div class="modal-content-wrapper">
                <header class="modal-header">
                    <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.title}" class="modal-poster">
                    <div class="modal-info">
                        <h1>${details.title}</h1>
                        <div class="modal-meta">
                            <span class="rating">⭐ ${details.vote_average.toFixed(1)}</span>
                            <span>${details.release_date.split('-')[0]}</span>
                            <span>${runtime}</span>
                        </div>
                        <div class="modal-genres">
                            ${details.genres.map(genre => `<span>${genre.name}</span>`).join('')}
                        </div>
                        <div class="modal-actions">
                            ${trailer ? `<a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank" class="btn btn-primary">Assistir Trailer</a>` : ''}
                        </div>
                    </div>
                </header>
                <section class="modal-body">
                    <div class="modal-left">
                        <h2>Sinopse</h2>
                        <p class="sinopse">${details.overview || 'Sinopse não disponível.'}</p>
                        <h2>Elenco Principal</h2>
                        <div class="cast-list">
                            ${cast.map(member => `
                                <div class="cast-member">
                                    <img src="${member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : 'https://via.placeholder.com/100x100?text=N/A'}" alt="${member.name}">
                                    <p>${member.name}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-right">
                        <h2>Informações</h2>
                        <ul class="info-list">
                            <li><strong>Diretor:</strong> <span>${director}</span></li>
                            <li><strong>Status:</strong> <span>${details.status}</span></li>
                            <li><strong>Idioma Original:</strong> <span>${details.original_language.toUpperCase()}</span></li>
                            <li><strong>Orçamento:</strong> <span>$${details.budget.toLocaleString()}</span></li>
                            <li><strong>Receita:</strong> <span>$${details.revenue.toLocaleString()}</span></li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    `;
    modal.style.display = 'block';

    // Adiciona o evento de fechar no novo botão
    modal.querySelector('.close-btn').addEventListener('click', closeModal);
}

function closeModal() {
    modal.style.display = 'none';
    modal.innerHTML = ''; // Limpa o conteúdo do modal ao fechar
}

// --- Eventos ---
window.addEventListener('DOMContentLoaded', () => fetchAndDisplayMovies());
window.addEventListener('click', (event) => {
    if (event.target == modal) closeModal();
});
favoritesBtn.addEventListener('click', displayFavorites);
homeBtn.addEventListener('click', () => { fetchAndDisplayMovies(1, ''); });
searchBtn.addEventListener('click', () => { fetchAndDisplayMovies(1, searchInput.value.trim()); });
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') fetchAndDisplayMovies(1, searchInput.value.trim());
});
window.addEventListener('scroll', () => {
    if (!isLoading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
        fetchAndDisplayMovies(currentPage + 1, currentQuery);
    }
});