import { getDirectory, getDirectoryByParentId } from './service.storage.js';

const tableBody = document.getElementById('table-body');
const pageNumber = document.getElementById('page-number');
const firstBtn = document.getElementById('first-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const lastBtn = document.getElementById('last-btn');
const selectAll = document.getElementById('select-all');

let currentParentID = null;
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
        let allRows = document.querySelectorAll('.checkbox:not(#select-all)');
        if(e.target !== checkbox){
            toggleCheckbox(checkbox);

            allRows.forEach((box) => {
                box.checked = box === checkbox;
            });
        }

        selectAll.classList.add('minus');
        selectAll.checked = true;

        const count = document.querySelectorAll('.checkbox:checked:not(#select-all)').length;
        if(count === allRows.length){
            selectAll.classList.remove('minus');
            selectAll.checked = true;
        }
        else if(count === 0){
            selectAll.checked = false;
        }
    });

    row.addEventListener('dblclick', function(e){
        if(data.type === 'directory' && e.target !== checkbox){
            navigateTable(data.id);
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

const params = new URLSearchParams(window.location.search);
const initId = params.get('entry');
console.log(initId);

function navigateTable(id){
    history.pushState({id}, '',`?entry=${id}`);
    getTable(id, 1);
}

window.addEventListener('popstate', function(e){
    let id = e.state ? null : e.state.id;
    console.log(e.state);
    getTable(id, 1);
});

history.replaceState({id: null}, '', '');

function resetTable(){
    tableBody.innerHTML = '';
    selectAll.checked = false;
}

async function getTable(parentID, page) {
    resetTable();
    try {        
        const entries = parentID === null ? await getDirectory('/', {page, pageSize}) : await getDirectoryByParentId(parentID, {page, pageSize});
        if(!Array.isArray(entries.data)) {
            console.warn('Table data not found');
            return;
        }
        const fragment = document.createDocumentFragment();
        entries.data.forEach((item) => fragment.appendChild(createRow(item)));
        tableBody.append(fragment);

        updatePageNumber(entries.pagination.page, entries.pagination.totalPages);
        updateArrowState(entries.pagination.page, entries.pagination.totalPages);

        currentParentID = parentID;
        currentPage = page;
        totalPages = entries.pagination.totalPages;
    } catch(error) {
        console.warn(error);
    }
}


getTable(currentParentID, currentPage);
firstBtn.addEventListener('click', function(){
    getTable(currentParentID, 1);
});

prevBtn.addEventListener('click', function(){
    getTable(currentParentID, currentPage - 1);
});

nextBtn.addEventListener('click', function(){
    getTable(currentParentID, currentPage + 1);
});

lastBtn.addEventListener('click', function(){
    getTable(currentParentID, totalPages);
});

selectAll.addEventListener('change', function(e){
    selectAll.classList.remove('minus');
    let rowCheckbox = document.querySelectorAll('.checkbox:not(#select-all)');
    rowCheckbox.forEach( (box) => {
        box.checked = selectAll.checked;
    });
});