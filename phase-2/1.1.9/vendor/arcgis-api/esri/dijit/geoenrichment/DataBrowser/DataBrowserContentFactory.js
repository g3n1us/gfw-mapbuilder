//>>built
define("esri/dijit/geoenrichment/DataBrowser/DataBrowserContentFactory","dojo/_base/declare dojo/dom-class ../_WizardPage ./Breadcrumb ./DataBrowserBase ./DataBrowserManager ./DataCategoriesPage ./DataCollectionsPage ./DataVariablesPage ./DataVariableGrid dojo/i18n!../../../nls/jsapi".split(" "),function(g,s,h,k,c,l,m,n,p,q,r){return g(null,{createManager:function(a){return new l(a)},createBreadcrumb:function(a){return new k(a)},createPage:function(a,d){var b;switch(a){case c.CATEGORIES_PAGE:b=m;
break;case c.COLLECTIONS_PAGE:b=n;break;case c.VARIABLES_PAGE:b=p}b=g([h,b],{buildRendering:function(){function a(d){var f=d.toLowerCase(),e=c[f+"Button"];!0===e&&(e=r.geoenrichment.dijit.WizardButtons[f]);e&&b.push({id:f,label:e,onClick:function(){c.emit(d,{bubbles:!1})}})}this.inherited(arguments);var b=[],c=this;a("Cancel");a("OK");a("Back");b.length?this.addButtons(b):this.buttonsNode&&(this.buttonsNode.style.display="none")}});return new b(d)},createVariableGrid:function(a,c){return new q(a,
c)}})});