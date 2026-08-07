export function convertDateFormat(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    return formattedDate;
}

export function toggleCheckbox(checkbox) {
    checkbox.checked = !checkbox.checked;
}