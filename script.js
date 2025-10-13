// --- 1. DADOS CENTRALIZADOS (MANTIDOS DO SEU ARQUIVO) ---
const dadosDoBlog = {
    noticias: [
        {
            titulo: "Volta às Aulas: Um Novo Semestre com Muita Fé!",
            resumo: "Mais um semestre se iniciando com muita fé e energia positiva. Venha conferir o calendário e as novidades!",
            data: "28/07/2025",
            conteudo: "Os alunos foram recebidos com uma programação especial...",
            slug: "volta-as-aulas",
        },
        
    ],
    eventos: [
        // Seus eventos
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

// A. Ativar link atual do menu (MANTIDO)
function setActiveLink() {
    const links = document.querySelectorAll("nav a");
    const currentPath = window.location.pathname.split("/").pop(); 
    const currentFile = currentPath === "" ? "index.html" : currentPath;

    links.forEach(link => {
        const linkFile = link.getAttribute('href').split("/").pop();
        if (linkFile === currentFile) {
            link.classList.add("ativo");
        } else {
            link.classList.remove("ativo");
        }
    });
}

// B. Botão "voltar ao topo" (MANTIDO)
function initTopoBtn() {
    const topoBtn = document.createElement("button");
    topoBtn.id = "topoBtn";
    topoBtn.innerText = "⬆ Voltar ao topo";
    
    // Adicionando estilos no JS para funcionar como antes
    Object.assign(topoBtn.style, { 
        position: "fixed", 
        bottom: "20px", 
        right: "20px", 
        padding: "10px", 
        background: "#0077cc", 
        color: "white", 
        border: "none", 
        borderRadius: "5px", 
        cursor: "pointer", 
        display: "none",
        zIndex: "1000"
    });
    
    document.body.appendChild(topoBtn);

    topoBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
        topoBtn.style.display = (window.scrollY > 300) ? "block" : "none";
    });
}

// C. MODO ESCURO (CORRIGIDO)
function toggleDarkMode() {
    // Tenta encontrar o body pelo ID 'pageBody' (que estamos padronizando) ou usa document.body
    const body = document.getElementById('pageBody') || document.body;
    const modoBtn = document.getElementById('modoBtn');
    
    if (!body) return;

    body.classList.toggle('dark-mode'); 
    
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    if (modoBtn) {
        modoBtn.textContent = isDarkMode ? 'Modo Claro' : 'Modo Escuro';
    }
}

function loadThemePreference() {
    const body = document.getElementById('pageBody') || document.body;
    const modoBtn = document.getElementById('modoBtn');
    
    if (!body) return;
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode'); // Garante que a classe seja removida no modo claro
    }
    
    if (modoBtn) {
        // Adiciona o listener APENAS aqui.
        modoBtn.addEventListener('click', toggleDarkMode);
        modoBtn.textContent = isDarkMode ? 'Modo Claro' : 'Modo Escuro';
    }
}

// --- 3. LÓGICA DE CONTEÚDO (MANTIDA/CONSOLIDADA) ---

// A. Carrega Notícias (para noticias.html)
function carregarNoticias() {
    const noticiasSection = document.getElementById('noticiasSection');
    if (!noticiasSection) return; 
    
    // Limpa o conteúdo estático no HTML para carregar via JS
    noticiasSection.innerHTML = '<h2>Últimas Notícias</h2><div class="noticias-container"></div>';

    const container = noticiasSection.querySelector('.noticias-container');
    
    dadosDoBlog.noticias.forEach(noticia => {
        const article = document.createElement('article');
        article.innerHTML = `
            <h3>${noticia.titulo} <small>(${noticia.data})</small></h3>
            <p>${noticia.resumo}</p>
            <p><strong>Conteúdo completo:</strong> ${noticia.conteudo}</p>
        `;
        container.appendChild(article);
    });

    if (dadosDoBlog.noticias.length === 0) {
        container.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
    }
}

// B. Carrega Eventos (para eventos.html)
function carregarEventos() {
    const listaEventos = document.getElementById('listaEventos');
    if (!listaEventos) return; 

    listaEventos.innerHTML = '';
    
    dadosDoBlog.eventos.forEach(evento => {
        const li = document.createElement('li');
        li.textContent = evento;
        listaEventos.appendChild(li);
    });

    if (dadosDoBlog.eventos.length === 0) {
        listaEventos.innerHTML = '<li>Sem eventos agendados no momento.</li>';
    }
}

// C. Lógica do Carrossel (para fotos.html)
let indicesCarrossel = {};
// Resto da sua função initCarrossel (mantida)

// Sua função initCarrossel (precisa ser definida aqui ou copiada do seu arquivo):
function initCarrossel(album) {
    const container = document.querySelector(`.carrossel[data-album="${album}"]`);
    if (!container) return; 

    // O código de carrossel deve ser reescrito para evitar o conflito do onload
    container.innerHTML = `
        <div class="midia-box"></div>
        <div class="contador"></div>
        <div class="botoes">
            <button class="btn-anterior">⟨</button>
            <button class="btn-proximo">⟩</button>
        </div>
    `;

    indicesCarrossel[album] = 0;
    
    const midias = dadosDoBlog.albuns[album];
    if (!midias || midias.length === 0) {
        container.innerHTML = '<p>Nenhuma mídia encontrada para este álbum.</p>';
        return;
    }

    const midiaBox = container.querySelector('.midia-box');
    const contador = container.querySelector('.contador');
    
    const mostrar = () => {
        const index = indicesCarrossel[album];
        const midia = midias[index];
        midiaBox.innerHTML = '';

        let el;
        if (midia.tipo === 'imagem') {
            el = document.createElement('img');
            el.src = midia.src;
            el.alt = `Foto do álbum ${album}`;
        } else {
            el = document.createElement('video');
            el.src = midia.src;
            el.controls = true;
        }

        midiaBox.appendChild(el);
        contador.textContent = `${index + 1} / ${midias.length}`;
    };

    container.querySelector('.btn-anterior').onclick = () => {
        indicesCarrossel[album] = (indicesCarrossel[album] - 1 + midias.length) % midias.length;
        mostrar();
    };

    container.querySelector('.btn-proximo').onclick = () => {
        indicesCarrossel[album] = (indicesCarrossel[album] + 1) % midias.length;
        mostrar();
    };

    mostrar();
}

// D. Modo Desenvolvedor (MANTIDO)
function initSearch() {
    // Sua lógica de pesquisa...
}

// --- 4. INICIALIZAÇÃO GERAL (CONSOLIDAÇÃO) ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog 'Futuro em Ação' carregado e aprimorado!");
    
    // CORREÇÃO: Carrega a preferência de tema imediatamente
    loadThemePreference(); 
    
    setActiveLink();
    initTopoBtn(); 
    
    // Executa as funções de conteúdo se estiver na página certa
    const currentPath = window.location.pathname;

    if (currentPath.includes('noticias.html')) {
        carregarNoticias();
    }
    
    if (currentPath.includes('eventos.html')) {
        carregarEventos();
    }

    if (currentPath.includes('fotos.html')) {
        for (const nomeAlbum in dadosDoBlog.albuns) {
            initCarrossel(nomeAlbum);
        }
    }
    
    // Se você tiver a função initSearch(), ela deve ser chamada aqui.
    // initSearch(); 
});