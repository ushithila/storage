// import { getDirectory  } from './service.storage.js';

// const data = await getDirectory('/');
// console.log(data);


function loadData(data){
    const table_entries = document.getElementById('table-body');
    const newRow = document.createElement('tr');
    const checkboxCol = document.createElement('td');
    const checkbox = document.createElement('input');
    const folderName = document.createElement('td');
    const uploadDate = document.createElement('td');
    const folderSize = document.createElement('td');
    const actionColumn = document.createElement('td');
    const actionButton = document.createElement('button');
    const actionIcon = document.createElement('i');

    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    actionButton.type = 'button';
    actionButton.className = 'action-button';
    actionIcon.className = "fa-solid fa-ellipsis-vertical";
    
    newRow.setAttribute('class', 'table-row');
    checkboxCol.setAttribute( 'class', 'checkbox-tr');
    actionColumn.setAttribute( 'class', 'action-td');
    
    checkboxCol.append(checkbox);
    folderName.append(element.name);
    uploadDate.append(element.createdAt);
    folderSize.append(element.size);
    actionButton.append(actionIcon);
    actionColumn.append(actionButton);
    newRow.append(checkboxCol);
    newRow.append(folderName);
    newRow.append(uploadDate);
    newRow.append(folderSize);
    newRow.append(actionColumn);
    table_entries.append(newRow);
}




