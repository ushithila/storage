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

    const rowIcon = document.createElement('i');
    rowIcon.className = data.type === 'directory' ? 'fa-regular fa-folder directory fa-lg' : 'fa-regular fa-file file fa-lg';
    
    const folderName = document.createElement('td');
    folderName.append(rowIcon);
    folderName.append(data.name);
    
    const uploadDate = document.createElement('td');
    uploadDate.append(convertDateFormat(data.createdAt));
    
    const folderSize = document.createElement('td');
    folderSize.append(data.size === 0 ? '--' : data.size);
    
    const actionColumn = document.createElement('td');
    actionColumn.className ='action-td';

    const actionButton = document.createElement('button');
    actionButton.className = 'action-button';
    actionButton.type = 'button';
    
    const actionIcon = document.createElement('i');
    actionIcon.className = "fa-solid fa-ellipsis-vertical";
    actionButton.append(actionIcon);
    actionColumn.append(actionButton);

    const newRow = document.createElement('tr');
    newRow.className = 'table-row';

    newRow.append(checkboxCol, folderName, uploadDate, folderSize, actionColumn);
    return newRow;
}

async function loadData() {
    try {
        const entries = await getDirectory('/');
        entries.data.forEach(item => {
            document.getElementById('table-body').append(createRow(item));
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


