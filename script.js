// --- CONFIGURATION ---
const ADMIN_PASSWORD = "admin123"; // Set your password here

// --- STATE MANAGEMENT ---
// Load books from memory, or start with an empty library
let books = JSON.parse(localStorage.getItem('library_db')) || [];

// --- 1. LOGIN SYSTEM ---
const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page refresh
    
    if (passwordInput.value === ADMIN_PASSWORD) {
        // Success: Hide Login, Show App
        loginContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        renderDashboard(); // Update stats immediately
    } else {
        // Error: Show error message
        loginError.style.display = 'block';
        passwordInput.value = ''; // Clear input
    }
});

function logout() {
    location.reload(); // Reloads page to lock it again
}

// --- 2. TAB NAVIGATION ---
function switchTab(tabName) {
    // 1. Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });

    // 2. Remove 'active' class from all sidebar links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // 3. Show the specific tab and highlight link
    document.getElementById('tab-' + tabName).classList.remove('hidden');
    
    // 4. Highlight the correct sidebar button
    const activeLink = document.querySelector(`li[onclick="switchTab('${tabName}')"] .nav-link`);
    if(activeLink) activeLink.classList.add('active');

    // 5. Update Header Title
    const titles = {
        'dashboard': 'Dashboard Overview',
        'manage': 'Manage Library Books',
        'issue': 'Issue Book to Student',
        'return': 'Return Book'
    };
    document.getElementById('page-title').innerText = titles[tabName];
    
    // 6. Refresh data if needed
    if(tabName === 'dashboard') renderDashboard();
    if(tabName === 'manage') renderTable();
}

// --- 3. DASHBOARD LOGIC ---
function renderDashboard() {
    const total = books.length;
    const issued = books.filter(b => b.status === 'Issued').length;
    const available = total - issued;

    document.getElementById('total-books').innerText = total;
    document.getElementById('issued-books').innerText = issued;
    document.getElementById('avail-books').innerText = available;
}

// --- 4. MANAGE BOOKS (ADD/DELETE) ---
const addBookForm = document.getElementById('add-book-form');
const tableBody = document.getElementById('book-table-body');

// Add Book
addBookForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('new-book-title').value;
    const id = document.getElementById('new-book-id').value;

    // Validation: Check if ID exists
    if (books.find(b => b.id === id)) {
        alert('Error: A book with this ID already exists!');
        return;
    }

    // Add to array
    books.push({
        id: id,
        title: title,
        status: 'Available',
        holder: '-'
    });

    saveData();
    renderTable(); // Refresh table
    addBookForm.reset(); // Clear form
    alert('Book Added Successfully');
});

// Delete Book
function deleteBook(index) {
    if(confirm('Are you sure you want to delete this book?')) {
        books.splice(index, 1);
        saveData();
        renderTable();
    }
}

// Render Table
function renderTable() {
    tableBody.innerHTML = ''; // Clear current table
    
    books.forEach((book, index) => {
        const row = document.createElement('tr');
        
        // Color code status
        const statusColor = book.status === 'Available' ? 'green' : 'red';
        
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td style="color:${statusColor}; font-weight:bold;">${book.status}</td>
            <td>${book.holder}</td>
            <td>
                <button class="btn-delete" onclick="deleteBook(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- 5. ISSUE BOOK LOGIC ---
document.getElementById('issue-book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('issue-id').value;
    const student = document.getElementById('issue-student').value;
    const message = document.getElementById('issue-message');

    const book = books.find(b => b.id === id);

    if (!book) {
        setStatus(message, "Error: Book ID not found.", "red");
    } else if (book.status === 'Issued') {
        setStatus(message, `Error: Book is already issued to ${book.holder}.`, "red");
    } else {
        // Perform Issue
        book.status = 'Issued';
        book.holder = student;
        saveData();
        setStatus(message, "Success: Book issued successfully!", "green");
        this.reset();
    }
});

// --- 6. RETURN BOOK LOGIC ---
document.getElementById('return-book-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('return-id').value;
    const message = document.getElementById('return-message');

    const book = books.find(b => b.id === id);

    if (!book) {
        setStatus(message, "Error: Book ID not found.", "red");
    } else if (book.status === 'Available') {
        setStatus(message, "Error: This book is already in the library.", "orange");
    } else {
        // Perform Return
        book.status = 'Available';
        book.holder = '-';
        saveData();
        setStatus(message, "Success: Book returned to library.", "green");
        this.reset();
    }
});

// --- HELPER FUNCTIONS ---
function saveData() {
    localStorage.setItem('library_db', JSON.stringify(books));
    renderDashboard(); // Update stats whenever data changes
}

function setStatus(element, text, color) {
    element.innerText = text;
    element.style.color = color;
    // Clear message after 3 seconds
    setTimeout(() => { element.innerText = ''; }, 3000);
}

// Initial Load
renderDashboard();
