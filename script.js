/******************************************copied code */
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}
/***************************************** copied code end */

/****************************************** local storage*/
function getName(cat){var name = prompt("Please Enter Name of LinkedNote");if(name)return name;else if(cat=="main") return "Untitled MainNote"; else return "Untitled LinkedNote";}
var linkedNoteMain;
var dataBackup;


if(localStorage.getObject("linkedNoteMain")){
    linkedNoteMain=localStorage.getObject("linkedNoteMain");
    
}else {
    linkedNoteMain=new LinkedNoteMain(getName("main"));
}

//set things from local storage 
window.onload = function(){
    $(".container.main").width(linkedNoteMain.docWidth);
    $(".container.main").height(linkedNoteMain.docHeight);
    $(".NoteName").html(linkedNoteMain.name);
};

if(localStorage.getObject("dataBackup")){
    dataBackup=localStorage.getObject("dataBackup");
}else {
    dataBackup=new DataBackup();
}

window.onbeforeunload = function(event) {
    localStorage.setObject("linkedNoteMain", linkedNoteMain); 
    
    dataBackup.linkedNotesArray.push(linkedNoteMain);
    localStorage.setObject('dataBackup', dataBackup); 
};
/******************************************local storage end */




/******************************************definations */
function DataBackup(){
    this.linkedNotesArray=[];
    
}
function LinkedNoteMain(name){
    this.cat= "main";
    
    this.rootsArray= [];
    this.docHeight= 500;
    this.docWidth=500;
    this.name= name;
}

function LinkedNote(name){
    this.cat="notMain";
    
    this.rootsArray= [];
    this.docHeight= 500;
    this.docWidth=500;
    this.name= name;
}

function Root(x,y,name){
    this.childArray= [];
    this.name= name;
    this.x=x;
    this.y=y;
    this.notes='';
    this.LinkedNote= new LinkedNote(name);
}
function Child(name){
    this.name=name;
    this.childArray=[];
    this.notes='';
    this.LinkedNote= new LinkedNote(name);
}
/******************************************definations end  */


/****************************************** adding space */
$(".rightBtn").click(function(){
    addSpace("right");
});

$(".downBtn").click(function(){
    addSpace("down");
});

function addSpace(position){
    if(position=="right"){
        $(".container.main").width($(".container.main").width()+500);
        currentLinkedNote.docWidth= $(".container.main").width();
    }else if(position =="down"){
        $(".container.main").height($(".container.main").height()+500);
        currentLinkedNote.docHeight=$(".container.main").height();
    }
    
}
/****************************************** adding space end*/




/****************************************** LinkedNote Name functions */

$("linkedNoteNameOptionsToggler").click(function(){

});

$(".linkedNoteNameInput").hide();
$(".editNameBtn").click(function(){
    $(".linkedNoteNameInput").show();
    $(".linkedNoteNameInput").val(currentLinkedNote.name);
    $(".linkedNoteNameInput").css("left","10px");
    $(".linkedNoteNameInput").focus().select();
});
$(".linkedNoteNameInput").on("keypress",function(e){
    if(e.which==13){
        currentLinkedNote.name=$(".linkedNoteNameInput").val();
        $(".linkedNoteNameInput").hide();
        $(".NoteName").html(currentLinkedNote.name);
        
    }
});
/******************************************LinkedNote Name functions end **/


/****************************************** start */

$(".delMainNote").click(function(){
    dataBackup.linkedNotesArray.push(linkedNoteMain);
    linkedNoteMain=new LinkedNote(getName());
    $(".container.main").width(linkedNoteMain.docWidth);
    $(".container.main").height(linkedNoteMain.docHeight);
    $(".NoteName").html(linkedNoteMain.name);
});

/****************************************** end **/

/****************************************** start*/
var currentLinkedNote=linkedNoteMain;
/****************************************** end **/


/****************************************** start ADD new root and update roots*/
displayRootsForCurrentLinkedNote();
$(".addRootBtn").click(function(){
    var name= prompt("please Enter New Root Name");
    currentLinkedNote.rootsArray.push(new Root(0,0,name));
    displayRootsForCurrentLinkedNote();
});
$(".rootInput").on("keypress",function(e){
    if(e.which==13){
        var name= $(".rootInput").val();
        currentLinkedNote.rootsArray.push(new Root(0,0,name));
        displayRootsForCurrentLinkedNote();
        $(".rootInput").val("");
    }
});


function displayRootsForCurrentLinkedNote(){
    var html="";
    var childrenHtml="";
    for(i=0;i<currentLinkedNote.rootsArray.length;i++){
        
        for(j=0;j<currentLinkedNote.rootsArray[i].childArray.length;j++){
            childrenHtml="";
            childrenHtml+="<div class='child'>"+currentLinkedNote.rootsArray[i].childArray[j].name+"</div>";
        }
        html+="<div style='position: relative; left:"+ currentLinkedNote.rootsArray[i].x+"; top: "+currentLinkedNote.rootsArray[i].y+";' class='root'><span>"
            +i+"</span>"
            +currentLinkedNote.rootsArray[i].name
            +"<button class='openBtn'>+</button>"
            +"<div class='options'>"
            +"<button class='closeBtn'>-</button><button class='delRootBtn'>del</button><button class='editRootBtn'>edit</button><button class='goDeepBtn'>GoDeeper</button><input placeholder='Add child' type='text' class='childInput'>"
            +"</div>"
            +"<div class='children'>"+childrenHtml+"</div></div>";
        
    }
    $(".rootsHolder").html(html);
    
}
/******************************************end ADD new root **/

/****************************************** start*/
var lastLinkedNote;
/******************************************end **/

/****************************************** start  option buttons*/
$(".rootInput").focus();
$(".rootsHolder").on("click",".openBtn",function(){
   $(this).parent().find(".options").show();
   $(this).hide(); 
});
$(".rootsHolder").on("click",".closeBtn",function(){
    $(this).parent().parent().find(".openBtn").show();
    $(this).parent().parent().find(".options").hide();
});
$(".rootsHolder").on("click",".goDeepBtn",function(){
    var i = $(this).parent().parent().find("span").html();
    
    var currentroot=currentLinkedNote.rootsArray[i];
    currentroot.LinkedNote.name=currentroot.name
    lastLinkedNote = currentLinkedNote;
    currentLinkedNote= currentroot.LinkedNote;
    showCurrentLinkedNOte();
    $(".rootInput").focus();
});

$(".rootsHolder").on("click",".delRootBtn",function(){
    var i = $(this).parent().parent().find("span").html();
    if (confirm("Are you sure you want to delete this root?")){
        currentLinkedNote.rootsArray.splice(i,1);
        displayRootsForCurrentLinkedNote();
    }
   
});
$(".rootsHolder").on("click",".editRootBtn",function(){
    var i = $(this).parent().parent().find("span").html();
    
    
});
$(".rootsHolder").on("keypress",".childInput",function(e){
    if(e.which==13){
        var i = $(this).parent().parent().find("span").html();
        
        var currentroot=currentLinkedNote.rootsArray[i];
        currentroot.childArray.push(new Child($(this).val()));
        displayRootsForCurrentLinkedNote();
    //showCurrentLinkedNOte();
    }
    
});

/******************************************end **/




/****************************************** start*/
function showCurrentLinkedNOte(){
    $(".container.main").width(currentLinkedNote.docWidth);
    $(".container.main").height(currentLinkedNote.docHeight);
    $(".NoteName").html(lastLinkedNote.name+">"+currentLinkedNote.name)
    displayRootsForCurrentLinkedNote();
}
/******************************************end **/

/****************************************** start*/
$(".goHome").click(function(){
    currentLinkedNote= linkedNoteMain;
    
    
    showCurrentLinkedNOte();
});
/******************************************end **/

/****************************************** start draggable*/
$(document).ready(function(){
    setInterval(setdraggable,200);
    function setdraggable(){
        $(".rootsHolder").css("height",(currentLinkedNote.docHeight-50)+"px")
        $(".root").draggable({containment:'parent',stop:function(){
            var i = $(this).find("span").html();
            currentLinkedNote.rootsArray[i].x= $(this).css("left");
            currentLinkedNote.rootsArray[i].y= $(this).css("top");
            

        }});
        $(".root").css("position","absolute");
    }
    
});



/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/
/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/
/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/
/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/
/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/
/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/

/****************************************** start*/

/******************************************end **/