const botaoCarregar = document.querySelector("#btn-carregar");
const botaoOrdenar = document.querySelector("#btn-ordenar");
const botaoAtualizar = document.querySelector("#btn-atualizar");
const filtro = document.querySelector("#filtro");
const mensagem = document.querySelector("#mensagem");
const painel = document.querySelector("#lista-posts");
const contador = document.querySelector("#contador");

const URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";

let publicacoes = [];

botaoCarregar.addEventListener("click", carregarPublicacoes);

botaoAtualizar.addEventListener("click", carregarPublicacoes);

filtro.addEventListener("input", filtrarPublicacoes);

botaoOrdenar.addEventListener("click", ordenarPublicacoes);

function renderizarPublicacoes(lista) {
    painel.replaceChildren();

    contador.textContent =
        `${lista.length} ${lista.length === 1 ? "publicação" : "publicações"}`;

    lista.forEach((publicacao) => {
        const cartao = document.createElement("article");
        cartao.classList.add("cartao");

        const identificador = document.createElement("span");
        identificador.textContent = `Publicação #${publicacao.id}`;

        const titulo = document.createElement("h2");
        titulo.textContent = publicacao.title;

        const texto = document.createElement("p");
        texto.textContent = publicacao.body;

        cartao.append(
            identificador,
            titulo,
            texto
        );

        painel.append(cartao);
    });
}

function carregarPublicacoes() {
    mensagem.textContent = "Carregando publicações...";
    botaoCarregar.disabled = true;
    botaoAtualizar.disabled = true;

    fetch(URL)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            return resposta.json();
        })
        .then((dados) => {
            publicacoes = dados;

            mensagem.textContent = "";

            renderizarPublicacoes(publicacoes);
        })
        .catch((erro) => {
            console.error(erro);

            mensagem.textContent =
                "Não foi possível carregar as publicações. Tente novamente.";

            painel.replaceChildren();

            contador.textContent = "0 publicações";
        })
        .finally(() => {
            botaoCarregar.disabled = false;
            botaoAtualizar.disabled = false;
        });
}

function filtrarPublicacoes() {
    const termo = filtro.value.trim().toLowerCase();

    const encontradas = publicacoes.filter((publicacao) => {
        return publicacao.title
            .toLowerCase()
            .includes(termo);
    });

    renderizarPublicacoes(encontradas);

    if (encontradas.length === 0) {
        mensagem.textContent = "Nenhuma publicação encontrada.";
    } else {
        mensagem.textContent = "";
    }
}

function ordenarPublicacoes() {
    const ordenadas = [...publicacoes].sort((a, b) => {
        return a.title.localeCompare(b.title);
    });

    publicacoes = ordenadas;

    filtrarPublicacoes();
}