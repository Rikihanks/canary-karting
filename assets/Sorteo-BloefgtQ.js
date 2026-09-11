var Le=Object.defineProperty,Ae=Object.defineProperties;var Ie=Object.getOwnPropertyDescriptors;var q=Object.getOwnPropertySymbols;var pe=Object.prototype.hasOwnProperty,fe=Object.prototype.propertyIsEnumerable;var de=(a,i,c)=>i in a?Le(a,i,{enumerable:!0,configurable:!0,writable:!0,value:c}):a[i]=c,D=(a,i)=>{for(var c in i||(i={}))pe.call(i,c)&&de(a,c,i[c]);if(q)for(var c of q(i))fe.call(i,c)&&de(a,c,i[c]);return a},M=(a,i)=>Ae(a,Ie(i));var Z=(a,i)=>{var c={};for(var r in a)pe.call(a,r)&&i.indexOf(r)<0&&(c[r]=a[r]);if(a!=null&&q)for(var r of q(a))i.indexOf(r)<0&&fe.call(a,r)&&(c[r]=a[r]);return c};var U=(a,i,c)=>new Promise((r,p)=>{var y=d=>{try{m(c.next(d))}catch(u){p(u)}},j=d=>{try{m(c.throw(d))}catch(u){p(u)}},m=d=>d.done?r(d.value):Promise.resolve(d.value).then(y,j);m((c=c.apply(a,i)).next())});import{r as b,j as e,g as Me,l as Te,R as Ee}from"./index-DEHvOCR0.js";import{h as Pe}from"./html2canvas.esm-V-rdnldR.js";function J(a){const i=a.slice();for(let c=i.length-1;c>0;c--){const r=Math.floor(Math.random()*(c+1));[i[c],i[r]]=[i[r],i[c]]}return i}function ze(a){const i=new Map,c=new Map;return a?(a.split(/\r?\n/).forEach(p=>{if(p=p.trim(),!p)return;let y="",j=[];if(p.includes(":")){const m=p.split(":");y=m.shift().trim(),j=m.join(":").split(",").map(d=>d.trim()).filter(Boolean)}else{const m=p.split(",").map(d=>d.trim()).filter(Boolean);if(m.length===0)return;y=m.shift(),j=m}if(y){const m=y.toLowerCase().trim();c.set(m,y);const d=new Set(j.map(u=>u.trim().toLowerCase()).filter(Boolean));i.set(m,d)}}),{map:i,originals:c}):{map:i,originals:c}}function Oe(a,i,c){const r=a.length,p=i.length,y=J(Array.from({length:p},(f,g)=>g)),j=J(Array.from({length:r},(f,g)=>g)),m=Array.from({length:r},()=>[]);for(let f=0;f<r;f++){const g=a[f].toLowerCase().trim(),S=c.get(g);y.forEach(B=>{const _=i[B].trim().toLowerCase();(!S||!S.has(_))&&m[f].push(B)}),m[f]=J(m[f])}for(let f=0;f<r;f++)if(m[f].length===0)return null;const d=new Array(p).fill(-1);function u(f,g){for(const S of m[f])if(!g[S]&&(g[S]=!0,d[S]===-1||u(d[S],g)))return d[S]=f,!0;return!1}for(const f of j){const g=new Array(p).fill(!1);if(!u(f,g))return null}const C={};for(let f=0;f<p;f++){const g=d[f];g!==-1&&(C[a[g]]=i[f])}return C}function $e(a,i){const r=[];r.push("");for(let p=0;p<48;p++){const y=a[Math.floor(Math.random()*a.length)];r.push(y)}return r.push(i),r}const We=()=>{const a=b.useRef(null),i=t=>{if(!t)return t;if(t.historial&&t.pilotosRows){const{map:n}=ze(t.historial),o=t.pilotosRows.map(w=>{const I=(w.name||"").trim().toLowerCase();if(I&&n.has(I)){const F=Array.from(n.get(I)).join(", "),W=w.history?w.history+", ":"";return M(D({},w),{history:W+F})}return M(D({},w),{history:w.history||""})}),s=t,{historial:h}=s,A=Z(s,["historial"]);return M(D({},A),{pilotosRows:o})}return t.pilotosRows&&(t.pilotosRows=t.pilotosRows.map(n=>M(D({},n),{history:n.history||""}))),t},r=(()=>{try{const t=localStorage.getItem("sorteo_auto_save");return t?i(JSON.parse(t)):null}catch(t){return null}})(),[p,y]=b.useState((r==null?void 0:r.karts)||""),[j,m]=b.useState((r==null?void 0:r.reservas)||""),[d,u]=b.useState((r==null?void 0:r.results)||[]),[C,f]=b.useState(!1),[g,S]=b.useState((r==null?void 0:r.isOscuroMode)||!1),[B,_]=b.useState("Copiar al Historial"),[T,H]=b.useState((r==null?void 0:r.lastAssignments)||[]),[me,he]=b.useState([]),[E,ee]=b.useState((r==null?void 0:r.activeDivision)||1),[G,_e]=b.useState((r==null?void 0:r.activeSeason)||"2026"),[R,O]=b.useState((r==null?void 0:r.pilotosRows)||[]),[L,te]=b.useState(()=>{try{return JSON.parse(localStorage.getItem("sorteo_saves")||"[]")}catch(t){return[]}}),[K,Y]=b.useState("");b.useEffect(()=>{const t={karts:p,reservas:j,results:d.map(s=>{const h=s,{listaAnimada:n}=h;return Z(h,["listaAnimada"])}),pilotosRows:R,activeDivision:E,lastAssignments:T,isOscuroMode:g,activeSeason:G};localStorage.setItem("sorteo_auto_save",JSON.stringify(t))},[p,j,d,R,E,T,g,G]);const V=(t,s=me)=>{if(!s||s.length===0)return;const n=s.filter(o=>o.division===t&&o.season===G).sort((o,h)=>o.name.localeCompare(h.name)).map(o=>({name:o.name,weight:"",history:""}));O(n)};b.useEffect(()=>{U(null,null,function*(){try{const s=yield Me();he(s),R.length===0&&V(E,s)}catch(s){console.error("Error fetching drivers",s)}})},[]);const ue=()=>{const t=window.prompt("Introduce un nombre para guardar esta sesión:",`Carrera - Div ${E} - ${new Date().toLocaleDateString()}`);if(!t)return;const s={id:Date.now().toString(),name:t,karts:p,reservas:j,activeDivision:E,pilotosRows:R,results:d,lastAssignments:T},n=L.findIndex(A=>A.name===t);let o,h=s.id;if(n!==-1)if(window.confirm(`Ya existe una sesión llamada "${t}". ¿Deseas sobreescribirla?`))o=[...L],h=L[n].id,o[n]=M(D({},s),{id:h});else return;else o=[...L,s];te(o),localStorage.setItem("sorteo_saves",JSON.stringify(o)),Y(h)},ge=t=>{const s=t.target.value;if(Y(s),!s)return;const n=L.find(o=>o.id===s);if(n&&window.confirm(`¿Cargar la sesión "${n.name}"? Se sobrescribirán los datos actuales en pantalla.`)){const o=i(n);y(o.karts||""),m(o.reservas||""),ee(o.activeDivision||1),O(o.pilotosRows||[]),u(o.results||[]),H(o.lastAssignments||[])}},xe=()=>{if(!K){alert("Por favor, selecciona una sesión de la lista para borrarla.");return}const t=L.find(s=>s.id===K);if(t&&window.confirm(`¿Seguro que quieres borrar la sesión "${t.name}"?`)){const s=L.filter(n=>n.id!==K);te(s),localStorage.setItem("sorteo_saves",JSON.stringify(s)),Y("")}},be=t=>{const s=parseInt(t.target.value);ee(s),V(s)},Q=(t,s,n)=>{const o=[...R];o[t][s]=n,O(o)},ye=()=>{O([...R,{name:"",weight:"",history:""}])},we=t=>{const s=[...R];s.splice(t,1),O(s)},ve=()=>U(null,null,function*(){if(a.current)try{const t=yield Pe(a.current,{scale:2,logging:!1,useCORS:!0,imageTimeout:65e3}),s=document.createElement("a");s.download=`sorteo-karts-${Date.now()}.png`,s.href=t.toDataURL("image/png"),s.click()}catch(t){console.error("Error al generar la imagen:",t)}}),je=()=>{const t=R.filter(l=>l.name.trim()),s=t.map(l=>l.name.trim()),n=p.split(/[\n;]+/).map(l=>l.trim()).filter(l=>l),o=new Map,h=new Map;t.forEach(l=>{const v=l.name.trim().toLowerCase();h.set(v,l.name.trim());const x=(l.history||"").split(",").map(N=>N.trim().toLowerCase()).filter(Boolean);o.set(v,new Set(x))});const A=["51","60","61","39"];if(t.forEach(l=>{const v=parseFloat(l.weight);if(!isNaN(v)&&75-v>15){const x=l.name.trim().toLowerCase();let N=o.get(x);N||(N=new Set,o.set(x,N)),A.forEach(z=>N.add(z)),h.has(x)||h.set(x,l.name.trim())}}),u([]),H([]),s.length===0||n.length===0){alert("⚠️ Debes introducir al menos un corredor y un kart.");return}if(s.length>n.length){alert("⚠️ Hay más corredores que karts disponibles.");return}let w=[...s],I=[...n],F={};const W=t.find(l=>l.name.trim().toLowerCase()==="richard"),Se=n.some(l=>l.trim()==="55");if(W&&Se){const l=W.name.trim();F[l]="55",w=w.filter(v=>v!==l),I=I.filter(v=>v.trim()!=="55")}const se=Oe(w,I,o);if(!se){const l=[];w.forEach(x=>{const N=o.get(x.toLowerCase().trim());if(N&&N.size>=I.length){const z=h.get(x.toLowerCase().trim())||x;l.push(z)}});let v="No ha sido posible encontrar una asignación perfecta sin repeticiones.";if(l.length>0?v=`No hay suficientes karts distintos para evitar repetir con: ${l.join(", ")}. ¿Deseas continuar permitiendo repeticiones?`:v+=" ¿Continuar?",!window.confirm(v))return}const X=D(D({},se||{}),F);f(!0);let P=J(n.slice());const ae=100,re=[],oe=[];s.forEach((l,v)=>{let x=null;if(X&&X.hasOwnProperty(l)){x=X[l];const k=P.indexOf(x);k!==-1&&P.splice(k,1)}else{const k=o.get(l.toLowerCase().trim());if(P.length>0){for(let $=0;$<P.length;$++){const ce=P[$],De=ce.trim().toLowerCase();if(!k||!k.has(De)){x=ce,P.splice($,1);break}}x||(x=P.shift())}}oe.push({name:l,kart:x});const N=$e(n,x),z=t.find(k=>k.name.trim()===l),ie=parseFloat(z==null?void 0:z.weight);let ne="",le="var(--text-muted)";if(!isNaN(ie)){const k=75-ie,$=k>0?k.toFixed(1):"0";ne=k>0?`+${$}kg`:"0kg",le=k>0?"#fbbf24":"#22c55e"}re.push({name:l,kart:x,diffTxt:ne,diffColor:le,listaAnimada:N,delay:v*ae,animationDuration:2500+Math.random()*1e3})}),H(oe),u(re),Te("sorteo_karts",{pilotos_count:s.length,karts_count:n.length,has_history:t.some(l=>l.history&&l.history.trim())});const Re=s.length*ae+3500;setTimeout(()=>{f(!1)},Re),setTimeout(()=>{const l=document.getElementById("grid");if(l){const v=l.offsetTop;window.scrollTo({top:v-80,behavior:"smooth"})}},100)},ke=()=>{if(!T||T.length===0){alert("⚠️ No hay asignaciones recientes para copiar.");return}const t=R.map(s=>{const n=T.find(o=>o.name.trim().toLowerCase()===s.name.trim().toLowerCase());if(n&&n.kart){const o=s.history?s.history.trim():"",h=o?", ":"";return M(D({},s),{history:o+h+n.kart})}return s});O(t),_("Copiado"),setTimeout(()=>_("Copiar al Historial"),2e3)},Ne=()=>{window.confirm(`¿Estás seguro de que quieres limpiar la pantalla (borrar Pilotos, Karts, Reservas y Resultados actuales)? 
Esto NO borrará las sesiones guardadas.`)&&(V(E),y(""),m(""),u([]),H([]),_("Copiar al Historial"))},Ce=(t,s,n)=>{const o=[...d];if(o[t]=M(D({},o[t]),{[s]:n}),u(o),s==="kart"){const h=[...T];h[t]&&(h[t].kart=n,H(h))}};return e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"panel",children:[e.jsxs("div",{className:"division-select-wrapper",style:{marginBottom:"25px",display:"flex",alignItems:"center",gap:"15px"},children:[e.jsxs("label",{style:{margin:0},children:[e.jsx("i",{className:"fa-solid fa-list-ol"})," División:"]}),e.jsxs("select",{value:E,onChange:be,style:{width:"auto",minWidth:"250px",padding:"8px 12px",borderRadius:"8px",background:"#1f2937",color:"white",border:"1px solid #374151",fontSize:"1rem"},children:[e.jsx("option",{value:"1",children:"1ª División"}),e.jsx("option",{value:"2",children:"2ª División"}),e.jsx("option",{value:"3",children:"3ª División"})]}),e.jsxs("div",{style:{marginLeft:"auto",display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap",flexGrow:1,justifyContent:"flex-end"},children:[e.jsxs("select",{value:K,onChange:ge,style:{padding:"8px 12px",borderRadius:"8px",background:"#111827",color:"white",border:"1px solid #374151",fontSize:"0.9rem",width:"auto",minWidth:"180px",maxWidth:"350px"},children:[e.jsx("option",{value:"",disabled:!0,children:"Cargar sesión..."}),L.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]}),e.jsxs("button",{onClick:ue,className:"btn-secondary",style:{padding:"8px 12px",fontSize:"0.9rem",width:"auto"},title:"Guardar estado actual",children:[e.jsx("i",{className:"fa-solid fa-floppy-disk"})," Guardar"]}),L.length>0&&e.jsx("button",{onClick:xe,className:"btn-danger",style:{padding:"8px 12px",fontSize:"0.9rem",width:"auto"},title:"Borrar la sesión seleccionada",children:e.jsx("i",{className:"fa-solid fa-trash"})})]})]}),e.jsx("div",{style:{marginTop:"15px",display:"flex",alignItems:"center"},children:e.jsxs("label",{style:{cursor:"pointer",display:"flex",alignItems:"center",gap:"8px",color:g?"#fbbf24":"var(--text-muted)"},children:[e.jsx("input",{type:"checkbox",checked:g,onChange:t=>S(t.target.checked),style:{width:"18px",height:"18px",cursor:"pointer",accentColor:"#fbbf24"}}),e.jsx("i",{className:"fa-solid fa-moon"})," Modo Oscuro"]})}),e.jsx("br",{}),e.jsxs("div",{className:"inputs-container",children:[e.jsxs("div",{className:"table-left",children:[e.jsxs("div",{className:"row-header",children:[e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-user"})," Piloto"]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-weight-scale"})," Peso"]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-timeline"})," Karts previos"]}),e.jsxs("div",{children:[e.jsx("i",{className:"fa-solid fa-scale-balanced"})," Ajuste"]}),e.jsx("div",{})]}),R.map((t,s)=>{const n=parseFloat(t.weight),o=isNaN(n)?null:75-n,h=o!==null?o>0?`+${o.toFixed(1)}kg`:"0kg":"-";let A="var(--color-secondary-accent)";return o!==null&&(A=o>0?"#fbbf24":"#22c55e"),e.jsxs("div",{className:"pilot-row",children:[e.jsx("input",{type:"text",value:t.name,onChange:w=>Q(s,"name",w.target.value),placeholder:"Nombre del piloto"}),e.jsx("input",{type:"number",step:"0.1",value:t.weight,onChange:w=>Q(s,"weight",w.target.value),placeholder:"Ej: 65"}),e.jsx("input",{type:"text",value:t.history||"",onChange:w=>Q(s,"history",w.target.value),placeholder:"Ej: 33, 45",title:"Separados por coma"}),e.jsx("div",{className:"diff-display",style:{color:A},children:h}),e.jsx("button",{className:"remove-btn",onClick:()=>we(s),children:e.jsx("i",{className:"fa-solid fa-xmark"})})]},s)}),e.jsxs("button",{className:"btn-secondary",style:{marginTop:"10px",width:"fit-content"},onClick:ye,children:[e.jsx("i",{className:"fa-solid fa-plus"})," Añadir Piloto Extra"]})]}),e.jsx("div",{className:"table-right",children:e.jsxs("div",{style:{display:"flex",gap:"15px",height:"calc(100% - 40px)",flexWrap:"wrap"},children:[e.jsxs("div",{style:{flex:1,minWidth:"150px"},children:[e.jsxs("label",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("span",{children:[e.jsx("i",{className:"fa-solid fa-car-side"})," Karts"]}),e.jsxs("span",{style:{fontSize:"0.85em",background:"rgba(59, 130, 246, 0.2)",color:"#93c5fd",padding:"2px 8px",borderRadius:"12px"},children:[p.split(/[\n;]+/).map(t=>t.trim()).filter(t=>t).length," total"]})]}),e.jsx("textarea",{id:"karts",placeholder:`Separados por salto de línea
33
36
37`,value:p,onChange:t=>y(t.target.value),style:{height:"100%",minHeight:"150px"}})]}),e.jsxs("div",{style:{flex:1,minWidth:"150px"},children:[e.jsx("label",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:e.jsxs("span",{children:[e.jsx("i",{className:"fa-solid fa-car-on"})," Reservas"]})}),e.jsx("textarea",{id:"reservas",placeholder:`Para sustituciones
35
40`,value:j,onChange:t=>m(t.target.value),style:{height:"100%",minHeight:"150px"}})]})]})})]}),e.jsxs("small",{style:{marginTop:"15px",display:"block",lineHeight:"1.5"},children:[e.jsx("i",{className:"fa-solid fa-circle-info"})," El sistema asignará karts intentando no repetir los que estén en el historial de cada piloto. Mínimo 75kg.",e.jsx("br",{}),e.jsxs("span",{style:{color:"#fbbf24"},children:[e.jsx("i",{className:"fa-solid fa-triangle-exclamation"})," Karts sin lastre (","51, 60, 61, 39",") excluidos para pilotos con ajuste > 15kg."]})]}),e.jsxs("div",{className:"btn-group",children:[e.jsxs("button",{id:"copyHistBtn",className:"btn-secondary",title:"Guardar resultado actual en historial",onClick:ke,children:[e.jsx("i",{className:`fa-regular ${B==="Copiado"?"fa-check":"fa-copy"}`})," ",B]}),e.jsxs("button",{id:"clearHistBtn",className:"btn-danger",title:"Borrar todos los datos",onClick:Ne,children:[e.jsx("i",{className:"fa-solid fa-trash-can"})," Limpiar Todo"]}),e.jsx("button",{id:"sortearBtn",className:"btn-primary",onClick:je,disabled:C,children:C?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin"})," Sorteando..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fa-solid fa-shuffle"})," INICIAR SORTEO"]})}),e.jsx("button",{className:"btn-secondary",style:{display:!d.length||C?"none":"block"},onClick:ve,children:"Exportar como Imagen"})]})]}),e.jsx("div",{className:"grid",id:"grid",children:d.map((t,s)=>e.jsx(Be,{item:t,onUpdate:(n,o)=>Ce(s,n,o)},`${s}-${t.animationDuration||Math.random()}`))}),e.jsx("br",{}),e.jsx("div",{ref:a,className:"grid",style:{display:"grid",position:"absolute",width:"93%",left:"-9999px",zIndex:-1},children:d.map((t,s)=>e.jsxs("div",{className:"card",style:{opacity:1,transform:"translateY(0)",animation:"none"},children:[e.jsx("div",{className:"nombre",children:t.name}),t.diffTxt&&e.jsxs("div",{className:"lastre-badge",style:{color:t.diffColor},children:[e.jsx("i",{className:"fa-solid fa-weight-hanging"})," Lastre: ",t.diffTxt]}),e.jsx("div",{className:"kart-slot",children:e.jsx("div",{className:"kart-list",style:{top:"0px",filter:"none",transition:"none",animation:"none"},children:e.jsx("div",{children:t.kart})})})]},`clon-${s}`))}),e.jsx("style",{children:`
                /* Sorteo Specific Styles */
                .inputs-container {
                    display: grid;
                    grid-template-columns: 3fr 1fr;
                    gap: 30px;
                }
                @media (max-width: 800px) {
                    .inputs-container {
                        grid-template-columns: 1fr;
                    }
                }
                .table-left {
                    display: flex;
                    flex-direction: column;
                }
                .table-right {
                    display: flex;
                    flex-direction: column;
                }
                .row-header, .pilot-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 2fr 1fr 40px;
                    gap: 15px;
                    align-items: center;
                }
                .row-header {
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                }
                .pilot-row {
                    margin-bottom: 10px;
                }
                .pilot-row input {
                    height: 42px;
                    padding: 8px 12px;
                    background-color: #111827;
                    border: 1px solid #374151;
                    color: white;
                    border-radius: 8px;
                    font-family: inherit;
                    width: 100%;
                }
                .diff-display {
                    background: #111827;
                    border: 1px solid #374151;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    font-weight: bold;
                    color: var(--color-secondary-accent);
                    font-size: 0.95rem;
                }
                .remove-btn {
                    background: transparent;
                    color: #ef4444;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 42px;
                    border-radius: 8px;
                    transition: background 0.2s;
                }
                .remove-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                }
                
                .lastre-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    background: rgba(30, 41, 59, 0.5);
                    color: #93c5fd;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.85em;
                    margin-bottom: 10px;
                    font-weight: bold;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    min-height: 28px;
                    min-width: 115px;
                    white-space: nowrap;
                }

                .panel {
                    background-color: var(--card-bg);
                    padding: 40px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 30px;
                }

                .container {
                    padding-top: 30px;
                    padding-bottom: 50px;
                    max-width: 1400px;
                    width: 95%;
                    margin: 0 auto;
                }

                @media (max-width: 600px) {
                    .panel {
                        padding: 15px;
                    }
                }
                
                label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-muted);
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                textarea {
                    width: 100%;
                    height: 150px;
                    background-color: #111827;
                    border: 1px solid #374151;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    resize: vertical;
                    font-family: monospace;
                    font-size: 1.1rem;
                }

                input[type="text"],
                input[type="tel"] {
                    width: 100%;
                    background-color: #111827;
                    border: 1px solid #374151;
                    color: white;
                    padding: 12px 15px;
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .btn-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }

                .btn-primary, .btn-secondary, .btn-danger {
                    font-size: 1.1rem;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.1s, opacity 0.2s;
                    flex-grow: 1;
                    justify-content: center;
                }
                
                .btn-primary { background-color: var(--accent); color: white; }
                .btn-secondary { background-color: #475569; color: white; }
                .btn-danger { background-color: #ef4444; color: white; }

                .btn-primary:hover { background-color: var(--accent-hover); }
                .btn-primary:disabled { opacity: 0.7; cursor: wait; }

                /* Grid de Resultados */
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 15px;
                    padding-bottom: 50px;
                }

                .card {
                    background-color: #1e293b;
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    opacity: 0; /* Start hidden for fade-up */
                    transform: translateY(20px);
                }
                
                .card.fade-up {
                    animation: fadeUp 0.5s forwards;
                }
                
                .card.name-up {
                    border-color: var(--accent);
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
                }

                @keyframes fadeUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                .nombre {
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #e2e8f0;
                    font-size: 1.1em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .kart-slot {
                    height: 60px;
                    background-color: #0f172a;
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                    border: 1px solid #334155;
                    font-family: 'Russo One', sans-serif;
                    font-size: 1.8em;
                    color: var(--color-secondary-accent);
                }

                .kart-list {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    /* Initial state handled by JS animation */
                }

                .kart-list div {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `})]})},Be=({item:a,onUpdate:i})=>{var m;const c=b.useRef(null),[r,p]=b.useState(!1);Ee.useEffect(()=>{if(r)return;if(!a.listaAnimada||a.listaAnimada.length===0){p(!0);return}const d=c.current;if(!d)return;const C=-60*(a.listaAnimada.length-1),f=setTimeout(()=>{d.animate([{top:"0px",filter:"blur(0px)"},{top:`${C*.8}px`,filter:"blur(2px)",offset:.6},{top:`${C}px`,filter:"blur(0px)"}],{duration:a.animationDuration,easing:"cubic-bezier(0.12, 0.8, 0.32, 1)",fill:"forwards"}).onfinish=()=>{p(!0),c.current&&(c.current.style.top=`${C}px`)}},a.delay+200);return()=>clearTimeout(f)},[a,r]);const y=d=>{i&&i("kart",d.target.value)},j=()=>{const d=a.lastradoMsg||"Verificado",u=window.prompt("Introduce lastre aplicado (o vacío para quitar):",d);u!==null&&(u.trim()===""?(i&&i("isLastrado",!1),i&&i("lastradoMsg","")):(i&&i("isLastrado",!0),i&&i("lastradoMsg",u)))};return e.jsxs("div",{className:`card fade-up ${r?"name-up":""}`,style:{animationDelay:`${a.delay}ms`},children:[e.jsx("div",{className:"nombre",children:a.name}),a.diffTxt&&e.jsxs("div",{onClick:j,className:"lastre-badge",style:{color:a.isLastrado?"#22c55e":a.diffColor,cursor:"pointer",border:a.isLastrado?"1px solid #22c55e":"1px solid rgba(255, 255, 255, 0.1)"},title:"Click para marcar o editar lastre",children:[e.jsx("i",{className:a.isLastrado?"fa-solid fa-check":"fa-solid fa-weight-hanging"})," Lastre: ",a.isLastrado&&a.lastradoMsg?a.lastradoMsg:a.diffTxt]}),e.jsx("div",{className:"kart-slot",children:r?e.jsx("input",{type:"text",value:a.kart||"",onChange:y,style:{width:"100%",height:"100%",background:"transparent",border:"none",color:"inherit",font:"inherit",textAlign:"center",outline:"none"}}):e.jsx("div",{className:"kart-list",ref:c,children:(m=a.listaAnimada)==null?void 0:m.map((d,u)=>e.jsx("div",{children:d},u))})})]})};export{We as default};
