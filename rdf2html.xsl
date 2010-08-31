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
<h1>
<xsl:value-of select="$me/foaf:name"/>
<xsl:text>'s FOAF Profile.</xsl:text>
</h1>

<xsl:apply-templates />
</body>
</html>
</xsl:template>

<xsl:template match="foaf:Image">
 <xsl:element name="img">
 	<xsl:attribute name="src">
 		<xsl:value-of select="@rdf:about"/>
 	</xsl:attribute>
 	<xsl:attribute name="title">
 		<xsl:value-of select="dc:title"/>
 	</xsl:attribute>
 </xsl:element>
</xsl:template>

<xsl:template match="foaf:Person">
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
<h3>Contacts</h3>
<div style="-moz-column-count: 3;
            -moz-column-rule: 1px solid #bbb;
            -moz-column-gap: 2em;">
<xsl:apply-templates select="foaf:knows/foaf:Person" mode="knows"/>
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
<xsl:apply-templates select="doac:date-starts"/>
<xsl:apply-templates select="doac:date-ends"/>
<xsl:apply-templates select="doac:title"/>
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
<xsl:apply-templates select="doac:date-starts"/>
<xsl:apply-templates select="doac:date-ends"/>
<xsl:apply-templates select="doac:subject"/>
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
<xsl:apply-templates select="foaf:accountServiceHomepage"/>
<xsl:element name="a">
<xsl:attribute name="href"><xsl:value-of select="@rdf:about"/></xsl:attribute>
<xsl:apply-templates select="foaf:accountName"/>
</xsl:element>
</dt>
</xsl:template>


<xsl:template match="foaf:accountServiceHomepage">
<xsl:element name="a">
<xsl:attribute name="href"><xsl:value-of select="@rdf:resource"/></xsl:attribute>
<xsl:choose>
<xsl:when test="@rdf:resource='http://twitter.com'">
	<img src="http://a1.twimg.com/a/1283191627/images/favicon.ico" alt="Twitter"/>
</xsl:when>
<xsl:when test="@rdf:resource='http://friendfeed.com'">
	<img src="http://friendfeed.com/static/images/favicon.png" alt="Friendfeed"/>
</xsl:when>
<xsl:when test="@rdf:resource='http://www.linkedin.com'">
	<img src="http://developer.linkedin.com/favicon.png" alt="LinkedIn"/>
</xsl:when>
<xsl:otherwise>
	<xsl:apply-templates select="@rdf:resource"/>
</xsl:otherwise>
</xsl:choose>
</xsl:element>
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
	<xsl:value-of select="foaf:name"/>
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

</xsl:stylesheet>