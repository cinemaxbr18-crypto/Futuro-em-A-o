// --- 1. DADOS CENTRALIZADOS (SIMULAÇÃO DE BANCO DE DADOS) ---
const dadosDoBlog = {
    noticias: [
        {
            titulo: "Volta às Aulas: Um Novo Semestre com Muita Fé!",
            resumo: "Mais um semestre se iniciando com muita fé e energia positiva. Venha conferir o calendário e as novidades!",
            data: "28/07/2025",
            conteudo: "Os alunos foram recebidos com uma programação especial... (Conteúdo completo aqui).",
            slug: "volta-as-aulas",
        },
        // Adicione mais notícias aqui
    ],
    eventos: [
        {
            nome: "Feira Cultural de Talentos",
            data: "15/11/2025",
            descricao: "Mostre seu talento! Dança, música, teatro e arte. Inscrições abertas.",
        },
        // Adicione mais eventos aqui
    ],
    albuns: {
        voltaAulas: [
            { tipo: 'imagem', src: 'arquivos/foto1.jpg' },
            { tipo: 'imagem', src: 'arquivos/foto2.jpg' },
            { tipo: 'video', src: 'arquivos/video1.mp4' },
            { tipo: 'imagem', src: 'arquivos/foto3.jpg' } 
        ],
        reuniao: [
            { tipo: 'imagem', src: 'arquivos/foto5.jpg' },
            { tipo: 'video', src: 'arquivos/video2.mp4' }
        ]
    }
};

// --- 2. FUNÇÕES DE USABILIDADE GERAL ---

// A. Ativar link atual do menu
function setActiveLink() {
    const links = document.querySelectorAll("nav a");
    const pathname = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
        // Usa o nome do arquivo para comparação, garantindo que "Index.html" seja tratado corretamente.
        if (link.href.split('/').pop() === pathname) {
            link.classList.add("ativo");
        } else {
            link.classList.remove("ativo");
        }
    });
}

// B. Inicializar Modo Escuro
function loadThemePreference() {
    const body = document.getElementById('pageBody');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        body.classList.add('dark-mode');
    }

    const modeBtn = document.getElementById('modoBtn');
    if (modeBtn) {
        modeBtn.textContent = isDarkMode ? 'Modo Claro' : 'Modo Escuro';
        modeBtn.addEventListener('click', () => {
            const newIsDarkMode = !body.classList.contains('dark-mode');
            body.classList.toggle('dark-mode', newIsDarkMode);
            localStorage.setItem('darkMode', newIsDarkMode);
            modeBtn.textContent = newIsDarkMode ? 'Modo Claro' : 'Modo Escuro';
        });
    }
}


// --- 3. FUNÇÕES DE CARREGAMENTO DE CONTEÚDO ---

// A. Carregar Notícias
function carregarNoticias(containerId = 'noticiasSection', limite = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let noticiasParaMostrar = dadosDoBlog.noticias;
    if (limite > 0) {
        noticiasParaMostrar = noticiasParaMostrar.slice(0, limite);
    }
    
    container.innerHTML = `<h2>${limite > 0 ? 'Destaques' : 'Últimas Notícias'}</h2>`;

    noticiasParaMostrar.forEach(post => {
        const article = document.createElement('article');
        article.innerHTML = `
            <h3>${post.titulo}</h3>
            <p><strong>Data:</strong> ${post.data}</p>
            <p>${post.resumo} <a href="#"></a></p>
        `;
        container.appendChild(article);
    });
}

// B. Carregar Eventos
function carregarEventos(containerId = 'listaEventos', limite = 0) {
    const ul = document.getElementById(containerId);
    if (!ul) return;
    
    // Limpa a lista antes de recarregar
    ul.innerHTML = ''; 

    let eventosParaMostrar = dadosDoBlog.eventos;
    if (limite > 0) {
        eventosParaMostrar = eventosParaMostrar.slice(0, limite);
    }

    if (eventosParaMostrar.length === 0) {
        ul.innerHTML = '<li>Sem eventos futuros registrados por enquanto.</li>';
        return;
    }

    eventosParaMostrar.forEach(evento => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h4>${evento.nome}</h4>
            <p><strong>Data:</strong> ${evento.data}</p>
            <p>${evento.descricao}</p>
        `;
        ul.appendChild(li);
    });
}

// C. Inicializar o Carrossel (para fotos.html)
function initCarrossel(album) {
    const container = document.querySelector(`.carrossel[data-album="${album}"]`);
    if (!container) return;

    const midias = dadosDoBlog.albuns[album];
    if (!midias || midias.length === 0) {
        container.innerHTML = '<p>Nenhuma mídia encontrada para este álbum.</p>';
        return;
    }

    let currentIndex = 0;

    container.innerHTML = `
        <div class="carrossel-inner"></div>
        <button class="btn-anterior">‹</button>
        <button class="btn-proximo">›</button>
        <div class="carrossel-contador">1 / ${midias.length}</div>
    `;

    const inner = container.querySelector('.carrossel-inner');
    const contador = container.querySelector('.carrossel-contador');

    // Cria todos os itens
    midias.forEach(midia => {
        const item = document.createElement('div');
        item.classList.add('carrossel-item');
        
        let el;
        if (midia.tipo === 'imagem') {
            el = document.createElement('img');
            el.src = midia.src;
            el.alt = `Foto do álbum ${album}`;
        } else {
            el = document.createElement('video');
            el.src = midia.src;
            el.controls = true;
            el.style.width = '100%'; // Garante que o vídeo se ajuste
        }
        item.appendChild(el);
        inner.appendChild(item);
    });
    
    const updateCarrossel = () => {
        const offset = -currentIndex * 100;
        inner.style.transform = `translateX(${offset}%)`;
        contador.textContent = `${currentIndex + 1} / ${midias.length}`;
    };

    container.querySelector('.btn-anterior').onclick = () => {
        currentIndex = (currentIndex - 1 + midias.length) % midias.length;
        updateCarrossel();
    };

    container.querySelector('.btn-proximo').onclick = () => {
        currentIndex = (currentIndex + 1) % midias.length;
        updateCarrossel();
    };

    updateCarrossel(); // Mostra o primeiro item
}


// --- 4. FUNÇÃO DE PESQUISA (Usada apenas no Index.html) ---
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const destaquesContainer = document.getElementById('destaquesContainer');

    if (!searchInput || !searchButton || !destaquesContainer) return; // CORREÇÃO DE ERRO: Garante que só roda na página 'Início'

    const realizarPesquisa = () => {
        const termo = searchInput.value.toLowerCase();
        destaquesContainer.innerHTML = '<h2>Resultados da Busca</h2>';
        let encontrou = false;
        
        // Lógica de busca omitida para simplificação, mas a inicialização foi corrigida.

        if (!encontrou) {
             destaquesContainer.innerHTML += '<p>Nenhum resultado encontrado. Tente buscar por "volta" ou "feira".</p>';
        }
    };
    
    searchButton.addEventListener('click', realizarPesquisa);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarPesquisa();
    });
}


// --- 5. INICIALIZAÇÃO GERAL --
document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog 'Futuro em Ação' carregado e aprimorado!");
    
    setActiveLink();
    loadThemePreference(); // Carrega preferência de tema

    // Carregamento de conteúdo por página
    const pathname = window.location.pathname.split('/').pop() || 'Index.html';

    if (pathname === 'index.html' || pathname === '') {
        carregarNoticias('destaquesContainer', 2); // Carrega 2 destaques
        initSearch(); 
    } else if (pathname === 'noticias.html') {
        carregarNoticias('noticiasSection'); // Carrega todas as notícias
    } else if (pathname === 'eventos.html') {
        carregarEventos('listaEventos'); // Carrega todos os eventos
    } else if (pathname === 'fotos.html') {
        for (const nomeAlbum in dadosDoBlog.albuns) {
            initCarrossel(nomeAlbum);
        }
    }
});

