var C=(g,b,t)=>new Promise((v,m)=>{var l=r=>{try{s(t.next(r))}catch(n){m(n)}},p=r=>{try{s(t.throw(r))}catch(n){m(n)}},s=r=>r.done?v(r.value):Promise.resolve(r.value).then(l,p);s((t=t.apply(g,b)).next())});import{i as A,r as o,d as I,j as e,N as O,k as T}from"./index-DEHvOCR0.js";const Y=()=>{var z;const g=A(),{raceName:b,raceDate:t}=g.state||{},[v,m]=o.useState(""),[l,p]=o.useState(""),[s,r]=o.useState(""),[n,j]=o.useState(""),[S,f]=o.useState(!1),[c,u]=o.useState("idle"),[N,h]=o.useState(""),{user:d,isLoading:E}=I();if(o.useEffect(()=>{d&&d.correo&&r(d.correo)},[d]),E)return e.jsxs("div",{className:"container",style:{textAlign:"center",paddingTop:"50px"},children:[e.jsx("i",{className:"fa-solid fa-spinner fa-spin",style:{fontSize:"2em",color:"var(--color-accent)"}}),e.jsx("p",{style:{marginTop:"10px",color:"var(--text-muted)"},children:"Cargando..."})]});if(!d)return e.jsx(O,{to:"/",replace:!0});const x={name:b||"Carrera 1 - 15 Diciembre 2024",date:t||"11/09/2025"},w=[{id:"1",name:"Primera"},{id:"2",name:"Segunda"},{id:"3",name:"Tercera"}],D=a=>{a.preventDefault(),f(!0)},y=()=>{f(!1)},R=()=>C(null,null,function*(){u("submitting");const a={raceDate:x.date,email:s,division:k,codigo:n};try{const i=yield T(a);i&&i.success?(u("success"),h(i.message||"¡Te hemos enviado un correo con la confirmación de tu asistencia, nos vemos en el circuito!"),m(""),p(""),j("")):(u("error"),h((i==null?void 0:i.message)||"Error al confirmar la asistencia. Verifica tu código."))}catch(i){u("error"),h(i.message||"Error al conectar con el servidor.")}finally{f(!1),window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}}),k=(z=w.find(a=>a.id===l))==null?void 0:z.name,M=l&&s&&n.trim();return e.jsxs("div",{className:"main-wrapper",children:[e.jsxs("div",{className:"container",children:[e.jsxs("div",{id:"race-info",className:"glass-header",style:{"--header-bg":"url(https://wikikarting.com/wp-content/uploads/2021/03/Instalaciones-Karting-Canarias.webp)"},children:[e.jsx("div",{className:"header-chips",children:e.jsxs("span",{className:"chip chip-assistance",children:[e.jsx("i",{className:"fa-solid fa-check-to-slot"})," Asistencia"]})}),e.jsx("h1",{className:"header-title",children:x.name}),e.jsxs("p",{className:"header-date",children:[e.jsx("i",{className:"fa-regular fa-calendar-days"})," ",x.date]})]}),e.jsxs("div",{className:"assistance-glass-card fade-in",children:[e.jsxs("div",{className:"card-header-premium",children:[e.jsx("h2",{children:"Confirmar Participación"}),e.jsx("p",{children:"Completa tus datos para asegurar tu plaza"})]}),e.jsxs("div",{className:"division-warning",children:[e.jsx("i",{className:"fa-solid fa-circle-info"}),e.jsx("span",{children:"Si corres en dos divisiones deberás confirmar ambas por separado."})]}),e.jsxs("form",{onSubmit:D,className:"assistance-form",children:[e.jsxs("div",{className:"form-group-premium",children:[e.jsxs("label",{htmlFor:"division",children:[e.jsx("i",{className:"fa-solid fa-users"})," División"]}),e.jsx("div",{className:"select-wrapper",children:e.jsxs("select",{id:"division",name:"division",className:"premium-select",value:l,onChange:a=>p(a.target.value),required:!0,children:[e.jsx("option",{value:"",children:"Selecciona tu división"}),w.map(a=>e.jsx("option",{value:a.id,children:a.name},a.id))]})})]}),e.jsxs("div",{className:"form-group-premium",children:[e.jsxs("label",{htmlFor:"email",children:[e.jsx("i",{className:"fa-solid fa-envelope"})," Email"]}),e.jsx("input",{type:"email",id:"email",name:"email",className:"premium-input",required:!0,value:s,onChange:a=>r(a.target.value),placeholder:"tu@email.com",disabled:!!d})]}),e.jsxs("div",{className:"form-group-premium",children:[e.jsxs("label",{htmlFor:"codigo",children:[e.jsx("i",{className:"fa-solid fa-key"})," Código de Verificación"]}),e.jsx("input",{type:"text",id:"codigo",name:"codigo",className:"premium-input",required:!0,value:n,onChange:a=>j(a.target.value),placeholder:"Introduce tu código"}),e.jsx("div",{className:"input-tip",children:"¿Has perdido tu código? Contacta con la organización."})]}),e.jsxs("button",{type:"submit",className:"btn-confirm-premium",disabled:!M||c==="submitting",children:[e.jsx("span",{children:"Registrar Asistencia"}),e.jsx("i",{className:"fa-solid fa-paper-plane"})]}),N&&e.jsxs("div",{id:"form-message",className:`message-banner-premium ${c==="success"?"success":"error"}`,children:[e.jsx("i",{className:`fa-solid ${c==="success"?"fa-circle-check":"fa-circle-exclamation"}`}),e.jsx("span",{children:N})]})]})]})]}),S&&e.jsx("div",{className:"modal-overlay",onClick:y,children:e.jsxs("div",{className:"modal-container-premium",onClick:a=>a.stopPropagation(),children:[e.jsx("div",{className:"modal-header-premium",children:e.jsx("h2",{children:"Confirmar Datos"})}),e.jsxs("div",{className:"modal-body-premium",children:[e.jsx("p",{children:"¿Tus datos de participación son correctos?"}),e.jsxs("div",{className:"confirmation-summary",children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"label",children:"Evento:"}),e.jsx("span",{className:"value",children:x.name})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"label",children:"División:"}),e.jsx("span",{className:"value",children:k})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("span",{className:"label",children:"Email:"}),e.jsx("span",{className:"value",children:s})]})]})]}),e.jsxs("div",{className:"modal-footer-premium",children:[e.jsx("button",{className:"btn-modal-cancel",onClick:y,children:"Cancelar"}),e.jsx("button",{className:"btn-modal-confirm",onClick:R,disabled:c==="submitting",children:c==="submitting"?"Enviando...":"Confirmar"})]})]})}),e.jsx("style",{children:`
                .main-wrapper {
                    padding-bottom: 50px;
                }

                /* GLASS HEADER */
                .glass-header {
                    position: relative;
                    background-image: var(--header-bg);
                    background-size: cover;
                    background-position: center;
                    border-radius: 20px;
                    padding: 40px 25px;
                    margin: 10px 10px 12px;
                    overflow: hidden;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
                }

                .glass-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.7));
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    z-index: 1;
                }

                .header-chips, .header-title, .header-date {
                    position: relative;
                    z-index: 2;
                }

                .header-chips {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                    flex-direction: column
                }

                .chip {
                    padding: 4px 12px;
                    text-align: center;
                    border-radius: 50px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .chip-assistance {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                }

                .header-title {
                    font-family: 'Russo One', sans-serif;
                    font-size: 1.8rem;
                    color: white;
                    margin: 0 0 10px 0;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    line-height: 1.2;
                }

                .header-date {
                    flex-direction: column;
                    color: #94a3b8;
                    margin: 0;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .header-date i {
                    color: #3b82f6;
                }

                /* GLASS CARD */
                .assistance-glass-card {
                    margin: 0 10px;
                    background: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 24px;
                    padding: 25px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }

                .card-header-premium {
                    margin-bottom: 12px;
                    text-align: center;
                }

                .card-header-premium h2 {
                    font-family: 'Russo One', sans-serif;
                    color: white;
                    font-size: 1.4rem;
                    margin: 0 0 5px 0;
                }

                .card-header-premium p {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin: 0;
                }

                .division-warning {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    border-radius: 12px;
                    padding: 12px 15px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-bottom: 25px;
                    font-size: 0.85rem;
                    color: #fcd34d;
                }

                /* FORM PREMIUM */
                .form-group-premium {
                    margin-bottom: 20px;
                }

                .form-group-premium label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }

                .form-group-premium label i {
                    color: #3b82f6;
                    font-size: 0.8rem;
                }

                .premium-input, .premium-select {
                    width: 100%;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 14px 16px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .premium-input:focus, .premium-select:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: rgba(15, 23, 42, 0.8);
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                .premium-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .input-tip {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin-top: 8px;
                }

                .btn-confirm-premium {
                    width: 100%;
                    margin-top: 10px;
                    padding: 16px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    border: none;
                    border-radius: 14px;
                    color: white;
                    font-family: 'Russo One', sans-serif;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
                }

                .btn-confirm-premium:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4);
                }

                .btn-confirm-premium:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-confirm-premium:disabled {
                    background: #334155;
                    color: #64748b;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .message-banner-premium {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 12px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    font-size: 0.9rem;
                    font-weight: 500;
                    animation: fadeIn 0.3s ease-out;
                }

                .message-banner-premium.success {
                    background: rgba(16, 185, 129, 0.15);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .message-banner-premium.error {
                    background: rgba(239, 68, 68, 0.15);
                    color: #f87171;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                }

                /* MODAL PREMIUM */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(2, 6, 23, 0.85);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .modal-container-premium {
                    background: #1e293b;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    width: 100%;
                    max-width: 400px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }

                .modal-header-premium {
                    padding: 20px;
                    background: rgba(255,255,255,0.03);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .modal-header-premium h2 {
                    font-family: 'Russo One', sans-serif;
                    margin: 0;
                    font-size: 1.2rem;
                    color: white;
                }

                .modal-body-premium {
                    padding: 20px;
                }

                .modal-body-premium p {
                    color: #94a3b8;
                    margin: 0 0 15px 0;
                }

                .confirmation-summary {
                    background: rgba(15, 23, 42, 0.5);
                    border-radius: 16px;
                    padding: 15px;
                }

                .summary-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 12px;
                }

                .summary-item:last-child {
                    margin-bottom: 0;
                }

                .summary-item .label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: #64748b;
                    font-weight: 700;
                }

                .summary-item .value {
                    color: #f1f5f9;
                    font-weight: 500;
                }

                .modal-footer-premium {
                    padding: 20px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .btn-modal-cancel {
                    padding: 12px;
                    background: transparent;
                    border: 1px solid #334155;
                    color: #94a3b8;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .btn-modal-confirm {
                    padding: 12px;
                    background: #3b82f6;
                    border: none;
                    color: white;
                    border-radius: 12px;
                    cursor: pointer;
                    font-weight: 700;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                /* Mobile Optimization */
                @media (max-width: 480px) {
                    .glass-header {
                        padding: 30px 20px;
                    }
                    .header-title {
                        font-size: 1.5rem;
                    }
                    .assistance-glass-card {
                        padding: 20px;
                    }
                }
            `})]})};export{Y as default};
