# 📚 Professional Library Management System (LMS)

![Project Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)

A fully functional, responsive **Single Page Application (SPA)** designed to manage library operations efficiently. This project simulates a real-world library environment with features like book inventory management, student issuance tracking, and real-time dashboard statistics.

## 🔗 Live Demo
**[Click Here to Visit the Live Website](https://shriramsuryavanshi422-cyber.github.io/Library-Management-System/)**

---

## 🔑 Login Credentials
To access the dashboard, use the administrator password:
- **Password:** `admin123`

---

## ✨ Key Features

### 1. 🔒 Secure Authentication
- Password-protected entry to prevent unauthorized access.
- Professional login overlay with validation logic.

### 2. 📊 Dynamic Dashboard
- Real-time statistics showing:
  - **Total Books** in inventory.
  - **Books Issued** to students.
  - **Available Books** currently on shelves.

### 3. 📖 Book Management (Inventory)
- **Add Books:** Input ID, Title, Author, and Quantity.
- **Search:** Filter books instantly by Name or ID.
- **Delete:** Remove outdated records from the database.
- **Auto-Save:** All data is saved to `localStorage`, so data persists even after refreshing the page.

### 4. 🔄 Circulation System (Issue & Return)
- **Issue Books:** Checks availability before issuing. Tracks which student holds the book.
- **Return Books:** Automatically updates inventory count upon return.
- **Validation:** Prevents issuing "Out of Stock" books or returning non-issued books.

### 5. 💾 Data Persistence & Export
- **Local Storage:** Acts as a client-side database.
- **Backup:** One-click "Save to Text File" feature to download the entire library database as a `.txt` report.

---

## 🛠️ Technologies Used
* **HTML5:** Semantic structure and layout.
* **CSS3:** Custom styling, Flexbox/Grid for responsiveness, and hidden/visible tab logic.
* **JavaScript (Vanilla):** DOM manipulation, CRUD operations, Search logic, and LocalStorage management.

---

## 📸 Screenshots

### Login Screen
<img width="1880" height="888" alt="image" src="https://github.com/user-attachments/assets/4ebe41af-a7c1-455b-ae9e-7f16840263df" />


### Dashboard Overview
<img width="1763" height="844" alt="image" src="https://github.com/user-attachments/assets/6f915fb5-326c-4e35-9cfe-5952ad6f15f1" />


---

## 🚀 How to Run Locally

If you want to run this project on your own machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/shriramsuryavanshi422-cyber/Library-Management-System.git](https://github.com/shriramsuryavanshi422-cyber/Library-Management-System.git)
    ```
2.  **Navigate to the project folder**
    ```bash
    cd Library-Management-System
    ```
3.  **Launch**
    - Simply open the `index.html` file in any modern web browser.

---

## 👤 Author
**Shriram Suryavanshi**
- **GitHub:** [shriramsuryavanshi422-cyber](https://github.com/shriramsuryavanshi422-cyber)
