const SUPABASE_URL = "https://cetpayxtoydyitahhdqh.supabase.co";
const SUPABASE_KEY = "sb_publishable_jIBr6C0-fb6p4x1Ng6gfZw_uDCrsJ1a";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadInvestments() {
    const { data, error } = await supabase
        .from("investments")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    console.log("投资记录", data);
}
