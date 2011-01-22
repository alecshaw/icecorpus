var conmenus=new Object();
var conleafs=new Array();

function addConMenu( label, suggestions ){
	conmenus[label]=new function(){
		this.suggestions = suggestions;
	}
}


function addConLeaf(suggestion,before,label,word){
//	alert(label);
	
	conleaf=new Object();
	conleaf.suggestion=suggestion;
	conleaf.before=before;
	conleaf.label=label;
	conleaf.word=word;
	
	conleafs.push(conleaf);
}
//addConLeaf(suggestion,before,label,word);
addConLeaf("&lt; (NP-SBJ *con*)",true,"NP-SBJ","*con*");
addConLeaf("&lt; (NP-SBJ *exp*)",true,"NP-SBJ","*exp*");
addConLeaf("&lt; (NP-SBJ *arb*)",true,"NP-SBJ","*arb*");
addConLeaf("&lt; (C 0)",true,"C","0");
addConLeaf("&lt; (P 0)",true,"P","0");
// alert( conleafs[0].label );

	
defaultsPhrases=["IP-SUB","IP-MAT","IP-MAT-PRN","IP-MAT-SPE","IP-INF","IP-IMP","CP-QUE","CP-QUE-SPE"];

npGroup=["NP-SBJ","NP-OB1","NP-OB2","NP-PRD","NP-POS","NP-PRN","NP","NP-MSR","NP-TMP","NP-ADV","NP-DIR","NP-ADT","NP-LFD","NP-SBJ-RSP","NP-OB1-RSP","QP"];
for(i=0; i<npGroup.length; i++){
   addConMenu(npGroup[i],npGroup);
}

advpGroup=["PP","ADVP","ADVP-TMP","ADVP-LOC","ADVP-DIR","NP-MSR","NP-ADV","ADVP-LFD","PP-LFD","ADVP-RSP","ADVP-TMP-RSP"];
for(i=0; i<advpGroup.length; i++){
   addConMenu(advpGroup[i],advpGroup);
}

verbGroup=["VBPI","VBPS","VBDI","VBDS","VAN","VBN","VB"];
for(i=0; i<verbGroup.length; i++){
   addConMenu(verbGroup[i],verbGroup);
}

rpGroup=["RP","P","ADV","ADVR","ADVS","C","CONJ","ALSO"];
for(i=0; i<rpGroup.length; i++){
   addConMenu(rpGroup[i],rpGroup);
}

wpGroup=["WADVP","WNP","WPP","WQP","WADJP"];
for(i=0; i<wpGroup.length; i++){
   addConMenu(wpGroup[i],wpGroup);
}


function isCasePhrase( nodeLabel ){
	if( nodeLabel.startsWith("NP") ){
		return true;			
	}		
	if( nodeLabel.startsWith("ADJP") ){
		return true;			
	}		
	if( nodeLabel.startsWith("QP") ){
		return true;			
	}		
		
	return false;
}

function loadContextMenu( nodeId ){


/*
			<li class="edit"><a href="#edit">IP-SUB</a></li>
			<li class="cut"><a href="#cut">IP-INF</a></li>
			<li class="copy"><a href="#copy">IP-SMC</a></li>
			<li class="paste separator"><a href="#paste">-SPE</a></li>
			<li class="delete"><a href="#delete">-PRN</a></li>
			<li class="quit separator"><a href="#quit">-XXX</a></li>
*/
	// XXX todo, wnode framkallar error on rightclick
	node = $("#"+nodeId).clone();
	nodelabel=trim(node.contents().filter(function() {
  			return this.nodeType == 3;
		}).first().text());

	//html=$("");

	// alert(nodelabel);

//	html+="<div class='conMenuItem'><a href='#fixedleaf:NP-SBJ:*con*:"+nodeId+"'>&lt; NP-SBJ *con*</a></div>";

	$("#conLeft").empty();	
	$("#conLeft").append($("<div class='conMenuHeading'>Label</div>"));	
	
	if (/-[NADG]$/.test(nodelabel)) {
		caseTags=["N","NS","NPR","NPRS","PRO","D","NUM","ADJ","ADJR","ADJS","Q","QR","QS"];
		for (i = 0; i < caseTags.length; i++) {
			theCase=nodelabel.substr(nodelabel.length-1);
			suggestion = caseTags[i]+"-"+theCase;
			
			if (suggestion != nodelabel) {
				newnode = $("<div class='conMenuItem'><a href='#'>" + suggestion + "</a></div>");
				$(newnode).mousedown(function(){
					e = window.event;
					var elementId = (e.target || e.srcElement).id;
					suggestion = "" + $(this).text();
					// alert(nodeId + " " + suggestion);
					setNodeLabel($("#" + nodeId), suggestion);
					hideContextMenu();
				});
				$("#conLeft").append(newnode);
			}
		}
		
		//setNodeLabel($("#" + childId), oldLabel.substr(0, oldLabel.length - 2) + "-" + theCase, true);
	}
	else {
	
		suggestions = defaultsPhrases;
		if (conmenus[nodelabel] != null) {
			suggestions = conmenus[nodelabel].suggestions;
		}
		
		for (i = 0; i < suggestions.length; i++) {
			if (suggestions[i] != nodelabel) {
				newnode = $("<div class='conMenuItem'><a href='#'>" + suggestions[i] + "</a></div>");
				$(newnode).mousedown(function(){
					e = window.event;
					var elementId = (e.target || e.srcElement).id;
					suggestion = "" + $(this).text();
					// alert(nodeId + " " + suggestion);
					setNodeLabel($("#" + nodeId), suggestion);
					hideContextMenu();
				});
				$("#conLeft").append(newnode);
			}
		}
	}
// do the right side context menu	
	$("#conRight").empty();	
	
if( isCasePhrase(nodelabel) ){
	    $("#conRight").append($("<div class='conMenuHeading'>Case</div>"));
		
		newnode = $("<div class='conMenuItem'><a href='#'>-N</a></div>");
		$(newnode).mousedown(doSetCase(nodeId,"N"));
		$("#conRight").append(newnode);	
	    
		newnode = $("<div class='conMenuItem'><a href='#'>-A</a></div>");
		$(newnode).mousedown(doSetCase(nodeId,"A"));
		$("#conRight").append(newnode);	
		    	
		newnode = $("<div class='conMenuItem'><a href='#'>-D</a></div>");
		$(newnode).mousedown(doSetCase(nodeId,"D"));
		$("#conRight").append(newnode);	
		
		newnode = $("<div class='conMenuItem'><a href='#'>-G</a></div>");
		$(newnode).mousedown(doSetCase(nodeId,"G"));
		$("#conRight").append(newnode);			
}	
else if (  /-[NADG]$/.test(nodelabel) ){
	    $("#conRight").append($("<div class='conMenuHeading'>Case</div>"));
		
		newnode = $("<div class='conMenuItem'><a href='#'>-N</a></div>");
		$(newnode).mousedown(setCaseOnTag(nodeId,nodelabel,"N"));
		$("#conRight").append(newnode);	
	    
		newnode = $("<div class='conMenuItem'><a href='#'>-A</a></div>");
		$(newnode).mousedown(setCaseOnTag(nodeId,nodelabel,"A"));
		$("#conRight").append(newnode);	
		    	
		newnode = $("<div class='conMenuItem'><a href='#'>-D</a></div>");
		$(newnode).mousedown(setCaseOnTag(nodeId,nodelabel,"D"));
		$("#conRight").append(newnode);	
		
		newnode = $("<div class='conMenuItem'><a href='#'>-G</a></div>");
		$(newnode).mousedown(setCaseOnTag(nodeId,nodelabel,"G"));
		$("#conRight").append(newnode);			
}		
	
	// do addleafbefore
	$("#conRight").append($("<div class='conMenuHeading'>Leaf before</div>"));
	for (i = 0; i < conleafs.length; i++) {	    			
		newnode = $("<div class='conMenuItem'><a href='#'>"+conleafs[i].suggestion+"</a></div>");
		$(newnode).mousedown(doConLeaf(i,conleafs[i],nodeId));
		$("#conRight").append(newnode);
	}
}

function setCaseOnTag( nodeId, oldLabel, theCase ){
	return function(){
		stackTree();		
		setNodeLabel($("#"+nodeId), oldLabel.substr(0,oldLabel.length-2)+"-"+theCase,true);			
	}	
}

function doSetCase( nodeId, theCase ){
	return function(){
		stackTree();
		//alert(nodeId + " " + theCase);
		daughters = $("#"+nodeId).children().each( function(){			
			childId = $(this).attr("id");
						
			oldLabel=trim($(this).contents().filter(function() {
  				return this.nodeType == 3;
			}).first().text());
			if( /-[NADG]$/.test(oldLabel) ) {				
				setNodeLabel($("#"+childId), oldLabel.substr(0,oldLabel.length-2)+"-"+theCase,true);					
			}
																			
				
		} );
		
				
	}
//	
//	setNodeLabel(nodeId,"sss",true);
}




function doConLeaf(idx,conleaf,nodeId){
		return function(){
			//e = window.event;
			//var elementId = (e.target || e.srcElement).id;
			// suggestion = "" + $(this).text();
			 //alert(elementId);
			//(before,label,word,targetId,fixed)
			makeLeaf(conleaf.before, conleaf.label, conleaf.word, nodeId, true);
			hideContextMenu();
		}
}
