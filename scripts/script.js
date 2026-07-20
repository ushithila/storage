import { getDirectory  } from './service.storage.js';

const table_entries = document.getElementById('table-body');

const loadData = async () => {
    try{
    const entries = await getDirectory('/');
    entries.data.forEach(element => {
        table_entries.append(createRows(element));
    });
    }catch(error){
        console.log(error);
    }
}
loadData();

function createRows(data){
    const newRow = document.createElement('tr');
    newRow.className = 'table-row';
    newRow.id = 'table-row';

    const checkboxCol = document.createElement('td');
    checkboxCol.className = 'checkbox-tr';    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    
    const rowIcon = document.createElement('i');
    rowIcon.className = data.type === 'directory' ? 'fa-regular fa-folder directory fa-lg' : 'fa-regular fa-file file fa-lg';
    const folderName = document.createElement('td');
    folderName.className = 'name-td';
    const uploadDate = document.createElement('td');
    const folderSize = document.createElement('td');
    const actionColumn = document.createElement('td');
    const actionButton = document.createElement('button');
    const actionIcon = document.createElement('i');


    actionButton.type = 'button';
    actionButton.className = 'action-button';
    actionIcon.className = "fa-solid fa-ellipsis-vertical";
    

    actionColumn.className ='action-td';
    
    checkboxCol.append(checkbox);
    folderName.append(rowIcon);
    folderName.append(data.name);
    uploadDate.append(new Date(data.createdAt).toLocaleDateString("en-US", {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}));
    folderSize.append(data.size === 0 ? '--' : data.size);
    actionButton.append(actionIcon);
    actionColumn.append(actionButton);
    newRow.append(checkboxCol);
    newRow.append(folderName);
    newRow.append(uploadDate);
    newRow.append(folderSize);
    newRow.append(actionColumn);

    return newRow;
}




