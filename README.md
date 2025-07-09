# SocTeamUp Website

A modern, responsive website for SocTeamUp - an integrated circuit design and consulting company.

## 🚀 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **User Authentication**: Login system with role-based access control
- **User Dashboard**: Personalized dashboard for regular users
- **Admin Dashboard**: Comprehensive admin panel with real-time metrics
- **Developer Section**: Resources and documentation for developers
- **Contact System**: Contact form with backend integration
- **Settings Management**: User profile and preferences management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel, Netlify, or AWS

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/socteamup-website.git
cd socteamup-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Demo Credentials

### Regular User
- **Email**: demo@socteamup.com
- **Password**: password123

### Admin User
- **Email**: admin@socteamup.com
- **Password**: admin123456

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

## 🏗️ Project Structure

```
socteamup-website/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── contact/           # Contact page
│   │   ├── dashboard/         # User dashboard
│   │   ├── developers/        # Developer resources
│   │   ├── login/             # Login page
│   │   └── settings/          # Settings page
│   ├── components/            # Reusable components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   └── lib/                  # Utility functions
├── public/                   # Static assets
├── lambda/                   # AWS Lambda functions
└── content/                  # Developer documentation
```

## 🌟 Key Features

### Authentication System
- Role-based access control (User/Admin)
- Mock authentication for development
- Secure token-based sessions

### User Dashboard
- Welcome section with user info
- Quick action cards
- Recent activity tracking
- Profile information display

### Admin Dashboard
- Real-time metrics and analytics
- User management capabilities
- System monitoring
- Activity logs

### Developer Resources
- Comprehensive documentation
- Downloadable tools and SDKs
- Code examples and tutorials
- Version-controlled content

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

### Manual Build
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Build Configuration
The project uses Next.js 15 with:
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality

## 📞 Support

- **Website**: [https://socteamup.com](https://socteamup.com)
- **Email**: contact@socteamup.com
- **Documentation**: Available in `/developers` section

## 📄 License

© 2024 SocTeamUp. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ by the SocTeamUp team**
