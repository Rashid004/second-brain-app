# 🧠 Second Brain

A personal knowledge management app to save, organize, and share your thoughts and content.

## What is this?

Second Brain is like having a digital notebook where you can:
- Save interesting links and articles
- Store YouTube videos you want to watch later  
- Keep Twitter posts that inspire you
- Organize everything with tags
- Share your brain with others

## Features

✨ **Save Any Content**
- YouTube videos
- Twitter posts
- Articles and links
- Images
- Documents

📱 **Works Everywhere**
- Mobile-friendly design
- Fast and responsive
- Works on any device

🏷️ **Stay Organized**
- Add tags to your content
- Filter by content type
- Search through everything
- Easy to find what you need

🔗 **Share Your Brain**
- Create shareable links
- Let others explore your knowledge
- Public or private sharing

## How to Use

1. **Sign Up** - Create your account
2. **Add Content** - Click "Add Content" and paste any link
3. **Organize** - Add tags and descriptions
4. **Share** - Generate a link to share your brain

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Node.js, MongoDB
- **Auth**: JWT tokens
- **Database**: MongoDB with Mongoose

## Getting Started

1. Clone the repo
```bash
git clone <your-repo-url>
cd second-brain-webapp
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Add your MongoDB connection string
```

4. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                 # Next.js pages and API routes
├── components/          # React components
├── models/             # MongoDB schemas
├── service/            # API service functions
├── middleware/         # Auth middleware
├── lib/                # Database connection
└── types/              # TypeScript types
```

## Contributing

Feel free to submit issues and pull requests!

## License

MIT License - feel free to use this project however you want.

---

Built with ❤️ for organizing digital knowledge