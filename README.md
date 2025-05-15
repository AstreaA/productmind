# ProductMind

A platform for learning product management.

## Features

- User authentication (login/register)
- Course listings
- User profiles
- Interactive learning content

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Modern browser with IndexedDB support

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd productmind
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses **IndexedDB** for client-side data storage with the following structure:

### Users Store
```
{
  id: auto-increment,
  name: string,
  email: string (indexed, unique),
  password: string (hashed),
  created_at: date
}
```

## Authentication

The application uses client-side authentication:
- User credentials are stored in IndexedDB
- Passwords are hashed using bcrypt
- Authentication state is tracked using localStorage
- Protected routes are managed by client-side redirects

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
