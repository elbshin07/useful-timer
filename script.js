let timer;
let totalSeconds = 0;
let currentLi = null;

// Chart.js 초기화
const ctx = document.getElementById('timeChart').getContext('2d');
const chartData = {
    labels: [],
    datasets: [
        { label: '공부 과목', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)' },
        { label: '요리/할 일', data: [], backgroundColor: 'rgba(255, 99, 132, 0.6)' }
    ]
};
const timeChart = new Chart(ctx, { type: 'bar', data: chartData, options: { responsive: true, scales: { y: { beginAtZero: true } } } });

function startTimer() {
    const select = document.getElementById('taskSelect');
    const selectedIndex = select.selectedIndex;
    if(selectedIndex <= 0) return alert("과목 또는 요리를 선택하세요.");

    clearInterval(timer);
    const minutes = parseInt(document.getElementById('minutes').value);
    if(isNaN(minutes) || minutes <= 0) return alert("분 단위 입력 필요");

    totalSeconds = minutes * 60;
    currentLi = select.options[selectedIndex].liElement;
    updateTimerDisplay();

    timer = setInterval(() => {
        totalSeconds--;
        if(totalSeconds <= 0) {
            clearInterval(timer);
            alert("시간 종료!");
            addTimeToItem(currentLi, minutes);
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const sec = (totalSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${min}:${sec}`;
}

function addTimeToItem(li, minutes) {
    let text = li.textContent.split(" - ")[0];
    let currentTime = parseFloat(li.dataset.hours || "0");
    currentTime += minutes;
    li.dataset.hours = currentTime;
    li.firstChild.textContent = text + " - " + currentTime + "시간";
    updateChart();
}

function addSubject() {
    const input = document.getElementById('subjectInput');
    const name = input.value.trim();
    if(!name) return;

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = name + " - 0시간";
    li.appendChild(span);
    li.dataset.hours = 0;

    const delBtn = document.createElement('button');
    delBtn.textContent = "삭제";
    delBtn.onclick = () => {
        li.remove();
        removeOption(li);
        updateChart();
    };
    li.appendChild(delBtn);

    document.getElementById('subjectList').appendChild(li);
    addOptionToSelect(name, li);
    input.value = "";
}

function addTask() {
    const input = document.getElementById('taskInput');
    const name = input.value.trim();
    if(!name) return;

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = name + " - 0시간";
    li.appendChild(span);
    li.dataset.hours = 0;

    const delBtn = document.createElement('button');
    delBtn.textContent = "삭제";
    delBtn.onclick = () => {
        li.remove();
        removeOption(li);
        updateChart();
    };
    li.appendChild(delBtn);

    document.getElementById('taskList').appendChild(li);
    addOptionToSelect(name, li);
    input.value = "";
}

function addOptionToSelect(name, li) {
    const option = document.createElement('option');
    option.textContent = name;
    option.liElement = li;
    document.getElementById('taskSelect').appendChild(option);
}

function removeOption(li) {
    const select = document.getElementById('taskSelect');
    for(let i=0; i<select.options.length; i++){
        if(select.options[i].liElement === li){
            select.remove(i);
            break;
        }
    }
}

function updateChart() {
    const subjects = document.getElementById('subjectList').querySelectorAll('li');
    const tasks = document.getElementById('taskList').querySelectorAll('li');

    chartData.labels = [];
    chartData.datasets[0].data = [];
    chartData.datasets[1].data = [];

    subjects.forEach(li => {
        chartData.labels.push(li.firstChild.textContent.split(" - ")[0]);
        chartData.datasets[0].data.push(parseFloat(li.dataset.hours));
    });

    tasks.forEach(li => {
        if(!chartData.labels.includes(li.firstChild.textContent.split(" - ")[0])) {
            chartData.labels.push(li.firstChild.textContent.split(" - ")[0]);
        }
        chartData.datasets[1].data.push(parseFloat(li.dataset.hours));
    });

    timeChart.update();
}