function Rectangle()
	{
	if(arguments.length==4)
		{
		this.x=arguments[0];
		this.y=arguments[1];
		this.width= arguments[2];
		this.height=arguments[3];
		}
	else if(arguments.length==0)
		{
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		}
	else if(arguments.length==2)
		{
		this.x = 0;
		this.y = 0;
		this.width = arguments[0];
		this.height = arguments[1];
		}
	else
		{
		throw "Runtime Error";
		}
	}

Rectangle.prototype.getMidX=function()
	{
	return this.x + this.width/2.0;
	};

Rectangle.prototype.getMidY=function()
	{
	return this.y + this.height/2.0;
	};

Rectangle.prototype.clone=function(ratio)
	{
	return new Rectangle(
		this.x,this.y,
		this.width,
		this.height
		);
	};

Rectangle.prototype.scaled=function(ratio)
	{
	var x2=this.getMidX();
	var y2=this.getMidY();
	var w2=this.width*ratio;
	var h2=this.height*ratio;
	return new Rectangle(
		x2 - w2/2.0,
		y2 - h2/2.0,
		w2, h2
		);
	};
