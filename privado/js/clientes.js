const urlBase = "http://localhost:4000/clientes";
const form = document.getElementById("formcadclientes");
form.onsubmit = manipularSubmissao;
let listaClientes = [];

function manipularSubmissao (evento) {
    if (form.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;
        const email = document.getElementById("email").value;
        const cidade = document.getElementById("cidade").value;
        const estado = document.getElementById("estado").value;
        const cep = document.getElementById("cep").value;
        const cliente = {nome, cpf, telefone, email, cidade, estado, cep};
        postCliente(cliente);
        form.reset();
        exibirTabela();
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function exibirTabela () {
    const divt = document.getElementById("tabela");
    divt.innerHTML = "";

    if (listaClientes.length == 0)
        divt.innerHTML = "<p>Não há clientes cadastrados.</p>";
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
                <th style="border: 1px solid black">E-mail</th>
                <th style="border: 1px solid black">Cidade</th>
                <th style="border: 1px solid black">Estado</th>
                <th style="border: 1px solid black">CEP</th>
            </tr>
        `;

        for (let i = 0; i < listaClientes.length; i++) {
            const tr = document.createElement("tr");
            tr.id = listaClientes[i].id;
            tr.innerHTML = `
                <td style="border: 1px solid black">${listaClientes[i].nome}</td>
                <td style="border: 1px solid black">${listaClientes[i].cpf}</td>
                <td style="border: 1px solid black">${listaClientes[i].telefone}</td>
                <td style="border: 1px solid black">${listaClientes[i].email}</td>
                <td style="border: 1px solid black">${listaClientes[i].cidade}</td>
                <td style="border: 1px solid black">${listaClientes[i].estado}</td>
                <td style="border: 1px solid black">${listaClientes[i].cep}</td>
                <td style="border: 1px solid black"><button id="exclusaobutton" onclick="deleteCliente('${listaClientes[i].id}')">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        }
        
        table.style.border="1px solid black";
        table.style.borderCollapse="collapse";
        table.style.marginTop="3rem";
    }
}

function getClientes () {
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((clientes) => {
        listaClientes = clientes;
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao tentar recuperar clientes do servidor.");
    });
}

function postCliente (cliente) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente)
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((dados) => {
        alert(`Cliente cadastrado com sucesso. ID do cliente: ${dados.id}`);
        listaClientes.push(cliente);
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar cliente: " + erro);
    });
}

function deleteCliente (id) {
    if (confirm("Deseja realmente excluir o cliente " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        })
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((dados) => {
            alert("Cliente excluído com sucesso.");
            listaClientes = listaClientes.filter((cliente) => {
                return cliente.id != id;
            });
            document.getElementById(id)?.remove();
        })
        .catch((erro) => {
            alert("Erro ao excluir cliente: " + erro);
        });
    }
}

getClientes();