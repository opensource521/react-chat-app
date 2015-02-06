"use strict";if("undefined"!=typeof window&&"undefined"==typeof exports&&"object"!=typeof window.utils&&(window.utils={}),+function(a,b,c,d,e,f){function g(f){var g=e.get("raptorize"),h=d(),i=!g||h.isAfter(g);if(i){var j=f.toLowerCase(),k=["clever girl","shoot her! shoot her!","hold on to your butts","spared no expense","life finds a way","it's a unix system! i know this!"],l=c.some(k,function(a){return j.indexOf(a)>-1?!0:!1});l&&(e.set("raptorize",d().add(2,"hours").format()),b(a).raptorize({enterOn:"timer",delayTime:0}))}return f}f.message=function(a){var b=[g];c.each(b,function(b){a=b(a)})}}(window,$,_,moment,store,window.utils.eggs={}),"undefined"!=typeof window&&"undefined"==typeof exports&&"object"!=typeof window.utils&&(window.utils={}),"undefined"!=typeof exports)var _=require("underscore");!function(a){function b(a){return a.trim()}function c(a){var b=/\B@(\w+)(?!@)\b/g;return a.replace(b,"<strong>@$1</strong>")}function d(a,b){if(!b.rooms)return a;var c=/\B(\#[a-z0-9_]+)\b/g;return a.replace(c,function(a){var c=a.substring(1),d=b.rooms.find(function(a){return a.attributes.slug===c});return d?'<a href="#!/room/'+d.id+'">&#35;'+c+"</a>":a})}function e(a){var b=/^\s*((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;'"!()]*[-A-Z0-9+&@#\/%=~_|][.](jpe?g|png|gif))\s*$/i,c=/((https?|ftp):\/\/[-A-Z0-9+&*@#\/%?=~_|!:,.;'"!()]*[-A-Z0-9+&@#\/%=~_|])/gi;return b.test(a)?a.replace(b,function(a){var b=encodeURI(_.unescape(a));return'<a class="thumbnail" href="'+b+'" target="_blank"><img src="'+b+'" alt="Pasted Image" /></a>'}):a.replace(c,function(a){var b=encodeURI(_.unescape(a));return'<a href="'+b+'" target="_blank">'+a+"</a>"})}function f(a,b){var c=new RegExp("\\B(:[a-z0-9_\\+\\-]+:?)[\\b]?","ig");return a.replace(c,function(a){var c=a.split(":")[1],d=_.find(b.emotes,function(a){return a.emote===c});if(!d)return a;var e=_.escape(d.image),f=_.escape(":"+d.emote+":"),g=_.escape(d.size||20);return'<img class="emote" src="'+e+'" title="'+f+'" alt="'+f+'" width="'+g+'" height="'+g+'" />'})}function g(a,b){return _.each(b.replacements,function(b){a=a.replace(new RegExp(b.regex,"ig"),b.template)}),a}a.format=function(a,h){var i=[b,c,d,e,f,g];return _.each(i,function(b){a=b(a,h)}),a}}("undefined"==typeof exports?window.utils.message={}:exports);var UserModel=Backbone.Model.extend({}),UsersCollection=Backbone.Collection.extend({model:UserModel}),MessageModel=Backbone.Model.extend({}),MessagesCollection=Backbone.Collection.extend({model:MessageModel}),FileModel=Backbone.Model.extend({}),FilesCollection=Backbone.Collection.extend({model:FileModel}),RoomModel=Backbone.Model.extend({initialize:function(){this.messages=new MessagesCollection,this.users=new UsersCollection,this.files=new FilesCollection,this.lastMessage=new Backbone.Model,this.users.on("add",_.bind(function(a){this.trigger("users:add",a,this)},this)),this.users.on("remove",function(a){this.trigger("users:remove",a,this)},this)},loaded:!1}),RoomsCollection=Backbone.Collection.extend({model:RoomModel,initialize:function(){this.current=new Backbone.Model,this.last=new Backbone.Model}});+function(a,b,c){a.LCB=a.LCB||{},a.LCB.NotificationsView=Backbone.View.extend({el:"#lcb-notifications",focus:!0,count:0,events:{"click [name=desktop-notifications]":"toggleDesktopNotifications"},initialize:function(){this.render()},render:function(){var a=this.$("[name=desktop-notifications]");return a.find(".disabled").show().siblings().hide(),c.isSupported?(c.permissionLevel()===c.PERMISSION_GRANTED&&a.find(".enabled").show().siblings().hide(),void(c.permissionLevel()===c.PERMISSION_DENIED&&a.find(".blocked").show().siblings().hide())):void a.attr("disabled",!0)},toggleDesktopNotifications:function(){var a=this;c.isSupported&&c.requestPermission(function(){a.render()})}})}(window,$,notify),+function(a,b,c){a.LCB=a.LCB||{},a.LCB.BrowserView=Backbone.View.extend({events:{"submit .lcb-rooms-add":"create","keyup .lcb-rooms-browser-filter-input":"filter","change .lcb-rooms-switch":"toggle","click .lcb-rooms-switch-label":"toggle"},initialize:function(a){this.client=a.client,this.template=Handlebars.compile(b("#template-room-browser-item").html()),this.userTemplate=Handlebars.compile(b("#template-room-browser-item-user").html()),this.rooms=a.rooms,this.rooms.on("add",this.add,this),this.rooms.on("remove",this.remove,this),this.rooms.on("change:description change:name",this.update,this),this.rooms.on("change:lastActive",c.debounce(this.updateLastActive,200),this),this.rooms.on("change:joined",this.updateToggles,this),this.rooms.on("users:add",this.addUser,this),this.rooms.on("users:remove",this.removeUser,this),this.rooms.on("users:add users:remove add remove",this.sort,this),this.rooms.current.on("change:id",function(a,b){"list"===b&&this.sort()},this)},updateToggles:function(a,b){this.$(".lcb-rooms-switch[data-id="+a.id+"]").prop("checked",b)},toggle:function(a){a.preventDefault();var c=b(a.currentTarget),d=c.is(":checkbox")&&c||c.siblings('[type="checkbox"]'),e=d.data("id"),f=this.rooms.get(e);f&&(!d.is(":checked")&&this.client.joinRoom(f.id)||this.rooms.get(f.id).get("joined")&&this.client.leaveRoom(f.id))},add:function(a){var a=a.toJSON?a.toJSON():a,b=c.extend(a,{lastActive:moment(a.lastActive).calendar()});this.$(".lcb-rooms-list").append(this.template(b))},remove:function(a){this.$(".lcb-rooms-list-item[data-id="+a.id+"]").remove()},update:function(a){this.$(".lcb-rooms-list-item[data-id="+a.id+"] .lcb-rooms-list-item-name").text(a.get("name")),this.$(".lcb-rooms-list-item[data-id="+a.id+"] .lcb-rooms-list-item-description").text(a.get("description"))},updateLastActive:function(a){this.$(".lcb-rooms-list-item[data-id="+a.id+"] .lcb-rooms-list-item-last-active .value").text(moment(a.get("lastActive")).calendar())},sort:function(a){var c=this,d=this.$(".lcb-rooms-list-item");this.$el.is(":visible")&&a&&a.id===this.client.user.id||(d.sort(function(a,d){var e=c.rooms.get(b(a).data("id")),f=c.rooms.get(b(d).data("id")),g=e.users.length,h=f.users.length,i=e.get("joined"),j=f.get("joined");if(i&&j||!i&&!j){if(g>h)return-1;if(h>g)return 1}return i?-1:j?1:0}),d.detach().appendTo(this.$(".lcb-rooms-list")))},filter:function(a){a.preventDefault();var c=b(a.currentTarget),d=c.val().toLowerCase();this.$(".lcb-rooms-list-item").each(function(){var a=b(this).find(".lcb-rooms-list-item-name").text().toLowerCase();b(this).toggle(a.indexOf(d)>=0)})},create:function(a){a.preventDefault();var b=this.$("#lcb-add-room"),c=this.$(a.target),d={name:this.$(".lcb-room-name").val().trim(),slug:this.$(".lcb-room-slug").val().trim(),description:this.$(".lcb-room-description").val(),callback:function(){b.modal("hide"),c.trigger("reset")}};return d.name?d.slug?void this.client.events.trigger("rooms:create",d):void $slug.parent().addClass("has-error"):void $name.parent().addClass("has-error")},addUser:function(a,b){this.$('.lcb-rooms-list-item[data-id="'+b.id+'"]').find(".lcb-rooms-list-users").prepend(this.userTemplate(a.toJSON()))},removeUser:function(a,b){this.$('.lcb-rooms-list-item[data-id="'+b.id+'"]').find('.lcb-rooms-list-user[data-id="'+a.id+'"]').remove()}})}(window,$,_),+function(a,b,c){a.LCB=a.LCB||{},a.LCB.RoomUsersView=Backbone.View.extend({initialize:function(){this.template=Handlebars.compile(b("#template-user").html()),this.collection.on("add remove",function(){this.count()},this),this.collection.on("add",function(a){this.add(a.toJSON())},this),this.collection.on("change",function(a){this.update(a.toJSON())},this),this.collection.on("remove",function(a){this.remove(a.id)},this),this.render()},render:function(){this.collection.each(function(a){this.add(a.toJSON())},this),this.count()},add:function(a){this.$(".lcb-room-sidebar-list").prepend(this.template(a))},remove:function(a){this.$(".lcb-room-sidebar-user[data-id="+a+"]").remove()},count:function(){this.$(".lcb-room-sidebar-users-count").text(this.collection.length)},update:function(a){this.$(".lcb-room-sidebar-user[data-id="+a.id+"]").replaceWith(this.template(a))}}),a.LCB.RoomView=Backbone.View.extend({events:{"scroll .lcb-messages":"updateScrollLock","keypress .lcb-entry-input":"sendMessage","click .lcb-entry-button":"sendMessage","DOMCharacterDataModified .lcb-room-heading, .lcb-room-description":"sendMeta","click .lcb-room-toggle-sidebar":"toggleSidebar","click .show-edit-room":"showEditRoom","click .hide-edit-room":"hideEditRoom","click .submit-edit-room":"submitEditRoom","click .archive-room":"archiveRoom","click .lcb-room-poke":"poke"},initialize:function(c){this.client=c.client,this.template=c.template,this.messageTemplate=Handlebars.compile(b("#template-message").html()),this.render(),this.model.on("messages:new",this.addMessage,this),this.model.on("change",this.updateMeta,this),this.model.on("remove",this.goodbye,this),this.usersList=new a.LCB.RoomUsersView({el:this.$(".lcb-room-sidebar-users"),collection:this.model.users})},render:function(){this.$el=b(this.template(c.extend(this.model.toJSON(),{sidebar:store.get("sidebar")}))),this.$messages=this.$(".lcb-messages"),this.scrollLocked=!0,this.$messages.on("scroll",c.bind(this.updateScrollLock,this)),this.atwhoMentions(),this.atwhoAllMentions(),this.atwhoRooms(),this.atwhoEmotes()},atwhoTplEval:function(a,b){var c;try{return a.replace(/\$\{([^\}]*)\}/g,function(a,c){return(b[c]||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&apos;").replace(/</g,"&lt;").replace(/>/g,"&gt;")})}catch(d){return c=d,""}},getAtwhoUserFilter:function(a){return function(b){var c=b.toLowerCase(),d=a.filter(function(a){var b=a.attributes;b.safeName||(b.safeName=b.displayName.replace(/\W/g,""));var d=b.username.toLowerCase(),e=d.indexOf(c);if(e>-1)return b.atwho_order=e,!0;var f=b.safeName.toLowerCase(),g=f.indexOf(c);return g>-1?(b.atwho_order=g+b.username.length,!0):!1});return d.map(function(a){return a.attributes})}},atwhoMentions:function(){function a(a,b){return b.sort(function(a,b){return a.atwho_order-b.atwho_order})}this.$(".lcb-entry-input").atwho({at:"@",tpl:'<li data-value="@${username}"><img src="https://www.gravatar.com/avatar/${avatar}?s=20" height="20" width="20" /> @${username} <small>${displayName}</small></li>',callbacks:{filter:this.getAtwhoUserFilter(this.model.users),sorter:a,tpl_eval:this.atwhoTplEval}})},atwhoAllMentions:function(){function a(a,b,d){var e=c.client.getUsersSync(),f=c.getAtwhoUserFilter(e);return f(a,b,d)}function b(a,b){return b.sort(function(a,b){return a.atwho_order-b.atwho_order})}var c=this;this.$(".lcb-entry-input").atwho({at:"@@",tpl:'<li data-value="@${username}"><img src="https://www.gravatar.com/avatar/${avatar}?s=20" height="20" width="20" /> @${username} <small>${displayName}</small></li>',callbacks:{filter:a,sorter:b,tpl_eval:c.atwhoTplEval}})},atwhoRooms:function(){function a(a){var c=a.toLowerCase(),d=b.filter(function(a){var b=a.attributes.slug.toLowerCase();return b.indexOf(c)>-1});return d.map(function(a){return a.attributes})}var b=this.client.rooms;this.$(".lcb-entry-input").atwho({at:"#",search_key:"slug",callbacks:{filter:a,tpl_eval:this.atwhoTplEval},tpl:'<li data-value="#${slug}">#${slug} <small>${name}</small></li>'})},atwhoEmotes:function(){var a=this;this.client.getEmotes(function(b){a.$(".lcb-entry-input").atwho({at:":",search_key:"emote",data:b,tpl:'<li data-value=":${emote}:"><img src="${image}" height="32" width="32" alt=":${emote}:" /> :${emote}:</li>'})})},goodbye:function(){swal("Archived!",'"'+this.model.get("name")+'" has been archived.',"warning")},updateMeta:function(){this.$(".lcb-room-heading .name").text(this.model.get("name")),this.$(".lcb-room-heading .slug").text("#"+this.model.get("slug")),this.$(".lcb-room-description").text(this.model.get("description"))},sendMeta:function(){this.model.set({name:this.$(".lcb-room-heading").text(),description:this.$(".lcb-room-description").text()}),this.client.events.trigger("rooms:update",{id:this.model.id,name:this.model.get("name"),description:this.model.get("description")})},showEditRoom:function(a){a&&a.preventDefault(),this.$(".lcb-room-edit").modal()},hideEditRoom:function(a){a&&a.preventDefault(),this.$(".lcb-room-edit").modal("hide")},submitEditRoom:function(a){a&&a.preventDefault();var b=this.$('.edit-room input[name="name"]').val(),c=this.$('.edit-room textarea[name="description"]').val();this.client.events.trigger("rooms:update",{id:this.model.id,name:b,description:c}),this.$(".lcb-room-edit").modal("hide")},archiveRoom:function(){var a=this;swal({title:'Do you really want to archive "'+this.model.get("name")+'"?',text:"You will not be able to open it!",type:"error",confirmButtonText:"Yes, I'm sure",allowOutsideClick:!0,confirmButtonColor:"#DD6B55",showCancelButton:!0,closeOnConfirm:!1},function(b){b&&(a.$(".lcb-room-edit").modal("hide"),a.client.events.trigger("rooms:archive",{room:a.model.id}))})},sendMessage:function(a){if(!("keypress"===a.type&&13!==a.keyCode||a.altKey)&&(a.preventDefault(),this.client.status.get("connected"))){var b=this.$(".lcb-entry-input");b.val()&&(this.client.events.trigger("messages:send",{room:this.model.id,text:b.val()}),b.val(""))}},addMessage:function(c){c.paste=/\n/i.test(c.text);var d=moment(c.posted);c.fragment=this.lastMessageOwner===c.owner.id&&d.diff(this.lastMessagePosted,"minutes")<5,c.own=this.client.user.id===c.owner.id,c.mentioned=new RegExp("\\B@("+this.client.user.get("username")+")(?!@)\\b","i").test(c.text);var e=b(this.messageTemplate(c).trim()),f=e.find(".lcb-message-text"),g=this;this.formatMessage(f.html(),function(b){f.html(b),e.find("time").updateTimeStamp(),g.$messages.append(e),g.lastMessageOwner=c.owner.id,g.lastMessagePosted=d,g.scrollMessages(),c.historical||a.utils.eggs.message(c.text)})},formatMessage:function(b,c){var d=this.client;d.getEmotes(function(e){d.getReplacements(function(f){var g={emotes:e,replacements:f,rooms:d.rooms},h=a.utils.message.format(b,g);c(h)})})},updateScrollLock:function(){return this.scrollLocked=this.$messages[0].scrollHeight-this.$messages.scrollTop()-5<=this.$messages.outerHeight(),this.scrollLocked},scrollMessages:function(a){(a||this.scrollLocked)&&(this.$messages[0].scrollTop=this.$messages[0].scrollHeight)},toggleSidebar:function(c){c&&c.preventDefault&&c.preventDefault(),this.$el.siblings(".lcb-room").andSelf().toggleClass("lcb-room-sidebar-opened"),b(a).width()>767&&(this.scrollMessages(),store.set("sidebar",this.$el.hasClass("lcb-room-sidebar-opened")))},destroy:function(){this.undelegateEvents(),this.$el.removeData().unbind(),this.remove(),Backbone.View.prototype.remove.call(this)},poke:function(a){var c=b(a.currentTarget),d=c.closest("[data-id],[data-owner]"),e=d.data("owner")||d.data("id"),f=this.model.users.findWhere({id:e});if(f){var g=this.$(".lcb-entry-input"),h=b.trim(g.val()),i=(h.length>0?" ":"")+"@"+f.get("username")+" ";g.val(h+i).focus()}}})}(window,$,_),+function(a){a.LCB=a.LCB||{},a.LCB.StatusView=Backbone.View.extend({initialize:function(a){var b=this;this.client=a.client,this.client.status.on("change:connected",function(a,c){b.$el.find('[data-status="connected"]').toggle(c),b.$el.find('[data-status="disconnected"]').toggle(!c)})}})}(window,$,_),+function(a,b,c){a.LCB=a.LCB||{},a.LCB.WindowView=Backbone.View.extend({el:"html",keys:{"up+shift+alt down+shift+alt":"nextRoom","s+shift+alt":"toggleRoomSidebar","space+shift+alt":"recallRoom"},initialize:function(d){this.client=d.client,this.rooms=d.rooms,this.originalTitle=this.$("title").text(),this.title=this.originalTitle,this.focus=!0,this.count=0,this.mentions=0,this.activeDesktopNotifications=[],this.activeDesktopNotificationMentions=[],b(a).on("focus blur",c.bind(this.focusBlur,this)),this.rooms.current.on("change:id",function(a,b){var c=this.rooms.get(b),d=c?c.get("name"):"Rooms";this.updateTitle(d)},this),this.rooms.on("change:name",function(a){a.id===this.rooms.current.get("id")&&this.updateTitle(a.get("name"))},this),this.rooms.on("messages:new",this.onNewMessage,this)},updateTitle:function(a){this.title=a?b("<pre />").text(a).html()+" &middot; "+this.originalTitle:this.originalTitle,this.$("title").html(this.title)},nextRoom:function(a){var b=40===a.keyCode?"next":"prev",c=40===a.keyCode?"first":"last",d=this.$(".lcb-tabs").find("[data-id].selected")[b]();0===d.length&&(d=this.$(".lcb-tabs").find("[data-id]:"+c)),this.client.events.trigger("rooms:switch",d.data("id"))},recallRoom:function(){this.client.events.trigger("rooms:switch",this.rooms.last.get("id"))},toggleRoomSidebar:function(a){a.preventDefault();var b=this.client.view.panes.views[this.rooms.current.get("id")];b&&b.toggleSidebar&&b.toggleSidebar()},focusBlur:function(a){this.focus="focus"===a.type,this.focus&&(clearInterval(this.titleTimer),this.count=0,this.mentions=0,this.focus=!0,this.$("title").html(this.title),this.titleTimer=!1,this.titleTimerFlip=!1)},onNewMessage:function(a){this.countMessage(a),this.flashTitle(a),this.createDesktopNotification(a)},countMessage:function(a){if(!this.focus&&!a.historical){++this.count;var b=this.client.user.get("username"),c=new RegExp("\\B@("+b+")(?!@)\\b","i");c.test(a.text)&&++this.mentions}},flashTitle:function(a){if(!this.focus&&!a.historical&&!this.titleTimer){this._flashTitle();var b=c.bind(this._flashTitle,this);this.titleTimer=setInterval(b,1e3)}},_flashTitle:function(){var a="";this.count>0&&(a+="("+parseInt(this.count),this.mentions>0&&(a+="/"+parseInt(this.mentions)+"@"),a+=") ");var b=this.titleTimerFlip?this.title:a+this.title;this.$("title").html(b),this.titleTimerFlip=!this.titleTimerFlip},createDesktopNotification:function(b){if(!this.focus&&!b.historical&&notify.isSupported&&notify.permissionLevel()==notify.PERMISSION_GRANTED){var c=this,d=b.room.id,e=b.owner.avatar,f="https://www.gravatar.com/avatar/"+e+"?s=50",g=b.owner.displayName+" in "+b.room.name,h=b.mentioned,i=notify.createNotification(g,{body:b.text,icon:f,tag:b.id,onclick:function(){a.focus(),c.client.events.trigger("rooms:switch",d)}});if(h)return void this.activeDesktopNotificationMentions.push(i);this.activeDesktopNotifications.length>2&&(this.activeDesktopNotifications[0].close(),this.activeDesktopNotifications.shift()),this.activeDesktopNotifications.push(i),setTimeout(function(){i.close()},5e3)}}})}(window,$,_),+function(a,b){a.LCB=a.LCB||{},a.LCB.TabsView=Backbone.View.extend({events:{"click .lcb-tab-close":"leave"},initialize:function(a){this.client=a.client,this.template=Handlebars.compile(b("#template-room-tab").html()),this.rooms=a.rooms,this.rooms.on("change:joined",function(a,b){return b?void this.add(a.toJSON()):void this.remove(a.id)},this),this.rooms.on("change:name change:description",this.update,this),this.rooms.current.on("change:id",function(a,b){this["switch"](b),this.clearAlerts(b)},this),this.rooms.on("messages:new",this.alert,this),this["switch"](this.rooms.current.get("id")),this.render()},add:function(a){this.$el.append(this.template(a))},remove:function(a){this.$el.find(".lcb-tab[data-id="+a+"]").remove()},update:function(a){this.$el.find(".lcb-tab[data-id="+a.id+"] .lcb-tab-title").text(a.get("name"))},"switch":function(a){a||(a="list"),this.$el.find(".lcb-tab").removeClass("selected").filter("[data-id="+a+"]").addClass("selected")},leave:function(a){a.preventDefault();var c=b(a.currentTarget).closest("[data-id]").data("id");this.client.events.trigger("rooms:leave",c)},alert:function(a){var b=this.$(".lcb-tab[data-id="+a.room.id+"]"),c=b.find(".lcb-tab-alerts-total"),d=b.find(".lcb-tab-alerts-mentions");if(!a.historical&&this.rooms.current.get("id")!==a.room.id&&0!==b.length){var e=parseInt(b.data("count-total"))||0,f=parseInt(b.data("count-mentions"))||0;b.data("count-total",++e),c.text(e),new RegExp("\\B@("+this.client.user.get("username")+")(?!@)\\b","i").test(a.text)&&(b.data("count-mentions",++f),d.text(f))}},clearAlerts:function(a){var b=this.$(".lcb-tab[data-id="+a+"]"),c=b.find(".lcb-tab-alerts-total"),d=b.find(".lcb-tab-alerts-mentions");b.data("count-total",0).data("count-mentions",0),c.text(""),d.text("")}}),a.LCB.PanesView=Backbone.View.extend({initialize:function(a){this.client=a.client,this.template=Handlebars.compile(b("#template-room").html()),this.rooms=a.rooms,this.views={},this.rooms.on("change:joined",function(a,b){return b?void this.add(a):void this.remove(a.id)},this),this.rooms.current.on("change:id",function(a,b){this["switch"](b)},this),this["switch"](this.rooms.current.get("id"))},"switch":function(c){c||(c="list");var d=this.$el.find(".lcb-pane[data-id="+c+"]");d.show().siblings().hide(),b(a).width()>767&&d.find("[autofocus]").focus(),this.views[c]&&this.views[c].scrollMessages(!0)},add:function(b){this.views[b.id]||(this.views[b.id]=new a.LCB.RoomView({client:this.client,template:this.template,model:b}),this.$el.append(this.views[b.id].$el))},remove:function(a){this.views[a]&&(this.views[a].destroy(),delete this.views[a])}})}(window,$,_),+function(a,b,c){a.LCB=a.LCB||{},a.LCB.ModalView=Backbone.View.extend({events:{"submit form":"submit"},initialize:function(){this.render()},render:function(){this.$("form.validate").validate(),this.$el.on("shown.bs.modal hidden.bs.modal",c.bind(this.refresh,this))},refresh:function(){var a=this;this.$("[data-model]").each(function(){b(this).val&&b(this).val(a.model.get(b(this).data("model")))})},success:function(){swal("Updated!","","success"),this.$el.modal("hide")},error:function(){swal("Woops!","","error")},submit:function(a){a&&a.preventDefault();var d=this.$("form[action]"),e={type:d.attr("method")||"POST",url:d.attr("action"),data:d.serialize(),dataType:"json"};this.success&&(e.success=c.bind(this.success,this)),this.error&&(e.error=c.bind(this.error,this)),this.complete&&(e.complete=c.bind(this.complete,this)),b.ajax(e)}}),a.LCB.ProfileModalView=a.LCB.ModalView.extend({success:function(){swal("Profile Updated!","Your profile has been updated.","success"),this.$el.modal("hide")},error:function(){swal("Woops!","Your profile was not updated.","error")}}),a.LCB.AccountModalView=a.LCB.ModalView.extend({success:function(){swal("Account Updated!","Your account has been updated.","success"),this.$el.modal("hide"),this.$('[type="password"]').val("")},error:function(a){var b=a.responseJSON&&a.responseJSON.reason||"Your account was not updated.";swal("Woops!",b,"error")},complete:function(){this.$('[name="current-password"]').val("")}}),a.LCB.AuthTokensModalView=Backbone.View.extend({events:{"click .generate-token":"generateToken","click .revoke-token":"revokeToken"},initialize:function(){this.render()},render:function(){this.$el.on("shown.bs.modal hidden.bs.modal",c.bind(this.refresh,this))},refresh:function(){this.$(".token").val(""),this.$(".generated-token").hide()},getToken:function(){var a=this;b.post("/account/token/generate",function(b){b.token&&(a.$(".token").val(b.token),a.$(".generated-token").show())})},removeToken:function(){var a=this;b.post("/account/token/revoke",function(){a.refresh(),swal("Success","Authentication token revoked!","success")})},generateToken:function(){swal({title:"Are you sure?",text:"This will overwrite any existing authentication token you may have.",type:"warning",showCancelButton:!0,confirmButtonText:"Yes",closeOnConfirm:!0},c.bind(this.getToken,this))},revokeToken:function(){swal({title:"Are you sure?",text:"This will revoke access from any process using your current authentication token.",type:"warning",showCancelButton:!0,confirmButtonText:"Yes",closeOnConfirm:!1},c.bind(this.removeToken,this))}})}(window,$,_),+function(a,b,c){a.LCB=a.LCB||{},a.LCB.ClientView=Backbone.View.extend({el:"#lcb-client",events:{"click .lcb-tab":"toggleSideBar","click .lcb-header-toggle":"toggleSideBar"},initialize:function(b){return this.client=b.client,this.browser=new a.LCB.BrowserView({el:this.$el.find(".lcb-rooms-browser"),rooms:this.client.rooms,client:this.client}),this.tabs=new a.LCB.TabsView({el:this.$el.find(".lcb-tabs"),rooms:this.client.rooms,client:this.client}),this.panes=new a.LCB.PanesView({el:this.$el.find(".lcb-panes"),rooms:this.client.rooms,client:this.client}),this.window=new a.LCB.WindowView({rooms:this.client.rooms,client:this.client}),this.status=new a.LCB.StatusView({el:this.$el.find(".lcb-status-indicators"),client:this.client}),this.accountButton=new a.LCB.AccountButtonView({el:this.$el.find(".lcb-account-button"),model:this.client.user}),this.notifications=new a.LCB.NotificationsView,this.profileModal=new a.LCB.ProfileModalView({el:this.$el.find("#lcb-profile"),model:this.client.user}),this.accountModal=new a.LCB.AccountModalView({el:this.$el.find("#lcb-account"),model:this.client.user}),this.tokenModal=new a.LCB.AuthTokensModalView({el:this.$el.find("#lcb-tokens")}),this.client.status.once("change:connected",c.bind(function(a,b){this.$el.find(".lcb-client-loading").hide(b)},this)),this},toggleSideBar:function(){this.$el.toggleClass("lcb-sidebar-opened")}}),a.LCB.AccountButtonView=Backbone.View.extend({initialize:function(){this.model.on("change",this.update,this)},update:function(a){this.$(".lcb-account-button-username").text("@"+a.get("username")),this.$(".lcb-account-button-name").text(a.get("displayName"))}})}(window,$,_),function(a,b,c){var d=function(a){return this.config=a,this.status=new Backbone.Model,this.user=new UserModel,this.users=new UsersCollection,this.rooms=new RoomsCollection,this.events=c.extend({},Backbone.Events),this};d.prototype.getUser=function(){var a=this;this.socket.emit("account:whoami",function(b){a.user.set(b)})},d.prototype.updateProfile=function(a){var b=this;this.socket.emit("account:profile",a,function(a){b.user.set(a)})},d.prototype.createRoom=function(a){var b=this,c={name:a.name,slug:a.slug,description:a.description},d=a.callback;this.socket.emit("rooms:create",c,function(a){a&&a.id&&(b.rooms.add(a),b.switchRoom(a.id)),d&&d(a)})},d.prototype.getRooms=function(){var a=this;this.socket.emit("rooms:list",{users:!0},function(b){a.rooms.set(b),c.each(b,function(b){b.users&&a.setUsers(b.id,b.users)})})},d.prototype.switchRoom=function(a){if(this.rooms.last.set("id",this.rooms.current.get("id")),!a||"list"===a)return this.rooms.current.set("id","list"),void this.router.navigate("!/",{replace:!0});var b=this.rooms.get(a);return b&&b.get("joined")?(this.rooms.current.set("id",a),void this.router.navigate("!/room/"+b.id,{replace:!0})):void this.joinRoom(a,!0)},d.prototype.updateRoom=function(a){this.socket.emit("rooms:update",a)},d.prototype.roomUpdate=function(a){var b=this.rooms.get(a.id);b&&b.set(a)},d.prototype.addRoom=function(a){this.rooms.add(a)},d.prototype.archiveRoom=function(a){this.socket.emit("rooms:archive",a,function(a){a.id||swal("Unable to Archive!","Unable to archive this room!","error")})},d.prototype.roomArchive=function(a){this.leaveRoom(a.id),this.rooms.remove(a.id)},d.prototype.joinRoom=function(a,b){var d=this;a&&!c.contains(this.joining,a)&&(this.joining=this.joining||[],this.joining.push(a),this.socket.emit("rooms:join",a,function(e){if(e){var f=d.rooms.get(a);f=d.rooms.add(e),f.set("joined",!0),d.getMessages({room:f.id,since_id:f.lastMessage.get("id"),take:200,expand:"owner",reverse:!0},function(a){a.reverse(),d.addMessages(a,!f.get("loaded")),f.set("loaded",!0)}),b&&d.switchRoom(a);var g=store.get("openrooms");g instanceof Array?(c.contains(g,a)||g.push(a),store.set("openrooms",g)):store.set("openrooms",[a])}}),c.defer(function(){d.joining=c.without(d.joining,a)}))},d.prototype.leaveRoom=function(a){var b=this.rooms.get(a);if(b&&b.set("joined",!1),this.socket.emit("rooms:leave",a),a===this.rooms.current.get("id")){var b=this.rooms.get(this.rooms.last.get("id"));this.switchRoom(b&&b.get("joined")?b.id:"")}store.set("openrooms",c.without(store.get("openrooms"),a))},d.prototype.getRoomUsers=function(a,b){this.socket.emit("rooms:users",{room:a},b)},d.prototype.addMessage=function(a){var b=this.rooms.get(a.room);b&&a&&(b.set("lastActive",a.posted),b.lastMessage.set(a),b.trigger("messages:new",a))},d.prototype.addMessages=function(a,b){c.each(a,function(a){b&&(a.historical=!0),this.addMessage(a)},this)},d.prototype.sendMessage=function(a){this.socket.emit("messages:create",a)},d.prototype.getMessages=function(a,b){this.socket.emit("messages:list",a,b)},d.prototype.setUsers=function(a,b){if(a&&b&&b.length){var c=this.rooms.get(a);c&&c.users.set(b)}},d.prototype.addUser=function(a){var b=this.rooms.get(a.room);b&&b.users.add(a)},d.prototype.removeUser=function(a){var b=this.rooms.get(a.room);b&&b.users.remove(a.id)},d.prototype.updateUser=function(a){a.id==this.user.id&&this.user.set(a),this.rooms.each(function(b){var c=b.users.findWhere({id:a.id});c&&c.set(a)},this)},d.prototype.getUsersSync=function(){function a(a){c.users.set(a)}if(this.users.length)return this.users;var c=this;return b.ajax({url:"/users",async:!1,success:a}),this.users},d.prototype.getEmotes=function(a){this.extras=this.extras||{},this.extras.emotes||(this.extras.emotes=b.get("/extras/emotes")),a&&this.extras.emotes.done(a)},d.prototype.getReplacements=function(a){this.extras=this.extras||{},this.extras.replacements||(this.extras.replacements=b.get("/extras/replacements")),a&&this.extras.replacements.done(a)},d.prototype.route=function(){var a=this,b=Backbone.Router.extend({routes:{"!/room/":"list","!/room/:id":"join","*path":"list"},join:function(b){a.switchRoom(b)},list:function(){a.switchRoom("list")}});this.router=new b,Backbone.history.start()},d.prototype.listen=function(){var a=this;this.socket=io.connect(null,{reconnect:!0}),this.socket.on("connect",function(){a.getUser(),a.getRooms(),a.status.set("connected",!0)}),this.socket.on("reconnect",function(){c.each(a.rooms.where({joined:!0}),function(b){a.joinRoom(b.id)})}),this.socket.on("messages:new",function(b){a.addMessage(b)}),this.socket.on("rooms:new",function(b){a.addRoom(b)}),this.socket.on("rooms:update",function(b){a.roomUpdate(b)}),this.socket.on("rooms:archive",function(b){a.roomArchive(b)}),this.socket.on("users:join",function(b){a.addUser(b)}),this.socket.on("users:leave",function(b){a.removeUser(b)}),this.socket.on("users:update",function(b){a.updateUser(b)}),this.socket.on("disconnect",function(){a.status.set("connected",!1)}),this.events.on("messages:send",this.sendMessage,this),this.events.on("rooms:update",this.updateRoom,this),this.events.on("rooms:leave",this.leaveRoom,this),this.events.on("rooms:create",this.createRoom,this),this.events.on("rooms:switch",this.switchRoom,this),this.events.on("rooms:archive",this.archiveRoom,this),this.events.on("profile:update",this.updateProfile,this)},d.prototype.start=function(){this.getEmotes(),this.getReplacements(),this.listen(),this.route(),this.view=new a.LCB.ClientView({client:this});var b=store.get("openrooms");return b instanceof Array&&(store.set("openrooms",[]),c.each(c.uniq(b),function(a){this.joinRoom(a)},this)),this},a.LCB=a.LCB||{},a.LCB.Client=d}(window,$,_),window.client=new window.LCB.Client,$(function(){window.client.start()});