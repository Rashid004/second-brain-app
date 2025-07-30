# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Second Brain is a Next.js 15.4.4 web application for sharing thoughts and content. It uses TypeScript, TailwindCSS, and MongoDB with Mongoose for data persistence. The app follows the Next.js App Router architecture with API routes for backend functionality.

## Common Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Linting**: `npm run lint`

## Architecture

### Database Layer
- **Connection**: `lib/db.ts` handles MongoDB connection (localhost:27017/brainly)
- **Models**: Mongoose schemas in `models/` directory
- **Types**: TypeScript interfaces in `types/` directory

### API Structure
- RESTful API routes in `app/api/` following Next.js App Router conventions
- Route handlers use Next.js 13+ format with named exports (GET, POST, etc.)
- Database connection established per API call via `connectDB()`

### Frontend Architecture
- App Router with `app/` directory structure
- Global styles in `app/globals.css` using TailwindCSS
- Geist font family loaded via `next/font/google`
- Path aliasing configured: `@/*` maps to project root

### Key Components
- **User Management**: User schema with userName, email, password fields
- **API Endpoints**: Modular API routes for users, content, links, and tags
- **Type Safety**: Full TypeScript integration with strict mode enabled

## Development Notes

- MongoDB runs locally on default port (27017)
- Uses bcrypt and jsonwebtoken for auth (dependencies installed)
- TailwindCSS v4 with PostCSS configuration
- TypeScript target: ES2017 with bundler module resolution