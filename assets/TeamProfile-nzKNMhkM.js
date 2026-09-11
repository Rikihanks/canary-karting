const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DEHvOCR0.js","assets/index-DeAfXq3h.css"])))=>i.map(i=>d[i]);
var u=(g,l,a)=>new Promise((t,m)=>{var v=o=>{try{x(a.next(o))}catch(p){m(p)}},b=o=>{try{x(a.throw(o))}catch(p){m(p)}},x=o=>o.done?t(o.value):Promise.resolve(o.value).then(v,b);x((a=a.apply(g,l)).next())});import{u as S,r as h,l as D,j as e,L as E,D as N,m as y,g as k,_ as R}from"./index-DEHvOCR0.js";import{P as T}from"./index.esm-D6ajMPZ9.js";import{C as O}from"./CountUp-DYjVZJhR.js";const A=()=>{const[g]=S(),l=g.get("team"),a=g.get("season")||"2025",[t,m]=h.useState(null),[v,b]=h.useState([]),[x,o]=h.useState(!0),[p,f]=h.useState(null);if(h.useEffect(()=>{if(!l){f("No se especificó un equipo."),o(!1);return}u(null,null,function*(){try{const[r,c]=yield Promise.all([y(),k()]),i=r.find(n=>n.name===l&&n.season===a);if(!i)f("Equipo no encontrado.");else{m(i);const n=c.filter(s=>i.pilots.includes(s.name)&&s.season===a),w=i.pilots.map(s=>n.find(j=>j.name===s)||{name:s,photo:null});b(w)}}catch(r){console.error(r),f("Error de conexión.")}finally{o(!1)}}),D("team_view",{team:l,season:a})},[l,a]),x)return e.jsxs("div",{className:"container",style:{textAlign:"center",color:"#94a3b8",paddingTop:"50px"},children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin"})," Cargando perfil de equipo..."]});if(p)return e.jsx("div",{className:"container",children:e.jsx("div",{className:"profile-card",children:e.jsx("h1",{style:{color:"#ef4444"},children:p})})});const z=()=>u(null,null,function*(){const{clearCache:d}=yield R(()=>u(null,null,function*(){const{clearCache:r}=yield import("./index-DEHvOCR0.js").then(c=>c.G);return{clearCache:r}}),__vite__mapDeps([0,1]));d();try{const[r,c]=yield Promise.all([y(),k()]),i=r.find(n=>n.name===l&&n.season===a);if(!i)f("Equipo no encontrado.");else{m(i);const n=c.filter(s=>i.pilots.includes(s.name)&&s.season===a),w=i.pilots.map(s=>n.find(j=>j.name===s)||{name:s,photo:null});b(w)}}catch(r){console.error(r),f("Error de conexión.")}});return e.jsx(T,{onRefresh:z,pullingContent:"",children:e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"team-hero fade-in",style:{"--team-logo":`url(${t.logo})`},children:[e.jsx("div",{className:"hero-watermark"}),e.jsx("div",{className:"hero-left",children:t.logo?e.jsx("img",{src:t.logo,alt:t.name,className:"team-logo-hero"}):e.jsx("div",{className:"team-logo-placeholder",children:e.jsx("i",{className:"fa-solid fa-users"})})}),e.jsxs("div",{className:"hero-right",children:[e.jsxs("div",{className:"hero-header",children:[e.jsx("h1",{className:"team-name-hero",children:t.name}),e.jsxs("div",{className:"division-badge",children:[t.division,"ª DIVISIÓN"]})]}),e.jsxs("div",{className:"hero-stats",children:[e.jsxs("div",{className:"hero-stat-item",children:[e.jsx("span",{className:"h-val",children:e.jsx(O,{end:t.points})}),e.jsx("span",{className:"h-lbl",children:"PUNTOS"})]}),e.jsxs("div",{className:"hero-stat-item",children:[e.jsx("span",{className:"h-val",children:t.wins}),e.jsx("span",{className:"h-lbl",children:"VICTORIAS"})]})]})]})]}),e.jsxs("div",{className:"stats-row fade-in",style:{animationDelay:"0.1s"},children:[e.jsxs("div",{className:"stat-card silver",children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-medal"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:t.podiums}),e.jsx("span",{className:"stat-title",children:"Podios"})]})]}),e.jsxs("div",{className:"stat-card purple",children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-stopwatch"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:t.poles}),e.jsx("span",{className:"stat-title",children:"Poles"})]})]})]}),e.jsxs("div",{className:"roster-section fade-in",style:{animationDelay:"0.2s"},children:[e.jsx("h2",{className:"section-title",children:"PILOTOS"}),e.jsx("div",{className:"roster-grid",children:v.map((d,r)=>e.jsx(E,{to:`/profile?driver=${encodeURIComponent(d.name)}&season=${a}`,className:"pilot-card-link",children:e.jsxs("div",{className:"pilot-card",children:[e.jsx("div",{className:"pilot-img-wrapper",children:e.jsx("img",{src:d.photo||N,alt:d.name,className:"pilot-img",onError:c=>{c.target.src=N}})}),e.jsx("div",{className:"pilot-name",children:d.name})]})},r))})]}),e.jsx("style",{children:`
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 15px;
                    }

                    /* Animations */
                    .fade-in {
                        opacity: 0;
                        animation: fadeIn 0.6s ease-out forwards;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    /* Hero Section */
                    /* Hero Section */
                    .team-hero {
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                        border-radius: 24px;
                        padding: 40px;
                        display: flex;
                        align-items: center;
                        gap: 40px;
                        position: relative;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 100px rgba(0,0,0,0.5);
                        margin-bottom: 40px;
                        z-index: 1;
                    }

                    .hero-watermark {
                        position: absolute;
                        top: 50%;
                        right: -10%;
                        width: 80%;
                        height: 150%;
                        transform: translateY(-50%) rotate(-15deg);
                        background-image: var(--team-logo);
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                        opacity: 0.07;
                        pointer-events: none;
                        z-index: -1;
                        filter: grayscale(100%) contrast(1.2);
                        mix-blend-mode: overlay;
                    }

                    /* Neon Accent Line */
                    .team-hero::after {
                        content: '';
                        position: absolute;
                        bottom: 0; left: 0; width: 100%; height: 6px;
                        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
                        box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
                    }

                    .hero-left {
                        flex-shrink: 0;
                        z-index: 2;
                        position: relative;
                    }

                    .hero-right {
                        flex-grow: 1;
                        z-index: 2;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }

                    .team-logo-hero {
                        height: 160px;
                        border-radius: 24px;
                        /* Neon Glow Shadow */
                        object-fit: contain; /* Full logo visibility */
                        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }

                    .team-logo-placeholder {
                        width: 160px;
                        height: 160px;
                        border-radius: 24px;
                        background: #1e293b;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 4rem;
                        color: #475569;
                        box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
                    }

                    .hero-header {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        margin-bottom: 25px;
                    }

                    .team-name-hero {
                        font-family: 'Russo One', sans-serif;
                        font-size: 3.5rem; /* Massive */
                        margin: 0;
                        line-height: 0.9;
                        background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-transform: uppercase;
                        letter-spacing: -1px;
                        text-align: left;
                        filter: drop-shadow(0 4px 0px rgba(0,0,0,0.5)); /* 3D Text block effect */
                        position: relative;
                        z-index: 10;
                    }

                    .division-badge {
                        display: inline-block;
                        background: rgba(59, 130, 246, 0.1);
                        color: #60a5fa;
                        padding: 8px 16px;
                        border-radius: 4px;
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 800;
                        font-size: 0.9rem;
                        margin-top: 15px;
                        border-left: 4px solid #60a5fa;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        backdrop-filter: blur(5px);
                    }

                    .hero-stats {
                        display: flex;
                        gap: 40px;
                        padding-top: 20px;
                        border-top: 2px solid rgba(255,255,255,0.05);
                        width: 100%;
                    }

                    .hero-stat-item {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .h-val {
                        font-family: 'Russo One', sans-serif;
                        font-size: 2.5rem;
                        color: #fbbf24;
                        line-height: 1;
                        text-shadow: 0 0 20px rgba(251, 191, 36, 0.4); /* Gold Glow */
                    }

                    .h-lbl {
                        font-size: 0.8rem;
                        color: #94a3b8;
                        font-weight: 700;
                        letter-spacing: 1px;
                        margin-top: 5px;
                        text-transform: uppercase;
                    }

                    @media (max-width: 768px) {
                        .team-hero {
                            flex-direction: column;
                            text-align: center;
                            padding: 30px 20px;
                            gap: 20px;
                        }
                        .hero-watermark {
                            width: 100%;
                            height: 100%;
                            top: 0;
                            right: 0;
                            transform: none;
                            opacity: 0.05;
                            background-size: cover;
                        }
                        
                        .hero-right {
                             align-items: center;
                        }
                        .hero-header {
                            align-items: center;
                        }
                        .team-name-hero {
                            font-size: 2.2rem;
                            text-align: center;
                        }
                        .hero-stats {
                            justify-content: center;
                            gap: 30px;
                        }
                        .hero-stat-item {
                            align-items: center;
                        }
                    }

                    /* Stats Row */
                    .stats-row {
                        display: flex;
                        gap: 12px;
                        margin-bottom: 30px;
                    }

                    .stat-card {
                        flex: 1;
                        background: #1e293b;
                        border-radius: 16px;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: transform 0.2s, box-shadow 0.2s;
                    }

                    .stat-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                    }

                    .stat-card.gold { background: linear-gradient(145deg, #1e293b, rgba(251, 191, 36, 0.1)); border-bottom: 3px solid #fbbf24; }
                    .stat-card.silver { background: linear-gradient(145deg, #1e293b, rgba(148, 163, 184, 0.1)); border-bottom: 3px solid #94a3b8; }
                    .stat-card.purple { background: linear-gradient(145deg, #1e293b, rgba(168, 85, 247, 0.1)); border-bottom: 3px solid #a855f7; }

                    .stat-icon-wrapper {
                        width: 45px;
                        height: 45px;
                        border-radius: 12px;
                        background: rgba(255, 255, 255, 0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        margin-right: 15px;
                    }

                    .gold .stat-icon-wrapper { color: #fbbf24; }
                    .silver .stat-icon-wrapper { color: #94a3b8; }
                    .purple .stat-icon-wrapper { color: #a855f7; }

                    .stat-info {
                        display: flex;
                        flex-direction: column;
                    }

                    .stat-number {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.8rem;
                        line-height: 1;
                    }

                    .stat-title {
                        font-size: 0.85rem;
                        color: #94a3b8;
                        text-transform: uppercase;
                        font-weight: 600;
                    }

                    /* Roster Section */
                    .section-title {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.3rem;
                        margin-bottom: 15px;
                        color: var(--text-main);
                        border-left: 4px solid var(--accent);
                        padding-left: 15px;
                    }

                    .roster-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                        gap: 15px;
                    }

                    .pilot-card-link {
                        text-decoration: none;
                        color: inherit;
                    }

                    .pilot-card {
                        background: #1e293b;
                        border-radius: 16px;
                        padding: 15px;
                        text-align: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: all 0.3s ease;
                    }

                    .pilot-card:hover {
                        transform: translateY(-5px);
                        background: #253045;
                        border-color: var(--accent);
                        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
                    }

                    .pilot-img-wrapper {
                        width: 75px;
                        height: 75px;
                        margin: 0 auto 12px auto;
                        position: relative;
                    }

                    .pilot-img {
                        width: 100%;
                        height: 100%;
                        border-radius: 12px;
                        object-fit: cover;
                        object-position: top;
                        border: 3px solid rgba(255, 255, 255, 0.1);
                    }

                    .pilot-img-placeholder {
                        width: 100%;
                        height: 100%;
                        border-radius: 12px;
                        background: #334155;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        color: #94a3b8;
                    }

                    .pilot-name {
                        font-weight: 700;
                        font-size: 1rem;
                        margin-bottom: 5px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .pilot-role {
                        font-size: 0.75rem;
                        color: var(--accent);
                        font-weight: 600;
                        letter-spacing: 1px;
                    }

                    @media (max-width: 600px) {
                        .team-name-hero { font-size: 1.8rem; }
                        .stats-row { flex-direction: column; gap: 10px; }
                        .stat-card { padding: 15px; }
                        .roster-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                `})]})})};export{A as default};
