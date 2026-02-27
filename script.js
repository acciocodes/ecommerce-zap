// Variáveis globais
let carrinho = [];
let produtosFiltrados = [...produtos];

// Elementos do DOM
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos(produtos);
    carregarCarrinho();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Abrir/fechar carrinho
    cartBtn.addEventListener('click', abrirCarrinho);
    closeCartBtn.addEventListener('click', fecharCarrinho);
    
    // Fechar modal ao clicar fora
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            fecharCarrinho();
        }
    });
    
    // Finalizar compra
    checkoutBtn.addEventListener('click', finalizarCompra);
    
    // Limpar carrinho
    clearCartBtn.addEventListener('click', limparCarrinho);
    
    // Busca
    searchBtn.addEventListener('click', buscarProdutos);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarProdutos();
        }
    });
    
    // Filtros por categoria
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove classe active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona ao atual
            btn.classList.add('active');
            // Filtra
            filtrarPorCategoria(btn.dataset.category);
        });
    });
}

// Renderizar produtos na tela
function renderizarProdutos(produtosParaRenderizar) {
    productsGrid.innerHTML = '';
    
    if (produtosParaRenderizar.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <p>Nenhum produto encontrado</p>
            </div>
        `;
        return;
    }
    
    produtosParaRenderizar.forEach(produto => {
        const produtoHTML = `
            <div class="product-card" data-id="${produto.id}">
                <div class="product-image">
                    <i class="fas ${produto.icone}"></i>
                </div>
                <div class="product-info">
                    <span class="product-category">${getCategoriaNome(produto.categoria)}</span>
                    <h3 class="product-title">${produto.nome}</h3>
                    <p class="product-description">${produto.descricao}</p>
                    <p class="product-price">${formatarPreco(produto.preco)}</p>
                    <button class="add-to-cart" onclick="adicionarAoCarrinho(${produto.id})">
                        <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        `;
        productsGrid.innerHTML += produtoHTML;
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    
    if (!produto) return;
    
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
}

// Remover produto do carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarCarrinho();
}

// Atualizar quantidade no carrinho
function atualizarQuantidade(id, acao) {
    const item = carrinho.find(item => item.id === id);
    
    if (!item) return;
    
    if (acao === 'aumentar') {
        item.quantidade++;
    } else if (acao === 'diminuir') {
        item.quantidade--;
        if (item.quantidade <= 0) {
            removerDoCarrinho(id);
            return;
        }
    }
    
    salvarCarrinho();
    atualizarCarrinho();
}

// Atualizar visualização do carrinho
function atualizarCarrinho() {
    // Atualizar contador
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    cartCount.textContent = totalItens;
    
    // Atualizar itens
    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Seu carrinho está vazio</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Adicione produtos para começar!</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = carrinho.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${item.icone}"></i>
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.nome}</h4>
                    <p class="cart-item-price">${formatarPreco(item.preco)}</p>
                    <div class="cart-item-quantity">
                        <button onclick="atualizarQuantidade(${item.id}, 'diminuir')">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantidade}</span>
                        <button onclick="atualizarQuantidade(${item.id}, 'aumentar')">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removerDoCarrinho(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Atualizar total
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    cartTotal.textContent = formatarPreco(total);
}

// Abrir carrinho
function abrirCarrinho() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar carrinho
function fecharCarrinho() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Finalizar compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const mensagem = `
👓 Ótica Zap - Resumo do Pedido:

${carrinho.map(item => `• ${item.nome} x${item.quantidade}: ${formatarPreco(item.preco * item.quantidade)}`).join('\n')}

─────────────────────
TOTAL: ${formatarPreco(total)}

Obrigado pela preferência! 👓

Em breve entraremos em contato para confirmar seu pedido.
    `;
    
    alert(mensagem);
    limparCarrinho();
    fecharCarrinho();
}

// Limpar carrinho
function limparCarrinho() {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
}

// Buscar produtos
function buscarProdutos() {
    const termo = searchInput.value.toLowerCase().trim();
    
    if (!termo) {
        produtosFiltrados = [...produtos];
    } else {
        produtosFiltrados = produtos.filter(produto =>
            produto.nome.toLowerCase().includes(termo) ||
            produto.descricao.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo)
        );
    }
    
    renderizarProdutos(produtosFiltrados);
}

// Filtrar por categoria
function filtrarPorCategoria(categoria) {
    if (categoria === 'all') {
        produtosFiltrados = [...produtos];
    } else {
        produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    }
    
    renderizarProdutos(produtosFiltrados);
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Carregar carrinho do localStorage
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarCarrinho();
    }
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notification';
    notificacao.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${mensagem}</span>
    `;
    
    notificacao.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 3000);
}

// Adicionar animações CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: #6b7280;
    }
    
    .no-products i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
`;
document.head.appendChild(style);