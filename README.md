# Wattson - MARA Operations AI

**Professional Black-themed enterprise AI agent for optimizing mining operations**

Wattson is an intelligent AI assistant that helps MARA optimize their mining operations by extracting insights from energy prices and hash prices, providing real-time analysis and automated recommendations.

## Features

### 🏠 Homepage
- **AI Status Summary**: Real-time system status with green/yellow/red indicators
- **Smart Notifications**: AI-powered alerts for market changes and operational events
- **Market Overview**: Live energy, hash, and token pricing
- **Wattson Insights**: AI-generated observations with confidence metrics

### 📊 Dashboard
- **Real-time Data Visualization**: Interactive charts for energy, hash, and token prices
- **Asset Profitability Analysis**: Comprehensive breakdown of mining vs inference operations
- **Live Inventory Status**: Real-time monitoring of all mining and inference assets
- **Performance Metrics**: Key operational indicators and trend analysis

### ⚡ Execution Page
- **AI Recommendations**: Smart suggestions based on market conditions
- **Simulation Mode**: Test strategies before execution
- **Quick Actions**: Emergency controls and rapid asset allocation
- **Confidence Scoring**: AI certainty levels for each recommendation

### 🤖 Wattson AI Chat
- **Sherlock Holmes Personality**: Professional detective-style interactions
- **Voice Input**: Speech recognition for hands-free operation
- **Natural Language Processing**: Query operations data in plain English
- **Real-time Analysis**: Live market insights and performance summaries

## Technical Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **API Integration**: Axios for MARA Hackathon API
- **Voice**: Web Speech API for voice commands
- **Effects**: Custom liquid glass visual elements

## API Integration

Connects to MARA Hackathon API endpoints:
- `GET /inventory` - Mining and inference asset data
- `GET /prices` - Real-time energy, hash, and token prices
- `POST /sites` - Site management operations

## Key Components

### WattsonAI Class
Intelligent analysis engine that:
- Analyzes market conditions and generates status indicators
- Creates actionable recommendations with confidence scores
- Processes natural language queries
- Maintains Sherlock Holmes personality for professional interactions

### Real-time Data Processing
- Fetches market data every 5 minutes
- Calculates profitability for all assets
- Generates automated notifications for significant changes
- Maintains historical data for trend analysis

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd mara-wattson

# Install dependencies
npm install

# Start development server
npm start
```

## Usage Examples

### Chat Interactions
- "Wattson, what's our top opportunity right now?"
- "Summarize today's performance"
- "What's the current energy market status?"

### AI Responses
- "Elementary: I detect a 15% arbitrage between ERCOT energy and GPU token value. Confidence: 82%"
- "Today's performance yielded $3.2k profit, 12% higher than yesterday"

## Architecture

```
src/
├── components/
│   ├── Homepage.js          # Main dashboard with status
│   ├── Dashboard.js         # Analytics and charts
│   ├── ExecutionPage.js     # AI recommendations & actions
│   ├── ChatWidget.js        # Wattson AI chat interface
│   └── LiquidGlass.js       # Premium visual effects
├── services/
│   └── api.js               # MARA API integration
├── utils/
│   └── wattsonAI.js         # AI analysis engine
└── App.js                   # Main application router
```

## Professional Features

- **Enterprise-grade UI**: Clean, professional black theme
- **Real-time Monitoring**: Live data updates and notifications
- **AI-Powered Insights**: Intelligent analysis with confidence metrics
- **Voice Control**: Hands-free operation capability
- **Responsive Design**: Works on desktop and mobile devices
- **Liquid Glass Effects**: Premium visual elements for enhanced UX

## Market Analysis Capabilities

Wattson continuously monitors and analyzes:
- Energy price fluctuations and trends
- Hash rate market conditions
- Token pricing for inference operations
- Asset profitability across all equipment types
- Optimal timing for asset reallocation

Built for the MARA Hackathon - Demonstrating AI-driven optimization for enterprise mining operations.