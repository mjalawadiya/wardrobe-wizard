# 👗✨ Wardrobe Wizard

**Wardrobe Wizard** is an innovative MERN-based e-commerce platform that combines the latest in weather data integration, personalized fashion recommendations, and virtual try-on experiences using Python-based image processing. Designed with usability and creativity in mind, this application transforms the way users shop for clothing online.

![Wardrobe Wizard Banner](https://via.placeholder.com/1000x300?text=Wardrobe+Wizard)

---

## 🌐 Live Demo

🚧 Coming Soon

---

## 📦 Tech Stack

- **Frontend:** React, JavaScript, CSS, HTML
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Weather Integration:** External Weather API
- **Virtual Try-On:** Python Server using OpenCV/Image Processing

---

## 🔥 Features

### 🛍️ E-commerce Platform
- Secure registration/login with JWT
- Product catalog with categories, filters & search
- Add to cart, wishlist, and checkout functionality
- Persistent cart, order history, address management

### 🌦️ Weather-Based Recommendations
- Real-time weather integration via API
- Product suggestions based on local forecast
- Personalized styling based on browsing history

### 🧥 Virtual Try-On (Python Server)
- Upload an image and try on clothes virtually
- Integrated via a Python backend service

### 🔒 Security
- Bcrypt for password encryption
- CSRF & XSS protection
- Tokenized payment handling

---

## 📁 Project Structure

WardrobeWizard/ 
├── client/ # React frontend 
├── server/ 
   ├── python_server/ # Virtual Try-On backend 
   └── server.js # Node backend entry point 
│
├── README.md 
│

---

## 🛠️ Installation & Running the Project

Make sure you have **Node.js**, **npm**, **Python 3**, and **MongoDB** installed.

### 1️⃣ Clone the Repository

- git clone https://github.com/mjalawadiya/wardrobe-wizard.git
- cd wardrobe-wizard

### 2️⃣ Run the Python Virtual Try-On Server
- cd server/python_server
- python app.py
📍 Ensure dependencies like flask, opencv-python, etc., are installed.

### 3️⃣ Run the Node.js Backend Server
- cd ../
- node server.js
✅ Make sure MongoDB is running locally or update connection URI in the backend config.

### 4️⃣ Run the React Frontend
- cd ../client
- npm install
- npm start
🚀 The frontend will run at http://localhost:3000

✅ Testing Strategy
- Unit Tests: React Testing Library + Jest

- Integration Tests: Cypress

- API Tests: Postman collections

- Performance: Lazy loading, image optimization

🔗 GitHub Repository
🔗 https://github.com/mjalawadiya/wardrobe-wizard/tree/ammar-vton

**“Fashion meets function — Your personalized wardrobe experience, reimagined.”**
