const urlBase = "http://localhost:4000/fornecedores";
const form = document.getElementById("formcadfornecedores");
form.onsubmit = manipularSubmissao;
let listaFornecedores = [];

function manipularSubmissao (evento) {
    if (form.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const cnpj = document.getElementById("cnpj").value;
        const telefone = document.getElementById("telefone").value;
        const cidade = document.getElementById("cidade").value;
        const estado = document.getElementById("estado").value;
        const fornecedor = {nome, cnpj, telefone, cidade, estado};
        postFornecedor(fornecedor);
        form.reset();
        exibirTabela();
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function exibirTabela () {
    const divt = document.getElementById("tabela");
    divt.innerHTML = "";

    if (listaFornecedores.length == 0)
        divt.innerHTML = "<p>Não há fornecedores cadastrados.</p>";
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
                <th style="border: 1px solid black">CNPJ</th>
                <th style="border: 1px solid black">Telefone</th>
                <th style="border: 1px solid black">Cidade</th>
                <th style="border: 1px solid black">Estado</th>
            </tr>
        `;

        for (let i = 0; i < listaFornecedores.length; i++) {
            const tr = document.createElement("tr");
            tr.id = listaFornecedores[i].id;
            tr.innerHTML = `
                <td style="border: 1px solid black">${listaFornecedores[i].nome}</td>
                <td style="border: 1px solid black">${listaFornecedores[i].cnpj}</td>
                <td style="border: 1px solid black">${listaFornecedores[i].telefone}</td>
                <td style="border: 1px solid black">${listaFornecedores[i].cidade}</td>
                <td style="border: 1px solid black">${listaFornecedores[i].estado}</td>
                <td style="border: 1px solid black"><button id="exclusaobutton" onclick="deleteFornecedor('${listaFornecedores[i].id}')">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        }
        
        table.style.border="1px solid black";
        table.style.borderCollapse="collapse";
        table.style.marginTop="3rem";
    }
}

function getFornecedores () {
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((fornecedores) => {
        listaFornecedores = fornecedores;
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao tentar recuperar fornecedores do servidor.");
    });
}

function postFornecedor (fornecedor) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedor)
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((dados) => {
        alert(`Fornecedor cadastrado com sucesso. ID do fornecedor: ${dados.id}`);
        fornecedor.id = dados.id;
        listaFornecedores.push(fornecedor);
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar fornecedor: " + erro);
    });
}

function deleteFornecedor (id) {
    if (confirm("Deseja realmente excluir o fornecedor " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        })
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((dados) => {
            alert("Fornecedor excluído com sucesso.");
            listaFornecedores = listaFornecedores.filter((fornecedor) => {
                return fornecedor.id != id;
            });
            document.getElementById(id)?.remove();
        })
        .catch((erro) => {
            alert("Erro ao excluir fornecedor: " + erro);
        });
    }
}

getFornecedores();