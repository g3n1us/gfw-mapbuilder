//>>built
define("esri/layers/vectorTiles/views/vectorTiles/VectorTileContainer","require exports ../../core/tsSupport/extendsHelper dojo/has ../../core/libs/gl-matrix/vec3 ../../core/libs/gl-matrix/mat4 ../2d/engine/Container ./renderers/Renderer ./GeometryUtils ./StencilClipGenerator".split(" "),function(t,u,m,v,k,e,n,p,q,r){return function(f){function d(){f.call(this);this.isInitialized=!1;this._displayHeight=this._displayWidth=0;this._clip=new r;this._tileCoordinateScale=k.create();this._orientationVec=
k.create();this._displayScale=k.create();this._orientationVec.set([0,0,1]);this._defaultTransform=e.create()}m(d,f);d.prototype.initialize=function(a,b,d,s){this._renderer=new p(a,b);this._tileInfoView=s;this._tileInfo=d;this.isInitialized=!0};d.prototype.prepareChildrenRenderParameters=function(a){var b=a.state;if(!b||!this._tileInfo||!this.isInitialized)return a;a.displayLevel=this._tileInfo.scaleToZoom(b.scale);a.requiredLevel=this._tileInfoView.getClosestInfoForScale(b.scale).level;a.renderer=
this._renderer;return a};d.prototype.renderChildren=function(a){if(!(0===this.children.length||!this.isInitialized||!a||!a.state)){this.sortChildren(function(a,b){return b.resolution-a.resolution});this._clip.update(this.children);this._updateTilesTransform(a.state,this._tileInfoView.getClosestInfoForScale(a.state.scale).level);var b=a.context;b.setDepthWriteEnabled(!0);this._renderer.setStateParams(a.state,a.devicePixelRatio,a.displayLevel);this._renderer.drawClippingMasks(b,this.children);b.setStencilWriteMask(0);
b.setBlendFunctionSeparate(770,771,1,771);b.setStencilOp(7680,7680,7681);b.setDepthFunction(515);b.setBlendingEnabled(!1);b.setStencilTestEnabled(!0);b.setDepthTestEnabled(!0);b.setDepthWriteEnabled(!0);a.drawphase=0;f.prototype.renderChildren.call(this,a);b.setDepthWriteEnabled(!1);b.setBlendingEnabled(!0);a.drawphase=1;f.prototype.renderChildren.call(this,a);a.drawphase=2;f.prototype.renderChildren.call(this,a);b.setStencilTestEnabled(!1);b.setDepthTestEnabled(!1);this._renderer.needsRedraw()&&
this.requestRender()}};d.prototype.attachChild=function(a,b){return a.attach(b)};d.prototype.detachChild=function(a,b){a.detach(b)};d.prototype.renderChild=function(a,b){a.render(b)};d.prototype._updateTilesTransform=function(a,b){var d=1/a.width,e=1/a.height,g=[0,0];this._calculateRelativeViewProjMat(this._tileInfo.lods[b].resolution,a.resolution,a.rotation,this._tileInfo.size[1],4096,a.width,a.height,this._defaultTransform);for(var h=0,l=this.children;h<l.length;h++){var c=l[h];a.toScreen(g,c.topLeft);
g[1]=a.height-g[1];c.tileTransform.displayCoord[0]=2*g[0]*d-1;c.tileTransform.displayCoord[1]=2*g[1]*e-1;c.key.level===b&&4096===c.coordRange?c.tileTransform.transform.set(this._defaultTransform):this._calculateRelativeViewProjMat(this._tileInfo.lods[c.key.level].resolution,a.resolution,a.rotation,this._tileInfo.size[1],c.coordRange,a.width,a.height,c.tileTransform.transform)}};d.prototype._calculateRelativeViewProjMat=function(a,b,d,f,g,h,l,c){var k=0.125;512!==f&&4096!==g&&(k=f/g);a=k*(a/b);this._tileCoordinateScale.set([a,
a,1]);if(h!==this._displayWidth||l!==this._displayHeight)this._displayScale.set([2/h,-2/l,1]),this._displayWidth=h,this._displayHeight=l;e.identity(c);e.scale(c,c,this._tileCoordinateScale);e.rotate(c,c,-d*q.C_DEG_TO_RAD,this._orientationVec);e.scale(c,c,this._displayScale);e.transpose(c,c)};return d}(n)});