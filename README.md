
```markdown:d:\final\MedAssist\README.md
# MedAssist 🏥

A comprehensive HealthCare assistance platform built with React, Laravel, and FastAPI.

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- PHP and Composer
- Python 3.8+
- MySQL

## 🛠️ Installation & Setup

### Frontend (React)
```bash
npm install
npm run dev
```

### Backend (Laravel)
1. Install dependencies:
```bash
composer install
```

2. Database setup:
```bash
php artisan migrate
```

3. Start the server:
```bash
php artisan serve
```

4. Additional Laravel services:
```bash
# Create storage symlink for file uploads
php artisan storage:link

# Start queue worker
php artisan queue:work

# Run scheduler
php artisan schedule:run
```

### Python Backend (FastAPI)
1. Set up virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install fastapi uvicorn pdfplumber google-generativeai
```

3. Start the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## 🔧 Configuration
- Frontend runs on: `http://localhost:5173`
- Laravel Backend runs on: `http://localhost:8000`
- FastAPI Backend runs on: `http://localhost:8001`
