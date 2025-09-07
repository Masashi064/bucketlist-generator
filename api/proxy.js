export default async function handler(req, res) {
  const r = await fetch("https://script.google.com/macros/s/AKfycbxaTaqOk5Ctyl3U2k-dVR5MWCsLQG0dBtJfEAsp5dt23hAhu70pQgwkl43m_PzvXtit/exec", {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
  });

  const data = await r.json();
  res.setHeader("Access-Control-Allow-Origin", "*"); // CORS許可
  res.status(200).json(data);
}
