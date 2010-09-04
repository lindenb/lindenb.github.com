<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns:xsl='http://www.w3.org/1999/XSL/Transform' 
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"
	xmlns:foaf="http://xmlns.com/foaf/0.1/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:lang="http://purl.org/net/inkel/rdf/schemas/lang/1.1#"
	xmlns:rel="http://purl.org/vocab/relationship/"
	xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
	xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#"
	xmlns:doac="http://ramonantonio.net/doac/0.1/"
	xmlns:doap="http://usefulinc.com/ns/doap#"
	xmlns:event="http://purl.org/NET/c4dm/event.owl#"
	xmlns:bibo="http://purl.org/ontology/bibo/"
	xmlns:dcterms="http://purl.org/dc/terms/"
	xmlns:owl="http://www.w3.org/2002/07/owl#"
	version='1.0'>
<!--

Author:
        Pierre Lindenbaum
        http://plindenbaum.blogspot.com

-->
<xsl:output method="html"/>
<xsl:variable name="primaryTopic" select="/rdf:RDF/foaf:PersonalProfileDocument[@rdf:about='']/foaf:primaryTopic/@rdf:resource"/>
<xsl:variable name="me" select="/rdf:RDF/foaf:Person[concat('#',@rdf:ID) = $primaryTopic]"/>

<xsl:template match="/">
<xsl:apply-templates select="rdf:RDF"/>
</xsl:template>

<xsl:template match="rdf:RDF">
<html>
<head>
<title>
<xsl:value-of select="$me/foaf:name"/>
<xsl:text>'s FOAF Profile.</xsl:text>
</title>
<style  type="text/css">
body	{
	background-image: -moz-linear-gradient(top, rgb(40,40,40),rgb(230,230,230));
	}

h1	{
	text-align:center;
	text-shadow: 3px 3px 4px gray;
	}
	
h3	{
	clear: left;
	text-shadow: 3px 3px 4px gray;
	}
	
#page	{
	background-color:white;
	margin:20px;
	padding:10px;
	-moz-border-radius: 15px;
	border-radius: 15px;
	}
.mainpict {
	float:left;
	padding:10px;
	}

img	{
	border:0px;
	}

dt	{
	margin-left:10pt;
	font-weight:bold;
	}

dd	{
	margin-left:30pt;
	color:black;
	}

</style>
<script src="http://static.simile.mit.edu/timeline/api-2.3.0/timeline-api.js?bundle=true" type="text/javascript"></script>
<script type="text/javascript">
/* timeline */
var tl=null;

var localEvents={
dateTimeFormat: 'iso8601',
wikiURL: "http://simile.mit.edu/shelf/",
wikiSection: "My Timeline",

events : [
	<xsl:for-each select="//doac:Experience|//doac:Education">
	<xsl:if test="position()!=1">,</xsl:if>
	<xsl:apply-templates select="." mode="json"/>
        </xsl:for-each>
        <xsl:for-each select="//bibo:Article">
	<xsl:text>,</xsl:text>
	<xsl:apply-templates select="." mode="json"/>
        </xsl:for-each>
        ]
};


function init()
	{
	var eventSource = new Timeline.DefaultEventSource();
	eventSource.loadJSON(localEvents,'.');
	
	var bandInfos = [
		Timeline.createBandInfo({
			width:          "70%", 
			intervalUnit:   Timeline.DateTime.MONTH, 
			intervalPixels: 100,
			eventSource: eventSource
		}),
		Timeline.createBandInfo({
			width:          "30%", 
			intervalUnit:   Timeline.DateTime.YEAR, 
			intervalPixels: 150,
			eventSource: eventSource
		}) ];
	
	bandInfos[1].syncWith = 0;
	bandInfos[1].highlight = true;
	tl = Timeline.create(document.getElementById("my-timeline"), bandInfos);
	}

 var resizeTimerID = null;
 function windowResized() {
     if (resizeTimerID == null) {
         resizeTimerID = window.setTimeout(function() {
             resizeTimerID = null;
             tl.layout();
         }, 500);
     }
 }

window.addEventListener("load",init,true);
window.addEventListener("resize",windowResized,true);
</script>
</head>
<body>
<div id="page">
<xsl:apply-templates select="$me"/>
</div>
</body>
</html>
</xsl:template>

<xsl:template match="foaf:Image" mode="main">
 <xsl:element name="img">
 	<xsl:attribute name="src">
 		<xsl:value-of select="@rdf:about"/>
 	</xsl:attribute>
 	<xsl:attribute name="title">
 		<xsl:value-of select="dc:title"/>
 	</xsl:attribute>
 	<xsl:attribute name="class">
 		<xsl:text>mainpict</xsl:text>
 	</xsl:attribute>
 </xsl:element>
</xsl:template>

<xsl:template match="foaf:Person">
<div><h1>
<xsl:apply-templates select="/rdf:RDF/foaf:Image[@rdf:about = $me/foaf:img/@rdf:resource ]" mode="main"/>
<xsl:value-of select="$me/foaf:name"/>
<xsl:text>'s FOAF Profile.</xsl:text>
</h1></div>
<h3>TimeLine</h3>
<div id="my-timeline" style="height: 200px; border: 1px solid #aaa"></div>
<h3>Accounts</h3>
<div style="-moz-column-count: 3;
            -moz-column-rule: 1px solid #bbb;
            -moz-column-gap: 2em;">
<xsl:apply-templates select="foaf:holdsAccount"/>
</div>
<h3>Education</h3>
<xsl:apply-templates select="doac:education"/>
<h3>Experiences</h3>
<xsl:apply-templates select="doac:experience"/>
<h3>Publications</h3>
<dl>
<xsl:apply-templates select="foaf:made/bibo:Article"/>
</dl>
<h3>Contacts</h3>
<div style="-moz-column-count: 3;
            -moz-column-rule: 1px solid #bbb;
            -moz-column-gap: 2em;">
<xsl:for-each select="foaf:knows/foaf:Person">
 <xsl:sort select="foaf:name"/>
<div>
<xsl:apply-templates select="." mode="knows"/>
</div>
</xsl:for-each>
</div>
<xsl:apply-templates select="foaf:based_near"/>
</xsl:template>

<xsl:template match="doac:experience">
<dl>
<xsl:apply-templates select="doac:Experience"/>
</dl>
</xsl:template>

<xsl:template match="doac:Experience">
<dt>
<xsl:text>(</xsl:text>
<xsl:apply-templates select="doac:date-starts"/>
<xsl:if test="doac:date-ends">
	<xsl:text> - </xsl:text>
	<xsl:apply-templates select="doac:date-ends"/>
</xsl:if>
<xsl:text>)</xsl:text>
<xsl:apply-templates select="doac:title"/>
<xsl:if test="doac:location">
	<xsl:text>. </xsl:text>
	<xsl:apply-templates select="doac:location"/>
</xsl:if>
</dt>
<dd>
<xsl:apply-templates select="doac:activity"/>
</dd>
</xsl:template>

<xsl:template match="doac:education">
<dl>
<xsl:apply-templates select="doac:Education"/>
</dl>
</xsl:template>

<xsl:template match="doac:Education">
<dt>
<xsl:text>(</xsl:text>
<xsl:apply-templates select="doac:date-starts"/>
<xsl:if test="doac:date-ends">
	<xsl:text> - </xsl:text>
	<xsl:apply-templates select="doac:date-ends"/>
</xsl:if>
<xsl:text>). </xsl:text>
<xsl:apply-templates select="doac:title"/>
<xsl:text> at </xsl:text>
<xsl:apply-templates select="foaf:organization"/>
</dt>
<dd>
<xsl:apply-templates select="doac:activity"/>
</dd>
</xsl:template>

<xsl:template match="foaf:holdsAccount">
<dl>
<xsl:apply-templates select="foaf:OnlineAccount"/>
</dl>
</xsl:template>



<xsl:template match="foaf:OnlineAccount">
<dt>
<xsl:if test="foaf:thumbnail/@rdf:resource">
 <xsl:element name="img">
 	<xsl:attribute name="src">
 		<xsl:value-of select="foaf:thumbnail/@rdf:resource"/>
 	</xsl:attribute>
 	<xsl:attribute name="title">
 		<xsl:value-of select="foaf:name"/>
 	</xsl:attribute>
 	<xsl:attribute name="alt">
 		<xsl:value-of select="foaf:name"/>
 	</xsl:attribute>
 </xsl:element>
</xsl:if>

<xsl:element name="a">
<xsl:attribute name="target">
 		<xsl:text>_blank</xsl:text>
 </xsl:attribute>
 <xsl:attribute name="title">
 		<xsl:text>foaf:name</xsl:text>
 </xsl:attribute>
<xsl:attribute name="href"><xsl:value-of select="foaf:accountProfilePage/@rdf:resource"/></xsl:attribute>
<xsl:value-of select="foaf:name"/>
</xsl:element>
</dt>
</xsl:template>

<xsl:template match="doac:Experience" mode="json">
	{
	<xsl:apply-templates select="doac:date-starts" mode="json"/>
	<xsl:apply-templates select="doac:date-ends" mode="json"/>
        title: '<xsl:apply-templates select="doac:title"/>',
        description: '<xsl:apply-templates select="doac:title"/>',
        image: 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        link: 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        }
</xsl:template>

<xsl:template match="doac:Education" mode="json">
	{
	<xsl:apply-templates select="doac:date-starts" mode="json"/>
	<xsl:apply-templates select="doac:date-ends" mode="json"/>
        title: '<xsl:apply-templates select="doac:title"/>',
        description: '<xsl:apply-templates select="doac:title"/>',
        image: 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        link: 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        }
</xsl:template>


<xsl:template match="doac:date-starts" mode="json">
	start: '<xsl:value-of select="."/>',
</xsl:template>

<xsl:template match="doac:date-ends" mode="json">
	end: '<xsl:value-of select="."/>',
</xsl:template>

<xsl:template match="foaf:Person" mode="knows">
	<xsl:if test="foaf:depiction/@rdf:resource">
		<xsl:element name="img">
			<xsl:attribute name="src">
				<xsl:value-of select="foaf:depiction/@rdf:resource"/>
			</xsl:attribute>
			<xsl:attribute name="title">
				<xsl:value-of select="foaf:name"/>
			</xsl:attribute>
			<xsl:attribute name="alt">
				<xsl:value-of select="foaf:name"/>
			</xsl:attribute>
			<xsl:attribute name="width">
				<xsl:text>32px</xsl:text>
			</xsl:attribute>
		</xsl:element>
	</xsl:if>
	
	<xsl:element name="a">
		<xsl:attribute name="href">
			<xsl:choose>
				<xsl:when test="@rdf:about">
					<xsl:value-of select="@rdf:about"/>
				</xsl:when>
				<xsl:when test="foaf:homepage">
					<xsl:value-of select="foaf:homepage"/>
				</xsl:when>
				<xsl:when test="foaf:weblog">
					<xsl:value-of select="foaf:weblog"/>
				</xsl:when>
			</xsl:choose>
		</xsl:attribute>
	<xsl:value-of select="foaf:name"/>
	</xsl:element>
	
	
	
</xsl:template>

<xsl:template match="foaf:based_near">
<h3>Map</h3>
<xsl:apply-templates select="geo:Point"/>
</xsl:template>

<xsl:template match="geo:Point">
<div style="text-align:center;">
<xsl:variable name="gmap">
  <xsl:value-of select="concat('http://maps.google.com/maps?ie=UTF8&amp;ll=',geo:lat,',',geo:long,'&amp;spn=0.006035,0.013154&amp;t=h&amp;z=16')"/>
</xsl:variable>
<xsl:element name="iframe">
	<xsl:attribute name="marginheight">5</xsl:attribute>
	<xsl:attribute name="marginwidth">5</xsl:attribute>
	<xsl:attribute name="frameborder">0</xsl:attribute>
	<xsl:attribute name="scrolling">no</xsl:attribute>
	<xsl:attribute name="height">350</xsl:attribute>
	<xsl:attribute name="width">600</xsl:attribute>
	<xsl:attribute name="src"><xsl:value-of select="concat($gmap,'&amp;output=embed')"/></xsl:attribute>
<xsl:text> </xsl:text>
</xsl:element>
<br/>
<xsl:element name="a">
<xsl:attribute name="target">_blank</xsl:attribute>
<xsl:attribute name="href"><xsl:value-of select="concat($gmap,'&amp;source=embed')"/></xsl:attribute>
View Larger Map
</xsl:element>
</div>
</xsl:template>

<xsl:template match="bibo:Article">
<dt>
<xsl:element name="a">
<xsl:attribute name="target">_blank</xsl:attribute>
<xsl:attribute name="title">pubmed</xsl:attribute>
<xsl:attribute name="href"><xsl:value-of select="@rdf:about"/></xsl:attribute>
<xsl:value-of select="dc:title"/>
</xsl:element>
</dt>
<dd>
<xsl:apply-templates select="dcterms:isPartOf/bibo:Journal"/>
<xsl:text>. </xsl:text>
<xsl:apply-templates select="dc:date"/>
<xsl:text>. </xsl:text>
<xsl:apply-templates select="bibo:volume"/>
<xsl:apply-templates select="bibo:issue"/>
<xsl:apply-templates select="bibo:pages"/>
<xsl:text>. </xsl:text>
<xsl:apply-templates select="bibo:authorList"/>
</dd>
</xsl:template>

<xsl:template match="bibo:Article" mode="json">
	{
	start: '<xsl:value-of select="dc:date"/>',
        title: '<xsl:apply-templates select="dc:title"/>',
        description: '<xsl:apply-templates select="dc:title"/>',
        image: 'http://www.ncbi.nlm.nih.gov/coreweb/images/icons/PubMed.gif',
        link:'<xsl:value-of select="@rdf:about"/>'
        }
</xsl:template>

<xsl:template match="bibo:volume">
<xsl:text> vol.</xsl:text><b><xsl:value-of select="."/></b>
</xsl:template>
<xsl:template match="bibo:issue">
<xsl:text> (</xsl:text><i><xsl:value-of select="."/></i><xsl:text>)</xsl:text>
</xsl:template>
<xsl:template match="bibo:pages">
<xsl:text>pp.</xsl:text><xsl:value-of select="."/>
</xsl:template>

<xsl:template match="bibo:authorList">
<xsl:apply-templates select="rdf:List" mode="authors"/>
</xsl:template>

<xsl:template match="rdf:List" mode="authors">
<xsl:apply-templates select="rdf:first|rdf:rest" mode="authors"/>
</xsl:template>

<xsl:template match="rdf:first" mode="authors">
<xsl:apply-templates select="foaf:Person" mode="authors"/>
</xsl:template>

<xsl:template match="rdf:rest" mode="authors">
<xsl:choose>
<xsl:when test="@rdf:resource='http://www.w3.org/1999/02/22-rdf-syntax-ns#nil'">
	<xsl:text>.</xsl:text>
</xsl:when>
<xsl:otherwise>
<xsl:text>, </xsl:text>
<xsl:apply-templates select="rdf:List" mode="authors"/>
</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template match="foaf:Person" mode="authors">
<xsl:choose>
	<xsl:when test="@rdf:about = $primaryTopic">
		<b><xsl:value-of select="foaf:name"/></b>
	</xsl:when>
	<xsl:otherwise>
		<xsl:value-of select="foaf:name"/>
	</xsl:otherwise>
</xsl:choose>
</xsl:template>

<xsl:template match="bibo:Journal">
<xsl:element name="a">
	<xsl:attribute name="href">
		<xsl:value-of select="@rdf:about"/>
	</xsl:attribute>
	<xsl:attribute name="title">
		<xsl:text>Nlm</xsl:text>
	</xsl:attribute>
	<xsl:attribute name="target">
		<xsl:text>_blank</xsl:text>
	</xsl:attribute>
	<xsl:value-of select="dc:title"/>
</xsl:element>
</xsl:template>


</xsl:stylesheet>