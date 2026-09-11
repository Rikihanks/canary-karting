var x=(n,d,r)=>new Promise((u,a)=>{var s=t=>{try{o(r.next(t))}catch(i){a(i)}},c=t=>{try{o(r.throw(t))}catch(i){a(i)}},o=t=>t.done?u(t.value):Promise.resolve(t.value).then(s,c);o((r=r.apply(n,d)).next())});import{r as l,d as g,e as h,j as e}from"./index-DEHvOCR0.js";const v=()=>{const[n,d]=l.useState(""),[r,u]=l.useState(!1),[a,s]=l.useState(!1),[c,o]=l.useState(""),{login:t}=g(),i=h(),b=p=>x(null,null,function*(){p.preventDefault(),s(!0),o("");const m=yield t(n);m.success?u(!0):o(m.message),s(!1)});return r?e.jsxs("div",{style:{padding:"30px",maxWidth:"500px",margin:"0 auto"},children:[e.jsx("i",{className:"fa-solid fa-envelope-circle-check",style:{fontSize:"4rem",color:"var(--accent)",marginBottom:"20px"}}),e.jsx("h2",{style:{marginBottom:"15px"},children:"¡Bienvenido!"}),e.jsxs("p",{style:{fontSize:"1.1rem",lineHeight:"1.6",color:"#cbd5e1",marginBottom:"20px"},children:["Te hemos mandado un correo para verificar tu identidad. Dentro hay un código que ",e.jsx("strong",{children:" debes guardar "})," porque te será necesario para confirmar tu asistencia a las carreras.",e.jsx("br",{})]}),e.jsx("button",{onClick:()=>i("/"),children:"Entendido"}),e.jsx("style",{children:`
                        button {
                            width: 100%;
                            padding: 15px;
                            background-color: var(--accent);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1.1rem;
                            font-weight: 800;
                            cursor: pointer;
                            transition: background-color 0.3s;
                            text-transform: uppercase;
                        }
                    `})]}):e.jsxs("div",{className:"container",style:{textAlign:"center",marginTop:"50px"},children:[e.jsx("h2",{children:"Iniciar Sesión"}),e.jsxs("form",{onSubmit:b,style:{display:"flex",flexDirection:"column",gap:"10px",maxWidth:"300px",margin:"0 auto"},children:[e.jsx("input",{type:"text",placeholder:"piloto@email.com",value:n,onChange:p=>d(p.target.value)}),e.jsx("small",{children:"Sólo los pilotos en competición pueden identificarse en la aplicación."}),c&&e.jsx("div",{style:{color:"var(--danger)",fontWeight:"bold"},children:c}),e.jsx("button",{type:"submit",className:"btn-primary",disabled:a||!n,children:a?e.jsx("i",{className:"fa-solid fa-spinner fa-spin"}):"Entrar"})]}),e.jsx("style",{children:`
                  label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--text-main);
                }
                
                input[type="text"],
                input[type="email"],
                input[type="tel"] {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    background-color: #1e293b;
                    color: white;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }

                input:focus {
                    outline: none;
                    border-color: var(--accent);
                }

                button {
                    width: 100%;
                    padding: 15px;
                    background-color: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    text-transform: uppercase;
                }

                button[type="submit"]:hover {
                    background-color: var(--accent-hover);
                }
                
                button[type="submit"]:disabled {
                    background-color: #64748b;
                    cursor: not-allowed;
                }
            `})]})};export{v as default};
