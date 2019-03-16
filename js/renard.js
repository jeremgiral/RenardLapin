
class Animal { 
    constructor(positionX, positionY,type) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.type = type;
    }
    
    randMove(pos = [0,1,2,3]){
        while(pos.length>0){
            var rand = pos[Math.floor(Math.random() * pos.length)];
            var newX = this.positionX;
            var newY = this.positionY;
            switch (rand) {
                case 0:
                    newY--;
                    break;
                case 1:
                    newX++;
                    break;
                case 2:
                    newY++;
                    break;
                case 3:
                    newX--;
                    break; 
            }
            if(newX<0 || newX>=tailleX || newY<0 || newY>=tailleY || tableau[newX][newY]!=0){
                var index = pos.indexOf(rand);
                if (index > -1) {
                    pos.splice(index, 1);
                }
                this.randMove(pos);
            }else{
                tableau[newX][newY]=this;
                tableau[this.positionX][this.positionY]=0;
                this.positionX=newX;
                this.positionY=newY;
            }
        }
    }
    
}
  
class Renard extends Animal {
    constructor(positionX, positionY,type,dureeSurvieRenard) {
      super(positionX, positionY,type);
      this.vie=dureeSurvieRenard;
    }
    perteVie(){
        this.vie=this.vie-1;
        if(this.vie<=0){
            tableau[this.positionX][this.positionY]=0
            var index = listeRenard.indexOf(this);
            if (index > -1) {
                listeRenard.splice(index, 1);
            }
        }
    }
    static reproduction(taux){
        var arRenards=new Array(Math.floor(listeRenard.length*taux))
        while(arRenards.length>0){
            rand=listeLibre[Math.floor(Math.random() * listeLibre.length)];
            randX=rand.x;
            randY=rand.y;
            newRenard=new Renard(randX,randY,'R',dureeSurvieRenard);
            tableau[randX][randY]=newRenard;
            listeRenard.push(newRenard);
            arRenards.pop();
            var index = listeLibre.indexOf(rand);
            if (index > -1) {
                listeLibre.splice(index, 1);
            }
        }
    }
    mange(lapin){
        this.vie=this.vie+3;
        var index = listeLapin.indexOf(lapin);
        if (index > -1) {
            listeLapin.splice(index, 1);
        }
        tableau[lapin.positionX][lapin.positionY]=this;
        tableau[this.positionX][this.positionY]=0;
        this.positionX=lapin.positionX;
        this.positionY=lapin.positionY;
    }
    move(direction){
        var newX = this.positionX;
        var newY = this.positionY;
        switch (direction) {
            case 0:
                newY--;
                break;
            case 1:
                newX++;
                break;
            case 2:
                newY++;
                break;
            case 3:
                newX--;
                break; 
        }
        var pos;
        if(newX<0 || newX>=tailleX || newY<0 || newY>=tailleY){
            pos=[0,1,2,3]
            var index = pos.indexOf(direction);
            if (index > -1) {
                pos.splice(index, 1);
            }
            this.randMove(pos);
        } else if(tableau[newX][newY] instanceof Lapin) {
            this.mange(tableau[newX][newY]);
        } else if(tableau[newX][newY] instanceof Renard) {
            pos=[0,1,2,3]
            var index = pos.indexOf(direction);
            if (index > -1) {
                pos.splice(index, 1);
            }
        } else {
            tableau[newX][newY]=this;
            tableau[this.positionX][this.positionY]=0;
            this.positionX=newX;
            this.positionY=newY;
        }
    }
}
class Lapin extends Animal{
    constructor(positionX, positionY,type) {
        super(positionX, positionY,type);
    }
    static reproduction(taux){
        var arLapin=new Array(Math.floor(listeLapin.length*taux))
        while(arLapin.length>0){
            rand=listeLibre[Math.floor(Math.random() * listeLibre.length)];
            randX=rand.x;
            randY=rand.y;
            newLapin=new Lapin(randX,randY,'L');
            tableau[randX][randY]=newLapin;
            listeLapin.push(newLapin);
            arLapin.pop();
            var index = listeLibre.indexOf(rand);
            if (index > -1) {
                listeLibre.splice(index, 1);
            }
        }
    }
}

var frequenceApparition=0.1;
var rangeRenard=5;
var dureeSurvieRenard=10;
var nbRenards=100;
var nbLapins=100;
var tailleX=30;
var tailleY=30;
var nbTour = 0;
var nbTourMax;
var tableau = [];
for (var i=0;i<tailleX;i++){

    if(typeof tableau[i] === 'undefined'){
        tableau.push([]);
    }
    for (var j=0;j<tailleY;j++){
        tableau[i].push(0);
    }
}
var listeRenard=[];
var arRenards=new Array(nbRenards)
while(arRenards.length>0){
    randX=Math.floor(Math.random() * tailleX);
    randY=Math.floor(Math.random() * tailleY);
    if(tableau[randX][randY]==0){
        newRenard=new Renard(randX,randY,'R',dureeSurvieRenard)
        tableau[randX][randY]=newRenard;
        listeRenard.push(newRenard);
        arRenards.pop();
    }
}
var arLapins=new Array(nbLapins)
var listeLapin=[];
while(arLapins.length>0){
    randX=Math.floor(Math.random() * tailleX);
    randY=Math.floor(Math.random() * tailleY);
    if(tableau[randX][randY]==0){
        newLapin = new Lapin(randX,randY,'L');
        tableau[randX][randY]=newLapin;
        listeLapin.push(newLapin);
        arLapins.pop();
    }
}


function tour(){
    nbTour++;
    chasse();
    moveLapin();
    console.log(listeLapin.length);
    console.log(listeRenard.length);
    reproduction();
    miseEnForme();
    var listeLibre=[];
    for (var i=0;i<tailleX;i++){
        for (var j=0;j<tailleY;j++){
            if(tableau[i][j]==0){
                listeLibre.push({"x":i,"y":j})
            }
        }
    }

}

function reproduction(){
    Lapin.reproduction(frequenceApparition);
    Renard.reproduction(frequenceApparition/10);
}

function calculDistance(a,b){
    
    return Math.sqrt((a.positionX-b.positionX)^2+(a.positionY-b.positionY)^2)
}
function moveLapin(){
    listeLapin.forEach(function(lapin){
        lapin.randMove();
    });
}
function direction(a,b){
    if(Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI<=-45 && Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI>-135){
        return 0;
    } else if(Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI<=45 && Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI>-45){
        return 1;
    }else if(Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI<=135 && Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI>45){
        return 2;
    }else if(Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI<=-135 || Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX)* 180 / Math.PI>135){
        return 3;
    }
}
    

function chasse(){
    listeRenard.forEach(function(renard){
        listeProies=[]
        for(var i=renard.positionX-rangeRenard;i<=renard.positionX+rangeRenard;i++){
            for(var j=renard.positionY-rangeRenard;j<=renard.positionY+rangeRenard;j++){
                if(tableau[i] && tableau[i][j] instanceof Lapin){
                    listeProies.push({"Lapin":tableau[i][j],"distance":calculDistance(tableau[i][j],renard)})
                }
            }
        }
        if(listeProies.length>0){
            renard.move(direction(renard,listeProies.reduce(function(prev, curr) {return prev.distance < curr.distance ? prev : curr;}).Lapin));
        } else{
            renard.randMove();
        }
        renard.perteVie();
    });
}
window.onload = function() {
    miseEnForme();
};
function miseEnForme(){
    var monTableau = document.getElementById('sketuveu').getElementsByTagName('tbody')[0];
    monTableau.innerHTML='';
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
                newCell.innerHTML=' ';
            }
        }
    }
}