import { getDirectory, getDirectoryByParentId } from './service.storage.js';
import { convertDateFormat , toggleCheckbox } from './utils.js';

const selectAllCheckbox = document.getElementById('select-all-checkbox');

function setSingleRow(row, e, checkbox){
    let allRows = document.querySelectorAll('.checkbox:not(#select-all)');
    if(e.target !== checkbox) {
        toggleCheckbox(checkbox);
        allRows.forEach((box) => {
                box.checked = box === checkbox;
        });
    }
    selectAllCheckbox.indeterminate = true;
    const count = document.querySelectorAll('.checkbox:checked:not(#select-all)').length;
    if(count === 0) {
        selectAllCheckbox.indeterminate = false;
    }
}

const tableRowTemplate = document.getElementById('table-row-template');
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
    clickedRow.onclick = function(e){ 
        setSingleRow(clickedRow, e, checkbox);
    };

    clickedRow.ondblclick = function(e){
        if(type === 'directory' && e.target !== checkbox) {
                navigateTable(id);
        }
    };
    return newRow;
}

const pageNumber = document.getElementById('page-number');
function updatePageNumber(currentPage, totalPages) {
    const current = document.createElement('b');
    current.textContent = currentPage;
    pageNumber.replaceChildren(current, ` of ${totalPages}`);
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

const param = new URLSearchParams(window.location.search);
let currentPageId = param.get('entry');

function navigateTable(id){
    const url = new URL(window.location);
    url.searchParams.set('entry', id);
    history.pushState({id}, '', url);
    getTable(id);
}

window.addEventListener('popstate', (e) => {
    const id = e.state ? e.state.id : null;
    getTable(id, currentPage);
});

const tableBody = document.getElementById('table-body');
let currentPage = 1;
let totalPages = 1;
const pageSize = 15;

async function getTable(parentID, page = 1) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    try {        
        const entries = parentID
        ? await getDirectoryByParentId(parentID, { page, pageSize })
        : await getDirectory('/', { page, pageSize });
        if(!Array.isArray(entries.data)) {
            console.warn('Table data not found');
            return;
        }
        const rows = entries.data.map(createRow);
        tableBody.replaceChildren(...rows);
        
        updatePageNumber(entries.pagination.page, entries.pagination.totalPages);
        updateArrowState(entries.pagination.page, entries.pagination.totalPages);

        currentPageId = parentID;
        currentPage = page;
        totalPages = entries.pagination.totalPages;
    } catch(error) {
        console.warn(error);
    }
}

const paginationBtns = [
    { el: firstBtn, getPage: () => 1 },
    { el: lastBtn, getPage: () => totalPages },
    { el: prevBtn, getPage: () => currentPage - 1  },
    { el: nextBtn, getPage: () => currentPage + 1  },
];

function updatePagination(){
    paginationBtns.forEach(({ el,  getPage }) => el
            .addEventListener('click', () => getTable(currentPageId, getPage())));
}

function selectAllRows(e){
    selectAllCheckbox.indeterminate = false;
    let rowCheckbox = document.querySelectorAll('.checkbox:not(#select-all)');
    rowCheckbox.forEach( (box) => {
        box.checked = selectAllCheckbox.checked;
    });
}

getTable(currentPageId);
updatePagination();

selectAllCheckbox.onchange = function(e){
    selectAllRows(e);
};