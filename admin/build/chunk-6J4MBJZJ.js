import{$ as xe,O as St,S as $,Z as It,a as L,aa as _t,b as T,c as W,ca as J,e as G,f as j,i as vt,j as wt,q as bt,r as yt}from"./chunk-52MGVJMI.js";var Ct=L((Q,ze)=>{(function(t,e){typeof Q=="object"&&typeof ze!="undefined"?e(Q,W()):typeof define=="function"&&define.amd?define(["exports","react"],e):(t=typeof globalThis!="undefined"?globalThis:t||self,e(t.ReactErrorBoundary={},t.React))})(Q,function(t,e){"use strict";function r(g){if(g&&g.__esModule)return g;var v=Object.create(null);return g&&Object.keys(g).forEach(function(w){if(w!=="default"){var d=Object.getOwnPropertyDescriptor(g,w);Object.defineProperty(v,w,d.get?d:{enumerable:!0,get:function(){return g[w]}})}}),v.default=g,Object.freeze(v)}var n=r(e);function o(g,v){return o=Object.setPrototypeOf||function(d,f){return d.__proto__=f,d},o(g,v)}function s(g,v){g.prototype=Object.create(v.prototype),g.prototype.constructor=g,o(g,v)}var c=function(v,w){return v===void 0&&(v=[]),w===void 0&&(w=[]),v.length!==w.length||v.some(function(d,f){return!Object.is(d,w[f])})},l={error:null},S=function(g){s(v,g);function v(){for(var d,f=arguments.length,i=new Array(f),u=0;u<f;u++)i[u]=arguments[u];return d=g.call.apply(g,[this].concat(i))||this,d.state=l,d.updatedWithError=!1,d.resetErrorBoundary=function(){for(var m,b=arguments.length,a=new Array(b),h=0;h<b;h++)a[h]=arguments[h];d.props.onReset==null||(m=d.props).onReset.apply(m,a),d.reset()},d}v.getDerivedStateFromError=function(f){return{error:f}};var w=v.prototype;return w.reset=function(){this.updatedWithError=!1,this.setState(l)},w.componentDidCatch=function(f,i){var u,m;(u=(m=this.props).onError)==null||u.call(m,f,i)},w.componentDidMount=function(){var f=this.state.error;f!==null&&(this.updatedWithError=!0)},w.componentDidUpdate=function(f){var i=this.state.error,u=this.props.resetKeys;if(i!==null&&!this.updatedWithError){this.updatedWithError=!0;return}if(i!==null&&c(f.resetKeys,u)){var m,b;(m=(b=this.props).onResetKeysChange)==null||m.call(b,f.resetKeys,u),this.reset()}},w.render=function(){var f=this.state.error,i=this.props,u=i.fallbackRender,m=i.FallbackComponent,b=i.fallback;if(f!==null){var a={error:f,resetErrorBoundary:this.resetErrorBoundary};if(n.isValidElement(b))return b;if(typeof u=="function")return u(a);if(m)return n.createElement(m,a);throw new Error("react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop")}return this.props.children},v}(n.Component);function I(g,v){var w=function(i){return n.createElement(S,v,n.createElement(g,i))},d=g.displayName||g.name||"Unknown";return w.displayName="withErrorBoundary("+d+")",w}function _(g){var v=n.useState(null),w=v[0],d=v[1];if(g!=null)throw g;if(w!=null)throw w;return d}t.ErrorBoundary=S,t.useErrorHandler=_,t.withErrorBoundary=I,Object.defineProperty(t,"__esModule",{value:!0})})});var Me=L(ee=>{"use strict";var xt=j(),zt=G();Object.defineProperty(ee,"__esModule",{value:!0});ee.default=void 0;var Mt=zt(W()),Tt=xt($()),Rt=(0,Tt.default)(Mt.createElement("path",{d:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"}),"Launch");ee.default=Rt});var De=L((Tr,Ne)=>{"use strict";var Oe=function(){function t(e,r){var n=[],o=!0,s=!1,c=void 0;try{for(var l=e[Symbol.iterator](),S;!(o=(S=l.next()).done)&&(n.push(S.value),!(r&&n.length===r));o=!0);}catch(I){s=!0,c=I}finally{try{!o&&l.return&&l.return()}finally{if(s)throw c}}return n}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),ce=function(){function t(e,r){for(var n=0;n<r.length;n++){var o=r[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function N(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}else return Array.from(t)}function de(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var D=Object,fe=["black","red","green","yellow","blue","magenta","cyan","lightGray","","default"],he=["darkGray","lightRed","lightGreen","lightYellow","lightBlue","lightMagenta","lightCyan","white",""],me=["","bright","dim","italic","underline","","","inverse"],Ot={red:"lightRed",green:"lightGreen",yellow:"lightYellow",blue:"lightBlue",magenta:"lightMagenta",cyan:"lightCyan",black:"darkGray",lightGray:"white"},Et={0:"style",2:"unstyle",3:"color",9:"colorLight",4:"bgColor",10:"bgColorLight"},Wt={color:fe,colorLight:he,bgColor:fe,bgColorLight:he,style:me,unstyle:me},Ee=function(e){for(var r in e)e[r]||delete e[r];return D.keys(e).length===0?void 0:e},te=function(){function t(e,r,n){de(this,t),this.background=e,this.name=r,this.brightness=n}return ce(t,[{key:"defaultBrightness",value:function(r){return new t(this.background,this.name,this.brightness||r)}},{key:"css",value:function(r){var n=r?this.inverse:this,o=n.brightness===M.bright&&Ot[n.name]||n.name,s=n.background?"background:":"color:",c=K.rgb[o],l=this.brightness===M.dim?.5:1;return c?s+"rgba("+[].concat(N(c),[l]).join(",")+");":!n.background&&l<1?"color:rgba(0,0,0,0.5);":""}},{key:"inverse",get:function(){return new t(!this.background,this.name||(this.background?"black":"white"),this.brightness)}},{key:"clean",get:function(){return Ee({name:this.name==="default"?"":this.name,bright:this.brightness===M.bright,dim:this.brightness===M.dim})}}]),t}(),M=function(){function t(e){de(this,t),e!==void 0&&(this.value=Number(e))}return ce(t,[{key:"type",get:function(){return Et[Math.floor(this.value/10)]}},{key:"subtype",get:function(){return Wt[this.type][this.value%10]}},{key:"str",get:function(){return this.value?"["+this.value+"m":""}},{key:"isBrightness",get:function(){return this.value===t.noBrightness||this.value===t.bright||this.value===t.dim}}],[{key:"str",value:function(r){return new t(r).str}}]),t}();D.assign(M,{reset:0,bright:1,dim:2,inverse:7,noBrightness:22,noItalic:23,noUnderline:24,noInverse:27,noColor:39,noBgColor:49});var Lt=function(e,r,n){return e.split(r).join(n)},At=function(e){return e.replace(/(\u001b\[(1|2)m)/g,"[22m$1")},kt=function(e){return e.replace(/\u001b\[22m(\u001b\[(1|2)m)/g,"$1")},Nt=function(e,r,n){var o=M.str(r),s=M.str(n);return String(e).split(`
`).map(function(c){return At(o+Lt(kt(c),s,o)+s)}).join(`
`)},We=function(e,r){return e+r.charAt(0).toUpperCase()+r.slice(1)},Le=function(){return[].concat(N(fe.map(function(t,e){return t?[[t,30+e,M.noColor],[We("bg",t),40+e,M.noBgColor]]:[]})),N(he.map(function(t,e){return t?[[t,90+e,M.noColor],[We("bg",t),100+e,M.noBgColor]]:[]})),N(["","BrightRed","BrightGreen","BrightYellow","BrightBlue","BrightMagenta","BrightCyan"].map(function(t,e){return t?[["bg"+t,100+e,M.noBgColor]]:[]})),N(me.map(function(t,e){return t?[[t,e,t==="bright"||t==="dim"?M.noBrightness:20+e]]:[]}))).reduce(function(t,e){return t.concat(e)})}(),Dt=function t(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e;return Le.reduce(function(n,o){var s=Oe(o,3),c=s[0],l=s[1],S=s[2];return D.defineProperty(n,c,{get:function(){return t(function(_){return r(Nt(_,l,S))})}})},e)},F=0,Ae=1,ke=2;function Ft(t){for(var e=F,r="",n="",o="",s=[],c=[],l=0,S=t.length;l<S;l++){var I=t[l];switch(r+=I,e){case F:I===""?(e=Ae,r=I):n+=I;break;case Ae:I==="["?(e=ke,o="",s=[]):(e=F,n+=r);break;case ke:if(I>="0"&&I<="9")o+=I;else if(I===";")s.push(new M(o)),o="";else if(I==="m"){o=o||"0",s.push(new M(o));var _=!0,g=!1,v=void 0;try{for(var w=s[Symbol.iterator](),d;!(_=(d=w.next()).done);_=!0){var f=d.value;c.push({text:n,code:f}),n=""}}catch(i){g=!0,v=i}finally{try{!_&&w.return&&w.return()}finally{if(g)throw v}}e=F}else e=F,n+=r}}return e!==F&&(n+=r),n&&c.push({text:n,code:new M}),c}var K=function(){function t(e){de(this,t),this.spans=e?Ft(e):[]}return ce(t,[{key:Symbol.iterator,value:function(){return this.spans[Symbol.iterator]()}},{key:"str",get:function(){return this.spans.reduce(function(r,n){return r+n.text+n.code.str},"")}},{key:"parsed",get:function(){var r=void 0,n=void 0,o=void 0,s=void 0;function c(){r=new te,n=new te(!0),o=void 0,s=new Set}return c(),D.assign(new t,{spans:this.spans.map(function(l){var S=l.code,I=s.has("inverse"),_=s.has("underline")?"text-decoration: underline;":"",g=s.has("italic")?"font-style: italic;":"",v=o===M.bright?"font-weight: bold;":"",w=r.defaultBrightness(o),d=D.assign({css:v+g+_+w.css(I)+n.css(I)},Ee({bold:!!v,color:w.clean,bgColor:n.clean}),l),f=!0,i=!1,u=void 0;try{for(var m=s[Symbol.iterator](),b;!(f=(b=m.next()).done);f=!0){var a=b.value;d[a]=!0}}catch(h){i=!0,u=h}finally{try{!f&&m.return&&m.return()}finally{if(i)throw u}}if(S.isBrightness)o=S.value;else if(l.code.value!==void 0)if(l.code.value===M.reset)c();else switch(l.code.type){case"color":case"colorLight":r=new te(!1,S.subtype);break;case"bgColor":case"bgColorLight":n=new te(!0,S.subtype);break;case"style":s.add(S.subtype);break;case"unstyle":s.delete(S.subtype);break}return d}).filter(function(l){return l.text.length>0})})}},{key:"asChromeConsoleLogArguments",get:function(){var r=this.parsed.spans;return[r.map(function(n){return"%c"+n.text}).join("")].concat(N(r.map(function(n){return n.css})))}},{key:"browserConsoleArguments",get:function(){return this.asChromeConsoleLogArguments}}],[{key:"parse",value:function(r){return new t(r).parsed}},{key:"strip",value:function(r){return r.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g,"")}},{key:"nice",get:function(){return t.names.forEach(function(r){r in String.prototype||D.defineProperty(String.prototype,r,{get:function(){return t[r](this)}})}),t}},{key:"ansicolor",get:function(){return t}}]),t}();Dt(K,function(t){return t});K.names=Le.map(function(t){var e=Oe(t,1),r=e[0];return r});K.rgb={black:[0,0,0],darkGray:[100,100,100],lightGray:[200,200,200],white:[255,255,255],red:[204,0,0],lightRed:[255,51,0],green:[0,204,0],lightGreen:[51,204,51],yellow:[204,102,0],lightYellow:[255,153,51],blue:[0,0,255],lightBlue:[26,140,255],magenta:[204,0,204],lightMagenta:[255,0,255],cyan:[0,153,255],lightCyan:[0,204,255]};Ne.exports=K});var Fe=L(re=>{"use strict";var Pt=j(),Bt=G();Object.defineProperty(re,"__esModule",{value:!0});re.default=void 0;var Ht=Bt(W()),qt=Pt($()),Ut=(0,qt.default)(Ht.createElement("path",{d:"M8 5v14l11-7z"}),"PlayArrow");re.default=Ut});var Pe=L(ne=>{"use strict";var Vt=j(),Gt=G();Object.defineProperty(ne,"__esModule",{value:!0});ne.default=void 0;var jt=Gt(W()),$t=Vt($()),Kt=(0,$t.default)(jt.createElement("path",{d:"M6 19h4V5H6v14zm8-14v14h4V5h-4z"}),"Pause");ne.default=Kt});var Be=L(oe=>{"use strict";var Yt=j(),Zt=G();Object.defineProperty(oe,"__esModule",{value:!0});oe.default=void 0;var Xt=Zt(W()),Jt=Yt($()),Qt=(0,Jt.default)(Xt.createElement("path",{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"}),"Lock");oe.default=Qt});var He=L(ie=>{"use strict";var er=j(),tr=G();Object.defineProperty(ie,"__esModule",{value:!0});ie.default=void 0;var rr=tr(W()),nr=er($()),or=(0,nr.default)(rr.createElement("path",{d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"}),"CloudDownload");ie.default=or});var tt=T(Me()),x=T(W());var Te=T(W());function Re(t){let e=J();Te.default.useEffect(()=>(e.addPushCallback(t),()=>{e.removePushCallback(t)}),[e,t])}var y=T(De()),Rr=y.default.nice,Or=y.default.parse,Er=y.default.strip,Wr=y.default.ansicolor,Lr=y.default.black,Ar=y.default.bgBlack,kr=y.default.red,Nr=y.default.bgRed,Dr=y.default.green,Fr=y.default.bgGreen,Pr=y.default.yellow,Br=y.default.bgYellow,Hr=y.default.blue,qr=y.default.bgBlue,Ur=y.default.magenta,Vr=y.default.bgMagenta,Gr=y.default.cyan,jr=y.default.bgCyan,$r=y.default.lightGray,Kr=y.default.bgLightGray,Yr=y.default.bgDefault,Zr=y.default.darkGray,Xr=y.default.bgDarkGray,Jr=y.default.lightRed,Qr=y.default.bgLightRed,en=y.default.lightGreen,tn=y.default.bgLightGreen,rn=y.default.lightYellow,nn=y.default.bgLightYellow,on=y.default.lightBlue,an=y.default.bgLightBlue,sn=y.default.lightMagenta,ln=y.default.bgLightMagenta,un=y.default.lightCyan,cn=y.default.bgLightCyan,dn=y.default.white,fn=y.default.bgWhite,hn=y.default.bgBrightRed,mn=y.default.bgBrightGreen,gn=y.default.bgBrightYellow,pn=y.default.bgBrightBlue,vn=y.default.bgBrightMagenta,wn=y.default.bgBrightCyan,bn=y.default.bright,yn=y.default.dim,Sn=y.default.italic,In=y.default.underline,_n=y.default.inverse,Cn=y.default.names,xn=y.default.rgb,Y=y.default;var rt=T(wt()),nt=T(Fe()),ot=T(Pe()),ye=T(yt()),A=T(bt()),it=T(_t()),at=T(Be()),st=T(He()),le=T(It()),lt=T(vt()),U=T(St());function Z(t,e){return Z=Object.setPrototypeOf||function(n,o){return n.__proto__=o,n},Z(t,e)}function ge(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,Z(t,e)}function P(t){if(t===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var qe=Number.isNaN||function(e){return typeof e=="number"&&e!==e};function ir(t,e){return!!(t===e||qe(t)&&qe(e))}function ar(t,e){if(t.length!==e.length)return!1;for(var r=0;r<t.length;r++)if(!ir(t[r],e[r]))return!1;return!0}function sr(t,e){e===void 0&&(e=ar);var r,n=[],o,s=!1;function c(){for(var l=[],S=0;S<arguments.length;S++)l[S]=arguments[S];return s&&r===this&&e(l,n)||(o=t.apply(this,l),s=!0,r=this,n=l),o}return c}var ae=sr;var B=T(W());var lr=typeof performance=="object"&&typeof performance.now=="function",Ue=lr?function(){return performance.now()}:function(){return Date.now()};function Ve(t){cancelAnimationFrame(t.id)}function ur(t,e){var r=Ue();function n(){Ue()-r>=e?t.call(null):o.id=requestAnimationFrame(n)}var o={id:requestAnimationFrame(n)};return o}var H=null;function Ge(t){if(t===void 0&&(t=!1),H===null||t){var e=document.createElement("div"),r=e.style;r.width="50px",r.height="50px",r.overflow="scroll",r.direction="rtl";var n=document.createElement("div"),o=n.style;return o.width="100px",o.height="100px",e.appendChild(n),document.body.appendChild(e),e.scrollLeft>0?H="positive-descending":(e.scrollLeft=1,e.scrollLeft===0?H="negative":H="positive-ascending"),document.body.removeChild(e),H}return H}var cr=150,dr=function(e,r){return e};function fr(t){var e,r,n=t.getItemOffset,o=t.getEstimatedTotalSize,s=t.getItemSize,c=t.getOffsetForIndexAndAlignment,l=t.getStartIndexForOffset,S=t.getStopIndexForStartIndex,I=t.initInstanceProps,_=t.shouldResetStyleCacheOnItemSizeChange,g=t.validateProps;return r=e=function(v){ge(w,v);function w(f){var i;return i=v.call(this,f)||this,i._instanceProps=I(i.props,P(P(i))),i._outerRef=void 0,i._resetIsScrollingTimeoutId=null,i.state={instance:P(P(i)),isScrolling:!1,scrollDirection:"forward",scrollOffset:typeof i.props.initialScrollOffset=="number"?i.props.initialScrollOffset:0,scrollUpdateWasRequested:!1},i._callOnItemsRendered=void 0,i._callOnItemsRendered=ae(function(u,m,b,a){return i.props.onItemsRendered({overscanStartIndex:u,overscanStopIndex:m,visibleStartIndex:b,visibleStopIndex:a})}),i._callOnScroll=void 0,i._callOnScroll=ae(function(u,m,b){return i.props.onScroll({scrollDirection:u,scrollOffset:m,scrollUpdateWasRequested:b})}),i._getItemStyle=void 0,i._getItemStyle=function(u){var m=i.props,b=m.direction,a=m.itemSize,h=m.layout,p=i._getItemStyleCache(_&&a,_&&h,_&&b),C;if(p.hasOwnProperty(u))C=p[u];else{var z=n(i.props,u,i._instanceProps),R=s(i.props,u,i._instanceProps),E=b==="horizontal"||h==="horizontal",k=b==="rtl",X=E?z:0;p[u]=C={position:"absolute",left:k?void 0:X,right:k?X:void 0,top:E?0:z,height:E?"100%":R,width:E?R:"100%"}}return C},i._getItemStyleCache=void 0,i._getItemStyleCache=ae(function(u,m,b){return{}}),i._onScrollHorizontal=function(u){var m=u.currentTarget,b=m.clientWidth,a=m.scrollLeft,h=m.scrollWidth;i.setState(function(p){if(p.scrollOffset===a)return null;var C=i.props.direction,z=a;if(C==="rtl")switch(Ge()){case"negative":z=-a;break;case"positive-descending":z=h-b-a;break}return z=Math.max(0,Math.min(z,h-b)),{isScrolling:!0,scrollDirection:p.scrollOffset<a?"forward":"backward",scrollOffset:z,scrollUpdateWasRequested:!1}},i._resetIsScrollingDebounced)},i._onScrollVertical=function(u){var m=u.currentTarget,b=m.clientHeight,a=m.scrollHeight,h=m.scrollTop;i.setState(function(p){if(p.scrollOffset===h)return null;var C=Math.max(0,Math.min(h,a-b));return{isScrolling:!0,scrollDirection:p.scrollOffset<C?"forward":"backward",scrollOffset:C,scrollUpdateWasRequested:!1}},i._resetIsScrollingDebounced)},i._outerRefSetter=function(u){var m=i.props.outerRef;i._outerRef=u,typeof m=="function"?m(u):m!=null&&typeof m=="object"&&m.hasOwnProperty("current")&&(m.current=u)},i._resetIsScrollingDebounced=function(){i._resetIsScrollingTimeoutId!==null&&Ve(i._resetIsScrollingTimeoutId),i._resetIsScrollingTimeoutId=ur(i._resetIsScrolling,cr)},i._resetIsScrolling=function(){i._resetIsScrollingTimeoutId=null,i.setState({isScrolling:!1},function(){i._getItemStyleCache(-1,null)})},i}w.getDerivedStateFromProps=function(i,u){return hr(i,u),g(i),null};var d=w.prototype;return d.scrollTo=function(i){i=Math.max(0,i),this.setState(function(u){return u.scrollOffset===i?null:{scrollDirection:u.scrollOffset<i?"forward":"backward",scrollOffset:i,scrollUpdateWasRequested:!0}},this._resetIsScrollingDebounced)},d.scrollToItem=function(i,u){u===void 0&&(u="auto");var m=this.props.itemCount,b=this.state.scrollOffset;i=Math.max(0,Math.min(i,m-1)),this.scrollTo(c(this.props,i,u,b,this._instanceProps))},d.componentDidMount=function(){var i=this.props,u=i.direction,m=i.initialScrollOffset,b=i.layout;if(typeof m=="number"&&this._outerRef!=null){var a=this._outerRef;u==="horizontal"||b==="horizontal"?a.scrollLeft=m:a.scrollTop=m}this._callPropsCallbacks()},d.componentDidUpdate=function(){var i=this.props,u=i.direction,m=i.layout,b=this.state,a=b.scrollOffset,h=b.scrollUpdateWasRequested;if(h&&this._outerRef!=null){var p=this._outerRef;if(u==="horizontal"||m==="horizontal")if(u==="rtl")switch(Ge()){case"negative":p.scrollLeft=-a;break;case"positive-ascending":p.scrollLeft=a;break;default:var C=p.clientWidth,z=p.scrollWidth;p.scrollLeft=z-C-a;break}else p.scrollLeft=a;else p.scrollTop=a}this._callPropsCallbacks()},d.componentWillUnmount=function(){this._resetIsScrollingTimeoutId!==null&&Ve(this._resetIsScrollingTimeoutId)},d.render=function(){var i=this.props,u=i.children,m=i.className,b=i.direction,a=i.height,h=i.innerRef,p=i.innerElementType,C=i.innerTagName,z=i.itemCount,R=i.itemData,E=i.itemKey,k=E===void 0?dr:E,X=i.layout,ut=i.outerElementType,ct=i.outerTagName,dt=i.style,ft=i.useIsScrolling,ht=i.width,Se=this.state.isScrolling,ue=b==="horizontal"||X==="horizontal",mt=ue?this._onScrollHorizontal:this._onScrollVertical,Ie=this._getRangeToRender(),gt=Ie[0],pt=Ie[1],_e=[];if(z>0)for(var V=gt;V<=pt;V++)_e.push((0,B.createElement)(u,{data:R,key:k(V,R),index:V,isScrolling:ft?Se:void 0,style:this._getItemStyle(V)}));var Ce=o(this.props,this._instanceProps);return(0,B.createElement)(ut||ct||"div",{className:m,onScroll:mt,ref:this._outerRefSetter,style:xe({position:"relative",height:a,width:ht,overflow:"auto",WebkitOverflowScrolling:"touch",willChange:"transform",direction:b},dt)},(0,B.createElement)(p||C||"div",{children:_e,ref:h,style:{height:ue?"100%":Ce,pointerEvents:Se?"none":void 0,width:ue?Ce:"100%"}}))},d._callPropsCallbacks=function(){if(typeof this.props.onItemsRendered=="function"){var i=this.props.itemCount;if(i>0){var u=this._getRangeToRender(),m=u[0],b=u[1],a=u[2],h=u[3];this._callOnItemsRendered(m,b,a,h)}}if(typeof this.props.onScroll=="function"){var p=this.state,C=p.scrollDirection,z=p.scrollOffset,R=p.scrollUpdateWasRequested;this._callOnScroll(C,z,R)}},d._getRangeToRender=function(){var i=this.props,u=i.itemCount,m=i.overscanCount,b=this.state,a=b.isScrolling,h=b.scrollDirection,p=b.scrollOffset;if(u===0)return[0,0,0,0];var C=l(this.props,p,this._instanceProps),z=S(this.props,C,p,this._instanceProps),R=!a||h==="backward"?Math.max(1,m):1,E=!a||h==="forward"?Math.max(1,m):1;return[Math.max(0,C-R),Math.max(0,Math.min(u-1,z+E)),C,z]},w}(B.PureComponent),e.defaultProps={direction:"ltr",itemData:void 0,layout:"vertical",overscanCount:2,useIsScrolling:!1},r}var hr=function(e,r){var n=e.children,o=e.direction,s=e.height,c=e.layout,l=e.innerTagName,S=e.outerTagName,I=e.width,_=r.instance;if(!1){var g;switch(o){case"horizontal":case"vertical":case"ltr":case"rtl":default:}switch(c){case"horizontal":case"vertical":default:}}},mr=50,q=function(e,r,n){var o=e,s=o.itemSize,c=n.itemMetadataMap,l=n.lastMeasuredIndex;if(r>l){var S=0;if(l>=0){var I=c[l];S=I.offset+I.size}for(var _=l+1;_<=r;_++){var g=s(_);c[_]={offset:S,size:g},S+=g}n.lastMeasuredIndex=r}return c[r]},gr=function(e,r,n){var o=r.itemMetadataMap,s=r.lastMeasuredIndex,c=s>0?o[s].offset:0;return c>=n?je(e,r,s,0,n):pr(e,r,Math.max(0,s),n)},je=function(e,r,n,o,s){for(;o<=n;){var c=o+Math.floor((n-o)/2),l=q(e,c,r).offset;if(l===s)return c;l<s?o=c+1:l>s&&(n=c-1)}return o>0?o-1:0},pr=function(e,r,n,o){for(var s=e.itemCount,c=1;n<s&&q(e,n,r).offset<o;)n+=c,c*=2;return je(e,r,Math.min(n,s-1),Math.floor(n/2),o)},$e=function(e,r){var n=e.itemCount,o=r.itemMetadataMap,s=r.estimatedItemSize,c=r.lastMeasuredIndex,l=0;if(c>=n&&(c=n-1),c>=0){var S=o[c];l=S.offset+S.size}var I=n-c-1,_=I*s;return l+_},Ke=fr({getItemOffset:function(e,r,n){return q(e,r,n).offset},getItemSize:function(e,r,n){return n.itemMetadataMap[r].size},getEstimatedTotalSize:$e,getOffsetForIndexAndAlignment:function(e,r,n,o,s){var c=e.direction,l=e.height,S=e.layout,I=e.width,_=c==="horizontal"||S==="horizontal",g=_?I:l,v=q(e,r,s),w=$e(e,s),d=Math.max(0,Math.min(w-g,v.offset)),f=Math.max(0,v.offset-g+v.size);switch(n==="smart"&&(o>=f-g&&o<=d+g?n="auto":n="center"),n){case"start":return d;case"end":return f;case"center":return Math.round(f+(d-f)/2);case"auto":default:return o>=f&&o<=d?o:o<f?f:d}},getStartIndexForOffset:function(e,r,n){return gr(e,n,r)},getStopIndexForStartIndex:function(e,r,n,o){for(var s=e.direction,c=e.height,l=e.itemCount,S=e.layout,I=e.width,_=s==="horizontal"||S==="horizontal",g=_?I:c,v=q(e,r,o),w=n+g,d=v.offset+v.size,f=r;f<l-1&&d<w;)f++,d+=q(e,f,o).size;return f},initInstanceProps:function(e,r){var n=e,o=n.estimatedItemSize,s={itemMetadataMap:{},estimatedItemSize:o||mr,lastMeasuredIndex:-1};return r.resetAfterIndex=function(c,l){l===void 0&&(l=!0),s.lastMeasuredIndex=Math.min(s.lastMeasuredIndex,c-1),r._getItemStyleCache(-1),l&&r.forceUpdate()},s},shouldResetStyleCacheOnItemSizeChange:!1,validateProps:function(e){var r=e.itemSize}});var se=T(W()),vr=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},wr=function(){function t(e,r){for(var n=0;n<r.length;n++){var o=r[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),br=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},yr=function(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},Ye=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t},Sr=function(){function t(e,r){var n=[],o=!0,s=!1,c=void 0;try{for(var l=e[Symbol.iterator](),S;!(o=(S=l.next()).done)&&(n.push(S.value),!(r&&n.length===r));o=!0);}catch(I){s=!0,c=I}finally{try{!o&&l.return&&l.return()}finally{if(s)throw c}}return n}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),O=void 0;typeof window!="undefined"?O=window:typeof self!="undefined"?O=self:O=global;var pe=null,ve=null,Ze=20,we=O.clearTimeout,Xe=O.setTimeout,be=O.cancelAnimationFrame||O.mozCancelAnimationFrame||O.webkitCancelAnimationFrame,Je=O.requestAnimationFrame||O.mozRequestAnimationFrame||O.webkitRequestAnimationFrame;be==null||Je==null?(pe=we,ve=function(e){return Xe(e,Ze)}):(pe=function(e){var r=Sr(e,2),n=r[0],o=r[1];be(n),we(o)},ve=function(e){var r=Je(function(){we(n),e()}),n=Xe(function(){be(r),e()},Ze);return[r,n]});function Ir(t){var e=void 0,r=void 0,n=void 0,o=void 0,s=void 0,c=void 0,l=void 0,S=typeof document!="undefined"&&document.attachEvent;if(!S){c=function(a){var h=a.__resizeTriggers__,p=h.firstElementChild,C=h.lastElementChild,z=p.firstElementChild;C.scrollLeft=C.scrollWidth,C.scrollTop=C.scrollHeight,z.style.width=p.offsetWidth+1+"px",z.style.height=p.offsetHeight+1+"px",p.scrollLeft=p.scrollWidth,p.scrollTop=p.scrollHeight},s=function(a){return a.offsetWidth!==a.__resizeLast__.width||a.offsetHeight!==a.__resizeLast__.height},l=function(a){if(!(a.target.className&&typeof a.target.className.indexOf=="function"&&a.target.className.indexOf("contract-trigger")<0&&a.target.className.indexOf("expand-trigger")<0)){var h=this;c(this),this.__resizeRAF__&&pe(this.__resizeRAF__),this.__resizeRAF__=ve(function(){s(h)&&(h.__resizeLast__.width=h.offsetWidth,h.__resizeLast__.height=h.offsetHeight,h.__resizeListeners__.forEach(function(z){z.call(h,a)}))})}};var I=!1,_="";n="animationstart";var g="Webkit Moz O ms".split(" "),v="webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "),w="";{var d=document.createElement("fakeelement");if(d.style.animationName!==void 0&&(I=!0),I===!1){for(var f=0;f<g.length;f++)if(d.style[g[f]+"AnimationName"]!==void 0){w=g[f],_="-"+w.toLowerCase()+"-",n=v[f],I=!0;break}}}r="resizeanim",e="@"+_+"keyframes "+r+" { from { opacity: 0; } to { opacity: 0; } } ",o=_+"animation: 1ms "+r+"; "}var i=function(a){if(!a.getElementById("detectElementResize")){var h=(e||"")+".resize-triggers { "+(o||"")+'visibility: hidden; opacity: 0; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',p=a.head||a.getElementsByTagName("head")[0],C=a.createElement("style");C.id="detectElementResize",C.type="text/css",t!=null&&C.setAttribute("nonce",t),C.styleSheet?C.styleSheet.cssText=h:C.appendChild(a.createTextNode(h)),p.appendChild(C)}},u=function(a,h){if(S)a.attachEvent("onresize",h);else{if(!a.__resizeTriggers__){var p=a.ownerDocument,C=O.getComputedStyle(a);C&&C.position==="static"&&(a.style.position="relative"),i(p),a.__resizeLast__={},a.__resizeListeners__=[],(a.__resizeTriggers__=p.createElement("div")).className="resize-triggers";var z=p.createElement("div");z.className="expand-trigger",z.appendChild(p.createElement("div"));var R=p.createElement("div");R.className="contract-trigger",a.__resizeTriggers__.appendChild(z),a.__resizeTriggers__.appendChild(R),a.appendChild(a.__resizeTriggers__),c(a),a.addEventListener("scroll",l,!0),n&&(a.__resizeTriggers__.__animationListener__=function(k){k.animationName===r&&c(a)},a.__resizeTriggers__.addEventListener(n,a.__resizeTriggers__.__animationListener__))}a.__resizeListeners__.push(h)}},m=function(a,h){if(S)a.detachEvent("onresize",h);else if(a.__resizeListeners__.splice(a.__resizeListeners__.indexOf(h),1),!a.__resizeListeners__.length){a.removeEventListener("scroll",l,!0),a.__resizeTriggers__.__animationListener__&&(a.__resizeTriggers__.removeEventListener(n,a.__resizeTriggers__.__animationListener__),a.__resizeTriggers__.__animationListener__=null);try{a.__resizeTriggers__=!a.removeChild(a.__resizeTriggers__)}catch(p){}}};return{addResizeListener:u,removeResizeListener:m}}var Qe=function(t){yr(e,t);function e(){var r,n,o,s;vr(this,e);for(var c=arguments.length,l=Array(c),S=0;S<c;S++)l[S]=arguments[S];return s=(n=(o=Ye(this,(r=e.__proto__||Object.getPrototypeOf(e)).call.apply(r,[this].concat(l))),o),o.state={height:o.props.defaultHeight||0,width:o.props.defaultWidth||0},o._onResize=function(){var I=o.props,_=I.disableHeight,g=I.disableWidth,v=I.onResize;if(o._parentNode){var w=o._parentNode.offsetHeight||0,d=o._parentNode.offsetWidth||0,f=window.getComputedStyle(o._parentNode)||{},i=parseInt(f.paddingLeft,10)||0,u=parseInt(f.paddingRight,10)||0,m=parseInt(f.paddingTop,10)||0,b=parseInt(f.paddingBottom,10)||0,a=w-m-b,h=d-i-u;(!_&&o.state.height!==a||!g&&o.state.width!==h)&&(o.setState({height:w-m-b,width:d-i-u}),v({height:w,width:d}))}},o._setRef=function(I){o._autoSizer=I},n),Ye(o,s)}return wr(e,[{key:"componentDidMount",value:function(){var n=this.props.nonce;this._autoSizer&&this._autoSizer.parentNode&&this._autoSizer.parentNode.ownerDocument&&this._autoSizer.parentNode.ownerDocument.defaultView&&this._autoSizer.parentNode instanceof this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement&&(this._parentNode=this._autoSizer.parentNode,this._detectElementResize=Ir(n),this._detectElementResize.addResizeListener(this._parentNode,this._onResize),this._onResize())}},{key:"componentWillUnmount",value:function(){this._detectElementResize&&this._parentNode&&this._detectElementResize.removeResizeListener(this._parentNode,this._onResize)}},{key:"render",value:function(){var n=this.props,o=n.children,s=n.className,c=n.disableHeight,l=n.disableWidth,S=n.style,I=this.state,_=I.height,g=I.width,v={overflow:"visible"},w={},d=!1;return c||(_===0&&(d=!0),v.height=0,w.height=_),l||(g===0&&(d=!0),v.width=0,w.width=g),(0,se.createElement)("div",{className:s,ref:this._setRef,style:br({},v,S)},!d&&o(w))}}]),e}(se.PureComponent);Qe.defaultProps={onResize:function(){},disableHeight:!1,disableWidth:!1,style:{}};var et=Qe;var _r=(0,rt.makeStyles)(t=>({root:{display:"flex",flexFlow:"column nowrap",alignItems:"stretch",gap:t.spacing(2)},root_window:{height:"100%",padding:t.spacing(2)},root_embedded:{height:`calc(100% - ${t.spacing(12)}px)`},buttons:{flex:"0 1 auto",display:"flex",gap:t.spacing(1)},code:{display:"block",flex:1,background:"#1e1e1e",color:"#cccccc",overflow:"auto",padding:t.spacing(2),"& pre":{margin:0}}}));Y.rgb.blue=[36,114,200];Y.rgb.cyan=[17,168,205];Y.rgb.green=[13,188,121];var Yn=()=>{let t=_r(),e=J(),{translate:r}=(0,le.useI18n)(),{instance:n}=(0,le.useGlobals)(),o=x.default.useRef(null),[s,c]=x.default.useState([]),l=h=>{c(p=>[...p,h])},S=h=>s[h].split(`
`).length*20;function I({index:h,style:p}){let C=s[h];return x.default.createElement("pre",{style:p,dangerouslySetInnerHTML:{__html:C}})}let[_,g]=x.default.useState(!1),[v,w]=x.default.useState(!0);function d(){o.current?.scrollToItem(s.length-1,"end")}x.default.useEffect(()=>{v&&s.length>0&&d()},[s.length,v]);let f=x.default.useCallback(h=>{if(h.type==="log"){let C=Y.parse(h.info.message).spans.map(z=>`<span style="${z.css.replace(/^background:/,"color:#1e1e1e;background:")}">${z.text}</span>`);l(C.join(""))}},[c]);Re(f);let i=x.default.useCallback(()=>{_||e.subscribeLogs().then(()=>{l(r("Subscribed to logs...")),g(!0)})},[e,_]),u=x.default.useCallback(()=>{!_||e.unsubscribeLogs().then(()=>{l(r("Unsubscribed logs...")),g(!1)})},[e,_]);x.default.useEffect(()=>(i(),u),[]);let m=x.default.useCallback(()=>{let h=document.createElement("a"),p=s.join(`
`).replace(/\<.*?\>/g,""),C=new Blob([p],{type:"text/plain"});h.href=URL.createObjectURL(C),h.download=`zwave_${new Date().toISOString().replace("T","_").replace(/[:\.]/g,"-").replace("Z","")}.log`,document.body.appendChild(h),h.click()},[s]),b=x.default.useCallback(()=>{window.open("log_window.html",`zwave_log_${n}`,"innerWidth=960,innerHeight=600")},[]),a=window.name.startsWith("zwave_log_");return x.default.createElement("div",{className:(0,lt.default)(t.root,a?t.root_window:t.root_embedded)},x.default.createElement("div",{className:t.buttons},x.default.createElement(ye.default,{variant:"contained",color:"primary"},x.default.createElement(U.default,{title:r("Start logging")},x.default.createElement(A.default,{disabled:_,onClick:i},x.default.createElement(nt.default,null))),x.default.createElement(U.default,{title:r("Pause logging")},x.default.createElement(A.default,{disabled:!_,onClick:u},x.default.createElement(ot.default,null)))),x.default.createElement(ye.default,{variant:"contained",color:"primary"},x.default.createElement(U.default,{title:r("Auto-scroll to bottom")},x.default.createElement(A.default,{disabled:v,onClick:()=>w(!0)},x.default.createElement(it.default,null))),x.default.createElement(U.default,{title:r("Pause auto-scrolling")},x.default.createElement(A.default,{disabled:!v,onClick:()=>w(!1)},x.default.createElement(at.default,null)))),x.default.createElement(A.default,{variant:"contained",color:"primary",onClick:m,startIcon:x.default.createElement(st.default,null)},r("Download logs")),!a&&x.default.createElement(U.default,{title:r("Open log in new window")},x.default.createElement(A.default,{variant:"contained",color:"primary",style:{marginLeft:"auto"},onClick:b},x.default.createElement(tt.default,null)))),x.default.createElement("code",{className:t.code},x.default.createElement(et,null,({height:h,width:p})=>x.default.createElement(Ke,{itemCount:s.length,itemSize:S,width:p,height:h,ref:o},I))))};export{Ct as a,Re as b,Be as c,Yn as d};
//# sourceMappingURL=chunk-6J4MBJZJ.js.map
