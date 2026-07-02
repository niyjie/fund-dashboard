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
    .select("*");

    if(error){
        console.error(error);
        return;
    }

    let invested = 0;
    let current = 0;

    let html = "";

    data.forEach(item=>{

        invested += Number(item.amount);
        current += Number(item.current_value);

        const profit =
        item.current_value - item.amount;

        html += `
        <div class="fund-card">

            <h3>${item.fund_name}</h3>

            <p>投入：¥${item.amount}</p>

            <p>当前市值：¥${item.current_value}</p>

            <p>盈利：¥${profit.toFixed(2)}</p>

            <p>日期：${item.invest_date}</p>

        </div>
        `;
    });

    const totalProfit =
    current - invested;

    const rate =
    invested > 0
    ? (totalProfit / invested * 100)
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

    document.getElementById(
        "fundList"
    ).innerHTML =
    html;
};

loadInvestments();
