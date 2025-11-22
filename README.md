# 🎬 MovieZone - Movie Discovery Platform

A modern, fully responsive web application for discovering and exploring movies. Built with vanilla HTML, CSS, and JavaScript to showcase core front-end development skills.

![MovieZone](https://img.shields.io/badge/MovieZone-Live-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🌐 Live Demo

**👉 [View Live Project](https://prismatic-unicorn-1614a0.netlify.app/)**

---

## 📸 Screenshots

### Home Page
![Home Page](https://drive.google.com/uc?export=view&id=1mxVXGhMN3fVI_LH0LfFgnUw-JPEK2MPK)

### Movie Details Page
![Movie Details](https://drive.google.com/uc?export=view&id=1HXWkDza6DwHwzvFjpE1Wb5GB5jECjUPe)

### Favorites Page
![Favorites](https://drive.google.com/uc?export=view&id=1LfB-EGWeqwBytkHXJeLdyx9AFMaz0gxj)

### Mobile Responsive Design
![Mobile View](https://drive.google.com/uc?export=view&id=1jpDnWHHHCWea95YIf4u0gxMKR3E1MkES)

---

## ✨ Features

### 🔍 Advanced Search & Filtering
- **Real-time Search**: Search across movie titles, actors, directors, and descriptions
- **Category Filtering**: Filter movies by genre (Action, Drama, Sci-Fi, Comedy, Horror, Thriller, Romance)
- **Multiple Sorting Options**:
  - By Rating (High to Low / Low to High)
  - By Year (Newest First / Oldest First)
  - By Title (A to Z / Z to A)
  - Default sorting

### 📄 Pagination System
- Displays 9 movies per page for optimal performance
- Dynamic pagination controls with page numbers
- Previous/Next navigation buttons
- Smart disabled states for boundary conditions

### ❤️ Favorites Management
- Add/remove movies to/from favorites
- Persistent storage using browser's LocalStorage
- Real-time UI updates across all pages
- Dedicated favorites page with sorting capabilities

### 📱 Fully Responsive Design
- Mobile-first approach with breakpoints at 1024px, 768px, and 480px
- Responsive grid layouts (4 columns → 2 columns → 1 column)
- Mobile hamburger menu with smooth animations
- Touch-friendly interface elements

### 🎨 Modern UI/UX
- Clean, minimalist card-based layout
- Smooth CSS transitions and animations
- Hover effects and visual feedback
- Professional gradient color scheme
- Empty states and error handling

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Data Storage**: JSON file, Browser LocalStorage
- **Deployment**: Netlify
- **No Frameworks**: Pure vanilla JavaScript to demonstrate core skills

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/moviezone.git
   cd moviezone
   ```

2. **Open in your browser**
   
   **Option 1: Direct File Opening**
   - Simply open `index.html` in your web browser

   **Option 2: Using a Local Server (Recommended)**
   
   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npx http-server
   ```
   
   **Using VS Code Live Server:**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Access the application**
   - Navigate to `http://localhost:8000` (or the port shown by your server)

---

## 📁 Project Structure

```
MovieZone/
├── index.html              # Home page with movie grid and filters
├── movie-detail.html       # Individual movie detail page
├── favorites.html          # User's favorite movies page
├── about.html              # About page with platform information
├── movies.json             # Movie data source (JSON format)
├── script.js               # Main JavaScript logic (1063 lines)
├── styles.css              # Comprehensive styling (2793 lines)
├── README.md               # Project documentation
└── PROJECT_EXPLANATION.md  # Detailed technical explanation
```

---

## 🎯 Key Functionalities

### Search & Filter
- Type in the search box to filter movies in real-time
- Select a category from the dropdown to filter by genre
- Choose a sort option to organize movies

### View Movie Details
- Click on any movie card to see detailed information
- View cast, director, rating, year, and description
- Add/remove from favorites directly from the detail page

### Manage Favorites
- Click the heart icon on any movie card to add to favorites
- Visit the Favorites page to see all saved movies
- Sort favorites using the same sorting options
- Remove favorites from the favorites page

### Responsive Navigation
- Use the hamburger menu on mobile devices
- Navigate between Home, Favorites, and About pages
- Active page is highlighted in the navigation

---

## 💡 Usage Examples

### Filtering Movies
1. Type a search term in the search box (e.g., "Action", "Sci-Fi", actor name)
2. Select a category from the dropdown (e.g., "Action", "Drama")
3. Choose a sort option (e.g., "Rating (High to Low)")
4. Results update automatically

### Adding to Favorites
1. Browse movies on the home page
2. Click the heart icon (♡) on any movie card
3. The heart turns red (♥) indicating it's saved
4. Visit the Favorites page to see all saved movies

### Viewing Movie Details
1. Click on any movie card
2. View complete information including:
   - Movie poster
   - Title, year, rating, category
   - Director and cast information
   - Full description

---

## 🎨 Design Highlights

- **Color Scheme**: Modern purple gradient theme (#667eea to #764ba2)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Card-based design with hover effects
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Semantic HTML and ARIA labels

---

## 🔧 Technical Implementation

### Data Management
- Movies stored in JSON format for easy maintenance
- LocalStorage API for persistent favorites storage
- State management using JavaScript objects and variables

### Performance Optimizations
- Pagination to limit DOM elements per page
- Efficient filtering and sorting algorithms
- Event delegation to minimize event listeners
- Lazy loading considerations for images

### Browser Compatibility
- Works on all modern browsers
- Graceful degradation for older browsers
- Cross-browser CSS prefixes where needed

---

## 📊 Project Statistics

- **Total Lines of Code**: ~4,000+
- **HTML Pages**: 4
- **JavaScript Functions**: 30+
- **CSS Classes**: 200+
- **Movies in Database**: 20+

---

## 🚧 Future Enhancements

- [ ] Backend integration with REST API
- [ ] User authentication system
- [ ] Advanced filters (year range, rating range)
- [ ] Movie recommendations algorithm
- [ ] Reviews and ratings system
- [ ] Watchlist feature (separate from favorites)
- [ ] Dark mode toggle
- [ ] Search autocomplete
- [ ] Infinite scroll option
- [ ] Social sharing functionality

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn URL]
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Movie data structure inspired by modern movie database APIs
- Design inspiration from popular streaming platforms
- Icons and images from various open-source resources

---

## 📧 Contact

For any questions, suggestions, or feedback, please feel free to reach out:

- **Email**: your.email@example.com
- **Project Link**: [https://github.com/yourusername/moviezone](https://github.com/yourusername/moviezone)
- **Live Demo**: [https://prismatic-unicorn-1614a0.netlify.app/](https://prismatic-unicorn-1614a0.netlify.app/)

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ using Vanilla JavaScript

</div>

