import express from "express";
import session from "express-session"
import verificarAutenticacao from "./seguranca/autenticacao.js";

const porta = 3000;
const app = express(); 

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

app.post("/login", (requisicao, resposta) =>  {
    const {nomeusuario, senha} = requisicao.body;
    if (nomeusuario == "admin" && senha == "admin") 
    {
        requisicao.session.autenticado = true;
        resposta.redirect("/menu.html");
    } 
    else 
    {
        let conteudo = `
            <!DOCTYPE html>
            <html lang="pt-br">
                <head>
                <meta charset="UTF-8">
                <title>Login</title>
                <link rel="stylesheet" href="css/login.css">
                </head>
                <body>
                    
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