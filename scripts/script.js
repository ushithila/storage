import { getDirectory } from './service.storage.js';

function convertDateFormat(date){
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    return formattedDate;
}

function createRow(data) {
    const checkboxCol = document.createElement('td');
    checkboxCol.className = 'checkbox-tr'; 
    
    const checkbox = document.createElement('input');
    checkbox.className = 'checkbox';
    checkbox.type = 'checkbox';
    checkboxCol.append(checkbox);

    const icon = document.createElement('i');
    icon.className = data.type === 'directory' ? 'fa-regular fa-folder directory fa-lg' : 'fa-regular fa-file file fa-lg';
    
    const rowName = document.createElement('td');
    rowName.append(icon, data.name);
    
    const uploadDate = document.createElement('td');
    uploadDate.append(convertDateFormat(data.createdAt));
    
    const contentSize = document.createElement('td');
    contentSize.append(data.size === 0 ? '--' : data.size);
    
    const actionColumn = document.createElement('td');
    actionColumn.className ='action-td';

    const actionButton = document.createElement('button');
    actionButton.className = 'action-button';
    actionButton.type = 'button';
    
    const actionIcon = document.createElement('i');
    actionIcon.className = "fa-solid fa-ellipsis-vertical";
    actionButton.appendChild(actionIcon);
    actionColumn.appendChild(actionButton);

    const newRow = document.createElement('tr');
    newRow.className = 'table-row';

    newRow.append(checkboxCol, rowName, uploadDate, contentSize, actionColumn);
    return newRow;
}

async function loadData() {
    try {
        const entries = await getDirectory('/');
        const table_body = document.getElementById('table-body');
        entries.data.forEach(item => {
            table_body.append(createRow(item));
        });
    } catch(error) {
        console.warn(error);
    }
}

//will put into functions later
document.addEventListener("dblclick", function(e) {
    if(e.target.matches(".table-row")){
        window.location.href = 'folder.html';
    }
});

loadData();


