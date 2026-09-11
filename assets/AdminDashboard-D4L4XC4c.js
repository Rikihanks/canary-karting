var L=Object.defineProperty,_=Object.defineProperties;var P=Object.getOwnPropertyDescriptors;var I=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var z=(l,r,s)=>r in l?L(l,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[r]=s,c=(l,r)=>{for(var s in r||(r={}))M.call(r,s)&&z(l,s,r[s]);if(I)for(var s of I(r))G.call(r,s)&&z(l,s,r[s]);return l},p=(l,r)=>_(l,P(r));var u=(l,r,s)=>new Promise((g,x)=>{var d=f=>{try{b(s.next(f))}catch(v){x(v)}},h=f=>{try{b(s.throw(f))}catch(v){x(v)}},b=f=>f.done?g(f.value):Promise.resolve(f.value).then(d,h);b((s=s.apply(l,r)).next())});import{r as y,j as e,a as H,L as w,f as q,n as B,o as k,p as J}from"./index-DEHvOCR0.js";const j=({title:l,icon:r,children:s,defaultOpen:g=!1,className:x=""})=>{const[d,h]=y.useState(g);return e.jsxs("div",{className:`collapsible-section ${x}`,style:{backgroundColor:"var(--card-bg)",borderRadius:"12px",border:"1px solid var(--border-color)",marginBottom:"1rem",overflow:"hidden"},children:[e.jsxs("button",{onClick:()=>h(!d),style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem",background:"none",border:"none",color:"var(--text-color)",cursor:"pointer",fontSize:"1.1rem",fontWeight:"bold",borderBottom:d?"1px solid rgba(255, 255, 255, 0.1)":"none",transition:"border-bottom 0.2s"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[r&&e.jsx("i",{className:r}),e.jsx("span",{children:l})]}),e.jsx("i",{className:"fa-solid fa-chevron-down",style:{transform:d?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s ease"}})]}),e.jsx("div",{style:{maxHeight:d?"2000px":"0",opacity:d?1:0,overflow:"hidden",transition:"all 0.4s ease-in-out",visibility:d?"visible":"hidden"},children:e.jsx("div",{style:{padding:"1rem"},children:s})})]})},U=()=>{const l=H(),r=sessionStorage.getItem("canary_admin_email")||"admin",[s,g]=y.useState({}),[x,d]=y.useState({}),[h,b]=y.useState([]),[f,v]=y.useState(!0);y.useEffect(()=>{l&&g(l),u(null,null,function*(){try{const i=yield q();b(i)}catch(i){console.error("Error fetching races",i)}finally{v(!1)}})},[l]);const C=(a,i=void 0)=>u(null,null,function*(){const t=s[a],o=i!==void 0?i:!t;g(n=>p(c({},n),{[a]:o})),d(n=>p(c({},n),{[a]:!0}));try{yield k(a,o,r)}catch(n){console.error("Failed to update",n),g(N=>p(c({},N),{[a]:t})),alert("Error al actualizar la configuración")}finally{d(n=>p(c({},n),{[a]:!1}))}}),S=(a,i,t)=>u(null,null,function*(){const o=h.findIndex(m=>m.nombre===a&&m.fecha===i);if(o===-1)return;const n=h[o],N=n[t]==1,R=!N?"1":"0",D=[...h];D[o]=p(c({},n),{[t]:R}),b(D);const A=`race-${a}-${i}-${t}`;d(m=>p(c({},m),{[A]:!0}));try{yield J(a,i,t,R,r)}catch(m){console.error("Failed to update race",m);const $=[...h];$[o]=p(c({},n),{[t]:N?"1":"0"}),b($),alert("Error al actualizar la carrera")}finally{d(m=>p(c({},m),{[A]:!1}))}}),O=()=>{B(),window.location.reload()},E=[{key:"teams",label:"Clasificación de Equipos",icon:"🏆"},{key:"races",label:"Carreras",icon:"🏎️"},{key:"inscripcion",label:"Preincripción",icon:"📝"},{key:"login",label:"Inicio de Sesión",icon:"🔐"}],W=a=>{if(!Array.isArray(s.clasi_arrows))return!1;const i=s.clasi_arrows.find(t=>t.división===a);return i?i.active:!1},T=a=>u(null,null,function*(){const i=Array.isArray(s.clasi_arrows)?[...s.clasi_arrows]:[{división:1,active:!1},{división:2,active:!1},{división:3,active:!1}],t=i.findIndex(o=>o.división===a);t!==-1?i[t].active=!i[t].active:i.push({división:a,active:!0}),g(o=>p(c({},o),{clasi_arrows:i})),d(o=>p(c({},o),{[`arrow-${a}`]:!0}));try{yield k("clasi_arrows",JSON.stringify(i),r)}catch(o){console.error("Failed to update arrows",o),alert("Error al actualizar la configuración de flechas")}finally{d(o=>p(c({},o),{[`arrow-${a}`]:!1}))}}),F=a=>{if(!Array.isArray(s.dotd))return 0;const i=s.dotd.find(t=>t.división===a);return i?i.active:0},V=(a,i)=>u(null,null,function*(){const t=Array.isArray(s.dotd)?[...s.dotd]:[{división:1,active:0},{división:2,active:0},{división:3,active:0}],o=t.findIndex(n=>n.división===a);o!==-1?t[o].active=parseInt(i):t.push({división:a,active:parseInt(i)}),g(n=>p(c({},n),{dotd:t})),d(n=>p(c({},n),{[`dotd-${a}`]:!0}));try{yield k("dotd",JSON.stringify(t),r)}catch(n){console.error("Failed to update dotd",n),alert("Error al actualizar la configuración de DOTD")}finally{d(n=>p(c({},n),{[`dotd-${a}`]:!1}))}});return e.jsxs("div",{className:"container push-top",children:[e.jsxs("div",{className:"admin-panel",children:[e.jsxs("div",{className:"panel-header",children:[e.jsx("h2",{children:"Panel de Control"}),e.jsxs("button",{onClick:O,className:"refresh-btn",children:[e.jsx("i",{className:"fa-solid fa-rotate-right"})," Actualizar Datos"]})]}),e.jsx(j,{title:"Herramientas Adicionales",icon:"fa-solid fa-toolbox",defaultOpen:!0,children:e.jsxs("div",{style:{display:"flex",gap:"10px",flexWrap:"wrap",padding:"10px 0"},children:[e.jsxs(w,{to:"/sorteo",style:{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",padding:"12px 16px",borderRadius:"8px",color:"white",fontWeight:"bold"},children:[e.jsx("i",{className:"fa-solid fa-ticket"})," Sorteo de Karts (Admin)"]}),e.jsxs(w,{to:"/admin-asistencia",style:{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none",background:"rgba(16, 185, 129, 0.2)",border:"1px solid #10b981",padding:"12px 16px",borderRadius:"8px",color:"white",fontWeight:"bold"},children:[e.jsx("i",{className:"fa-solid fa-check-to-slot"})," Panel de Asistencia"]}),e.jsxs(w,{to:"/admin-results-v3",style:{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none",background:"rgba(16, 185, 129, 0.2)",border:"1px solid #10b981",padding:"12px 16px",borderRadius:"8px",color:"white",fontWeight:"bold"},children:[e.jsx("i",{className:"fa-solid fa-bolt"})," Gestión Resultados V3 PRO"]}),e.jsxs(w,{to:"/admin-entities",style:{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none",background:"rgba(59, 130, 246, 0.2)",border:"1px solid var(--accent)",padding:"12px 16px",borderRadius:"8px",color:"white",fontWeight:"bold"},children:[e.jsx("i",{className:"fa-solid fa-id-card"})," Pilotos, Equipos y Carreras V3"]}),e.jsxs(w,{to:"/admin-db",style:{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none",background:"rgba(245, 158, 11, 0.2)",border:"1px solid #f59e0b",padding:"12px 16px",borderRadius:"8px",color:"white",fontWeight:"bold"},children:[e.jsx("i",{className:"fa-solid fa-database"})," Database SQL Manager"]})]})}),e.jsxs(j,{title:"Mensaje del Día (MOTD)",icon:"fa-solid fa-bullhorn",defaultOpen:!1,children:[e.jsxs("div",{className:"motd-container",children:[e.jsx("input",{type:"text",placeholder:"Mensaje...",value:s.motd||"",onChange:a=>g(p(c({},s),{motd:a.target.value})),style:{flex:1,padding:"10px",borderRadius:"6px",border:"1px solid #334155",background:"#1e293b",color:"white"}}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{onClick:()=>g(p(c({},s),{motd:""})),className:"refresh-btn btn btn-primary btn-save ",style:{fontWeight:"bold",minWidth:"auto",padding:"10px"},title:"Limpiar",children:e.jsx("i",{className:"fa-solid fa-trash-can"})}),e.jsx("button",{onClick:()=>C("motd",s.motd),disabled:x.motd,className:"refresh-btn btn btn-primary btn-save ",children:x.motd?"...":e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fa-solid fa-floppy-disk"})," Guardar"]})})]})]}),e.jsx("small",{style:{color:"#94a3b8",marginTop:"5px",display:"block"},children:"Deja en blanco para ocultar el mensaje."})]}),e.jsx(j,{title:"Gestión de Carreras",icon:"fa-solid fa-flag-checkered",defaultOpen:!1,children:f?e.jsxs("div",{style:{textAlign:"center",padding:"20px"},children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin"})," Cargando carreras..."]}):e.jsx("div",{className:"races-grid",children:h.map(a=>e.jsxs("div",{className:"race-card",children:[e.jsxs("div",{className:"race-info",children:[e.jsx("div",{style:{fontWeight:"bold"},children:a.nombre}),e.jsx("div",{style:{fontSize:"0.8em",color:"#94a3b8"},children:a.fecha})]}),e.jsxs("div",{className:"race-actions",children:[e.jsxs("div",{className:"race-toggle",children:[e.jsx("span",{className:"mini-label",children:"Activa"}),x[`race-${a.nombre}-${a.fecha}-activa`]?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):e.jsxs("label",{className:"switch",children:[e.jsx("input",{type:"checkbox",checked:a.activa==1,onChange:()=>S(a.nombre,a.fecha,"activa")}),e.jsx("span",{className:"slider round"})]})]}),e.jsxs("div",{className:"race-toggle",children:[e.jsx("span",{className:"mini-label",children:"Terminada"}),x[`race-${a.nombre}-${a.fecha}-terminada`]?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):e.jsxs("label",{className:"switch",children:[e.jsx("input",{type:"checkbox",checked:a.terminada==1,onChange:()=>S(a.nombre,a.fecha,"terminada")}),e.jsx("span",{className:"slider round"})]})]})]})]},`${a.nombre}-${a.fecha}`))})}),e.jsx(j,{title:"Visibilidad de Páginas",icon:"fa-solid fa-eye",defaultOpen:!1,children:e.jsx("div",{className:"toggles-grid",children:E.map(a=>e.jsxs("div",{className:"toggle-card",children:[e.jsxs("div",{className:"toggle-info",children:[e.jsx("span",{className:"toggle-icon",children:a.icon}),e.jsx("span",{className:"toggle-label",children:a.label})]}),e.jsx("div",{className:"toggle-action",children:x[a.key]?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):e.jsxs("label",{className:"switch",children:[e.jsx("input",{type:"checkbox",checked:s[a.key]===!0,onChange:()=>C(a.key)}),e.jsx("span",{className:"slider round"})]})})]},a.key))})}),e.jsx(j,{title:"Flechas de Clasificación",icon:"fa-solid fa-arrows-up-down",defaultOpen:!1,children:e.jsx("div",{className:"toggles-grid",children:[1,2,3].map(a=>e.jsxs("div",{className:"toggle-card",children:[e.jsxs("div",{className:"toggle-info",children:[e.jsx("span",{className:"toggle-icon",children:"↕️"}),e.jsxs("span",{className:"toggle-label",children:["División ",a]})]}),e.jsx("div",{className:"toggle-action",children:x[`arrow-${a}`]?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):e.jsxs("label",{className:"switch",children:[e.jsx("input",{type:"checkbox",checked:W(a),onChange:()=>T(a)}),e.jsx("span",{className:"slider round"})]})})]},`arrow-${a}`))})}),e.jsx(j,{title:"Piloto del Día (DOTD)",icon:"fa-solid fa-star",defaultOpen:!1,children:e.jsx("div",{className:"toggles-grid",children:[1,2,3].map(a=>e.jsxs("div",{className:"toggle-card",style:{flexDirection:"column",alignItems:"flex-start",gap:"10px"},children:[e.jsxs("div",{className:"toggle-info",children:[e.jsx("span",{className:"toggle-icon",children:"⭐"}),e.jsxs("span",{className:"toggle-label",children:["División ",a]})]}),e.jsx("div",{className:"toggle-action",style:{width:"100%"},children:x[`dotd-${a}`]?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):e.jsxs("select",{value:F(a),onChange:i=>V(a,i.target.value),style:{width:"100%",padding:"8px",borderRadius:"6px",background:"#1e293b",color:"#fff",border:"1px solid #334155"},children:[e.jsx("option",{value:"0",children:"0 - No Activas (Cerrado)"}),e.jsx("option",{value:"1",children:"1 - Votación Activa"}),e.jsx("option",{value:"2",children:"2 - Finalizadas (Oculto)"}),e.jsx("option",{value:"3",children:"3 - Finalizadas (Resultados Visibles)"})]})})]},`dotd-${a}`))})}),e.jsx("div",{className:"admin-note",children:e.jsxs("p",{children:["⚠️ ",e.jsx("strong",{children:"Nota:"})," Los cambios pueden tardar unos segundos en propagarse a todos los usuarios debido al caché de Google Sheets."]})})]}),e.jsx("style",{children:`
                .push-top {
                    margin-top: 1rem;
                    max-width: 900px; /* Wider on desktop */
                    margin-left: auto;
                    margin-right: auto;
                }
                .admin-panel {
                    background-color: var(--card-bg);
                    padding: 1rem;
                    border-radius: 12px;
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between; /* Horizontal layout */
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .panel-header h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }
                .refresh-btn {
                    background: none;
                    border: 1px solid var(--color-accent);
                    color: var(--color-accent);
                    padding: 4px 8px;
                    font-size: 0.85rem;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .refresh-btn:hover {
                    background: var(--color-accent);
                    color: white;
                }
                .toggles-grid {
                    display: grid;
                    gap: 0.5rem; /* Tighter gap */
                }
                .toggle-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.75rem 1rem; /* Compact padding */
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .toggle-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .toggle-icon {
                    font-size: 1.2rem;
                }
                .toggle-label {
                    font-weight: 600;
                    font-size: 1rem;
                }
                .admin-note {
                    margin-top: 1rem;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                    text-align: center;
                    background: rgba(251, 191, 36, 0.1);
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(251, 191, 36, 0.2);
                }

                /* Compact MOTD Section */
                .motd-container {
                    display: flex;
                    gap: 8px;
                }
                /* Mobile tweaks */
                @media (max-width: 480px) {
                    .motd-container {
                        flex-direction: column;
                    }
                    .btn-save {
                        width: 100%;
                        padding: 10px;
                    }
                }

                /* Switch CSS */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px; /* Smaller switch */
                    height: 28px;
                }
                .switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 20px; /* Smaller knob */
                    width: 20px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: var(--success);
                }
                input:focus + .slider {
                    box-shadow: 0 0 1px var(--success);
                }
                input:checked + .slider:before {
                    transform: translateX(22px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
                .races-grid {
                    display: grid;
                    gap: 0.5rem;
                }
                .race-card {
                    background: rgba(0,0,0,0.3);
                    padding: 0.8rem;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .race-info {
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 5px;
                }
                .race-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }
                .race-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.05);
                    padding: 5px 10px;
                    border-radius: 6px;
                    flex: 1;
                    justify-content: center;
                }
                .mini-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #cbd5e1;
                    font-weight: 600;
                }
            `})]})};export{U as default};
