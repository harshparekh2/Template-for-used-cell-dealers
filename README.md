# HP Verse - Premium Smartphone Dealership

A full-featured premium smartphone dealership platform built with Next.js 16, React 19, and modern web technologies.

## Features

### Public Pages
- **Homepage** - Hero section with featured products and newsletter signup
- **Collection** - Browse all products with filters and sorting
- **Product Detail** - Detailed product information with specifications and reviews
- **About** - Company mission, vision, values, and team information
- **Contact** - Contact form, business hours, and consultation booking

### Shopping Experience
- **Shopping Cart** - Add products, manage quantities, and view order summary
- **Checkout** - Multi-step checkout with shipping, payment, and confirmation

### Admin Panel
- **Admin Login** - Secure authentication (demo: admin@hpverse.com / admin123)
- **Admin Dashboard** - Overview of orders, products, and customers
- **Product Management** - View and manage product inventory
- **Order Management** - Track and manage customer orders

### AI Features
- **Chatbot** - 24/7 AI-powered customer service assistant integrated with OpenAI

### Technical Implementation
- **State Management** - Zustand stores for products, cart, and admin state
- **Data Persistence** - localStorage integration for cart and admin session
- **Design System** - Luxury aesthetic with custom color palette and typography
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Type Safety** - Full TypeScript support throughout the application

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm (or pnpm/yarn)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Access
- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email**: `admin@hpverse.com`
- **Password**: `admin123`

## Project Structure

```
/app
  /admin                 # Admin pages
  /api/chat             # AI chatbot API
  /cart                 # Shopping cart page
  /checkout             # Checkout flow
  /collection           # Product collection
  /product/[id]         # Product detail page
  /about                # About page
  /contact              # Contact page
  page.tsx              # Homepage

/components
  Header.tsx            # Main navigation
  Footer.tsx            # Footer
  ProductCard.tsx       # Product card component
  Chatbot.tsx           # AI chatbot widget
  /ui                   # shadcn/ui components

/store
  productStore.ts       # Product state management
  cartStore.ts          # Cart state management
  adminStore.ts         # Admin authentication state

/lib
  utils.ts              # Utility functions
```

## Key Technologies

- **Framework**: Next.js 16 with App Router
- **UI**: React 19 with Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **AI**: Vercel AI SDK 6 with OpenAI integration
- **Icons**: Lucide React
- **Typography**: Geist (sans) + Playfair Display (serif)
- **Form Handling**: React Hook Form + Zod validation

## Admin Access

### Demo Credentials
- **Email**: admin@hpverse.com
- **Password**: admin123

The admin credentials are stored in `store/adminStore.ts` for demo purposes. In production, implement proper authentication.

## Features in Detail

### Luxury Design System
- **Color Palette**: Cream background (#FAF8F3), deep charcoal text (#2a2a2a), gold accents (#B8860B)
- **Typography**: Serif headers (Playfair Display) with clean sans-serif body (Geist)
- **Spacing**: Generous whitespace for premium feel
- **Components**: Custom-styled components matching luxury aesthetic

### Shopping Cart
- Add/remove products with real-time quantity updates
- Persistent cart using Zustand + localStorage
- Order summary with tax calculation
- Multi-step checkout flow with validation

### AI Chatbot
- Available 24/7 on every page
- Trained to assist with product inquiries
- Recommends consultation bookings
- Responsive chat interface with typing indicators

### Admin Dashboard
- View sales statistics and recent orders
- Manage product inventory
- Track customer orders
- Responsive admin interface

## Customization

### Add More Products
Edit `store/productStore.ts` and add items to the `mockProducts` array.

### Modify Admin Credentials
Update `store/adminStore.ts` with new admin user accounts.

### Customize Design
Theme colors and fonts are defined in:
- `app/globals.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration
- `app/layout.tsx` - Font imports

### Extend AI Chatbot
Modify the system prompt in `app/api/chat/route.ts` to change chatbot behavior.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables if needed
4. Deploy with one click

```bash
vercel deploy
```

### Deploy Elsewhere

The project is fully static-compatible with Next.js and can be deployed to any Node.js hosting:

```bash
pnpm build
pnpm start
```

## Environment Variables

Optional environment variables for AI features:

```env
# AI SDK Configuration (Optional - uses Vercel AI Gateway by default)
NEXT_PUBLIC_AI_API_KEY=your_api_key_here
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

This project is created with v0 and is available for use and modification.

## Support

For questions or issues, visit the contact page or use the integrated chatbot for assistance.
