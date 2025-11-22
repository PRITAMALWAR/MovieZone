
// Global variables
let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
let moviesPerPage = 9;
let currentSort = 'default';
let currentFilter = {};

// ===================================
// Favorites Functions
// ===================================

// Get favorites from localStorage
function getFavorites() {
    const favorites = localStorage.getItem('favoriteMovies');
    return favorites ? JSON.parse(favorites) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
}

// Add movie to favorites
function addToFavorites(movieId) {
    const favorites = getFavorites();
    if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        saveFavorites(favorites);
        updateFavoriteButtons();
        return true;
    }
    return false;
}

// Remove movie from favorites
function removeFromFavorites(movieId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(movieId);
    if (index > -1) {
        favorites.splice(index, 1);
        saveFavorites(favorites);
        updateFavoriteButtons();
        return true;
    }
    return false;
}

// Check if movie is favorite
function isFavorite(movieId) {
    const favorites = getFavorites();
    return favorites.includes(movieId);
}

// Toggle favorite status
function toggleFavorite(movieId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (isFavorite(movieId)) {
        removeFromFavorites(movieId);
    } else {
        addToFavorites(movieId);
    }
}

// Update favorite buttons on all movie cards
function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const movieId = parseInt(btn.dataset.movieId);
        if (isFavorite(movieId)) {
            btn.classList.add('active');
            btn.textContent = '♥';
        } else {
            btn.classList.remove('active');
            btn.textContent = '♡';
        }
    });
}

// ===================================
// Function to load movies from JSON file
// ===================================
async function loadMovies() {
    try {
        const response = await fetch('movies.json');
        if (!response.ok) {
            throw new Error('Failed to load movies');
        }
        allMovies = await response.json();
        return allMovies;
    } catch (error) {
        console.error('Error loading movies:', error);
        return [];
    }
}

// ===================================
// Function to populate category dropdown
// ===================================
function populateCategories() {
    const categories = [...new Set(allMovies.map(movie => movie.category))].sort();
    const categorySelects = document.querySelectorAll('#categorySelect, #filterCategory');
    
    categorySelects.forEach(select => {
        if (select) {
            // Clear existing options except "All"
            const allOption = select.querySelector('option[value="all"]');
            select.innerHTML = '';
            if (allOption) {
                select.appendChild(allOption);
            }
            
            // Add category options
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        }
    });
}

// ===================================
// Function to sort movies
// ===================================
function sortMovies(movies, sortType) {
    const sortedMovies = [...movies];
    
    switch(sortType) {
        case 'rating-desc':
            return sortedMovies.sort((a, b) => b.rating - a.rating);
        case 'rating-asc':
            return sortedMovies.sort((a, b) => a.rating - b.rating);
        case 'year-desc':
            return sortedMovies.sort((a, b) => b.year - a.year);
        case 'year-asc':
            return sortedMovies.sort((a, b) => a.year - b.year);
        case 'title-asc':
            return sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc':
            return sortedMovies.sort((a, b) => b.title.localeCompare(a.title));
        default:
            return sortedMovies;
    }
}

// ===================================
// Function to filter movies
// ===================================
function filterMovies(movies, filters) {
    let filtered = [...movies];
    
    // Search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase().trim();
        filtered = filtered.filter(movie => {
            const titleMatch = movie.title.toLowerCase().includes(searchTerm);
            const descMatch = movie.description.toLowerCase().includes(searchTerm);
            const categoryMatch = movie.category.toLowerCase().includes(searchTerm);
            const directorMatch = movie.director.toLowerCase().includes(searchTerm);
            const actorsMatch = movie.actors.some(actor => 
                actor.toLowerCase().includes(searchTerm)
            );
            return titleMatch || descMatch || categoryMatch || directorMatch || actorsMatch;
        });
    }
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(movie => movie.category === filters.category);
    }
    
    // Year range filter
    if (filters.yearFrom) {
        filtered = filtered.filter(movie => movie.year >= parseInt(filters.yearFrom));
    }
    if (filters.yearTo) {
        filtered = filtered.filter(movie => movie.year <= parseInt(filters.yearTo));
    }
    
    // Rating range filter
    if (filters.ratingFrom !== undefined && filters.ratingFrom !== '') {
        filtered = filtered.filter(movie => movie.rating >= parseFloat(filters.ratingFrom));
    }
    if (filters.ratingTo !== undefined && filters.ratingTo !== '') {
        filtered = filtered.filter(movie => movie.rating <= parseFloat(filters.ratingTo));
    }
    
    // Quick filters
    if (filters.quickFilter === 'high-rating') {
        filtered = filtered.filter(movie => movie.rating >= 8);
    }
    if (filters.quickFilter === 'recent') {
        filtered = filtered.filter(movie => movie.year >= 2022);
    }
    
    return filtered;
}

// ===================================
// Function to display movies with pagination
// ===================================
function displayMovies(movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    if (!moviesGrid) return;
    
    // Update movie count
    const movieCountEl = document.getElementById('movieCount');
    if (movieCountEl) {
        movieCountEl.textContent = movies.length;
    }
    
    
    // Reset to page 1 if no movies
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p style="color: #6c757d; text-align: center; grid-column: 1/-1; padding: 3rem; font-size: 1.2rem; background: white; border-radius: 15px; margin: 2rem 0;">No movies found matching your criteria.</p>';
        const paginationContainer = document.getElementById('paginationContainer');
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToShow = movies.slice(startIndex, endIndex);
    
    // Clear grid
    moviesGrid.innerHTML = '';
    
    // Create movie cards
    moviesToShow.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        const isFav = isFavorite(movie.id);
        movieCard.innerHTML = `
            <button class="favorite-btn ${isFav ? 'active' : ''}" data-movie-id="${movie.id}" onclick="toggleFavorite(${movie.id}, event)" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                ${isFav ? '♥' : '♡'}
            </button>
            <img src="${movie.image}" alt="${movie.title}" class="movie-card-image" 
                 onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
            <div class="movie-card-content">
                <h3 class="movie-card-title">${movie.title}</h3>
                <div class="movie-card-meta">
                    <span>${movie.year}</span>
                    <span class="movie-card-rating">${movie.rating}</span>
                </div>
                <p class="movie-card-description">${movie.description}</p>
                <span class="movie-card-category">${movie.category}</span>
            </div>
        `;
        
        movieCard.addEventListener('click', function(e) {
            // Don't navigate if clicking favorite button
            if (!e.target.closest('.favorite-btn')) {
                localStorage.setItem('selectedMovieId', movie.id);
                window.location.href = 'movie-detail.html';
            }
        });
        
        moviesGrid.appendChild(movieCard);
    });
    
    // Display pagination
    displayPagination(movies.length, totalPages);
    
    // Update favorite buttons after displaying movies
    updateFavoriteButtons();
}

// ===================================
// Function to display pagination
// ===================================
function displayPagination(totalMovies, totalPages) {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            &laquo; Prev
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            Next &raquo;
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// ===================================
// Function to change page
// ===================================
function changePage(page) {
    currentPage = page;
    applyFiltersAndSort();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// Function to apply filters and sort
// ===================================
function applyFiltersAndSort() {
    // Get filter values (check both sidebar and regular filters)
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect') || document.getElementById('filterCategory');
    const sortSelect = document.getElementById('sortSelect') || document.getElementById('filterSort');
    
    // Build filter object
    const filters = {
        search: searchInput ? searchInput.value : '',
        category: categorySelect ? categorySelect.value : 'all',
        quickFilter: currentFilter.quickFilter || ''
    };
    
    // Apply filters
    filteredMovies = filterMovies(allMovies, filters);
    
    // Apply sorting
    const sortValue = sortSelect ? sortSelect.value : currentSort;
    filteredMovies = sortMovies(filteredMovies, sortValue);
    currentSort = sortValue;
    
    // Display movies
    displayMovies(filteredMovies);
}

// ===================================
// Function to setup home page
// ===================================
async function loadHomeMovies() {
    await loadMovies();
    populateCategories();
    
    // Setup search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentPage = 1;
            applyFiltersAndSort();
        });
    }
    
    // Setup sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentPage = 1;
            applyFiltersAndSort();
        });
    }
    
    // Setup category filter
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            currentPage = 1;
            applyFiltersAndSort();
        });
    }
    
    // Setup quick filters
    const quickFilterBtns = document.querySelectorAll('.filter-navbar-btn, .sidebar-quick-btn, .quick-filter-btn');
    quickFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sameClassBtns = document.querySelectorAll('.' + this.className.split(' ')[0]);
            sameClassBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter.quickFilter = this.dataset.filter;
            if (currentFilter.quickFilter === 'all') {
                currentFilter.quickFilter = '';
            }
            currentPage = 1;
            applyFiltersAndSort();
        });
    });
    
    // Initial display
    currentPage = 1;
    applyFiltersAndSort();
    
    // Update about section stats
    updateAboutStats();
}

// ===================================
// Function to update about section stats
// ===================================
function updateAboutStats() {
    const totalMoviesEl = document.getElementById('totalMovies');
    if (totalMoviesEl && allMovies.length > 0) {
        totalMoviesEl.textContent = `${allMovies.length}+`;
    }
}

// ===================================
// Function to load featured movies
// ===================================
function loadFeaturedMovies() {
    const featuredContainer = document.getElementById('featuredMovies');
    if (!featuredContainer) return;
    
    // Get top 6 rated movies
    const featured = [...allMovies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    
    featuredContainer.innerHTML = '';
    
    featured.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'featured-movie-card';
        const isFav = isFavorite(movie.id);
        card.innerHTML = `
            <div style="position: relative;">
                <button class="favorite-btn ${isFav ? 'active' : ''}" data-movie-id="${movie.id}" onclick="toggleFavorite(${movie.id}, event)" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                    ${isFav ? '♥' : '♡'}
                </button>
                <img src="${movie.image}" alt="${movie.title}" class="featured-movie-image" 
                     onerror="this.src='https://via.placeholder.com/200x280?text=No+Image'">
                <span class="featured-movie-badge">${movie.rating}</span>
            </div>
            <div class="featured-movie-info">
                <div class="featured-movie-title">${movie.title}</div>
                <div class="featured-movie-rating">${movie.year} • ${movie.category}</div>
            </div>
        `;
        
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.favorite-btn')) {
                localStorage.setItem('selectedMovieId', movie.id);
                window.location.href = 'movie-detail.html';
            }
        });
        
        featuredContainer.appendChild(card);
    });
    
    // Update favorite buttons
    updateFavoriteButtons();
}

// ===================================
// Function to load category quick access
// ===================================
function loadCategoryQuickAccess() {
    const categoryContainer = document.getElementById('categoryQuickCards');
    if (!categoryContainer) return;
    
    const categoriesMap = {};
    allMovies.forEach(movie => {
        if (!categoriesMap[movie.category]) {
            categoriesMap[movie.category] = 0;
        }
        categoriesMap[movie.category]++;
    });
    
    const categoryIcons = {
        'Action': '',
        'Adventure': '',
        'Drama': '',
        'Sci-Fi': '',
        'Thriller': '',
        'Mystery': '',
        'Horror': '',
        'Romance': '',
        'Fantasy': '',
        'Family': '',
        'Crime': '',
        'Comedy': ''
    };
    
    const categories = Object.keys(categoriesMap).sort();
    categoryContainer.innerHTML = '';
    
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-quick-card';
        card.innerHTML = `
            <div class="category-quick-icon">${categoryIcons[category] || ''}</div>
            <div class="category-quick-name">${category}</div>
            <div class="category-quick-count">${categoriesMap[category]} movies</div>
        `;
        
        card.addEventListener('click', function() {
            window.location.href = `categories.html`;
            // Store category for filtering
            setTimeout(() => {
                const categorySelect = document.getElementById('categorySelect');
                if (categorySelect) {
                    categorySelect.value = category;
                    if (typeof loadMoviesByCategory === 'function') {
                        loadMoviesByCategory(category);
                    }
                }
            }, 100);
        });
        
        categoryContainer.appendChild(card);
    });
}

// ===================================
// Function to load categories page (Old version)
// ===================================
async function loadCategories() {
    await loadMovies();
    
    const categories = [...new Set(allMovies.map(movie => movie.category))].sort();
    const filterButtons = document.getElementById('categoryFilters');
    
    if (!filterButtons) return;
    
    // Create "All" button
    const allButton = document.createElement('button');
    allButton.className = 'filter-button active';
    allButton.textContent = 'All';
    allButton.onclick = function() {
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
        currentFilter.category = null;
        currentPage = 1;
        loadMoviesByCategory();
    };
    filterButtons.appendChild(allButton);
    
    // Create category buttons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-button';
        button.textContent = category;
        button.onclick = function() {
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            currentFilter.category = category;
            currentPage = 1;
            loadMoviesByCategory(category);
        };
        filterButtons.appendChild(button);
    });
    
    // Setup sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentPage = 1;
            loadMoviesByCategory(currentFilter.category);
        });
    }
}

// ===================================
// Function to load category list (New design)
// ===================================
async function loadCategoryList() {
    await loadMovies();
    
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    
    // Count movies per category
    const categoriesMap = {};
    allMovies.forEach(movie => {
        if (!categoriesMap[movie.category]) {
            categoriesMap[movie.category] = 0;
        }
        categoriesMap[movie.category]++;
    });
    
    const categories = Object.keys(categoriesMap).sort();
    categoryList.innerHTML = '';
    
    // Create "All" item
    const allItem = document.createElement('div');
    allItem.className = 'category-list-item active';
    allItem.innerHTML = `
        <span>All Categories</span>
        <span class="category-list-item-count">${allMovies.length}</span>
    `;
    allItem.onclick = function() {
        document.querySelectorAll('.category-list-item').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
        currentFilter.category = null;
        currentPage = 1;
        loadMoviesByCategory();
        updateCategoryCount();
    };
    categoryList.appendChild(allItem);
    
    // Create category items
    categories.forEach(category => {
        const item = document.createElement('div');
        item.className = 'category-list-item';
        item.innerHTML = `
            <span>${category}</span>
            <span class="category-list-item-count">${categoriesMap[category]}</span>
        `;
        item.onclick = function() {
            document.querySelectorAll('.category-list-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            currentFilter.category = category;
            currentPage = 1;
            loadMoviesByCategory(category);
            updateCategoryCount();
        };
        categoryList.appendChild(item);
    });
}

// ===================================
// Function to update category movie count
// ===================================
function updateCategoryCount() {
    const countElement = document.getElementById('categoryMovieCount');
    if (!countElement) return;
    
    const count = filteredMovies ? filteredMovies.length : allMovies.length;
    countElement.textContent = `${count} movie${count !== 1 ? 's' : ''}`;
}

// ===================================
// Function to load movies by category
// ===================================
async function loadMoviesByCategory(category = null) {
    await loadMovies();
    
    let filtered = [...allMovies];
    
    if (category) {
        filtered = filtered.filter(movie => movie.category === category);
        const categoryTitle = document.getElementById('categoryTitle');
        if (categoryTitle) {
            categoryTitle.textContent = `${category} Movies`;
        }
    } else {
        const categoryTitle = document.getElementById('categoryTitle');
        if (categoryTitle) {
            categoryTitle.textContent = 'All Movies';
        }
    }
    
    // Apply sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        filtered = sortMovies(filtered, sortSelect.value);
        // Setup sort change event listener
        sortSelect.onchange = function() {
            currentPage = 1;
            loadMoviesByCategory(category);
            updateCategoryCount();
        };
    }
    
    filteredMovies = filtered;
    displayMovies(filteredMovies);
    updateCategoryCount();
}

// ===================================
// Function to load filter page
// ===================================
async function loadFilterPage() {
    await loadMovies();
    populateCategories();
    
    // Get all filter elements
    const filterCategory = document.getElementById('filterCategory');
    const filterYearFrom = document.getElementById('filterYearFrom');
    const filterYearTo = document.getElementById('filterYearTo');
    const filterRatingFrom = document.getElementById('filterRatingFrom');
    const filterRatingTo = document.getElementById('filterRatingTo');
    const filterSort = document.getElementById('filterSort');
    
    // Setup sort
    if (filterSort) {
        filterSort.addEventListener('change', function() {
            if (filteredMovies.length > 0) {
                filteredMovies = sortMovies(filteredMovies, this.value);
                currentPage = 1;
                displayMovies(filteredMovies);
            }
        });
    }
    
    // Initial display - show all movies
    filteredMovies = [...allMovies];
    currentPage = 1;
    displayMovies(filteredMovies);
}

// ===================================
// Function to apply advanced filters
// ===================================
function applyAdvancedFilters() {
    const filterCategory = document.getElementById('filterCategory');
    const filterYearFrom = document.getElementById('filterYearFrom');
    const filterYearTo = document.getElementById('filterYearTo');
    const filterRatingFrom = document.getElementById('filterRatingFrom');
    const filterRatingTo = document.getElementById('filterRatingTo');
    const filterSort = document.getElementById('filterSort');
    
    const filters = {
        category: filterCategory ? filterCategory.value : 'all',
        yearFrom: filterYearFrom ? filterYearFrom.value : '',
        yearTo: filterYearTo ? filterYearTo.value : '',
        ratingFrom: filterRatingFrom ? filterRatingFrom.value : '',
        ratingTo: filterRatingTo ? filterRatingTo.value : ''
    };
    
    // Apply filters
    filteredMovies = filterMovies(allMovies, filters);
    
    // Apply sorting
    if (filterSort) {
        filteredMovies = sortMovies(filteredMovies, filterSort.value);
    }
    
    currentPage = 1;
    displayMovies(filteredMovies);
}

// ===================================
// Function to reset advanced filters
// ===================================
function resetAdvancedFilters() {
    const filterCategory = document.getElementById('filterCategory');
    const filterYearFrom = document.getElementById('filterYearFrom');
    const filterYearTo = document.getElementById('filterYearTo');
    const filterRatingFrom = document.getElementById('filterRatingFrom');
    const filterRatingTo = document.getElementById('filterRatingTo');
    const filterSort = document.getElementById('filterSort');
    
    if (filterCategory) filterCategory.value = 'all';
    if (filterYearFrom) filterYearFrom.value = '';
    if (filterYearTo) filterYearTo.value = '';
    if (filterRatingFrom) filterRatingFrom.value = '';
    if (filterRatingTo) filterRatingTo.value = '';
    if (filterSort) filterSort.value = 'default';
    
    filteredMovies = [...allMovies];
    currentPage = 1;
    displayMovies(filteredMovies);
}

// ===================================
// Function to load movie detail page
// ===================================
async function loadMovieDetail() {
    const movieId = parseInt(localStorage.getItem('selectedMovieId'));
    
    if (!movieId) {
        window.location.href = 'index.html';
        return;
    }
    
    await loadMovies();
    const movie = allMovies.find(m => m.id === movieId);
    
    if (!movie) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load main content
    const detailContainer = document.getElementById('movieDetailContainer');
    if (detailContainer) {
        const isFav = isFavorite(movie.id);
        detailContainer.innerHTML = `
            <div class="movie-detail-main">
                <div class="movie-poster-card">
                    <button class="favorite-btn-small ${isFav ? 'active' : ''}" data-movie-id="${movie.id}" onclick="toggleFavorite(${movie.id}, event)" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                        ${isFav ? '♥' : '♡'}
                    </button>
                    <img src="${movie.image}" alt="${movie.title}" class="movie-poster-img"
                         onerror="this.src='https://via.placeholder.com/250x375?text=No+Image'">
                </div>
                
                <div class="movie-content-area">
                    <div class="movie-title-section">
                        <h1 class="movie-title-small">${movie.title}</h1>
                        <div class="movie-badges">
                            <span class="small-badge rating-badge">${movie.rating}</span>
                            <span class="small-badge year-badge">${movie.year}</span>
                            <span class="small-badge category-badge">${movie.category}</span>
                        </div>
                    </div>
                    
                    <div class="small-cards-grid">
                        <div class="small-info-card">
                            <div class="small-card-label">Director</div>
                            <div class="small-card-value">${movie.director}</div>
                        </div>
                        <div class="small-info-card">
                            <div class="small-card-label">Year</div>
                            <div class="small-card-value">${movie.year}</div>
                        </div>
                        <div class="small-info-card">
                            <div class="small-card-label">Category</div>
                            <div class="small-card-value">${movie.category}</div>
                        </div>
                        <div class="small-info-card">
                            <div class="small-card-label">Rating</div>
                            <div class="small-card-value">${movie.rating} / 10</div>
                        </div>
                    </div>
                    
                    <div class="description-card">
                        <div class="small-card-label">Description</div>
                        <p class="description-text">${movie.description}</p>
                    </div>
                    
                    <div class="cast-card">
                        <div class="small-card-label">Cast</div>
                        <div class="cast-chips">
                            ${movie.actors.map(actor => `<span class="cast-chip">${actor}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Update favorite buttons after loading
        updateFavoriteButtons();
    }
    
    // Load related movies
    loadRelatedMovies(movie);
}

// ===================================
// Function to load related movies
// ===================================
function loadRelatedMovies(movie) {
    const relatedGrid = document.getElementById('relatedMoviesGrid');
    if (!relatedGrid) return;
    
    // Find movies with same category (excluding current movie)
    const related = allMovies
        .filter(m => m.category === movie.category && m.id !== movie.id)
        .slice(0, 6);
    
    if (related.length === 0) {
        relatedGrid.innerHTML = '<p style="color: #6c757d; text-align: center; grid-column: 1/-1; padding: 2rem; background: white; border-radius: 15px;">No related movies found.</p>';
        return;
    }
    
    relatedGrid.innerHTML = '';
    
    related.forEach(m => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        movieCard.innerHTML = `
            <img src="${m.image}" alt="${m.title}" class="movie-card-image" 
                 onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
            <div class="movie-card-content">
                <h3 class="movie-card-title">${m.title}</h3>
                <div class="movie-card-meta">
                    <span>${m.year}</span>
                    <span class="movie-card-rating">⭐ ${m.rating}</span>
                </div>
                <p class="movie-card-description">${m.description}</p>
                <span class="movie-card-category">${m.category}</span>
            </div>
        `;
        
        movieCard.addEventListener('click', function() {
            localStorage.setItem('selectedMovieId', m.id);
            window.location.reload();
        });
        
        relatedGrid.appendChild(movieCard);
    });
}

// ===================================
// Function to load favorites page
// ===================================
async function loadFavoritesPage() {
    await loadMovies();
    
    const favorites = getFavorites();
    const favoritesGrid = document.getElementById('favoritesGrid');
    const emptyState = document.getElementById('favoritesEmptyState');
    const favoritesCount = document.getElementById('favoritesCount');
    const favoritesPlural = document.getElementById('favoritesPlural');
    const sortSelect = document.getElementById('favoritesSortSelect');
    
    if (favorites.length === 0) {
        if (favoritesGrid) favoritesGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        if (favoritesCount) favoritesCount.textContent = '0';
        if (favoritesPlural) favoritesPlural.textContent = 's';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    if (favoritesGrid) favoritesGrid.style.display = 'grid';
    
    // Get favorite movies
    let favoriteMovies = allMovies.filter(movie => favorites.includes(movie.id));
    
    // Update count
    if (favoritesCount) {
        favoritesCount.textContent = favoriteMovies.length;
    }
    if (favoritesPlural) {
        favoritesPlural.textContent = favoriteMovies.length === 1 ? '' : 's';
    }
    
    // Apply sorting
    if (sortSelect) {
        favoriteMovies = sortMovies(favoriteMovies, sortSelect.value);
        sortSelect.addEventListener('change', function() {
            currentPage = 1;
            loadFavoritesPage();
        });
    }
    
    // Display favorite movies
    if (favoritesGrid) {
        favoritesGrid.innerHTML = '';
        
        favoriteMovies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'favorite-movie-card';
            
            movieCard.innerHTML = `
                <button class="remove-favorite-btn-small" onclick="removeFromFavorites(${movie.id}); loadFavoritesPage();" title="Remove from favorites">
                    ×
                </button>
                <img src="${movie.image}" alt="${movie.title}" class="favorite-card-image" 
                     onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
                <div class="favorite-card-content">
                    <h3 class="favorite-card-title">${movie.title}</h3>
                    <div class="favorite-card-meta">
                        <span class="favorite-card-year">${movie.year}</span>
                        <span class="favorite-card-rating">${movie.rating}</span>
                    </div>
                    <span class="favorite-card-category">${movie.category}</span>
                </div>
            `;
            
            movieCard.addEventListener('click', function(e) {
                if (!e.target.closest('.remove-favorite-btn')) {
                    localStorage.setItem('selectedMovieId', movie.id);
                    window.location.href = 'movie-detail.html';
                }
            });
            
            favoritesGrid.appendChild(movieCard);
        });
    }
}

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}


// ===================================
// Page load event handler
// ===================================
window.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    const currentPageName = window.location.pathname.split('/').pop();
    
    if (currentPageName === 'index.html' || currentPageName === '' || currentPageName === 'MovieZone') {
        loadHomeMovies();
    }
    // Other pages have their own loaders in their HTML files
});
