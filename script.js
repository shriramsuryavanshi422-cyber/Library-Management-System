// 1. Select Elements
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const totalBooksCard = document.querySelector('.stat-value'); 

// 2. Load Books from Local Storage 
// If no books exist in memory, we start with an empty list []
let books = JSON.parse(localStorage.getItem('myLibraryBooks')) || [];

// 3. Function to Display Books on Screen
function renderBooks() {
    bookList.innerHTML = ''; // Clear current list before adding updates
    
    books.forEach((book, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.student}</td>
            <td>${book.date}</td>
            <td>
                <span class="status-badge ${book.status === 'Active' ? 'status-active' : 'status-overdue'}">
                    ${book.status}
                </span>
            </td>
            <td>
                <button class="btn-delete" onclick="deleteBook(${index})">Remove</button>
            </td>
        `;
        bookList.appendChild(row);
    });

    // Update the "Total Books" counter number
    totalBooksCard.innerText = books.length;
}

// 4. Function to Add a New Book
bookForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page from refreshing

    const newBook = {
        id: 'BK' + Math.floor(Math.random() * 1000), // Generate random ID
        title: document.getElementById('book-title').value,
        student: document.getElementById('student-name').value,
        date: document.getElementById('issue-date').value,
        status: document.getElementById('book-status').value
    };

    books.push(newBook); // Add to our list
    saveAndRender(); // Save to memory and update screen
    bookForm.reset(); // Clear the form inputs
});

// 5. Function to Delete a Book
function deleteBook(index) {
    if(confirm('Are you sure you want to remove this book?')) {
        books.splice(index, 1); // Remove 1 item at specific index
        saveAndRender();
    }
}

// 6. Save to Local Storage Helper
function saveAndRender() {
    localStorage.setItem('myLibraryBooks', JSON.stringify(books));
    renderBooks();
}

// Initial Load when page starts
renderBooks();

