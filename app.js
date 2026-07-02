const SUPABASE_URL =
"https://cetpayxtoydyitahhdqh.supabase.co";

const SUPABASE_KEY =
"sb_publishable_jIBr6C0-fb6p4x1Ng6gfZw_uDCrsJ1a";

const sbClient =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.loadInvestments = async function () {

    const { data, error } =
    await sbClient
    .from("investments")
    .select("*")
    .order("invest_date",{ascending:false});

    if(error){
        console.error(error);
        return;
    }

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

        fundMap[item.fund_name].amount +=
        Number(item.amount);

        fundMap[item.fund_name].current +=
        Number(item.current_value);

        fundMap[item.fund_name].count += 1;
    });

    const totalProfit =
    current - invested;

    const rate =
    invested > 0
    ? totalProfit / invested * 100
    : 0;

    document.getElementById(
        "totalInvested"
    ).innerText =
    "¥" + invested.toFixed(2);

    document.getElementById(
        "currentValue"
    ).innerText =
    "¥" + current.toFixed(2);

    document.getElementById(
        "profit"
    ).innerText =
    "¥" + totalProfit.toFixed(2);

    document.getElementById(
        "profitRate"
    ).innerText =
    rate.toFixed(2) + "%";

    let summaryHtml = "";

    Object.keys(fundMap).forEach(name=>{

        const item = fundMap[name];

        const profit =
        item.current - item.amount;

        summaryHtml += `
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
    ).innerHTML =
    summaryHtml;

    let historyHtml = "";

    data.forEach(item=>{

        const profit =
        item.current_value - item.amount;

        historyHtml += `
        <div class="fund-card">

        <h3>${item.fund_name}</h3>

        <p>投入：¥${item.amount}</p>

        <p>当前市值：¥${item.current_value}</p>

        <p>盈利：¥${profit.toFixed(2)}</p>

        <p>日期：${item.invest_date}</p>

        </div>
        `;
    });

    document.getElementById(
        "historyList"
    ).innerHTML =
    historyHtml;
};

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
