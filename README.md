# 📝 Personal Blog Template

A complete, production-ready personal blog template built with Next.js 15, Supabase, and modern web technologies. Features a beautiful creamy theme, powerful rich text editor, article mentions, and comprehensive admin dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

**Demo**: [Your Demo URL Here]  
**Documentation**: [View Full Docs](https://github.com/orev7s/blog-template)

## ✨ Features

### For Visitors
- **Browse Posts**: View all published blog posts with category filtering (Fixes, Thoughts, General)
- **Read Full Posts**: Clean, readable post pages with proper formatting
- **Comment**: Leave comments on posts (requires moderation approval)
- **React**: Like or dislike posts (anonymous, tracked by session)
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works on all devices

### For Owner/Admin
- **Authentication**: Secure login system with owner-only access
- **Rich Editor**: Create and edit posts with:
  - Bold, italic, code formatting
  - Headings (H1-H3)
  - Bullet and numbered lists
  - **Image uploads** to Supabase Storage
  - **Font selection** (Georgia, Inter, Roboto Mono) for specific text sections
  - **Article Mentions**: @mention other articles with fuzzy search and beautiful inline cards
  - Live preview mode
- **Post Management**:
  - Create, edit, delete posts
  - Categorize (Fixes, Thoughts, General)
  - Save as draft or publish
  - Auto-generated slugs from titles
- **Comment Moderation**:
  - Approve or delete comments
  - See all pending and approved comments
- **Analytics Dashboard**:
  - View counts per post
  - Like/dislike statistics (only visible to owner)
  - Top posts by views
  - Charts showing trends over time
- **Settings**: Control signup access (auto-disabled after owner creation)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account ([Sign up for free](https://supabase.com))

### Installation

1. **Clone this template**:
```bash
git clone https://github.com/orev7s/blog-template.git my-blog
cd my-blog
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

4. **Configure environment variables**:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Set up the database**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase/schema.sql`
   - Run the SQL query to create all tables, policies, and functions

6. **Run development server**:
```bash
npm run dev
```

7. **Open browser**:
Visit [http://localhost:3000](http://localhost:3000)

### First-Time Setup

1. **Create Owner Account**:
   - Go to http://localhost:3000/signup
   - Enter your email and password
   - You'll be the first user, so you automatically become the owner
   - Signup is then disabled for everyone else

2. **Access Admin Panel**:
   - Go to http://localhost:3000/admin
   - You'll see the dashboard with overview stats

3. **Create Your First Post**:
   - Click "New Post" in the admin sidebar
   - Write your post using the rich editor
   - Upload images if needed
   - Select font styles for specific sections
   - Choose a category
   - Click "Publish" to make it live

## 📁 Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/              # Login page
│   │   └── signup/             # Signup page
│   ├── admin/
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── comments/           # Comment moderation
│   │   ├── posts/
│   │   │   ├── new/            # Create post
│   │   │   └── [id]/edit/      # Edit post
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   └── page.tsx            # Admin dashboard
│   ├── posts/
│   │   └── [slug]/             # Public post page
│   ├── actions/
│   │   ├── auth.ts             # Auth server actions
│   │   ├── comments.ts         # Comment actions
│   │   ├── posts.ts            # Post CRUD actions
│   │   └── public.ts           # Public-facing actions
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/
│   ├── admin/
│   │   └── LogoutButton.tsx    # Logout component
│   ├── editor/
│   │   ├── rich-editor.tsx     # Tiptap rich text editor
│   │   └── editor.css          # Editor styles
│   ├── ui/                     # shadcn/ui components
│   ├── comments.tsx            # Comments component
│   ├── nav-header.tsx          # Site navigation
│   ├── post-card.tsx           # Post preview card
│   ├── reaction-buttons.tsx    # Like/dislike buttons
│   ├── theme-provider.tsx      # Dark mode provider
│   └── track-view.tsx          # View tracking
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   └── middleware.ts       # Auth middleware
│   ├── auth.ts                 # Auth utilities
│   ├── session.ts              # Session ID for anonymous users
│   ├── upload-image.ts         # Image upload helper
│   └── utils.ts                # Utility functions
├── supabase/
│   └── schema.sql              # Database schema
└── middleware.ts               # Route protection
```

## 🎨 Theme & Styling

- **Light Mode**: Creamy white background (#F9F8F6) with warm orange accents (#E87D42)
- **Dark Mode**: Dark brown/black (#1A1210) with maintained orange accents
- **Fonts**:
  - Body: Inter
  - Headings: Georgia (serif)
  - Post Content: Selectable (Georgia, Inter, Roboto Mono)
- **Framework**: Tailwind CSS with custom design tokens

## 🗄️ Database Schema

### Tables
- **profiles**: User roles (owner/user)
- **posts**: Blog posts with JSONB content
- **comments**: User comments with approval status
- **post_reactions**: Like/dislike tracking by session
- **post_views**: View tracking by session
- **settings**: App settings (signup_enabled, etc.)

### Storage
- **blog-images**: Public bucket for post images

### Security
- Row Level Security (RLS) enabled on all tables
- Owner-only access to analytics data
- Public can view published posts and approved comments

## 🔐 Security Features

1. **Owner-Only Admin**: First signup becomes owner, then signup auto-disables
2. **Protected Routes**: Middleware guards /admin routes
3. **RLS Policies**: Database-level security on all tables
4. **Session-Based Reactions**: Anonymous users tracked by session ID
5. **Comment Moderation**: All comments require approval before showing

## 🎯 Article Mentions Feature

One of the standout features is the **@mention system** for referencing other articles:

- **Type `@`** in the editor to trigger autocomplete
- **Fuzzy search** finds articles even with typos (powered by Fuse.js)
- **Beautiful cards** render inline with article icon, title, and category
- **Clickable** - readers can navigate to referenced articles
- **Works everywhere** - editor, preview, and published posts

Example: When you type `@perf opt`, it will find "Performance Optimization Tips"

## 📝 Key Technologies

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Editor**: Tiptap (with custom extensions)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom theme
- **Charts**: Recharts
- **Markdown**: react-markdown with GFM support
- **Dark Mode**: next-themes
- **Search**: Fuse.js (fuzzy search)
- **Icons**: Lucide React

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Environment Variables
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 📖 Usage Guide

### Creating a Post
1. Go to `/admin/posts/new`
2. Enter a title (slug auto-generates)
3. Select a category
4. Use the editor toolbar for formatting:
   - **Bold**, *Italic*, `Code`
   - Headings (H1-H3)
   - Lists (bullet & numbered)
   - **Upload images** from your computer
   - **Select fonts** for specific text sections
   - **@mention** other articles (type `@` and search)
5. Toggle "Preview" to see how it looks
6. Click "Save" (draft) or "Publish"

### Moderating Comments
1. Go to `/admin/comments`
2. Pending comments are highlighted
3. Click "Approve" to make visible or "Delete" to remove

### Viewing Analytics
1. Go to `/admin/analytics`
2. See charts for views, reactions, and engagement
3. View top-performing posts

### Managing Signup
- Signup is automatically disabled after owner creation
- To re-enable (if needed), update the `settings` table in Supabase

## 🛠️ Development

### Adding a New shadcn/ui Component
```bash
npx shadcn@latest add [component-name]
```

### Running Type Checks
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## 🐛 Troubleshooting

### "Signup is disabled"
This is expected after the owner account is created. Use the owner credentials to log in.

### Images not uploading
Check that:
1. The `blog-images` bucket exists in Supabase Storage
2. Storage policies are correctly set (run the schema.sql migrations)
3. You're logged in as the owner

### Posts not showing
Ensure:
1. Posts are marked as "published"
2. You're viewing the public site (not logged in)
3. RLS policies are correctly applied

## 🎨 Customization

### Changing the Theme
Edit `app/globals.css` to customize colors:
- Light mode colors: `:root` section
- Dark mode colors: `.dark` section
- Primary color (orange): `--primary` variable

### Modifying Categories
Update the category options in:
- `app/admin/posts/new/page.tsx`
- `app/admin/posts/[id]/edit/page.tsx`
- `supabase/schema.sql` (post_category enum)

### Adding New Features
The codebase is organized for easy extension:
- Add new admin pages in `app/admin/`
- Create new components in `components/`
- Add server actions in `app/actions/`

## 🤝 Contributing

This is a template repository. Feel free to:
- Fork it for your own use
- Customize it to your needs
- Share improvements via pull requests

## 📄 License

MIT License - Feel free to use this template for your personal or commercial projects.

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Tiptap](https://tiptap.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Made with ❤️ for the developer community**

If you find this template useful, please give it a ⭐ on [GitHub](https://github.com/orev7s/blog-template)!
