var w=Object.defineProperty,k=Object.defineProperties;var C=Object.getOwnPropertyDescriptors;var g=Object.getOwnPropertySymbols;var N=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var h=(r,a,o)=>a in r?w(r,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[a]=o,f=(r,a)=>{for(var o in a||(a={}))N.call(a,o)&&h(r,o,a[o]);if(g)for(var o of g(a))S.call(a,o)&&h(r,o,a[o]);return r},v=(r,a)=>k(r,C(a));var j=(r,a,o)=>new Promise((n,s)=>{var i=t=>{try{d(o.next(t))}catch(m){s(m)}},u=t=>{try{d(o.throw(t))}catch(m){s(m)}},d=t=>t.done?n(t.value):Promise.resolve(t.value).then(i,u);d((o=o.apply(r,a)).next())});import{r as l,j as e}from"./index-DEHvOCR0.js";const E="/canary-karting/assets/ck_Academia_transparent-CAHctZQe.png",A="https://script.google.com/macros/s/AKfycbzCC32wee-Siw8wmRFNqXTCgv_4BwqgPbIHw6acT1ZmulfvThxtWP9IyHnYHdFR8-RN/exec",R=()=>{const[r,a]=l.useState({nombre:"",email:"",telefono:"",experiencia:"",tiempos:""}),[o,n]=l.useState("idle"),[s,i]=l.useState(""),[u,d]=l.useState(!1),[t,m]=l.useState(!1),c=p=>{a(v(f({},r),{[p.target.name]:p.target.value}))},y=p=>j(null,null,function*(){p.preventDefault(),n("submitting"),i("");const b=new URLSearchParams(r);b.append("action","submitForm");try{if((yield(yield fetch(A,{method:"POST",body:b})).json()).success)n("success"),i("¡Gracias por apuntarte, pronto nos pondremos en contacto contigo!"),a({nombre:"",email:"",telefono:"",experiencia:"",tiempos:""});else throw new Error("Ha habido un error al enviar la solicitud.")}catch(x){console.error("Error de envío:",x),n("error"),i("Error al enviar la solicitud. Inténtalo de nuevo.")}});return e.jsxs("div",{className:"main-wrapper",children:[e.jsxs("div",{className:"container",children:[e.jsxs("h1",{children:[e.jsx("i",{}),"Academia Canary Karting"]}),e.jsx("div",{style:{display:"flex",justifyContent:"space-around"},children:e.jsx("img",{src:E,alt:"Canary Karting Academia Banner",className:"academia-banner"})}),e.jsx("div",{className:"form-group",children:e.jsx("label",{className:"centered-text",children:"¿Quieres aprender con nosotros?"})}),e.jsxs("form",{id:"registration-form",onSubmit:y,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"nombre",children:"Nombre Completo"}),e.jsx("input",{type:"text",id:"nombre",name:"nombre",required:!0,value:r.nombre,onChange:c})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:"Correo Electrónico"}),e.jsx("input",{type:"email",id:"email",name:"email",required:!0,value:r.email,onChange:c})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"telefono",children:"Teléfono"}),e.jsx("input",{type:"tel",id:"telefono",name:"telefono",value:r.telefono,onChange:c})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"experiencia",children:"¿Tienes experiencia previa en karting? ¿En qué circuitos de la isla has corrido?"}),e.jsx("input",{type:"text",id:"experiencia",name:"experiencia",value:r.experiencia,onChange:c})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"tiempos",children:"¿Cuales son tus mejores tiempos por circuito? "}),e.jsx("small",{children:"Dejar en blanco si no los sabes"}),e.jsx("input",{type:"text",id:"tiempos",name:"tiempos",value:r.tiempos,onChange:c})]}),e.jsx("div",{className:"form-group",children:e.jsx("small",{children:"Pronto nos pondremos en contacto con todos los alumnos para informarles sobre las tarifas y darles más información sobre la academia"})}),e.jsx("button",{type:"submit",id:"submit-button",disabled:o==="submitting",children:o==="submitting"?"Enviando...":"Enviar Solicitud"}),s&&e.jsx("div",{id:"form-message",className:o==="success"?"success":"error",children:s})]})]}),e.jsx("style",{children:`
                /* Inscripcion Specific Styles */
                .main-wrapper {
                    padding-top: 20px;
                    padding-bottom: 50px;
                }

                .banner-container {
                    width: 100%;
                    margin-bottom: 30px;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                    border: 1px solid rgba(59, 130, 246, 0.5);
                }

                .academia-banner {
                    width: 100%;
                    height: auto;
                    display: block;
                    transition: transform 0.5s ease;
                }

                .banner-container:hover .academia-banner {
                    transform: scale(1.05);
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
            `})]})};export{R as default};
