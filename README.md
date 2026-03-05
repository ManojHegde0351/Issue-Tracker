# Issue Tracker

A full-stack issue tracking application built with Angular and Flask.

## Features

- Create, read, update, and delete issues
- Filter and sort issues by status, priority, and assignee
- Responsive design for desktop and mobile
- Real-time updates

## Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- npm (v6 or later)
- pip (v21 or later)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the project root directory:
   ```bash
   cd ..
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Application Flow

### 🔹 User Journey (Updated Flow)

1. **Landing Page** → Clean welcome page with features overview
2. **Register** → Create new account with role selection (User, Admin, Manager)
3. **Login** → Sign in with registered credentials
4. **Dashboard** → Shows list of issues with filters/search
5. **Create Issue** → User fills form: title, description, priority, assignee, category
6. **View Issue** → Click issue → detailed page with status, comments, history
7. **Update Issue** → Edit details, change status, add comments via edit overlay
8. **Admin Flow** (optional) → Manage users, roles, permissions
9. **Logout** → Return to landing page

### 🎯 Key Features

- **Authentication System** - Register and login with role-based access
- **Clean Dashboard** - Modern card-based issue display
- **Real-time Editing** - Inline edit overlay with live preview
- **Light Theme** - Clean, professional light theme throughout
- **Responsive Design** - Works on all devices
- **Professional UI** - Modern design with smooth interactions

## Development

To start both the frontend and backend servers with a single command, run:

```bash
npm run dev
```

This will start both servers in separate terminal windows and open the application in your default browser.

## Project Structure

```
issue-tracker/
├── backend/                  # Backend Flask application
│   ├── app.py               # Main Flask application
│   ├── model.py             # Database models
│   └── requirements.txt     # Python dependencies
├── src/                     # Frontend Angular application
│   ├── app/                 # Application code
│   │   ├── components/      # Angular components
│   │   ├── services/        # Angular services
│   │   └── app.module.ts    # Root module
│   ├── assets/              # Static assets
│   ├── environments/        # Environment configurations
│   ├── index.html           # Main HTML file
│   └── styles.css           # Global styles
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## API Endpoints

- `GET /api/issues` - Get all issues
- `GET /api/issues/<id>` - Get a specific issue
- `POST /api/issues` - Create a new issue
- `PUT /api/issues/<id>` - Update an existing issue

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
