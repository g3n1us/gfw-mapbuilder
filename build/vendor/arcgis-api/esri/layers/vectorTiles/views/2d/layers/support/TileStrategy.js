//>>built
define("esri/layers/vectorTiles/views/2d/layers/support/TileStrategy",["require","exports","../../../../core/LRUCache","../../layers/support/TileKey"],function(w,x,v,t){function p(l,b){l["delete"](b)}var u=[],q=[],r=[null,null],s=[];return function(){function l(b,d,c,e){this.container=b;this.tileInfoView=d;this.requestUpdate=c;this.fetchTile=e;this._tilesToRender=new Map;this._requests=new Map;this._updates=new Map;this._loadedTiles=new Map;this._newTilesToRender=new Map;this._lru=new v(30);this._prevResolution=
Number.POSITIVE_INFINITY;this._isStationary=!1}l.prototype.destroy=function(){this._requests&&(this._requests.forEach(function(b){b.isFulfilled()||b.cancel()}),this._loadedTiles=this._tilesToRender=this._requests=null)};l.prototype.update=function(b){var d=this,c=this.tileInfoView.getTileCoverage(b.state);if(c){var e=c.lodInfo.level,a=b.state.resolution;if(1.5>b.budget.remaining)this.requestUpdate(),this._prevResolution=a;else{var f=a>this._prevResolution;this._prevResolution=a;l._createCoverageList(u,
c);for(var k=0,g,h=0;h<u.length;h++)if(a=u[h],this._tilesToRender.has(a))g=this._tilesToRender.get(a),g.visible=!0,this._newTilesToRender.set(a,g),k++,g.attached||f||this._addParentTile(a,this._newTilesToRender);else if(this._loadedTiles.has(a))this._newTilesToRender.set(a,this._loadedTiles.get(a)),k++,p(this._loadedTiles,a),f||this._addParentTile(a,this._newTilesToRender);else if(this._lru.has(a))g=this._lru.use(a),g.visible=!0,this._newTilesToRender.set(a,g),k++,!g.attached&&!f&&this._addParentTile(a,
this._newTilesToRender);else{if(g=this._requests.get(a)){if(g.isCanceled()||g.isRejected())p(this._requests,a),this._getTile(a,b)}else this._getTile(a,b);f||this._addParentTile(a,this._newTilesToRender)}!this._isStationary&&b.stationary&&this.requestUpdate();this._isStationary=b.stationary;var n=k===u.length,a=this._tilesToRender,m;a.forEach(function(a,b){m=t.from(b);d._newTilesToRender.has(b)||(0===m.level||m.level<e&&d.tileInfoView.intersects(c,m)?(a.visible=!1,d._newTilesToRender.set(b,a)):(f||
!n)&&d.tileInfoView.intersects(c,m)?(a.visible=!0,d._newTilesToRender.set(b,a)):(d._updates.has(b)&&(d._updates.get(b).cancel(b),p(d._updates,b)),a.visible=!0,d._lru.insert(b,a)))});a.clear();this._tilesToRender=this._newTilesToRender;this._newTilesToRender=a;this.container.removeAllChildren();this._tilesToRender.forEach(function(a){return d.container.addChild(a)},this);this._loadedTiles.forEach(function(a){return a.dispose()});this._loadedTiles.clear();this._requests.forEach(function(a,f){if(b.budget.done)d.requestUpdate();
else if(a.isFulfilled())s.push(f);else if(m=t.from(f),m.level>e||!d.tileInfoView.intersects(c,m))a.cancel(),s.push(f)});for(k=0;k<s.length;k++)a=s[k],p(this._requests,a);s.length=0}}};l.prototype.updateTiles=function(b,d){var c=this;this._tilesToRender.forEach(function(e,a){if(e.visible&&e.attached){var f=b(e,d);f&&(c._updates.has(a)&&(c._updates.get(a).cancel(),p(c._updates,a)),f.then(function(b){p(c._updates,a);c._tilesToRender.set(a,b)}),c._updates.set(a,f))}})};l.prototype._addParentTile=function(b,
d){this._getAvailableParentTile(r,b);r[0]&&!d.has(r[0])&&(r[1].visible=!0,d.set(r[0],r[1]))};l.prototype._getTile=function(b,d){var c=this;if(!this._requests.has(b)){var e=this.fetchTile(b,d);e.then(function(a){var d=t.fromId(b);c.tileInfoView.getTileTopLeft(a.topLeft,d);c.tileInfoView.getTileBottomRight(a.bottomRight,d);a.resolution=c.tileInfoView.getTileResolution(d);c._loadedTiles.set(b,a);p(c._requests,b);c.requestUpdate()}).otherwise(function(a){p(c._requests,b)});this._requests.set(b,e)}};l.prototype._getAvailableParentTile=
function(b,d){b[0]=null;b[1]=null;for(var c=d;c=this.tileInfoView.getTileParentId(c);){if(this._tilesToRender.has(c)){b[0]=c;b[1]=this._tilesToRender.get(c);break}if(this._lru.has(c)){var e=this._lru.use(c);if(e.attached){b[0]=c;b[1]=e;break}}}return b};l._createCoverageList=function(b,d){b.length=0;q.length=0;var c=d.spans;if(0!==c.length){for(var e=0,a=0,f=Infinity,k=-Infinity,e=c[0].row,a=c[c.length-1].row,g=0;g<c.length;g++)for(var h=c[g],n=h.colFrom,h=h.colTo;n<=h;n++)f=Math.min(f,n),k=Math.max(k,
n);var g=d.lodInfo,n=g.level,a=e+Math.floor((a-e)/2),f=f+Math.floor((k-f)/2),m,h=a-e;0<=h&&h<c.length&&(m=t.from(n,a,g.normalizeCol(f),g.getWorldForColumn(f)),q.push({dist:0,id:m.id}));for(var l,k=0;k<c.length;k++){h=c[k];e=h.row;n=h.colFrom;for(h=h.colTo;n<=h;n++)l=Math.abs(n-f)+Math.abs(e-a),0!==l&&(m.row=e,m.col=g.normalizeCol(n),m.world=g.getWorldForColumn(n),q.push({dist:l,id:m.id}))}q.sort(function(a,b){return a.dist-b.dist});for(c=0;c<q.length;c++)b.push(q[c].id)}};return l}()});