# Atmos - Professional Weather App

A modern, responsive weather application built with **React**, **TypeScript**, and **Tailwind CSS**. It features real-time weather data, dark mode, geolocation support, and comprehensive unit testing.

## 🚀 Live Demo
[View Live App](https://weather-app-pro-ten.vercel.app/)

## ✨ Features
- **Real-time Weather:** Fetches data from OpenWeatherMap API.
- **Geolocation:** Automatically detects user location.
- **Dark/Light Mode:** Seamless theme switching with persistence.
- **Search:** Search by city name with error handling.
- **Performance:** Optimized with Vite and Tailwind CSS.
- **Testing:** 100% Unit Test coverage using Vitest & React Testing Library.

## 🛠️ Tech Stack
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Testing:** Vitest, React Testing Library, jsdom
- **Build Tool:** Vite
- **Deployment:** Vercel

## 🏗️ Project Structure
```text
weather-app-pro/
├── .env                  # Environment variables (API Key)
├── .gitignore            # Git ignore rules
├── LICENSE               # MIT License
├── README.md             # This file
├── index.html            # HTML entry point
├── package.json          # Dependencies & Scripts
├── postcss.config.js     # PostCSS config
├── tailwind.config.js    # Tailwind config
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite & Vitest config
├── src/
│   ├── assets/           # Static assets (images, icons)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── test/             # Unit tests
│   │   ├── setup.ts      # Test setup
│   │   └── App.test.tsx  # Component tests
│   ├── types/            # TypeScript interfaces
│   │   └── weather.types.ts
│   ├── utils/            # API logic & helpers
│   │   └── api.ts
│   ├── App.tsx           # Main application logic
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
└── public/               # Public assets

## 🧪 Running Tests
```bash
npm run test
📦 Installation
Clone the repo: git clone https://github.com/sarfarazalamgit/weather-app-pro.git
Install dependencies: npm install
Create a .env file and add VITE_WEATHER_API_KEY=your_key
Start dev server: npm run dev
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/sarfarazalamgit/weather-app-pro/blob/main/LICENSE) file for details.
