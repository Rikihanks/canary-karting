var w=Object.defineProperty,k=Object.defineProperties;var N=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var g=(o,t,r)=>t in o?w(o,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[t]=r,f=(o,t)=>{for(var r in t||(t={}))S.call(t,r)&&g(o,r,t[r]);if(h)for(var r of h(t))C.call(t,r)&&g(o,r,t[r]);return o},v=(o,t)=>k(o,N(t));var j=(o,t,r)=>new Promise((i,l)=>{var c=s=>{try{d(r.next(s))}catch(p){l(p)}},u=s=>{try{d(r.throw(s))}catch(p){l(p)}},d=s=>s.done?i(s.value):Promise.resolve(s.value).then(c,u);d((r=r.apply(o,t)).next())});import{r as m,j as e}from"./index-DEHvOCR0.js";const E="https://script.google.com/macros/s/AKfycbyFLHFaf3CYK8ylSv986J2-5XFK7NMxwButky-wHZTOirali6HdTvMuX2NXdEVbdnNE/exec",I=()=>{const[o,t]=m.useState({nombre:"",email:"",telefono:"",experiencia:"",tiempos:"",peso:""}),[r,i]=m.useState("idle"),[l,c]=m.useState(""),[u,d]=m.useState(!1),[s,p]=m.useState(!1),a=n=>{t(v(f({},o),{[n.target.name]:n.target.value}))},y=n=>j(null,null,function*(){n.preventDefault(),i("submitting"),c("");const x=new URLSearchParams(o);x.append("action","submitForm");try{if((yield(yield fetch(E,{method:"POST",body:x})).json()).success)i("success"),c("¡Inscripción enviada con éxito! Revisa tu correo."),t({nombre:"",email:"",telefono:"",experiencia:"",tiempos:"",peso:""});else throw new Error("El script de Google no devolvió éxito.")}catch(b){console.error("Error de envío:",b),i("error"),c("Error al enviar la solicitud. Inténtalo de nuevo.")}});return e.jsxs("div",{className:"main-wrapper",children:[e.jsxs("div",{className:"container",children:[e.jsxs("h1",{children:[e.jsx("i",{className:"fa-solid fa-flag-checkered"})," Preinscripción Canary Karting"]}),e.jsx("div",{className:"form-group",children:e.jsxs("label",{className:"centered-text",children:["¿Quieres correr con nosotros?",e.jsx("p",{})," Lee detenidamente nuestro documento de reglas y rellena el siguiente formulario."]})}),e.jsx("div",{className:"form-group",children:e.jsxs("a",{href:"https://drive.google.com/file/d/18RiuNlUViofUXUaP6URrBIJwfPEFuGr3/view?usp=sharing",target:"_blank",className:"neon-link",rel:"noreferrer",onClick:()=>p(!0),children:[e.jsx("i",{className:"fa-solid fa-file-pdf"})," Normativa Preinscripción"]})}),e.jsxs("form",{id:"registration-form",onSubmit:y,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"nombre",children:"Nombre Completo"}),e.jsx("input",{type:"text",id:"nombre",name:"nombre",required:!0,value:o.nombre,onChange:a})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:"Correo Electrónico"}),e.jsx("input",{type:"email",id:"email",name:"email",required:!0,value:o.email,onChange:a})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"telefono",children:"Teléfono"}),e.jsx("input",{type:"tel",id:"telefono",name:"telefono",value:o.telefono,onChange:a})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"experiencia",children:"¿Tienes experiencia previa en karting? ¿En qué circuitos de la isla has corrido?"}),e.jsx("input",{type:"text",id:"experiencia",name:"experiencia",value:o.experiencia,onChange:a})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"tiempos",children:"¿Cuales son tus mejores tiempos por circuito? "}),e.jsx("small",{children:"Dejar en blanco si no los sabes"}),e.jsx("input",{type:"text",id:"tiempos",name:"tiempos",value:o.tiempos,onChange:a})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"peso",children:"¿Peso aproximado? "}),e.jsx("input",{type:"text",id:"peso",name:"peso",value:o.peso,onChange:a})]}),e.jsxs("div",{className:"form-group",style:{display:"flex",alignItems:"flex-start",gap:"10px"},children:[e.jsx("input",{type:"checkbox",id:"terms",name:"terms",checked:u,onChange:n=>d(n.target.checked),disabled:!s,style:{width:"20px",height:"20px",marginTop:"3px",cursor:s?"pointer":"not-allowed"}}),e.jsxs("label",{htmlFor:"terms",style:{fontWeight:"400",fontSize:"0.9em",color:s?"inherit":"#94a3b8"},children:["He leído y acepto la normativa y los términos de Canary Karting.",!s&&e.jsx("span",{style:{display:"block",color:"var(--accent)",fontSize:"0.9em",marginTop:"4px",fontWeight:"bold"},children:"⚠️ Abre el documento PDF para activar esta casilla."})]})]}),e.jsx("button",{type:"submit",id:"submit-button",disabled:r==="submitting"||!u,children:r==="submitting"?"Enviando...":"Enviar Solicitud"}),l&&e.jsx("div",{id:"form-message",className:r==="success"?"success":"error",children:l})]})]}),e.jsx("style",{children:`
                /* Inscripcion Specific Styles */
                .main-wrapper {
                    padding-top: 20px;
                    padding-bottom: 50px;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .centered-text {
                    text-align: center;
                    font-weight: 400;
                    line-height: 1.6;
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

                button[type="submit"] {
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

                .neon-link {
                    display: block;
                    text-align: center;
                    padding: 15px;
                    border: 2px solid var(--accent);
                    color: var(--accent);
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 700;
                    text-transform: uppercase;
                    transition: all 0.3s;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
                }

                .neon-link:hover {
                    background-color: var(--accent);
                    color: white;
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
                }

                #form-message {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: 600;
                }

                .success {
                    background-color: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    border: 1px solid #10b981;
                }

                .error {
                    background-color: rgba(239, 68, 68, 0.2);
                    color: #ef4444;
                    border: 1px solid #ef4444;
                }
                
                small {
                    display: block;
                    margin-bottom: 5px;
                    color: #94a3b8;
                    font-size: 0.85rem;
                }
            `})]})};export{I as default};
