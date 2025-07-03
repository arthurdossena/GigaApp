// // server.js na sua pasta 'backend'

// // 1. Importa os módulos necessários
// const express = require('express');
// const cors = require('cors'); // Para permitir requisições do seu app Expo
// require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

// // 2. Inicializa o aplicativo Express
// const app = express();

// // 3. Define a porta do servidor
// // Usa a porta do ambiente (ex: para deploy) ou 3000 por padrão
// const PORT = process.env.PORT || 3000;

// // 4. Configura Middlewares
// // a) Middleware para analisar o corpo das requisições JSON
// // Isso permite que o Express entenda os dados JSON enviados do frontend
// app.use(express.json());

// // b) Middleware CORS (Cross-Origin Resource Sharing)
// // Permite que seu app React Native (que roda em uma "origem" diferente) acesse o backend
// app.use(cors());

// // 5. Simulação de um banco de dados em memória
// // IMPORTANTE: Em um aplicativo real, você usaria um banco de dados como MongoDB, PostgreSQL, etc.
// // Os dados neste array serão perdidos toda vez que o servidor for reiniciado.
// let routines = []; // Array para armazenar as rotinas temporariamente

// // 6. Define as Rotas (Endpoints da API)

// // Rota GET: Para obter todas as rotinas
// app.get('/api/routines', (req, res) => {
//     console.log('GET /api/routines - Requisição recebida. Retornando rotinas:', routines.length);
//     // Retorna a lista de rotinas como JSON
//     res.json(routines);
// });

// // Rota POST: Para criar uma nova rotina
// app.post('/api/routines', (req, res) => {
//     // O corpo da requisição (JSON) é acessado via req.body
//     const { title, description, exercises } = req.body;

//     // Validação básica dos dados recebidos
//     if (!title || !description || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
//         console.warn('POST /api/routines - Dados inválidos recebidos:', req.body);
//         return res.status(400).json({ message: 'Título, descrição e pelo menos um exercício são obrigatórios.' });
//     }

//     // Cria um novo objeto de rotina (poderia adicionar um ID único aqui)
//     const newRoutine = {
//         id: routines.length > 0 ? Math.max(...routines.map(r => r.id || 0)) + 1 : 1, // Gera um ID simples
//         title,
//         description,
//         exercises
//     };

//     // Adiciona a nova rotina ao array (simulando salvar no DB)
//     routines.push(newRoutine);
//     console.log('POST /api/routines - Nova rotina salva:', newRoutine);

//     // Retorna a rotina criada com status 201 (Created)
//     res.status(201).json(newRoutine);
// });

// // Rota DELETE: Para limpar todas as rotinas (para fins de teste/desenvolvimento)
// // ATENÇÃO: Use com cautela em produção!
// app.delete('/api/routines', (req, res) => {
//     routines = []; // Limpa o array
//     console.log('DELETE /api/routines - Todas as rotinas foram limpas.');
//     res.status(204).send(); // Retorna status 204 (No Content) para sucesso sem corpo de resposta
// });


// // 7. Inicia o servidor
// app.listen(PORT, () => {
//     console.log(`Servidor Express rodando na porta ${PORT}`);
//     console.log(`Acesse: http://localhost:${PORT}`);
//     console.log(`Endpoints:`);
//     console.log(`  GET /api/routines`);
//     console.log(`  POST /api/routines`);
//     console.log(`  DELETE /api/routines`);
// });

