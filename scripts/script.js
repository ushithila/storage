import { getDirectory } from './service.storage.js';

const tableBody = document.getElementById('table-body');
const pageNumber = document.getElementById('page-number');
const firstBtn = document.getElementById('first-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const lastBtn = document.getElementById('last-btn');
const selectAll = document.getElementById('select-all');

let currentPath = '/';
let currentPage = 1;
let totalPages = currentPage;
const pageSize = 15;

function convertDateFormat(date){
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    
    return formattedDate;
}

function getCheckbox(box){
    box.checked = !box.checked;
}

function getMultiSelect(selected){
    const title = document.getElementById('breadcrumbs');
    const search = document.getElementById('search-container');
    const add = document.getElementById('add-button');
    title.style.display = 'none';
    search.style.display = 'none';
    add.style.display = 'none';
    const multiSelectContainer = document.getElementById('multi-select-container');
    multiSelectContainer.style.display = 'flex';
}

function createRow(data) {
    const checkboxCol = document.createElement('td');
    checkboxCol.className = 'checkbox-tr'; 
    
    const checkbox = document.createElement('input');
    checkbox.className = 'checkbox';
    checkbox.type = 'checkbox';
    checkboxCol.appendChild(checkbox);
    
    const entryIcon = document.createElement('i');
    entryIcon.className = data.type === 'directory' ? 'fa-regular fa-folder directory fa-lg' : 'fa-regular fa-file file fa-lg';
    
    const entryName = document.createElement('td');
    entryName.append(entryIcon, data.name);
    
    const uploadDate = document.createElement('td');
    uploadDate.textContent = convertDateFormat(data.createdAt);
    
    const size = document.createElement('td');
    size.textContent = data.size === 0 ? '--' : data.size;
    
    const actionColumn = document.createElement('td');
    actionColumn.className ='action-td';
    
    const actionButton = document.createElement('button');
    actionButton.className = 'action-button';
    actionButton.type = 'button';
    
    const actionIcon = document.createElement('i');
    actionIcon.className = 'fa-solid fa-ellipsis-vertical';
    actionButton.appendChild(actionIcon);
    actionColumn.appendChild(actionButton);
    
    const row = document.createElement('tr');
    row.className = 'table-row';

    checkbox.addEventListener('click', function(){
        getCheckbox(checkbox);
    });
  
    row.addEventListener('click', function(){
        getCheckbox(checkbox);
    });

    row.addEventListener('dblclick', function(){
        if(data.type === 'directory'){
            getTable(data.path);
        }
    });

    row.append(checkboxCol, entryName, uploadDate, size, actionColumn);
    return row;
}


function updatePageNumber(currentPage, totalPages){
    pageNumber.innerHTML = '';
    const current = document.createElement('b');
    current.textContent = currentPage;
    pageNumber.append(current, ` of ${totalPages}`);
}

function updateArrowState(currentPage, totalPages){
    const start = currentPage == 1;
    const end = currentPage == totalPages;

    firstBtn.disabled = start;
    prevBtn.disabled = start;
    nextBtn.disabled = end;
    lastBtn.disabled = end;
}

async function getTable(path, page) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    try {
        const entries = await getDirectory(path, {page, pageSize});
        if(!Array.isArray(entries.data)) {
            console.warn('Table data not found');
            return;
        }
        const fragment = document.createDocumentFragment();
        entries.data.forEach((item) => fragment.appendChild(createRow(item)));
        tableBody.append(fragment);
        
        updatePageNumber(entries.pagination.page, entries.pagination.totalPages);
        updateArrowState(entries.pagination.page, entries.pagination.totalPages);

        currentPath = path;
        currentPage = page;
        totalPages = entries.pagination.totalPages;
        selectAll.checked = false;
    } catch(error) {
        console.warn(error);
    }
}

getTable(currentPath, currentPage);
firstBtn.addEventListener('click', function(){
    getTable(currentPath, 1);
});

prevBtn.addEventListener('click', function(){
    getTable(currentPath, currentPage - 1);
});

nextBtn.addEventListener('click', function(){
    getTable(currentPath, currentPage + 1);
});

lastBtn.addEventListener('click', function(){
    getTable(currentPath, totalPages);
});

selectAll.addEventListener('click', function(){
    getCheckbox(selectAll);
    const allCheckboxes = document.querySelectorAll('.checkbox');
    allCheckboxes.forEach((box) => getCheckbox(box));
    getMultiSelect(allCheckboxes.length - 1);
});