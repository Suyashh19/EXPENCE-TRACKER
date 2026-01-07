# 💰 Expense Tracker (AI-Powered)

A modern, responsive web application for tracking personal expenses. The AI-powered Expense Tracker allows users to securely record expenses, automatically categorize transactions, and generate smart spending insights using Google Gemini AI, with backend services powered by Firebase.

---

## 📖 Description

Expense Tracker (AI-Powered) is a modern, responsive web application designed to help users track and analyze their personal expenses efficiently. Built using React, Firebase (Spark Plan), and Google Gemini AI, the application allows users to securely record expenses, automatically categorize transactions, and gain AI-generated insights into their spending behavior.

The platform supports real-time data storage using Firebase Firestore, secure authentication via Firebase Auth. AI integration enables smart expense categorization and personalized financial insights, helping users make informed financial decisions.

---

## ✨ Features

- **Add & Manage Expenses**: Record expenses with amount, category, date, and description  
- **AI-Based Expense Understanding**: Natural language expense inputs (e.g., “Spent 300 on groceries yesterday”)  
- **Smart Categorization**: AI-assisted automatic category detection  
- **Dashboard Overview**: Quick snapshot of today’s spending, total expenses, and recent activity  
- **Analytics & Insights**: AI-generated summaries explaining spending trends in simple language  
- **Transaction History**: View and delete previous transactions  
- **Secure Authentication**: User login using Firebase Authentication  
- **Real-time Updates**: Instant UI updates after adding or deleting expenses  
- **Responsive Design**: Optimized for all screen sizes  
- **Clean UI/UX**: Modern glassmorphism-based interface  
- **Cloud Data Storage**: Expense data securely stored using Firebase Firestore   
- **Session Persistence**: Users remain logged in across page refreshes     
- **Secure Firestore Rules**: Backend access protected with Firestore security rules  
- **Fast Client-Side Rendering**: Smooth performance with minimal load times  
- **AI Fallback Handling**: Graceful handling when AI responses are unavailable

---

## 🛠️ Tech Stack

This project leverages the following technologies:

- **Frontend**: React (JavaScript ES6+)  
- **Build Tool**: Vite  
- **Styling**: Tailwind CSS  
- **Authentication**: Firebase Authentication  
- **Database**: Firebase Cloud Firestore (NoSQL)  
- **AI Integration**: Google Gemini API  
- **Linting**: ESLint  
- **Deployment**: Firebase Hosting  

- **State Management**: React Hooks & Context API  
- **Backend Services**: Firebase SDK  
- **Real-time Data Sync**: Firestore real-time listeners   
- **Security**: Firestore Security Rules  
- **Version Control**: Git & GitHub  
- **Package Manager**: npm  
- **Hosting Plan**: Firebase Spark Plan (Free Tier)  
 

---

## 🌐 Deployed Link

🔗 **Live Demo:**  

https://expense-tracker-1869c.web.app

---

## 🚀 Installation Instructions

### Prerequisites

- Node.js (v14 or higher)  
- npm or yarn  
- Git  

### Clone the Repository

```bash
git clone https://github.com/Suyashh19/EXPENCE-TRACKER.git
cd EXPENCE-TRACKER
Install Dependencies
npm install

Run Development Server
npm run dev
```

## 🤖 AI & Gemini Integration

- **Natural Language Expense Parsing**  
  Example:  
Spent 450 on pizza at Domino’s yesterday

Gemini extracts **amount, category, and date** automatically.

- **Smart Categorization**  
AI predicts the correct expense category from the description.

- **AI Financial Insights**  
Monthly summaries like:  
You spent 18% more this month, mainly on food expenses.



- **Context-Aware Advice (Future Ready)**  
Personalized budgeting suggestions based on spending history.

Gemini runs securely on the backend, ensuring **privacy and cost control**.

## 📁 Project Structure

```
EXPENCE-TRACKER/
│
├── public/                 # Static assets
│   └── ...
│
├── src/                    # Source files
│   ├── components/           # Reusable UI components
│   ├── pages/                  
│   ├── services/           
│   ├── utils/             # Utility functions
│   ├── main.jsx            # Application entry point
│   └── ...
│
├── index.html             # Main HTML file
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked versions of dependencies
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation (this file)
```

### Key Files and Directories

- **`src/main.js`**: Entry point of the application, initializes the app
- **`src/components/`**: Contains reusable components like forms, transaction items, etc.
- **`src/styles/`**: CSS files for styling the application
- **`src/utils/`**: Helper functions for data manipulation and storage
- **`index.html`**: The main HTML template
- **`vite.config.js`**: Vite build tool configuration
- **`package.json`**: Lists all project dependencies and npm scripts

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**: Click the "Fork" button at the top right of this page

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/EXPENCE-TRACKER.git
   cd EXPENCE-TRACKER
   ```

3. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**: Implement your feature or bug fix

5. **Test Your Changes**: Ensure everything works as expected
   ```bash
   npm run dev
   ```

6. **Commit Your Changes**:
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```

7. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**: Go to the original repository and click "New Pull Request"

### Contribution Guidelines

- Write clear, concise commit messages
- Follow the existing code style and conventions
- Test your changes thoroughly before submitting
- Update documentation if you're adding new features
- Be respectful and constructive in discussions

## 👥 Contributors

This project was built by:

- [Suyash Patil](https://github.com/Suyashh19)
- [Tanuja Saravale](https://github.com/TaNuJaSaRaVale)
- [VIRAJ261-cloud](https://github.com/VIRAJ261-cloud)

## 📄 License

This project is licensed under the **MIT License**.

### MIT License

```
Copyright (c) 2024 Suyash Patil, Tanuja Saravale, VIRAJ261-cloud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🌟 Acknowledgments

- Built for the **TechSpring Hackathon**
- Thanks to all contributors and supporters
- Inspired by the need for simple, effective personal finance management

## 📞 Support

If you encounter any issues or have questions:

- Open an [Issue](https://github.com/Suyashh19/EXPENCE-TRACKER/issues)
- Contact the maintainers through GitHub
- Check existing issues before creating a new one

## 🔮 Future Enhancements

Potential features for future versions:

- Data export functionality in PDF  
- Recurring transaction support
- Dark mode theme
- Cloud backup and sync
- Mobile app versions
- Responsive UI

---

**Made with ❤️ for TechSpring Hackathon**

If you find this project useful, please consider giving it a ⭐ on GitHub!

