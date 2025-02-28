// 学校のリスト（学校名とMAX台数）
const schools = [
  { name: "八学中男子", firstMax: 6, secondMax: 0 },
  { name: "大館東中男子", firstMax: 5, secondMax: 0 },
  { name: "大館東中女子", firstMax: 5, secondMax: 0 },
  { name: "大野中男子", firstMax: 3, secondMax: 1 },
  { name: "久慈中女子", firstMax: 3, secondMax: 1 },
  { name: "上田中男子", firstMax: 2, secondMax: 1 },
  { name: "滝沢南中女子", firstMax: 1, secondMax: 2 },
  { name: "滝沢第二中男子", firstMax: 1, secondMax: 2 },
  { name: "葛巻中男子", firstMax: 0, secondMax: 1 },
  { name: "滝沢第二中女子", firstMax: 1, secondMax: 2 },
];

// ローカルストレージから取得 or 初期化
let parkingData = JSON.parse(localStorage.getItem("parkingData")) || {};
let carNumbers = JSON.parse(localStorage.getItem("carNumbers")) || [];

schools.forEach((school) => {
  if (!parkingData[school.name]) {
    parkingData[school.name] = { first: 0, second: 0 };
  }
});

// HTMLに学校ごとの駐車場情報を表示
const parkingLots = document.getElementById("parking-lots");
schools.forEach((school) => {
  const div = document.createElement("div");
  div.className = "parking-card";
  div.id = `school-${school.name}`;

  if (school.firstMax === 0) {
    div.innerHTML = `
        <h2>${school.name}</h2>
        <div id="second-${school.name}" class="parking-lot mt-3">
            <h3>第二駐車場（MAX: ${school.secondMax}台）</h3>
            <div class="counter">
                <button class="btn btn-danger" onclick="updateCount('${
                  school.name
                }', 'second', -1)">－</button>
                <span id="second-count-${school.name}" class="fw-bold">${
      parkingData[school.name].second
    }</span>
                <button class="btn btn-primary" onclick="updateCount('${
                  school.name
                }', 'second', 1)">＋</button>
            </div>
        </div>
    `;
    parkingLots.appendChild(div);
    checkFull(school.name, "second");
  } else if (school.secondMax === 0) {
    div.innerHTML = `
    <h2>${school.name}</h2>
    <div id="first-${school.name}" class="parking-lot">
        <h3>第一駐車場（MAX: ${school.firstMax}台）</h3>
        <div class="counter">
            <button class="btn btn-danger" onclick="updateCount('${
              school.name
            }', 'first', -1)">－</button>
            <span id="first-count-${school.name}" class="fw-bold">${
      parkingData[school.name].first
    }</span>
            <button class="btn btn-primary" onclick="updateCount('${
              school.name
            }', 'first', 1)">＋</button>
        </div>
    </div>
`;
    parkingLots.appendChild(div);
    checkFull(school.name, "first");
  } else {
    div.innerHTML = `
    <h2>${school.name}</h2>
    <div id="first-${school.name}" class="parking-lot">
        <h3>第一駐車場（MAX: ${school.firstMax}台）</h3>
        <div class="counter">
            <button class="btn btn-danger" onclick="updateCount('${
              school.name
            }', 'first', -1)">－</button>
            <span id="first-count-${school.name}" class="fw-bold">${
      parkingData[school.name].first
    }</span>
            <button class="btn btn-primary" onclick="updateCount('${
              school.name
            }', 'first', 1)">＋</button>
        </div>
    </div>

    <div id="second-${school.name}" class="parking-lot mt-3">
        <h3>第二駐車場（MAX: ${school.secondMax}台）</h3>
        <div class="counter">
            <button class="btn btn-danger" onclick="updateCount('${
              school.name
            }', 'second', -1)">－</button>
            <span id="second-count-${school.name}" class="fw-bold">${
      parkingData[school.name].second
    }</span>
            <button class="btn btn-primary" onclick="updateCount('${
              school.name
            }', 'second', 1)">＋</button>
        </div>
    </div>
`;
    parkingLots.appendChild(div);
    checkFull(school.name, "first");
    checkFull(school.name, "second");
  }
});

// カウント更新
function updateCount(schoolName, lot, change) {
  const max = schools.find((s) => s.name === schoolName)[lot + "Max"];
  if (
    parkingData[schoolName][lot] + change >= 0 &&
    parkingData[schoolName][lot] + change <= max
  ) {
    parkingData[schoolName][lot] += change;
    document.getElementById(`${lot}-count-${schoolName}`).textContent =
      parkingData[schoolName][lot];
    localStorage.setItem("parkingData", JSON.stringify(parkingData));
    checkFull(schoolName, lot);
  }
}

// 満車チェック（駐車場ごとに適用）
function checkFull(schoolName, lot) {
  const isFull =
    parkingData[schoolName][lot] >=
    schools.find((s) => s.name === schoolName)[lot + "Max"];
  const div = document.getElementById(`${lot}-${schoolName}`);
  if (isFull) {
    div.classList.add("full");
  } else {
    div.classList.remove("full");
  }
}

// ナンバー追加
function addCarNumber() {
  const input = document.getElementById("car-number");
  const number = input.value.trim();
  if (number !== "") {
    carNumbers.push(number);
    localStorage.setItem("carNumbers", JSON.stringify(carNumbers));
    input.value = "";
    updateCarList();
  }
}

// ナンバーリスト更新
function updateCarList() {
  const list = document.getElementById("car-list");
  list.innerHTML = "";
  carNumbers.forEach((number, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `${number} <button class="btn btn-sm btn-danger btn-memo" onclick="removeCarNumber(${index})">削除</button>`;
    list.appendChild(li);
  });
}

// ナンバー削除
function removeCarNumber(index) {
  carNumbers.splice(index, 1);
  localStorage.setItem("carNumbers", JSON.stringify(carNumbers));
  updateCarList();
}

// 初回読み込み時にナンバーリストを表示
updateCarList();

// リセット機能
document.getElementById("reset").addEventListener("click", () => {
  localStorage.removeItem("parkingData");
  localStorage.removeItem("carNumbers");
  location.reload();
});
