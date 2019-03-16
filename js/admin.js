
class Animal { 
    constructor(positionX, positionY,type) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.type = type;
    }
    
    randMove(){
        rand = Math.floor(Math.random() * 4);
        switch (rand) {
            case 0:
                newY=this.positionY-1;
                break;
            case 1:
                newX=this.positionX+1;
                break;
            case 2:
                newY=this.positionY+1;
                break;
            case 3:
                newX=this.positionX-1;
                break;
            
        }
        if(tableau[newX][newY]!=0){
            if(tableau[newX][newY]==this.type){
                this.randMove();
            }else{
                if(this.type=='R'){
                    this.mange();
                    tableau[newX][newY]=this.type;
                    tableau[this.positionX][this.positionY]=0;
                }
            }
        }else{
            tableau[newX][newY]=this.type;
            tableau[this.positionX][this.positionY]=0;
        }
    }
}
  
class Renard extends Animal {
    constructor(positionX, positionY,type) {
      super(positionX, positionY,type);
      this.vie=10;
    }
    perteVie(){
        this.vie=this.vie-1;
    }
    mange(){
        this.vie=this.vie+3;
        nbLapins=nbLapins-1;
    }
}
class Lapin extends Animal{
    constructor(positionX, positionY,type) {
        super(positionX, positionY,type);
    }
}

var nbRenards=100;
var nbLapins=100;

var tailleX=20;
var tailleY=20;
var tableau = [];
for (var i=0;i<tailleX;i++){

    if(typeof tableau[i] === 'undefined'){
        tableau.push([]);
    }
    for (var j=0;j<tailleY;j++){
        tableau[i].push(0);
    }
}
console.log(tableau);

arRenards=new Array(nbRenards)
while(arRenards.length>0){
    randX=Math.floor(Math.random() * tailleX);
    randY=Math.floor(Math.random() * tailleY);
    if(tableau[randX][randY]==0){
        tableau[randX][randY]=new Renard(randX,randY,'R');
        arRenards.pop();
    }
}
arLapins=new Array(nbLapins)
while(arLapins.length>0){
    randX=Math.floor(Math.random() * tailleX);
    randY=Math.floor(Math.random() * tailleY);
    if(tableau[randX][randY]==0){
        tableau[randX][randY]=new Lapin(randX,randY,'L');
        arLapins.pop();
    }
}



    
        
 
var monTableau = document.getElementById('sketuveu').getElementsByTagName('tbody')[0];
   for(var i=0;i<tableau.length;i++){
        var newRow = monTableau.insertRow(monTableau.rows.length);
       for(var j=0;j<tableau[i].length;j++){
            var newText = document.createTextNode('blabla');
            var newCell = newRow.insertCell(0);
            newCell.appendChild(newText);
            if(tableau[i][j] instanceof Renard){
                newCell.className='renard';
                newCell.innerHTML='Renard';
            }
            else if (tableau[i][j] instanceof Lapin) {
                newCell.className='lapin';
                newCell.innerHTML='Lapin';
            }
            else {
                newCell.className='vide';
                newCell.innerHTML='';
            }


        }
    }
