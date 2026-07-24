import { getDirectory } from './service.storage.js';

const tableBody = document.getElementById('table-body');
const pageNum = document.getElementById('page-number');
const firstBtn = document.getElementById('first-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const lastBtn = document.getElementById('last-btn');

function convertDateFormat(date){
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    
    return formattedDate;
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
    uploadDate.append(convertDateFormat(data.createdAt));
    
    const size = document.createElement('td');
    size.append(data.size === 0 ? '--' : data.size);
    
    const actionColumn = document.createElement('td');
    actionColumn.className ='action-td';
    
    const actionButton = document.createElement('button');
    actionButton.className = 'action-button';
    actionButton.type = 'button';
    
    const actionIcon = document.createElement('i');
    actionIcon.className = "fa-solid fa-ellipsis-vertical";
    actionButton.appendChild(actionIcon);
    actionColumn.appendChild(actionButton);
    
    const row = document.createElement('tr');
    row.className = 'table-row';
    // `${data.id}-row`
    
    row.addEventListener("dblclick", function(e){
        if(data.type === 'directory'){
            getTable(data.path);
        }
    });

    row.append(checkboxCol, entryName, uploadDate, size, actionColumn);
    return row;
}

function pageNumber(current, total){
    const pageNum = document.createElement('span');
    const curr = document.createElement('b');
    curr.textContent = current;
    pageNum.appendChild(curr);
    pageNum.append( " of " + total);
    return pageNum;
}

async function getTable(path) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    try {
        const entries = await getDirectory(path);
        if(!Array.isArray(entries.data)) {
            console.warn('Table data not found');
            return;
        }
        const fragment = document.createDocumentFragment();
        entries.data.forEach((item) => fragment.appendChild(createRow(item)));
        tableBody.append(fragment);

        const currentPage = (await getDirectory(path)).pagination.page;
        const totalPage = (await getDirectory(path)).pagination.totalPages;
    } catch(error) {
        console.warn(error);
    }
}

getTable('/');