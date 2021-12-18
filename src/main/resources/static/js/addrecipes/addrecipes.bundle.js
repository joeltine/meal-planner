(()=>{var t={197:()=>{!function(t){var e={};function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(s,n,function(e){return t[e]}.bind(null,n));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e),i.d(e,"AutoComplete",(function(){return a}));var s,n=(s=function(t,e){return(s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}s(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),o=function(t){function e(e){return t.call(this,e)||this}return n(e,t),e.prototype.getDefaults=function(){return{url:"",method:"get",queryKey:"q",extraData:{},timeout:void 0,requestThrottling:500}},e.prototype.search=function(t,e){var i=this;null!=this.jqXHR&&this.jqXHR.abort();var s={};s[this._settings.queryKey]=t,$.extend(s,this._settings.extraData),this.requestTID&&window.clearTimeout(this.requestTID),this.requestTID=window.setTimeout((function(){i.jqXHR=$.ajax(i._settings.url,{method:i._settings.method,data:s,timeout:i._settings.timeout}),i.jqXHR.done((function(t){e(t)})),i.jqXHR.fail((function(t){var e;null===(e=i._settings)||void 0===e||e.fail(t)})),i.jqXHR.always((function(){i.jqXHR=null}))}),this._settings.requestThrottling)},e}(function(){function t(t){this._settings=$.extend(!0,{},this.getDefaults(),t)}return t.prototype.getDefaults=function(){return{}},t.prototype.getResults=function(t,e,i){return this.results},t.prototype.search=function(t,e){e(this.getResults())},t}()),r=function(){function t(t,e,i,s){this.initialized=!1,this.shown=!1,this.items=[],this.ddMouseover=!1,this._$el=t,this.formatItem=e,this.autoSelect=i,this.noResultsText=s}return t.prototype.init=function(){var t=this,e=$.extend({},this._$el.position(),{height:this._$el[0].offsetHeight});this._dd=$("<ul />"),this._dd.addClass("bootstrap-autocomplete dropdown-menu"),this._dd.insertAfter(this._$el),this._dd.css({top:e.top+this._$el.outerHeight(),left:e.left,width:this._$el.outerWidth()}),this._dd.on("click","li",(function(e){var i=$(e.currentTarget).data("item");t.itemSelectedLaunchEvent(i)})),this._dd.on("keyup",(function(e){if(t.shown){if(27===e.which)t.hide(),t._$el.focus();return!1}})),this._dd.on("mouseenter",(function(e){t.ddMouseover=!0})),this._dd.on("mouseleave",(function(e){t.ddMouseover=!1})),this._dd.on("mouseenter","li",(function(e){t.haveResults&&($(e.currentTarget).closest("ul").find("li.active").removeClass("active"),$(e.currentTarget).addClass("active"),t.mouseover=!0)})),this._dd.on("mouseleave","li",(function(e){t.mouseover=!1})),this.initialized=!0},t.prototype.checkInitialized=function(){this.initialized||this.init()},Object.defineProperty(t.prototype,"isMouseOver",{get:function(){return this.mouseover},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"isDdMouseOver",{get:function(){return this.ddMouseover},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"haveResults",{get:function(){return this.items.length>0},enumerable:!1,configurable:!0}),t.prototype.focusNextItem=function(t){if(this.haveResults){var e=this._dd.find("li.active"),i=t?e.prev():e.next();0===i.length&&(i=t?this._dd.find("li").last():this._dd.find("li").first()),e.removeClass("active"),i.addClass("active")}},t.prototype.focusPreviousItem=function(){this.focusNextItem(!0)},t.prototype.selectFocusItem=function(){this._dd.find("li.active").trigger("click")},Object.defineProperty(t.prototype,"isItemFocused",{get:function(){return!!(this.isShown()&&this._dd.find("li.active").length>0)},enumerable:!1,configurable:!0}),t.prototype.show=function(){this.shown||(this._dd.dropdown().show(),this.shown=!0)},t.prototype.isShown=function(){return this.shown},t.prototype.hide=function(){this.shown&&(this._dd.dropdown().hide(),this.shown=!1)},t.prototype.updateItems=function(t,e){this.items=t,this.searchText=e,this.refreshItemList()},t.prototype.showMatchedText=function(t,e){var i=t.toLowerCase().indexOf(e.toLowerCase());if(i>-1){var s=i+e.length;return t.slice(0,i)+"<b>"+t.slice(i,s)+"</b>"+t.slice(s)}return t},t.prototype.refreshItemList=function(){var t=this;this.checkInitialized(),this._dd.empty();var e=[];if(this.items.length>0)this.items.forEach((function(i){var s,n,o=t.formatItem(i);"string"==typeof o&&(o={text:o}),s=t.showMatchedText(o.text,t.searchText),n=void 0!==o.html?o.html:s;var r=o.disabled,l=$("<li >");l.append($("<a>").attr("href","#!").html(n)).data("item",i),r&&l.addClass("disabled"),e.push(l)}));else{var i=$("<li >");i.append($("<a>").attr("href","#!").html(this.noResultsText)).addClass("disabled"),e.push(i)}this._dd.append(e)},t.prototype.itemSelectedLaunchEvent=function(t){this._$el.trigger("autocomplete.select",t)},t}(),l=function(){function t(t,e,i,s){this.initialized=!1,this.shown=!1,this.items=[],this.ddMouseover=!1,this._$el=t,this.formatItem=e,this.autoSelect=i,this.noResultsText=s}return t.prototype.getElPos=function(){return $.extend({},this._$el.position(),{height:this._$el[0].offsetHeight})},t.prototype.init=function(){var t=this,e=this.getElPos();this._dd=$("<div />"),this._dd.addClass("bootstrap-autocomplete dropdown-menu"),this._dd.insertAfter(this._$el),this._dd.css({top:e.top+this._$el.outerHeight(),left:e.left,width:this._$el.outerWidth()}),this._dd.on("click",".dropdown-item",(function(e){var i=$(e.currentTarget).data("item");t.itemSelectedLaunchEvent(i),e.preventDefault()})),this._dd.on("keyup",(function(e){if(t.shown){if(27===e.which)t.hide(),t._$el.focus();return!1}})),this._dd.on("mouseenter",(function(e){t.ddMouseover=!0})),this._dd.on("mouseleave",(function(e){t.ddMouseover=!1})),this._dd.on("mouseenter",".dropdown-item",(function(e){t.haveResults&&($(e.currentTarget).closest("div").find(".dropdown-item.active").removeClass("active"),$(e.currentTarget).addClass("active"),t.mouseover=!0)})),this._dd.on("mouseleave",".dropdown-item",(function(e){t.mouseover=!1})),this.initialized=!0},t.prototype.checkInitialized=function(){this.initialized||this.init()},Object.defineProperty(t.prototype,"isMouseOver",{get:function(){return this.mouseover},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"isDdMouseOver",{get:function(){return this.ddMouseover},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"haveResults",{get:function(){return this.items.length>0},enumerable:!1,configurable:!0}),t.prototype.focusNextItem=function(t){if(this.haveResults){var e=this._dd.find(".dropdown-item.active"),i=t?e.prev():e.next();0===i.length&&(i=t?this._dd.find(".dropdown-item").last():this._dd.find(".dropdown-item").first()),e.removeClass("active"),i.addClass("active")}},t.prototype.focusPreviousItem=function(){this.focusNextItem(!0)},t.prototype.selectFocusItem=function(){this._dd.find(".dropdown-item.active").trigger("click")},Object.defineProperty(t.prototype,"isItemFocused",{get:function(){return!!(this._dd&&this.isShown()&&this._dd.find(".dropdown-item.active").length>0)},enumerable:!1,configurable:!0}),t.prototype.show=function(){this.shown||(this.getElPos(),this._dd.addClass("show"),this.shown=!0,this._$el.trigger("autocomplete.dd.shown"))},t.prototype.isShown=function(){return this.shown},t.prototype.hide=function(){this.shown&&(this._dd.removeClass("show"),this.shown=!1,this._$el.trigger("autocomplete.dd.hidden"))},t.prototype.updateItems=function(t,e){this.items=t,this.searchText=e,this.refreshItemList()},t.prototype.showMatchedText=function(t,e){var i=t.toLowerCase().indexOf(e.toLowerCase());if(i>-1){var s=i+e.length;return t.slice(0,i)+"<b>"+t.slice(i,s)+"</b>"+t.slice(s)}return t},t.prototype.refreshItemList=function(){var t=this;this.checkInitialized(),this._dd.empty();var e=[];if(this.items.length>0)this.items.forEach((function(i){var s,n,o=t.formatItem(i);"string"==typeof o&&(o={text:o}),s=t.showMatchedText(o.text,t.searchText),n=void 0!==o.html?o.html:s;var r=o.disabled,l=$("<a >");l.addClass("dropdown-item").css({overflow:"hidden","text-overflow":"ellipsis"}).html(n).data("item",i),r&&l.addClass("disabled"),e.push(l)})),this._dd.append(e),this.show();else if(""===this.noResultsText)this.hide();else{var i=$("<a >");i.addClass("dropdown-item disabled").html(this.noResultsText),e.push(i),this._dd.append(e),this.show()}},t.prototype.itemSelectedLaunchEvent=function(t){this._$el.trigger("autocomplete.select",t)},t}(),a=function(){function t(t,e){this._selectedItem=null,this._defaultValue=null,this._defaultText=null,this._isSelectElement=!1,this._settings={resolver:"ajax",resolverSettings:{},minLength:3,valueKey:"value",formatResult:this.defaultFormatResult,autoSelect:!0,noResultsText:"No results",bootstrapVersion:"auto",preventEnter:!1,events:{typed:null,searchPre:null,search:null,searchPost:null,select:null,focus:null}},this._el=t,this._$el=$(this._el),this._$el.is("select")&&(this._isSelectElement=!0),this.manageInlineDataAttributes(),"object"==typeof e&&(this._settings=$.extend(!0,{},this.getSettings(),e)),this._isSelectElement&&this.convertSelectToText(),this.init()}return t.prototype.manageInlineDataAttributes=function(){var t=this.getSettings();this._$el.data("url")&&(t.resolverSettings.url=this._$el.data("url")),this._$el.data("default-value")&&(this._defaultValue=this._$el.data("default-value")),this._$el.data("default-text")&&(this._defaultText=this._$el.data("default-text")),void 0!==this._$el.data("noresults-text")&&(t.noResultsText=this._$el.data("noresults-text"))},t.prototype.getSettings=function(){return this._settings},t.prototype.getBootstrapVersion=function(){var t;return"auto"===this._settings.bootstrapVersion?t=$.fn.button.Constructor.VERSION.split(".").map(parseInt):"4"===this._settings.bootstrapVersion?t=[4]:"3"===this._settings.bootstrapVersion?t=[3]:(console.error("INVALID value for 'bootstrapVersion' settings property: "+this._settings.bootstrapVersion+" defaulting to 4"),t=[4]),t},t.prototype.convertSelectToText=function(){var e=$("<input>");e.attr("type","hidden"),e.attr("name",this._$el.attr("name")),this._defaultValue&&e.val(this._defaultValue),this._selectHiddenField=e,e.insertAfter(this._$el);var i=$("<input>");i.attr("type","search"),i.attr("name",this._$el.attr("name")+"_text"),i.attr("id",this._$el.attr("id")),i.attr("disabled",this._$el.attr("disabled")),i.attr("placeholder",this._$el.attr("placeholder")),i.attr("autocomplete","off"),i.addClass(this._$el.attr("class")),this._defaultText&&i.val(this._defaultText);var s=this._$el.attr("required");s&&i.attr("required",s),i.data(t.NAME,this),this._$el.replaceWith(i),this._$el=i,this._el=i.get(0)},t.prototype.init=function(){this.bindDefaultEventListeners(),"ajax"===this._settings.resolver&&(this.resolver=new o(this._settings.resolverSettings)),4===this.getBootstrapVersion()[0]?this._dd=new l(this._$el,this._settings.formatResult,this._settings.autoSelect,this._settings.noResultsText):this._dd=new r(this._$el,this._settings.formatResult,this._settings.autoSelect,this._settings.noResultsText)},t.prototype.bindDefaultEventListeners=function(){var t=this;this._$el.on("keydown",(function(e){switch(e.which){case 9:t._dd.isItemFocused?t._dd.selectFocusItem():t._selectedItem||""!==t._$el.val()&&t._$el.trigger("autocomplete.freevalue",t._$el.val()),t._dd.hide();break;case 13:t._dd.isItemFocused?t._dd.selectFocusItem():t._selectedItem||""!==t._$el.val()&&t._$el.trigger("autocomplete.freevalue",t._$el.val()),t._dd.hide(),t._settings.preventEnter&&e.preventDefault();break;case 40:t._dd.focusNextItem();break;case 38:t._dd.focusPreviousItem()}})),this._$el.on("keyup",(function(e){switch(e.which){case 16:case 17:case 18:case 39:case 37:case 36:case 35:case 40:case 38:break;case 13:case 27:t._dd.hide();break;default:t._selectedItem=null;var i=t._$el.val();t.handlerTyped(i)}})),this._$el.on("blur",(function(e){!t._dd.isMouseOver&&t._dd.isDdMouseOver&&t._dd.isShown()?(setTimeout((function(){t._$el.focus()})),t._$el.focus()):t._dd.isMouseOver||(t._isSelectElement?t._dd.isItemFocused?t._dd.selectFocusItem():null!==t._selectedItem&&""!==t._$el.val()?t._$el.trigger("autocomplete.select",t._selectedItem):""!==t._$el.val()&&null!==t._defaultValue?(t._$el.val(t._defaultText),t._selectHiddenField.val(t._defaultValue),t._selectedItem=null,t._$el.trigger("autocomplete.select",t._selectedItem)):(t._$el.val(""),t._selectHiddenField.val(""),t._selectedItem=null,t._$el.trigger("autocomplete.select",t._selectedItem)):null===t._selectedItem&&t._$el.trigger("autocomplete.freevalue",t._$el.val()),t._dd.hide())})),this._$el.on("autocomplete.select",(function(e,i){t._selectedItem=i,t.itemSelectedDefaultHandler(i)})),this._$el.on("paste",(function(e){setTimeout((function(){t._$el.trigger("keyup",e)}),0)}))},t.prototype.handlerTyped=function(t){(null===this._settings.events.typed||(t=this._settings.events.typed(t,this._$el)))&&(t.length>=this._settings.minLength?(this._searchText=t,this.handlerPreSearch()):this._dd.hide())},t.prototype.handlerPreSearch=function(){if(null!==this._settings.events.searchPre){var t=this._settings.events.searchPre(this._searchText,this._$el);if(!t)return;this._searchText=t}this.handlerDoSearch()},t.prototype.handlerDoSearch=function(){var t=this;null!==this._settings.events.search?this._settings.events.search(this._searchText,(function(e){t.postSearchCallback(e)}),this._$el):this.resolver&&this.resolver.search(this._searchText,(function(e){t.postSearchCallback(e)}))},t.prototype.postSearchCallback=function(t){this._settings.events.searchPost&&"boolean"==typeof(t=this._settings.events.searchPost(t,this._$el))&&!t||this.handlerStartShow(t)},t.prototype.handlerStartShow=function(t){this._dd.updateItems(t,this._searchText)},t.prototype.itemSelectedDefaultHandler=function(t){if(null!=t){var e=this._settings.formatResult(t);"string"==typeof e&&(e={text:e}),this._$el.val(e.text),this._isSelectElement&&this._selectHiddenField.val(e.value)}else this._$el.val(""),this._isSelectElement&&this._selectHiddenField.val("");this._selectedItem=t,this._dd.hide()},t.prototype.defaultFormatResult=function(t){return"string"==typeof t?{text:t}:t.text?t:{text:t.toString()}},t.prototype.manageAPI=function(t,e){"set"===t?this.itemSelectedDefaultHandler(e):"clear"===t?this.itemSelectedDefaultHandler(null):"show"===t?this._$el.trigger("keyup"):"updateResolver"===t&&(this.resolver=new o(e))},t.NAME="autoComplete",t}();!function(t,e,i){t.fn[a.NAME]=function(e,i){return this.each((function(){var s;(s=t(this).data(a.NAME))||(s=new a(this,e),t(this).data(a.NAME,s)),s.manageAPI(e,i)}))}}(jQuery,window,document)}])}},e={};function i(s){var n=e[s];if(void 0!==n)return n.exports;var o=e[s]={exports:{}};return t[s](o,o.exports,i),o.exports}(()=>{"use strict";i(197);class t{constructor(){this.setCurrentNavItem()}setCurrentNavItem(){const t=window.location.pathname;$(`a.nav-link[href="${t}"]`).addClass("active")}}(new class{constructor(){this.recipeForm=$("#recipeForm"),this.ingredientRowClone=$("#ingredientInputRow").clone(),this.successAlert=$('\n      <div class="alert alert-success alert-dismissible fade show" role="alert"\n           id="successAlert">\n        <strong>Success!</strong> A new recipe has been added.\n        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n          <span aria-hidden="true">&times;</span>\n        </button>\n      </div>'),this.bindFormControls()}init(){new t}bindFormControls(){this.recipeForm.on("click","#submit",this.handleSubmit.bind(this)),this.recipeForm.on("click","#addIngredient",this.handleAddIngredient.bind(this)),this.recipeForm.on("blur","#inputQuantity",this.scrapeAndValidateForm.bind(this)),this.createAutocomplete(this.recipeForm.find("#inputIngredient"))}createAutocomplete(t){t.autoComplete({resolverSettings:{url:"/ingredients"}})}handleAddIngredient(){const t=this.ingredientRowClone.clone();t.insertBefore("#addNewIngredientRow"),this.createAutocomplete(t.find("#inputIngredient"))}handleSubmit(t){t.preventDefault();const e=this.scrapeAndValidateForm();this.recipeForm.get(0).checkValidity()&&this.sendRecipeToServer(e),this.recipeForm.removeClass("needs-validation").addClass("was-validated")}scrapeAndValidateForm(){const t={},e=this.recipeForm.find("#inputRecipeName").val(),i=this.recipeForm.find("#inputDescription").val(),s=this.recipeForm.find("#inputInstructions").val();return t.name=e,t.description=i,t.instructions=s,t.ingredients=[],this.recipeForm.find(".ingredientInputRow").each((function(){const e=$(this),i=e.find("#inputQuantity"),s=i.val(),n=e.find("#inputUnit").val(),o=e.find('input[name="inputIngredient"]').val();s<=0?i.get(0).setCustomValidity("Quantity must be > 0"):i.get(0).setCustomValidity(""),t.ingredients.push({quantity:s,unit:n,ingredient:o})})),t}sendRecipeToServer(t){const e={};e[CSRF_HEADER_NAME]=CSRF_TOKEN;const i=this.recipeForm.find(":input");i.prop("disabled",!0),$.ajax("/addrecipes",{data:JSON.stringify(t),contentType:"application/json",method:"PUT",headers:e,processData:!1}).done(((t,e)=>{console.log("success",t,e)})).fail(((t,e,i)=>{console.log("error",e,i)})).always((()=>{i.prop("disabled",!1),this.resetForm(),this.showSuccessAlert()}))}resetForm(){this.recipeForm.removeClass("was-validated").addClass("needs-validation"),this.recipeForm.find(":input").not(":button, :submit").val(""),this.recipeForm.find(".ingredientInputRow").remove();const t=this.ingredientRowClone.clone();t.insertBefore("#addNewIngredientRow"),this.createAutocomplete(t.find("#inputIngredient"))}showSuccessAlert(){const t=this.successAlert.clone();t.appendTo(this.recipeForm),setTimeout((()=>{t.alert("close")}),4e3)}}).init()})()})();