const urlBase = "http://localhost:4000/entregadores";
const form = document.getElementById("formcadentregadores");
form.onsubmit = manipularSubmissao;
let listaEntregadores = [];

function manipularSubmissao (evento) {
    if (form.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;
        const veiculo = document.getElementById("veiculo").value;
        const modeloVeiculo = document.getElementById("modeloVeiculo").value;
        const entregador = {nome, cpf, telefone, veiculo, modeloVeiculo};
        postEntregador(entregador);
        form.reset();
        exibirTabela();
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function exibirTabela () {
    const divt = document.getElementById("tabela");
    divt.innerHTML = "";

    if (listaEntregadores.length == 0)
        divt.innerHTML = "<p>Não há entregadors cadastrados.</p>";
    else {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        divt.appendChild(table);
        table.appendChild(thead);
        table.appendChild(tbody);

        thead.innerHTML = `
            <tr>
                <th style="border: 1px solid black">Nome</th>
                <th style="border: 1px solid black">CPF</th>
                <th style="border: 1px solid black">Telefone</th>
                <th style="border: 1px solid black">Veiculo</th>
                <th style="border: 1px solid black">Modelo Veiculo</th>
            </tr>
        `;

        for (let i = 0; i < listaEntregadores.length; i++) {
            const tr = document.createElement("tr");
            tr.id = listaEntregadores[i].id;
            tr.innerHTML = `
                <td style="border: 1px solid black">${listaEntregadores[i].nome}</td>
                <td style="border: 1px solid black">${listaEntregadores[i].cpf}</td>
                <td style="border: 1px solid black">${listaEntregadores[i].telefone}</td>
                <td style="border: 1px solid black">${listaEntregadores[i].veiculo}</td>
                <td style="border: 1px solid black">${listaEntregadores[i].modeloVeiculo}</td>
                <td style="border: 1px solid black"><button id="exclusaobutton" onclick="deleteEntregador('${listaEntregadores[i].id}')">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        }
        
        table.style.border="1px solid black";
        table.style.borderCollapse="collapse";
        table.style.marginTop="3rem";
    }
}

function getEntregadores () {
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((entregadores) => {
        listaEntregadores = entregadores;
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao tentar recuperar entregadores do servidor.");
    });
}

function postEntregador (entregador) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(entregador)
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((dados) => {
        alert(`Entregador cadastrado com sucesso. ID do entregador: ${dados.id}`);
        listaEntregadores.push(entregador);
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar entregador: " + erro);
    });
}

function deleteEntregador (id) {
    if (confirm("Deseja realmente excluir o entregador " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        })
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((dados) => {
            alert("Entregador excluído com sucesso.");
            listaEntregadores = listaEntregadores.filter((entregador) => {
                return entregador.id != id;
            });
            document.getElementById(id)?.remove();
        })
        .catch((erro) => {
            alert("Erro ao excluir entregador: " + erro);
        });
    }
}

getEntregadores();