var webReaderVersion = "0.1";

(function(){
	var objOverlay = document.createElement("div");
	var objinnerDiv = document.createElement("div");
	var articleTools = document.createElement("DIV");
	
	objOverlay.id = "readOverlay";
	objinnerDiv.id = "readInner";
	
	// Apply user-selected styling:
	document.body.className = "style-novel";
	objOverlay.className = "style-novel";
	objinnerDiv.className = "margin-narrow" + " " + "size-medium";
	
	objinnerDiv.appendChild(grabArticle());		
	objOverlay.appendChild(objinnerDiv);		

	if(document.body == null) {
	    body = document.createElement("body");
	    document.body = body;
	}

	document.body.innerHTML = "";
	
	// Inserts the new content :
	document.body.insertBefore(objOverlay, document.body.firstChild);
	scroll(0,0);
})()

function grabArticle() {
	var allParagraphs = document.getElementsByTagName("p");
	var topDiv = null;
	
	var articleContent = document.createElement("DIV");
	var articleTitle = document.createElement("H1");
	
	var pattern =  new RegExp ("<br/?>[ \r\n\s]*<br/?>", "g");
	document.body.innerHTML = document.body.innerHTML.replace(pattern, "</p><p>").replace(/<\/?font[^>]*>/g, '');
	
	articleTitle.innerHTML = document.title;
	articleContent.appendChild(articleTitle);
	
	for (var j=0; j	< allParagraphs.length; j++) {
	    parentNode = allParagraphs[j].parentNode;
	    
	    if (typeof parentNode.webreader == 'undefined') {
		parentNode.webreader = {"contentScore": 0};			
		
		if(parentNode.className.match(/(comment|meta|footer|footnote)/))
		    parentNode.webreader.contentScore -= 50;
		else if(parentNode.className.match(/((^|\\s)(post|hentry|entry[-]?(content|text|body)?|article[-]?(content|text|body)?)(\\s|$))/))
		    parentNode.webreader.contentScore += 25;
		
		if(parentNode.id.match(/(comment|meta|footer|footnote)/))
		    parentNode.webreader.contentScore -= 50;
		else if(parentNode.id.match(/^(post|hentry|entry[-]?(content|text|body)?|article[-]?(content|text|body)?)$/))
		    parentNode.webreader.contentScore += 25;
	    }

	    if (getInnerText(allParagraphs[j]).length > 10)
		parentNode.webreader.contentScore++;
	    
	    parentNode.webreader.contentScore += getCharCount(allParagraphs[j]);
	}

	for (nodeIndex = 0; (node = document.getElementsByTagName('*')[nodeIndex]); nodeIndex++)
		if(typeof node.webreader != 'undefined' && (topDiv == null || node.webreader.contentScore > topDiv.webreader.contentScore))
			topDiv = node;

	if (topDiv == null) {
	    topDiv = document.createElement('div');
	    topDiv.innerHTML = 'Sorry, WebReader was unable to parse this page for content</a>';
	}
	
	for (var k=0;k < document.styleSheets.length; k++) {
		if (document.styleSheets[k].href != null && document.styleSheets[k].href.lastIndexOf("webreader") == -1) {
			document.styleSheets[k].disabled = true;
		}
	}

	var styleTags = document.getElementsByTagName("style");
	for (var j=0;j < styleTags.length; j++)
		if (navigator.appName != "Microsoft Internet Explorer")
			styleTags[j].textContent = "";

	cleanStyles(topDiv);
	topDiv = killDivs(topDiv);
	topDiv = killBreaks(topDiv);

	topDiv = clean(topDiv, "form");
	topDiv = clean(topDiv, "object");
	topDiv = clean(topDiv, "table", 250);
	topDiv = clean(topDiv, "h1");
	topDiv = clean(topDiv, "h2");
	topDiv = clean(topDiv, "iframe");
	
	articleContent.appendChild(topDiv);

	return articleContent;
}

function getInnerText(e) {
	if (navigator.appName == "Microsoft Internet Explorer")
		return e.innerText;
	else
		return e.textContent;
}

function getCharCount ( e,s ) {
    s = s || ",";
	return getInnerText(e).split(s).length;
}

function cleanStyles( e ) {
    e = e || document;
    var cur = e.firstChild;

    if(!e)
	return;

    if(typeof e.removeAttribute == 'function')
	e.removeAttribute('style');
    
    while ( cur != null ) {
	if ( cur.nodeType == 1 ) {
	    cur.removeAttribute("style");
	    cleanStyles( cur );
	}
	cur = cur.nextSibling;
    }
}

function killDivs ( e ) {
    var divsList = e.getElementsByTagName( "div" );
    var curDivLength = divsList.length;
	
    for (var i=curDivLength-1; i >= 0; i--) {
	var p = divsList[i].getElementsByTagName("p").length;
	var img = divsList[i].getElementsByTagName("img").length;
	var li = divsList[i].getElementsByTagName("li").length;
	var a = divsList[i].getElementsByTagName("a").length;
	var embed = divsList[i].getElementsByTagName("embed").length;
	
	if ( getCharCount(divsList[i]) < 10) {
	    if ( img > p || li > p || a > p || p == 0 || embed > 0) {
		divsList[i].parentNode.removeChild(divsList[i]);
	    }
	}
    }
    return e;
}

function killBreaks ( e ) {
	e.innerHTML = e.innerHTML.replace(/(<br\s*\/?>(\s|&nbsp;?)*){1,}/g,'<br />');
	return e;
}

function clean(e, tags, minWords) {
    var targetList = e.getElementsByTagName( tags );
    minWords = minWords || 1000000;
    
    for (var y=0; y < targetList.length; y++) {
	if (getCharCount(targetList[y], " ") < minWords) {
	    targetList[y].parentNode.removeChild(targetList[y]);
	}
    }
    return e;
}
