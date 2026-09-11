const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DEHvOCR0.js","assets/index-DeAfXq3h.css"])))=>i.map(i=>d[i]);
var k=(d,p,i)=>new Promise((y,o)=>{var u=g=>{try{c(i.next(g))}catch(b){o(b)}},j=g=>{try{c(i.throw(g))}catch(b){o(b)}},c=g=>g.done?y(g.value):Promise.resolve(g.value).then(u,j);c((i=i.apply(d,p)).next())});import{r as n,j as e,u as J,d as M,L as B,h as H,_ as W}from"./index-DEHvOCR0.js";import{P as Z}from"./index.esm-D6ajMPZ9.js";import{h as ee}from"./html2canvas.esm-V-rdnldR.js";const ae=({results:d,circuitId:p,circuitName:i,date:y,division:o,fastestLapDriver:u,onShareComplete:j,onShareError:c,debug:g=!1})=>{var w;const b=n.useRef(null),[D,R]=n.useState(!1);n.useEffect(()=>{d&&d.length>0&&!g&&A()},[d,g]);const A=()=>k(null,null,function*(){if(!(!b.current||D)){R(!0);try{yield new Promise(f=>setTimeout(f,800)),(yield ee(b.current,{useCORS:!0,backgroundColor:"#090d17",scale:3,logging:!1,onclone:f=>{const t=f.querySelector(".race-story-template");t&&(t.style.width="450px",t.style.height="800px",t.style.position="relative",t.style.top="0",t.style.left="0")}})).toBlob(f=>k(null,null,function*(){var I;if(!f)throw new Error;const t=new File([f],`ck-results-${i.replace(/\s+/g,"-").toLowerCase()}.png`,{type:"image/png"});if((I=navigator.canShare)!=null&&I.call(navigator,{files:[t]}))yield navigator.share({files:[t]});else{const N=URL.createObjectURL(f),S=document.createElement("a");S.href=N,S.download=t.name,S.click(),URL.revokeObjectURL(N)}j==null||j(),R(!1)}),"image/png",1)}catch(l){console.error("Error generating race share:",l),c==null||c("Error al generar imagen"),R(!1)}}});if(!d||d.length===0)return null;const _=[...d].sort((l,f)=>l.posicion-f.posicion).slice(0,10),E={1:"https://iili.io/ftKPX2e.png",2:"https://iili.io/ftKPwpj.png"}[p]||"https://wikikarting.com/wp-content/uploads/2021/03/Instalaciones-Karting-Canarias.webp";return e.jsx("div",{className:`race-story-template ${g?"debug-visible":""}`,ref:b,children:e.jsxs("div",{className:"container",style:{padding:"0",width:"100%",maxWidth:"100%",margin:"0"},children:[e.jsxs("div",{id:"race-info",className:"glass-header",style:{"--header-bg":`url(${E})`},children:[e.jsxs("div",{className:"header-chips",children:[e.jsxs("span",{className:"chip chip-season",children:["Temporada ",((w=d[0])==null?void 0:w.temporada)||"2026"]}),e.jsxs("span",{className:"chip chip-division",children:[" ",o,"ª División"]})]}),e.jsx("h1",{className:"header-title",children:i}),e.jsxs("p",{className:"header-date",children:[e.jsx("i",{className:"fa-regular fa-calendar-days"})," ",y]})]}),e.jsxs("section",{id:"resultado-section",children:[e.jsxs("h2",{style:{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none",padding:"16px 20px",margin:"0"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:e.jsx("span",{children:"🏁 Resultado Final"})}),e.jsx("i",{className:"fa-solid fa-chevron-up",style:{fontSize:"0.8em"}})]}),e.jsxs("div",{className:"collapsible-content open",style:{maxHeight:"none",opacity:1,padding:"0 10px"},children:[e.jsx("div",{id:"resultado-table",className:"results-table-container",children:e.jsx("div",{className:"grid-container",style:{marginTop:"10px"},children:_.map((l,f)=>{let t=l.posicion===1?"pos-1":"";return l.posicion>1&&l.posicion<=3&&(t+=" pos-podium"),e.jsx("div",{className:`grid-item ${t}`,"data-pos":l.posicion,children:e.jsxs("div",{className:"grid-piloto-container",children:[e.jsxs("span",{className:"grid-pos",children:[l.posicion,"."]}),e.jsxs("div",{className:"grid-piloto-link",style:{textDecoration:"none",display:"block",width:"100%"},children:[e.jsx("span",{className:"grid-piloto",children:l.piloto}),e.jsx("br",{}),e.jsx("span",{className:"grid-piloto",style:{fontSize:"0.7rem",color:"#94a3b8",textAlign:"center",width:"100%",display:"block"},children:l.vuelta_rapida})]})]})},f)})})}),u&&e.jsx("div",{className:"fastest-lap-banner",style:{margin:"15px 0"},children:e.jsxs("div",{className:"fl-content",children:[e.jsxs("div",{className:"fl-label",children:[e.jsx("i",{className:"fa-solid fa-stopwatch-20"})," VUELTA RÁPIDA"]}),e.jsx("div",{className:"fl-driver",children:u.piloto}),e.jsxs("div",{className:"fl-time",children:["⏱️ ",u.vuelta_rapida]})]})})]})]}),e.jsx("div",{className:"story-footer-branding",children:"Canary Karting"})]})})},ce=()=>{var T,$,O,F,K,U,G,q;const[d]=J(),p=d.get("id"),i=d.get("date"),y=d.get("circuitName"),o=d.get("division"),[u,j]=n.useState([]),[c,g]=n.useState([]),[b,D]=n.useState(null),[R,A]=n.useState(null),[z,_]=n.useState(!0),{user:L}=M(),[E,w]=n.useState(null),[l,f]=n.useState(!1),[t,I]=n.useState(!1),N=n.useRef(null),[S,V]=n.useState(null),[Y,se]=n.useState(!1);n.useEffect(()=>{t&&N.current&&setTimeout(()=>{N.current.scrollIntoView({behavior:"smooth",block:"start"})},300)},[t]),n.useEffect(()=>{if(!z&&b==1){const h=setTimeout(()=>{f(!0)},300);return()=>clearTimeout(h)}},[z,b]),n.useEffect(()=>{if(!p||!i){w("Error: Faltan parámetros de circuito o fecha."),_(!1);return}k(null,null,function*(){try{const{clasi:r,results:v,raceInfo:a}=yield H(p,i,o),m=r.filter(x=>x.id_circuito===p&&x.fecha===i&&(!o||x.division==o)),s=v.filter(x=>x.id_circuito===p&&x.fecha===i&&(!o||x.division==o));j(m),g(s),D((a==null?void 0:a.terminada)||"0"),A((a==null?void 0:a.activa)||"0")}catch(r){console.error(r),w("Error al cargar los datos de la carrera.")}finally{_(!1)}})},[p,i,o]);const P=(h,r)=>{if(h.length===0)return e.jsxs("p",{className:"empty-message",style:{textAlign:"center",color:"#94a3b8"},children:["No hay datos de ",r," para esta carrera."]});const v=[...h].sort((a,m)=>a.descalificacion==1&&m.descalificacion!=1?1:a.descalificacion!=1&&m.descalificacion==1?-1:a.posicion-m.posicion);return e.jsx("div",{className:"grid-container",children:v.map((a,m)=>{const s=a.descalificacion==1?"DSC":a.posicion;let x=s===1?"pos-1":"";return r==="resultados"&&a.posicion>1&&a.posicion<=3&&a.descalificacion!=1&&(x+=" pos-podium"),a.descalificacion==1&&(x+=" pos-dsq"),e.jsxs("div",{className:`grid-item ${x}`,"data-pos":s,children:[r==="clasificacion"&&a.posicion===1&&e.jsx("div",{className:"grid-points-badge pole-pos",children:"+1 pts"}),r==="resultados"&&a.pts>0&&a.descalificacion!=1&&e.jsxs("div",{className:`grid-points-badge${a.es_vuelta_rapida?" fastest-lap":""}`,children:[a.es_vuelta_rapida?`${a.pts_base}+1`:a.pts," pts"]}),r==="resultados"&&a.kart&&e.jsxs("div",{className:"grid-penalty grid-kart kart-top-left",title:"Kart",children:["Kart - ",a.kart]}),e.jsxs("div",{className:"grid-piloto-container",children:[e.jsxs("span",{className:"grid-pos",children:[s,"."]}),e.jsx("div",{className:"grid-piloto-info",children:e.jsx(B,{to:`/profile?driver=${encodeURIComponent(a.piloto.replace(/\*/g,""))}&season=${a.temporada}`,className:"grid-piloto-link",children:e.jsx("span",{className:"grid-piloto",children:a.piloto})})})]}),r==="resultados"&&(a.sancion==1||a.amonestacion==1||a.descalificacion==1)&&e.jsxs("div",{className:"grid-penalties-wrapper",children:[a.sancion==1&&e.jsx("div",{className:"grid-penalty grid-sancion",title:"Sanción",children:"Sanción"}),a.amonestacion==1&&e.jsx("div",{className:"grid-penalty grid-amonestacion",title:"Amonestación",children:"Amonestación"})]}),a.vuelta_rapida&&a.vuelta_rapida!=="N/A"&&e.jsxs("div",{className:"grid-lap-time",children:[e.jsx("i",{className:"fa-solid fa-stopwatch"})," ",a.vuelta_rapida]})]},m)})})};if(z)return e.jsxs("div",{className:"container",style:{textAlign:"center",color:"#94a3b8",paddingTop:"50px"},children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin"})," Cargando resultados..."]});if(E)return e.jsx("div",{className:"container",children:e.jsx("div",{className:"error-message",style:{textAlign:"center",color:"#ef4444",padding:"20px"},children:E})});const Q=()=>k(null,null,function*(){const{clearCache:h}=yield W(()=>k(null,null,function*(){const{clearCache:r}=yield import("./index-DEHvOCR0.js").then(v=>v.G);return{clearCache:r}}),__vite__mapDeps([0,1]));h();try{const{clasi:r,results:v}=yield H(p,i,o),a=r.filter(s=>s.id_circuito===p&&s.fecha===i&&(!o||s.division==o)),m=v.filter(s=>s.id_circuito===p&&s.fecha===i&&(!o||s.division==o));j(a),g(m)}catch(r){console.error(r),w("Error al cargar los datos de la carrera.")}}),X={1:"https://iili.io/ftKPX2e.png",2:"https://iili.io/ftKPwpj.png"}[p]||"https://wikikarting.com/wp-content/uploads/2021/03/Instalaciones-Karting-Canarias.webp",C=(h=>{if(!h||h.length===0)return null;let r=null,v=1/0;for(const a of h)if(a.descalificacion!=1&&a.vuelta_rapida&&typeof a.vuelta_rapida=="string"&&a.vuelta_rapida.trim()!==""&&a.vuelta_rapida.toLowerCase()!=="n/a"){const m=a.vuelta_rapida.replace(",",".");let s=1/0;if(m.includes(":")){const x=m.split(":");s=parseFloat(x[0])*60+parseFloat(x[1])}else s=parseFloat(m);!isNaN(s)&&s>0&&s<v&&(v=s,r=a)}return r})(c);return e.jsx(Z,{onRefresh:Q,pullingContent:"",children:e.jsxs("div",{className:"container",children:[e.jsxs("div",{id:"race-info",className:"glass-header",style:{"--header-bg":`url(${X})`},children:[e.jsxs("div",{className:"header-chips",children:[(((T=u[0])==null?void 0:T.temporada)||(($=c[0])==null?void 0:$.temporada))&&e.jsxs("span",{className:"chip chip-season",children:["Temporada ",((O=u[0])==null?void 0:O.temporada)||((F=c[0])==null?void 0:F.temporada)]}),(((K=u[0])==null?void 0:K.division)||((U=c[0])==null?void 0:U.division))&&e.jsxs("span",{className:"chip chip-division",children:[" ",((G=u[0])==null?void 0:G.division)||((q=c[0])==null?void 0:q.division)," División"]})]}),e.jsx("h1",{className:"header-title",children:y}),e.jsxs("p",{className:"header-date",children:[e.jsx("i",{className:"fa-regular fa-calendar-days"})," ",i]})]}),b==1?e.jsxs(e.Fragment,{children:[e.jsxs("section",{id:"clasificacion-section",children:[e.jsxs("h2",{onClick:()=>f(!l),style:{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none"},children:[e.jsx("span",{style:{color:"var(--text-main)",textShadow:"none"},children:"⏱️ Qualy"}),e.jsx("i",{className:`fa-solid fa-chevron-${l?"up":"down"}`,style:{fontSize:"0.8em",transition:"transform 0.3s"}})]}),e.jsx("div",{className:`collapsible-content ${l?"open":""}`,children:e.jsx("div",{id:"clasificacion-table",className:"results-table-container",children:P(u,"clasificacion")})})]}),e.jsxs("section",{id:"resultado-section",ref:N,children:[e.jsxs("h2",{onClick:()=>I(!t),style:{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",userSelect:"none"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("span",{style:{color:"var(--text-main)",textShadow:"none"},children:"🏁 Resultado Final"}),c.length>0&&e.jsx("span",{})]}),e.jsx("i",{className:`fa-solid fa-chevron-${t?"up":"down"}`,style:{fontSize:"0.8em",transition:"transform 0.3s"}})]}),e.jsxs("div",{className:`collapsible-content ${t?"open":""}`,children:[e.jsx("div",{id:"resultado-table",className:"results-table-container",children:P(c,"resultados")}),C&&e.jsx("div",{className:"fastest-lap-banner fade-in",children:e.jsxs("div",{className:"fl-content",children:[e.jsxs("div",{className:"fl-label",children:[e.jsx("i",{className:"fa-solid fa-stopwatch-20"})," VUELTA RÁPIDA DE CARRERA"]}),e.jsx("div",{className:"fl-driver",children:C.piloto}),e.jsxs("div",{className:"fl-time",children:["⏱️ ",C.vuelta_rapida]}),e.jsx("div",{className:"fl-time",style:{fontSize:"0.8em",marginTop:"5px"},children:"(+1 pto)"})]})})]})]})]}):e.jsx("div",{className:"unfinished-race-container fade-in",children:e.jsxs("div",{className:"unfinished-card",children:[e.jsx("i",{className:"fa-solid fa-flag-checkered unfinished-icon"}),e.jsx("h3",{children:"Próxima carrera"}),e.jsx("p",{children:"Esta carrera aún no ha finalizado. Te avisaremos cuando se publiquen los resultados."}),L&&R==1&&e.jsxs("div",{className:"assistance-action",children:[e.jsx("div",{className:"divider"}),e.jsx("p",{className:"assistance-note",children:"Si eres piloto recuerda que debes confirmar tu asistencia"}),e.jsxs(B,{to:"/assistance-confirmation",state:{raceName:y,raceDate:i},className:"btn-assistance",children:[e.jsx("i",{className:"fa-solid fa-check-to-slot"})," Confirmar Asistencia"]})]})]})}),e.jsx("style",{children:`
                    .fastest-lap-banner {
                        margin: 15px 10px 10px;
                        background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(217, 70, 239, 0.15));
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border-radius: 20px;
                        padding: 20px;
                        text-align: center;
                        border: 1px solid rgba(168, 85, 247, 0.4);
                        box-shadow: 0 0 25px rgba(168, 85, 247, 0.25);
                        position: relative;
                        overflow: hidden;
                    }

                    .fastest-lap-banner::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(217, 70, 239, 0.1) 0%, transparent 70%);
                        animation: rotateGlow 10s linear infinite;
                    }

                    @keyframes rotateGlow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .fl-content { position: relative; z-index: 1; }

                    .fl-label {
                        font-size: 0.7rem;
                        font-weight: 800;
                        color: #d946ef;
                        letter-spacing: 0.25em;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        text-shadow: 0 0 10px rgba(217, 70, 239, 0.3);
                    }

                    .fl-driver {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.6rem;
                        color: #f8fafc;
                        margin-bottom: 4px;
                        text-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
                    }

                    .fl-time {
                        font-size: 1.1rem;
                        color: #e2e8f0;
                        font-weight: 700;
                        letter-spacing: 0.05em;
                    }

                    /* UNFINISHED RACE PLACEHOLDER */
                    .unfinished-race-container {
                        margin-top: 20px;
                    }

                    .unfinished-card {
                        background: rgba(30, 41, 59, 0.4);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        padding: 40px 20px;
                        border-radius: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        text-align: center;
                        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                    }

                    .unfinished-icon {
                        font-size: 3rem;
                        color: #64748b;
                        margin-bottom: 20px;
                        opacity: 0.5;
                    }

                    .unfinished-card h3 {
                        font-family: 'Russo One', sans-serif;
                        color: #f1f5f9;
                        margin-bottom: 10px;
                        font-size: 1.4rem;
                    }

                    .unfinished-card p {
                        color: #94a3b8;
                        font-size: 1rem;
                        max-width: 250px;
                        margin: 0 auto;
                    }

                    .assistance-action {
                        margin-top: 30px;
                        padding-top: 10px;
                    }

                    .assistance-action .divider {
                        height: 1px;
                        background: rgba(255, 255, 255, 0.1);
                        width: 80%;
                        margin: 0 auto 25px;
                    }

                    .assistance-note {
                        margin-bottom: 15px !important;
                        font-weight: 500;
                        color: #f1f5f9 !important;
                    }

                    .btn-assistance {
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        background: var(--accent);
                        color: white;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-weight: 700;
                        font-size: 0.95rem;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
                        transition: all 0.3s ease;
                    }

                    .btn-assistance:hover {
                        background: var(--accent-hover);
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                    }

                    .btn-assistance i {
                        font-size: 1.1rem;
                    }

                    /* GLASS HEADER */
                    .glass-header {
                        position: relative;
                        background: rgba(15, 23, 42, 0.4);
                        padding: 30px 20px;
                        border-radius: 24px;
                        margin-bottom: 24px;
                        text-align: center;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        overflow: hidden;
                    }

                    .glass-header::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-image: var(--header-bg);
                        background-size: cover;
                        background-position: center;
                        filter: blur(2.5px) brightness(0.8);
                        z-index: -1;
                        transform: scale(1.1); /* Prevent blur edges */
                    }

                    .header-chips, .header-title, .header-date {
                        position: relative;
                        z-index: 1;
                    }

                    .header-chips {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        margin-bottom: 12px;
                    }

                    .chip {
                        padding: 4px 12px;
                        border-radius: 99px;
                        font-size: 0.7rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .chip-season { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
                    .chip-division { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

                    .header-title {
                        font-size: 1.75rem;
                        font-weight: 900;
                        color: #f8fafc;
                        margin: 0 0 10px 0;
                        letter-spacing: -0.02em;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }

                    .header-date {
                        display: flex;
                        justify-content: center;
                        gap: 16px;
                        color: #94a3b8;
                        font-size: 0.85rem;
                        margin: 0;
                    }

                    .header-date i {
                        margin-right: 6px;
                        color: #3b82f6;
                    }

                    /* SUBTLE GLASS SECTIONS */
                    #clasificacion-section, #resultado-section {
                        background: rgba(30, 41, 59, 0.4);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        border-radius: 16px;
                        margin-bottom: 20px;
                        border: 1px solid rgba(255, 255, 255, 0.04);
                        overflow: hidden;
                    }

                    #clasificacion-section h2, #resultado-section h2 {
                        padding: 16px 20px !important;
                        margin: 0 !important;
                        font-size: 1.1rem !important;
                        transition: background 0.2s;
                    }

                    #clasificacion-section h2:active, #resultado-section h2:active {
                        background: rgba(255, 255, 255, 0.02);
                    }

                    .grid-container {
                        background: rgba(15, 23, 42, 0.3) !important;
                        backdrop-filter: blur(6px);
                        -webkit-backdrop-filter: blur(6px);
                        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                        padding: 15px !important;
                        margin-top: 10px !important;
                    }

                    .collapsible-content {
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out;
                        opacity: 0;
                    }
                    
                    .collapsible-content.open {
                        max-height: 2000px; /* Large enough value to fit content */
                        opacity: 1;
                    }

                    .results-table-container {
                        padding-top: 10px;
                        padding-bottom: 20px;
                    }
                    .grid-piloto-info {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }

                    .grid-lap-time {
                        position: absolute;
                        bottom: -10px;
                        right: 8px;
                        background: rgba(15, 23, 42, 0.85);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        padding: 3px 12px;
                        border-radius: 12px;
                        font-size: 0.9rem;
                        color: #f1f5f9;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-family: 'JetBrains Mono', monospace;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                        z-index: 20;
                        transition: all 0.3s ease;
                    }

                    .grid-item:hover .grid-lap-time {
                        transform: translateY(-2px);
                        background: rgba(30, 41, 59, 0.95);
                        border-color: rgba(255, 255, 255, 0.2);
                    }

                    .grid-lap-time i {
                        font-size: 0.8em;
                        color: var(--accent);
                    }

                    .grid-penalties-wrapper {
                        position: absolute;
                        bottom: -10px;
                        left: 8px;
                        display: flex;
                        gap: 4px;
                        z-index: 20;
                    }

                    .grid-penalty {
                        background: rgba(15, 23, 42, 0.85);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        padding: 2px 8px;
                        border-radius: 8px;
                        font-size: 0.75rem;
                        font-weight: bold;
                        color: #f1f5f9;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                        transition: all 0.3s ease;
                    }

                    .grid-sancion {
                        border: 2px solid rgba(239, 68, 68, 0.4);
                    }

                    .grid-amonestacion {
                        border: 2px solid rgba(234, 179, 8, 0.4);
                    }

                    .grid-descalificacion {
                        border: 2px solid rgba(239, 68, 68, 0.7);
                        color: #ef4444;
                    }

                    .grid-item.pos-dsq {
                        opacity: 0.7;
                    }

                    .grid-item.pos-dsq .grid-pos {
                        color: #ef4444;
                        font-weight: 800;
                    }

                    .grid-kart {
                        border: 2px solid rgba(59, 130, 246, 0.4);
                    }

                    .kart-top-left {
                        position: absolute;
                        top: -17px;
                        left: 8px;
                        z-index: 20;
                    }

                    .grid-points-badge {
                        position: absolute;
                        top: -17px;
                        right: 8px;
                        background: rgba(15, 23, 42, 0.85);
                        border: 2px solid rgba(251, 191, 36, 0.4);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        padding: 2px 8px;
                        border-radius: 8px;
                        font-size: 0.75rem;
                        font-weight: bold;
                        color: #fbbf24;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                        z-index: 20;
                        transition: all 0.3s ease;
                    }

                    .grid-points-badge.fastest-lap {
                        border-color: rgba(168, 85, 247, 0.5);
                        color: #c084fc;
                    }

                    .grid-points-badge.pole-pos {
                        border-color: rgba(16, 185, 129, 0.5);
                        color: #34d399;
                    }

                    .grid-item:hover .grid-points-badge {
                        transform: translateY(-2px);
                        background: rgba(30, 41, 59, 0.95);
                    }

                    .grid-item:hover .grid-penalty {
                        transform: translateY(-2px);
                        background: rgba(30, 41, 59, 0.95);
                    }

                    .grid-lap-time.is-fastest {
                        background: linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(217, 119, 6, 0.15));
                        border: 1px solid rgba(251, 191, 36, 0.5);
                        color: #fbbf24;
                        box-shadow: 0 0 15px rgba(251, 191, 36, 0.25);
                        font-weight: 800;
                        text-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
                    }

                    .grid-lap-time.is-fastest i {
                        color: #fbbf24;
                        animation: pulse-gold 2s infinite;
                    }

                    @keyframes pulse-gold {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }

                    @media (max-width: 600px) {
                        .grid-lap-time {
                            padding: 2px 8px;
                            font-size: 0.75rem;
                            bottom: -15px;
                            right: 4px;
                        }
                        .grid-penalties-wrapper {
                            bottom: -15px;
                            left: 4px;
                            gap: 2px;
                        }
                        .grid-penalty {
                            padding: 2px 5px;
                            font-size: 0.70rem;
                        }
                    }
                `}),e.jsx(ae,{results:S,circuitId:p,circuitName:y,date:i,division:o,fastestLapDriver:C,debug:Y,onShareComplete:()=>V(null),onShareError:h=>alert(h)})]})})};export{ce as default};
