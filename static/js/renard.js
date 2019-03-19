


class Animal {
    constructor(positionX, positionY, type) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.type = type;
    }
    randMove(pos = [0, 1, 2, 3],simulation) {
        console.log(simulation);        
        while (pos.length > 0) {
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
            if (newX < 0 || newX >= tailleX || newY < 0 || newY >= tailleY || simulation.tableau[newX][newY] != 0) {
                var index = pos.indexOf(rand);
                if (index > -1) {
                    pos.splice(index, 1);
                }
                this.randMove(pos,simulation);
            } else {
                simulation.tableau[newX][newY] = this;
                simulation.tableau[this.positionX][this.positionY] = 0;
                this.positionX = newX;
                this.positionY = newY;
            }
        }
    }

}

class Renard extends Animal {
    constructor(positionX, positionY, type, dureeSurvieRenard) {
        super(positionX, positionY, type);
        this.vie = dureeSurvieRenard;
    }
    perteVie(simulation) {
        this.vie = this.vie - 1;
        if (this.vie <= 0) {
            simulation.tableau[this.positionX][this.positionY] = 0
            var index = simulation.listeRenard.indexOf(this);
            if (index > -1) {
                simulation.listeRenard.splice(index, 1);
            }
        }
    }
    static reproduction(taux,simulation) {
        var arRenards = new Array(Math.floor(simulation.listeRenard.length * taux))
        while (arRenards.length > 0) {
            rand = simulation.listeLibre[Math.floor(Math.random() * simulation.listeLibre.length)];
            randX = rand.x;
            randY = rand.y;
            newRenard = new Renard(randX, randY, 'R', simulation.dureeSurvieRenard);
            simulation.tableau[randX][randY] = newRenard;
            simulation.listeRenard.push(newRenard);
            arRenards.pop();
            var index = simulation.listeLibre.indexOf(rand);
            if (index > -1) {
                simulation.listeLibre.splice(index, 1);
            }
        }
    }
    mange(lapin,simulation) {
        this.vie = this.vie + 3;
        var index = simulation.listeLapin.indexOf(lapin);
        if (index > -1) {
            simulation.listeLapin.splice(index, 1);
        }
        simulation.tableau[lapin.positionX][lapin.positionY] = this;
        simulation.tableau[this.positionX][this.positionY] = 0;
        this.positionX = lapin.positionX;
        this.positionY = lapin.positionY;
    }
    move(direction,simulation) {
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
        if (newX < 0 || newX >= simulation.tailleX || newY < 0 || newY >= simulation.tailleY) {
            pos = [0, 1, 2, 3]
            var index = pos.indexOf(direction);
            if (index > -1) {
                pos.splice(index, 1);
            }
            this.randMove(pos,simulation);
        } else if (simulation.tableau[newX][newY] instanceof Lapin) {
            this.mange(simulation.tableau[newX][newY],simulation);
        } else if (simulation.tableau[newX][newY] instanceof Renard) {
            pos = [0, 1, 2, 3]
            var index = pos.indexOf(direction);
            if (index > -1) {
                pos.splice(index, 1);
            }
        } else {
            simulation.tableau[newX][newY] = this;
            simulation.tableau[this.positionX][this.positionY] = 0;
            this.positionX = newX;
            this.positionY = newY;
        }
    }
}
class Lapin extends Animal {
    constructor(positionX, positionY, type) {
        super(positionX, positionY, type);
    }
    static reproduction(taux,simulation) {
        var arLapin = new Array(Math.floor(simulation.listeLapin.length * taux))
        while (arLapin.length > 0) {
            rand = simulation.listeLibre[Math.floor(Math.random() * simulation.listeLibre.length)];
            randX = rand.x;
            randY = rand.y;
            newLapin = new Lapin(randX, randY, 'L');
            simulation.tableau[randX][randY] = newLapin;
            simulation.listeLapin.push(newLapin);
            arLapin.pop();
            var index = simulation.listeLibre.indexOf(rand);
            if (index > -1) {
                simulation.listeLibre.splice(index, 1);
            }
        }
    }
}
class Simulation {
    constructor(frequenceApparition, rangeRenard, dureeSurvieRenard, nbRenards, nbLapins, tailleX, tailleY, nbTourMax) {
        this.frequenceApparition = frequenceApparition;
        this.rangeRenard = rangeRenard;
        this.dureeSurvieRenard = dureeSurvieRenard;
        this.nbRenards = nbRenards;
        this.nbLapins = nbLapins;
        this.tailleX = tailleX;
        this.tailleY = tailleY;
        this.nbTourMax = nbTourMax;
        this.nbTour = 0;
        this.listeLapin=[];
        this.listeLibre=[];
        this.listeProies=[];
        this.listeRenard=[];
        this.tableau=[];
    }
    reproduction() {
        console.log("rentré dans reproduction");
        Lapin.reproduction(this.frequenceApparition,this);
        Renard.reproduction(this.frequenceApparition / 10,this);
        console.log("fin reproduction");
    }
    moveLapin() {
        console.log("rentré dans move lapin");
        
        this.listeLapin.forEach(function (lapin,l) {
            console.log("un lapin debut move");
            lapin.randMove(this);
        }.bind(this));
        console.log("fin move lapin");
    }
    chasse() {
        console.log("rentré dans chasse");        
        this.listeRenard.forEach(function (renard,r) {         
            console.log("each renard");
            console.log(this);            
            this.listeProies = [];
            for (var i = renard.positionX - rangeRenard; i <= renard.positionX + rangeRenard; i++) {
                for (var j = renard.positionY - rangeRenard; j <= renard.positionY + rangeRenard; j++) {
                    if (this.tableau[i] && this.tableau[i][j] instanceof Lapin) {
                        listeProies.push({ "Lapin": this.tableau[i][j], "distance": calculDistance(this.tableau[i][j], renard) })
                    }
                }
            }
            if (this.listeProies.length > 0) {
                renard.move(direction(renard, this.listeProies.reduce(function (prev, curr) { return prev.distance < curr.distance ? prev : curr; }).Lapin),this);
            } else {
                renard.randMove(this);
            }
            renard.perteVie(this);
        }.bind(this));
        console.log("sortie chasse");        
    }
    initGrille() {
        console.log("entré init grille");        
        for (var i = 0; i < this.tailleX; i++) {
    
            if (typeof this.tableau[i] === 'undefined') {
                this.tableau.push([]);
            }
            for (var j = 0; j < this.tailleY; j++) {
                this.tableau[i].push(0);
            }
        }
        var arRenards = new Array(this.nbRenards);
        var randX,randY;
        while (arRenards.length > 0) {
            randX = Math.floor(Math.random() * this.tailleX);
            randY = Math.floor(Math.random() * this.tailleY);
            if (this.tableau[randX][randY] == 0) {
                var newRenard = new Renard(randX, randY, 'R', this.dureeSurvieRenard)
                this.tableau[randX][randY] = newRenard;
                this.listeRenard.push(newRenard);
                arRenards.pop();
            }
        }
        var arLapins = new Array(this.nbLapins)
        while (arLapins.length > 0) {
            randX = Math.floor(Math.random() * this.tailleX);
            randY = Math.floor(Math.random() * this.tailleY);
            if (this.tableau[randX][randY] == 0) {
                var newLapin = new Lapin(randX, randY, 'L');
                this.tableau[randX][randY] = newLapin;
                this.listeLapin.push(newLapin);
                arLapins.pop();
            }
        }
        console.log("fin initgrille");        
    }
    tour() {
        console.log("debut tour");        
        this.nbTour++;
        this.chasse();
        this.moveLapin();
        this.reproduction();
        miseEnForme(this);
        this.listeLibre = [];
        for (var i = 0; i < this.tailleX; i++) {
            for (var j = 0; j < this.tailleY; j++) {
                if (this.tableau[i][j] == 0) {
                    this.listeLibre.push({ "x": i, "y": j })
                }
            }
        }
        console.log("fin tour");
    }
}


// function calculDistance(a, b) {

//     return Math.sqrt((a.positionX - b.positionX) ^ 2 + (a.positionY - b.positionY) ^ 2)
// }

// function direction(a, b) {
//     if (Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI <= -45 && Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI > -135) {
//         return 0;
//     } else if (Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI <= 45 && Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI > -45) {
//         return 1;
//     } else if (Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI <= 135 && Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI > 45) {
//         return 2;
//     } else if (Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI <= -135 || Math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / Math.PI > 135) {
//         return 3;
//     }
// }



// window.onload = function(){
//     document.getElementById('btnTour').onclick = function () {
//         var frequenceApparition = document.getElementById('frequenceApparition').value;
//         var rangeRenard = document.getElementById('rangeRenard').value;
//         var dureeSurvieRenard = document.getElementById('dureeSurvieRenard').value;
//         var nbRenards = document.getElementById('nbRenards').value;
//         var nbLapins = document.getElementById('nbLapins').value;
//         var tailleX = document.getElementById('tailleX').value;
//         var tailleY = document.getElementById('tailleY').value;
//         var nbTourMax = document.getElementById('nbTourMax').value;
//         var simulation = new Simulation(frequenceApparition, rangeRenard, dureeSurvieRenard, nbRenards, nbLapins, tailleX, tailleY, nbTourMax)
//         simulation.initGrille();
//         while (simulation.nbTour < simulation.nbTourMax) {
//             console.log(simulation);
//             console.log(simulation.nbTour);
//             simulation.tour();
//             setTimeout(function () {miseEnForme(simulation);}, 1000);
//         }
        
//     };
    
// }
// function miseEnForme(simulation) {
//     var monTableau = document.getElementById('sketuveu').getElementsByTagName('tbody')[0];
//     monTableau.innerHTML = '';
//     for (var i = 0; i < simulation.tableau.length; i++) {
//         var newRow = monTableau.insertRow(monTableau.rows.length);
//         for (var j = 0; j < simulation.tableau[i].length; j++) {
//             var newText = document.createTextNode('blabla');
//             var newCell = newRow.insertCell(0);
//             newCell.appendChild(newText);
//             if (simulation.tableau[i][j] instanceof Renard) {
//                 newCell.className = 'renard';
//                 newCell.innerHTML = 'Renard';
//             }
//             else if (simulation.tableau[i][j] instanceof Lapin) {
//                 newCell.className = 'lapin';
//                 newCell.innerHTML = 'Lapin';
//             }
//             else {
//                 newCell.className = 'vide';
//                 newCell.innerHTML = ' ';
//             }
//         }
//     }
// }
// function lancer() {
//     initGrille(tailleX, tailleY, nbLapins, nbRenards, dureeSurvieRenard);
//     while (nbTour < nbTourMax) {
//         setTimeout(function () { }, 1000);
//         tour();
//     }
// }

// function tour() {
//     nbTour++;
//     chasse();
//     moveLapin();
//     console.log(listeLapin.length);
//     console.log(listeRenard.length);
//     reproduction();
//     miseEnForme();
//     var listeLibre = [];
//     for (var i = 0; i < tailleX; i++) {
//         for (var j = 0; j < tailleY; j++) {
//             if (tableau[i][j] == 0) {
//                 listeLibre.push({ "x": i, "y": j })
//             }
//         }
//     }

// }