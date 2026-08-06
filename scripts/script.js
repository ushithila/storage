import { getDirectory, getDirectoryByParentId } from './service.storage.js';

/***
 1. cells to have class name instead of cells[1]
 2. urlsearchparam on navigate table
 3. Change variable names of initId, box, 
 4. Put events on the createRow to their own seperate functions 
 5. indeterminate on selectAll checkbox
 6. Figure out a way to put all the events of pagination in a function instead of root 
 7. spaces between {  
 8. Move variables above the functions where they are called first
 9. 
 ***/

function convertDateFormat(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    return formattedDate;
}

function toggleCheckbox(checkbox) {
    checkbox.checked = !checkbox.checked;
}

function gotoFolder(folder) {

}

const tableRowTemplate = document.getElementById('table-row-template');
const selectAllCheckbox = document.getElementById('select-all-checkbox');
function createRow( {
    name,
    createdAt,
    size,
    type,
    id,
} ) {
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

    clickedRow.addEventListener('click', function(e) {
        let allRows = document.querySelectorAll('.checkbox:not(#select-all)');
        if(e.target !== checkbox) {
            toggleCheckbox(checkbox);
            allRows.forEach((box) => {
                box.checked = box === checkbox;
            });
        }
        selectAllCheckbox.indeterminate = true;

        const count = document.querySelectorAll('.checkbox:checked:not(#select-all)').length;
        if(count === 0){
            selectAllCheckbox.checked = false;
        }
    });

    clickedRow.addEventListener('dblclick', function(e) {
        if(type === 'directory' && e.target !== checkbox){
                navigateTable(id);
        }
    });

    return newRow;
}

const pageNumber = document.getElementById('page-number');
function updatePageNumber(currentPage, totalPages) {
    pageNumber.innerHTML = '';
    const current = document.createElement('b');
    current.textContent = currentPage;
    pageNumber.append(current, ` of ${totalPages}`);
}

const firstBtn = document.getElementById('first-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const lastBtn = document.getElementById('last-btn');

function updateArrowState(currentPage, totalPages) {
    const start = currentPage == 1;
    const end = currentPage == totalPages;

    firstBtn.disabled = start;
    prevBtn.disabled = start;
    nextBtn.disabled = end;
    lastBtn.disabled = end;
}

function navigateTable(id){
    const url = new URLSearchParams(window.location.href);
    url.set('entry', id);
    history.pushState({id}, '', url); 
    getTable(id);
}

window.addEventListener('popstate', () => {
    const id = e.state ? e.state.id : null;
    getTable(id);
});

const tableBody = document.getElementById('table-body');
const param = new URLSearchParams(window.location.search);
let currentPageId = param.get('entry');
let currentPage = 1;
let totalPages = 1;
const pageSize = 15;

function resetTable(){
    tableBody.innerHTML = '';
    selectAllCheckbox.checked = false;
}

async function getTable(parentID, page = 1) {
    resetTable();
    try {        
        const entries = parentID
        ? await getDirectoryByParentId(parentID, { page, pageSize })
        : await getDirectory('/', { page, pageSize });
        if(!Array.isArray(entries.data)) {
            console.warn('Table data not found');
            return;
        }

        const rows = entries.data.map(createRow);
        tableBody.append(...rows);
        
        updatePageNumber(entries.pagination.page, entries.pagination.totalPages);
        updateArrowState(entries.pagination.page, entries.pagination.totalPages);

        currentPageId = parentID;
        currentPage = page;
        totalPages = entries.pagination.totalPages;
    } catch(error) {
        console.warn(error);
    }
}

getTable(currentPageId);
firstBtn.addEventListener('click', function() {
    getTable(currentPageId);
});

prevBtn.addEventListener('click', function() {
    getTable(currentPageId, currentPage - 1);
});

nextBtn.addEventListener('click', function(){
    getTable(currentPageId, currentPage + 1);
});

lastBtn.addEventListener('click', function(){
    getTable(currentPageId, totalPages);
});

/*
1. get all checkboxes (not including the 'select all' checbox)
2. on any checkbox change - set 'select all' checkbox state
*/

selectAllCheckbox.addEventListener('change', function(e){
    selectAllCheckbox.indeterminate = false;
    let rowCheckbox = document.querySelectorAll('.checkbox:not(#select-all)');
    rowCheckbox.forEach( (box) => {
        box.checked = selectAllCheckbox.checked;
    });
});