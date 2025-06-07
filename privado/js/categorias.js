const urlBase = "http://localhost:4000/categorias";
const form = document.getElementById("formcadcategorias");
form.onsubmit = manipularSubmissao;
let listaCategorias = [];

function manipularSubmissao (evento) {
    if (form.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const descricao = document.getElementById("descricao").value;
        const faixaEtaria = document.getElementById("faixaEtaria").value;
        const departamento = document.getElementById("departamento").value;
        const categoria = {nome, descricao, faixaEtaria, departamento};
        postCategoria(categoria);
        form.reset();
        exibirTabela();
    }
    evento.preventDefault();
    evento.stopPropagation();
}

function exibirTabela () {
    const divt = document.getElementById("tabela");
    divt.innerHTML = "";

    if (listaCategorias.length == 0)
        divt.innerHTML = "<p>Não há categorias cadastrados.</p>";
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
                <th style="border: 1px solid black">Descricao</th>
                <th style="border: 1px solid black">Faixa Etaria</th>
                <th style="border: 1px solid black">Departamento</th>
            </tr>
        `;

        for (let i = 0; i < listaCategorias.length; i++) {
            const tr = document.createElement("tr");
            tr.id = listaCategorias[i].id;
            tr.innerHTML = `
                <td style="border: 1px solid black">${listaCategorias[i].nome}</td>
                <td style="border: 1px solid black">${listaCategorias[i].descricao}</td>
                <td style="border: 1px solid black">${listaCategorias[i].faixaEtaria}</td>
                <td style="border: 1px solid black">${listaCategorias[i].departamento}</td>
                <td style="border: 1px solid black"><button id="exclusaobutton" onclick="deleteCliente('${listaCategorias[i].id}')">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        }
        
        table.style.border="1px solid black";
        table.style.borderCollapse="collapse";
        table.style.marginTop="3rem";
    }
}

function getCategorias () {
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((categorias) => {
        listaCategorias = categorias;
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao tentar recuperar categorias do servidor.");
    });
}

function postCategoria (categoria) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria)
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((dados) => {
        alert(`Categoria cadastrada com sucesso. ID da categoria: ${dados.id}`);
        listaCategorias.push(categoria);
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar categoria: " + erro);
    });
}

function deleteCategoria (id) {
    if (confirm("Deseja realmente excluir a categoria " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        })
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((dados) => {
            alert("Categoria excluído com sucesso.");
            listaCategorias = listaCategorias.filter((categoria) => {
                return categoria.id != id;
            });
            document.getElementById(id)?.remove();
        })
        .catch((erro) => {
            alert("Erro ao excluir categoria: " + erro);
        });
    }
}

getCategorias();