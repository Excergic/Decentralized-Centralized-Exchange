# CoinEX - Solana Crypto Exchange

A modern cryptocurrency exchange built on **Solana** with **Next.js 14**, offering real-time trading, portfolio management, and an elegant user interface.

---

## 🚀 Features

### 🏠 Landing Page
- **Real-time Price Charts**: Live SOL, USDC, and USDT tracking with interactive tooltips
- **Gradient Design**: Solana-inspired color scheme (cyan, purple, green)
- **Responsive Layout**: Optimized for desktop, tablet, and mobile

### 🔄 Token Swap
- **Jupiter Integration**: DEX aggregation for best swap rates
- **Live Quotes**: Debounced fetching (500ms delay)
- **User-friendly UI**: HALF/MAX buttons, toggle direction, loading indicators
- **Modern Theme**: Smooth transitions and dark mode

### 💼 Portfolio Management
- **Balance Overview**: Real-time portfolio value (3-decimal precision)
- **Asset Breakdown**: Token list with current balances
- **Wallet Tools**: Copy wallet address, tab navigation (Portfolio/Swap)

### 🔐 Authentication
- **Google OAuth**: Secure login via NextAuth.js
- **Persistent Sessions**: Seamless authentication flow
- **Personalized UX**: Custom welcome messages

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js (Google Provider)
- **Blockchain**: Solana Web3.js, Jupiter API
- **APIs**: CoinGecko (price data), Jupiter (swaps)
- **UI/UX**: Lucide React icons, custom components
- **Charts**: Lightweight Charts library

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Excergic/Decentralized-Centralized-Exchange.git
cd Decentralized-Centralized-Exchange
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

#Database
DATABASE_URL=your-database-url
```

### 4. Run the application
```bash
npm run dev
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 📞 Contact
Twitter: [@dhaivat00](https://twitter.com/dhaivat00)  
Email: dhaivat.jambudia@gmail.com