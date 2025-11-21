let dados = [];

window.onload = async () => {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
    renderizarCards(dados);

    const caixaBusca = document.getElementById("caixaBusca");
    // Executa a busca a cada tecla pressionada no campo de busca
    caixaBusca.addEventListener("keyup", iniciarBusca);
    // Mantém o evento de clique no botão para consistência
    document.getElementById("botao-busca").addEventListener("click", iniciarBusca);

    // Adiciona o evento de clique para o botão "Explorar Agora"
    document.getElementById("explore-button").addEventListener("click", showAppContent);

    // Adiciona o evento de clique para o botão "Home"
    document.getElementById("home-button").addEventListener("click", showHomeScreen);

    // --- LÓGICA PARA ABRIR O ACORDEÃO PELOS ÍCONES DO HEADER ---
    const navIcons = document.querySelectorAll('.genre-nav a');
    navIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão de "pular" para a âncora

            const targetId = icon.getAttribute('href'); // Pega o ID do alvo, ex: "#rock-section"
            const targetSection = document.querySelector(targetId); // Encontra a seção correspondente

            if (targetSection) {
                // Rola suavemente até a seção alvo
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- LÓGICA DO MODAL DE ARTISTA ---
    setupModal();
};

function renderizarCards(dados) {
    // Seleciona os containers de cada gênero
    const rockContainer = document.querySelector("#rock-section .card-container");
    const popContainer = document.querySelector("#pop-section .card-container");
    const trapContainer = document.querySelector("#trap-section .card-container");
    const indieContainer = document.querySelector("#indie-section .card-container");
    const eletronicaContainer = document.querySelector("#eletronica-section .card-container");

    // Limpa os containers antes de renderizar novos cards
    rockContainer.innerHTML = "";
    popContainer.innerHTML = "";
    trapContainer.innerHTML = "";
    indieContainer.innerHTML = "";
    eletronicaContainer.innerHTML = "";

    for (let dado of dados){
        let article = document.createElement("article");

        // Adiciona um data attribute com o nome do artista para fácil identificação
        article.dataset.artistName = dado.Nome;
        
        article.classList.add("card");

        // Adiciona uma classe específica para o card do Chase Atlantic
        if (dado.Nome === "Chase Atlantic") {
            article.classList.add("card--chase-atlantic");
        }

        // Adiciona uma classe específica para o card do The Weeknd
        if (dado.Nome === "The Weeknd") {
            article.classList.add("card--the-weeknd");
        }

        // Adiciona uma classe específica para o card do Arctic Monkeys
        if (dado.Nome === "Arctic Monkeys") {
            article.classList.add("card--arctic-monkeys");
        }

        // Adiciona uma classe específica para o card do The Strokes
        if (dado.Nome === "The Strokes") {
            article.classList.add("card--the-strokes");
        }

        // Adiciona uma classe específica para o card da Dua Lipa
        if (dado.Nome === "Dua Lipa") {
            article.classList.add("card--dua-lipa");
        }

        // Adiciona uma classe específica para o card do G-Eazy
        if (dado.Nome === "G-Eazy") {
            article.classList.add("card--g-eazy");
        }

        // Adiciona uma classe específica para o card do Travis Scott
        if (dado.Nome === "Travis Scott") {
            article.classList.add("card--travis-scott");
        }

        // Adiciona uma classe específica para o card do Post Malone
        if (dado.Nome === "Post Malone") {
            article.classList.add("card--post-malone");
        }

        // Adiciona uma classe específica para o card do Florence + The Machine
        if (dado.Nome === "Florence + The Machine") {
            article.classList.add("card--florence-the-machine");
        }

        // Adiciona uma classe específica para o card do The xx
        if (dado.Nome === "The xx") {
            article.classList.add("card--the-xx");
        }

        // Adiciona uma classe específica para o card do Daft Punk
        if (dado.Nome === "Daft Punk") {
            article.classList.add("card--daft-punk");
        }

        article.innerHTML = `
         <h2>${dado.Nome}</h2>
         <p>${dado.Descrição}</p>
         <p>${dado.ano}</p>
         <a href="${dado.link}" target="_blank">Ouça</a>
       `;

       // Adiciona o card ao container do gênero correspondente
       if (dado.genero === "Rock") {
           rockContainer.appendChild(article);
       } else if (dado.genero === "Pop") {
           popContainer.appendChild(article);
       } else if (dado.genero === "Trap") {
           trapContainer.appendChild(article);
       } else if (dado.genero === "Indie") {
           indieContainer.appendChild(article);
       } else if (dado.genero === "Eletrônica") {
           eletronicaContainer.appendChild(article);
       }
    }
}

function iniciarBusca() {
    const termoBusca = document.getElementById("caixaBusca").value.trim().toLowerCase();
    const genreSections = document.querySelectorAll(".genre-section");
    const noResultsMessage = document.getElementById("no-results-message");

    // Esconde a mensagem de "nenhum resultado" no início de cada busca
    noResultsMessage.style.display = 'none';

    // Se a busca estiver vazia, mostra todos os cards novamente.
    if (termoBusca === "") {
        renderizarCards(dados);
        genreSections.forEach(section => section.style.display = 'block');
        return;
    }

    // Filtra os dados com base no termo de busca.
    const dadosFiltrados = dados.filter(dado => {
        // Retorna true se o termo de busca estiver contido no nome, descrição, ano ou gênero.
        return dado.Nome.toLowerCase().includes(termoBusca) || 
               dado.Descrição.toLowerCase().includes(termoBusca) ||
               dado.ano.includes(termoBusca) ||
               dado.genero.toLowerCase().includes(termoBusca);
    });

    // Renderiza os cards filtrados (ou um array vazio se não houver resultados)
    renderizarCards(dadosFiltrados);

    // Esconde as seções de gênero que ficaram vazias após a busca
    genreSections.forEach(section => {
        const container = section.querySelector('.card-container');
        if (container.children.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });

    // Se nenhum resultado for encontrado, exibe a mensagem.
    if (dadosFiltrados.length === 0) {
        noResultsMessage.textContent = "Desculpe, ainda não temos essa.";
        noResultsMessage.style.display = 'block';
    }
}

// Lógica para esconder o header ao rolar para baixo
let lastScrollY = window.scrollY; // Armazena a última posição de rolagem

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo e já passou de 100px
        header.classList.add("header--hidden");
    } else {
        // Rolando para cima
        header.classList.remove("header--hidden");
    }

    // Atualiza a última posição de rolagem
    lastScrollY = currentScrollY;
});

function showAppContent() {
    const heroSection = document.querySelector(".hero");
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");

    // Esconde a seção hero
    heroSection.style.opacity = "0";
    // Após a transição de fade-out, remove a seção do layout para eliminar o espaço
    setTimeout(() => {
        heroSection.style.display = "none";
    }, 500); // 500ms = 0.5s, a mesma duração da transição no CSS

    // Mostra o conteúdo principal
    header.style.display = "flex";
    main.style.display = "block";
    footer.style.display = "block";

    setTimeout(() => {
        header.style.opacity = "1";
        main.style.opacity = "1";
        footer.style.opacity = "1";
    }, 50); // Pequeno delay para garantir que a transição de opacidade funcione
}

function showHomeScreen() {
    const heroSection = document.querySelector(".hero");
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");

    // Esconde o conteúdo principal
    header.style.opacity = "0";
    main.style.opacity = "0";
    footer.style.opacity = "0";

    setTimeout(() => {
        header.style.display = "none";
        main.style.display = "none";
        footer.style.display = "none";

        // Mostra a seção hero novamente
        heroSection.style.display = "flex";
        heroSection.style.opacity = "1";
    }, 500); // Espera a animação de fade-out do conteúdo terminar
}

function setupModal() {
    const modalOverlay = document.getElementById('artist-modal');
    const closeModalButton = document.getElementById('modal-close-button');
    const mainContent = document.querySelector('main');

    // Função para abrir o modal com os dados do artista
    function openModal(artist) {
        // Preenche os dados do modal
        document.getElementById('modal-artist-name').textContent = artist.Nome;
        document.getElementById('modal-artist-summary').textContent = artist.resumo;

        const songList = document.getElementById('modal-song-list');
        songList.innerHTML = ''; // Limpa a lista anterior
        artist.musicasFamosas.forEach(song => {
            const li = document.createElement('li');
            li.textContent = song;
            songList.appendChild(li);
        });

        // Usa o nome da imagem definido no data.json
        document.getElementById('modal-artist-image').src = artist.imagem;

        // Mostra o modal
        modalOverlay.classList.add('visible');
    }

    // Função para fechar o modal
    function closeModal() {
        modalOverlay.classList.remove('visible');
    }

    // Evento de clique para fechar o modal (botão e overlay)
    closeModalButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        // Fecha o modal apenas se o clique for no overlay, não no conteúdo
        if (event.target === modalOverlay) {
            closeModal();
        }
    });

    // Evento de clique nos cards de artista (usando delegação de evento)
    mainContent.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.card');
        if (clickedCard) {
            const artistName = clickedCard.dataset.artistName;
            const artistData = dados.find(d => d.Nome === artistName);
            if (artistData) {
                openModal(artistData);
            }
        }
    });
}