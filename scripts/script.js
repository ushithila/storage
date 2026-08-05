import { getDirectory, getDirectoryByParentId } from './service.storage.js';

const tableBody = document.getElementById('table-body');
const tableRowTemplate = document.getElementById('table-row-template');
const pageNumber = document.getElementById('page-number');
const firstBtn = document.getElementById('first-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const lastBtn = document.getElementById('last-btn');
const selectAll = document.getElementById('select-all');

const param = new URLSearchParams(window.location.search);
let initId = param.get('entry');
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

function createRow({
    name,
    createdAt,
    size,
    type,
    id,
}) {
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

    // row.addEventListener('click', function(e){
    //     let allRows = document.querySelectorAll('.checkbox:not(#select-all)');
    //     if(e.target !== checkbox){
    //         toggleCheckbox(checkbox);

    //         allRows.forEach((box) => {
    //             box.checked = box === checkbox;
    //         });
    //     }

    //     selectAll.classList.add('minus');
    //     selectAll.checked = true;

    //     const count = document.querySelectorAll('.checkbox:checked:not(#select-all)').length;
    //     if(count === allRows.length){
    //         selectAll.classList.remove('minus');
    //         selectAll.checked = true;
    //     }
    //     else if(count === 0){
    //         selectAll.checked = false;
    //     }
    // });

    row.querySelector('tr').addEventListener('click', function(e){
        if(type === 'directory' && e.target !== checkbox){
                navigateTable(id);
        }
    });
    
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

function navigateTable(id){
    history.pushState({id}, '',`?entry=${id}`);
    getTable(id, 1);
}

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

        initId = parentID;
        currentPage = page;
        totalPages = entries.pagination.totalPages;
    } catch(error) {
        console.warn(error);
    }
}

getTable(initId, currentPage);
firstBtn.addEventListener('click', function(){
    getTable(initId, 1);
});

prevBtn.addEventListener('click', function(){
    getTable(initId, currentPage - 1);
});

nextBtn.addEventListener('click', function(){
    getTable(initId, currentPage + 1);
});

lastBtn.addEventListener('click', function(){
    getTable(initId, totalPages);
});

selectAll.addEventListener('change', function(e){
    selectAll.classList.remove('minus');
    let rowCheckbox = document.querySelectorAll('.checkbox:not(#select-all)');
    rowCheckbox.forEach( (box) => {
        box.checked = selectAll.checked;
    });
});

window.addEventListener('popstate', function(e){
    const id = e.state ? e.state.id : null;
    getTable(id, 1);
});