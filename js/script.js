/* CONST variables */

const table = document.getElementById('result_table');
const form = document.getElementById('form');
const err_string = document.querySelector('#error_string p');


/* Event Listeners */

document.addEventListener('DOMContentLoaded', function () {
    displayResults();
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let x = document.querySelector('input[name="x"]:checked').value;
    let y = document.querySelector('input[name="y"]').value;
    let r = document.querySelector('input[name="r"]').value;
    let timezone = new Date().getTimezoneOffset();
    timezone = (timezone === 0 ? 0 : -timezone);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `php/index.php?x=${x}&y=${y}&r=${r}&timezone=${timezone}`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                displayResults();
                form.reset();
                buttonIsActive(false);
            }
            else {
                let err = JSON.parse(xhr.responseText);
                showError(err.message, 2.5);
            }
        }
    }
    xhr.send();

});

/* Table and results manipulations */

function clearTable() {
    table.innerHTML = `
        <tr>
            <th>X</th>
            <th>Y</th>
            <th>R</th>
            <th>Когда выполнялся</th>
            <th>Время выполнения, sec</th>
            <th>Результат</th>
        </tr>
    `;

}
function putRowInTable(data){
    let row = document.createElement('tr');
    row.innerHTML = `
            <td>${data.x}</td>
            <td>${data.y}</td>
            <td>${data.r}</td>
            <td>${data.currentTime}</td>
            <td>${data.executionTime}</td>
            <td>${data.result}</td>`;
    table.appendChild(row);
}

function displayResults() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/get_results.php', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                clearTable();
                let previousResults = JSON.parse(xhr.responseText);
                previousResults.forEach(row => {
                    putRowInTable(row);
                });
            } else {
                let err = JSON.parse(xhr.responseText);
                showError(err.message, 2.5);
            }
        }
    };
    xhr.send();

}

function clearResults() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/clear_results.php', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                clearTable();
            } else {
                let err = JSON.parse(xhr.responseText);
                showError(err.message, 2.5);
            }
        }
    }
    xhr.send();
}

/* validating */

function validateY() {
    let y = document.querySelector('input[name="y"]').value;
    return -5 <= y && y <= 5;

}
function validateR() {
    let r = document.querySelector('input[name="r"]').value.replace(',','.');
    return 2 <= r && r <= 5;

}
function validate() {
    let y = validateY().valueOf();
    let r = validateR().valueOf();
    buttonIsActive((y && r));
}


/* disable or enable button 'Отправить' */

function buttonIsActive(b) {
    document.getElementById("send").disabled = !b;
}

/* print message in error_string div and remove it after s seconds*/

function showError(message, s) {
    err_string.innerHTML = message;
    setTimeout(hideError, s * 1000);
    form.reset();
}

function hideError() {
    err_string.innerHTML = '';
}