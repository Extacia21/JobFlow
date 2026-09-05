# 🚀 JobFlow

### Career Command Center — Track. Organize. Advance.

JobFlow is a modern job application management platform designed to help job seekers organize their job search, monitor application progress, manage interviews, and understand their career-search performance from one centralized workspace.

Instead of managing applications across spreadsheets, notes, emails, and bookmarks, JobFlow brings the entire job-search journey into one professional dashboard.

---

## 📊 Dashboard

The JobFlow dashboard provides a centralized overview of your entire job search.

![JobFlow Dashboard](screenshots/dashboard.png)

From the dashboard, users can quickly see:

- Total applications
- Applications sent
- Upcoming interview opportunities
- Offers received
- Application pipeline
- Application distribution
- Career funnel
- Application performance
- Overall job-search progress

---

## ✨ Features

### 📈 Smart Dashboard

Get an instant overview of your job search with:

- Application statistics
- Pipeline visualization
- Application distribution charts
- Career funnel
- Performance indicators
- Quick access to important actions

---

### 💼 Application Management

Keep every job opportunity organized in one place.

Track information such as:

- Company
- Position
- Location
- Salary
- Job URL
- Application date
- Current status
- Personal notes

Supported application statuses include:

`Saved → Applied → Screening → Interview → Offer`

with additional support for:

`Rejected`

---

### 🗂️ Application Pipeline

Manage applications through a visual pipeline.

Move opportunities between stages as they progress through the recruitment process.

Pipeline stages include:

- ⭐ Saved
- 📤 Applied
- 🔍 Screening
- 🎯 Interview
- 🏆 Offer
- ❌ Rejected

The pipeline is designed to give users a clear picture of where every application currently stands.

---

### 🎯 Interview Tracking

Keep interview opportunities visible and organized.

JobFlow provides a dedicated space for monitoring applications that have reached the interview stage.

---

### 📊 Analytics

Understand the performance of your job search through visual analytics.

JobFlow provides insights into:

- Application volume
- Application status distribution
- Pipeline performance
- Interview conversion
- Offer conversion
- Application activity
- Overall career-search performance

---

### 🔖 Saved Jobs

Keep promising opportunities available for later.

Users can save jobs before deciding to apply and manage them separately from active applications.

---

### ⚙️ Settings

JobFlow includes a dedicated settings area for managing workspace preferences such as:

- Notification preferences
- Application reminders
- Interview reminders
- Job-search preferences
- Default application status
- Application export

---

### 🆘 Help Center

The built-in Help Center provides guidance for using the platform, including:

- Getting started
- Adding jobs
- Using the application pipeline
- Understanding analytics
- Managing applications
- Managing interviews
- Frequently asked questions

---

## 🛠️ Technology Stack

JobFlow is built using modern web technologies.

### Backend

- Python
- Django
- Django ORM
- SQLite during development

### Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js
- Responsive UI design

### Development Tools

- Git
- GitHub
- Visual Studio Code / PyCharm
- Python Virtual Environment

---

## 🏗️ Project Structure

```text
JobFlow/
│
├── jobs/
│   ├── migrations/
│   ├── templates/
│   │   └── jobs/
│   │       ├── base.html
│   │       ├── dashboard.html
│   │       ├── applications.html
│   │       ├── pipeline.html
│   │       ├── analytics.html
│   │       ├── interviews.html
│   │       ├── add_job.html
│   │       ├── edit_job.html
│   │       ├── job_detail.html
│   │       ├── settings.html
│   │       └── help.html
│   │
│   ├── admin.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── static/
│   ├── css/
│   │   └── jobflow.css
│   │
│   └── js/
│       └── jobflow.js
│
├── templates/
│
├── screenshots/
│   └── dashboard.png
│
├── manage.py
├── requirements.txt
└── README.md<img width="1858" height="962" alt="dashboard" src="https://github.com/user-attachments/assets/88b85992-99b8-4932-b364-fd9e678a91dc" />
