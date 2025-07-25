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
let users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "a",
    routineList: [
      {
        id: 123,
        title: "Routine 1",
        description: "Desc",
        exercises: [ 
            { name: "Exercise 1", sets: 3 },
            { name: "Exercise 2", sets: 4 }
         ]
      }
    ],
    workoutHistory: []
  }
];

// 6. Define as Rotas (Endpoints da API)

// Rota GET: Para obter todas as rotinas
app.get('/api/routines', (req, res) => {
    const { email } = req.query;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(user.routineList);
    console.log(`Rotinas do usuário ${user.name} retornadas com sucesso.`);
});

app.get('/api/username', (req, res) => {
  const { email } = req.query;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
  res.json({ name: user.name });
});

// Register a new user
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ message: 'Email já cadastrado.' });
  }
  users.push({ name, email, password, routineList: [], workoutHistory: [] });
  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  console
});

// Login (simple, no token)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos.' });
  }
  res.json({ name: user.name, email: user.email });
  console.log(`Usuário ${user.name} logado com sucesso.`);
});

// Rota POST: Para criar uma nova rotina ou atualizar uma existente
app.post('/api/routines', (req, res) => {
    // O corpo da requisição (JSON) é acessado via req.body
    const { email, id, title, description, exercises } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

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
        routineIndex = user.routineList.findIndex(r => r.id === id);
    }

    if (routineIndex !== -1) {
        // Atualiza rotina existente
        const updatedRoutine = { id, title, description, exercises };
        user.routineList[routineIndex] = updatedRoutine;
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
        user.routineList.push(newRoutine);
        console.log('POST /api/routines - Nova rotina salva:', newRoutine);
        res.status(201).json(newRoutine); // Retorna 201 Created para nova rotina
    }
});

// NOVO: Rota POST para salvar uma sessão de treino concluída
app.post('/api/history', (req, res) => {
    const { email, title, routineId, date, weightLifted } = req.body;

    // Encontra o usuário
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Validação dos dados
    if (routineId === undefined || !date || weightLifted === undefined) {
        return res.status(400).json({ message: 'Dados do treino incompletos. routineId, date e weightLifted são obrigatórios.' });
    }

    // Cria o novo registro de histórico
    const newHistoryRecord = {
        id: Date.now(), // ID único para o registro do histórico
        title,
        routineId,
        date,
        weightLifted
    };

    // Adiciona o registro ao histórico do usuário
    user.workoutHistory.unshift(newHistoryRecord);

    console.log(`POST /api/history - Histórico salvo para ${user.email}:`, newHistoryRecord);
    res.status(201).json(newHistoryRecord); // Retorna o registro criado com status 201
});

// NOVO: Rota GET para buscar o histórico de treino de um usuário
app.get('/api/history', (req, res) => {
    const { email } = req.query;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    console.log(`GET /api/history - Histórico de ${user.email} retornado com sucesso.`);
    res.status(200).json(user.workoutHistory);
});

// Rota DELETE: Para deletar uma rotina específica por ID
app.delete('/api/routines/:id', (req, res) => {
  const { email } = req.query;
  const routineId = Number(req.params.id);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  const initialLength = user.routineList.length;
  user.routineList = user.routineList.filter(r => r.id !== routineId);

  if (user.routineList.length < initialLength) {
    res.status(204).send();
    console.log(`DELETE /api/routines/${routineId} - Rotina com ID ${routineId} deletada com sucesso.`);
  } else {
    res.status(404).json({ message: 'Rotina não encontrada.' });
    console.log(`DELETE /api/routines/${routineId} - Rotina com ID ${routineId} não encontrada.`);
  }
});

// Rota DELETE ALL: Para limpar todas as rotinas (para fins de teste/desenvolvimento)
// ATENÇÃO: Use com cautela em produção!
app.delete('/api/routines/all', (req, res) => { // Alterado para '/all' para evitar conflito com /:id
    user.forEAch(u => u.routineList = []); // Limpa o array
    console.log('DELETE /api/routines/all - Todas as rotinas foram limpas.');
    res.status(204).send(); // Retorna status 204 (No Content) para sucesso sem corpo de resposta
    console.log('Todas as rotinas foram limpas com sucesso.');
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
    console.log(`  POST /api/register (para registrar um novo usuário)`);
    console.log(`  POST /api/login (para login simples)`);
    console.log(users.length > 0 ? `Usuários registrados: ${users.map(u => u.email).join(', ')}` : 'Nenhum usuário registrado ainda.');
});