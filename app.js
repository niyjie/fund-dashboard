const SUPABASE_URL = "https://cetpayxtoydyitahhdqh.supabase.co";

const SUPABASE_KEY =
"sb_publishable_jIBr6C0-fb6p4x1Ng6gfZw_uDCrsJ1a";

const sbClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

window.loadInvestments = async function () {

  console.clear();

  console.log("开始连接数据库...");

  const { data, error } = await sbClient
    .from("investments")
    .select("*");

  if (error) {
    console.error("数据库错误：", error);
    return;
  }

  console.log("读取成功：");

  console.table(data);

  alert(
    "数据库连接成功\n\n记录数：" +
    data.length
  );
};
