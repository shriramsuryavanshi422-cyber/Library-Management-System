// --- 1. INITIAL SETUP ---
// Load books from memory or start with empty list
let books = JSON.parse(localStorage.getItem('myLibraryBooks')) || [];

// Select HTML elements
const bookList = document.getElementById('book-list');
const bookForm = document.getElementById('book-form');
const searchInput = document.getElementById('search-input');

// --- 2. DISPLAY FUNCTIONS ---
function renderBooks(filterText = '') {
    bookList.innerHTML = ''; // Clear table
    
    let activeCount = 0;
    let issuedCount = 0;
    let overdueCount = 0;

    books.forEach((book, index) => {
        // Filter Logic (Search)
        const match = book.title.toLowerCase().includes(filterText) || 
                      book.student.toLowerCase().includes(filterText) ||
                      book.id.toLowerCase().includes(filterText);

        if (match) {
            // Count Stats
            if(book.status === 'Available') activeCount++;
            if(book.status === 'Issued') issuedCount++;
            if(book.status === 'Overdue') overdueCount++;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.student}</td>
                <td>${book.date}</td>
                <td>
                    <span class="status-badge ${getStatusClass(book.status)}">
                        ${book.status}
                    </span>
                </td>
                <td>
                    <button class="btn-edit" onclick="editBook(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteBook(${index})">Delete</button>
                </td>
            `;
            bookList.appendChild(row);
        }
    });

    // Update Dashboard Numbers
    document.getElementById('total-books-count').innerText = books.length;
    document.getElementById('issued-books-count').innerText = issuedCount;
    document.getElementById('overdue-books-count').innerText = overdueCount;
}

// Helper to get color for status
function getStatusClass(status) {
    if (status === 'Available') return 'status-active'; // Reusing green class
    if (status === 'Issued') return 'status-active'; // You can add yellow in CSS if you want
    return 'status-overdue';
}

// --- 3. ADD / UPDATE BOOK LOGIC ---
bookForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const editIndex = document.getElementById('edit-index').value;
    const title = document.getElementById('book-title').value;
    const student = document.getElementById('student-name').value;
    const date = document.getElementById('issue-date').value;
    const status = document.getElementById('book-status').value;

    if (editIndex === "-1") {
        // CREATE NEW
        const newBook = {
            id: 'BK' + Math.floor(Math.random() * 10000),
            title, student, date, status
        };
        books.push(newBook);
    } else {
        // UPDATE EXISTING
        books[editIndex].title = title;
        books[editIndex].student = student;
        books[editIndex].date = date;
        books[editIndex].status = status;
        
        // Reset Form to "Add Mode"
        document.getElementById('edit-index').value = "-1";
        document.getElementById('form-btn').innerText = "+ Add Book";
        document.getElementById('form-title').innerText = "Add New Book";
    }

    saveAndRender();
    bookForm.reset();
});

// --- 4. EDIT FUNCTION ---
function editBook(index) {
    // 1. Switch to Books tab if not already there (optional but good UI)
    showSection('books-section', document.querySelectorAll('.nav-link')[1]);

    // 2. Fill the form with the book's data
    const book = books[index];
    document.getElementById('book-title').value = book.title;
    document.getElementById('student-name').value = book.student;
    document.getElementById('issue-date').value = book.date;
    document.getElementById('book-status').value = book.status;

    // 3. Set Form to "Edit Mode"
    document.getElementById('edit-index').value = index;
    document.getElementById('form-btn').innerText = "Update Book";
    document.getElementById('form-title').innerText = "Edit Book Details";
    
    // 4. Scroll to form
    document.querySelector('.add-book-container').scrollIntoView({behavior: 'smooth'});
}

// --- 5. DELETE FUNCTION ---
function deleteBook(index) {
    if(confirm('Are you sure you want to delete this book?')) {
        books.splice(index, 1);
        saveAndRender();
    }
}

// --- 6. SEARCH FUNCTION ---
searchInput.addEventListener('input', (e) => {
    renderBooks(e.target.value.toLowerCase());
});

// --- 7. TAB SWITCHING LOGIC ---
function showSection(sectionId, linkElement) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');

    // Update active link styling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    linkElement.classList.add('active');
}

// --- 8. SAVE & LOAD ---
function saveAndRender() {
    localStorage.setItem('myLibraryBooks', JSON.stringify(books));
    renderBooks();
}

// Initial Render
renderBooks();

