# Site de Links - Raiane Leite

Estrutura de site premium, responsivo e de alta performance, desenvolvida em HTML, CSS e JavaScript puro.

## 📁 Estrutura de Pastas e Arquivos

Para que o site funcione corretamente, organize os arquivos no seu servidor/hospedagem exatamente nesta estrutura:

```text
/ (pasta raiz do site)
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── main.js
│
├── imagens/
│   └── logo.webp                (Logo da Raiane, fundo transparente recomendado)
│
├── modelos/
│   ├── header-mobile.webp       (Cabeçalho vertical para celular/tablet)
│   └── header-desktop.webp      (Cabeçalho horizontal para desktop)
│
├── cards/
│   ├── privacy.webp             (Arte do botão Privacy)
│   ├── telegram-vip.webp        (Arte do botão Telegram VIP)
│   ├── exclusivos.webp          (Arte do botão Exclusivos)
│   ├── onlyfans.webp            (Arte do botão OnlyFans)
│   └── telegram-free.webp       (Arte do botão Telegram Free)
│
└── imgs/
    └── desktop-background.mp4   (Vídeo de fundo para desktop, otimizado e sem áudio)
```

## ⚙️ Como Alterar os Links

Todos os links estão centralizados no arquivo `js/main.js`, no objeto `CONFIG`.

1. Abra `js/main.js`.
2. Localize a constante `CONFIG`.
3. Altere as URLs dentro de `socials` (para os ícones do topo/cabeçalho).
4. Altere as URLs dentro do array `cards` (para os botões principais).

**Nota:** O link do Telegram está centralizado na chave `CONFIG.socials.telegram`. Alterá-lo ali atualizará todos os ícones do Telegram no site automaticamente.

## 🛡️ Recomendações de Segurança no Servidor

Embora o frontend já possua boas práticas (como `rel="noopener noreferrer"` e ausência de scripts perigosos), configure os seguintes cabeçalhos HTTP no seu servidor (Apache, Nginx, Cloudflare ou Hostinger) para máxima segurança:

- **Strict-Transport-Security (HSTS)**: Força o uso de HTTPS.
- **X-Content-Type-Options: nosniff**: Previne ataques de MIME-sniffing.
- **X-Frame-Options: DENY** ou **SAMEORIGIN**: Previne clickjacking (carregamento do site em iframes de terceiros).
- **Referrer-Policy: strict-origin-when-cross-origin**: Controla quais informações de referência são enviadas em links externos.
- **Content-Security-Policy (CSP)**: Recomenda-se uma política restritiva permitindo scripts e estilos apenas do próprio domínio (`'self'`).

## 🚀 Publicação

1. Faça o upload de todos os arquivos e pastas para a pasta pública do seu servidor (ex: `public_html`).
2. Certifique-se de que o servidor esteja servindo o site via **HTTPS**.
3. Verifique se os arquivos `.webp` e `.mp4` estão sendo servidos com os tipos MIME corretos (`image/webp` e `video/mp4`).

## 📱 Comportamento Responsivo

- **Mobile/Tablet (< 1200px)**: Fundo estático em CSS (leve), cards em uma coluna vertical, cabeçalho mobile. O vídeo **não** é baixado nem carregado.
- **Desktop (≥ 1200px)**: Fundo em vídeo (carregado dinamicamente via JS para economizar dados móveis), cards em grid de 5 colunas, cabeçalho desktop.