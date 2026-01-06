// 1. Search Functionality
const searchInput = document.querySelector('.search-input');
const tableRows = document.querySelectorAll('.recent-books-table tbody tr');

searchInput.addEventListener('input', function(e) {
    const searchText = e.target.value.toLowerCase();

    tableRows.forEach(row => {
        const rowData = row.innerText.toLowerCase();
        if (rowData.includes(searchText)) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
});

// 2. Button Interaction (for demo purposes)
// This selects all links in the sidebar
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Remove 'active' class from all links
        navLinks.forEach(nav => nav.classList.remove('active'));
        // Add 'active' class to the clicked link
        this.classList.add('active');
    });
});

