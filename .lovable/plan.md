# Landing page VSL estilo "Enfer Aprova"

Reconstrução de uma página de vendas com vídeo (VSL) no mesmo formato da referência, em React/TanStack Start — mais leve e rápida que o WordPress original.

## Estrutura da página (rota `/`)

1. Hero escuro com headline em destaque (amarelo/branco) e player de vídeo vertical 9:16
2. CTA principal, com opção de aparecer só após X minutos de vídeo (delay configurável)
3. Prova social: grade/carrossel de prints de depoimentos e aprovações
4. "Feito para você que…" — 3 cards com ícone + dor do público
5. Amostras do material — carrossel de imagens
6. "Tudo que você vai receber" — acordeões por tema com a lista completa de conteúdos
7. Bônus — 4 cards com selo "BÔNUS INCLUSO / GRÁTIS"
8. Oferta — preço parcelado, preço à vista, desconto e CTA
9. Garantia de 7 dias com selo
10. Autoridade — foto e bio da professora
11. FAQ em acordeão
12. CTA final + rodapé com contato e políticas

## Detalhes técnicos

- Rota única `src/routes/index.tsx` com seções componentizadas em `src/components/lp/`
- Design system em `src/styles.css`: fundo escuro, acento verde e amarelo, tipografia Inter; nada hardcoded
- Player: embed do provedor de VSL (VTurb/ConverteAI, Panda, YouTube ou MP4 próprio) num wrapper responsivo 9:16
- CTA temporizado por `useEffect` + timer, com opção de exibir imediatamente
- Todos os botões apontam para a URL de checkout, preservando os parâmetros UTM/`src` da URL de entrada
- Acordeões e carrosséis com componentes shadcn já disponíveis (Accordion, Carousel)
- SEO no `head()` da rota: título, descrição, og/twitter; imagens com `alt` e lazy loading
- Mobile-first (a maior parte do tráfego pago é mobile)

## Fora do escopo desta primeira versão

- Barra de progresso falsa e contadores de escassez fictícios (risco de reprovação em anúncios); usarei contadores reais se desejado
- Checkout próprio: o botão leva ao seu gateway (Payt/Hotmart/Kiwify/Stripe)
- Área de membros e entrega dos e-books

## O que preciso de você

- Link do vídeo da VSL (ou plataforma usada)
- URL do checkout
- Textos, preço e imagens (depoimentos, amostras, foto da professora) — ou gero placeholders para você trocar depois
