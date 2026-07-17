// function for size 
// function  for date 
// function for html 

import entries from './directory-data.js';

const table_entries = document.getElementById('table-body');

entries.forEach(element => {    
    const newRow = document.createElement('tr');
    const checkboxCol = document.createElement('td');
    const checkbox = document.createElement('input');
    const folderName = document.createElement('td');
    const uploadDate = document.createElement('td');
    const folderSize = document.createElement('td');
    const actionDropdown = document.createElement('td');

    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.append(checkboxCol);
    
    newRow.setAttribute('class', 'table-row');
    
    table_entries.append(newRow);
});


