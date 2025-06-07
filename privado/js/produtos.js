const urlBase = "http://localhost:4000/produtos";
const form = document.getElementById("formcadprodutos");
form.onsubmit = manipularSubmissao;
let listaProdutos = [];

function manipularSubmissao (evento) {
    if (form.checkValidity()) {
        const nome = document.getElementById("nome").value;
        const preco = document.getElementById("preco").value;
        const estoque = document.getElementById("estoque").value;
        const linkImagem = document.getElementById("linkImagem").value;
        const categoria = document.getElementById("categoria").value;
        const fornecedor = document.getElementById("fornecedor").value;
        const produto = {nome, preco, estoque, linkImagem, categoria, fornecedor};
        postProduto(produto);
        form.reset();
        exibirTabela();
    }
    evento.preventDefault();
    evento.stopPropagation();
}
function exibirTabela () {
    const divt = document.getElementById("tabela");
    divt.innerHTML = "";

    if (listaProdutos.length == 0)
        divt.innerHTML = "<p>Não há produtos cadastrados.</p>";
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
                <th style="border: 1px solid black">Preço</th>
                <th style="border: 1px solid black">Estoque</th>
                <th style="border: 1px solid black">Link Imagem</th>
                <th style="border: 1px solid black">Categoria</th>
                <th style="border: 1px solid black">Fornecedor</th>
            </tr>
        `;

        for (let i = 0; i < listaProdutos.length; i++) {
            const tr = document.createElement("tr");
            tr.id = listaProdutos[i].id;
            tr.innerHTML = `
                <td style="border: 1px solid black">${listaProdutos[i].nome}</td>
                <td style="border: 1px solid black">${listaProdutos[i].preco}</td>
                <td style="border: 1px solid black">${listaProdutos[i].estoque}</td>
                <td style="border: 1px solid black">${listaProdutos[i].linkImagem}</td>
                <td style="border: 1px solid black">${listaProdutos[i].categoria}</td>
                <td style="border: 1px solid black">${listaProdutos[i].fornecedor}</td>
                <td style="border: 1px solid black"><button id="exclusaobutton" onclick="deleteProduto('${listaProdutos[i].id}')">Excluir</button></td>
            `;
            tbody.appendChild(tr);
        }
        
        table.style.border="1px solid black";
        table.style.borderCollapse="collapse";
        table.style.marginTop="3rem";
    }
}

function getProdutos () {
    fetch(urlBase, {
        method: "GET"
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((produtos) => {
        listaProdutos = produtos;
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao tentar recuperar produtos do servidor.");
    });
}

function postProduto (produtos) {
    fetch(urlBase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(produtos)
    })
    .then((resposta) => {
        if (resposta.ok)
            return resposta.json();
    })
    .then((dados) => {
        alert(`Produtos cadastrado com sucesso. ID do produtos: ${dados.id}`);
        produtos.id = dados.id;
        listaProdutos.push(produtos);
        exibirTabela();
    })
    .catch((erro) => {
        alert("Erro ao cadastrar produtos: " + erro);
    });
}

function deleteProduto (id) {
    if (confirm("Deseja realmente excluir o produtos " + id + "?")) {
        fetch(urlBase + "/" + id, {
            method: "DELETE"
        })
        .then((resposta) => {
            if (resposta.ok)
                return resposta.json();
        })
        .then((dados) => {
            alert("Produto excluído com sucesso.");
            listaProdutos = listaProdutos.filter((produtos) => {
                return produtos.id != id;
            });
            document.getElementById(id)?.remove();
        })
        .catch((erro) => {
            alert("Erro ao excluir produtos: " + erro);
        });
    }
}

getProdutos();