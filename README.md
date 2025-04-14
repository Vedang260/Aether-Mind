# AetherMind - ✨ AI-Powered 🧠 Knowledge Management System 🚀

**AetherMind** is a modern AI-Powered Knowledge Management System which allows Viewers to improve their knowledge by reading the articles of their choice. Provides them the ability to rate the articles based on their thoughts for the article's content.

## 🌟 Features

### 👨‍🎓 Viewer Features
- 📑 Can Read the Articles to improve their knowledge.
- ⭐ Rate the articles based on their experience.
- 💭 Can express their thougts in the form of comments.
- 🔍 Can search the Articles based on the title, content, tags & categories.
  
### 👨‍🏫 Editor Features
- ➕ Create and publish new Articles
- ✏️ Edit Article details

### 🛠️ Admin Features
- 👥 User management
- 🏷️ Article Categorization
- 📊 Platform Analytics Dashboard
- 📈 Article-wise Analytics Dashboard
- ➕ Create and publish new Articles
- ✏️ Edit Article details
- 🚮 Delete the Article
- 🎭 Category Management

### ✨ AI Features
- ➕ Create and publish new Articles using AI.
- 🏷️ Auto generate Tags for the article.
- 🧾 Summary of the Long Articles

## 🛠️ Tech Stack

### Frontend
- **Angular**: A platform for building web applications.
- **TypeScript**: Superset of JavaScript for type safety and better tooling.
- **RxJS**: Reactive programming library for handling asynchronous events and data streams.

### Backend
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Hugging Face API**: To implement AI based Features.
- **JWT Authentication**: JSON Web Tokens for secure authentication using Passport.
- **PassportJS**: Middleware for handling authentication in Node.js.
- **TypeORM**: ORM for interacting with the database (MySQL/PostgreSQL).
- **PostgreSQL**: Database used to store product and user data.

## Setup Instructions
 
### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
 
### Backend Setup
 
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
 
2. Install dependencies:
   ```bash
   npm install
   ```
 
3. Create a `.env` file in the backend directory with the following variables:
   ```
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=neoLearn
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1h
   ```
 
4. Start the development server:
   ```bash
   npm run start:dev
   ```
 
5. The backend API will be available at http://localhost:8000
 
 
### Frontend Setup
 
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Aether-Mind.git
   cd Aether-Mind/frontend
   
2. **Install the dependencies**:
   ```bash
   npm install

3. **Run the Angular Application**
   ```bash
   ng server
 
## API Documentation
 
The complete API documentation is available on Postman:
[Aether Mind API Documentation](https://documenter.getpostman.com/view/26606017/2sB2ca5zBR)
 
 
# 📽️ Aether Mind - Demo Video  
 
Watch the demo of the **Aether Mind**:  
🔗 **Part-1 : [Click here to watch the demo](https://drive.google.com/file/d/1Q96DymjkJRGchAAnXvjNQAe8jjS1jNHc/view)**  
🔗 **Part-2 : [Click here to watch the demo](https://drive.google.com/file/d/19lKHExAJ6YaXVoowEHXqz-DLOCNCN2gj/view)**  
