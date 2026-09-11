const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DEHvOCR0.js","assets/index-DeAfXq3h.css"])))=>i.map(i=>d[i]);
var J=Object.defineProperty,K=Object.defineProperties;var q=Object.getOwnPropertyDescriptors;var _=Object.getOwnPropertySymbols;var Q=Object.prototype.hasOwnProperty,X=Object.prototype.propertyIsEnumerable;var O=(m,l,r)=>l in m?J(m,l,{enumerable:!0,configurable:!0,writable:!0,value:r}):m[l]=r,C=(m,l)=>{for(var r in l||(l={}))Q.call(l,r)&&O(m,r,l[r]);if(_)for(var r of _(l))X.call(l,r)&&O(m,r,l[r]);return m},R=(m,l)=>K(m,q(l));var z=(m,l,r)=>new Promise((x,u)=>{var c=g=>{try{v(r.next(g))}catch(f){u(f)}},w=g=>{try{v(r.throw(g))}catch(f){u(f)}},v=g=>g.done?x(g.value):Promise.resolve(g.value).then(c,w);v((r=r.apply(m,l)).next())});import{u as Z,r as h,l as ee,j as e,g as E,c as A,_ as ae}from"./index-DEHvOCR0.js";import{P as se}from"./index.esm-D6ajMPZ9.js";import{C as te}from"./CountUp-DYjVZJhR.js";const le=()=>{const[m]=Z(),l=m.get("driver"),r=m.get("season")||"2026",[x,u]=h.useState(null),[c,w]=h.useState([]),[v,g]=h.useState(!0),[f,j]=h.useState(null),[D,S]=h.useState(!1),[I,T]=h.useState(""),[L,M]=h.useState(null),b=a=>a?a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim():"";h.useEffect(()=>{if(!l){j("No se especificó un piloto."),g(!1);return}z(null,null,function*(){try{const s=yield E(),t=yield A(),i=b(l),o=s.filter(p=>b(p.name)===i&&p.season===r),y=t.filter(p=>b(p.name)===i&&p.season===r);if(o.length===0)j("Piloto no encontrado.");else{const p=o.reduce((d,n)=>R(C({},n),{points:d.points+(n.points||0),wins:d.wins+(n.wins||0),podiums:d.podiums+(n.podiums||0),poles:d.poles+(n.poles||0),sanciones:d.sanciones+(n.sanciones||0),amonestaciones:d.amonestaciones+(n.amonestaciones||0),division:d.division||n.division,team:d.team||n.team,photo:d.photo||n.photo}),{points:0,wins:0,podiums:0,poles:0,sanciones:0,amonestaciones:0});u(p),w(y)}}catch(s){console.error(s),j("Error de conexión.")}finally{g(!1)}}),ee("profile_view",{pilot:l,season:r})},[l,r]);const k=a=>{let s="",t=null,i=[];a==="victories"?(s="Victorias",i=c.filter(o=>o.position===1),t=N(i)):a==="podiums"?(s="Podios",i=c.filter(o=>o.position>0&&o.position<=3),t=N(i)):a==="poles"?(s="Poles",i=c.filter(o=>o.pole_pos===1),t=N(i)):a==="fastLaps"?(s="Vueltas Rápidas",t=H(c)):a==="sanciones"?(s="Sanciones",i=c.filter(o=>o.sancion==1),t=N(i)):a==="amonestaciones"&&(s="Amonestaciones",i=c.filter(o=>o.amonestacion==1),t=N(i)),T(s),M(t),S(!0)},N=a=>a.length===0?e.jsx("div",{className:"event-detail-empty",children:"No hay registros."}):e.jsx("div",{className:"events-grid",children:a.map((s,t)=>e.jsxs("div",{className:"event-card",children:[e.jsxs("div",{className:"event-card-header",children:[e.jsxs("div",{className:"event-race-info",children:[e.jsx("i",{className:"fa-solid fa-flag-checkered event-icon"}),e.jsxs("span",{className:"race-name",children:[s.race,s.investigating==1&&e.jsx("small",{title:"Bajo Investigación",children:" ⚠️"}),s.sancion==1&&e.jsx("small",{title:"Sanción",children:" 🟥"}),s.amonestacion==1&&e.jsx("small",{title:"Amonestación",children:" 🟨"})]})]}),e.jsx("span",{className:"race-date",children:s.date})]}),e.jsxs("div",{className:"event-stats-grid",children:[e.jsxs("div",{className:"stat-box",children:[e.jsx("i",{className:"fa-solid fa-trophy stat-icon"}),e.jsxs("div",{className:"stat-content",children:[e.jsx("span",{className:"stat-label",children:"Posición"}),e.jsxs("span",{className:"stat-value",children:["P",s.position]})]})]}),e.jsxs("div",{className:"stat-box",children:[e.jsx("i",{className:"fa-solid fa-gauge-high stat-icon"}),e.jsxs("div",{className:"stat-content",children:[e.jsx("span",{className:"stat-label",children:"Salida"}),e.jsxs("span",{className:"stat-value",children:["P",s.pole_pos]})]})]}),e.jsxs("div",{className:"stat-box",children:[e.jsx("i",{className:"fa-solid fa-cloud-sun stat-icon"}),e.jsxs("div",{className:"stat-content",children:[e.jsx("span",{className:"stat-label",children:"Condición"}),e.jsx("span",{className:"stat-value",children:s.condition})]})]}),e.jsxs("div",{className:"stat-box points-box",children:[e.jsx("i",{className:"fa-solid fa-star stat-icon"}),e.jsxs("div",{className:"stat-content",children:[e.jsx("span",{className:"stat-label",children:"Puntos"}),e.jsx("span",{className:"stat-value",children:s.points_gained})]})]}),s.replaces&&e.jsxs("div",{className:"stat-box",style:{gridColumn:"span 2"},children:[e.jsx("i",{className:"fa-solid fa-gauge-high stat-icon"}),e.jsxs("div",{className:"stat-content",children:[e.jsx("span",{className:"stat-label",children:"Sustituye a"}),e.jsx("span",{className:"stat-value",children:s.replaces})]})]})]})]},t))}),H=a=>{const s=a.filter(t=>t.fastest_lap&&t.fastest_lap!=="N/A"&&t.fastest_lap.trim()!=="-");return s.length===0?e.jsx("div",{className:"event-detail-empty",children:"No hay tiempos de vuelta rápida registrados."}):(s.sort((t,i)=>t.fastest_lap.localeCompare(i.fastest_lap)),e.jsx("div",{className:"events-grid",children:s.map((t,i)=>{const o=i===0;return e.jsxs("div",{className:`event-card ${o?"best-lap-card":""}`,children:[e.jsxs("div",{className:"event-card-header",children:[e.jsxs("div",{className:"event-race-info",children:[e.jsx("i",{className:"fa-solid fa-flag-checkered event-icon"}),e.jsx("span",{className:"race-name",children:t.race})]}),e.jsx("span",{className:"race-date",children:t.date})]}),o&&e.jsxs("div",{className:"best-lap-badge",children:[e.jsx("i",{className:"fa-solid fa-crown"})," MEJOR HISTÓRICA"]}),e.jsx("br",{}),e.jsxs("div",{className:"lap-time-display",children:[e.jsx("i",{className:"fa-solid fa-stopwatch lap-icon"}),e.jsx("span",{className:"lap-time",style:{color:o?"#a855f7":"#10b981"},children:t.fastest_lap})]}),e.jsxs("div",{className:"event-stats-grid",children:[e.jsxs("div",{className:"stat-box",children:[e.jsx("i",{className:"fa-solid fa-trophy stat-icon"}),e.jsxs("div",{className:"stat-content",children:[e.jsx("span",{className:"stat-label",children:"Posición"}),e.jsxs("span",{className:"stat-value",children:["P",t.position]})]})]}),e.jsxs("div",{className:"stat-box",children:[e.jsx("i",{className:"fa-solid fa-cloud-sun stat-icon"}),e.jsxs("div",{className:"stat-content",children:[e.jsx("span",{className:"stat-label",children:"Condición"}),e.jsx("span",{className:"stat-value",children:t.condition})]})]})]})]},i)})}))};if(v)return e.jsxs("div",{className:"container",style:{textAlign:"center",color:"#94a3b8",paddingTop:"50px"},children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin"})," Cargando perfil..."]});if(f)return e.jsx("div",{className:"container",children:e.jsx("div",{className:"profile-card",children:e.jsx("h1",{style:{color:"#ef4444"},children:f})})});const V=c.filter(a=>a.position===1).length,F=c.filter(a=>a.position>0&&a.position<=3).length,Y=c.filter(a=>a.pole_pos===1).length,B=c.filter(a=>a.fastest_lap&&a.fastest_lap!=="N/A"&&a.fastest_lap.trim()!=="-").length,G=c.filter(a=>a.sancion==1).length,$=c.filter(a=>a.amonestacion==1).length,U=x.dotdTimes,P=c.filter(a=>a.kart).map(a=>({kart:a.kart,race:a.race,date:a.date,position:a.position})),W=()=>z(null,null,function*(){const{clearCache:a}=yield ae(()=>z(null,null,function*(){const{clearCache:s}=yield import("./index-DEHvOCR0.js").then(t=>t.G);return{clearCache:s}}),__vite__mapDeps([0,1]));a();try{const s=yield E(),t=yield A(),i=b(l),o=s.filter(p=>b(p.name)===i&&p.season===r),y=t.filter(p=>b(p.name)===i&&p.season===r);if(o.length===0)j("Piloto no encontrado.");else{const p=o.reduce((d,n)=>R(C({},n),{points:d.points+(n.points||0),wins:d.wins+(n.wins||0),podiums:d.podiums+(n.podiums||0),poles:d.poles+(n.poles||0),sanciones:d.sanciones+(n.sanciones||0),amonestaciones:d.amonestaciones+(n.amonestaciones||0),division:d.division||n.division,team:d.team||n.team,photo:d.photo||n.photo}),{points:0,wins:0,podiums:0,poles:0,sanciones:0,amonestaciones:0});u(p),w(y)}}catch(s){console.error(s),j("Error de conexión.")}});return e.jsx(se,{onRefresh:W,pullingContent:"",children:e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"driver-hero fade-in",children:[e.jsx("div",{className:"hero-bg",style:{backgroundImage:`url(${x.photo})`}}),e.jsxs("div",{className:"hero-content",children:[e.jsx("img",{src:x.photo,alt:x.name,className:"driver-photo-hero"}),e.jsxs("div",{className:"driver-info-wrapper",children:[e.jsx("h1",{className:"driver-name-hero",children:x.name}),e.jsx("div",{className:"team-name-badge",children:x.team}),e.jsx("div",{className:"division-badge",children:x.division==0?"Piloto Reserva":x.division+"ª DIVISIÓN"})]})]}),e.jsxs("div",{className:"total-points-hero",children:[e.jsx("span",{className:"points-val",children:e.jsx(te,{end:x.points})}),e.jsx("span",{className:"points-label",children:"PUNTOS"}),x.investigating===1&&e.jsx("i",{className:"fa-solid fa-triangle-exclamation investigation-icon profile",title:"Bajo investigación"})]})]}),e.jsxs("div",{className:"stats-section fade-in",style:{animationDelay:"0.05s"},children:[e.jsx("h2",{className:"section-title",children:"ESTADÍSTICAS"}),(()=>{const a=String(x.championship||"0");let s=0,t=[];return a.includes(":")?(t=a.split("|").map(i=>{const[o,y]=i.split(":");return{year:o,div:y}}),s=t.length):s=parseInt(a)||0,e.jsxs("div",{className:`championship-section ${s>0?"gold-tier":"gray-tier"}`,style:{flexDirection:"column",textAlign:"center",gap:"5px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px"},children:[e.jsx("div",{className:"champ-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-trophy champ-icon"})}),e.jsxs("div",{className:"champ-info",children:[e.jsx("span",{className:"champ-count",children:s}),e.jsx("span",{className:"champ-label",children:"CAMPEONATOS GANADOS"})]})]}),t.length>0&&e.jsx("div",{className:"champ-details-list",style:{marginTop:"10px",display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center"},children:t.map((i,o)=>e.jsxs("span",{className:"champ-badge",style:{background:"rgba(255,255,255,0.2)",padding:"4px 8px",borderRadius:"4px",fontSize:"0.8rem",fontWeight:"bold",color:"#fff"},children:[i.year," (",i.div,"ª División)"]},o))})]})})(),e.jsxs("div",{className:"stats-row",children:[e.jsxs("div",{className:"stat-card gold toggle-modal",onClick:()=>k("victories"),children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-trophy"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:V}),e.jsx("span",{className:"stat-title",children:"Victorias"})]})]}),e.jsxs("div",{className:"stat-card silver toggle-modal",onClick:()=>k("podiums"),children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-medal"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:F}),e.jsx("span",{className:"stat-title",children:"Podios"})]})]}),e.jsxs("div",{className:"stat-card purple toggle-modal",onClick:()=>k("poles"),children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-stopwatch"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:Y}),e.jsx("span",{className:"stat-title",children:"Poles"})]})]}),e.jsxs("div",{className:"stat-card orange toggle-modal",onClick:()=>k("fastLaps"),children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-bolt"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:B}),e.jsx("span",{className:"stat-title",children:"Vueltas rápidas"})]})]})]}),e.jsxs("div",{className:"disciplinary-row",children:[e.jsxs("div",{className:"stat-card penalty-card red",children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-triangle-exclamation"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:G}),e.jsx("span",{className:"stat-title",children:"Sanciones"})]})]}),e.jsxs("div",{className:"stat-card penalty-card yellow",children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-circle-exclamation"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:$}),e.jsx("span",{className:"stat-title",children:"Amonestaciones"})]})]})]}),e.jsxs("div",{className:"stat-card dotd",children:[e.jsx("div",{className:"stat-icon-wrapper",children:e.jsx("i",{className:"fa-solid fa-thumbs-up"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("span",{className:"stat-number",children:U}),e.jsx("span",{className:"stat-title",children:"Veces elegido como piloto del día"})]})]}),P.length>0&&e.jsxs("div",{className:"kart-history-section",children:[e.jsx("span",{className:"stat-title",children:"Karts utilizados"}),e.jsx("div",{className:"kart-history-grid",children:P.map((a,s)=>e.jsxs("span",{className:"stat-number",style:{marginTop:"5px"},children:[a.kart," - "]},s))})]})]}),D&&e.jsx("div",{className:"modal",style:{display:"flex"},onClick:a=>{a.target.className==="modal"&&S(!1)},children:e.jsxs("div",{className:"modal-content",children:[e.jsx("span",{className:"close-button",onClick:()=>S(!1),children:"×"}),e.jsx("h3",{id:"modal-title",children:I}),e.jsx("div",{id:"modal-body-content",children:L})]})}),e.jsx("style",{children:`
                    .container {
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 20px;
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

                    .section-title {
                        margin-top: 5px;
                        font-family: 'Russo One', sans-serif;
                        font-size: 0.75rem;
                        color: #64748b;
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                    }

                    .section-title::after {
                        content: '';
                        flex-grow: 1;
                        height: 1px;
                        background: rgba(255, 255, 255, 0.1);
                    }

                    .stats-section {
                        background: rgba(30, 41, 59, 0.4);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 20px;
                        padding: 14px;
                        margin-bottom: 20px;
                    }

                    /* Hero Section */
                    .driver-hero {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
                        border-radius: 24px;
                        padding: 30px 20px;
                        text-align: center;
                        position: relative;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                        margin-bottom: 10px;
                        overflow: hidden;
                    }

                    .hero-bg {
                        position: absolute;
                        top: 0; left: 0; width: 100%; height: 100%;
                        background-size: cover;
                        background-position: center 20%;
                        filter: blur(10px) brightness(0.25);
                        transform: scale(1.1);
                        z-index: 0;
                    }

                    .driver-hero::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; height: 4px;
                        background: linear-gradient(90deg, var(--accent), #ffde39, var(--accent));
                        z-index: 2;
                    }

                    .hero-content {
                        position: relative;
                        z-index: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .driver-photo-hero {
                        width: 160px;
                        height: 160px;
                        border-radius: 20px;
                        border: 4px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                        margin-bottom: 15px;
                        object-fit: cover;
                        object-position: top;
                    }

                    .driver-info-wrapper {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .driver-name-hero {
                        font-family: 'Russo One', sans-serif;
                        font-size: 2.2rem;
                        margin: 0;
                        background: linear-gradient(180deg, #fff, #cbd5e1);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        line-height: 1.1;
                    }

                    .team-name-badge {
                        color: #94a3b8;
                        font-size: 1.1rem;
                        margin-top: 6px;
                        font-weight: 600;
                    }

                    .division-badge {
                        display: inline-block;
                        background: rgba(59, 130, 246, 0.15);
                        color: var(--accent);
                        padding: 6px 16px;
                        border-radius: 20px;
                        font-weight: 700;
                        font-size: 0.9rem;
                        margin-top: 8px;
                        border: 1px solid rgba(59, 130, 246, 0.3);
                    }

                    .total-points-hero {
                        margin-top: 18px;
                        display: inline-flex;
                        flex-direction: column;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(5px);
                        position: relative;
                        z-index: 1;
                        padding: 10px 30px;
                        border-radius: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .points-val {
                        font-family: 'Russo One', sans-serif;
                        font-size: 2.5rem;
                        color: #fbbf24;
                        line-height: 1;
                    }

                    .points-label {
                        font-size: 0.8rem;
                        color: #94a3b8;
                        letter-spacing: 2px;
                        font-weight: 600;
                    }

                    /* Championship Section */
                    .championship-section {
                        border-radius: 12px;
                        padding: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        margin-bottom: 10px;
                        position: relative;
                        overflow: hidden;
                        transform-style: preserve-3d;
                        transition: all 0.3s ease;
                    }

                    .championship-section.gold-tier {
                        background: linear-gradient(135deg, #F59E0B 0%, #B45309 100%);
                        box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
                        border: 2px solid rgba(255, 255, 255, 0.2);
                        animation: pulseGlow 3s infinite ease-in-out;
                    }

                    .championship-section.gray-tier {
                        background: rgba(30, 41, 59, 0.4);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .championship-section.gray-tier .champ-icon {
                        color: #64748b;
                        filter: none;
                    }

                    .championship-section.gray-tier .champ-count {
                        color: #94a3b8;
                        text-shadow: none;
                    }

                    .championship-section.gray-tier .champ-label {
                        color: #64748b;
                    }

                    @keyframes pulseGlow {
                        0% { box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4); }
                        50% { box-shadow: 0 10px 40px rgba(245, 158, 11, 0.7); }
                        100% { box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4); }
                    }

                    .championship-section.gold-tier::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
                        animation: rotateShine 10s linear infinite;
                    }

                    @keyframes rotateShine {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .champ-icon-wrapper {
                        background: rgba(255, 255, 255, 0.2);
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        backdrop-filter: blur(5px);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                        z-index: 1;
                    }

                    .champ-icon {
                        font-size: 1.1rem;
                        color: #FFF;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                    }

                    .champ-info {
                        display: flex;
                        flex-direction: column;
                        z-index: 1;
                        text-align: left;
                    }

                    .champ-count {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.4rem;
                        color: white;
                        line-height: 1;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }

                    .champ-label {
                        font-size: 0.65rem;
                        color: rgba(255, 255, 255, 0.9);
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                    }


                    /* Stats Row */
                    .stats-row {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }

                    .stat-card {
                        background: #1e293b;
                        border-radius: 10px;
                        padding: 10px 12px;
                        display: flex;
                        align-items: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: transform 0.2s, box-shadow 0.2s;
                        cursor: pointer;
                    }

                    .stat-card:active {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                    }

                    .stat-card.gold { background: linear-gradient(145deg, #1e293b, rgba(251, 191, 36, 0.1)); border-bottom: 3px solid #fbbf24; }
                    .stat-card.silver { background: linear-gradient(145deg, #1e293b, rgba(148, 163, 184, 0.1)); border-bottom: 3px solid #94a3b8; }
                    .stat-card.purple { background: linear-gradient(145deg, #1e293b, rgba(168, 85, 247, 0.1)); border-bottom: 3px solid #a855f7; }
                    .stat-card.orange { background: linear-gradient(145deg, #1e293b, rgba(249, 115, 22, 0.1)); border-bottom: 3px solid #f97316; }
                    .stat-card.dotd { background: linear-gradient(145deg, #1e293b, rgba(39, 36, 251, 0.1)); border-bottom: 3px solid #244bfbff; border-top: 0 }

                    .kart-history-section {
                        margin-top: 24px;
                        background: #1e293b;
                        border-radius: 10px;
                        padding: 16px 20px 20px;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-bottom: 3px solid var(--accent);
                    }

                    .kart-history-section h3 {
                        font-family: 'Russo One', sans-serif;
                        color: var(--accent);
                        font-size: 1rem;
                        margin: 0 0 14px 0;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .kart-history-grid {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 6px;
                    }

                    .kart-chip {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1rem;
                        color: var(--accent);
                        background: rgba(59, 130, 246, 0.1);
                        border: 1px solid rgba(59, 130, 246, 0.2);
                        padding: 4px 12px;
                        border-radius: 8px;
                        min-width: 38px;
                        text-align: center;
                    }

                    .stat-icon-wrapper {
                        width: 30px;
                        height: 30px;
                        border-radius: 8px;
                        background: rgba(255, 255, 255, 0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.9rem;
                        margin-right: 10px;
                    }

                    .gold .stat-icon-wrapper { color: #fbbf24; }
                    .silver .stat-icon-wrapper { color: #94a3b8; }
                    .purple .stat-icon-wrapper { color: #a855f7; }
                    .orange .stat-icon-wrapper { color: #f97316; }

                    .stat-info {
                        display: flex;
                        flex-direction: column;
                    }

                    .stat-number {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.2rem;
                        line-height: 1;
                    }

                    .stat-title {
                        font-size: 0.65rem;
                        color: #94a3b8;
                        text-transform: uppercase;
                        font-weight: 600;
                    }

                    /* Disciplinary Cards CSS Restored */
                    .disciplinary-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }

                    .penalty-card.red { background: linear-gradient(145deg, #1e293b, rgba(239, 68, 68, 0.1)); border-bottom: 3px solid #ef4444; }
                    .penalty-card.yellow { background: linear-gradient(145deg, #1e293b, rgba(234, 179, 8, 0.1)); border-bottom: 3px solid #eab308; }
                    .penalty-card.red .stat-icon-wrapper { color: #ef4444; }
                    .penalty-card.yellow .stat-icon-wrapper { color: #eab308; }

                    /* Modal Styles */
                    .modal {
                        position: fixed;
                        z-index: 1000;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        background-color: rgba(0,0,0,0.85);
                        backdrop-filter: blur(8px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 15px;
                        overscroll-behavior: contain;
                    }

                    .modal-content {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        padding: 2rem;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 24px;
                        width: 100%;
                        max-width: 650px;
                        max-height: 85vh;
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        overscroll-behavior-y: contain;
                        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
                        position: relative;
                        animation: modalSlideIn 0.3s ease-out;
                    }

                    @keyframes modalSlideIn {
                        from { opacity: 0; transform: scale(0.95) translateY(-20px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }

                    .close-button {
                        color: #94a3b8;
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        font-size: 2rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 8px;
                        background: rgba(255, 255, 255, 0.03);
                        z-index: 10;
                    }

                    @media (hover: hover) {
                        .close-button:hover {
                            color: var(--accent);
                            background: rgba(59, 130, 246, 0.1);
                            transform: rotate(90deg);
                        }
                    }

                    #modal-title {
                        font-family: 'Russo One', sans-serif;
                        color: var(--accent);
                        margin-bottom: 1.5rem;
                        font-size: 1.6rem;
                        padding-right: 40px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    /* Event Grid and Cards */
                    .events-grid {
                        display: grid;
                        gap: 1.25rem;
                    }

                    .event-card {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
                        border-radius: 20px;
                        padding: 1.5rem;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }

                    .event-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background: linear-gradient(90deg, var(--accent), #a855f7);
                    }

                    @media (hover: hover) {
                        .event-card:hover {
                            transform: translateY(-4px);
                            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
                            border-color: rgba(59, 130, 246, 0.3);
                        }
                    }

                    .best-lap-card {
                        border-color: #a855f7;
                        background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(15, 23, 42, 0.9));
                    }

                    .best-lap-card::before {
                        background: linear-gradient(90deg, #a855f7, #d946ef);
                    }

                    .best-lap-badge {
                        margin: 0 auto 0.5rem auto;
                        width: fit-content;
                        background: linear-gradient(135deg, #a855f7, #d946ef);
                        color: white;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 0.7rem;
                        font-weight: 700;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 4px;
                        box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
                    }

                    .event-card-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 1.25rem;
                        gap: 10px;
                    }

                    .event-race-info {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        flex: 1;
                    }

                    .event-icon {
                        color: var(--accent);
                        font-size: 1.1rem;
                    }

                    .race-name {
                        font-weight: 700;
                        font-size: 1.05rem;
                        color: var(--text-main);
                    }

                    .race-date {
                        color: #94a3b8;
                        font-size: 0.85rem;
                        white-space: nowrap;
                    }

                    .lap-time-display {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        padding: 1.25rem;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 16px;
                        margin-bottom: 1rem;
                    }

                    .lap-icon {
                        font-size: 1.5rem;
                        color: var(--accent);
                    }

                    .lap-time {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.8rem;
                        font-weight: 700;
                    }

                    .event-stats-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.75rem;
                    }

                    .stat-box {
                        background: rgba(255, 255, 255, 0.04);
                        border-radius: 12px;
                        padding: 0.85rem;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border: 1px solid rgba(255, 255, 255, 0.06);
                        transition: all 0.2s;
                    }

                    @media (hover: hover) {
                        .stat-box:hover {
                            background: rgba(255, 255, 255, 0.08);
                            border-color: rgba(255, 255, 255, 0.12);
                        }
                    }

                    .stat-box.points-box {
                        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1));
                        border-color: rgba(59, 130, 246, 0.3);
                    }

                    .stat-icon {
                        color: var(--accent);
                        font-size: 1.1rem;
                        width: 24px;
                        text-align: center;
                    }

                    .stat-content {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        flex: 1;
                    }

                    .stat-label {
                        font-size: 0.7rem;
                        color: #94a3b8;
                        text-transform: uppercase;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }

                    .stat-value {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.1rem;
                        color: var(--text-main);
                        line-height: 1;
                    }

                    .event-detail-empty {
                        text-align: center;
                        padding: 3rem 2rem;
                        color: #64748b;
                        font-style: italic;
                        font-size: 1rem;
                    }

                    @media (max-width: 600px) {
                        .driver-name-hero { font-size: 1.6rem; }
                        .stat-card { padding: 15px; }
                        .modal { padding: 60px 15px 15px 15px; }
                        .modal-content { 
                            width: 100%; 
                            max-height: calc(100vh - 90px); 
                            padding: 1.5rem; 
                        }
                        #modal-title { font-size: 1.3rem; }
                        .event-card { padding: 1.25rem; }
                        .race-name { font-size: 0.95rem; }
                        .lap-time { font-size: 1.5rem; }
                    }
                `})]})})};export{le as default};
