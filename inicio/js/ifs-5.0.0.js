!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=126)}({126:function(e,t,n){"use strict";function r(e){var t=window.location.search.match(new RegExp("[?&]"+e+"=([^&]*)(&?)","i"));return t?decodeURIComponent(t[1]):"null"}Object.defineProperty(t,"__esModule",{value:!0}),new(n(127).default)(r("journeyId"),r("iframeId")).init()},127:function(e,t,n){"use strict";function r(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(e){}}function o(e){var t=localStorage.getItem(e)||"null";try{return JSON.parse(t)}catch(n){if("SyntaxError"!==n.name)throw n;r(e,t)}return t}function s(e,t,n){r(e.jId+"."+t,n)}function a(e,t){return o(e.jId+"."+t)}function i(e,t){localStorage.removeItem(e.jId+"."+t)}function u(e){var t=new RegExp("^"+e+"\\."),n={};return Object.keys(localStorage).filter(function(e){return t.test(e)}).reduce(function(e,n){return e[n.replace(t,"")]=o(n),e},n)}function c(e,t){var n,r,o={},s=new RegExp("^"+t);for(n in e)s.test(n)&&(r=n.replace(s,""),o[r]=e[n]);return o}function d(e,t){var n=new RegExp("^"+t.sessionId+"\\."),r=t.sessionId!==e.sId;return r&&(s(e,"sessionId",e.sId),Object.keys(t).filter(function(e){return n.test(e)}).forEach(function(t){return i(e,t)})),r}function f(e,t){var n=c(t,t.sessionId+"\\.");t.sessionId!==e.sId&&(n={}),e.sendMessageToParent("data",n)}function l(e,t){var n=new RegExp("^"+e.jId+"\\.");"storage"===t.type&&t.key&&n.test(t.key)&&f(e,u(e.jId))}function p(e,t,n){var r=t.value;a(e,"sessionId")===n&&t.hasOwnProperty("value")&&t.hasOwnProperty("key")&&s(e,n+"."+t.key,r)}function y(e,t){var n;try{n=JSON.parse(t.data)||{}}catch(e){n={}}switch(n.command){case I:e.sId=n.sessionId;var r=u(e.jId);d(e,r)&&(r=u(e.jId)),f(e,r);break;case g:p(e,n,e.sId);break;case v:n.hasOwnProperty("key")&&i(e,e.sId+"."+n.key)}}Object.defineProperty(t,"__esModule",{value:!0});var I=1,g=2,v=3,w=function(){function e(e,t){this.fId=t,this.jId=e,this.pUrl=document.referrer.replace(/^([a-z]*:\/\/[^\/]+).*$/,"$1")||"*"}return e.prototype.init=function(e){var t=this;void 0===e&&(e=function(){return window.localStorage});try{e()}catch(e){return}window.addEventListener("message",function(e){return y(t,e)},!1),window.addEventListener("storage",function(e){return l(t,e)},!1),this.sendMessageToParent("ready")},e.prototype.sendMessageToParent=function(e,t){void 0===t&&(t=null),window.parent.postMessage(JSON.stringify({id:this.fId,messageType:e,messageBody:t}),this.pUrl)},e}();t.default=w}});