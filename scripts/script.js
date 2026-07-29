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
let totalPages = 1;
const pageSize = 15;

function convertDateFormat(date){
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    
    return formattedDate;
}

function toggleCheckbox(box){
    box.checked = !box.checked;
}

function showDefaultHeader(){
    const title = document.getElementById('breadcrumb');
    const search = document.getElementById('search-container');
    const add = document.getElementById('add-button');
    title.style.display = 'flex';
    search.style.display = 'flex';
    add.style.display = 'flex';
    const multiSelectContainer = document.getElementById('multi-select-container');
    multiSelectContainer.style.display = 'none';
}

function showMultiSelect(selected){
    const title = document.getElementById('breadcrumbs');
    const search = document.getElementById('search-container');
    const add = document.getElementById('add-button');
    title.style.display = 'none';
    search.style.display = 'none';
    add.style.display = 'none';
    const multiSelectContainer = document.getElementById('multi-select-container');
    multiSelectContainer.style.display = 'flex';
    const rowSelected = document.getElementById('select-text');
    rowSelected.innerHTML = '';
    rowSelected.textContent = `${selected} selected`;
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
  
    row.addEventListener('click', function(e){
        if(e.target !== checkbox){
            toggleCheckbox(checkbox);
        }
    });

    row.addEventListener('dblclick', function(e){
        if(data.type === 'directory' && e.target !== checkbox){
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

function resetTable(){
    tableBody.innerHTML = '';
    selectAll.checked = false;
    showDefaultHeader();
}

async function getTable(path, page) {
    resetTable();
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

// selectAll.addEventListener('click', function(){
//     getCheckbox(selectAll);
//     const allCheckboxes = document.querySelectorAll('.checkbox');
//     allCheckboxes.forEach((box) => toggleCheckbox(box));
//     if(selectAll.checked == true){
//         getMultiSelect(allCheckboxes.length - 1);
//     }else{
//         toggleDefaultHeader();
//     }
// });