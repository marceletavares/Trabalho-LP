import express from "express";
import session from "express-session"
import verificarAutenticacao from "./seguranca/autenticacao.js";
const urlBase = "http://localhost:4000/usuarios";

const porta = 3000;
const app = express(); 
let listaUsuarios = [];

app.use(session({
    secret: "senha",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true
    }
}));

app.use(express.urlencoded({extended: true})); 

app.use(express.static("publico"));

function getUsuarios () {
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((usuarios) => {
        listaUsuarios = usuarios;
    })
    .catch((erro) => {
        console.log("Erro ao tentar recuperar usuarios do servidor.");
    });
}

app.get("/login", (requisicao, resposta) => {
    getUsuarios();
    resposta.redirect("/login.html"); 
    resposta.end();
});

app.post("/login", (requisicao, resposta) =>  {
    const {nomeusuario, senha} = requisicao.body;
    for (let i = 0; i < listaUsuarios.length; i++)
        if (nomeusuario == listaUsuarios[i].nomeusuario && senha == listaUsuarios[i].senha)
            requisicao.session.autenticado = true;
    if (requisicao.session.autenticado)
        resposta.redirect("/menu.html");
    else
    {
        let conteudo = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
            <link rel="stylesheet" href="/css/login.css">
            <title>Login</title>
        </head>
        <body>
            <main class="container">
                <form method="POST" action="/login">
                    <h1>Login</h1>
                    <div class="input-box ib1">
                        <input placeholder="Usuário" type="text" name="nomeusuario">
                        <i class="bx bxs-user"></i>
                    </div>
                    <div class="input-box ib2">
                        <input placeholder="Senha" type="password" id="input2" name="senha">
                        <i class="bx bxs-lock-alt"></i>
                    </div>

                    <button type="submit" class="login" id="meuBotao">Login</button>

                    <div class="register-link">
                        <p>Não tem uma conta? <a href="/cadastro.html">Cadastre-se</a></p>
                    </div>
                    <p>Dados incorretos!</p>
                </form>
            </main>
        </body>
        </html>
        `;
        resposta.send(conteudo);
    }
});

app.use(verificarAutenticacao, express.static("privado"));

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy(); 
    resposta.redirect("/index.html"); 
    resposta.end();
});

app.listen(porta, () => {
    console.log(`Servidor em execução na porta ${porta}.`);
});