// Variables of Global Importance
var turn = 1; // 1,2 are white, black turns
var mode = 's'; // m,s are multiplayer, singleplayer

function swapTurn(){
    if(turn==1){
        turn = 2;
        $(".w").css("pointer-events","none");
        if(mode == 'm')
            $(".b").css("pointer-events","auto");
        else if(mode == 's'){
            checkStatus = isCheck();
            findMoves(2);
            if(checkStatus==1){
                // alert("has to resolve "+ checkStatus);
                resolveCheck();
            }else{
                chooseMove();
            }
            var status = parseInt( choosenSpot[4] );
            // alert(validSpots +"\n "+choosenSpot);
            makeMove(status);
        }
    }else{
        turn = 1;
        $(".b").css("pointer-events","none");
        $(".w").css("pointer-events","auto");
    }
}

// creating chess board
var row, col;
for(row=0;row<8;row++){
    $("#chess-board").append("<div id=row"+row+"></div>");
    $("#row"+row).addClass("flex-display");
    for(col=0;col<8;col++){
        $("#row"+row).append("<div id="+row+col+"></div>");
        // if(row==0 && col==0){
        //     $("#"+row+col).append("<div class='pawn-1' draggable='true'></div>")
        // }
        if( (row+col) % 2 == 0){
            $("#"+row+col).addClass("dark square");
        }
        else{
            $("#"+row+col).addClass("light square");
        }
    }
}

// matrix of chess-board
var chessBoard = [  [16, 15, 14, 13, 12, 11, 10 ,9],
                    [1, 2, 3, 4, 5, 6, 7, 8],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [17, 18, 19, 20, 21, 22, 23, 24],
                    [25, 26, 27, 28, 29, 30, 31, 32]  ];
arrangeBoard();

function arrangeBoard(){
    var i=0, j=0, troop, troopName;
    for(i=0;i<8;i++){
        for(j=0;j<8;j++){
            troop = chessBoard[i][j];
            if(troop==0)
                continue;
            troopName = toTroopName(troop);
            $("#chess-board").append("<div class='troop "+troopName+"' id='"+i+j+"-t-"+troop+"' draggable='true'></div>");
            $("#"+i+j+"-t-"+troop).css("left",""+(385+85*j)+"px");
            $("#"+i+j+"-t-"+troop).css("top",""+(5+85*i)+"px");
            if(troop <= 16){
                $("#"+i+j+"-t-"+troop).addClass("b");
            }else{
                $("#"+i+j+"-t-"+troop).addClass("w");
            }
        }
    }
}

function toTroopName(troop){
    if(troop>=1 && troop<=8)
        return "pawn-b";
    else if(troop>=17 && troop <=24)
        return "pawn-w";
    switch(troop){
        case 9:  return "rook-b";
        case 10: return "knight-b";
        case 11: return "bishop-b";
        case 12: return "queen-b";
        case 13: return "king-b";
        case 14: return "bishop-b";
        case 15: return "knight-b";
        case 16: return "rook-b";
        case 25: return "rook-w";
        case 26: return "knight-w";
        case 27: return "bishop-w";
        case 28: return "king-w";
        case 29: return "queen-w";
        case 30: return "bishop-w";
        case 31: return "knight-w";
        case 32: return "rook-w";
    }
}

// pawns click events
var troop = 0, rowClick, colClick;
var troopRow, troopCol;
var troopId, Status, statusTemp, checkStatus;
$(".troop").click(function(){
    var prevTroop = troop;
    troop = parseInt( $(this).attr("id").slice(5) );
    troopId = $(this).attr("id");
    troopRow = parseInt(troopId[0]);
    troopCol = parseInt(troopId[1]);
});
$(".square").click(function squareClick(){
    if(troop != 0){
        rowClick = parseInt($(this).attr("id")[0]);
        colClick = parseInt($(this).attr("id")[1]);
        Status=isLegalMove(troop)
        if( Status && ((turn==2 && troop<=16) || (turn==1 && troop>=17)) ){
            statusTemp = Status;
            makePseudoMove();
            checkStatus = isCheck();
            if((checkStatus==1 && turn==2) || (checkStatus==2 && turn==1)){
                reversePseudoMove();
            }else{
                reversePseudoMove();
                makeMove(statusTemp);
            }
        }
        else{
            alert("wrong move");
        }
    }
});

function makeMove(Status){
    if(Status==2){
        removeTroop();
    }
    if(turn==2){
        troopId = ""+troopRow+troopCol+"-t-"+chessBoard[troopRow][troopCol];
        troop = chessBoard[troopRow][troopCol];
    }
    $("#"+troopId).animate({left: (385+colClick*85), top: (5+rowClick*85)}, 100);
    chessBoard[troopRow][troopCol] = 0;
    $("#"+troopId).attr("id",rowClick.toString()+colClick.toString()+troopId.slice(2));
    chessBoard[rowClick][colClick] = troop;
    troop = -1;
    var audio = new Audio("troopMoveSound.mp3");
    audio.play();
    swapTurn();
}

var troopTemp;
function makePseudoMove(){
    troopTemp = chessBoard[rowClick][colClick];
    chessBoard[troopRow][troopCol] = 0;
    chessBoard[rowClick][colClick] = troop;
}
function reversePseudoMove(){
    chessBoard[troopRow][troopCol] = troop;
    chessBoard[rowClick][colClick] = troopTemp;
}

function removeTroop(){
    $("#"+rowClick+colClick+"-t-"+chessBoard[rowClick][colClick]).remove();
    var audio = new Audio("troopStrikeSound.mp3");
    audio.play();
}

var i=0, j=0, temp;
function isLegalMove(troop){ // return values 0,1,2 are no, yes, removable
    temp = troop;
    if(troop>=1 && troop<=8)
        troop = 1;
    else if(troop>=17 && troop<=24)
        troop = 17;
    else if(troop==16 || troop==25 || troop==32) // rook
        troop = 9;
    else if(troop==15 || troop==26 || troop==31) // knight
        troop = 10;
    else if(troop==14 || troop==27 || troop==30) // bishop
        troop = 11;
    else if(troop==12 || troop == 29) // queen
        return ( isLegalMove(9) || isLegalMove(11) );
    else if(troop==28) // king
        troop = 13;
    switch(troop){
        case 1: // Pawn-B
            if((rowClick-troopRow==1 && chessBoard[rowClick][colClick]==0) || (troopRow==1 && rowClick-troopRow==2 && chessBoard[rowClick-1][colClick]==0 && chessBoard[rowClick][colClick]==0)){
                if(troopCol==colClick){
                    troop = temp;
                    return 1;
                }
            }else if(rowClick-troopRow==1 && chessBoard[rowClick][colClick]>=17 && Math.abs(colClick-troopCol)==1 && turn==2){
                return 2;
            }else{
                return 0;
            } 
        case 9: // Rook
            i=0;
            if(rowClick==troopRow){
                if(colClick==troopCol){
                    return 0;
                }
                while(colClick != troopCol+i){
                    if(colClick > troopCol+i){
                        i++;
                    }
                    else{
                        i--;
                    }
                    if(chessBoard[troopRow][troopCol+i]>0 && colClick!=troopCol+i){
                        return 0;
                    }
                }
                if(chessBoard[rowClick][colClick]==0)
                    return 1;
                if( (chessBoard[rowClick][colClick]>=17 && turn==1) || (chessBoard[rowClick][colClick]<=16 && turn==2) ){
                    return 0;
                } // prevented take-down of same kind
                if( (chessBoard[rowClick][colClick]>=17 && turn==2) || (chessBoard[rowClick][colClick]<=16 && turn==1) ){
                    troop = temp;
                    return 2;
                } // take-down
                troop = temp;
                return 1;
            }
            else if(colClick==troopCol){
                if(rowClick==troopRow){
                    return 0;
                }
                while(rowClick != troopRow+i){
                    if(rowClick > troopRow+i){
                        i++;
                    }
                    else{
                        i--;
                    }
                    if(chessBoard[troopRow+i][troopCol]>0 && rowClick!=troopRow+i){
                        return 0;
                    }
                }
                if(chessBoard[rowClick][colClick]==0)
                    return 1;
                if( (chessBoard[rowClick][colClick]>=17 && turn==1) || (chessBoard[rowClick][colClick]<=16 && turn==2) ){
                    return 0;
                }
                if( (chessBoard[rowClick][colClick]>=17 && turn==2) || (chessBoard[rowClick][colClick]<=16 && turn==1) ){
                    troop = temp;
                    return 2;
                }
                troop = temp;
                return 1;
            }
            return 0;
        
        case 10: // Knight
            // if( (chessBoard[rowClick][colClick]>=17 && turn==2) || (chessBoard[rowClick][colClick]<=16 && turn==1) ){
            //     removeTroop();
            //     return 1;
            // }
            if(chessBoard[rowClick][colClick]!=0 && ((chessBoard[rowClick][colClick]>=17 && turn==1) || (chessBoard[rowClick][colClick]<=16 && turn==2))){
                return 0;
            }
            if(Math.abs(troopRow-rowClick)==2 && Math.abs(troopCol-colClick)==1){
                troop = temp;
                if(chessBoard[rowClick][colClick]!=0)
                    return 2;
                return 1;
            }
            else if(Math.abs(troopCol-colClick)==2 && Math.abs(troopRow-rowClick)==1){
                troop = temp;
                if(chessBoard[rowClick][colClick]!=0)
                    return 2;
                return 1;
            }
            else{
                return 0;
            }
        
        case 11: // Bishop
            i=0;
            j=0;
            if(Math.abs(troopRow-rowClick)==Math.abs(troopCol-colClick)){
                while(rowClick != troopRow+i){
                    if(rowClick > troopRow){
                        i++;
                    } else{
                        i--;
                    }
                    if(colClick > troopCol){
                        j++;
                    } else{
                        j--;
                    }
                    if(chessBoard[troopRow+i][troopCol+j]!=0 && rowClick!=troopRow+i){
                        return 0;
                    }
                }
                if(chessBoard[rowClick][colClick]==0)
                    return 1;
                if( (chessBoard[rowClick][colClick]>=17 && turn==1) || (chessBoard[rowClick][colClick]<=16 && turn==2) ){
                    return 0;
                } // prevented take-down of same kind
                if( (chessBoard[rowClick][colClick]>=17 && turn==2) || (chessBoard[rowClick][colClick]<=16 && turn==1) ){
                    return 2;
                } // take-down
                return 1;
            }
            else{
                return 0;
            }
        
        case 13: // King
            if(Math.abs(troopRow-rowClick)<=1 && Math.abs(troopCol-colClick)<=1){
                if(chessBoard[rowClick][colClick]==0)
                    return 1;
                else if((chessBoard[rowClick][colClick]>=17 && turn==2) || (chessBoard[rowClick][colClick]<=16 && turn==1)){
                    return 2;
                }
            }
            return 0;

        case 17: // Pawn-W
            if((rowClick-troopRow==-1 && chessBoard[rowClick][colClick]==0) || (troopRow==6 && rowClick-troopRow==-2 && chessBoard[rowClick+1][colClick]==0 && chessBoard[rowClick][colClick]==0)){
                if(troopCol==colClick){ 
                    troop = temp;
                    return 1;
                }
            }else if(rowClick-troopRow==-1 && chessBoard[rowClick][colClick]<=16 && Math.abs(colClick-troopCol)==1 && turn==1){
                return 2;
            }else{
                return 0;
            } 
    }
}

var blackKing, whiteKing;
function isCheck(){ // return 1,2 for check advantage of white, black
    var troopRowTemp = troopRow;
    var troopColTemp = troopCol;
    var rowClickTemp = rowClick;
    var colClickTemp = colClick;
    var turnTemp = turn;
    
    // makePseudoMove()
    
    findMoves(1);
    blackKing = $(".king-b").attr("id").slice(0,2);
    whiteKing = $(".king-w").attr("id").slice(0,2), temp;
    for(i=0;i<validSpots.length;i++){
        temp = validSpots[i].slice(2,4);
        if(temp==blackKing){
            // reversePseudoMove();
            troopRow = troopRowTemp;
            troopCol = troopColTemp;
            rowClick = rowClickTemp;
            colClick = colClickTemp;
            turn = turnTemp;
            return 1;
        }
    }

    findMoves(2);
    for(i=0;i<validSpots.length;i++){
        temp = validSpots[i].slice(2,4);
        if(temp==whiteKing){
            // reversePseudoMove();
            troopRow = troopRowTemp;
            troopCol = troopColTemp;
            rowClick = rowClickTemp;
            colClick = colClickTemp;
            turn = turnTemp;
            alert("check");
            return 2;
        }
    }
    troopRow = troopRowTemp;
    troopCol = troopColTemp;
    rowClick = rowClickTemp;
    colClick = colClickTemp;
    turn = turnTemp;
    return 0;
}



// CHESS ENGINE

// Pushing possiblities to array
var validSpots = [], choosenSpot;
function findMoves(Turn){
    validSpots = [];
    var i, j, k, status;
    var pos = [];

    var startIndex, endIndex;
    switch(Turn){
        case 1: startIndex=17; endIndex=32; turn=1; break;
        case 2: startIndex=1;  endIndex=16; turn=2; break; 
    }

    for(k=startIndex;k<=endIndex;k++){
        pos = getTroopPos(k);
        if(pos[0] == -1)
            continue;
        troopRow = pos[0];
        troopCol = pos[1];
        for(i=0;i<8;i++){
            rowClick = i;
            for(j=0;j<8;j++){
                colClick = j;
                status = isLegalMove(k);
                if( status ){
                    validSpots.push(""+troopRow+troopCol+i+j+status);
                }
            }
        }
    }
}

function chooseMove(){
    var rand = Math.floor( Math.random() * validSpots.length );
    choosenSpot = validSpots[rand];
    
    troopRow = parseInt( choosenSpot[0] );
    troopCol = parseInt( choosenSpot[1] );
    rowClick = parseInt( choosenSpot[2] );
    colClick = parseInt( choosenSpot[3] );
}

function getTroopPos(troop){
    var i, j;
    for(i=0;i<8;i++){
        for(j=0;j<8;j++){
            if(chessBoard[i][j]==troop){
                return [i,j];
            }
        }
    }
    return [-1,-1];
}

function resolveCheck(){
    var i, checkStatus;
    for(i=0;i<validSpots.length;i++){
        choosenSpot = validSpots[i];
        troopRow = parseInt( choosenSpot[0] );
        troopCol = parseInt( choosenSpot[1] );
        rowClick = parseInt( choosenSpot[2] );
        colClick = parseInt( choosenSpot[3] );
        troop = chessBoard[troopRow][troopCol];
        // alert(troop + " make");
        makePseudoMove();
        checkStatus = isCheck();
        reversePseudoMove();
        if(checkStatus==1){
            // alert(troop + " rev check");
        }else{
            // alert(troop + " rev");
            break;
        }
    }
}






// mode changing functions
function modeToComp(){
    mode = 's';
    $("#first-page").addClass("hide");
    $("#chess-page").removeClass("hide");
}
function modeToMulti(){
    mode = 'm';
    $("#first-page").addClass("hide");
    $("#chess-page").removeClass("hide");
}





// const pawn1 = document.querySelector(".pawn-1");

// // pawns dragging events
// pawn1.addEventListener("dragstart", ()=>{
//     console.log("drag-start triggered");
// });
// pawn1.addEventListener("dragend", (e)=>{
//     console.log("drag has been ended");
//     e.target.className = "pawn-1";
// });

// const places = $(".square");
// for(square of places){
//     square.addEventListener('dragover', (e)=>{
//         e.preventDefault(); // to trigger drop event
//         console.log("drag-over got triggered");
//     });
//     square.addEventListener('dragenter', ()=>{
//         console.log("drag-enter got triggered");
//     });
//     square.addEventListener('dragleave', ()=>{
//         console.log("drag-leave got triggered");
//     });
//     square.addEventListener('drop', (e)=>{
//         console.log("drop got triggered");
//         e.target.append("<h1>Hello</h1>");
//     });
// }
