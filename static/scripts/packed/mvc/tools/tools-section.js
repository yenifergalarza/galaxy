define(["utils/utils","mvc/ui/ui-table","mvc/ui/ui-misc","mvc/tools/tools-repeat","mvc/tools/tools-select-content","mvc/tools/tools-input"],function(d,b,g,c,a,e){var f=Backbone.View.extend({initialize:function(i,h){this.app=i;this.inputs=h.inputs;h.cls_tr="section-row";this.table=new b.View(h);this.setElement(this.table.$el);this.render()},render:function(){this.table.delAll();for(var h in this.inputs){this._add(this.inputs[h])}},_add:function(j){var i=this;var h=jQuery.extend(true,{},j);h.id=d.uuid();this.app.input_list[h.id]=h;var k=h.type;switch(k){case"conditional":this._addConditional(h);break;case"repeat":this._addRepeat(h);break;default:this._addRow(k,h)}},_addConditional:function(h){h.label=h.test_param.label;h.value=h.test_param.value;var j=this._addRow("conditional",h);for(var l in h.cases){var k=h.id+"-section-"+l;var m=new f(this.app,{inputs:h.cases[l].inputs,cls:"ui-table-plain"});m.$el.addClass("ui-table-form-section");this.table.add(m.$el);this.table.append(k)}},_addRepeat:function(o){var r=this;var p=0;function m(i,t){var s=o.id+"-section-"+(p++);var u=null;if(t){u=function(){k.del(s);k.retitle(o.title);r.app.refresh()}}var v=new f(r.app,{inputs:i,cls:"ui-table-plain"});k.add({id:s,title:o.title,$el:v.$el,ondel:u});k.retitle(o.title)}var k=new c.View({title_new:o.title,max:o.max,onnew:function(){m(o.inputs,true);r.app.refresh()}});var h=o.min;var q=_.size(o.cache);for(var l=0;l<Math.max(q,h);l++){var n=null;if(l<q){n=o.cache[l]}else{n=o.inputs}m(n,l>=h)}var j=new e({label:o.title,help:o.help,field:k});j.$el.addClass("ui-table-form-section");this.table.add(j.$el);this.table.append(o.id)},_addRow:function(j,h){var l=h.id;var i=null;switch(j){case"text":i=this._fieldText(h);break;case"select":i=this._fieldSelect(h);break;case"data":i=this._fieldData(h);break;case"data_column":h.is_dynamic=false;i=this._fieldSelect(h);break;case"conditional":i=this._fieldConditional(h);break;case"hidden":i=this._fieldHidden(h);break;case"integer":i=this._fieldSlider(h);break;case"float":i=this._fieldSlider(h);break;case"boolean":i=this._fieldBoolean(h);break;case"genomebuild":i=this._fieldSelect(h);break;default:this.app.incompatible=true;if(h.options){i=this._fieldSelect(h)}else{i=this._fieldText(h)}console.debug("tools-form::_addRow() : Auto matched field type ("+j+").")}if(h.value!==undefined){i.value(h.value)}this.app.field_list[l]=i;var k=new e({label:h.label,optional:h.optional,help:h.help,field:i});this.app.element_list[l]=k;this.table.add(k.$el);this.table.append(l);return this.table.get(l)},_fieldConditional:function(h){var j=this;var k=[];for(var l in h.test_param.options){var m=h.test_param.options[l];k.push({label:m[0],value:m[1]})}return new g.Select.View({id:"field-"+h.id,data:k,onchange:function(u){for(var s in h.cases){var o=h.cases[s];var r=h.id+"-section-"+s;var n=j.table.get(r);var q=false;for(var p in o.inputs){var t=o.inputs[p].type;if(t&&t!=="hidden"){q=true;break}}if(o.value==u&&q){n.fadeIn("fast")}else{n.hide()}}}})},_fieldData:function(h){var i=this;var j=h.id;return new a.View(this.app,{id:"field-"+j,extensions:h.extensions,multiple:h.multiple,onchange:function(q){var o=q.values[0];var m=o.id;var p=o.src;var l=i.app.tree.references(j,"data_column");if(l.length<=0){console.debug("tool-form::field_data() -  Data column parameters unavailable.");return}for(var n in l){var k=i.app.field_list[l[n]];k.wait&&k.wait()}i.app.content.getDetails({id:m,src:p,success:function(y){var B=null;if(y){console.debug("tool-form::field_data() - Selected content "+m+".");if(p=="hdca"&&y.elements&&y.elements.length>0){y=y.elements[0].object}B=y.metadata_column_types;if(!B){console.debug("tool-form::field_data() - FAILED: Could not find metadata for content "+m+".")}}else{console.debug("tool-form::field_data() - FAILED: Could not find content "+m+".")}for(var u in l){var w=i.app.input_list[l[u]];var x=i.app.field_list[l[u]];if(!w||!x){console.debug("tool-form::field_data() - FAILED: Column not found.")}var t=w.numerical;var s=[];for(var A in B){var z=B[A];var r=(parseInt(A)+1);var v="Text";if(z=="int"||z=="float"){v="Number"}if(z=="int"||z=="float"||!t){s.push({label:"Column: "+r+" ["+v+"]",value:r})}}if(x){x.update(s);if(!x.exists(x.value())){x.value(x.first())}x.show()}}}})}})},_fieldSelect:function(h){if(h.is_dynamic){this.app.incompatible=true}var j=[];for(var k in h.options){var l=h.options[k];j.push({label:l[0],value:l[1]})}var m=g.Select;switch(h.display){case"checkboxes":m=g.Checkbox;break;case"radio":m=g.Radio;break}return new m.View({id:"field-"+h.id,data:j,multiple:h.multiple})},_fieldText:function(h){return new g.Input({id:"field-"+h.id,area:h.area})},_fieldSlider:function(h){h.min=h.min||0;h.max=h.max||100000;var i=1;if(h.type=="float"){i=(h.max-h.min)/10000}return new g.Slider.View({id:"field-"+h.id,min:h.min,max:h.max,step:i})},_fieldHidden:function(h){return new g.Hidden({id:"field-"+h.id})},_fieldBoolean:function(h){return new g.RadioButton.View({id:"field-"+h.id,data:[{label:"Yes",value:"true"},{label:"No",value:"false"}]})}});return{View:f}});