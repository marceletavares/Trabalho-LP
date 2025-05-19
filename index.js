import express from 'express';
//import session from 'express-session';

const porta = 3000;
const app = express();

app.listen(porta, () => {
    console.log(`Servidor em execução na porta ${porta}.`);
});