function carregarProdutos(){
    fetch('https://fakestoreapi.com/products', {
        method: "GET"
    }).then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
    }).then((listaDeProdutos) => {
        const divVitrine = document.getElementById("vitrine");
        for (const produto of listaDeProdutos){
            let card = document.createElement('div');
            card.innerHTML = `
                <div class="card" style="width: 18rem; border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
                    <img width="150px" height="250px" src="${produto.image}" class="card-img-top" alt="${produto.title}">
                    <div class="card-body">
                        <h5 class="card-title">${produto.title}</h5>
                        <p class="card-text">R$ ${produto.price.toFixed(2)}</p>
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
