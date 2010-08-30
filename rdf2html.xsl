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
</xsl:template>


</xsl:stylesheet>