# WattsonAI - MARA Operations AI

**Professional Black-themed enterprise AI agent for optimizing mining operations**

WattsonAI is an intelligent AI assistant that helps MARA optimize their mining operations by extracting insights from energy prices and hash prices, providing real-time analysis and automated recommendations.

## Overview

WattsonAI is designed to streamline operations in a compute/data center environment, leveraging the MARA Hackathon API and integrating Claude AI for enhanced system configuration and allocation.

## Table of Contents

- [Demo Video](#demo-video)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Technical Architecture](#technical-architecture)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Project Description](#project-description)
- [License](#license)

## Demo Video

![Demo Video Placeholder](#)  
*Click the image above to watch the full demo of WattsonAI in action.*

## Key Features

- **AI Status Summary**: Real-time system status with green/yellow/red indicators
- **Smart Notifications**: AI-powered alerts for market changes and operational events
- **Market Overview**: Live energy, hash, and token pricing
- **Wattson Insights**: AI-generated observations with confidence metrics
- **Voice Input**: Speech recognition for hands-free operation
- **Natural Language Processing**: Query operations data in plain English

## Screenshots

- **Homepage**: ![Homepage Screenshot Placeholder](#)
- **Dashboard**: ![Dashboard Screenshot Placeholder](#)
- **Execution Page**: ![Execution Page Screenshot Placeholder](#)
- **Chat Interface**: ![Chat Interface Screenshot Placeholder](#)

*Consider adding screenshots of the main interface, dashboard, execution page, and chat interface.*

## Technical Architecture

WattsonAI combines several technologies to create a seamless, user-friendly experience:

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for data visualization
- **API Integration**: Axios for MARA Hackathon API
- **Voice**: Web Speech API for voice commands

## Repository Structure

```
WattsonAI/
├── README.md
├── backend/
│   ├── server.js
│   └── test.js
├── src/
│   ├── components/
│   │   ├── ChatWidget.js
│   │   ├── Dashboard.js
│   │   └── ExecutionPage.js
│   ├── services/
│   │   └── api.js
│   └── utils/
│       └── wattsonAI.js
```

## Getting Started

### Prerequisites

- Node.js v14+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd WattsonAI

# Install dependencies
npm install

# Start development server
npm start
```

## Project Description

WattsonAI is a voice-enabled, AI-driven tool for optimizing mining operations, providing real-time insights and recommendations.

## License

This project is licensed under the MIT License.