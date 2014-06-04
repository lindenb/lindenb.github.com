

function Term(term)
	{
	this.name=term;
	this.children={};
	}
Term.prototype.toString=function()
	{
	var s=this.name;
	s+="[";
	for(var k in  this.children)
		{
		s+=" "+this.children[k];
		}
	s+="]";
	return s;
	}

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
	firstElement:function(root,localName)
		{
		var ndList = root.childNodes; 
		for(var i in ndList)
			{
			if(ndList[i].nodeType!=Node.ELEMENT_NODE) continue;
			if(localName && ndList[i].localName!=localName) continue;
			return ndList[i];
			}
		return null;
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
		this.insertHtmlScript("wp", "http://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmnamespace=14&cmlimit=2&format=json&cmtitle="+
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
		var mainE=this.removeAllChildren("main");
		var button=document.getElementById("rootButton");
		var input=document.getElementById("rootTerm");
		if(input.value.trim().length==0) return;
		this.expand(mainE,input.value,button);
		},
	expand:function(elementNode,term,button)
		{		
		var _this=this;
		
		elementNode.dataset["term"]=term;
		
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
					/*if(elementNode===document.getElementById("main") )
						{
						_this.removeAllChildren("main");
						}*/

					var categories=json.query.categorymembers;	
					
					
					var ulist=_this.firstElement(elementNode,"ul");
					if(ulist==null)
						{
						ulist=document.createElement("ul");
						elementNode.appendChild(ulist);
						}			
					for(var i=0;i< categories.length;++i)
						{
						var cat=categories[i];
						var li=document.createElement("li");
	
						ulist.appendChild(li);
					
						var anchor=document.createElement("a");
						anchor.appendChild(_this.text(cat.title));
						anchor.setAttribute("href","http://en.wikipedia.org/wiki/"+cat.title);
						anchor.setAttribute("target","_blank");
						li.appendChild(anchor);
					
						var validate=document.createElement("input");
						validate.setAttribute("type","checkbox");
						validate.setAttribute("value",cat.title);
						validate.setAttribute("checked","true");
						li.appendChild(validate);
					
						var b1=document.createElement("button");
						b1.onclick=function(evt)
							{
							var old=evt.target.parentNode.parentNode.removeChild(evt.target.parentNode);
							};
						b1.appendChild(_this.text("[-]"));
						li.appendChild(b1);
					
						var b2=document.createElement("button");
						b2.appendChild(_this.text("[+]"));
						li.appendChild(b2);
						_this.expand(li,cat.title,b2);
						b2.addEventListener("click",function(evt)
							{
							var old=evt.target.parentNode.removeChild(evt.target);
							});
						
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
			

			_this.queryCategoryMembers(null,term,"OntBuilder.jsonPCallbacks."+callback_name+".onload");
			};
		},
	build:function()
		{
		if(arguments.length==0)
			{
			
			var rootE=this.build(
				null,
				document.getElementById("main")
				);
			console.log(rootE);
			return;
			}
			
		
		var parent=arguments[0];
		var elementNode=arguments[1];
		var term=null;
	
		if(elementNode.dataset && elementNode.dataset["term"])
			{
			term=new Term(elementNode.dataset["term"]);
			if(parent!=null) parent.children[term.name]=term;
			}
		for(var n=elementNode.firstChild;n!=null;n=n.nextSibling)
			{
			this.build(term!=null?term:parent,n);
			}
		return parent==null?term:parent;
		}
	};


window.addEventListener("load",function()
	{
	OntBuilder.startup();
	},false);

