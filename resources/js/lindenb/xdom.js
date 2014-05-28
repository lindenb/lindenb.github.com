Node.prototype.childElements=function(localName)
	{
	var L=[];
	var ndList = this.childNodes; 
	for(var i in ndList)
		{
		if(ndList[i].nodeType!=Node.ELEMENT_NODE) continue;
		if(localName && ndList[i].localName!=localName) continue;
		L.push(ndList[i]);
		}
	return L;
	};

Node.prototype.firstElement=function(localName)
	{
	var ndList = this.childNodes; 
	for(var i in ndList)
		{
		if(ndList[i].nodeType!=Node.ELEMENT_NODE) continue;
		if(localName && ndList[i].localName!=localName) continue;
		return ndList[i];
		}
	return null;
	};

