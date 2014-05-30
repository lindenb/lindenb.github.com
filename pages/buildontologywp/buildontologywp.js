



var OntBuilder={
	history:[],
	id_generator:0,
	jsonPCallbacks:[],
	currentFetchTerm:null,
	currentFetchResult:{},
	currentFetchOnLoad:function()
		{
		alert(JSON.stringify(this.currentFetchResult));
		},
	insertHtmlScript:function(scriptid,src)
		{
		if(src==null) return;
		console.log(src);
		var scriptElement=document.getElementById(scriptid);
	 	if(scriptElement!=null) scriptElement.parentNode.removeChild(scriptElement);
	  	scriptElement = document.createElement("script");
	  	scriptElement.setAttribute('id', scriptid);
		scriptElement.setAttribute('src',src);
		//scriptElement.appendChild(document.createTextNode(";"));
		//console.log("inserting script.src="+src);
	  	document.getElementsByTagName("head")[0].appendChild(scriptElement);
		},
	queryCategoryMembers:function(cmcontinue,term,callback)
		{
		this.insertHtmlScript("wp", "http://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmnamespace=14&cmlimit=10&format=json&cmtitle="+
			encodeURIComponent(term)+
			"&callback="+ encodeURIComponent(callback)+
			(cmcontinue==null?"":"&cmcontinue="+cmcontinue)
			)
			;

		},
	element:function(a)
		{
		var E=document.createElement(a);
		return E;
		},
	text:function(a)
		{
		var E=document.createTextNode(a);
		return E;
		},
	removeAllChildren:function(node)
		{
		if(node==null) return null;
		if(typeof node === "string") return this.removeAllChildren(document.getElementById(node));
		while(node.firstChild) 
			{
			node.removeChild(node.firstChild);
			}
		return node;
		},
	init:function()
		{
		this.loop();
		},
	loop:function()
		{
		if(this.history.length==0)
			{
			this.startup();
			return;
			}
		},
	cloneNode:function(id)
		{
		return document.getElementById(id).cloneNode(true);
		},
	xpathOne:function(xpathExpression,contextNode)
		{
		var n = document.evaluate( xpathExpression, contextNode, null,  XPathResult.FIRST_ORDERED_NODE_TYPE, null );
		return n==null?null:n.singleNodeValue;
		},
	startup:function()
		{
		var form=null;
		this.removeAllChildren("main").appendChild(form=this.cloneNode("startup"));
		var button=this.xpathOne(".//button",form);
		var input=this.xpathOne(".//input",form);
		this.expand(document.getElementById("main"),input.value,button);
		},
	expand:function(elementNode,term,button)
		{
		console.log("yyy"+term);
		var _this=this;
		button.onclick=function(evt)
			{
			var callback_name="callback"+_this.id_generator++;
			
			var callback=
				{
				id:callback_name,
				
				onload:function(json)
					{
					console.log(JSON.stringify(json));
					var cmcontinue=null;
					if(json["query-continue"])
						{
						cmcontinue=json["query-continue"]["categorymembers"]["cmcontinue"];
						}
	

					var categories=json.query.categorymembers;	
					
					
					var list=document.createElement("ul");
					elementNode.appendChild(list);
					
					for(var i=0;i< categories.length;++i)
						{
						var cat=categories[i];
						
						var li=document.createElement("li");

						list.appendChild(li);
					
						var anchor=document.createElement("a");
						anchor.appendChild(_this.text(cat.title));
						anchor.setAttribute("href","http://en.wikipedia.org/wiki/"+cat.title);
						anchor.setAttribute("target","_blank");
						li.appendChild(anchor);
					
						var b1=document.createElement("button");
						b1.appendChild(_this.text("[-]"));
						li.appendChild(b1);
					
						var b2=document.createElement("button");
						b2.appendChild(_this.text("[+]"));
						li.appendChild(b2);
						_this.expand(li,cat.title,b2);
							
						
						}
					if( cmcontinue!=null)
						{
						_this.queryCategoryMembers(cmcontinue,term,"OntBuilder.jsonPCallbacks."+callback_name+".onload");
						}
					else
						{
						delete _this.jsonPCallbacks[callback_name];
						}
					}
				};
			OntBuilder.jsonPCallbacks[callback_name]=callback;
			
			console.log("yyyy"+term);
			_this.queryCategoryMembers(null,term,"OntBuilder.jsonPCallbacks."+callback_name+".onload");
			};
		},
	execute:function()
		{
		console.log("okkk");
		}
	};


window.addEventListener("load",function()
	{
	OntBuilder.init();
	},false);

