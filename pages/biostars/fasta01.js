function Sequence(name,sequence)
	{
	this.name=name;
	this.sequence=sequence;
	}



var FastaTools={
	inputFiles:[],
	removeAllElements:function(root)
		{
		while(root.hasChildNodes()) root.removeChild( root.firstChild );
		return root;
		},
	sequenceToText:function(seq)
		{
		var s=">"+seq.name;
		for(var i=0;i< seq.sequence.length;++i)
			{
			if(i%75==0) s+="\n";
			s+=seq.sequence.substring(i,i+1);
			}
		s+="\n";
		return s;
		},
	runPipeline:function()
		{
		var output="";
		for(var i=0;i< this.inputFiles.length;++i)
			{
			var f=this.inputFiles[i];
			for(var j=0;j< f.sequences.length;++j)
				{
				output+= this.sequenceToText(f.sequences[j]);
				}
			}
		document.location="data:text/plain;content-disposition:attachment;charset=utf-8;filename=fasta.tsv,"+
						encodeURIComponent(output);
		},
	parseSequences:function(content)
		{
		var L=[];
		var lines=content.split("\n");

		var i=0;
		while(i< lines.length)
			{
			var line=lines[i];

			if(line[0]!=">") {i++;continue;}
			var seq=new Sequence(line.substring(1).trim(),"");
			L.push(seq);
			var j=i+1;
			while(j < lines.length && lines[j][0]!='>')
				{

				seq.sequence+=lines[j].replace(/[ \r\t]/g,"");
				++j;
				}
			i=j;
			}

		return L;
		},
	handleFileSelect:function(evt)
		{
		var _this=FastaTools;
		this.inputFiles=[];
		var files = evt.target.files; // FileList object
		if(!files || files.length<1) return;
		

		var img=document.getElementById('progress');
		img.setAttribute("src","http://www.andrewdavidson.com/articles/spinning-wait-icons/wait16trans.gif");
		for(var i=0;i< files.length;++i)
			{
			var f=files[i];
			console.log("Reading "+f.name );
			img.setAttribute("title",f.name+"...");
			
			var reader = new FileReader();
			reader.onprogress = function(evt)
				{
				console.log("Reading "+f);
				};
			reader.onloadend = function(evt)
				{

				console.log("Read "+f.name +" ");
				_this.inputFiles.push({"filename":f.name,"sequences":_this.parseSequences( evt.target.result)});
				if(_this.inputFiles.length==files.length)
					{
					img.removeAttribute("src");
					console.log("Done " );
					_this.runPipeline();
					}
				};
			
			reader.readAsText(f);
			}
		
		}

	};


window.addEventListener("load",function()
	{
	document.getElementById('fastainput').addEventListener('change', FastaTools.handleFileSelect, false);
	},false);

