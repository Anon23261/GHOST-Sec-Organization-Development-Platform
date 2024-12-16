# 🌐 GHOST Sec Organization Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-purple)
![MariaDB](https://img.shields.io/badge/MariaDB-10.5%2B-orange)

## 🚀 Overview

Welcome to the GHOST Sec Organization Platform - a cutting-edge web platform focused on open-source operating system development and cybersecurity education. Our platform combines interactive learning with robust security features to create an engaging user experience.

## ✨ Features

### 🔐 User Authentication
- Secure login and registration system
- Password hashing and robust session management
- Responsive modal interface for seamless user experience

### 🎮 Interactive Games
- **OS Process Management Game**: Learn about operating system concepts through interactive JavaScript gameplay
- **Kernel Defender**: An exciting C++ game built with SFML graphics library
- Educational content wrapped in engaging gameplay

### 📬 Contact System
- Direct communication channels
- Secure message handling
- Real-time email notifications

## 🛠️ Technology Stack

- **Frontend**:
  - HTML5, CSS3 with Flexbox & Grid
  - Modern JavaScript (ES6+)
  - Responsive Design

- **Backend**:
  - PHP 7.4+
  - MariaDB 10.5+
  - Composer Package Manager

- **Libraries & Dependencies**:
  - PHPMailer for email functionality
  - SFML for C++ game graphics
  - dotenv for environment management

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd ghost-sec-platform
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Set up the database**
   ```bash
   sudo mysql -e "source backend/database.sql"
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development server**
   ```bash
   php -S localhost:8000
   ```

## 🔧 Configuration

### Database Settings
```env
DB_HOST=localhost
DB_NAME=ghost_sec_db
DB_USER=root
DB_PASS=your_password
```

### SMTP Configuration
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ghostsector@icloud.com
SMTP_PASS=your_app_password
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Email: ghostsector@icloud.com
- Phone: 480-235-3187

## 🌟 Acknowledgments

- SFML Development Team
- MariaDB Community
- PHP Community
- All our contributors and supporters

---

<p align="center">Made with ❤️ by GHOST Sec Organization</p>
