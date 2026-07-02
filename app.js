const SUPABASE_URL =
"https://cetpayxtoydyitahhdqh.supabase.co";

const SUPABASE_KEY =
"sb_publishable_jIBr6C0-fb6p4x1Ng6gfZw_uDCrsJ1a";

const sbClient =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

let investmentData = [];

async function loadInvestments() {

const { data, error } =
await sbClient
.from("investments")
.select("*")
.order("invest_date",{ascending:false});

if(error){
console.error(error);
return;
}

investmentData = data;

let invested = 0;
let current = 0;

const fundMap = {};

data.forEach(item=>{

invested += Number(item.amount);
current += Number(item.current_value);

if(!fundMap[item.fund_name]){

fundMap[item.fund_name] = {
amount:0,
current:0,
count:0
};

}

fundMap[item.fund_name].amount += Number(item.amount);
fundMap[item.fund_name].current += Number(item.current_value);
fundMap[item.fund_name].count++;

});

const totalProfit = current - invested;

const rate =
invested > 0
? totalProfit / invested * 100
: 0;

document.getElementById("totalInvested").innerText =
"¥" + invested.toFixed(2);

document.getElementById("currentValue").innerText =
"¥" + current.toFixed(2);

document.getElementById("profit").innerText =
"¥" + totalProfit.toFixed(2);

document.getElementById("profitRate").innerText =
rate.toFixed(2) + "%";

let html = "";

Object.keys(fundMap).forEach(name=>{

const item = fundMap[name];

const profit =
item.current - item.amount;

html += `
<div class="fund-card">

<h3>${name}</h3>

<p>累计投入：¥${item.amount.toFixed(2)}</p>

<p>当前市值：¥${item.current.toFixed(2)}</p>

<p>累计盈利：¥${profit.toFixed(2)}</p>

<p>记录数：${item.count}</p>

</div>
`;

});

document.getElementById(
"summaryFunds"
).innerHTML = html;

initCalendar();
}

function initCalendar(){

const yearSelect =
document.getElementById("calendarYear");

const monthSelect =
document.getElementById("calendarMonth");

yearSelect.innerHTML = "";
monthSelect.innerHTML = "";

for(let y=2025;y<=2035;y++){

yearSelect.innerHTML +=
`<option value="${y}">${y}年</option>`;

}

for(let m=1;m<=12;m++){

monthSelect.innerHTML +=
`<option value="${m}">${m}月</option>`;

}

const now = new Date();

yearSelect.value =
now.getFullYear();

monthSelect.value =
now.getMonth()+1;

yearSelect.onchange =
renderCalendar;

monthSelect.onchange =
renderCalendar;

renderCalendar();
}

function renderCalendar(){

const year =
Number(
document.getElementById(
"calendarYear"
).value
);

const month =
Number(
document.getElementById(
"calendarMonth"
).value
);

const firstDay =
new Date(year,month-1,1)
.getDay();

const daysInMonth =
new Date(year,month,0)
.getDate();

let html = "";

const weekNames = [
"日","一","二","三","四","五","六"
];

weekNames.forEach(day=>{

html += `
<div class="calendar-header">
${day}
</div>
`;

});

for(let i=0;i<firstDay;i++){

html += `<div></div>`;

}

for(let day=1;day<=daysInMonth;day++){

const dateString =
`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

const records =
investmentData.filter(
x=>x.invest_date===dateString
);

const hasRecord =
records.length > 0;

html += `
<div
class="calendar-day ${hasRecord ? 'has-record' : ''}"
onclick="showDay('${dateString}')"
>

<div class="day-number">
${day}
</div>

</div>
`;

}

document.getElementById(
"calendar"
).innerHTML =
html;
}

window.showDay =
function(date){

const records =
investmentData.filter(
x=>x.invest_date===date
);

let total = 0;

let html =
`<div class="fund-card">

<h3>${date}</h3>
`;

records.forEach(item=>{

total += Number(item.amount);

html += `
<p>${item.fund_name}</p>

<p>投入：¥${item.amount}</p>

<p>当前市值：¥${item.current_value}</p>

<hr>
`;

});

html += `
<h3>
当日投入总额：
¥${total}
</h3>
`;

html += "</div>";

document.getElementById(
"dayDetail"
).innerHTML =
html;
}

window.saveInvestment =
async function(){

const fund_name =
document.getElementById(
"fundName"
).value;

const amount =
Number(
document.getElementById(
"amount"
).value
);

const current_value =
Number(
document.getElementById(
"currentValueInput"
).value
);

const invest_date =
document.getElementById(
"investDate"
).value;

const { error } =
await sbClient
.from("investments")
.insert([
{
fund_name,
amount,
current_value,
invest_date
}
]);

if(error){

alert("保存失败");

console.error(error);

return;
}

alert("保存成功");

loadInvestments();
};

loadInvestments();
