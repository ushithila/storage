import { convertDateFormat, toggleCheckbox } from './utils.js';

const tableRowTemplate = document.getElementById('table-row-template');

export function createRow({
    name,
    createdAt,
    size,
    type,
    id,
}) {
    const newRow = tableRowTemplate
        .content
        .cloneNode(true);
    const cells = newRow.querySelectorAll('td');
    const checkbox = newRow.querySelector('input[type="checkbox"]');

    const icon = cells[1].querySelector('i');
    if (type === 'directory') {
        icon.classList.add('directory', 'fa-folder');
    } else {
        icon.classList.add('file', 'fa-file');
    }

    cells[1].append(name);
    cells[2].textContent = convertDateFormat(createdAt);
    cells[3].textContent = size || '--';

    const clickedRow = newRow.querySelector('tr');
    clickedRow.onclick = function(e){ 
        setSingleRow(clickedRow, e, checkbox);
    };

    clickedRow.ondblclick = function(e) {
        if(type === 'directory' && e.target !== checkbox) {
                navigateTable(id);
        }    
    };
   
    return newRow;
}