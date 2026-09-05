const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get('/', (req, res) => {
    res.send('Servidor Soolsapp Online');
});

app.post('/api/gerar-relatorio', async (req, res) => {
    const { topico } = req.body;

    if (!topico) {
        return res.status(400).json({
            erro: 'Tópico não informado.'
        });
    }

    if (topico.length > 200) {
        return res.status(400).json({
            erro: 'Tópico muito grande.'
        });
    }

    try {
        const prompt = `
        Gere um relatório educativo em HTML.
        Use apenas as tags:
        <h3>, <p>, <ul> e <li>.
        Não use CSS, JavaScript ou outras tags.
        Tema: "${topico}"
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        res.json({
            html: response.text ?? ''
        });

    } catch (error) {
        console.error('Erro Gemini:', error);

        res.status(500).json({
            erro: 'Erro ao conectar com a IA.'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Soolsapp rodando na porta ${PORT}`);
});
