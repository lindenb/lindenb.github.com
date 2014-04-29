
var     pubmedwp= {
	pmid:null,
	article:null,
	subject:null,
	predicate:-1,
	object:null,
	predicate_choices:[
		{"label":"","value":"","template":""},
			{
			"value":"substrate_for",
			"template": "The protein encoded by [[__SUBJECT__|__SUBJECT__]] was found to be a [[Substrate_(biochemistry)|substrate]] for {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"biomarker_for",
			"template": "The protein encoded by [[__SUBJECT__|__SUBJECT__]] is used to screen {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"decrease_associated with disease",
			"template": "Patients who lack [[__SUBJECT__|__SUBJECT__]] have {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"genetic_defect_results_in_disease",
			"template": "Mutations in [[__SUBJECT__|__SUBJECT__]] cause {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"involved_in_development_of",
			"template": "The protein encoded by [[__SUBJECT__|__SUBJECT__]] plays a role in [[Developmental_biology|development] of {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"is_bound_by",
			"template": "{{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}) was found to bind to the protein encoded by [[__SUBJECT__|__SUBJECT__]].<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"might_be_useful_for_treating",
			"template": "[[__SUBJECT__|__SUBJECT__]] could be used to develop a treatment for {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"mutation_results_in",
			"template": "Mutations in  [[__SUBJECT__|__SUBJECT__]] cause {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"overexpression_results_in",
			"template": "Mutations causing  [[__SUBJECT__|__SUBJECT__]] to be [[gene expression|overexpressed]] are one cause of  {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"phosphorylated_by",
			"template": "The protein encoded by [[__SUBJECT__|__SUBJECT__]]  is [[Phosphorylation|phosphorylated]] by  {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"PPI",
			"template": "The protein encoded by [[__SUBJECT__|__SUBJECT__]]  has been shown [[Protein-protein_interaction|interact]] with  {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"produces",
			"template": "{{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}} is produced by [[__SUBJECT__|__SUBJECT__]].<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"regulates_biological_process",
			"template": "[[__SUBJECT__|__SUBJECT__]] is a key regulator of {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			},
			{
			"value":"upregulated_in_relation_to_cancer",
			"template": " [[gene expression|Overexpression]] of [[__SUBJECT__|__SUBJECT__]] appears to be important in the development of {{SWL|type=__SWLTYPE__|target=__OBJECT__|label=__OBJECT__}}.<ref>{{Cite pmid|__PMID__}}</ref>"
			}
			
		]
	};



function insertHtmlScript(scriptid,src)
	{
	if(src==null) return;
	var scriptElement=document.getElementById(scriptid);
 	if(scriptElement!=null) scriptElement.parentNode.removeChild(scriptElement);
  	scriptElement = document.createElement("script");
  	scriptElement.setAttribute('id', scriptid);
	scriptElement.setAttribute('src',src);
	console.log("inserting script.src="+src);
  	document.getElementsByTagName("head")[0].appendChild(scriptElement);
	}

function queryWikipedia(term,callback)
	{
	if(term==null || term.length==0) return null;
	return "http://en.wikipedia.org/w/api.php?action=query&callback="+callback+"&format=json&titles="+ encodeURIComponent(term);
	}




function getSelectedText()
	{
	if (window.getSelection)
		{ 
	   	return window.getSelection().toString().trim();
		} 
	else if (document.selection.createRange) 
		{
		return document.selection.createRange().txt.trim();
	    	}
	return "";
	}
	
function removeAllChildren(node)
	{
	while(node.firstChild) 
		{
		node.removeChild(node.firstChild);
		}
	}

function generate_wp_content()
	{
	var outdiv=document.getElementById("output");
	removeAllChildren(outdiv);
	if( pubmedwp.subject==null || pubmedwp.subject.length==0) return;
	if(pubmedwp.predicate < 0 || pubmedwp.predicate >= pubmedwp.predicate_choices.length ) return;
	if( pubmedwp.object==null || pubmedwp.object.length==0) return;
	var template = pubmedwp.predicate_choices[pubmedwp.predicate].template;
	template=  template.replace(/__SUBJECT__/g,pubmedwp.subject)
		.replace(/__OBJECT__/g,pubmedwp.object)
		.replace(/__PMID__/g,pubmedwp.pmid)
		.replace(/__SWLTYPE__/g,pubmedwp.predicate_choices[pubmedwp.predicate].value  );
	outdiv.appendChild(document.createTextNode(template));


	
	}

function changeButtonName(id,content,defaultValue)
	{
	var but=document.getElementById(id);
	removeAllChildren(but);
	but.appendChild(document.createTextNode(content!=null && content.length > 0 ? content : defaultValue ) );
	
	}



function buildWpPageInfo(root,label,data)
	{
        removeAllChildren(root);
	var E= document.createDocumentFragment();
	if(label==null || label.length==0) return E;
	if("-1" in data.query.pages )
		{
		var F= document.createElement("b");
		F.appendChild(document.createTextNode(label));
		E.appendChild(F);
		F.appendChild(document.createTextNode(" Doesn't exist in wikipedia. "));
		
		F= document.createElement("a");
		F.setAttribute("href","http://en.wikipedia.org/wiki/"+label);
		F.setAttribute("target","_blank");
		F.appendChild(document.createTextNode("Create this Article."));
		E.appendChild(F);
		
		E.appendChild(document.createTextNode(" "));
		
		F= document.createElement("a");
		F.setAttribute("href","https://en.wikipedia.org/w/index.php?search="+ encodeURIComponent(label) +"&title=Special%3ASearch&go=Go");
		F.setAttribute("target","_blank");
		F.appendChild(document.createTextNode("Search in Wikipedia"));
		E.appendChild(F);
		
		E.appendChild(document.createTextNode(" "));
		
		
		F= document.createElement("a");
		F.setAttribute("href","http://biogps.org/?query="+encodeURIComponent(label));
		F.setAttribute("target","_blank");
		F.appendChild(document.createTextNode("Create an article via BioGPS."));
		E.appendChild(F);		
		
		
		root.setAttribute("class","alert alert-danger");
		}
	else
		{
		E.appendChild(document.createTextNode("OK, article exists in wikipedia: "));
		
		var F= document.createElement("a");
		F.setAttribute("href","https://en.wikipedia.org/w/index.php?title="+ encodeURIComponent(label) +"&action=edit");
		F.setAttribute("target","_blank");
		F.setAttribute("title","Edit "+label);
		F.appendChild(document.createTextNode("Edit "+label));
		E.appendChild(F);
		
		E.appendChild(document.createTextNode(" "));
		
		F= document.createElement("a");
		F.setAttribute("href","https://en.wikipedia.org/wiki/"+encodeURIComponent(label));
		F.setAttribute("target","_blank");
		F.setAttribute("title","View "+label);
		F.appendChild(document.createTextNode("View "+label));
		E.appendChild(F);
		
		root.setAttribute("class","alert alert-success");
		}
	root.appendChild(E);
	}

function callback_subject(data)
	{
	console.log(JSON.stringify(data));
	var E=document.getElementById("sujectw");
	buildWpPageInfo(E,pubmedwp.subject,data);
	}



function callback_object(data)
	{
	console.log(JSON.stringify(data));
	var E=document.getElementById("objectw");
	buildWpPageInfo(E,pubmedwp.object,data);
	
	}

function select_subject(sel)
	{
	pubmedwp.subject =getSelectedText();
	changeButtonName("subjectb",pubmedwp.subject,"Subject");
	insertHtmlScript("srcsubject",queryWikipedia(pubmedwp.subject,"callback_subject"));
	generate_wp_content();
	}
	
	
function select_predicate(sel)
	{
	pubmedwp.predicate=sel.selectedIndex;
	if(pubmedwp.predicate < 0 || pubmedwp.predicate >= pubmedwp.predicate_choices.length ) return;
	generate_wp_content();
	}

function select_object()
	{
	pubmedwp.object =getSelectedText();
	changeButtonName("objectb",pubmedwp.object,"Object");
	insertHtmlScript("srcobject",queryWikipedia(pubmedwp.object,"callback_object"));
	
	generate_wp_content();
	}

function fetch_article()
	{
	pubmedwp.pmid=null;
	pubmedwp.article=null;
	var pmid=document.getElementById("pmid").value;
	var prefix="http://www.ncbi.nlm.nih.gov/pubmed/";
	if(pmid.indexOf(prefix)==0)
		{
		pmid=pmid.substr(prefix.length);
		}
	var question= pmid.indexOf("?");
	if(question!=-1) pmid=pmid.substr(0,question);
	try
		{
		pmid=parseInt(pmid);
		if(pmid<=0) return;
		}
	catch(err)
		{
		return;
		}
	pubmedwp.pmid=pmid;
	args = {'apikey' : '191d24f81e61c107bca103f7d6a9ca10',
	        'db'     : 'pubmed',
	        'id'   : pubmedwp.pmid
	        }
	$.getJSON('http://entrezajax.appspot.com/efetch?callback=?', args, function(data)
		{
		pubmedwp.article=data.result[0].MedlineCitation.Article;
		//console.log(JSON.stringify(pubmedwp.article));
		var content=document.getElementById("article");
		removeAllChildren(content);
		var E=document.createElement("div");
		E.setAttribute("class","pubmedtitle");
		content.appendChild(E);
		E.appendChild(document.createTextNode(pubmedwp.article.ArticleTitle));
		E=document.createElement("div");
		E.setAttribute("class","pubmedabstract");
		E.appendChild(document.createTextNode(pubmedwp.article.Abstract.AbstractText));
		content.appendChild(E);
		});
	
	}


window.addEventListener("load",function()
	{
	var i,prefix="pmid=",argsArray;
	for(i in pubmedwp.predicate_choices)
		{
		var choice=pubmedwp.predicate_choices[i];
		var E=document.createElement("option");
		E.setAttribute("value",choice.value);
		E.appendChild(  document.createTextNode(choice.value.replace(/[_]/g,' ')) );
		document.getElementById("swl").appendChild(E);
		}
	if(! location.search ) return;
	argsArray =location.search.split(/[\\?&]/);
	for(i=0;i < argsArray.length;++i)
		{
		
		if(argsArray[i].indexOf(prefix)!=0) continue;
		var pmid=argsArray[i].substr(prefix.length);
		var input=document.getElementById("pmid");
		input.value=pmid;
		fetch_article();
		break;
		}   
	
	},false);

