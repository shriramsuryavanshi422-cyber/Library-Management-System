// ----- Constants -----
const STORAGE_KEY = "library_db_inventory";
const ADMIN_PASSWORD = "admin123";

// ----- DOM Elements -----
const loginScreen = document.getElementById("login-screen");
const loginForm = document.getElementById("login-form");
const loginPasswordInput = document.getElementById("login-password");
const loginFeedback = document.getElementById("login-feedback");

const appShell = document.getElementById("app-shell");
const navLinks = document.querySelectorAll(".nav-link");
const mainTitle = document.getElementById("main-title");

const statTotal = document.getElementById("stat-total");
const statIssued = document.getElementById("stat-issued");
const statAvailable = document.getElementById("stat-available");

const searchInput = document.getElementById("search-input");
const addBookForm = document.getElementById("add-book-form");
const addBookFeedback = document.getElementById("add-book-feedback");
const bookIdInput = document.getElementById("book-id");
const bookTitleInput = document.getElementById("book-title");
const bookAuthorInput = document.getElementById("book-author");
const bookQuantityInput = document.getElementById("book-quantity");
const booksTableBody = document.getElementById("books-table-body");
const downloadDbBtn = document.getElementById("download-db-btn");

const issueBookForm = document.getElementById("issue-book-form");
const issueBookIdInput = document.getElementById("issue-book-id");
const studentNameInput = document.getElementById("student-name");
const issueFeedback = document.getElementById("issue-feedback");

const returnBookForm = document.getElementById("return-book-form");
const returnBookIdInput = document.getElementById("return-book-id");
const returnFeedback = document.getElementById("return-feedback");

const logoutBtn = document.getElementById("logout-btn");

// ----- Storage Helpers -----
function loadBooks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error("Error parsing localStorage data:", err);
        return [];
    }
}

function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// ----- Stats -----
function computeStats(books) {
    let totalCopies = 0;
    let availableCopies = 0;

    books.forEach((b) => {
        totalCopies += b.totalQty;
        availableCopies += b.availableQty;
    });

    const issuedCopies = totalCopies - availableCopies;
    return {
        total: totalCopies,
        issued: issuedCopies,
        available: availableCopies,
    };
}

function renderStats() {
    const books = loadBooks();
    const { total, issued, available } = computeStats(books);
    statTotal.textContent = total;
    statIssued.textContent = issued;
    statAvailable.textContent = available;
}

// ----- UI Helpers -----
function setFeedback(element, message, type) {
    element.textContent = message;
    element.classList.remove("success", "error");
    if (type === "success") {
        element.classList.add("success");
    } else if (type === "error") {
        element.classList.add("error");
    }
}

function clearAllFeedbacks() {
    [loginFeedback, addBookFeedback, issueFeedback, returnFeedback].forEach(
        (el) => {
            el.textContent = "";
            el.classList.remove("success", "error");
        }
    );
}

// ----- Table Rendering -----
function renderBooksTable() {
    const books = loadBooks();
    const filter = searchInput.value.trim().toLowerCase();
    booksTableBody.innerHTML = "";

    books
        .filter((book) => {
            if (!filter) return true;
            const idMatch = book.id.toLowerCase().includes(filter);
            const titleMatch = book.title.toLowerCase().includes(filter);
            return idMatch || titleMatch;
        })
        .forEach((book) => {
            const tr = document.createElement("tr");

            const tdId = document.createElement("td");
            tdId.textContent = book.id;

            const tdTitle = document.createElement("td");
            tdTitle.textContent = book.title;

            const tdAuthor = document.createElement("td");
            tdAuthor.textContent = book.author;

            const tdQty = document.createElement("td");
            const qtySpan = document.createElement("span");
            qtySpan.textContent = `${book.availableQty} / ${book.totalQty}`;
            if (book.availableQty === 0) {
                qtySpan.className = "qty-low";
            } else {
                qtySpan.className = "qty-available";
            }
            tdQty.appendChild(qtySpan);

            const tdActions = document.createElement("td");
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "btn btn-danger";
            delBtn.style.fontSize = "0.8rem";
            delBtn.style.padding = "0.35rem 0.7rem";
            delBtn.addEventListener("click", () => handleDeleteBook(book.id));
            tdActions.appendChild(delBtn);

            tr.append(tdId, tdTitle, tdAuthor, tdQty, tdActions);
            booksTableBody.appendChild(tr);
        });
}

function refreshUI() {
    renderStats();
    renderBooksTable();
}

// ----- Authentication -----
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllFeedbacks();

    const entered = loginPasswordInput.value.trim();
    if (entered === ADMIN_PASSWORD) {
        loginScreen.classList.add("hidden");
        appShell.classList.remove("hidden");
        loginPasswordInput.value = "";
    } else {
        setFeedback(loginFeedback, "Incorrect password.", "error");
    }
});

// ----- Navigation (SPA Tabs) -----
navLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        if (!targetId) return;

        navLinks.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".tab").forEach((tab) => {
            tab.classList.remove("active");
        });

        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.classList.add("active");
        }

        if (targetId === "dashboard-tab") {
            mainTitle.textContent = "Dashboard";
        } else if (targetId === "manage-tab") {
            mainTitle.textContent = "Manage Books";
        } else if (targetId === "issue-tab") {
            mainTitle.textContent = "Issue Book";
        } else if (targetId === "return-tab") {
            mainTitle.textContent = "Return Book";
        }

        clearAllFeedbacks();
    });
});

// ----- Manage Books (Inventory) -----
addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllFeedbacks();

    const id = bookIdInput.value.trim();
    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const qty = parseInt(bookQuantityInput.value.trim(), 10);

    if (!id || !title || !author || isNaN(qty) || qty <= 0) {
        setFeedback(
            addBookFeedback,
            "All fields are required and quantity must be greater than 0.",
            "error"
        );
        return;
    }

    const books = loadBooks();
    const exists = books.some(
        (b) => b.id.toLowerCase() === id.toLowerCase()
    );

    if (exists) {
        setFeedback(addBookFeedback, "Book ID already exists.", "error");
        return;
    }

    const newBook = {
        id,
        title,
        author,
        totalQty: qty,
        availableQty: qty,
    };

    books.push(newBook);
    saveBooks(books); // auto-save
    addBookForm.reset();
    refreshUI();
    setFeedback(addBookFeedback, "Book added to inventory.", "success");
});

function handleDeleteBook(id) {
    const books = loadBooks();
    const updated = books.filter(
        (b) => b.id.toLowerCase() !== id.toLowerCase()
    );
    saveBooks(updated);
    refreshUI();
    setFeedback(addBookFeedback, "Book removed from inventory.", "success");
}

// ----- Search (Real-time filter) -----
searchInput.addEventListener("input", () => {
    renderBooksTable();
});

// ----- Download Database (Library_Data.txt) -----
function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain" }); // Blob download pattern.[web:29][web:32][web:33]
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 1500);
}

downloadDbBtn.addEventListener("click", () => {
    const books = loadBooks();
    const payload = JSON.stringify(books, null, 2);
    downloadTextFile("Library_Data.txt", payload);
});

// ----- Issue Book -----
issueBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllFeedbacks();

    const id = issueBookIdInput.value.trim();
    const studentName = studentNameInput.value.trim();

    if (!id || !studentName) {
        setFeedback(
            issueFeedback,
            "Book ID and Student Name are required.",
            "error"
        );
        return;
    }

    const books = loadBooks();
    const book = books.find(
        (b) => b.id.toLowerCase() === id.toLowerCase()
    );

    if (!book) {
        setFeedback(issueFeedback, "Book ID not found.", "error");
        return;
    }

    if (book.availableQty <= 0) {
        setFeedback(
            issueFeedback,
            "All copies are currently issued.",
            "error"
        );
        return;
    }

    book.availableQty -= 1;
    saveBooks(books);
    refreshUI();
    issueBookForm.reset();
    setFeedback(issueFeedback, "Book issued successfully.", "success");
});

// ----- Return Book -----
returnBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllFeedbacks();

    const id = returnBookIdInput.value.trim();
    if (!id) {
        setFeedback(returnFeedback, "Book ID is required.", "error");
        return;
    }

    const books = loadBooks();
    const book = books.find(
        (b) => b.id.toLowerCase() === id.toLowerCase()
    );

    if (!book) {
        setFeedback(returnFeedback, "Book ID not found.", "error");
        return;
    }

    if (book.availableQty >= book.totalQty) {
        setFeedback(
            returnFeedback,
            "All copies are already in the library.",
            "error"
        );
        return;
    }

    book.availableQty += 1;
    saveBooks(books);
    refreshUI();
    returnBookForm.reset();
    setFeedback(returnFeedback, "Book returned successfully.", "success");
});

// ----- Logout -----
logoutBtn.addEventListener("click", () => {
    window.location.reload();
});

// ----- Initial Render -----
refreshUI();

