(this.webpackJsonpnest=this.webpackJsonpnest||[]).push([[0],{17:function(e,t,n){},21:function(e,t,n){},22:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n(1),r=n.n(a),i=n(8),s=n.n(i),j=(n(17),n(7)),l=n(2),d=n(3),o=n(9),h=n(11);function b(e){var t=e.replace(",",".");return Number.parseFloat(t)}function u(e,t){var n=e.split(/\s/),c={id:Object(h.a)(),title:"",x:0,y:0,date:null,distances:[],deltaDistances:[],neighborsCount:0,r:0,isAccepted:!1};switch(t){case 1:c.x=b(n[0]),c.y=b(n[1]);break;case 2:c.title=n[0],c.x=b(n[1]),c.y=b(n[2]);break;case 3:c.title=n[0],c.date=n[1],c.x=b(n[2]),c.y=b(n[3])}return c}function O(e,t){var n,c=[],a=Object(l.a)(t);try{for(a.s();!(n=a.n()).done;){var r=n.value;if(r.id!==e.id){var i=Math.sqrt(Math.pow(r.x-e.x,2)+Math.pow(r.y-e.y,2))/2;c.push(i)}}}catch(s){a.e(s)}finally{a.f()}return c.sort((function(e,t){return e-t})),c}function x(e){for(var t=[],n=0;n<e.length-1;n++)t.push(e[n+1]-e[n]);var c=Math.max.apply(Math,t);return t.map((function(e){return e/c}))}function f(e,t,n){var c,a=0,r=Object(l.a)(t);try{for(r.s();!(c=r.n()).done;){var i=c.value,s=0;if(i.id!==e.id){for(var j=0;j<n;j++)s+=i.distances[j];a+=s/=n}}}catch(d){r.e(d)}finally{r.f()}return(a/=t.length-1)>=e.distances[0]}function p(e){var t,n=0,c=0,a=0;t=e.deltaDistances.length>6?5:e.deltaDistances.length-1;for(var r=1;r<=t;r++)e.deltaDistances[r]>n&&(n=e.deltaDistances[r],c=r);for(var i=0;i<=c;i++)a+=e.distances[i];return{r:a/=c+1,neighborsCount:c+1}}function v(e){var t,n="Number\tR\tNeib\n",c=Object(l.a)(e);try{for(c.s();!(t=c.n()).done;){var a=t.value;n+="".concat(a.title?a.title:a.id,"\t"),a.isAccepted?n+="".concat(a.r,"\t").concat(a.neighborsCount):n+="NAN\t0",n+="\n"}}catch(r){c.e(r)}finally{c.f()}return n}n(21);var y=function(){var e=Object(a.useState)(""),t=Object(d.a)(e,2),n=t[0],r=t[1],i=Object(a.useState)([]),s=Object(d.a)(i,2),h=s[0],b=s[1],y=Object(a.useState)(2),g=Object(d.a)(y,2),m=g[0],C=g[1],k=Object(a.useState)(!1),w=Object(d.a)(k,2),N=w[0],S=w[1],A=Object(a.useState)(3),D=Object(d.a)(A,2),M=D[0],F=D[1],X=Object(a.useState)([]),Y=Object(d.a)(X,2),E=Y[0],I=Y[1];return Object(a.useEffect)((function(){b(function(e,t,n){var c,a=[],r=e.split(/[\r\n]+/),i=!0,s=Object(l.a)(r);try{for(s.s();!(c=s.n()).done;){var j=c.value;n&&i?i=!1:""!==j&&a.push(u(j,t))}}catch(d){s.e(d)}finally{s.f()}return a}(n,m,N))}),[n,m,N]),Object(c.jsx)("div",{className:"App",children:Object(c.jsxs)("div",{className:"wrapper",children:[Object(c.jsx)("h1",{children:"Nest"}),Object(c.jsx)("h4",{children:"\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u043e\u0440\u043c\u0430\u0442 \u0432\u0445\u043e\u0434\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445:"}),Object(c.jsx)("div",{children:Object(c.jsxs)("label",{children:[Object(c.jsx)("input",{type:"radio",name:"inputFormat",checked:1===m,onChange:function(e){return e.target.checked&&C(1)}}),"X Y"]})}),Object(c.jsx)("div",{children:Object(c.jsxs)("label",{children:[Object(c.jsx)("input",{type:"radio",name:"inputFormat",checked:2===m,onChange:function(e){return e.target.checked&&C(2)}}),"<\u041c\u0435\u0442\u043a\u0430 \u0433\u043d\u0435\u0437\u0434\u0430> X Y"]})}),Object(c.jsx)("div",{children:Object(c.jsxs)("label",{children:[Object(c.jsx)("input",{type:"radio",name:"inputFormat",checked:3===m,onChange:function(e){return e.target.checked&&C(3)}}),"<\u041c\u0435\u0442\u043a\u0430 \u0433\u043d\u0435\u0437\u0434\u0430> <\u0414\u0430\u0442\u0430 \u043e\u0441\u043d\u043e\u0432\u0430\u043d\u0438\u044f> X Y"]})}),Object(c.jsx)("div",{children:Object(c.jsxs)("label",{children:[Object(c.jsx)("input",{type:"checkbox",checked:N,onChange:function(e){return S(e.target.checked)}}),"\u0421 \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043a\u043e\u043c"]})}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h4",{children:"\u0421\u043a\u043e\u043f\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u044e\u0434\u0430 \u043a\u043e\u043e\u0440\u0434\u0438\u043d\u0430\u0442\u044b \u0433\u043d\u0451\u0437\u0434:"}),Object(c.jsx)("textarea",{rows:5,className:"textarea-with-data",value:n,onChange:function(e){return r(e.target.value)}})]}),Object(c.jsx)("div",{children:Object(c.jsxs)("label",{children:["\u0411\u0440\u0430\u0442\u044c \u043f\u0435\u0440\u0432\u044b\u0445",Object(c.jsxs)("select",{value:M,onChange:function(e){return F(e.target.value)},children:[Object(c.jsx)("option",{children:"1"}),Object(c.jsx)("option",{children:"2"}),Object(c.jsx)("option",{children:"3"}),Object(c.jsx)("option",{children:"4"}),Object(c.jsx)("option",{children:"5"}),Object(c.jsx)("option",{children:"6"}),Object(c.jsx)("option",{children:"7"})]})]})}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h4",{children:"\u0413\u043d\u0451\u0437\u0434\u0430:"}),Object(c.jsx)("ul",{className:"nest-list",children:h.map((function(e){return Object(c.jsxs)("li",{children:[Object(c.jsx)("b",{children:e.title?e.title:e.id}),"\xa0",e.date&&e.date,"\xa0",e.x," ",e.y]})}))}),Object(c.jsx)(o.a,{width:"600px",height:"400px",chartType:"ScatterChart",loader:Object(c.jsx)("div",{children:"Loading Chart"}),data:[["x","y"]].concat(Object(j.a)(h.map((function(e){return[e.x,e.y]})))),options:{legend:"none"}})]}),Object(c.jsx)("div",{children:Object(c.jsx)("button",{onClick:function(){return function(){var e,t=Object(l.a)(h);try{for(t.s();!(e=t.n()).done;){var n=e.value,c=O(n,h),a=x(c);n.distances=c,n.deltaDistances=a}}catch(u){t.e(u)}finally{t.f()}var r,i=Object(l.a)(h);try{for(i.s();!(r=i.n()).done;){var s=r.value;if(s.isAccepted=f(s,h,M),s.isAccepted){var d=p(s),o=d.r,b=d.neighborsCount;s.r=o,s.neighborsCount=b}}}catch(u){i.e(u)}finally{i.f()}I(Object(j.a)(h))}()},children:"\u0420\u0430\u0441\u0447\u0438\u0442\u0430\u0442\u044c!"})}),Object(c.jsxs)("div",{children:[Object(c.jsx)("h4",{children:"\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442"}),Object(c.jsxs)("p",{children:["\u041c\u043e\u0436\u043d\u043e \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0438\u043b\u0438"," ",Object(c.jsx)("a",{href:"data:text/plain;charset=UTF-8,".concat(encodeURIComponent(v(E))),download:"nest_results.txt",children:"\u0441\u043a\u0430\u0447\u0430\u0442\u044c \u0432 \u0432\u0438\u0434\u0435 \u0444\u0430\u0439\u043b\u0430"})]}),Object(c.jsx)("textarea",{className:"textarea-with-data",rows:5,value:v(E)})]})]})})};s.a.render(Object(c.jsx)(r.a.StrictMode,{children:Object(c.jsx)(y,{})}),document.getElementById("root"))}},[[22,1,2]]]);
//# sourceMappingURL=main.b55ffcfd.chunk.js.map