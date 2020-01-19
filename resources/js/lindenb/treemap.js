/**
 * implementation of http://www.cs.umd.edu/hcil/treemap-history/index.shtml ( Authors: Benjamin B. Bederson and Martin Wattenberg )
 */


function TreePacker()
	{
	this.comparator=function(a, b)
		{
		var w1=a.getWeight();
		var w2=b.getWeight();
		if(w1<w2) return 1;
		if(w1>w2) return -1;
		return 0;
		};
	}
TreePacker.Orientation={"VERTICAL":0,"HORIZONTAL":1};
TreePacker.Direction={"ASCENDING":0,"DESCENDING":1};

    
TreePacker.prototype.layout=function(items,bounds)
	{
	this._layout(this.sortDescending(items),0,items.length-1,bounds);
	};
    
TreePacker.prototype.sum=function( items,  start,  end)
	{
	var sum=0.0;
	while(start<=end)//yes <=
		{
		sum+=items[start++].getWeight();
		}
	return sum;
	};
	
TreePacker.prototype.sortDescending=function(items)
	{
	//create a copy and sort
	return items.slice().sort(this.comparator);
	};
	
TreePacker.prototype._layout=function(items,start, end,bounds)
    {
    
        if (start>end) return;
            
        if (end-start<2)
        {
            this.layoutBest(items,start,end,bounds);
            return;
        }
        
        var x=bounds.x;
        var y=bounds.y;
        var w=bounds.width;
        var h=bounds.height;
        
        var total=this.sum(items, start, end);
        var mid=start;
        var a=items[start].getWeight()/total;
        var b=a;
        
        if (w<h)
        {
            // height/width
            while (mid<=end)
            {
                var aspect=this.normAspect(h,w,a,b);
                var q=items[mid].getWeight()/total;
                if (this.normAspect(h,w,a,b+q)>aspect) break;
                mid++;
                b+=q;
            }
            this.layoutBest(items,start,mid,new Rectangle(x,y,w,h*b));
            this._layout(items,mid+1,end,new Rectangle(x,y+h*b,w,h*(1-b)));
        }
        else
        {
            // width/height
            while (mid<=end)
            {
                var aspect=this.normAspect(w,h,a,b);
                var q=items[mid].getWeight()/total;
                if (this.normAspect(w,h,a,b+q)>aspect) break;
                mid++;
                b+=q;
            }
           this.layoutBest(items,start,mid,new Rectangle(x,y,w*b,h));
           this._layout(items,mid+1,end,new Rectangle(x+w*b,y,w*(1-b),h));
        }
        
    };
    
TreePacker.prototype.aspect=function( big,  small,  a,  b)
    {
        return (big*b)/(small*a/b);
    };
    
TreePacker.prototype.normAspect=function( big,  small,  a,  b)
    	{
	var x=this.aspect(big,small,a,b);
	if (x<1) return 1/x;
	return x;
    	};

TreePacker.prototype.layoutBest=function( items, start,  end, bounds)
	    {
	    this.sliceLayout(
	    		items,start,end,bounds,
	            bounds.width > bounds.height ? TreePacker.Orientation.HORIZONTAL : TreePacker.Orientation.VERTICAL,
	            TreePacker.Direction.ASCENDING);
	    };
    
    

TreePacker.prototype.sliceLayout=function(items,start,end, bounds, orientation, order)
        {
            var total=this.sum(items, start, end);
            var a=0;
            var vertical=(orientation==TreePacker.Orientation.VERTICAL);
           
            for (var i=start; i<=end; i++)
            {
            	var r = new Rectangle();
                var b = items[i].getWeight()/total;
                if (vertical)
                {
                    r.x=bounds.x;
                    r.width=bounds.width;
                    if (order==TreePacker.Direction.ASCENDING)
                        r.y=bounds.y+bounds.height*a;
                    else
                        r.y=bounds.y+bounds.height*(1-a-b);
                    r.height=bounds.height*b;
                }
                else
                {
                    if (order== TreePacker.Direction.ASCENDING)
                        r.x=bounds.x+bounds.width*a;
                    else
                        r.x=bounds.x+bounds.width*(1-a-b);
                    r.width=bounds.width*b;
                    r.y=bounds.y;
                    r.height=bounds.height;
                }
     
                items[i].setBounds(r);
                a+=b;
            }
        };

	
