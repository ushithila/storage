// function for size 
// function  for date 
// function for html 

import entries from './test.js';


const table_entries = document.getElementById('table-body');

entries.forEach(element => {    
    const newRow = document.createElement('tr');
    newRow.setAttribute('class', 'table-row');

    const checkBox = document.createElement('td');
    checkBox.setAttribute('class', 'checkbox-tr');

    const folderName = document.createElement('td');
    folderName.setAttribute('class', 'td');

    const uploadDate = document.createElement('td');
    uploadDate.setAttribute('class', 'td');

    const folderSize = document.createElement('td');
    folderSize.setAttribute('class', 'td');

    const actionDropdown = document.createElement('td');
    actionDropdown.setAttribute('class', 'action-td');

    newRow.append(checkBox);    
    newRow.append(folderName);
    newRow.append(uploadDate);
    newRow.append(folderSize);
    newRow.append(actionDropdown);

    table_entries.append(newRow);
});
