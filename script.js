let H, W;

function buildTableHTML(tableName) {
    html = '<tbody>';
    for (let i = 0; i < H; i++) {
        html += '<tr>';
        for (let j = 0; j < W; j++) {
            let tval = i * W + j + 1;
            let val = tval == H * W ? "" : tval.toString();
            html += `<td><input class="${tableName}" id="${tableName}-${i}-${j}"
                         value="${val}" onclick="slide('${tableName}', ${i}, ${j})"></td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';
    return html;
}

function getTableValue(tableName, i, j) {
    const id = `${tableName}-${i}-${j}`;
    const val = document.getElementById(id).value;
    return val;
}

function setTableValue(tableName, i, j, val) {
    const id = `${tableName}-${i}-${j}`;
    document.getElementById(id).value = val;
}

function tableToArray(tableName) {
    let table = []
    for (let i = 0; i < H; i++) {
        table.push([]);
        for (let j = 0; j < W; j++) {
            const val = getTableValue(tableName, i, j);
            table[table.length - 1].push(val);
        }
    }
    return table;
}

function updateMatrixSize() {
    H = parseInt(document.getElementById('number-of-row').value, 10);
    W = parseInt(document.getElementById('number-of-coulmn').value, 10);
    document.getElementById('current-matrix').innerHTML = buildTableHTML('cur', H, W);
    document.getElementById('goal-matrix').innerHTML = buildTableHTML('goal', H, W);
    updateDistance();
}

const dx = [1, 0, 0, -1];
const dy = [0, -1, 1, 0];
let slideMode = true;

function toggleSlideMode() {
    if(slideMode) {
        document.getElementById('toggle').innerHTML = 'Slide: OFF';
        slideMode = false;
    } else {
        document.getElementById('toggle').innerHTML = 'Slide: ON';
        slideMode = true;
    }
}

function slide(tableName, x, y) {
    if(!slideMode) return;
    if(tableName !== 'cur') return;
    const cur = tableToArray('cur');
    for(let k = 0; k < 4; k++) {
        let i = x + dx[k], j = y + dy[k];
        if(i < 0 || i >= H || j < 0 || j >= W) continue;
        if(cur[i][j] == "") {
            setTableValue('cur', i, j, cur[x][y]);
            setTableValue('cur', x, y, cur[i][j]);
            break;
        }
    }
    updateDistance();
}

function updateDistance() {
    let ans = 0;
    const cur = tableToArray('cur');
    const goal = tableToArray('goal');
    let obj = new Object();

    for (let i = 0; i < H; i++) { 
        for (let j = 0; j < W; j++) {
            obj[goal[i][j]] = {x: i, y: j};
        }
    }

    for (let i = 0; i < H; i++) { 
        for (let j = 0; j < W; j++) {
            if(obj[cur[i][j]]) {
                if(cur[i][j] == "") continue;
                ans += Math.abs(obj[cur[i][j]].x - i) + Math.abs(obj[cur[i][j]].y - j);
            } else {
                document.getElementById('distance').innerHTML = 'ERROR!';
            }
        }
    }

    document.getElementById('distance').innerHTML = ans;
}

onload = updateMatrixSize;
