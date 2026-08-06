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

function toggleCheckbox(box) {
    box.checked = !box.checked;
}

function gotoFolder(folder) {

}

const tableRowTemplate = document.getElementById('table-row-template');
const selectAll = document.getElementById('select-all');
function createRow( {
    name,
    createdAt,
    size,
    type,
    id,
} ) {
    const row = tableRowTemplate
        .content
        .cloneNode(true);
    const cells = row.querySelectorAll('td');
    const checkbox = row.querySelector('input[type="checkbox"]');

    const icon = cells[1].querySelector('i');
    if (type === 'directory') {
        icon.classList.add('directory', 'fa-folder');
    } else {
        icon.classList.add('file', 'fa-file');
    }
    
    cells[1].append(name);
    cells[2].textContent = convertDateFormat(createdAt);
    cells[3].textContent = size || '--';

    const clickedRow = row.querySelector('tr');

    clickedRow.addEventListener('click', function(e) {
        let allRows = document.querySelectorAll('.checkbox:not(#select-all)');
        if(e.target !== checkbox) {
            toggleCheckbox(checkbox);

            allRows.forEach((box) => {
                box.checked = box === checkbox;
            });
        }

        selectAll.classList.add = '.minus';

        const count = document.querySelectorAll('.checkbox:checked:not(#select-all)').length;
        if(count === allRows.length){
            selectAll.classList.add = '.minus';
            selectAll.checked = true;
        }
        else if(count === 0){
            selectAll.checked = false;
        }
    });

    clickedRow.addEventListener('dblclick', function(e) {
        if(type === 'directory' && e.target !== checkbox){
                navigateTable(id);
        }
    });

    return row;
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
    history.pushState({id}, '', `entry=${id}`); 
    getTable(id);
}

const tableBody = document.getElementById('table-body');
const param = new URLSearchParams(window.location.search);
let currentPageId = param.get('entry');
let currentPage = 1;
let totalPages = 1;
const pageSize = 5;

function resetTable(){
    tableBody.innerHTML = '';
    selectAll.checked = false;
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

// indeterminate
selectAll.addEventListener('change', function(e){
    selectAll.classList.remove('minus');
    let rowCheckbox = document.querySelectorAll('.checkbox:not(#select-all)');
    rowCheckbox.forEach( (box) => {
        box.checked = selectAll.checked;
    });
});

window.addEventListener('popstate', () => {
    const id = e.state ? e.state.id : null;
    getTable(id);
});