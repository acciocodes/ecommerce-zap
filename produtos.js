// Dados dos produtos - Ótica Zap
const produtos = [
    {
        id: 1,
        nome: "Óculos de Sol Wayfarer",
        descricao: "Lente polarizada, proteção UV400, armação preta",
        preco: 189.90,
        categoria: "sol",
        icone: "fa-glasses"
    },
    {
        id: 2,
        nome: "Armação Redonda Vintage",
        descricao: "Aço inoxidável, estilo clássico, dourado",
        preco: 149.90,
        categoria: "armacao",
        icone: "fa-glasses"
    },
    {
        id: 3,
        nome: "Óculos de Grau Minimalista",
        descricao: "Armação em acetato, lente progressiva, azul",
        preco: 299.90,
        categoria: "grau",
        icone: "fa-eye"
    },
    {
        id: 4,
        nome: "Óculos Esportivo Protection",
        descricao: "Lente antivappo, proteção total UV, Correa",
        preco: 249.90,
        categoria: "sol",
        icone: "fa-glasses"
    },
    {
        id: 5,
        nome: "Lentes de Contato Mensal",
        descricao: "Caixa com 2 unidades, Hidrogel, -3.00",
        preco: 89.90,
        categoria: "lentes",
        icone: "fa-circle"
    },
    {
        id: 6,
        nome: "Óculos Feminino Cat Eye",
        descricao: "Armação em acetato, detalhes em dourado",
        preco: 219.90,
        categoria: "armacao",
        icone: "fa-glasses"
    },
    {
        id: 7,
        nome: "Óculos Masculino Aviador",
        descricao: "Clássico aviador, lente dourada, armação gold",
        preco: 179.90,
        categoria: "sol",
        icone: "fa-glasses"
    },
    {
        id: 8,
        nome: "Kit Limpeza Óculos",
        descricao: "Spray, pano microfibra, estojo",
        preco: 29.90,
        categoria: "acessorios",
        icone: "fa-spray-can-sparkles"
    },
    {
        id: 9,
        nome: "Estojo Rígido Premium",
        descricao: "Couro sintético, ziper, diversas cores",
        preco: 49.90,
        categoria: "acessorios",
        icone: "fa-box"
    },
    {
        id: 10,
        nome: "Óculos Infantil Divertido",
        descricao: "Armação resistente, lente resistente a impacto",
        preco: 129.90,
        categoria: "grau",
        icone: "fa-glasses"
    },
    {
        id: 11,
        nome: "Clip-on Solar",
        descricao: "Acessório para transformar óculos de grau em solar",
        preco: 79.90,
        categoria: "acessorios",
        icone: "fa-paperclip"
    },
    {
        id: 12,
        nome: "Óculos Blue Light",
        descricao: "Lente azul, proteção digital, armação preta",
        preco: 159.90,
        categoria: "grau",
        icone: "fa-glasses"
    }
];

// Função para obter nome da categoria
function getCategoriaNome(categoria) {
    const nomes = {
        "sol": "Óculos de Sol",
        "armacao": "Armações",
        "grau": "Óculos de Grau",
        "lentes": "Lentes de Contato",
        "acessorios": "Acessórios"
    };
    return nomes[categoria] || categoria;
}

// Função para formatar preço
function formatarPreco(preco) {
    return preco.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}