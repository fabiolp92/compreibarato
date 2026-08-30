// ============================================================
// BARRA DE TOPO — a mesma na home e no catalogo.
// Monta a partir do 'times' do dados.js, entao adicionar um time
// la em cima ja o coloca no menu das duas paginas.
// ============================================================
(function () {
  const CSS_TOPO = `
  :root{
    --topo-bg:#14161a; --topo-ink:#ffffff; --topo-dim:#9aa0aa;
    --marca:#1c2b4a; --zap:#25D366; --linha:#e9e9e9;
  }
  #topo *{box-sizing:border-box;}
  .aviso{
    background:var(--topo-bg); color:#fff; overflow:hidden;
    font-size:12px; font-weight:700; letter-spacing:.4px;
  }
  .aviso-trilho{
    display:flex; gap:44px; width:max-content;
    padding:9px 0; animation:corre 26s linear infinite;
  }
  .aviso-trilho span{white-space:nowrap;}
  @keyframes corre{from{transform:translateX(0)} to{transform:translateX(-50%)}}
  @media (prefers-reduced-motion:reduce){ .aviso-trilho{animation:none; padding-left:16px;} }

  .barra{
    background:#fff; border-bottom:1px solid var(--linha);
    display:flex; align-items:center; gap:16px;
    padding:14px 18px;
  }
  .marca{
    display:flex; align-items:baseline; gap:2px;
    font-family:'Anton',Impact,sans-serif; font-size:24px; letter-spacing:.5px;
    color:var(--marca); text-decoration:none; text-transform:uppercase;
    flex:0 0 auto; line-height:1;
  }
  .marca b{color:var(--zap); font-weight:inherit;}
  .busca{flex:1; position:relative; display:flex; align-items:center; min-width:0;}
  .busca svg{position:absolute; left:14px; opacity:.4; pointer-events:none;}
  .busca input{
    width:100%; padding:11px 14px 11px 38px; border-radius:999px;
    border:1.5px solid var(--linha); background:#f7f7f7;
    font-size:14px; font-family:'Inter',Arial,sans-serif; color:#14161a;
  }
  .busca input:focus{outline:none; border-color:#c3c8d4; background:#fff;}
  .zap-topo{
    flex:0 0 auto; display:flex; align-items:center; gap:7px;
    background:var(--zap); color:#0b1c12; text-decoration:none;
    padding:10px 16px; border-radius:999px; font-size:13px; font-weight:800;
    white-space:nowrap;
  }

  .nav{
    background:#fff; border-bottom:1px solid var(--linha);
    position:sticky; top:0; z-index:40;
  }
  .nav-trilho{
    display:flex; align-items:stretch; gap:2px;
    overflow-x:auto; scrollbar-width:none; padding:0 8px;
  }
  .nav-trilho::-webkit-scrollbar{display:none;}
  .nav-item{position:relative; flex:0 0 auto;}
  .nav-link{
    display:flex; align-items:center; gap:5px;
    padding:14px 14px; background:none; border:none;
    font-family:'Inter',Arial,sans-serif; font-size:13px; font-weight:700;
    letter-spacing:.4px; text-transform:uppercase; color:var(--marca);
    text-decoration:none; cursor:pointer; white-space:nowrap;
    border-bottom:3px solid transparent;
  }
  .nav-link:hover, .nav-item.aberto > .nav-link{border-bottom-color:var(--zap);}
  .nav-link .seta{font-size:10px; color:var(--topo-dim);}
  .nav-link.destaque{color:#c8102e;}

  /* O painel NAO pode morar dentro de .nav-trilho: o overflow-x de la
     recorta qualquer coisa posicionada pra fora. Por isso ele fica solto
     em .mega-area, logo abaixo do trilho, ocupando a largura toda. */
  .mega-area{
    display:none; background:#fff; border-top:1px solid var(--linha);
    box-shadow:0 16px 30px rgba(0,0,0,.11);
    max-height:min(70vh, 560px); overflow-y:auto;
  }
  .mega-area.aberto{display:block;}
  .mega{display:none; padding:18px;}
  .mega.ativo{display:block;}
  .mega-cols{
    display:flex; gap:26px; align-items:flex-start; flex-wrap:wrap;
    max-width:1220px; margin:0 auto;
  }
  .mega-col{display:flex; flex-direction:column; min-width:150px;}
  .mega-titulo{
    font-size:10.5px; font-weight:800; letter-spacing:1px; text-transform:uppercase;
    color:var(--marca); padding:0 0 7px; border-bottom:1px solid var(--linha); margin-bottom:6px;
  }
  .mega a{
    padding:6px 4px; font-size:13px; color:#4a4f58;
    text-decoration:none; border-radius:6px; white-space:nowrap;
  }
  .mega a:hover{background:#f2f4f7; color:var(--marca);}
  .mega a.tudo{font-weight:700; color:var(--marca);}

  @media (max-width:900px){
    .barra{flex-wrap:wrap; gap:10px; padding:12px 14px;}
    .marca{font-size:21px;}
    .busca{order:3; flex:1 0 100%;}
    .zap-topo{margin-left:auto;}
    .mega{padding:12px 14px 16px;}
    .mega-cols{flex-direction:column; gap:14px;}
    .nav-trilho{flex-wrap:nowrap;}
  }`;

  // ---------------------------------------------------------------- helpers
  const CAT = 'catalogo.html';
  const url = (p) => CAT + '?' + new URLSearchParams(p).toString();
  const el = (tag, cls, txt) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };

  function coluna(titulo, itens) {
    const c = el('div', 'mega-col');
    c.appendChild(el('div', 'mega-titulo', titulo));
    itens.forEach(([texto, href, tudo]) => {
      const a = el('a', tudo ? 'tudo' : null, texto);
      a.href = href;
      c.appendChild(a);
    });
    return c;
  }

  // o painel vai pra megaArea; o item so guarda a referencia por id
  function itemNav(rotulo, href, colunas, destaque, megaArea, id) {
    const item = el('div', 'nav-item');
    const link = el(href ? 'a' : 'button', 'nav-link' + (destaque ? ' destaque' : ''));
    link.append(rotulo);
    if (href) link.href = href;
    if (!colunas) { item.appendChild(link); return item; }

    link.appendChild(el('span', 'seta', '▾'));
    const mega = el('div', 'mega');
    mega.dataset.mega = id;
    const wrap = el('div', 'mega-cols');
    colunas.forEach(c => wrap.appendChild(c));
    mega.appendChild(wrap);
    megaArea.appendChild(mega);
    item.appendChild(link);

    link.addEventListener('click', (ev) => {
      ev.preventDefault();
      const jaAberto = item.classList.contains('aberto');
      fecharMegas();
      if (!jaAberto) {
        item.classList.add('aberto');
        mega.classList.add('ativo');
        megaArea.classList.add('aberto');
      }
    });
    return item;
  }

  function fecharMegas() {
    document.querySelectorAll('.nav-item.aberto').forEach(i => i.classList.remove('aberto'));
    document.querySelectorAll('.mega.ativo').forEach(m => m.classList.remove('ativo'));
    document.querySelectorAll('.mega-area.aberto').forEach(a => a.classList.remove('aberto'));
  }

  // ------------------------------------------------------------------ topo
  window.montarTopo = function montarTopo(pagina) {
    const alvo = document.getElementById('topo');
    if (!alvo) return;

    const estilo = el('style');
    estilo.textContent = CSS_TOPO;
    document.head.appendChild(estilo);

    // --- faixa de avisos (duplicada pra o loop nao dar salto)
    const avisos = [
      '3 PEÇAS POR R$100 CADA', '5 PEÇAS OU MAIS POR R$80 CADA',
      'ENVIO PRA TODO BRASIL', 'ATENDIMENTO DIRETO NO WHATSAPP',
      'COLEÇÃO 26/27 CHEGANDO'
    ];
    const aviso = el('div', 'aviso');
    const trilho = el('div', 'aviso-trilho');
    avisos.concat(avisos).forEach(t => trilho.appendChild(el('span', null, '• ' + t)));
    aviso.appendChild(trilho);

    // --- barra com marca, busca e whatsapp
    const barra = el('div', 'barra');
    const marca = el('a', 'marca');
    marca.href = 'index.html';
    marca.innerHTML = 'Comprei<b>Barato</b>FC';
    const busca = el('div', 'busca');
    busca.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#12141a" stroke-width="2">' +
      '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<input type="search" placeholder="Buscar time, seleção ou liga...">';
    const campo = busca.querySelector('input');
    const alvoBusca = document.getElementById('search-input');
    if (pagina === 'catalogo' && alvoBusca) {
      // ja estamos no catalogo: filtra ao vivo, sem recarregar a pagina
      campo.value = new URLSearchParams(location.search).get('busca') || '';
      campo.addEventListener('input', () => {
        alvoBusca.value = campo.value;
        alvoBusca.dispatchEvent(new Event('input'));
      });
    } else {
      campo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && campo.value.trim()) location.href = url({ busca: campo.value.trim() });
      });
    }
    const zap = el('a', 'zap-topo');
    zap.href = typeof linkZap === 'function'
      ? linkZap('Olá! Vi o catálogo e quero saber mais.')
      : 'https://wa.me/' + (window.WHATSAPP_NUMERO || '');
    zap.target = '_blank';
    zap.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 32 32" fill="#0b1c12"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9A12 12 0 0016 27c6.6 0 12-5.4 12-12S22.6 3 16 3z"/></svg>' +
      'WhatsApp';
    barra.append(marca, busca, zap);

    // --- navegação
    const nav = el('nav', 'nav');
    const navTrilho = el('div', 'nav-trilho');

    const selecoes = times.filter(t => t.selecao);
    const clubes = times.filter(t => !t.selecao);

    // Seleções: uma coluna por grupo (Copa 2026 / Clássicas fora)
    const colsSel = [];
    ['Copa 2026', 'Clássicas fora'].forEach(g => {
      const doGrupo = selecoes.filter(s => s.grupo === g);
      if (!doGrupo.length) return;
      // parte em colunas de 16 pra nao virar uma lista infinita
      for (let i = 0; i < doGrupo.length; i += 16) {
        const fatia = doGrupo.slice(i, i + 16);
        const titulo = i === 0
          ? (g === 'Copa 2026' ? '🏆 Copa do Mundo 2026' : '⭐ Clássicas fora da Copa')
          : ' ';
        const itens = fatia.map(s => [s.nome, url({ time: s.nome })]);
        if (i === 0 && g === 'Copa 2026') itens.unshift(['Todas as seleções', url({ tipo: 'selecao' }), true]);
        colsSel.push(coluna(titulo, itens));
      }
    });

    // Clubes: uma coluna por continente, listando as ligas
    const colsClu = [];
    [...new Set(clubes.map(c => c.continente))].forEach(cont => {
      const ligas = [...new Set(clubes.filter(c => c.continente === cont).map(c => c.liga))];
      const itens = ligas.map(l => [l.split(' · ')[0], url({ liga: l })]);
      if (cont === 'Europa') itens.unshift(['Todos os clubes', url({ tipo: 'clube' }), true]);
      colsClu.push(coluna(cont, itens));
    });

    const megaArea = el('div', 'mega-area');
    navTrilho.append(
      itemNav('Seleções', null, colsSel, false, megaArea, 'selecoes'),
      itemNav('Clubes', null, colsClu, false, megaArea, 'clubes'),
      itemNav('Retrô', url({ temporada: 'retro' })),
      itemNav('Kit Infantil', url({ genero: 'infantil' })),
      itemNav('Calções', url({ categoria: 'calcao' })),
      itemNav('Jaquetas', url({ categoria: 'jaqueta' })),
      itemNav('26/27', url({ temporada: '26-27' })),
      itemNav('25/26', url({ temporada: '25-26' })),
      itemNav('Ver tudo', CAT, null, true)
    );
    nav.append(navTrilho, megaArea);

    alvo.append(aviso, barra, nav);

    // clicar fora fecha o mega aberto
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item') && !e.target.closest('.mega-area')) fecharMegas();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharMegas(); });
  };
})();
