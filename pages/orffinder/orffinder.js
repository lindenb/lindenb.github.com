var SVG="http://www.w3.org/2000/svg";
var XLINK="http://www.w3.org/1999/xlink";


function Sequence(name,sequence)
	{
	this.name=name;
	this.sequence=sequence;
	
	}



function OrfFinder()
	{
	this.left=100;
	this.bottom=100;
	this.width=1000;
	this.height=50;
	this.maxLen=1;
	}

OrfFinder.prototype.removeAllElements=function(root)
	{
	while(root.hasChildNodes()) root.removeChild( root.firstChild );
	return root;
	};

OrfFinder.prototype.base2pixel=function(seq,pos)
	 {
	 return this.left+(pos/(1.0*this.maxLen))*(this.width)
	 };
	
OrfFinder.prototype.compl=function(c)
	{
	switch(c)
		{
		case "A": return "U";
		case "U": return "A";
		case "G": return "C";
		case "C": return "G";
		default: return "N";
		}
	};

OrfFinder.prototype.paint=function(seq)
		{
		if(seq.sequence.length==0) return;
		
		var root=document.getElementById('result');
		var div= document.createElement("div");
		root.appendChild(div);
		var title= document.createElement("h3");
		title.appendChild(document.createTextNode(seq.name));
		div.appendChild(title);
	
		
		

		var svg=document.createElementNS(SVG,"svg");
		div.appendChild(svg);
		svg.setAttribute("width",this.base2pixel(seq,seq.sequence.length)+1);
		svg.setAttribute("height",(this.bottom+6*this.height+1));
		svg.setAttribute("version","1.1");
		
		
		//ticks
		for(var i=0;i< seq.sequence.length;i+=50)
			{
			var y= 6*this.height+1;
			var line=document.createElementNS(SVG,"line");
			line.setAttribute("y1",0);
			line.setAttribute("y2",y+5);
			line.setAttribute("x1",this.base2pixel(seq,i));
			line.setAttribute("x2",this.base2pixel(seq,i));
			line.setAttribute("style","stroke:gray;stroke_width:0.5px;");
			svg.appendChild(line);
			y+=10;
			var txt= document.createElementNS(SVG,"text");
			txt.setAttribute("y","0");
			txt.setAttribute("x","0");
			txt.setAttribute("transform","translate("+this.base2pixel(seq,i)+" "+y+") rotate(90)");
			txt.appendChild(document.createTextNode(i+1));
			svg.appendChild(txt);
			}
		
		for(var side=0;side<2;++side)
			{
			for(var frame=0;frame<3;frame++)
				{
				var top = this.height*((side==0?0:1)*3+frame);

				var txt= document.createElementNS(SVG,"text");
				txt.setAttribute("y",top + this.height/2.0);
				txt.setAttribute("x",10);
				txt.setAttribute("style","fill:blue;");
				txt.appendChild(document.createTextNode((side==0?"+":"-")+(frame+1)));
				svg.appendChild(txt);
				
				var g1=document.createElementNS(SVG,"g");
				svg.appendChild(g1);
				var g2=document.createElementNS(SVG,"g");
				svg.appendChild(g2);
				
				var rect=null;
				var atg=null;
				var p_beg = (side==0?frame:seq.sequence.length-(1+frame));
				var p_shift = (side==0?3:-3);
				
				
				while(
					(p_shift>0 && p_beg+2<seq.sequence.length) ||
					(p_shift<0 && p_beg-2>=0)
					)
					{
					
					var codon;
					if(p_shift>0) 
						{
						codon = seq.sequence.charAt(p_beg+0);
						codon+= seq.sequence.charAt(p_beg+1);
						codon+= seq.sequence.charAt(p_beg+2);
						}
					else
						{
						codon = this.compl(seq.sequence.charAt(p_beg+0));
						codon+= this.compl(seq.sequence.charAt(p_beg-1));
						codon+= this.compl(seq.sequence.charAt(p_beg-2));
						}

					if(codon=="AUG")
						{
						var line=document.createElementNS(SVG,"line");
						var x= this.base2pixel(seq,p_beg + (p_shift>0 ? 0:1) );
						line.setAttribute("y1",top);
						line.setAttribute("y2",top+this.height/2.0);
						line.setAttribute("x1",x);
						line.setAttribute("x2",x);
						line.setAttribute("title",codon+":"+(1+p_beg));
						line.setAttribute("style","stroke:green;stroke-width:3px;");
						g2.appendChild(line);
						if(atg==null)
							{
							atg= p_beg;
							rect=document.createElementNS(SVG,"rect");
							rect.setAttribute("y",top+1);
							rect.setAttribute("height",this.height-2);
							rect.setAttribute("x",this.base2pixel(seq,p_beg));
							rect.setAttribute("width",this.base2pixel(seq,3));
							rect.setAttribute("style","fill:lightgray;stroke:none;");
							g1.appendChild(rect);
							}
						}
					
					if(rect!=null)
						{
						if( p_shift>0 )
							{
							rect.setAttribute("width",
								this.base2pixel(seq,p_beg)-
								this.base2pixel(seq,atg)
								);
							rect.setAttribute("title",(p_beg-atg)+"bp");
							}
						else
							{
							rect.setAttribute("x",
								this.base2pixel(seq,p_beg)
								);
							rect.setAttribute("width",
								this.base2pixel(seq,atg)-
								this.base2pixel(seq,p_beg)
								);
							rect.setAttribute("title",(atg-p_beg)+"bp");
							}
						}
							
					if(codon=="UAG" || codon=="UAA" || codon=="UGA")
						{
						var x= this.base2pixel(seq,p_beg + (p_shift>0 ? 0:1) );
						var line=document.createElementNS(SVG,"line");
						line.setAttribute("y1",top);
						line.setAttribute("y2",top+this.height);
						line.setAttribute("x1",x);
						line.setAttribute("x2",x);
						line.setAttribute("title",codon+":"+(1+p_beg));
						line.setAttribute("style","stroke:red;stroke-width:3px;");
						g2.appendChild(line);
						
						rect=null;
						atg=null;
						}
					p_beg+= p_shift;
					}
				

				
				rect=document.createElementNS(SVG,"rect");
				rect.setAttribute("y",top);
				rect.setAttribute("height",this.height);
				rect.setAttribute("x",this.left);
				rect.setAttribute("width",this.base2pixel(seq,seq.sequence.length)-this.left);
				rect.setAttribute("style","fill:none;stroke:lightgray;");
				svg.appendChild(rect);
				

				
				}
			
			}

		};
		
OrfFinder.handleSequenceChange=function(evt)
		{
		var app=new OrfFinder();
		app.removeAllElements(document.getElementById('result'));
		var content=document.getElementById('seqs').value;
		var lines=content.split("\n");
		var sequences=[];
		
		var i=0;
		while(i< lines.length)
			{
			var line=lines[i];
			if(line[0]!=">") {i++;continue;}
			var seq=new Sequence(line.substring(1).trim(),"");
			var j=i+1;
			while(j < lines.length && lines[j][0]!='>')
				{
				seq.sequence+=lines[j].replace(/[ \r\t]/g,"").replace(/[Tt]/g,"U").toUpperCase();
				++j;
				}
			app.maxLen = Math.max( app.maxLen, seq.sequence.length);
			sequences.push(seq);
			i=j;
			}
		for(i in sequences)
			app.paint(sequences[i]);
		};


window.addEventListener("load",function()
	{
	document.getElementById('seqs').addEventListener('change', OrfFinder.handleSequenceChange, false);
	document.getElementById('seqs').addEventListener('input', OrfFinder.handleSequenceChange, false);
	},false);
