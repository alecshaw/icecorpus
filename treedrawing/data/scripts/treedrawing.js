startnode=null;
endnode=null;
var mousenode=null;
var undostack=new Array();
var redostack=new Array();
var commands=new Object();

var name = "#floatMenu";  
var menuYloc = null;  

String.prototype.startsWith = function(str){
    return (this.substr(0,str.length) === str);
}

$(document).ready(function() {
	resetIds();
	assignEvents(); 
	$("#debugpane").empty();
	// $("#debugpane").append( wnodeString($("#editpane")) );

    // make menu float
    menuYloc = parseInt($(name).css("top").substring(0,$(name).css("top").indexOf("px")))  
    $(window).scroll(function () {  
        var offset = menuYloc+$(document).scrollTop()+"px";  
        $(name).animate({top:offset},{duration:500,queue:false});  
    });  

    // inital highlight of IPs
    var snodes = $(".snode"); 
    for( i=0; i<snodes.length; i++ ){

		text = $("#"+snodes[i].id).contents().filter(function() {
  			return this.nodeType == 3;
		}).first().text();
		if( isIpNode(text) ){
			$("#"+snodes[i].id).addClass('ipnode');
		}
    }

   // setup context menu


    // floatmenu ready
  //  connectContextMenu( $(".snode") );
//   disableContextMenu( $(".snode") );
	// Show menu when #myDiv is clicked

	//$(".snode").disableContextMenu();


});

// menuon=true;

// checks if the given node label is an ip node in the gui coloring sense
function isIpNode( text ){
	return trim(text).startsWith("IP-SUB") || trim(text).startsWith("IP-MAT") || trim(text).startsWith("IP-IMP") || trim(text).startsWith("IP-INF")	
}


function showContextMenu(){
	// alert("show");
  		e = window.event;
  		var elementId = (e.target || e.srcElement).id;	
		
		// alert( elementId );
		if( elementId == "sn0" ){
			clearSelection();
			return;			
		}
					
		left = $("#"+elementId).offset().left+4;
		toppos = $("#"+elementId).offset().top+17;
		left = left + "px";
		top = top + "px";
		
	$("#conLeft").empty();
	loadContextMenu(elementId);
	
	// Make the columns equally high
	$("#conLeft").height( "auto" );
	$("#conRight").height( "auto" );	
	if( $("#conLeft").height() < $("#conRight").height() ){		
		$("#conLeft").height( $("#conRight").height() );
	}	
	else {
		$("#conRight").height( $("#conLeft").height() );
	}
	
	$("#conMenu").css("left",left);
	$("#conMenu").css("top",toppos);
	$("#conMenu").css("visibility","visible");
}

function hideContextMenu(){
	$("#conMenu").css("visibility","hidden");	
}

	
	/*
	$(function() {
	  $( selector ).contextMenu('#conMenu', {
   	      // Randomly enable or disable each option
	      beforeShow: function() { 

//		if( !menuon ){return false;}

  		e = window.event;
  		var elementId = (e.target || e.srcElement).id;

		stuff = "mmm";
		if( startnode ){ stuff=startnode.id;}

		// alert(elementId + " " + stuff );

		if( startnode ){
			if( elementId == stuff){
				return true;
			}		
			else {
				return false;
			}
		}


		return true;
              }

	  } );
	} );*/

/*
function disableContextMenu( selector ){
	$(function() {
	  $( selector ).contextMenu=null;
	});
	
}
*/
/*
function connectContextMenu(node){
	node.contextMenu({
		menu: 'conMenu'
	},
		function(action, el, pos) {

			nodeid = $(el).attr('id');
			if( action.startsWith("setlabel") ){
				stackTree();
				newlabel=action.substr(9);

				// alert(newlabel);

				// stackTree();
				textnode = $(el).contents().filter(function() {
			  			return this.nodeType == 3;
					}).first().replaceWith(newlabel+" ");
			
				clearSelection();
				// startnode=$("#"+nodeid);
				// endnode=null;
			 	// updateSelection();
			}

			if( action.startsWith("fixedleaf") ){


				stackTree();
				params=action.substr(10);

				stuff = params.split("\:");
				label = stuff[0];
				word = stuff[1];
				targetId = stuff[2];

				// alert(word + " "+ label);

				// alert(newlabel);
 				//  NP-SBJ:*con*

				// stackTree();
				makeLeaf(true,label,word,targetId,true);
			
				clearSelection();
				// startnode=$("#"+nodeid);
				// endnode=null;
			 	// updateSelection();
			}

*/
/*
		alert(
			'Action: ' + action + '\n\n' +
			'Element ID: ' + $(el).attr('id') + '\n\n' + 
			'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' + 
			'X: ' + pos.docX + '  Y: ' + pos.docY+ ' (relative to document)'
			); */
//	});
// }

/*

*/

function addCommand( keycode, type, label ){
	commands[keycode]=new function(){
		this.type = type;
		this.label=label;
	}
}

function stackTree(){
	undostack.push( $("#editpane").html() );
}

function redo(){
	var nextstate = redostack.pop();
	if( !(nextstate == undefined) ){
		currentstate=$("#editpane").html();
		undostack.push(currentstate);
		$("#editpane").empty();
		$("#editpane").append(nextstate);
		clearSelection();		
		$(".snode").mousedown(handleNodeClick);
	}
}

function undo() {	
	var prevstate = undostack.pop();

	if( !(prevstate == undefined) ) {		
		currentstate=$("#editpane").html();
		redostack.push(currentstate);

		$("#editpane").empty();
		$("#editpane").append(prevstate);
		clearSelection();
		$(".snode").mousedown(handleNodeClick);		
	} 
}

function save(){
	var tosave = toLabeledBrackets($("#editpane"));
	$.post("/doSave", {trees: tosave});	
}

function assignEvents(){
	addCommand(65,"leafafter"); // a
	addCommand(66,"leafbefore"); // b
	addCommand(69,"setlabel",["CP-ADV","CP-CMP"]); //e
	addCommand(88,"makenode","XP"); // x
	addCommand(67,"coindex"); // c
	addCommand(82,"setlabel",["CP-REL","CP-FRL","CP-CAR","CP-CLF"]); // r
	addCommand(83,"setlabel",["IP-SUB","IP-MAT","IP-IMP"]); // s
	addCommand(86,"setlabel",["IP-SMC","IP-INF","IP-INF-PRP"]); // v
	addCommand(84,"setlabel",["CP-THT","CP-THT-PRN","CP-DEG","CP-QUE"]); // t
	addCommand(71,"setlabel",["ADJP","ADJP-SPR","NP-MSR","QP"]); // g
	addCommand(70,"setlabel",["PP","ADVP","ADVP-TMP","ADVP-LOC","ADVP-DIR"]); // f
	addCommand(49,"redo"); // 1
	addCommand(50,"setlabel",["NP","NP-PRN","NP-POS","NP-COM"]); // 2
//	addCommand(51,"makenode","NP","NP-PRD","NP-POS"); // 3
//	addCommand(52,"redo"); // 4
	addCommand(81,"setlabel",["CONJP","ALSO","FP"]); // q
	addCommand(87,"setlabel",["NP-SBJ","NP-OB1","NP-OB2","NP-PRD"]); // w
	addCommand(68,"prunenode"); // d
	addCommand(90,"undo"); // z
	addCommand(76,"rename"); // l
//	addCommand(188,"clearselection"); // <
	addCommand(32,"clearselection"); // spacebar
//	addCommand(78, "makenode","XP"); // n
        //78 n

	document.body.onkeydown = handleKeyDown;	
	$(".snode").mousedown(handleNodeClick);
	$("#butsave").mousedown(save);
	$("#butundo").mousedown(undo);
	$("#butredo").mousedown(redo);
	$("#editpane").mousedown(clearSelection);
	$("#conMenu").mousedown(hideContextMenu);

/*
	$(".snode>.snode").mouseover(
	    function(e) {
		    e.stopPropagation();
		    updateMouseNode(this);
		}
	);
*/
}

/*
function updateMouseNode(node){	
	if( mousenode ){
		$(mousenode).css('color','black');
	}
	mousenode=node;
	$(mousenode).css('color','red');
	$(mousenode).children().css('color','black');
}
*/

function handleKeyDown(e){	

		// alert(e.keyCode);
		if( e.ctrlKey && e.keyCode == 83) {
			save();
			e.preventDefault();
		}
		else if( commands[e.keyCode] !=null ){
			type = commands[e.keyCode]["type"];
			label = commands[e.keyCode]["label"];
			if( type=="makenode") {
				if( e.shiftKey ){
					setLabel( label );
				}
				else {
					makeNode(label);
				}
			}	
			else if (type=="undo"){
				undo();
			}
			else if (type=="redo"){
				redo();
			}
			else if (type=="prunenode"){
				pruneNode();
			}
			else if (type=="coindex"){
				coIndex();
			}
			else if (type=="clearselection"){
				clearSelection();
			}
			else if (type=="rename"){
				//e.stopPropagation();
				displayRename();
				e.preventDefault();
				// e.stopPropagation();
			}
			else if (type=="setlabel"){
				setLabel(label);
			}
			else if (type=="leafbefore"){
				leafBefore();
			}
			else if (type=="leafafter"){
				leafAfter();
			}
		}

	}

function handleNodeClick(e){
			// menuon=true;
	  		e = e || window.event;
	  		var elementId = (e.target || e.srcElement).id;
			// alert(e.button);
				// $(".snode").enableContextMenu();
			if( e.button == 2 ){
					// rightclick
				if(!elementId){return;} // stop this if clicking a trace, for now
				
				if (startnode && !endnode) {
				
					// alert( elementId + "  " + startnode.id );
					//if( elementId == startnode.id  ){
					//	alert( elementId + "  " + startnode.id );
					//	$(elementId).enableContextMenu();
					//	startnode=null;
					// handleNodeClick(e);
					//}
					
					// tokenRoot = getTokenRoot(elementId).attr("id");
					// allSNodes = $("#"+tokenRoot+" #"+tokenRoot+" .snode,#"+tokenRoot+" .wnode");
					// allSNodes.disableContextMenu();
					//     $(".snode").disableContextMenu(); // VVV
					if (startnode.id != elementId) {
						// menuon=false;
						e.stopPropagation();					
						moveNode(elementId);						
					}
					else {
						showContextMenu();
					}
				//					tokenRoot = getTokenRoot(elementId).attr("id");
				//					allSNodes = $("#"+tokenRoot+" #"+tokenRoot+" .snode,#"+tokenRoot+" .wnode");
				//					allSNodes.disableContextMenu();
				}
				else if (startnode && endnode){
					   e.stopPropagation();					   
					   moveNodes(elementId);
				}
				else {
					showContextMenu();
				}
				
				
	//	???		e.stopPropagation();
			}
			else { 					
				// leftclick
				hideContextMenu();
				selectNode(elementId);
				
				if (e.ctrlKey) {
					makeNode("XP");
				//	displayRename();
				//	e.preventDefault();
				}

			}
  		        // $("#conMenu").empty();
			// $("#conMenu").html(getContextMenu( elementId ) );

			e.stopPropagation();
}

function selectNode(nodeId){
	// fix???
	var node = document.getElementById(nodeId);
	
	if( nodeId == "sn0"){
		clearSelection();
		return;		
	}
	
	if( node == startnode ){
	     startnode=null;
	     if(endnode){
		startnode=endnode;
		endnode=null;
	     }
	}
	else if (startnode == null ){
	     startnode=node;
	}
	else {
		if( node==endnode){
		     endnode=null;
		}
		else {
		     endnode=node;
		}
	}

	updateSelection();
}

/*
function selectEndnode(node){
	doSelectNode( document.getElementById(node) );
}
*/

function clearSelection(){
	window.event.preventDefault();
	startnode=null; endnode=null;
	resetIds();
	updateSelection();
    hideContextMenu();
}

function updateSelection(){

	document.getElementById("labsel1").innerHTML="null";
	document.getElementById("labsel2").innerHTML="null";
	if( startnode ){
		document.getElementById("labsel1").innerHTML=startnode.id;
		//startnode.setAttribute('class','snodesel');
	}
	if( endnode ){
		document.getElementById("labsel2").innerHTML=endnode.id;
		//endnode.setAttribute('class','snodesel');
	}

	// update selection display
	$('.snode').removeClass('snodesel');

	//$("#conMenu").attr("style,","display:block");
	if( startnode ){
		$("#"+startnode.id).addClass('snodesel');
	}

	if( endnode ){
		$("#"+endnode.id).addClass('snodesel');
	}

	
}

function isPossibleTarget(node){

	// cannot move under a tag node
	if( $("#"+node).children().first().is("span") ){
		return false;
	}
/*
	if(node == "s01"){
		return false;
	}
*/
	return true;
}

function currentText(){
	return wnodeString($("#editpane"));
}

function moveNode(targetParent){
	textbefore = currentText();

	if( ! isPossibleTarget(targetParent) ){
		// can't move under a tag node		
	}
	else if( $("#"+startnode.id).parent().children().length == 1 ){
		// alert("cant move an only child");
	}
	else if( $("#"+targetParent).parents().is( "#"+startnode.id ) ){ 
		// alert("can't move under one's own child");
        } // move up if moving to a node that is already my parent	
	else if( $("#"+startnode.id).parents().is( "#"+targetParent ) ){
		// alert( startnode.id );
		var firstchildId = $("#"+startnode.id).parent().children().first().closest("div").attr("id");
		var lastchildId = $("#"+startnode.id).parent().children().last().closest("div").attr("id");
		
		if( startnode.id == firstchildId ){
			stackTree();
			$("#"+startnode.id).insertBefore( $("#"+targetParent).children().filter( $("#"+startnode.id).parents() ) );		
			if( currentText() != textbefore ){undo();redostack.pop();}
			else {				
				   resetIds();
				//   updateSelection();	
			}
		}
		else if( startnode.id == lastchildId ){
			stackTree();
 			$("#"+startnode.id).insertAfter( $("#"+targetParent).children().filter( $("#"+startnode.id).parents() ) );		
			if( currentText() != textbefore ){undo();redostack.pop();}
			else {				
				   resetIds();
				//   updateSelection();	
			}
		}
		else {
			// alert("cannot move from this position");
		}
	} // otherwise move under my sister
	else {		
//		if( parseInt( startnode.id.substr(2) ) >  parseInt( targetParent.substr(2) ) ){
		if( parseInt( startnode.id.substr(2) ) > parseInt( targetParent.substr(2) ) ){
			//if( $("#"+startnode.id).siblings().is("#"+startnode.id+"~.snode") ){
				stackTree();
				$("#"+startnode.id).appendTo("#"+targetParent);	
				if( currentText() != textbefore ){undo();redostack.pop();}
				else {				
				   resetIds();
				//   updateSelection();	
				}
			//}
		}
		else if( parseInt( startnode.id.substr(2) ) <  parseInt( targetParent.substr(2) ) ) {
			stackTree();
			$("#"+startnode.id).insertBefore( $("#"+targetParent).children().first() );	
			if( currentText() != textbefore ){undo();redostack.pop();}
			else {				
				   resetIds();
				//   updateSelection();	
			}
			
		}
	}

	
	clearSelection();
//	menuon=true;
}

function moveNodes(targetParent){
		textbefore = currentText();
	destination=$("#"+targetParent);
	stackTree();

		if( parseInt(startnode.id.substr(2)) > parseInt(endnode.id.substr(2)) ){
			// reverse them if wrong order
			temp = startnode;	
			startnode = endnode;
			endnode = temp;
		} 

		// check if they are really sisters XXXXXXXXXXXXXXX
		if( $("#"+startnode.id).siblings().is("#"+endnode.id) ){
			// then, collect startnode and its sister up until endnode
			oldtext = currentText();
			//stackTree();
			$("#"+startnode.id).add($("#"+startnode.id).nextUntil("#"+endnode.id)).add("#"+endnode.id).wrapAll('<div xxx="newnode" class="snode">XP</div>');	
			// undo if this messed up the text order
			if( currentText() != oldtext ){	undo(); redostack.pop(); return; }
		}
		else {
			return; // the are not sisters
		}
		
	resetIds();
	toselect = $(".snode[xxx=newnode]").first();	
	// alert(toselect.attr("id"));

	// BUG when making XP and then use context menu: todo XXX
	clearSelection();
	selectNode( toselect.attr("id") );
	toselect.attr("xxx",null)
	updateSelection();
	resetIds();
	//toselect.mousedown(handleNodeClick);

	targetParent = destination.attr("id");		

	if( ! isPossibleTarget(targetParent) ){
		//alert("can't move under a tag node");
		undo(); redostack.pop(); return;		
	}
	else if( $("#"+startnode.id).parent().children().length == 1 ){
		 //alert("cant move an only child");
		 undo(); redostack.pop(); return;
	}
	else if( $("#"+targetParent).parents().is( "#"+startnode.id ) ){ 
		 //alert("can't move under one's own child");
		 undo(); redostack.pop(); return;
        } // move up if moving to a node that is already my parent	
	else if( $("#"+startnode.id).parents().is( "#"+targetParent ) ){
		// alert( startnode.id );
		var firstchildId = $("#"+startnode.id).parent().children().first().closest("div").attr("id");
		var lastchildId = $("#"+startnode.id).parent().children().last().closest("div").attr("id");
		
		if( startnode.id == firstchildId ){
			//stackTree();
			$("#"+startnode.id).insertBefore( $("#"+targetParent).children().filter( $("#"+startnode.id).parents() ) );	
			//resetIds();	
			//pruneNode();
			
			if( currentText() != textbefore ){undo();redostack.pop();return;}
			else {				
				   resetIds();
				//   updateSelection();	
			}
		}
		else if( startnode.id == lastchildId ){
			//stackTree();
 			$("#"+startnode.id).insertAfter( $("#"+targetParent).children().filter( $("#"+startnode.id).parents() ) );		
			if( currentText() != textbefore ){undo();redostack.pop();return;}
			else {				
				   resetIds();
				//   updateSelection();	
			}
		}
		else {
			// alert("cannot move from this position");
			undo(); redostack.pop(); return;
		}
	} // otherwise move under my sister
	else {		
//		if( parseInt( startnode.id.substr(2) ) >  parseInt( targetParent.substr(2) ) ){
		if( parseInt( startnode.id.substr(2) ) > parseInt( targetParent.substr(2) ) ){
			//if( $("#"+startnode.id).siblings().is("#"+startnode.id+"~.snode") ){
				//stackTree();
				$("#"+startnode.id).appendTo("#"+targetParent);	
				if( currentText() != textbefore ){undo();redostack.pop();return;}
				else {				
				   resetIds();
				//   updateSelection();	
				}
			//}
		}
		else if( parseInt( startnode.id.substr(2) ) <  parseInt( targetParent.substr(2) ) ) {
			//stackTree();
			$("#"+startnode.id).insertBefore( $("#"+targetParent).children().first() );	
			if( currentText() != textbefore ){undo();redostack.pop();return;}
			else {				
				   resetIds();
				//   updateSelection();	
			}
			
		}
	}
	
 	toprune = $("#"+toselect.attr("id")+">*").first();
	$("#"+startnode.id).replaceWith( $("#"+startnode.id+">*") );	

		
	clearSelection();	
         
}

function trim( s ){
	return s.replace(/^\s*/, "").replace(/\s*$/, "");
}

/*
 *  Making leafs
*/

function leafBefore(){
	makeLeaf(true);
}

function leafAfter(){
	makeLeaf(false);
}

function makeLeaf(before, label, word, targetId, fixed){

	if (!label) {
		label = "WADVP";
	}
	if (!word) {
		word = "0";
	}
	if (!targetId) {
		targetId = startnode.id;
	}
	
	startRoot = null;
	endRoot = null;
	
	if (endnode) {
		startRoot = getTokenRoot("#" + startnode.id).attr("id");
		endRoot = getTokenRoot("#" + endnode.id).attr("id");
		// alert(startRoot + " - " + endRoot );

		stackTree();		
		if (startRoot == endRoot) {
		
			word = "*ICH*";
			label = getLabel($(endnode));
			
			if (label.startsWith("W")) {
				word = "*T*";
				label = label.substr(1);
			}
			toadd = maxIndex(startRoot) + 1;
		//	alert(toadd);
			word = word + "-" + toadd;
			appendExtension($(endnode), toadd);
		}
		else { // abort if selecting from different tokens
			undo(); redostack.pop(); return;
		}
	}
	

	newleaf = $("<div class='snode'>" + label + " <span class='wnode'>" + word + "</span></div>");
	if (before) {
		//alert(word + " x " + targetId );
		newleaf.insertBefore("#" + targetId);
	}
	else {
		//alert(word + "y");
		newleaf.insertAfter("#" + targetId);
	}
	startnode = null;
	endnode = null;		
	resetIds();
	
	selectNode( $(newleaf).attr("id") );
	updateSelection();
	
	
}			   	
//	makeLeaf(before, label, word, targetId, true);
		
//	if( !targetId ){ targetId="" }
/*
	if( fixed ){

  	    stackTree();
		newleaf = $("<div class='snode'>"+ label+" <span class='wnode'>"+word+"</span></div>");
		if( before ){
			//alert(word + " x " + targetId );
			newleaf.insertBefore( "#"+targetId );
		}
		else {
			//alert(word + "y");
			newleaf.insertAfter( "#"+targetId );
		}
				   startnode=null; endnode=null;
				   resetIds();
				   updateSelection();		
	}
	else if( startnode ){
  	        stackTree();

		// if( !fixed ){ fixed=false; }

		// alert( label + " " + word );

		if( endnode ){
			
*/

	// if start and end are within the same token, do coindexing
				// alert( startnode.id );
			
		
		
		// $( "<div class='snode'>"+ label+" <span class='wnode'>"+word+"</span></div>" );
		
		/*
		document.body.onkeydown = null;	
		editor=$("<div id='leafeditor' class='snode'><input id='leafphrasebox' class='labeledit' type='text' value='"+label+"' /> <input id='leaftextbox' class='labeledit' type='text' value='"+word+"' /></div>")

			if( before ){
				editor.insertBefore(startnode);
			}
			else {
				editor.insertAfter(startnode);
			}

			$("#leafphrasebox,#leaftextbox").keydown(function(event) {
				
				if(event.keyCode == '32'){
														  	
  					var elementId = (event.target || event.srcElement).id;
					// alert( elementId );	
					$("#"+elementId).val( $("#"+elementId).val() );
					event.preventDefault();
				}
				if(event.keyCode == '13'){			   
				   newphrase = $("#leafphrasebox").val().toUpperCase()+" ";
				   newtext = $("#leaftextbox").val();
				   newtext = newtext.replace("<","&lt;");
				   newtext = newtext.replace(">","&gt;");

	  			   $("#leafeditor").replaceWith( "<div class='snode'>"+ newphrase+" <span class='wnode'>"+newtext+"</span></div>" );

				   startnode=null; endnode=null;
				   resetIds();
				   updateSelection();
				   document.body.onkeydown = handleKeyDown;	
				}

			});

		
			setTimeout(function(){ $("#leafphrasebox").focus(); }, 10);
*/
			// $("#leafphrasebox").val("xxx");
			//startnode=null; endnode=null;
			//resetIds();
			//updateSelection();
			//document.body.onkeydown = handleKeyDown;
		
//	} 

//		alert( oldtext );
//		clearSelection();		
//		$("#renamebox").blur();
//  		e = e || window.event;
//		e.stopPropagate();
//}

function isNonWord(word){
		if( word.startsWith("*") ){
			return true;
		}
		if( word.startsWith("{") ){
			return true;
		}
		if( word == "0" ){
			return true;
		}	
		
		return false;
}

function displayRename(){
		
	if( startnode && !endnode ){

		if( $("#"+startnode.id+">.wnode").size() > 0 ){
			// this is a terminal

		    stackTree();
			document.body.onkeydown = null;	
			label = $("#"+startnode.id).contents().filter(function() {
	  			return this.nodeType == 3;
			}).first().text();
			label = $.trim(label);
			
			word = $.trim( $("#"+startnode.id).children().first().text() );
			
			editor=$("<div id='leafeditor' class='snode'><input id='leafphrasebox' class='labeledit' type='text' value='"+label+"' /> <input id='leaftextbox' class='labeledit' type='text' value='"+word+"' /></div>")
	
				$("#"+startnode.id).replaceWith(editor);
				// $("#leaftextbox").attr("value") );
				if( ! isNonWord( word ) ){
					$("#leaftextbox").attr("disabled",true);
				}
	
				$("#leafphrasebox,#leaftextbox").keydown(function(event) {
					
				
					if(event.keyCode == '9'){
							// tab, do nothing								  	
	  					var elementId = (event.target || event.srcElement).id;
						// alert( elementId );	
						// $("#"+elementId).val( $("#"+elementId).val() );
						if ($("#leaftextbox").attr("disabled")) {					
							event.preventDefault();
						}
					}				
					if(event.keyCode == '32'){
															  	
	  					var elementId = (event.target || event.srcElement).id;
						// alert( elementId );	
						$("#"+elementId).val( $("#"+elementId).val() );
						event.preventDefault();
					}
					if(event.keyCode == '13'){			   
					   newphrase = $("#leafphrasebox").val().toUpperCase()+" ";
					   newtext = $("#leaftextbox").val();
					   newtext = newtext.replace("<","&lt;");
					   newtext = newtext.replace(">","&gt;");
	
		  			   $("#leafeditor").replaceWith( "<div class='snode'>"+ newphrase+" <span class='wnode'>"+newtext+"</span></div>" );
	
					   startnode=null; endnode=null;
					   resetIds();
					   updateSelection();
					   document.body.onkeydown = handleKeyDown;	
					}
	
				});
	
			
				setTimeout(function(){ $("#leafphrasebox").focus(); }, 10);
		} 
		else {
			// this is not a terminal
			stackTree();
			document.body.onkeydown = null;	
			label = $("#"+startnode.id).contents().filter(function() {
	  			return this.nodeType == 3;
			}).first().text();
			label = $.trim(label);
			// alert(label);
			
			editor=$("<input id='labelbox' class='labeledit' type='text' value='"+label+"' />");
	
				$("#"+startnode.id).contents().filter(function() {
	  			return this.nodeType == 3;
			}).first().replaceWith(editor);
			
				// $("#leaftextbox").attr("value") );
			
				$("#labelbox").keydown(function(event) {
					
				
					if(event.keyCode == '9'){
							// tab, do nothing								  	
	  					var elementId = (event.target || event.srcElement).id;
					}				
					if(event.keyCode == '32'){
															  	
	  					var elementId = (event.target || event.srcElement).id;
						// alert( elementId );	
						$("#"+elementId).val( $("#"+elementId).val() );
						event.preventDefault();
					}
					if(event.keyCode == '13'){			   
					   newphrase = $("#labelbox").val().toUpperCase()+" ";
				
		  			   $("#labelbox").replaceWith(  newphrase );
	
					   startnode=null; endnode=null;
					   resetIds();
					   updateSelection();
					   document.body.onkeydown = handleKeyDown;	
					}
	
				});
				setTimeout(function(){ $("#labelbox").focus(); }, 10);			
			
	
		}

	}
}

function setLabel(label){
//	if( startnode && endnode )

	if( !isPossibleTarget(startnode.id) ){
		return;	
	}

	stackTree();
	textnode = $("#"+startnode.id).contents().filter(function() {
  			return this.nodeType == 3;
		}).first();
	oldlabel=trim(textnode.text());
//	newlabel=label[0];
	for( i=0; i<label.length; i++ ){
		if( label[i] == oldlabel ){
		   if( i<label.length-1 ){
		      textnode.replaceWith(label[i+1]+" ");
			  
			  if( isIpNode(label[i+1]) ){
			    $("#"+startnode.id).addClass("ipnode");									
			  }
			  else {
			  	$("#"+startnode.id).removeClass("ipnode");				
			  }
			  			  
		      return;
		   }
		   else {
		      textnode.replaceWith(label[0]+" ");
			  
			  if( isIpNode(label[0]) ){
			    $("#"+startnode.id).addClass("ipnode");									
			  }
			  else {
			  	$("#"+startnode.id).removeClass("ipnode");				
			  }
			  
		      return;
		   }		   
		}
	}
        textnode.replaceWith(label[0]+" ");
			  if( isIpNode(label[0]) ){
			    $("#"+startnode.id).addClass("ipnode");									
			  }
			  else {
			  	$("#"+startnode.id).removeClass("ipnode");				
			  }


// 	textnode.replaceWith(label[0]+" ");
//	clearSelection();
//  && $(this).is(":contains('Some Label ')"
}

function makeNode(label){
	// check if something is selected
	if( !startnode ){
		return;
	} 
	// FIX, note one node situation
	//if( (startnode.id == "sn0") || (endnode.id == "sn0") ){
		// can't make node above root
	//	return;
	//}
	// make end = start if only one node is selected
	if( !endnode ){
		// if only one node, wrap around that one
		stackTree();
		$("#"+startnode.id).wrapAll('<div xxx="newnode" class="snode">'+label+' </div>');
	}
	else {
		if( parseInt(startnode.id.substr(2)) > parseInt(endnode.id.substr(2)) ){
			// reverse them if wrong order
			temp = startnode;	
			startnode = endnode;
			endnode = temp;
		} 

		// check if they are really sisters XXXXXXXXXXXXXXX
		if( $("#"+startnode.id).siblings().is("#"+endnode.id) ){
			// then, collect startnode and its sister up until endnode
			oldtext = currentText();
			stackTree();
			$("#"+startnode.id).add($("#"+startnode.id).nextUntil("#"+endnode.id)).add("#"+endnode.id).wrapAll('<div xxx="newnode" class="snode">'+label+'</div>');	
			// undo if this messed up the text order
			if( currentText() != oldtext ){	undo(); redostack.pop(); }
		}
	}

	startnode=null; endnode=null;
	
	// toselect = $(".snode[xxx=newnode]").first();	
//	alert(toselect.attr("xxx"));

	resetIds();
	toselect = $(".snode[xxx=newnode]").first();	
	// alert(toselect.attr("id"));

	// BUG when making XP and then use context menu: todo XXX
	selectNode( toselect.attr("id") );
	toselect.attr("xxx",null)
	updateSelection();
	resetIds();

	toselect.mousedown(handleNodeClick);
	// connectContextMenu( toselect );

}


/*
function traceBefore(){
	makeTrace(true);
}

function traceAfter(){
	makeTrace(false);
}

function makeTrace( before ){
	if( startnode && endnode ){
		if( getLabel($(startnode) )
		makeLeaf(before,"ADVP","*T*");
	}
}
*/

function pruneNode(){
	if( startnode && !endnode ){

		deltext = $("#"+startnode.id).children().first().text();

		// if this is a leaf, todo XXX fix
		if( deltext == "0" || deltext.charAt(0) == "*" || deltext.charAt(0) == "{" || deltext.charAt(0) == "<" ){
			// it is ok to delete leaf if is empty/trace
			stackTree();
			$("#"+startnode.id).remove();
			startnode=null;
			endnode=null;
			resetIds();
			updateSelection();
			return;
		} // but other leafs are not deleted
		else if( ! isPossibleTarget(startnode.id) ){
			return;
		}
		else if( startnode.id == "sn0" ){
			return;
		}

//		$("#"+startnode.id+">*:text").remove();
		stackTree();
		
		toselect = $("#"+startnode.id+">*").first();
		$("#"+startnode.id).replaceWith( $("#"+startnode.id+">*") );		
		startnode=null;
		endnode=null;
		resetIds();
		selectNode( toselect.attr("id") );
 	        updateSelection();

/*
		startnode.removeChild(startnode.firstChild);
		while (startnode.firstChild)
		{  
		    startnode.parentNode.insertBefore(startnode.firstChild, startnode);
		}
		startnode.parentNode.removeChild(startnode);

		startnode=null;
		endnode=null;
 	        updateSelection();
		resetIds();
*/
	}
}

function setNodeLabel(node, label, noUndo){
	if (!noUndo) {		
		stackTree();
	}
	node.contents().filter(function() {
  			return this.nodeType == 3;
	}).first().replaceWith($.trim(label)+" ");
	
			  if( isIpNode( $.trim(label) ) ){
			    node.addClass("ipnode");									
			  }
			  else {
			  	node.removeClass("ipnode");				
			  }			
}

function getLabel(node){
	return $.trim(node.contents().filter(function() {
  			return this.nodeType == 3;
		}).first().text());
}

function appendExtension(node,extension){
	setNodeLabel(node,getLabel(node)+"-"+extension,true);
/*
	node.contents().filter(function() {
  			return this.nodeType == 3;
		}).first().replaceWith( $.trim(getLabel(node))+"-"+extension+" " );
*/
}

function getTokenRoot(node){
	//	return $("#sn0>.snode").filter($("#"+node.id).parents($("#sn0>.snode")));
	return $("#sn0>.snode").filter($(node).parents($("#sn0>.snode")));
}

/*
 * returns value of lowest index if there are any indices, returns -1 otherwise
*/
function minIndex( tokenRoot, offset ){
			allSNodes = $("#"+tokenRoot+" .snode,#"+tokenRoot+" .wnode");
			// temp="";
			highnumber=9000000;
			index=highnumber;
			for( i=0; i<allSNodes.length; i++){
				label=getLabel( $(allSNodes[i]) );
				lastpart=parseInt( label.substr(label.lastIndexOf("-")+1) );
				// lastpart=label.substr(label.lastIndexOf("-")+1);
				// temp+=" "+lastpart;
				if( ! isNaN( parseInt(lastpart) ) ){
					if( lastpart != 0 && lastpart >=offset){
						index = Math.min( lastpart, index );
					}
				}
			}
			if( index == highnumber ){return -1;}

			if( index < offset){return -1;}

			// alert(temp);
			return index;	
}

/*
function getNodesByIndex( tokenRoot, index ){
		allSNodes = $("#"+tokenRoot+" .snode,#"+tokenRoot+" .wnode");
		for( i=0; i<allSNodes.length; i++){
			label=getLabel( $(allSNodes[i]) );
			lastpart=parseInt( label.substr(label.lastIndexOf("-")+1) );
			// lastpart=label.substr(label.lastIndexOf("-")+1);
			// temp+=" "+lastpart;
			if( ! isNaN( parseInt(lastpart) ) ){
				index = Math.max( lastpart, index );
			}
		}	
}
*/

function getIndex( node ){
	// alert( "eee"+ getLabel( node ) );
	index=-1;
	label=getLabel( node );
	lastpart=parseInt( label.substr(label.lastIndexOf("-")+1) );
	if( ! isNaN( parseInt(lastpart) ) ){
		index = Math.max( lastpart, index );
	}	
	return index;
}

function getNodesByIndex(tokenRoot, ind){	
	nodes = $("#"+tokenRoot+" .snode,#"+tokenRoot+" .wnode").filter(function(index) {		
	  return getIndex( $(this) )==ind;
	});  
	// alert("count "+nodes.size() );
	return nodes;
}

function updateIndices( tokenRoot ){
	ind=1;

	// alert( minIndex( tokenRoot, index )  );
	
	while( minIndex( tokenRoot, ind ) != -1){
		// alert( "startind: "+ind+" minind"+ minIndex( tokenRoot, ind )  );
		minindex = minIndex( tokenRoot, ind );

		nodes = getNodesByIndex(tokenRoot,minindex);

		// alert("sss" + nodes.size() );

 		nodes.each(function(index) {
		      label=getLabel($(this)).substr(0,getLabel($(this)).length-1);
		      label=label+ind;
		      setNodeLabel( $(this), label, true );
		});
		ind++;		
		// replaceIndex( tokenRoot, minindex, index ); XXX todo getbyindex
	}
}

function maxIndex( tokenRoot ){ 
			//alert( "tr: "+tokenRoot );
			allSNodes = $("#"+tokenRoot+",#"+tokenRoot+" .snode,#"+tokenRoot+" .wnode");
			 temp="";
			index=0;
			for( i=0; i<allSNodes.length; i++){
				label=getLabel( $(allSNodes[i]) );
				lastpart=parseInt( label.substr(label.lastIndexOf("-")) );
				 lastpart=label.substr(label.lastIndexOf("-")+1);
				 temp+=" "+lastpart;
				if( ! isNaN( parseInt(lastpart) ) ){
					index = Math.max( lastpart, index );
				}
			}
			// alert(temp);
			return index;
}

function removeIndex( node ){
	setNodeLabel( $(node), getLabel( $(node)).substr(0, getLabel( $(node)).length-2 ), true );	
}

function coIndex(){

	if( startnode && !endnode ){
		if( getIndex($(startnode)) > 0 ){
			stackTree();
			removeIndex(startnode);
		}
	}
	else if( startnode && endnode ){

		// if both nodes already have an index
		if( getIndex($(startnode)) > 0 && getIndex($(endnode)) > 0 ){

			// and if it is the same index
			if( getIndex($(startnode)) == getIndex($(endnode)) ){
				// remove it
				stackTree();
				removeIndex(startnode);
				removeIndex(endnode);
			}

		}
		else if ( getIndex($(startnode)) > 0 && getIndex($(endnode)) == -1 ){
			stackTree();
			appendExtension( $(endnode), getIndex($(startnode)) );
		}
		else if ( getIndex($(startnode)) == -1 && getIndex($(endnode)) > 0 ){
			stackTree();
			appendExtension( $(startnode), getIndex($(endnode)) );
		}
		else { // no indices here, so make them
				
			startRoot = getTokenRoot(startnode).attr("id");
			endRoot = getTokenRoot(endnode).attr("id");
			// alert( lowestIndex(startRoot) );
		
			// if start and end are within the same token, do coindexing		
			if( startRoot == endRoot ){			
				index = maxIndex(startRoot)+1;
				stackTree();
				appendExtension($(startnode),index);
				appendExtension($(endnode),index);
			}
		}
		// updateIndices(startRoot);
	}
}


function resetIds(){
	var snodes = $(".snode"); // document.getElementsByClassName("snode");
	for (i = 0; i < snodes.length; i++) {
		snodes[i].id = "sn" + i;			    
	}
}
	
		
		
//		$("#"+snodes[i].id).addClass('snodesel');
/*
		text = $("#"+snodes[i].id).contents().filter(function() {
  			return this.nodeType == 3;
		}).first().text();
		if( trim(text).startsWith("IP-SUB") ){
			$("#"+snodes[i].id).addClass('snodesel');
		}
*/

//		snodes[i].="sn"+i;
		//snodes[i].onmousedown=null;
                //snodes[i].onmousedown=handleNodeClick;
	

	// assignEvents();


function wnodeString( node ){
	thenode = node.clone();
	wnodes = thenode.find(".wnode");
	text="";
	for( i=0; i<wnodes.length; i++){
		text = text + wnodes[i].innerHTML + " ";
	}
	return text;
}

function toLabeledBrackets( node ){		
	// return recurseNode(node,"");
	out=node.clone();		
	out.find("#sn0>.snode").after("\n\n");
	out.find("#sn0>.snode").before("( ");
	out.find("#sn0>.snode").after(")");

	out.find(".snode").before("(");
	out.find(".snode").after(")");
	out.find(".wnode").before(" ");
	
	return out.text();
}

