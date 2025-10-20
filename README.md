# Gap and Gain - Speech-to-Text Journal

A speech-to-text application that helps you record daily gains and set goals for the next day seamslessly.

## Prerequisites

- Node.js (v18 or higher)
- OpenAI API key

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/joaoncfsantos/gap-and-gain.git
   cd gap-and-gain
   ```

2. Install dependencies for both client and server

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Configure environment variables

   ```bash
   # In the server directory
   cd server
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. Run the application

   ```bash
   # Terminal 1 - Start the server
   cd server
   node server.ts

   # Terminal 2 - Start the client
   cd client
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## Environment Variables

### Server

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3000)

## Security Note

⚠️ **Never commit your `.env` file!** It contains sensitive API keys.
