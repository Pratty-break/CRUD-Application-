import employees from "./json.js";

document.addEventListener('DOMContentLoaded', () => {
    // Creating a variable for the body of the table
    const tableBody = document.querySelector('.table tbody');
    const editModal = new bootstrap.Modal(document.getElementById('editModal')); // Initializing a new bootstrap model
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal')); // using Bootstrap's javaScript Api to create a new modal instance 
    const editForm = document.getElementById('editForm');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let currentRow;
    var rowToDelete;
    let currentPage = 1;
    const rowsPerPage = 5;

    // Function to render the table with serial numbers
    function formatTable() {
        tableBody.innerHTML = '';       // making sure the table body is initially empty 
        //Applying pagination logic 
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = employees.slice(start, end); //slicing the employees array to get the required entries on the page 

        paginatedItems.forEach((employee, index) => {
            const row = document.createElement('tr');

            const serialNumber = document.createElement('td');
            serialNumber.textContent = start + index + 1; // in the serial number adding start and the index for individual paginated page 
            row.appendChild(serialNumber);

            const empID = document.createElement('td');
            empID.textContent = employee['emp-id'];
            row.appendChild(empID);

            const empName = document.createElement('td');
            empName.textContent = employee['emp-name'];
            row.appendChild(empName);

            const empDept = document.createElement('td');
            empDept.textContent = employee['dept'];
            row.appendChild(empDept);

            const empLocation = document.createElement('td');
            empLocation.textContent = employee['location'];
            row.appendChild(empLocation);

            const button = document.createElement('td');
            button.classList.add('button');

            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-primary', 'me-2', 'editButton');
            editButton.textContent = 'Edit';
            editButton.setAttribute('data-bs-toggle', 'modal');
            editButton.setAttribute('data-bs-target', '#editModal');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger', 'deleteButton');
            deleteButton.textContent = 'Delete';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#deleteModal');

            button.appendChild(editButton);
            button.appendChild(deleteButton);
            row.appendChild(button);
            tableBody.appendChild(row);

            editButton.addEventListener('click', () => {
                currentRow = row;
                document.getElementById('empId').value = employee['emp-id'];
                document.getElementById('empName').value = employee['emp-name'];
                document.getElementById('empDept').value = employee['dept'];
                document.getElementById('empLocation').value = employee['location'];
                editModal.show();
            });

            deleteButton.addEventListener('click', () => {
                rowToDelete = row;
                deleteModal.show();
            });
        });
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(employees.length / rowsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        pageNumbers.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.textContent = i;
            pageNumber.classList.add('btn', 'btn-light', 'me-1');
            if (i === currentPage) {
                pageNumber.classList.add('btn-primary');
            }
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                formatTable();
            });
            pageNumbers.appendChild(pageNumber);
        }
    }

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            formatTable();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(employees.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            formatTable();
        }
    });

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const empId = document.getElementById('empId').value;
        const empName = document.getElementById('empName').value;
        const empDept = document.getElementById('empDept').value;
        const empLocation = document.getElementById('empLocation').value;

        currentRow.cells[1].textContent = empId;
        currentRow.cells[2].textContent = empName;
        currentRow.cells[3].textContent = empDept;
        currentRow.cells[4].textContent = empLocation;

        editModal.hide();
    });
    
    function deleteEmployee() {
        const index = employees.findIndex(emp => {
            return emp['emp-id'] == rowToDelete.cells[1].textContent;
        });
       
        if (index !== -1) {
            console.log('is it call delete method')
            employees.splice(index, 1);
            rowToDelete.remove();
            updatePagination();
            formatTable();
        }
        deleteModal.hide();
    }
    
    // Event listener for the delete confirmation button
    confirmDeleteButton.addEventListener('click', ()=>{
        console.log("this object",rowToDelete);
        deleteEmployee();
    });
    
    formatTable();
});
