const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;
const AVWX_TOKEN = process.env.AVWX_TOKEN;

if (!AVWX_TOKEN) {
  console.error("Defina a variável de ambiente AVWX_TOKEN antes de iniciar.");
  process.exit(1);
}

app.get("/", async (req, res) => {
  const icao = String(req.query.icao || "").toUpperCase();
  if (!/^[A-Z0-9]{4}$/.test(icao)) {
    return res.status(400).send("ICAO inválido");
  }

  try {
    const apiRes = await axios.get(`https://avwx.rest/api/metar/${icao}`, {
      timeout: 10000,
      headers: { Authorization: `Bearer ${AVWX_TOKEN}` },
    });
    res.type("text/plain").send(apiRes.data.raw + "\n");
  } catch (err) {
    res.status(500).send("Erro ao buscar METAR");
  }
});

app.get("/progress", (req, res) => {
  const total = parseFloat(req.query.total);
  const remaining = parseFloat(req.query.remaining);

  if (isNaN(total) || isNaN(remaining) || total === 0) {
    return res.send("Não foi possível calcular o progresso.");
  }

  const completed = ((total - remaining) / total) * 100;
  const percent = completed.toFixed(1);

  res.send(`Progresso do voo: ${percent}% completo`);
});

app.listen(PORT, () => console.log(`🚀 rodando na porta ${PORT}`));