// server.js na sua pasta 'backend'

// 1. Importa os módulos necessários
const express = require('express');
const cors = require('cors'); // Para permitir requisições do seu app Expo
require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

// 2. Inicializa o aplicativo Express
const app = express();

// 3. Define a porta do servidor
// Usa a porta do ambiente (ex: para deploy) ou 3000 por padrão
const PORT = process.env.PORT || 3000;

// 4. Configura Middlewares
// a) Middleware para analisar o corpo das requisições JSON
// Isso permite que o Express entenda os dados JSON enviados do frontend
app.use(express.json());

// b) Middleware CORS (Cross-Origin Resource Sharing)
// Permite que seu app React Native (que roda em uma "origem" diferente) acesse o backend
app.use(cors());

// 5. Simulação de um banco de dados em memória
// Os dados neste array serão perdidos toda vez que o servidor for reiniciado.
let routines = []; // Array para armazenar as rotinas temporariamente

// 6. Define as Rotas (Endpoints da API)

// Rota GET: Para obter todas as rotinas
app.get('/api/routines', (req, res) => {
    console.log('GET /api/routines - Requisição recebida. Retornando rotinas:', routines.length);
    // Retorna a lista de rotinas como JSON
    res.json(routines);
});

// Rota POST: Para criar uma nova rotina ou atualizar uma existente
app.post('/api/routines', (req, res) => {
    // O corpo da requisição (JSON) é acessado via req.body
    const { id, title, description, exercises } = req.body;

    // Validação básica dos dados recebidos
    if (!title || !description || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
        console.warn('POST /api/routines - Dados básicos inválidos recebidos:', req.body);
        return res.status(400).json({ message: 'Título, descrição e pelo menos um exercício são obrigatórios.' });
    }

    // Validação da estrutura dos exercícios (name e sets)
    const invalidExercises = exercises.some(ex => 
        !ex.name || typeof ex.name !== 'string' || ex.name.trim() === '' ||
        !ex.sets || typeof ex.sets !== 'number' || ex.sets <= 0
    );

    if (invalidExercises) {
        console.warn('POST /api/routines - Estrutura de exercícios inválida:', req.body);
        return res.status(400).json({ message: 'Cada exercício deve ter um nome (string não vazio) e sets (número maior que 0).' });
    }

    let routineIndex = -1;
    if (id) {
        routineIndex = routines.findIndex(r => r.id === id);
    }

    if (routineIndex !== -1) {
        // Atualiza rotina existente
        const updatedRoutine = { id, title, description, exercises };
        routines[routineIndex] = updatedRoutine;
        console.log('POST /api/routines - Rotina atualizada:', updatedRoutine);
        res.status(200).json(updatedRoutine); // Retorna 200 OK para atualização
    } else {
        // Cria nova rotina
        const newRoutine = {
            id: Date.now(), // Gera um ID único baseado no timestamp
            title,
            description,
            exercises
        };
        routines.push(newRoutine);
        console.log('POST /api/routines - Nova rotina salva:', newRoutine);
        res.status(201).json(newRoutine); // Retorna 201 Created para nova rotina
    }
});

// Rota DELETE: Para deletar uma rotina específica por ID
app.delete('/api/routines/:id', (req, res) => {
    const routineId = Number(req.params.id); // Converte o ID da URL para número

    if (isNaN(routineId)) {
        console.warn('DELETE /api/routines/:id - ID inválido fornecido:', req.params.id);
        return res.status(400).json({ message: 'ID da rotina inválido.' });
    }

    const initialLength = routines.length;
    routines = routines.filter(r => r.id !== routineId);

    if (routines.length < initialLength) {
        console.log(`DELETE /api/routines/${routineId} - Rotina deletada com sucesso.`);
        res.status(204).send(); // Retorna 204 No Content para sucesso sem corpo
    } else {
        console.warn(`DELETE /api/routines/${routineId} - Rotina não encontrada.`);
        res.status(404).json({ message: 'Rotina não encontrada.' }); // Retorna 404 Not Found
    }
});

// Rota DELETE ALL: Para limpar todas as rotinas (para fins de teste/desenvolvimento)
// ATENÇÃO: Use com cautela em produção!
app.delete('/api/routines/all', (req, res) => { // Alterado para '/all' para evitar conflito com /:id
    routines = []; // Limpa o array
    console.log('DELETE /api/routines/all - Todas as rotinas foram limpas.');
    res.status(204).send(); // Retorna status 204 (No Content) para sucesso sem corpo de resposta
});


// 7. Inicia o servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  GET /api/routines`);
    console.log(`  POST /api/routines (para criar ou atualizar)`);
    console.log(`  DELETE /api/routines/:id (para deletar uma rotina específica)`);
    console.log(`  DELETE /api/routines/all (para limpar todas as rotinas)`);
});
