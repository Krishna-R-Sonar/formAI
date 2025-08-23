# FormAI - AI-Powered Form Creation Platform

FormAI is a full-stack web application that leverages artificial intelligence to create, manage, and analyze forms. Built with React, Node.js, and MongoDB, it features AI-powered form generation, conversational form filling, intelligent insights, and spam detection.

## 🚀 Features

### AI-Powered Form Creation
- Generate forms instantly from natural language prompts
- Smart question type inference (text, MCQ, checkbox, dropdown, file, rating)
- AI-powered question improvement for clarity and engagement

### Conversational Forms
- Adaptive question flow based on previous answers
- AI rephrasing for better user engagement
- Progress tracking and dynamic navigation

### Intelligent Analytics
- AI-powered response analysis and insights
- Sentiment analysis and keyword extraction
- Trend identification and anomaly detection
- Interactive charts and data visualization

### Security & Compliance
- JWT authentication with rate limiting
- AI-powered spam detection
- Customizable data retention policies
- Role-based access control

### Modern UI/UX
- Responsive design with Tailwind CSS
- Drag-and-drop form builder
- QR code generation for easy sharing
- Real-time notifications and feedback

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** for intelligent features
- **JWT** for authentication
- **Rate limiting** and security middleware
- **Cron jobs** for automated data cleanup

### Frontend
- **React 19** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Drag & Drop** functionality
- **Hotkeys** and accessibility features

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Google Gemini API key
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd formai
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/formai?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
```

### 4. Start the Application
```bash
# Development mode (runs both backend and frontend)
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account or use local MongoDB
2. Create a new database named `formai`
3. Update the `MONGODB_URI` in your `.env` file

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### JWT Secret
Generate a strong, random string for your JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📱 Usage

### 1. User Registration & Authentication
- Register with email and password
- Login to access the dashboard
- Secure JWT-based authentication

### 2. Form Creation
- Use AI prompts to generate forms automatically
- Manually create forms with the drag-and-drop builder
- Customize themes, colors, and branding

### 3. Form Management
- Edit existing forms
- View and analyze responses
- Export data to CSV format
- Share forms via QR codes or direct links

### 4. AI Features
- **Form Generation**: Describe your form in natural language
- **Question Improvement**: AI suggests better question phrasing
- **Insights**: Get AI-powered analysis of responses
- **Spam Detection**: Automatic filtering of suspicious submissions

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse of authentication endpoints
- **Input Validation**: Server-side validation of all inputs
- **SQL Injection Protection**: Mongoose ODM with parameterized queries
- **XSS Protection**: Content Security Policy and input sanitization
- **CORS Configuration**: Controlled cross-origin resource sharing

## 📊 Data Management

- **Retention Policies**: Configurable data retention periods
- **Automated Cleanup**: Daily cron job for expired data removal
- **Export Functionality**: CSV export for data portability
- **Privacy Controls**: User-level data isolation

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Ensure MongoDB connection is accessible
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `build` folder to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation and examples
- Review the code comments for implementation details

## 🔮 Future Enhancements

- **Multi-language Support**: Internationalization for global users
- **Advanced Analytics**: Machine learning insights and predictions
- **Integration APIs**: Webhook support and third-party integrations
- **Mobile App**: React Native mobile application
- **Real-time Collaboration**: Multi-user form editing
- **Advanced AI Models**: Support for multiple AI providers

---

**FormAI** - Transforming form creation with the power of artificial intelligence.
