# Forum Frontend

A React + Vite frontend for a forum application that communicates with a Flask API.

## Features

- View all forum threads
- Create new threads
- View thread details with posts
- Reply to threads
- Responsive design


## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- The backend running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints Used

The frontend communicates with the following Flask API endpoints:

- `GET /api/threads` - Get all threads
- `POST /api/threads` - Create a new thread
- `GET /api/threads/:id` - Get a specific thread with posts
- `POST /api/threads/:id/posts` - Create a post in a thread


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production