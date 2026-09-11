import{R as l,r as m}from"./index-DEHvOCR0.js";var w;(function(e){e[e.UP=-1]="UP",e[e.DOWN=1]="DOWN"})(w||(w={}));function V(e){var r=getComputedStyle(e).overflowY;return e===document.scrollingElement&&r==="visible"?!0:!(r!=="scroll"&&r!=="auto")}function X(e,r){if(!V(e))return!1;if(r===w.DOWN){var u=e.scrollTop+e.clientHeight;return u<e.scrollHeight}if(r===w.UP)return e.scrollTop>0;throw new Error("unsupported direction")}function H(e,r){return X(e,r)?!0:e.parentElement==null?!1:H(e.parentElement,r)}function U(e,r){r===void 0&&(r={});var u=r.insertAt;if(!(!e||typeof document=="undefined")){var s=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css",u==="top"&&s.firstChild?s.insertBefore(i,s.firstChild):s.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}}var $=`.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px; }

.lds-ellipsis div {
  position: absolute;
  top: 27px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #363636;
  animation-timing-function: cubic-bezier(0, 1, 1, 0); }

.lds-ellipsis div:nth-child(1) {
  left: 6px;
  animation: lds-ellipsis1 0.6s infinite; }

.lds-ellipsis div:nth-child(2) {
  left: 6px;
  animation: lds-ellipsis2 0.6s infinite; }

.lds-ellipsis div:nth-child(3) {
  left: 26px;
  animation: lds-ellipsis2 0.6s infinite; }

.lds-ellipsis div:nth-child(4) {
  left: 45px;
  animation: lds-ellipsis3 0.6s infinite; }

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0); }
  100% {
    transform: scale(1); } }

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1); }
  100% {
    transform: scale(0); } }

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0); }
  100% {
    transform: translate(19px, 0); } }
`;U($);var G=function(){return l.createElement("div",{className:"lds-ellipsis"},l.createElement("div",null),l.createElement("div",null),l.createElement("div",null),l.createElement("div",null))},J=function(){return l.createElement("div",null,l.createElement("p",null,"↧  pull to refresh  ↧"))},K=`.ptr,
.ptr__children {
  height: 100%;
  width: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative; }

.ptr.ptr--fetch-more-treshold-breached .ptr__fetch-more {
  display: block; }

.ptr__fetch-more {
  display: none; }

/**
  * Pull down transition 
  */
.ptr__children,
.ptr__pull-down {
  transition: transform 0.2s cubic-bezier(0, 0, 0.31, 1); }

.ptr__pull-down {
  position: absolute;
  overflow: hidden;
  left: 0;
  right: 0;
  top: 0;
  visibility: hidden; }
  .ptr__pull-down > div {
    display: none; }

.ptr--dragging {
  /**
    * Hide PullMore content is treshold breached
    */
  /**
    * Otherwize, display content
    */ }
  .ptr--dragging.ptr--pull-down-treshold-breached .ptr__pull-down--pull-more {
    display: none; }
  .ptr--dragging .ptr__pull-down--pull-more {
    display: block; }

.ptr--pull-down-treshold-breached {
  /**
    * Force opacity to 1 is pull down trashold breached
    */
  /**
    * And display loader
    */ }
  .ptr--pull-down-treshold-breached .ptr__pull-down {
    opacity: 1 !important; }
  .ptr--pull-down-treshold-breached .ptr__pull-down--loading {
    display: block; }

.ptr__loader {
  margin: 0 auto;
  text-align: center; }
`;U(K);var Z=function(e){var r=e.isPullable,u=r===void 0?!0:r,s=e.canFetchMore,i=s===void 0?!1:s,M=e.onRefresh,y=e.onFetchMore,R=e.refreshingContent,k=R===void 0?l.createElement(G,null):R,N=e.pullingContent,z=N===void 0?l.createElement(J,null):N,L=e.children,P=e.pullDownThreshold,x=P===void 0?67:P,A=e.fetchMoreThreshold,T=A===void 0?100:A,D=e.maxPullDownDistance,C=D===void 0?95:D,S=e.resistance,O=S===void 0?1:S,W=e.backgroundColor,Y=e.className,j=Y===void 0?"":Y,o=m.useRef(null),t=m.useRef(null),c=m.useRef(null),q=m.useRef(null),E=!1,g=!1,p=!1,f=0,h=0;m.useEffect(function(){if(!(!u||!t||!t.current)){var n=t.current;return n.addEventListener("touchstart",b,{passive:!0}),n.addEventListener("mousedown",b),n.addEventListener("touchmove",_,{passive:!1}),n.addEventListener("mousemove",_),window.addEventListener("scroll",B),n.addEventListener("touchend",v),n.addEventListener("mouseup",v),document.body.addEventListener("mouseleave",v),function(){n.removeEventListener("touchstart",b),n.removeEventListener("mousedown",b),n.removeEventListener("touchmove",_),n.removeEventListener("mousemove",_),window.removeEventListener("scroll",B),n.removeEventListener("touchend",v),n.removeEventListener("mouseup",v),document.body.removeEventListener("mouseleave",v)}}},[L,u,M,x,C,i,T]),m.useEffect(function(){var n;if(!((n=o)===null||n===void 0)&&n.current){var a=o.current.classList.contains("ptr--fetch-more-treshold-breached");a||i&&F()<T&&y&&(o.current.classList.add("ptr--fetch-more-treshold-breached"),g=!0,y().then(d).catch(d))}},[i,L]);var F=function(){if(!t||!t.current)return-1;var n=window.scrollY,a=t.current.scrollHeight;return a-n-window.innerHeight},d=function(){requestAnimationFrame(function(){t.current&&(t.current.style.overflowX="hidden",t.current.style.overflowY="auto",t.current.style.transform="unset"),c.current&&(c.current.style.opacity="0"),o.current&&(o.current.classList.remove("ptr--pull-down-treshold-breached"),o.current.classList.remove("ptr--dragging"),o.current.classList.remove("ptr--fetch-more-treshold-breached")),E&&(E=!1),g&&(g=!1)})},b=function(n){p=!1,n instanceof MouseEvent&&(f=n.pageY),window.TouchEvent&&n instanceof TouchEvent&&(f=n.touches[0].pageY),h=f,!(n.type==="touchstart"&&H(n.target,w.UP))&&(t.current.getBoundingClientRect().top<0||(p=!0))},_=function(n){if(p){if(window.TouchEvent&&n instanceof TouchEvent?h=n.touches[0].pageY:h=n.pageY,o.current.classList.add("ptr--dragging"),h<f){p=!1;return}n.cancelable&&n.preventDefault();var a=Math.min((h-f)/O,C);a>=x&&(p=!0,E=!0,o.current.classList.remove("ptr--dragging"),o.current.classList.add("ptr--pull-down-treshold-breached")),!(a>=C)&&(c.current.style.opacity=(a/65).toString(),t.current.style.overflow="visible",t.current.style.transform="translate(0px, "+a+"px)",c.current.style.visibility="visible")}},B=function(n){g||i&&F()<T&&y&&(g=!0,o.current.classList.add("ptr--fetch-more-treshold-breached"),y().then(d).catch(d))},v=function(){if(p=!1,f=0,h=0,!E){c.current&&(c.current.style.visibility="hidden"),d();return}t.current&&(t.current.style.overflow="visible",t.current.style.transform="translate(0px, "+x+"px)"),M().then(d).catch(d)};return l.createElement("div",{className:"ptr "+j,style:{backgroundColor:W},ref:o},l.createElement("div",{className:"ptr__pull-down",ref:c},l.createElement("div",{className:"ptr__loader ptr__pull-down--loading"},k),l.createElement("div",{className:"ptr__pull-down--pull-more"},z)),l.createElement("div",{className:"ptr__children",ref:t},L,l.createElement("div",{className:"ptr__fetch-more",ref:q},l.createElement("div",{className:"ptr__loader ptr__fetch-more--loading"},k))))};export{Z as P};
