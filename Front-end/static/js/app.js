document.addEventListener('DOMContentLoaded', () => {
    const requestForm = document.getElementById('requestForm');
    const taskForm = document.getElementById('taskForm');

    // Handle Request Form
    if (requestForm) {
        setupFormListener(requestForm, '/api/v1/requests', 'requestsTableBody');
    }

    // Handle Task Form
    if (taskForm) {
        setupFormListener(taskForm, '/api/v1/tasks', 'tasksTableBody');
    }
});

function setupFormListener(form, endpoint, tableBodyId) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        
        if (!title || !description) {
            alert("Title and description cannot be empty or just spaces.");
            return;
        }

        const data = { title, description };
        
        const submitBtn = document.getElementById('submitBtn');
        let originalBtnText = 'Submit';
        if (submitBtn) {
            originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const newItem = await response.json();
                appendRowToTable(newItem, tableBodyId, endpoint);
                form.reset();
            } else {
                console.error(`Failed to submit to ${endpoint}.`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
}

// Helper function to append a new row
function appendRowToTable(item, tableBodyId, endpoint) {
    const tableBody = document.getElementById(tableBodyId);
    const emptyRow = document.getElementById('empty-row');
    
    if (emptyRow) {
        emptyRow.remove();
    }

    const tr = document.createElement('tr');
    tr.id = `row-${item.id}`;

    // Safely create DOM elements to prevent XSS
    const idTd = document.createElement('td');
    idTd.textContent = item.id;
    
    const titleTd = document.createElement('td');
    titleTd.textContent = item.title;
    
    const descTd = document.createElement('td');
    descTd.textContent = item.description;
    
    const actionsTd = document.createElement('td');
    actionsTd.innerHTML = `<button class="btn-danger" onclick="deleteRequest(${item.id})">Delete</button>`;

    tr.appendChild(idTd);
    tr.appendChild(titleTd);
    tr.appendChild(descTd);
    tr.appendChild(actionsTd);

    tableBody.appendChild(tr);
}

// Global functions for inline onclick handlers
window.deleteRequest = async function(id) {
    await performDelete(id, '/api/v1/requests', 'requestsTableBody', 'No requests found.');
};

window.deleteTask = async function(id) {
    await performDelete(id, '/api/v1/tasks', 'tasksTableBody', 'No tasks found.');
};

async function performDelete(id, endpoint, tableBodyId, emptyMessage) {
    try {
        const response = await fetch(`${endpoint}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const rowElement = document.getElementById(`row-${id}`);
            if (rowElement) {
                rowElement.remove();
                
                const tableBody = document.getElementById(tableBodyId);
                if (tableBody && tableBody.children.length === 0) {
                    tableBody.innerHTML = `
                    <tr id="empty-row">
                        <td colspan="4" class="text-center">${emptyMessage}</td>
                    </tr>`;
                }
            }
        } else {
            console.error(`Failed to delete item with id ${id} from ${endpoint}.`);
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}
