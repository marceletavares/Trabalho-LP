function carregarProdutos(){
    fetch('http://localhost:4000/produtos', {
        method: "GET"
    }).then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
    }).then((listaDeProdutos) => {
        const divVitrine = document.getElementById("vitrine");
        for (const produto of listaDeProdutos){
            const precoFormatado = (produto.preco !== undefined && !isNaN(produto.preco)) ? produto.preco.toFixed(2) : "0.00";

            let card = document.createElement('div');
            card.innerHTML = `
                <div class="card" style="width: 18rem; border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
                    <img width="150px" height="250px" src="${produto.linkImagem}" class="card-img-top" alt="${produto.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${produto.nome}</h5>
                        <p class="card-text">R$ ${precoFormatado}</p>
                        <a href="#" class="btn btn-primary">Comprar</a>
                    </div>
                </div>
            `;
            divVitrine.appendChild(card);
        }
    }).catch((erro) => {
        alert("Não foi possível carregar os produtos para a vitrine: " + erro);
    });
}

carregarProdutos();
