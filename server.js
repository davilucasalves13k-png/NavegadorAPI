const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos (HTML, CSS) da pasta raiz do projeto
app.use(express.static(path.join(__dirname)));

// Inicializa o SDK do Gemini (ele puxa automaticamente da variável de ambiente GEMINI_API_KEY no Render)
const ai = new GoogleGenAI({});

// Rota onde o SLZ solicita o relatório gerado por IA
app.post('/api/gerar-relatorio', async (req, res) => {
    const { topico } = req.body;

    if (!topico) {
        return res.status(400).json({ erro: 'Tópico não informado.' });
    }

    try {
        const prompt = `Gere um relatório detalhado, educacional e estruturado em HTML limpo (usando tags <h3>, <p>, <ul> e <li>) sobre o seguinte tema: "${topico}". O relatório faz parte do sistema de análise inteligente SLZ do navegador Soolsapp. Seja direto, informativo e interessante.`;

        // Utilizando o modelo recomendado para tarefas gerais de texto
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ html: response.text });
    } catch (error) {
        console.error("Erro ao gerar com IA:", error);
        res.status(500).json({ erro: 'Erro ao gerar conteúdo com o motor SLZ.' });
    }
});

// Inicializa o servidor na porta do Render ou na porta 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Soolsapp rodando na porta ${PORT}`);
});
