# Shortify - URL Shortener Service

Shortify is a full-stack URL shortening service that allows users to create, manage, and track shortened URLs with expiration dates and click analytics.

## Features

- Create custom short URLs
- Set expiration dates for URLs
- Track click analytics
- Toggle URL activation status
- Light/dark theme support
- User authentication system
- Responsive design

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- [Boxicons](https://boxicons.com/) for icons

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication

### Deployment
- Hosted on [Render](https://render.com)

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sohaibalidev/Shortify.git
cd Shortify
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your configuration:
```env
MONGODB_URI = 
DB_NAME = 

JWT_SECRET = 
JWT_EXPIRES_IN = 1d

EMAIL_SERVICE = gmail
EMAIL_USERNAME = 
EMAIL_PASSWORD = 

NODE_ENV = development
```

4. Start the development server:
```bash
npm start
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/urls` | GET | Get user's URLs |
| `/api/urls` | POST | Create new short URL |
| `/api/urls/:id` | PUT | Update URL (activate/deactivate) |
| `/api/urls/:id` | DELETE | Delete URL |
| `/u/:shortId` | GET | Redirect to original URL |

## Live Demo

Try the live version at: [https://sfy.onrender.com](https://sfy.onrender.com)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


Project Link: [https://github.com/sohaibalidev/Shortify](https://github.com/sohaibalidev/Shortify)