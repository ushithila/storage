import { getDirectory  } from './service.storage.js';

const entries = await getDirectory('/');

entries.data.forEach(element => {
    loadData(element);
});

function loadData(data){
    const table_entries = document.getElementById('table-body');
    const newRow = document.createElement('tr');
    const checkboxCol = document.createElement('td');
    const checkbox = document.createElement('input');
    const rowIcon = document.createElement('i');
    const folderName = document.createElement('td');
    const uploadDate = document.createElement('td');
    const folderSize = document.createElement('td');
    const actionColumn = document.createElement('td');
    const actionButton = document.createElement('button');
    const actionIcon = document.createElement('i');

    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';

    rowIcon.className = data.type === 'directory' ? 'fa-regular fa-folder directory fa-lg' : 'fa-regular fa-file file fa-lg';
    actionButton.type = 'button';
    actionButton.className = 'action-button';
    actionIcon.className = "fa-solid fa-ellipsis-vertical";
    
    newRow.setAttribute('class', 'table-row');
    checkboxCol.setAttribute( 'class', 'checkbox-tr');    
    folderName.setAttribute('class', 'name-td');
    actionColumn.setAttribute( 'class', 'action-td');
    
    checkboxCol.append(checkbox);
    folderName.append(rowIcon);
    folderName.append(data.name);
    uploadDate.append(data.createdAt);
    folderSize.append(data.size === 0 ? data.size = '--' : data.size);
    actionButton.append(actionIcon);
    actionColumn.append(actionButton);
    newRow.append(checkboxCol);
    newRow.append(folderName);
    newRow.append(uploadDate);
    newRow.append(folderSize);
    newRow.append(actionColumn);
    table_entries.append(newRow);
}




