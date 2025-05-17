# Restaurant Voice Agent Frontend

A modern web application for voice-based restaurant ordering using LiveKit's real-time communication platform.

## Features

- 🎙️ Real-time voice interaction with AI agent
- 📊 Audio visualization with dynamic waveform display
- 🎨 Modern UI with frosted glass effects and responsive design
- 🔄 Live connection status indicators
- 📱 Mobile-responsive interface

## Tech Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Real-time Communication**: LiveKit
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- LiveKit server running (typically on localhost:8000)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:8000
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Next.js pages
│   └── styles/        # Global styles and Tailwind config
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## Key Components

- `Assistant.tsx`: Main component handling voice interaction and UI
- `AgentMultibandAudioVisualizer`: Real-time audio visualization
- `MicrophoneButton`: Microphone control with visual feedback

## Styling

The application uses a custom theme with:
- Primary color (Orange): #FF6B35
- Secondary color (Teal): #2EC4B6
- Accent color (Gold): #FFD23F
- Dark background: #1A1B1E

Frosted glass effects are achieved using Tailwind's backdrop-blur utilities.

## Development

### Running Tests
```bash
npm run test
# or
yarn test
```

### Building for Production
```bash
npm run build
# or
yarn build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 