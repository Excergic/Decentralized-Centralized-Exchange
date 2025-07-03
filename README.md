cat > README.md << 'EOF'
# CoinEX - Solana Crypto Exchange

A modern, professional cryptocurrency exchange built on Solana with Next.js 14, featuring real-time trading, portfolio management, and beautiful UI/UX.

![CoinEX Banner](https://via.placeholder.com/1200x400/1a1b23/00D4FF?text=CoinEX+-+Solana+Crypto+Exchange)

## 🚀 Features

### 🏠 **Landing Page**
- **Real-time Price Charts**: Live SOL, USDC, and USDT price tracking with interactive tooltips
- **Gradient Design**: Beautiful Solana-inspired color scheme (cyan, purple, green)
- **Responsive Layout**: Perfect on desktop, tablet, and mobile devices

### 🔄 **Token Swap**
- **Jupiter Integration**: Powered by Jupiter's DEX aggregator for best rates
- **Real-time Quotes**: Debounced quote fetching with 500ms delay
- **Smart UI**: HALF/MAX buttons, swap direction toggle, loading animations
- **Professional Design**: Modern dark theme with smooth transitions

### 💼 **Portfolio Management**
- **Balance Overview**: Total portfolio value with 3-decimal precision
- **Token List**: Complete asset breakdown with current balances
- **Wallet Integration**: Copy wallet address functionality
- **Tab Navigation**: Clean Portfolio/Swap interface

### 🔐 **Authentication**
- **Google OAuth**: Secure login with NextAuth.js
- **Session Management**: Persistent authentication state
- **User Experience**: Welcome messages with personalized greeting

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider
- **Blockchain**: Solana Web3.js, Jupiter API
- **APIs**: CoinGecko for price data, Jupiter for swaps
- **UI Components**: Lucide React icons, Custom components
- **Charts**: Lightweight Charts library

## 📦 Installation

1. **Clone the repository**
\`\`\`
git clone https://github.com/yourusername/coinex.git
cd coinex
\`\`\`

2. **Install dependencies**
\`\`\`
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`
cp .env.example .env.local
\`\`\`

Add your environment variables:
\`\`\`
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Solana
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
\`\`\`

4. **Run the development server**
\`\`\`
npm run dev
\`\`\`

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
coinex/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── swap/
│   │   └── tokens/
│   ├── perps/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Button.tsx
│   ├── CryptoChart.tsx
│   ├── LoadingDots.tsx
│   ├── Navbar.tsx
│   ├── Perps.tsx
│   ├── ProfileCard.tsx
│   ├── Swap.tsx
│   └── TokenList.tsx
├── lib/
│   ├── auth.ts
│   └── tokens.ts
└── public/
\`\`\`

## 🎨 Design System

### **Colors**
- **Primary Gradient**: \`#00D4FF\` → \`#9945FF\` (Cyan to Purple)
- **Secondary Gradient**: \`#9945FF\` → \`#14F195\` (Purple to Green)
- **Background**: Dark gradients with \`#1a1b23\` and \`#131620\`

### **Components**
- **PrimaryButton**: Gradient buttons with loading states
- **SecondaryButton**: Outlined buttons for secondary actions
- **TabButton**: Navigation tabs with active states

### **Typography**
- **Headings**: Bold, gradient text for emphasis
- **Body**: Clean, readable text with proper contrast
- **Monospace**: For numbers and addresses

## 🔧 API Endpoints

### **Authentication**
- \`GET /api/auth/session\` - Get current user session
- \`POST /api/auth/signin\` - Sign in with Google

### **Trading**
- \`GET /api/tokens?address={wallet}\` - Get token balances
- \`POST /api/swap\` - Execute token swap

### **External APIs**
- **Jupiter API**: \`https://quote-api.jup.ag/v6/quote\` - Get swap quotes
- **CoinGecko API**: \`https://api.coingecko.com/api/v3/\` - Price data

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### **Manual Deployment**
\`\`\`
npm run build
npm start
\`\`\`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`NEXTAUTH_URL\` | Your app URL | ✅ |
| \`NEXTAUTH_SECRET\` | Random secret key | ✅ |
| \`GOOGLE_CLIENT_ID\` | Google OAuth client ID | ✅ |
| \`GOOGLE_CLIENT_SECRET\` | Google OAuth secret | ✅ |
| \`NEXT_PUBLIC_RPC_URL\` | Solana RPC endpoint | ✅ |

## 📱 Features Roadmap

### **Version 1.0** ✅
- [x] User authentication
- [x] Portfolio management
- [x] Token swapping
- [x] Real-time price charts
- [x] Responsive design

### **Version 2.0** 🚧
- [ ] Perpetual futures trading
- [ ] Advanced charting tools
- [ ] Transaction history
- [ ] Mobile app
- [ ] Multi-wallet support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain platform
- **Jupiter** - For the DEX aggregation protocol
- **CoinGecko** - For reliable price data
- **Vercel** - For seamless deployment
- **Next.js Team** - For the incredible framework

## 📞 Support

- **Documentation**: [docs.coinex.com](https://docs.coinex.com)
- **Discord**: [Join our community](https://discord.gg/coinex)
- **Twitter**: [@CoinEX_Official](https://twitter.com/coinex_official)
- **Email**: support@coinex.com

---

<div align="center">
  <p>Built with ❤️ on Solana</p>
  <p>
    <a href="https://solana.com">
      <img src="https://img.shields.io/badge/Powered%20by-Solana-9945FF?style=for-the-badge&logo=solana" alt="Powered by Solana" />
    </a>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Built%20with-Next.js-000000?style=for-the-badge&logo=next.js" alt="Built with Next.js" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Styled with Tailwind CSS" />
    </a>
  </p>
</div>
EOF
