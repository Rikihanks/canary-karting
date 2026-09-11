const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DEHvOCR0.js","assets/index-DeAfXq3h.css"])))=>i.map(i=>d[i]);
var oe=Object.defineProperty,le=Object.defineProperties;var ce=Object.getOwnPropertyDescriptors;var Q=Object.getOwnPropertySymbols;var de=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var Z=(r,l,x)=>l in r?oe(r,l,{enumerable:!0,configurable:!0,writable:!0,value:x}):r[l]=x,W=(r,l)=>{for(var x in l||(l={}))de.call(l,x)&&Z(r,x,l[x]);if(Q)for(var x of Q(l))pe.call(l,x)&&Z(r,x,l[x]);return r},ee=(r,l)=>le(r,ce(l));var S=(r,l,x)=>new Promise((g,v)=>{var b=f=>{try{j(x.next(f))}catch(N){v(N)}},w=f=>{try{j(x.throw(f))}catch(N){v(N)}},j=f=>f.done?g(f.value):Promise.resolve(f.value).then(b,w);j((x=x.apply(r,l)).next())});import{r as d,j as e,D as y,a as me,d as xe,L as ge,w as fe,g as ae,C as te,_ as be,E as he,l as ue}from"./index-DEHvOCR0.js";import{P as ve}from"./index.esm-D6ajMPZ9.js";import{h as ye}from"./html2canvas.esm-V-rdnldR.js";const we=({winner:r,division:l,totalVotes:x,onShareComplete:g,onShareError:v,debug:b=!1})=>{const w=d.useRef(null),[j,f]=d.useState(!1);d.useEffect(()=>{r&&!b&&N()},[r,b]);const N=()=>S(null,null,function*(){if(!(!w.current||j)){f(!0);try{yield new Promise(m=>setTimeout(m,800)),(yield ye(w.current,{useCORS:!0,backgroundColor:"#090d17",scale:Math.max(3,window.devicePixelRatio),logging:!1,onclone:m=>{const k=m.querySelector(".dotd-story-bg");k&&(k.style.filter="none",k.style.webkitFilter="none");const n=m.querySelector(".dotd-story-template");n&&(n.style.width="450px",n.style.height="800px");const h=m.querySelector(".dotd-story-photo-wrapper");h&&(h.style.width="180px",h.style.height="180px",h.style.display="block",h.style.margin="0 auto 20px");const u=m.querySelector(".dotd-story-photo");u&&(u.style.width="164px",u.style.height="164px",u.style.borderRadius="50%",u.style.objectFit="cover")}})).toBlob(m=>S(null,null,function*(){var n;if(!m)throw new Error;const k=new File([m],`ck-dotd-${r.driver.replace(/\s+/g,"-")}.png`,{type:"image/png"});if((n=navigator.canShare)!=null&&n.call(navigator,{files:[k]}))yield navigator.share({files:[k]});else{const h=URL.createObjectURL(m),u=document.createElement("a");u.href=h,u.download=k.name,u.click(),URL.revokeObjectURL(h)}g==null||g(),f(!1)}),"image/png",1)}catch(E){v==null||v("Error al generar imagen"),f(!1)}}});if(!r)return null;const T=x>0?(r.votes/x*100).toFixed(0):0,p=()=>e.jsxs("div",{className:`dotd-story-template ${b?"debug-visible":""}`,ref:w,children:[e.jsxs("div",{className:"dotd-story-bg-wrapper",children:[e.jsx("img",{src:r.photo||y,alt:"",className:"dotd-story-bg",crossOrigin:"anonymous"}),e.jsx("div",{className:"dotd-story-overlay"})]}),e.jsxs("div",{className:"dotd-story-content",children:[e.jsxs("div",{className:"dotd-story-badge",children:[e.jsx("i",{className:"fa-solid fa-trophy"}),"PILOTO DEL DÍA"]}),e.jsxs("div",{className:"dotd-story-image-card",children:[e.jsxs("div",{className:"dotd-story-photo-wrapper",children:[e.jsx("img",{src:r.photo||y,alt:r.driver,className:"dotd-story-photo",crossOrigin:"anonymous"}),e.jsx("div",{className:"dotd-story-crown-absolute",children:e.jsx("i",{className:"fa-solid fa-crown"})})]}),e.jsxs("div",{className:"dotd-title-container",children:[e.jsx("h1",{className:"dotd-story-name",children:r.driver}),e.jsx("div",{className:"dotd-story-team",children:r.team||"INDEPENDIENTE"})]}),e.jsxs("div",{className:"dotd-story-stats-grid",children:[e.jsxs("div",{className:"dotd-story-stat-box",children:[e.jsxs("span",{className:"dotd-story-stat-val",children:[T,"%"]}),e.jsx("span",{className:"dotd-story-stat-lbl",children:"DE LOS VOTOS"})]}),e.jsxs("div",{className:"dotd-story-stat-box",children:[e.jsxs("span",{className:"dotd-story-stat-val",children:[l,"ª"]}),e.jsx("span",{className:"dotd-story-stat-lbl",children:"DIVISIÓN"})]})]})]}),e.jsxs("div",{className:"dotd-story-footer",children:[e.jsx("div",{className:"dotd-story-branding",children:"Canary Karting"}),e.jsx("div",{className:"dotd-story-date",children:new Date().toLocaleDateString("es-ES",{day:"2-digit",month:"long",year:"numeric"})})]})]})]});return b?e.jsx("div",{className:"story-preview-overlay",onClick:g,children:e.jsxs("div",{className:"story-preview-modal",onClick:E=>E.stopPropagation(),children:[e.jsx("button",{className:"preview-close-btn",onClick:g,children:e.jsx("i",{className:"fa-solid fa-xmark"})}),e.jsx("div",{className:"story-preview-header",children:"Vista Previa Driver of the Day"}),e.jsx("div",{className:"story-preview-container",children:p()})]})}):e.jsxs(e.Fragment,{children:[j&&e.jsx("div",{className:"dotd-share-loading-overlay",children:e.jsxs("div",{className:"dotd-share-loader",children:[e.jsx("i",{className:"fa-solid fa-camera-retro fa-beat-fade"}),e.jsx("span",{children:"Preparando Story..."})]})}),p()]})},De=()=>{const r=me(),{user:l,logout:x}=xe(),[g,v]=d.useState(()=>{const a=localStorage.getItem("leaderboard_cache");return a?JSON.parse(a):[]}),[b,w]=d.useState(()=>{const a=localStorage.getItem("dotd_results_cache");return a?JSON.parse(a):[]}),[j,f]=d.useState(g.length===0),[N,T]=d.useState(null),[p,E]=d.useState(1),[m,k]=d.useState("2026"),[n,h]=d.useState(null),[u,A]=d.useState(!1),[J,Y]=d.useState(!1),[B,M]=d.useState(null),[R,H]=d.useState(null),[re,G]=d.useState(!1),[$,_]=d.useState(null),[U,K]=d.useState([]),V=(a=>{if(!Array.isArray(r==null?void 0:r.dotd))return 0;const t=r.dotd.find(s=>s.división===a);return t?t.active:0})(p),L=()=>new Date().toISOString().split("T")[0];d.useEffect(()=>{S(null,null,function*(){_(null);try{const t=yield fe();if(t&&t.success){const i=(t.data.calendar||[]).filter(c=>c.division==p&&(c.temporada||"2026")===m&&(c.terminada==1||c.activa==1));if(i.length>0){const c=o=>o&&o.includes("/")?new Date(o.split("/")[2],o.split("/")[1]-1,o.split("/")[0]).getTime():new Date(o).getTime();i.sort((o,P)=>c(P.fecha)-c(o.fecha));const z=i[0],C=c(z.fecha),F=(t.data.results||[]).filter(o=>o.id_circuito==z.id_circuito&&o.division==p&&c(o.date)===C),q=Array.from(new Set(F.map(o=>o.pilot).filter(Boolean)));_(q)}else _([])}else _([])}catch(t){console.error("Error fetching recent race:",t),_([])}})},[p,m]),d.useEffect(()=>{const a=L(),t=JSON.parse(localStorage.getItem("ck_reveals")||"{}");t[a]&&K(t[a])},[]),d.useEffect(()=>{(()=>{const t=L(),s=JSON.parse(localStorage.getItem("ck_votes")||"{}"),i=s[t]?s[t][p]:null;if(i&&i.hasVoted){if(Y(!0),g.length>0){const c=g.find(z=>z.name===i.votedFor);c&&h(c)}}else Y(!1),h(null)})()},[p,g]),d.useEffect(()=>{S(null,null,function*(){try{const t=Array.isArray(r==null?void 0:r.dotd)&&r.dotd.some(c=>c.active===2||c.active===3),[s,i]=yield Promise.all([ae(!0),t?te(!0):Promise.resolve([])]);v(s),w(i),localStorage.setItem("leaderboard_cache",JSON.stringify(s)),t&&localStorage.setItem("dotd_results_cache",JSON.stringify(i)),f(!1)}catch(t){g.length===0&&T("No se pudieron cargar los datos de la votación."),f(!1)}})},[r==null?void 0:r.dotd]);const se=()=>S(null,null,function*(){const{clearCache:a}=yield be(()=>S(null,null,function*(){const{clearCache:t}=yield import("./index-DEHvOCR0.js").then(s=>s.G);return{clearCache:t}}),__vite__mapDeps([0,1]));a();try{const t=Array.isArray(r==null?void 0:r.dotd)&&r.dotd.some(c=>c.active===2||c.active===3),[s,i]=yield Promise.all([ae(!0),t?te(!0):Promise.resolve([])]);v(s),w(i),localStorage.setItem("leaderboard_cache",JSON.stringify(s)),t&&localStorage.setItem("dotd_results_cache",JSON.stringify(i))}catch(t){T("Error al refrescar la lista.")}}),ie=a=>S(null,null,function*(){M(a.name);const t=L();try{if((yield he(a.name,p,l==null?void 0:l.nombre)).success){const i=JSON.parse(localStorage.getItem("ck_votes")||"{}");i[t]||(i[t]={}),i[t][p]={hasVoted:!0,date:t,division:p,votedFor:a.name},localStorage.setItem("ck_votes",JSON.stringify(i)),h(a),Y(!0),A(!0),ue("vote_submitted",{driver:a.name,division:p,voted_by:(l==null?void 0:l.nombre)||"anonymous"})}else alert("Hubo un problema al registrar tu voto. Por favor, inténtalo de nuevo.")}catch(s){console.error(s),alert("Error de conexión al votar.")}finally{M(null)}setTimeout(()=>{A(!1)},5e3)}),ne=a=>{if(!U.includes(a)){const t=[...U,a];K(t);const s=L(),i=JSON.parse(localStorage.getItem("ck_reveals")||"{}");i[s]=t,localStorage.setItem("ck_reveals",JSON.stringify(i))}};let D=[];if($===null)D=g.filter(a=>a.division===p&&a.season===m);else if($.length>0){const a=new Map;$.forEach(t=>{let s=g.find(i=>i.name===t&&i.season===m&&i.division===p);s||(s=g.find(i=>i.name===t&&i.season===m)),s||(s=g.find(i=>i.name===t)),s?a.set(t,ee(W({},s),{division:p,season:m})):a.set(t,{name:t,team:"",photo:y,division:p,season:m})}),D=Array.from(a.values())}else D=g.filter(a=>a.division===p&&a.season===m);return D.sort((a,t)=>a.name.localeCompare(t.name)),j?e.jsxs("div",{className:"container",style:{textAlign:"center",color:"#94a3b8",paddingTop:"50px"},children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin",style:{fontSize:"2em"}}),e.jsx("p",{children:"Cargando pilotos..."})]}):N?e.jsx("div",{className:"container",style:{textAlign:"center",color:"#ef4444",paddingTop:"50px"},children:N}):e.jsxs(ve,{onRefresh:se,pullingContent:"",className:"ptr",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"division-select-container fade-in",style:{marginBottom:"30px",textAlign:"center"},children:[e.jsx("p",{style:{color:"#94a3b8",marginBottom:"10px"},children:"Selecciona una división:"}),e.jsxs("select",{className:"division-dropdown",value:p,onChange:a=>E(parseInt(a.target.value)),style:{margin:"0 auto",display:"block",maxWidth:"300px"},children:[e.jsx("option",{value:"1",children:"1ª División"}),e.jsx("option",{value:"2",children:"2ª División"}),e.jsx("option",{value:"3",children:"3ª División"})]})]}),V===0?e.jsxs("div",{className:"disabled-state fade-in",children:[e.jsxs("div",{className:"disabled-icon-wrapper",children:[e.jsx("i",{className:"fa-solid fa-lock-open-slash lock-bg-icon"}),e.jsx("i",{className:"fa-solid fa-lock main-lock-icon"})]}),e.jsx("h2",{className:"disabled-title",children:"Votaciones Cerradas"}),e.jsx("div",{className:"disabled-divider"}),e.jsx("p",{className:"disabled-text",children:"Las votaciones para el Piloto del Día no están activas para esta división en este momento."})]}):V===2||V===3?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"winner-announcement fade-in",children:[e.jsx("i",{className:"fa-solid fa-crown winner-crown"}),e.jsx("h2",{className:"dotd-results-title",children:"PILOTO DEL DÍA"})]}),e.jsxs("div",{className:"winners-container fade-in",children:[(()=>{const a=b.length>0?b.reduce((s,i)=>i.date>s?i.date:s,b[0].date):null,t=a?b.filter(s=>s.date===a):[];return[p].map(s=>{const i=t.filter(o=>o.division===s);if(i.length===0)return null;const c=i.reduce((o,P)=>o+P.votes,0),z=Math.max(...i.map(o=>o.votes)),C=i.filter(o=>o.votes===z),X=C.length>1,F=V===3||U.includes(s),q=!0;return e.jsxs("div",{className:"division-results-section fade-in",children:[e.jsxs("h3",{className:"division-result-header",children:[s,"ª División"]}),e.jsx("div",{className:"winners-reveal-grid",children:e.jsx("div",{className:`reveal-card-container ${F?"is-revealed":""} `,onClick:()=>!F&&q&&ne(s),children:e.jsxs("div",{className:"reveal-card-inner",children:[e.jsx("div",{className:"reveal-card-face face-front",children:e.jsxs("div",{className:"spoiler-content",children:[e.jsx("div",{className:"mystery-icon",children:e.jsx("i",{className:"fa-solid fa-user-secret"})}),e.jsx("span",{className:"tap-hint",children:"TOCAR PARA REVELAR"})]})}),e.jsx("div",{className:"reveal-card-face face-back",children:e.jsxs("div",{className:"winners-list-back",children:[X&&e.jsxs("div",{className:"tie-indicator-mini",children:[e.jsx("i",{className:"fa-solid fa-scale-balanced"}),e.jsx("span",{children:"¡EMPATE!"})]}),C.map((o,P)=>{const O=D.find(I=>I.name===o.driver)||g.find(I=>I.name===o.driver);return e.jsxs(ge,{to:`/profile?driver=${encodeURIComponent(o.driver)}&season=${m}`,className:"winner-card-mini-link fade-in",style:{animationDelay:`${P*.2}s`},children:[e.jsxs("div",{className:"winner-img-container",children:[e.jsx("img",{src:(O==null?void 0:O.photo)||y,alt:o.driver,onError:I=>{I.target.src=y}}),e.jsx("div",{className:"winner-trophy",children:e.jsx("i",{className:"fa-solid fa-trophy"})})]}),e.jsxs("div",{className:"winner-info",children:[e.jsx("div",{className:"winner-name",children:o.driver}),e.jsx("div",{className:"winner-team",children:(O==null?void 0:O.team)||"INDEPENDIENTE"}),e.jsxs("div",{className:"winner-votes",children:[c>0?(o.votes/c*100).toFixed(0):0,"% de los votos"]}),e.jsx("div",{className:"winner-share-actions",children:!1})]})]},o.driver)})]})})]})})})]},s)})})(),b.length===0&&e.jsx("p",{className:"no-data-msg",children:"No hay votos registrados."})]})]}):e.jsxs("div",{className:"voting-main fade-in",children:[J&&e.jsxs("div",{className:"already-voted-msg",children:[e.jsx("i",{className:"fa-solid fa-circle-info"})," Tu voto para esta división ha sido para ",n==null?void 0:n.name]}),e.jsx("div",{className:"voting-grid",children:D.map((a,t)=>e.jsx("div",{className:"vote-card fade-in",style:{animationDelay:`${.1+t*.05}s`},children:e.jsxs("div",{className:"vote-card-inner",children:[e.jsx("div",{className:"card-bg-glow"}),e.jsxs("div",{className:"driver-img-wrapper",children:[e.jsx("div",{className:"image-ring"}),e.jsx("img",{src:a.photo||y,alt:a.name,className:"driver-img",onError:s=>{s.target.src=y}})]}),e.jsxs("div",{className:"driver-info",children:[e.jsx("h3",{className:"driver-name",children:a.name}),e.jsx("span",{className:"team-name",children:a.team})]}),e.jsx("div",{className:"card-action",children:e.jsx("button",{className:`vote-btn ${(n==null?void 0:n.name)===a.name?"voted":""}`,onClick:()=>ie(a),disabled:u||J||!!B||n!==null,children:B===a.name?e.jsx(e.Fragment,{children:e.jsx("i",{className:"fa-solid fa-spinner fa-spin"})}):(n==null?void 0:n.name)===a.name?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fa-solid fa-check"})," Votado"]}):J?e.jsx(e.Fragment,{children:e.jsx("i",{className:"fa-solid fa-lock"})}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fa-solid fa-thumbs-up"})," Votar"]})})})]})},a.name))})]}),u&&e.jsx("div",{className:"success-overlay",onClick:()=>A(!1),children:e.jsxs("div",{className:"success-modal",onClick:a=>a.stopPropagation(),children:[e.jsx("div",{className:"success-icon",children:e.jsx("i",{className:"fa-solid fa-trophy"})}),e.jsx("h2",{children:"¡Voto Registrado!"}),e.jsxs("p",{children:["Has votado por ",e.jsx("strong",{children:n==null?void 0:n.name})," como Piloto del Día."]}),e.jsxs("div",{className:"driver-mini-stats",children:[e.jsx("img",{className:"driver-img",src:(n==null?void 0:n.photo)||y,alt:n==null?void 0:n.name,onError:a=>{a.target.src=y}}),e.jsxs("div",{children:[e.jsx("div",{className:"mini-name",children:n==null?void 0:n.name}),e.jsx("div",{className:"mini-team",children:n==null?void 0:n.team})]})]}),e.jsx("button",{className:"close-success-btn",onClick:()=>A(!1),children:"Cerrar"})]})}),e.jsx("style",{children:`
                    .division-dropdown {
                        margin-top: 20px;
                    }
                    .disabled-state {
                        text-align: center;
                        padding: 60px 30px;
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border-radius: 35px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        margin: 40px auto;
                        max-width: 500px;
                        box-shadow: 
                            0 20px 40px rgba(0, 0, 0, 0.4),
                            inset 0 0 20px rgba(255, 255, 255, 0.05);
                        position: relative;
                        overflow: hidden;
                    }

                    .disabled-icon-wrapper {
                        position: relative;
                        height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 25px;
                    }

                    .main-lock-icon {
                        font-size: 3.5rem;
                        color: #94a3b8;
                        z-index: 2;
                        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
                        animation: lockShake 4s ease-in-out infinite;
                    }

                    .lock-bg-icon {
                        position: absolute;
                        font-size: 8rem;
                        color: rgba(255, 255, 255, 0.03);
                        z-index: 1;
                        transform: rotate(-15deg);
                    }

                    @keyframes lockShake {
                        0%, 90%, 100% { transform: rotate(0); }
                        92% { transform: rotate(-5deg); }
                        94% { transform: rotate(5deg); }
                        96% { transform: rotate(-5deg); }
                        98% { transform: rotate(5deg); }
                    }

                    .disabled-title {
                        font-family: 'Russo One', sans-serif !important;
                        font-size: 1.8rem !important;
                        margin-bottom: 15px !important;
                        background: linear-gradient(180deg, #fff 0%, #94a3b8 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    .disabled-divider {
                        width: 50px;
                        height: 3px;
                        background: var(--accent);
                        margin: 0 auto 20px;
                        border-radius: 2px;
                        box-shadow: 0 0 10px var(--accent);
                    }

                    .disabled-text {
                        color: #94a3b8;
                        font-size: 1.05rem;
                        line-height: 1.6;
                        margin: 0;
                    }

                    .winners-container {
                        text-align: center;
                        padding: 20px 0 80px;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                    }

                    /* Ensure PullToRefresh and its children fill the height */
                    .ptr, 
                    .ptr__children {
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                        min-height: 100%;
                    }

                    .container {
                        padding: 1rem;
                        max-width: 800px;
                        margin: 0 auto;
                        flex-grow: 1;
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                    }

                    .no-data-msg {
                        color: var(--text-muted);
                        margin-top: 20px;
                    }

                    .winner-announcement {
                        margin-bottom: 20px;
                        text-align: center;
                    }

                    .division-results-section {
                        margin-bottom: 30px;
                    }

                    .division-results-section:last-child {
                        margin-bottom: 0;
                    }

                    .division-result-header {
                        font-family: 'Russo One', sans-serif;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        font-size: 1rem;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 15px;
                    }

                    .division-result-header::before,
                    .division-result-header::after {
                        content: '';
                        flex-grow: 1;
                        height: 1px;
                        background: rgba(255,255,255,0.1);
                    }

                    .winner-crown {
                        font-size: 3rem;
                        color: #fbbf24;
                        margin-bottom: 20px;
                        filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));
                    }

                    .winners-list {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        max-width: 400px;
                        margin: 0 auto;
                    }

                    .winner-card {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
                        border: 2px solid #fbbf24;
                        border-radius: 25px;
                        padding: 25px;
                        display: flex;
                        align-items: center;
                        gap: 25px;
                        text-align: left;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(251, 191, 36, 0.2);
                        animation: winnerFloat 3s ease-in-out infinite;
                    }

                    @keyframes winnerFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }

                    .winner-img-container {
                        position: relative;
                        width: 100px;
                        height: 100px;
                        flex-shrink: 0;
                    }

                    .winner-img-container img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                        object-position: top;
                        border: 3px solid #fbbf24;
                    }

                    .winner-trophy {
                        position: absolute;
                        bottom: -5px;
                        right: -5px;
                        background: #fbbf24;
                        color: #0f172a;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1rem;
                        border: 2px solid #0f172a;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                    }

                    .winner-info {
                        flex-grow: 1;
                    }

                    .winner-name {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.5rem;
                        color: #fbbf24;
                        line-height: 1.2;
                        margin-bottom: 5px;
                    }

                    .winner-team {
                        font-size: 0.9rem;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 10px;
                    }

                    .winner-votes {
                        font-weight: 700;
                        color: white;
                        background: rgba(255,255,255,0.1);
                        padding: 4px 12px;
                        border-radius: 10px;
                        display: inline-block;
                        font-size: 0.9rem;
                    }

                    .tie-indicator-mini {
                        background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
                        color: #0f172a;
                        padding: 6px 15px;
                        border-radius: 50px;
                        font-family: 'Russo One', sans-serif;
                        font-size: 0.9rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        margin: 0 auto 10px;
                        width: fit-content;
                        box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
                        letter-spacing: 1px;
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.4); }
                        50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(251, 191, 36, 0.6); }
                        100% { transform: scale(1); box-shadow: 0 0 15px rgba(251, 191, 36, 0.4); }
                    }

                    .fade-in {
                        animation: fadeIn 0.5s ease-out forwards;
                    }

                    .already-voted-msg {
                        background: rgba(59, 130, 246, 0.1);
                        border: 1px solid rgba(59, 130, 246, 0.3);
                        color: var(--accent);
                        padding: 12px 20px;
                        border-radius: 12px;
                        text-align: center;
                        margin-bottom: 20px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    }

                    .dotd-results-title {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.8rem;
                        margin-top: 10px;
                        background: linear-gradient(180deg, #fff 0%, #aaa 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }

                    .winners-reveal-grid {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        max-width: 400px;
                        margin: 0 auto;
                    }

                    .reveal-card-container {
                        perspective: 1200px;
                        width: 100%;
                        cursor: pointer;
                        transition: transform 0.3s;
                    }

                    .reveal-card-container:active {
                        transform: scale(0.98);
                    }

                    .reveal-card-container.cant-tap {
                        cursor: not-allowed;
                        opacity: 0.7;
                    }

                    .reveal-card-inner {
                        position: relative;
                        width: 100%;
                        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        transform-style: preserve-3d;
                        display: grid;
                        grid-template-columns: 1fr;
                        align-items: stretch;
                    }

                    .reveal-card-container.is-revealed .reveal-card-inner {
                        transform: rotateY(180deg);
                    }

                    .reveal-card-face {
                        grid-area: 1 / 1 / 2 / 2;
                        backface-visibility: hidden;
                        -webkit-backface-visibility: hidden;
                        border-radius: 25px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                    }

                    .face-back {
                        transform: rotateY(180deg);
                        justify-content: flex-start;
                        height: 100%;
                    }

                    /* Spoiler Face Styling */
                    .face-front {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        border: 2px dashed rgba(251, 191, 36, 0.3);
                        padding: 30px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                        transition: all 0.3s;
                    }

                    .reveal-card-container:active .face-front:not(.is-locked .face-front) {
                        border-color: #fbbf24;
                        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
                        box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
                    }

                    .spoiler-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 15px;
                    }

                    .mystery-icon {
                        font-size: 2.5rem;
                        color: #fbbf24;
                        opacity: 0.6;
                        animation: pulseIcon 2s infinite;
                    }

                    .tap-hint {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1rem;
                        color: #94a3b8;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                    }

                    .is-locked .face-front {
                        background: #0f172a;
                        border-color: rgba(255,255,255,0.05);
                        opacity: 0.5;
                    }

                    .is-locked .mystery-icon {
                        color: #475569;
                        animation: none;
                    }

                    @keyframes pulseIcon {
                        0%, 100% { transform: scale(1); opacity: 0.6; }
                        50% { transform: scale(1.1); opacity: 0.9; }
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .winners-list-back {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        width: 100%;
                    }

                    .winner-card-mini {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
                        border: 2px solid #fbbf24;
                        border-radius: 20px;
                        padding: 15px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        text-align: left;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    }

                    .winner-card-mini .winner-img-container {
                        width: 60px;
                        height: 60px;
                    }

                    .winner-card-mini .winner-name {
                        font-size: 1.1rem;
                    }

                    .winner-card-mini .winner-info {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }

                    .division-results-section.is-locked {
                        filter: grayscale(1);
                        pointer-events: none;
                    }

                    .vote-header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-top: 20px;
                    }
                    .vote-header h1 {
                        margin-bottom: 10px;
                    }
                    .vote-header p {
                        color: var(--text-muted);
                        font-size: 1.1rem;
                    }

                    .voting-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 20px;
                        margin-top: 30px;
                        padding-bottom: 100px;
                    }

                    .vote-card {
                        perspective: 1000px;
                    }

                    .vote-card-inner {
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 24px;
                        padding: 20px;
                        text-align: center;
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        z-index: 1;
                    }

                    .card-bg-glow {
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: radial-gradient(circle at center, var(--accent) 0%, transparent 70%);
                        opacity: 0;
                        transition: opacity 0.4s;
                        z-index: -1;
                        pointer-events: none;
                    }

                    .vote-card:active .card-bg-glow {
                        opacity: 0.1;
                    }

                    .vote-card-inner:active {
                        transform: translateY(-8px) scale(1.02);
                        border-color: rgba(59, 130, 246, 0.4);
                        box-shadow: 
                            0 20px 40px rgba(0, 0, 0, 0.4),
                            inset 0 0 15px rgba(59, 130, 246, 0.1);
                    }

                    .driver-img-wrapper {
                        position: relative;
                        width: 90px;
                        height: 90px;
                        margin: 0 auto 15px;
                        padding: 4px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.05);
                    }

                    .image-ring {
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        border-radius: 50%;
                        border: 2px solid transparent;
                        border-top-color: var(--accent);
                        border-bottom-color: var(--accent);
                        transition: transform 0.8s ease;
                    }

                    .vote-card:active .image-ring {
                        transform: rotate(180deg);
                        border-color: var(--accent);
                    }

                    .driver-img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                        object-position: top;
                        border: 2px solid rgba(255, 255, 255, 0.1);
                        transition: all 0.3s;
                        background: #0f172a;
                    }

                    .vote-card:active .driver-img {
                        border-color: var(--accent);
                        transform: scale(1.05);
                    }

                    .winner-card-mini-link {
                        text-decoration: none;
                        color: inherit;
                        background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%);
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        border: 1px solid rgba(251, 191, 36, 0.3);
                        border-radius: 30px;
                        padding: 30px 20px 25px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 20px;
                        text-align: center;
                        box-shadow: 
                            0 12px 30px rgba(0, 0, 0, 0.4),
                            inset 0 0 20px rgba(255, 255, 255, 0.03);
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        position: relative;
                        overflow: hidden;
                        width: 100%;
                        max-width: 280px;
                        margin: 0 auto;
                    }

                    .winner-card-mini-link:active {
                        transform: scale(0.97) translateY(-3px);
                        border-color: #fbbf24;
                        box-shadow: 
                            0 15px 35px rgba(0, 0, 0, 0.5),
                            0 0 20px rgba(251, 191, 36, 0.2);
                    }

                    /* Spotlight effect */
                    .winner-card-mini-link::before {
                        content: '';
                        position: absolute;
                        top: 0; left: 50%;
                        transform: translateX(-50%);
                        width: 150px;
                        height: 150px;
                        background: radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%);
                        pointer-events: none;
                        z-index: 0;
                    }

                    .winner-card-mini-link .winner-img-container {
                        width: 110px;
                        height: 110px;
                        border-radius: 50%;
                        padding: 5px;
                        background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), transparent);
                        border: 2px solid rgba(251, 191, 36, 0.3);
                        flex-shrink: 0;
                        position: relative;
                        z-index: 1;
                        box-shadow: 
                            0 8px 20px rgba(0,0,0,0.4),
                            0 0 15px rgba(251, 191, 36, 0.1);
                        transition: transform 0.4s;
                    }

                    .winner-card-mini-link:active .winner-img-container {
                        transform: scale(1.05);
                        border-color: #fbbf24;
                        box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
                    }

                    .winner-card-mini-link .winner-img-container img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 2px solid rgba(251, 191, 36, 0.5);
                    }

                    .winner-card-mini-link .winner-trophy {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        background: #fbbf24;
                        color: #0f172a;
                        width: 34px;
                        height: 34px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1rem;
                        border: 3px solid #0f172a;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.5);
                    }

                    .winner-card-mini-link .winner-info {
                        position: relative;
                        z-index: 1;
                        width: 100%;
                    }

                    .winner-card-mini-link .winner-name {
                        font-family: 'Russo One', sans-serif;
                        font-size: 1.5rem;
                        line-height: 1.2;
                        color: #fbbf24;
                        margin-bottom: 6px;
                        text-shadow: 0 2px 8px rgba(0,0,0,0.4);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .winner-card-mini-link .winner-team {
                        font-weight: 600;
                        font-size: 0.85rem;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                        margin-bottom: 12px;
                        opacity: 0.9;
                    }

                    .winner-card-mini-link .winner-votes {
                        display: inline-block;
                        background: rgba(251, 191, 36, 0.1);
                        border: 1px solid rgba(251, 191, 36, 0.2);
                        padding: 5px 14px;
                        border-radius: 10px;
                        font-weight: 800;
                        font-size: 1rem;
                        color: #fff;
                        margin-bottom: 15px;
                    }

                    .winner-share-actions {
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                    }

                    .winner-share-btn {
                        background: #fbbf24;
                        color: #0f172a;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 12px;
                        font-weight: 800;
                        font-size: 0.85rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: all 0.3s;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .winner-share-btn:active {
                        transform: scale(0.95);
                        background: #f59e0b;
                    }

                    .winner-preview-btn {
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 8px 12px;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.3s;
                    }

                    .winner-preview-btn:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }

                    .division-tag {
                        position: absolute;
                        top: 12px;
                        left: 15px;
                        background: var(--accent);
                        color: white;
                        font-family: 'Russo One', sans-serif;
                        font-size: 0.7rem;
                        padding: 3px 10px;
                        border-radius: 10px;
                        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                        z-index: 2;
                    }

                    .driver-info {
                        flex-grow: 1;
                        margin-bottom: 20px;
                    }

                    .driver-name {
                        font-family: 'Montserrat', sans-serif;
                        font-size: 1rem;
                        font-weight: 800;
                        margin-bottom: 4px;
                        color: white;
                        letter-spacing: -0.5px;
                    }

                    .team-name {
                        font-size: 0.7rem;
                        font-weight: 600;
                        color: var(--text-muted);
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        opacity: 0.8;
                    }

                    .card-action {
                        margin-top: auto;
                    }

                    .vote-btn {
                        width: 100%;
                        padding: 10px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: white;
                        border-radius: 14px;
                        font-weight: 700;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: all 0.3s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        overflow: hidden;
                        position: relative;
                    }

                    .vote-btn:active:not(:disabled) {
                        background: var(--accent);
                        border-color: var(--accent);
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
                    }

                    .vote-btn.voted {
                        background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
                        border-color: var(--success);
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                    }

                    .vote-btn:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }

                    /* Success Overlay */
                    .success-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0, 0, 0, 0.8);
                        backdrop-filter: blur(10px);
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        animation: fadeIn 0.3s ease-out;
                    }

                    .success-modal {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 30px;
                        padding: 40px;
                        max-width: 400px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                        animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }

                    @keyframes scaleIn {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }

                    .success-icon {
                        width: 80px;
                        height: 80px;
                        background: rgba(251, 191, 36, 0.1);
                        border: 2px solid #fbbf24;
                        color: #fbbf24;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 2.5rem;
                        margin: 0 auto 20px;
                        animation: bounce 2s infinite;
                    }

                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                        40% {transform: translateY(-10px);}
                        60% {transform: translateY(-5px);}
                    }

                    .driver-mini-stats {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        background: rgba(255,255,255,0.05);
                        padding: 15px;
                        border-radius: 15px;
                        margin: 20px 0;
                        text-align: left;
                    }

                    .driver-mini-stats img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: 2px solid var(--accent);
                        object-fit: cover;
                    }

                    .mini-name {
                        font-weight: 700;
                        font-size: 1rem;
                    }

                    .mini-team {
                        font-size: 0.8rem;
                        color: var(--text-muted);
                    }

                    .close-success-btn {
                        width: 100%;
                        padding: 12px;
                        background: var(--accent);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-weight: 700;
                        cursor: pointer;
                        margin-top: 10px;
                    }

                    @media (max-width: 480px) {
                        .voting-grid {
                            gap: 12px;
                        }
                        .vote-card-inner {
                            padding: 12px;
                        }
                        .driver-img-wrapper {
                            width: 70px;
                            height: 70px;
                        }
                        .driver-name {
                            font-size: 0.95rem;
                        }
                    }
                `})]}),e.jsx(we,{winner:R,division:R==null?void 0:R.division,totalVotes:R==null?void 0:R.totalVotes,debug:re,onShareComplete:()=>{H(null),G(!1)},onShareError:a=>{alert(a),H(null),G(!1)}})]})};export{De as default};
