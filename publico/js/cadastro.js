const urlBase = "http://localhost:4000/usuarios";
const form = document.getElementById("formcadusuarios");
form.onsubmit = manipularSubmissao;
let listaUsuarios = [];

function manipularSubmissao (evento) {
    if (form.checkValidity()) {
        const nomeusuario = document.getElementById("nomeusuario").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const usuario = {nomeusuario, email, senha};
        postUsuario(usuario);
        form.reset();
    }
    evento.preventDefault();
    evento.stopPropagation();
}

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
        alert("Erro ao tentar recuperar usuarios do servidor.");
    });
}

function postUsuario (usuario) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario)
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((dados) => {
        alert("Cadastro realizado com sucesso.");
        listaUsuarios.push(usuario);
    })
    .catch((erro) => {
        alert("Erro ao realizar cadastro: " + erro);
    });
}

getUsuarios();