const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // permite chamadas externas como do FlyLive

const PORT = process.env.PORT || 3000;
const AVWX_TOKEN = process.env.AVWX_TOKEN;

app.get("/", async (req, res) => {
  const icao = (req.query.icao || "").toUpperCase();

  if (!icao || icao.length !== 4) {
    return res.status(400).send("ICAO inválido");
  }

  try {
    const apiRes = await axios.get(`https://avwx.rest/api/metar/${icao}`, {
      headers: {
        Authorization: `Bearer ${AVWX_TOKEN}`,
      },
    });

    res.type("text/plain").send(apiRes.data.raw + "\n");
  } catch (err) {
    console.error("Erro ao buscar METAR:", err.response?.data || err.message);
    res.status(500).send("Erro ao buscar METAR");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});