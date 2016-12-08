//>>built
require({cache:{"url:esri/dijit/metadata/base/templates/MultiplicityTools.html":'\x3cdiv class\x3d"gxeMultiplicityTools" style\x3d"display:none;"\x3e\r\n  \x3cdiv class\x3d"gxeIcon gxeIconRepeat" \r\n    data-dojo-attach-point\x3d"repeatElementNode"\r\n    data-dojo-attach-event\x3d"onClick: repeatElementClicked"\r\n    aria-label\x3d"${i18nBase.multiplicity.repeatElement}"\r\n    title\x3d"${i18nBase.multiplicity.repeatElement}"\x3e\x3c/div\x3e\r\n  \x3cdiv class\x3d"gxeIcon gxeIconRemove" \r\n    data-dojo-attach-point\x3d"removeElementNode"\r\n    data-dojo-attach-event\x3d"onClick: removeElementClicked"\r\n    aria-label\x3d"${i18nBase.multiplicity.removeElement}"\r\n    title\x3d"${i18nBase.multiplicity.removeElement}"\x3e\x3c/div\x3e\r\n  \x3cdiv class\x3d"gxeIcon gxeIconMoveUp" \r\n    data-dojo-attach-point\x3d"moveElementUpNode"\r\n    data-dojo-attach-event\x3d"onClick: moveElementUpClicked"\r\n    aria-label\x3d"${i18nBase.multiplicity.moveElementUp}"\r\n    title\x3d"${i18nBase.multiplicity.moveElementUp}"\x3e\x3c/div\x3e\r\n  \x3cdiv class\x3d"gxeIcon gxeIconMoveDown" \r\n    data-dojo-attach-point\x3d"moveElementDownNode"\r\n    data-dojo-attach-event\x3d"onClick: moveElementDownClicked"\r\n    aria-label\x3d"${i18nBase.multiplicity.moveElementDown}"\r\n    title\x3d"${i18nBase.multiplicity.moveElementDown}"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n'}});
define("esri/dijit/metadata/base/MultiplicityTools","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-class dojo/dom-construct dojo/has ./Templated dojo/text!./templates/MultiplicityTools.html ../../../kernel".split(" "),function(f,d,g,h,k,l,m,n,p){f=f([m],{_isGxeMultiplicityTools:!0,multiplicityHeader:null,templateString:n,postCreate:function(){this.inherited(arguments);this.connectAriaClickable(this.repeatElementNode,d.hitch(this,this.repeatElementClicked));this.connectAriaClickable(this.removeElementNode,
d.hitch(this,this.removeElementClicked));this.connectAriaClickable(this.moveElementUpNode,d.hitch(this,this.moveElementUpClicked));this.connectAriaClickable(this.moveElementDownNode,d.hitch(this,this.moveElementDownClicked))},getCurrentIndex:function(a){return this.multiplicityHeader.getCurrentIndex(a)},_setCurrentIndex:function(a){this.multiplicityHeader.useTabs&&(this.multiplicityHeader._currentIndex=a)},getElements:function(){return this.multiplicityHeader.getElements()},getMultiplicityInfo:function(a){return this.multiplicityHeader.getMultiplicityInfo(a)},
getSiblings:function(a){if(this.multiplicityHeader.useTabs)return[];var b=[];a||(a=this.getElements());g.forEach(a,function(a){var e=null;a.multiplicityHeader&&(e=a.multiplicityHeader.tools)&&e!==this&&b.push(e)},this);return b},getTabs:function(){return this.multiplicityHeader.tabs},initialize:function(a){this.multiplicityHeader=a;this.isRepeatable()?this.domNode.style.display="inline-block":this.domNode.style.display="none";this.updateUI(null)},isRepeatable:function(){return this.multiplicityHeader.isElementRepeatable()},
moveElementDownClicked:function(){var a=this.getMultiplicityInfo();if(a.canMoveDown){var b=this.getTabs(),c=a.elements,a=a.currentIndex;k.place(c[a].domNode,c[a+1].domNode,"after");b&&(a++,this._setCurrentIndex(a),b.highlightTab(b.getTabButton(a)));c=this.getElements();this.updateUI(c);b||this.updateSiblings(c)}},moveElementUpClicked:function(){var a=this.getMultiplicityInfo();if(a.canMoveUp){var b=this.getTabs(),c=a.elements,a=a.currentIndex;k.place(c[a].domNode,c[a-1].domNode,"before");b&&(a--,
this._setCurrentIndex(a),b.highlightTab(b.getTabButton(a)));c=this.getElements();this.updateUI(c);b||this.updateSiblings(c)}},removeElementClicked:function(){var a=this.getMultiplicityInfo();if(a.canRemove){var b=null,c=this.getTabs(),e=a.elements,a=a.currentIndex,d=a===e.length-1,f=e[a];c||(b=this.getSiblings(e));f.destroyRecursive(!1);c?(c.getTabButton(a).destroyRecursive(!1),d&&this._setCurrentIndex(a-1),c.sync(),this.updateUI(null)):g.forEach(b,function(a){a.updateUI(null)})}},repeatElementClicked:function(){var a=
this.getMultiplicityInfo();if(a.canAdd){var b=a.currentIndex;-1===b&&(b=0);this.multiplicityHeader.repeatElement(a.elements[b],!0)}},updateSiblings:function(a){if(!this.multiplicityHeader.useTabs){var b=this.getSiblings(a);g.forEach(b,function(b){b.updateUI(a)})}},updateUI:function(a){var b=function(a,b){b?(a.disabled=!1,h.remove(a,"gxeDisabledIcon")):(a.disabled=!0,h.add(a,"gxeDisabledIcon"))};a=this.getMultiplicityInfo(a);b(this.repeatElementNode,a.canAdd);b(this.removeElementNode,a.canRemove);
b(this.moveElementUpNode,a.canMoveUp);b(this.moveElementDownNode,a.canMoveDown)}});l("extend-esri")&&d.setObject("dijit.metadata.base.MultiplicityTools",f,p);return f});