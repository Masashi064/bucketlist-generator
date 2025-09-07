export default async function handler(req, res) {
  // GASのエンドポイント
  const baseUrl = "https://script.google.com/macros/s/AKfycbxaTaqOk5Ctyl3U2k-dVR5MWCsLQG0dBtJfEAsp5dt23hAhu70pQgwkl43m_PzvXtit/exec";

  // GETとPOSTで処理を分ける
  let fetchUrl = baseUrl;
  let options = { method: req.method, headers: { "Content-Type": "application/json" } };

  if (req.method === "GET") {
    // クエリパラメータをそのまま付与
    const query = req.url.split("?")[1];
    if (query) fetchUrl += "?" + query;
  } else if (req.method === "POST") {
    options.body = JSON.stringify(req.body);
  }

  try {
    const r = await fetch(fetchUrl, options);
    const data = await r.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
