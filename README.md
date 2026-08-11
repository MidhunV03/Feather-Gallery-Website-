# 🐦 Feather Gallery

Feather Gallery is an interactive bird-exploration web application built
with **HTML, CSS, JavaScript, Node.js, and Express.js**.

The application lets users search for birds, explore bird information,
view images, discover bird categories, and access bird sounds. The
frontend handles the visual experience and user interactions, while
Express.js handles API communication and keeps API credentials on the
server.

## ✨ Features

-   🔎 Bird search
-   🐦 Detailed bird information
-   🖼️ Bird images
-   🔊 Bird sounds
-   🗂️ Bird categories
-   🌍 Bird exploration
-   🤖 AI-powered bird information
-   📱 Responsive interface
-   🎨 Interactive UI, animations, and carousels
-   🔐 API keys protected through server-side environment variables

## 🛠️ Technologies

### Frontend

-   HTML5
-   CSS3
-   JavaScript
-   Bootstrap
-   GSAP
-   Swiper.js
-   Google Fonts

### Backend

-   Node.js
-   Express.js

### External Services

Depending on the enabled features, the application can use:

-   Unsplash --- images
-   Xeno-canto --- bird sounds
-   Gemini --- AI-generated/enriched information
-   Groq --- AI processing

The browser handles the UI, DOM manipulation, animations, and user
interaction. Express handles API requests, external services, response
processing, and secrets.

## 📁 Project Structure

``` text
Feather-Gallery/
│
├── public/
│   ├── index.html
│   ├── pages/
│   │   ├── BirdMan.html
│   │   ├── Category.html
│   │   ├── Details.html
│   │   └── Explore.html
│   ├── styles/
│   │   ├── index.css
│   │   ├── BirdMan.css
│   │   ├── Category.css
│   │   ├── Details.css
│   │   └── Explore.css
│   └── scripts/
│       ├── main.js
│       ├── BirdMan.js
│       ├── Categories.js
│       ├── Details.js
│       └── Explore.js
│
├── server/
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

> File names may vary slightly depending on the current version of the
> project.

## 🔄 How It Works

### 1. User searches for a bird

The user enters a bird name in the frontend.

``` text
User
 ↓
Search box
 ↓
Frontend JavaScript
 ↓
Express API
```

### 2. Express receives the request

For example:

``` text
/api/birds/details?name=Eagle
```

Express receives the request and communicates with the required external
services.

### 3. External APIs provide data

The backend can retrieve information from services such as Groq, Gemini, image services, and audio services.

### 4. Express returns JSON

``` text
External API
     ↓
Express
     ↓
JSON
     ↓
Frontend JavaScript
     ↓
HTML UI
```

### 5. Frontend updates the page

JavaScript uses the response to dynamically update bird details, images,
audio, cards, and other UI elements.

## 🔐 Environment Variables

API keys should **never be hard-coded in frontend JavaScript**.

Create a `.env` file in the project root:

``` env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model

UNSPLASH_ACCESS_KEY=your_unsplash_access_key

XENO_CANTO_API_KEY=your_xeno_canto_api_key

PORT=3000
```

Only add variables for services actually used by your version of the
project.

Add `.env` to `.gitignore`:

``` gitignore
node_modules/
.env
```

Never upload real API keys to GitHub.

## 🚀 Installation

### 1. Clone the repository

``` bash
git clone <your-repository-url>
```

### 2. Enter the project

``` bash
cd Feather-Gallery
```

### 3. Install dependencies

``` bash
npm install
```

### 4. Configure environment variables

Create `.env` and add the required API keys.

### 5. Start the application

For normal execution:

``` bash
npm start
```

For development:

``` bash
npm run dev
```

If nodemon is not installed:

``` bash
npm install --save-dev nodemon
```

## 🌐 Running Locally

After starting the server, open:

``` text
http://localhost:3000
```

Express serves both the frontend and backend:

``` text
http://localhost:3000
        │
        ├── Frontend pages
        ├── CSS
        ├── JavaScript
        └── /api/*
```

## 📡 Frontend API Calls

Use relative API URLs in frontend JavaScript.

### Recommended

``` javascript
fetch("/api/birds/details?name=Eagle");
```

### Avoid

``` javascript
fetch("http://localhost:3000/api/birds/details?name=Eagle");
```

Relative paths allow the same frontend code to work locally and after
deployment.

## 🧩 Frontend vs Backend

### Frontend responsibilities

-   Page layout
-   Styling
-   Animations
-   User interactions
-   Search forms
-   DOM manipulation
-   Displaying API results
-   Audio controls
-   Carousels
-   Navigation

### Express backend responsibilities

-   API requests
-   API keys
-   External service communication
-   Processing API responses
-   Returning JSON
-   Protecting sensitive credentials

## 🔒 Why Express?

The original project used browser JavaScript to communicate directly
with APIs. If a service requires a secret key, that key can be exposed
to users.

### Before

``` text
Frontend JavaScript
      ↓
API KEY exposed
      ↓
External API
```

### With Express

``` text
Frontend
   ↓
Express
   ↓
API KEY stays on server
   ↓
External API
```

This provides a safer and cleaner architecture for deployment.

## 🚢 Deployment

Feather Gallery can be deployed as a Node/Express application on
platforms such as Render or Railway.

Typical deployment flow:

``` text
GitHub
   ↓
Hosting Platform
   ↓
npm install
   ↓
npm start
   ↓
Express Server
```

### Production start command

``` bash
npm start
```

### Build/install command

``` bash
npm install
```

Add environment variables through the hosting platform's
environment-variable settings instead of committing `.env`.

## 🧪 Development vs Production

### Development

``` bash
npm run dev
```

Usually runs Express through **nodemon**, which automatically restarts
the server when backend files change.

### Production

``` bash
npm start
```

Runs the Express server normally.

## 🎯 Project Goal

The goal of Feather Gallery is to create an engaging and educational way
to explore birds using modern web technologies.

``` text
Bird Data
   +
Images
   +
Sounds
   +
AI
   +
Interactive UI
   =
Feather Gallery
```

## 🔮 Future Improvements

-   User accounts
-   Favorite birds
-   Bird comparison
-   Location-based bird discovery
-   Bird migration maps
-   Advanced filtering
-   Detailed conservation information
-   Image-based bird recognition
-   Bird sound recognition
-   Personalized recommendations
-   Database integration
-   Admin dashboard

## 👨‍💻 Learning Outcomes

This project provides practical experience with:

-   HTML/CSS frontend development
-   JavaScript DOM manipulation
-   REST APIs
-   Fetch API
-   Express.js
-   Node.js
-   Environment variables
-   API security
-   Asynchronous JavaScript
-   JSON data handling
-   Third-party API integration
-   Git and GitHub
-   Full-stack application deployment

## 📜 License

This project is created for educational and project-development
purposes.

Check the terms and attribution requirements of each third-party
API/service before deploying the application publicly.
