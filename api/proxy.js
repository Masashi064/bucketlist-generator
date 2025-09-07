export default async function handler(req, res) {
  const baseUrl = "https://script.google.com/macros/s/AKfycbxaTaqOk5Ctyl3U2k-dVR5MWCsLQG0dBtJfEAsp5dt23hAhu70pQgwkl43m_PzvXtit/exec";

  let fetchUrl = baseUrl;
  const options = { method: req.method, headers: { "Content-Type": "application/json" } };

  if (req.method === "GET") {
    // クエリパラメータを付与
    const query = req.url.split("?")[1];
    if (query) fetchUrl += "?" + query;
  } else if (req.method === "POST") {
    options.body = JSON.stringify(req.body);
  }

  try {
    const r = await fetch(fetchUrl, options);
    const text = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");

    // GASは sometimes text を返すので、まずJSONとしてparseを試みる
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch {
      res.status(200).send(text);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
