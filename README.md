# Rundovo

Rundovo is a rental operations SaaS platform built with modern technologies to support multi-tenant inventory, bookings, condition evidence, and contracts.

## Tech Stack
- **Frontend Framework:** Next.js (App Router) + TypeScript
- **Hosting / Deployment:** Vercel
- **UI System:** Tailwind CSS + shadcn/ui
- **Backend / Database:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Primary Payments:** Stripe
- **Contracts / e-signature:** DocuSign

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/J-u-s-t-J-o-s-h/rundovo.git
   ```

2. **Setup Environment Variables:**
   Copy the example environment file into a local `.env.local` to override the defaults safely.
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase, Stripe, and DocuSign keys in `.env.local`.

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
