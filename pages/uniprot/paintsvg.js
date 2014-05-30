/**
 * Author: Pierre Lindenbaum PhD 2014
 *
 */
var SVG="http://www.w3.org/2000/svg";
var XLINK="http://www.w3.org/1999/xlink";

function Feature(owner,root)
	{
	this.owner=owner;
	this.root=root;
	}

Feature.prototype.getStart=function()
	{
	var location=this.root.firstElement("location");
	if(location==null) return null;
	var position=location.firstElement("position"),beginPos,endPos;
	if(position==null)
		{
		position=location.firstElement("begin");
		if(position==null) return null;
		}
	return  parseInt(position.getAttribute("position"))-1;
	};

Feature.prototype.getEnd=function()
	{
	var location=this.root.firstElement("location");
	if(location==null) return null;
	var position=location.firstElement("position"),beginPos,endPos;
	if(position==null)
		{
		position=location.firstElement("end");
		if(position==null) return null;
		}
	return  parseInt(position.getAttribute("position"));
	};

Feature.prototype.length=function()
	{
	return this.getEnd()-this.getStart();
	};


Feature.prototype.isValid=function()
	{
	return this.getStart()!=null && this.getEnd()!=null && this.length()>0;
	};
Feature.prototype.getType=function()
	{
	return this.root.getAttribute("type");
	};

Feature.prototype.getDescription=function()
	{
	return this.root.getAttribute("description");
	};

Feature.prototype.getStatus=function()
	{
	return this.root.getAttribute("status");
	};

Feature.prototype.getLabel=function()
	{
	var lbl="";
	var s=this.getType();
	if(s!=null) lbl+=s+" ";
	s=this.getDescription();
	if(s!=null) lbl+=s+" ";
	s=this.getStatus();
	if(s!=null) lbl+=s+" ";
	return lbl;
	};

Feature.prototype.getURL=function()
	{
	var evidence=this.root.getAttribute("evidence");
	if(evidence==null) return null;
	var E2=evidence.split(" ");
	var  evidences=this.owner.root.childElements("evidence");
	for(var i=0;i< evidences.length;++i)
		{
		var E=evidences[i];
		
		for(var j=0;j< E2.length;++j)
			{
			
			if(E.getAttribute("key")!=E2[j]) continue;
			
			var source=E.firstElement("source");
			if(source==null) continue;
			var dbRef=source.firstElement("dbReference");
			
			if(dbRef.getAttribute("type")!="PubMed") continue;
			
			return "http://www.ncbi.nlm.nih.gov/pubmed/"+dbRef.getAttribute("id");
			}
		}
	
	return null;
	};

function UniProtEntry(root)
	{
	this.root=root;
	this.features=[];
	
	
	this.sequence=this.root.firstElement("sequence").textContent.replace(/[ \t\n\r]/g,"");
	
	var featArray=this.root.childElements("feature");
	for(var i=0;i<featArray.length;++i)
		{
		var feat=new Feature(this,featArray[i]);
		if(!feat.isValid()) return false;
		this.features.push(feat);
		}
	}

UniProtEntry.prototype.length=function(pos)
	{
	return this.sequence.length;
	};



		


var PaintSVG={
	entry:null,
	featureHeight:20,
	distBetweenFeatures:5,
	screenWidth:100,
	fontSize:10,
	variantsHeight:100,
	discardBySimilarity:false,
	createCORSRequest:function(url)
		{
		var xhr = new XMLHttpRequest();
		  if ("withCredentials" in xhr) {
		    xhr.open("GET", url, true);
		  } else if (typeof XDomainRequest != "undefined") {
		    xhr = new XDomainRequest();
		    xhr.open("GET", url);
		  } else {
		    // CORS not supported.
		    xhr = null;
		  }
		return xhr;
		},
	clear:function()
		{
		var outputE=document.getElementById("output");
		while(outputE.firstChild) outputE.removeChild(outputE.firstChild);
		return outputE;
		},
	error:function(msg)
		{
		this.clear().appendChild(document.createTextNode("Error:"+msg));
		},
	load:function()
		{
		this.entry=null;
		var _this=this;
		var acn=document.getElementById("acn").value.trim();
		var outputE=this.clear();
		if(acn.length==0) return;
		var url="http://www.uniprot.org/uniprot/"+acn+".xml";
		var xhr=this.createCORSRequest(url);
		if(xhr==null)
			{
			this.error("Cannot create CORS Request for "+url);
			return;
			}
		xhr.onload=function()
			{
			console.log("load");
			var dom= xhr.responseXML;
			var ndList = dom.documentElement.childElements("entry");
			for(var i=0;i<ndList.length;++i)
				{
				_this.entry=new UniProtEntry(ndList[i]);
				_this.paint(false);
				break;
				}
			};
		xhr.onerror = function() {this.error("undefined");}
		try
			{
			xhr.send();
			}
		catch(err)
			{
			this.error(err);
			}
		},
	acceptFeature:function(feat)
		{
		
		if(this.discardStatusIsPotential && "potential"==feat.getStatus()) return false;
		if(this.discardSeqConflict && "sequence conflict"==feat.getType()) return false;
		if(this.discardSeqConflict && "sequence variant"==feat.getType()) return false;
		if(this.discardBySimilarity && "by similarity"==feat.getStatus()) return false;
		return true;
		},
	convertAAToScreen:function(pos)
		{
		return (pos/(1.0*this.entry.length()))*this.screenWidth;
		},
	paint:function(do_export)
		{
		if(this.entry==null)
		 	{
		 	this.load();	
		 	return;
		 	}
		

		this.screenWidth=parseInt(document.getElementById("svgwidth").value);
		if(this.screenWidth < 100) this.screenWidth=100;
		
		this.collapse=document.getElementById("collapse").checked;
		this.discardStatusIsPotential=document.getElementById("dicardpotential").checked;
		this.discardBySimilarity=document.getElementById("dicardbysimilarity").checked;
		this.discardSeqConflict=document.getElementById("noseqconflict").checked;	
	
		var hidelabels=document.getElementById("hidelabels").checked;	
	
		//draw longest items first
		this.entry.features.sort(function(a,b)
			{
			return b.length() - a.length();
			});
		
		

		
		var x=0;
		var y=this.featureHeight;
		
		var offsets={
			"y_max":100,
			"var_case_height":0,
			"var_ctrl_height":0,
			"y":this.featureHeight,
			"found_case":false,
			"found_ctrl":false
			};
		
		var svg=document.createElementNS(SVG,"svg");
		svg.setAttribute("width",this.screenWidth+100);
		svg.setAttribute("height",100);
		svg.setAttribute("version","1.1");
		svg.setAttribute("style","font-size:"+this.fontSize+"px");

		var E1=document.createElementNS(SVG,"title");
		E1.appendChild(document.createTextNode("Paint SVG"));
		svg.appendChild(E1);
		
		/* svg:definitions =========================================================================== */
		var DEFS=document.createElementNS(SVG,"defs");
		svg.appendChild(DEFS);
		var gradients=[
			{"start":"white","end":"gray"},
			{"start":"white","end":"gray"},
			{"start":"white","end":"gray"},
			{"start":"white","end":"gray"}
			];
		for(var i=0;i< gradients.length;++i)
			{
			var gradient=gradients[i];
			var linearGradient=document.createElementNS(SVG,"linearGradient");
			DEFS.appendChild(linearGradient);
			linearGradient.setAttribute("x1","0%");
			linearGradient.setAttribute("y1","0%");
			linearGradient.setAttribute("x2","0%");
			linearGradient.setAttribute("y2","100%");
			linearGradient.setAttribute("id","grad"+i);
		
			var stopCreate=function(offset,stop_color)
				{
				var stop=document.createElementNS(SVG,"stop");
				stop.setAttribute("offset",offset);
				stop.setAttribute("stop-color",stop_color);
				return stop;
				};
		
			linearGradient.appendChild(stopCreate("5%",gradient.end));
			linearGradient.appendChild(stopCreate("50%",gradient.start));
			linearGradient.appendChild(stopCreate("95%",gradient.end));
			}
	
		var G1=document.createElementNS(SVG,"g");
		G1.setAttribute("transform","translate(0,"+y+")");
		svg.appendChild(G1);
	
	
		var G_ruler=document.createElementNS(SVG,"g");
		G1.appendChild(G_ruler);
		
		
	
		/* PAINT VARIANTS =========================================================================== */
		var G_var_case=document.createElementNS(SVG,"g");
		G1.appendChild(G_var_case);
		var G_var_ctrl=document.createElementNS(SVG,"g");
		G1.appendChild(G_var_ctrl);
		
		var variantsLines=document.getElementById("variants").value.split(/[\n\r]+/);
		for(var i=0;i< variantsLines.length;++i)
			{
			var columns=variantsLines[i].split(/[ \t]+/);
			if(columns.length<4) continue;

			var x1=this.convertAAToScreen(parseInt(columns[1])-1);
			for(var j=2;j<4;++j)
				{
				var line_height=20;
				var count=parseInt(columns[j]);

				if(count<=0) continue;
				
				var var_color=(columns[2]!="0" && columns[3]!="0"?"green":(j==2?"red":"blue"));
				var g_var=document.createElementNS(SVG,"g");
				g_var.setAttribute("transform","translate("+x1+",0)");
				g_var.setAttribute("style","stroke-width:1px;stroke:"+var_color+";fill:"+var_color);
				var g_parent=(j==2?G_var_case:G_var_ctrl);
				//
				
				g_parent.appendChild(g_var);
				
				var y1=(j==2?this.variantsHeight-line_height:line_height);
				var y2=(j==2?this.variantsHeight:0);
				
				var text=document.createElementNS(SVG,"text");
				text.appendChild(document.createTextNode(columns[0]+" ("+count+")"));
				text.setAttribute("x",0);
				text.setAttribute("y",0);
				text.setAttribute("transform","translate(0,"+
					(j==2?y1-5:5+y2+this.fontSize*2)+") rotate("+(j==2?-45:45)+")"
					);
				g_var.appendChild(text);
				
				var line=document.createElementNS(SVG,"line");
				line.setAttribute("x1",0);
				line.setAttribute("x2",0);
				line.setAttribute("y1",y1);
				line.setAttribute("y2",y2);
				line.setAttribute("title",columns[1]);
				g_var.appendChild(line);
				
				var circle=document.createElementNS(SVG,"circle");
				circle.setAttribute("cx",0);
				circle.setAttribute("cy",y1);
				circle.setAttribute("r",3);
				g_var.appendChild(circle);

				
				} 
			}
		
		if(G_var_case.hasChildNodes())
			{
			G_var_case.setAttribute("transform","translate(0,"+y+")");
			y+=this.variantsHeight;
			}
		
		
		/* paint sequence **************************************************************************************/
		
		var y_protein=y;
		
		var G2=document.createElementNS(SVG,"g");
		G1.appendChild(G2);
		
		
		var E2=document.createElementNS(SVG,"rect");
		G2.appendChild(E2);
		E2.setAttribute("x","0");
		E2.setAttribute("y",y_protein);
		E2.setAttribute("width",this.screenWidth);
		E2.setAttribute("height",this.featureHeight);
		E2.setAttribute("style","fill:url(#grad0);stroke:black;");
		y+=this.featureHeight;

		if(G_var_ctrl.hasChildNodes())
			{
			G_var_ctrl.setAttribute("transform","translate(0,"+y+")");
			y+=this.variantsHeight;
			}
		y+=this.distBetweenFeatures;
			
	
		
		
		/** paint features **************************************************************************************/
		for(var i=0;i< this.entry.features.length;++i)
			{
			var feat=this.entry.features[i];
			if(!this.acceptFeature(feat)) continue;
			var x1=this.convertAAToScreen(feat.getStart());
			var x2=this.convertAAToScreen(feat.getEnd());
			
			
			var y_feature=(this.collapse ?  y_protein : y );
			var g=document.createElementNS(SVG,"g");
			g.setAttribute("title",feat.getLabel());
			G1.appendChild(g);
			
			
			var rect=document.createElementNS(SVG,"rect");
			var anchor=null;
			var url=feat.getURL();
			if(url!=null)
				{
				anchor=document.createElementNS(SVG,"a");
				anchor.setAttributeNS(XLINK,"xlink:href",url);
				anchor.setAttribute("target","_blank");
				}
			
			if(anchor==null)
				{
				g.appendChild(rect);
				}
			else
				{
				g.appendChild(anchor);
				anchor.appendChild(rect);
				}
			rect.setAttribute("x",x1);
			rect.setAttribute("y",y_feature);
			rect.setAttribute("width",(x2-x1));
			rect.setAttribute("height",this.featureHeight);
			rect.setAttribute("style","fill:url(#grad"+(i%gradients.length)+");stroke:black;");
			
			if(!hidelabels)
				{
				var text=document.createElementNS(SVG,"text");
				g.appendChild(text);
				text.setAttribute("y",y_feature+this.featureHeight-this.fontSize/2.0);
				if(x2 <  this.screenWidth*0.5 )
					{
					text.setAttribute("text-anchor","start");
					text.setAttribute("x",x2+10);
					}
				else if(x1 >= this.screenWidth*0.5 )
					{
					text.setAttribute("text-anchor","end");
					text.setAttribute("x",x1-5);
			
					}
				else
					{
					text.setAttribute("text-anchor","middle");
					text.setAttribute("x",(x2+x1)/2.0);
					}

				text.appendChild(document.createTextNode("("+(feat.getStart()+1)+"-"+(feat.getEnd())+") "+feat.getLabel()));
				}
			
			if(!this.collapse)
				{
				
				y+=(this.distBetweenFeatures+this.featureHeight);

				}
			}
		y+=this.distBetweenFeatures;
		y+=30;
		svg.setAttribute("height",y);
		
		
		
		
		/** paint ruler **************************************************************************************/
		if(!document.getElementById("hidegrid").checked)
			{
			for(var i=0;i<this.entry.length();i+=10)
				{
				var rect=document.createElementNS(SVG,"rect");
				var x1=this.convertAAToScreen(i);
				rect.setAttribute("title",(i+1));
				rect.setAttribute("y",0);
				rect.setAttribute("height",y);
				rect.setAttribute("x",x1);
				rect.setAttribute("width",(i%100==0?"1.5":"0.5"));
				rect.setAttribute("style","fill:white;stroke:lightgray;");
				G_ruler.appendChild(rect);
				}
			}
		this.clear().appendChild(svg);
	
		if(do_export)
			{
			window.location.href="data:image/svg;base64,"+btoa(new XMLSerializer().serializeToString(svg));
			}
		
		}
	};


window.addEventListener("load",function()
	{
	var i,prefix="acn=",argsArray;
	if(! location.search ) return;
	argsArray =location.search.split(/[\\?&]/);
	for(i=0;i < argsArray.length;++i)
		{
		
		if(argsArray[i].indexOf(prefix)!=0) continue;
		var pmid=argsArray[i].substr(prefix.length);
		var input=document.getElementById("acn");
		input.value=pmid;
		PaintSVG.load();
		break;
		}   
	
	},false);


