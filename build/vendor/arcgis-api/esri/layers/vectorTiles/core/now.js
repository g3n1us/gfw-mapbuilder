//>>built
define("esri/layers/vectorTiles/core/now",["require","exports"],function(d,e){var c=Function("return this")();return function(){var a=c.performance||{};if(a.now)return function(){return a.now()};if(a.webkitNow)return function(){return a.webkitNow()};if(a.mozNow)return function(){return a.mozNow()};if(a.msNow)return function(){return a.msNow()};if(a.oNow)return function(){return a.oNow()};var b;b=a.timing&&a.timing.navigationStart?a.timing.navigationStart:Date.now();return function(){return Date.now()-
b}}()});