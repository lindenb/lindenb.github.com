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

<xsl:template match="/">
<xsl:apply-templates select="rdf:RDF"/>
</xsl:template>

<xsl:template match="rdf:RDF">
<html>
<head>
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
<xsl:apply-templates select="foaf:holdsAccount"/>
<h3>Education</h3>
<xsl:apply-templates select="doac:education"/>
<h3>Experiences</h3>
<xsl:apply-templates select="doac:experience"/>
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
<xsl:apply-templates select="@rdf:resource"/>
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



</xsl:stylesheet>