const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;
const AVWX_TOKEN = "7DskonPIuz87tDyH8Y70ltAz38XJ5fLa8i3TvAbhZw8";

app.get("/", async (req, res) => {
  const icao = (req.query.icao || "").toUpperCase();
  if (!icao || icao.length !== 4) {
    return res.status(400).send("ICAO inválido");
  }

  try {
    const apiRes = await axios.get(`https://avwx.rest/api/metar/${icao}`, {
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