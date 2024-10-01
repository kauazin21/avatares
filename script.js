document.addEventListener('DOMContentLoaded', () => {
    const URL_API = 'https://api.dicebear.com/9.x/avataaars-neutral/svg'; // URL base da API DiceBear
    const listaAvataresElemento = document.getElementById('lista-avatares');
    const listaFavoritosElemento = document.getElementById('lista-favoritos');
    const detalhesAvatarElemento = document.getElementById('detalhes-avatares');
    const campoBusca = document.getElementById('busca');

    let dadosAvatares = []; // Armazena os dados dos avatares
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || []; // Carrega os favoritos do localStorage

    // Função para fazer a requisição e buscar os avatares
    async function buscarAvatares() {
        dadosAvatares = [];
        try {
            for (let i = 0; i < 10; i++) {
                const seed = `avatar-${i}`;
                const response = await fetch(`${URL_API}?seed=${seed}`);
                if (response.ok) {
                    const avatarUrl = response.url; // A API retorna a URL da imagem diretamente
                    dadosAvatares.push({
                        id: i,
                        nome: `Avatar ${i + 1}`,
                        imgUrl: avatarUrl,
                        descricao: `Este é o avatar número ${i + 1}`,
                    });
                } else {
                    console.error("Erro ao buscar o avatar:", response.status);
                }
            }
            exibirAvatares(dadosAvatares); // Exibe a lista de avatares
            exibirFavoritos(favoritos); // Exibe a lista de favoritos
        } catch (error) {
            console.error("Erro de rede:", error);
        }
    }

    // Exibe os avatares no DOM
    function exibirAvatares(avatares) {
        listaAvataresElemento.innerHTML = ''; // Limpa a lista de avatares
        avatares.forEach(avatar => {
            const avatarItem = criarItemAvatar(avatar, false); // false significa que não é favorito
            listaAvataresElemento.appendChild(avatarItem);
        });
    }

    // Cria o elemento de cada avatar (adicionando/removendo de favoritos)
    function criarItemAvatar(avatar, isFavorito) {
        const divAvatar = document.createElement('div');
        divAvatar.classList.add('avatar-item');

        const imgAvatar = document.createElement('img');
        imgAvatar.src = avatar.imgUrl;
        imgAvatar.alt = avatar.nome;

        const nomeAvatar = document.createElement('p');
        nomeAvatar.textContent = avatar.nome;

        const botaoDetalhes = document.createElement('button');
        botaoDetalhes.textContent = 'Detalhes';
        botaoDetalhes.addEventListener('click', () => exibirDetalhesAvatar(avatar));

        const botaoFavorito = document.createElement('button');
        if (isFavorito) {
            botaoFavorito.textContent = 'Remover dos Favoritos'; // Caso já esteja nos favoritos
            botaoFavorito.addEventListener('click', () => removerDosFavoritos(avatar));
        } else {
            botaoFavorito.textContent = 'Adicionar aos Favoritos'; // Caso não esteja nos favoritos
            botaoFavorito.addEventListener('click', () => adicionarAosFavoritos(avatar));
        }

        divAvatar.appendChild(imgAvatar);
        divAvatar.appendChild(nomeAvatar);
        divAvatar.appendChild(botaoDetalhes);
        divAvatar.appendChild(botaoFavorito);

        return divAvatar;
    }

    // Exibe detalhes do avatar
    function exibirDetalhesAvatar(avatar) {
        detalhesAvatarElemento.innerHTML = `
            <img src="${avatar.imgUrl}" alt="${avatar.nome}">
            <p>${avatar.descricao}</p>
        `;
    }

    // Adiciona um avatar aos favoritos
    function adicionarAosFavoritos(avatar) {
        if (!favoritos.some(fav => fav.id === avatar.id)) {
            favoritos.push(avatar);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            exibirFavoritos(favoritos);
        }
    }

    // Remove um avatar dos favoritos
    function removerDosFavoritos(avatar) {
        favoritos = favoritos.filter(fav => fav.id !== avatar.id); // Remove o avatar da lista de favoritos
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        exibirFavoritos(favoritos);
    }

    // Exibe a lista de favoritos
    function exibirFavoritos(favoritos) {
        listaFavoritosElemento.innerHTML = ''; // Limpa a lista de favoritos
        favoritos.forEach(fav => {
            const avatarItem = criarItemAvatar(fav, true); // true significa que é favorito
            listaFavoritosElemento.appendChild(avatarItem);
        });
    }

    // Filtra os avatares com base no input de busca
    campoBusca.addEventListener('input', () => {
        const termoBusca = campoBusca.value.toLowerCase();
        const avataresFiltrados = dadosAvatares.filter(avatar => avatar.nome.toLowerCase().includes(termoBusca));
        exibirAvatares(avataresFiltrados);
    });

    // Inicializa a busca dos avatares ao carregar a página
    buscarAvatares();
});
