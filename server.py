from flask import Flask, render_template,request
from random import randint
import math
import time
import json

app = Flask(__name__)

class Animal:
    def __init__(self,positionX, positionY, type) :
        self.positionX = positionX
        self.positionY = positionY
        self.type = type
    def __repr__(self):
            return str(vars(self))
    def randMove(self,simulation,pos = [0, 1, 2, 3]) :
        while (len(pos) > 0) :
            rand = pos[randint(0,len(pos)-1)]
            newX = self.positionX
            newY = self.positionY
            if rand==0:
                newY=newY-1
            elif rand==1:
                newX=newX+1
            elif rand==2:
                newY=newY+1
            elif rand==3:
                newX=newX-1
            if newX < 0 or newX >= simulation.tailleX or newY < 0 or newY >= simulation.tailleY or simulation.tableau[newX][newY] != 0 :
                pos.remove(rand)
                self.randMove(simulation,pos)
            else :
                simulation.tableau[newX][newY] = self
                simulation.tableau[self.positionX][self.positionY] = 0
                self.positionX = newX
                self.positionY = newY
            
        
    



class Renard (Animal):
    def __init__(self,positionX, positionY, type, dureeSurvieRenard) :
        self.positionX = positionX
        self.positionY = positionY
        self.type = type
        self.vie = dureeSurvieRenard
    
    def perteVie(self,simulation) :
        self.vie = self.vie - 1
        if self.vie <= 0 :
            simulation.tableau[self.positionX][self.positionY] = 0
            simulation.listeRenard.remove(self)
            
        
    def reproduction(self,taux,simulation) :
        arRenards = [None]*randint(0,math.floor(len(simulation.listeRenard) * taux))
        while len(arRenards) > 0 :
            rand = simulation.listeLibre[randint(0,len(simulation.listeLibre)-1)]
            randX = rand.x
            randY = rand.y
            newRenard = Renard(randX, randY, 'R', simulation.dureeSurvieRenard)
            simulation.tableau[randX][randY] = newRenard
            simulation.listeRenard.append(newRenard)
            simulation.listeLibre.remove(rand)
            if len(arRenards)!=1:
                arRenards.pop()
            else:
                break
        
    
    def mange(self,lapin,simulation) :
        self.vie = self.vie + 3
        simulation.listeLapin.remove(lapin)
        simulation.tableau[lapin.positionX][lapin.positionY] = self
        simulation.tableau[self.positionX][self.positionY] = 0
        self.positionX = lapin.positionX
        self.positionY = lapin.positionY

    def move(self,direction,simulation) :
        newX = self.positionX
        newY = self.positionY
        if direction==0:
            newY=newY-1
        elif direction==1:
            newX=newX+1
        elif direction==2:
            newY=newY+1
        elif direction==3:
            newX=newX-1
        if newX < 0 or newX >= simulation.tailleX or newY < 0 or newY >= simulation.tailleY :
            pos = [0, 1, 2, 3]
            pos.remove(direction)
            self.randMove(simulation,pos)
        elif isinstance(simulation.tableau[newX][newY] , Lapin) :
            self.mange(simulation.tableau[newX][newY],simulation)
        elif isinstance(simulation.tableau[newX][newY], Renard) :
            pos = [0, 1, 2, 3]
            pos.remove(direction)
            
        else :
            simulation.tableau[newX][newY] = self
            simulation.tableau[self.positionX][self.positionY] = 0
            self.positionX = newX
            self.positionY = newY
        
    

class Lapin (Animal) :
    def __init__(self,positionX, positionY, type) :
        self.positionX = positionX
        self.positionY = positionY
        self.type = type

    def reproduction(self,taux,simulation) :
        arLapin = [None]*randint(0,math.floor(len(simulation.listeLapin) * taux))
        while len(arLapin)>0:
            rand = simulation.listeLibre[randint(0,len(simulation.listeLibre)-1)]
            randX = rand["x"]
            randY = rand["y"]
            newLapin = Lapin(randX, randY, 'L')
            simulation.tableau[randX][randY] = newLapin
            simulation.listeLapin.append(newLapin)
            simulation.listeLibre.remove(rand)
            if len(arLapin)!=1:
                arLapin.pop()
            else:
                break
            
class Simulation :
    def __init__(self,frequenceApparition, rangeRenard, dureeSurvieRenard, nbRenards, nbLapins, tailleX, tailleY, nbTourMax) :
        self.frequenceApparition = frequenceApparition
        self.rangeRenard = rangeRenard
        self.dureeSurvieRenard = dureeSurvieRenard
        self.nbRenards = nbRenards
        self.nbLapins = nbLapins
        self.tailleX = tailleX
        self.tailleY = tailleY
        self.nbTourMax = nbTourMax
        self.nbTour = 0
        self.listeLapin=[]
        self.listeLibre=[]
        self.listeProies=[]
        self.listeRenard=[]
        self.tableau=[]
    def __repr__(self):
            return str(vars(self))
    def reproduction(self) :
        lapin=Lapin(0,0,'L')
        renard=Renard(0,0,'R',self.dureeSurvieRenard)
        lapin.reproduction(self.frequenceApparition,self)
        renard.reproduction(self.frequenceApparition / 10,self)
    
    def moveLapin(self) :
        for lapin in self.listeLapin :
            lapin.randMove(self)
    
    def chasse(self) :
        for renard in self.listeRenard :  
            self.listeProies = []
            for i in range (renard.positionX - self.rangeRenard,renard.positionX + self.rangeRenard):
                for j in range(renard.positionY - self.rangeRenard,renard.positionY + self.rangeRenard):
                    i < 0 or i >= self.tailleX or j < 0 or j >= self.tailleY
                    if not(i < 0 or i >= self.tailleX or j < 0 or j >= self.tailleY) and isinstance(self.tableau[i][j],Lapin) :
                        self.listeProies.append({ "Lapin": self.tableau[i][j], "distance": calculDistance(self.tableau[i][j], renard) })
            if len(self.listeProies):
                renard.move(direction(renard, min(self.listeProies, key=lambda x: x['distance'])['Lapin']),self)
            else :
                renard.randMove(self)
            renard.perteVie(self)

    def initGrille(self) :
        for i in range(self.tailleX):    
            if i>=len(self.tableau) :
                self.tableau.append([])
            [self.tableau[i].append(0) for j in range(self.tailleY)]
                
        arRenards = [None]*self.nbRenards
        while len(arRenards) > 0:
            randX = randint(0,self.tailleX-1)
            randY = randint(0,self.tailleY-1)
            if self.tableau[randX][randY] == 0:
                newRenard = Renard(randX, randY, 'R', self.dureeSurvieRenard)
                self.tableau[randX][randY] = newRenard
                self.listeRenard.append(newRenard)
                if len(arRenards)!=1:
                    arRenards.pop()
                else:
                    break
            
        arLapins = [None]*self.nbLapins
        while len(arLapins) > 0 :
            randX = randint(0,self.tailleX-1)
            randY = randint(0,self.tailleY-1)
            if self.tableau[randX][randY] == 0:
                newLapin = Lapin(randX, randY, 'L')
                self.tableau[randX][randY] = newLapin
                self.listeLapin.append(newLapin)
                if len(arLapins)!=1:
                    arLapins.pop()
                else:
                    break
    def tour(self) :
        self.nbTour = self.nbTour + 1
        self.chasse()
        self.moveLapin()
        self.listeLibre = []
        for i in range(self.tailleX-1):
            for j in range(self.tailleY-1):
                if self.tableau[i][j] == 0 :
                    self.listeLibre.append({ "x": i, "y": j })
        self.reproduction()
        



def calculDistance(a, b) :
    return math.sqrt((a.positionX - b.positionX) ** 2 + (a.positionY - b.positionY) ** 2)


def direction(a, b) :
    angle = 180 + (math.atan2(a.positionY - b.positionY, a.positionX - b.positionX) * 180 / math.pi)
    if angle <= 135 and angle > 45 :
        return 2
    elif angle <= 225 and angle > 135 :
        return 3
    elif angle <= 315 and angle > 45 :
        return 0
    elif angle <= 45 or angle > 315 :
        return 1
    
simulation={}
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        global simulation
        if not hasattr(simulation,'frequenceApparition'):
            simulation = Simulation(float(request.form['frequenceApparition']), int(request.form['rangeRenard']), int(request.form['dureeSurvieRenard']), int(request.form['nbRenards']), int(request.form['nbLapins']), int(request.form['tailleX']), int(request.form['tailleY']), int(request.form['nbTourMax']))
            simulation.initGrille()
        simulation.tour()
        return json.JSONEncoder().encode(str(simulation.__dict__))
#
@app.route('/Renard')
def renard():
    return render_template("index.html")

@app.route('/initSimu')
def initSimu():
    global simulation
    simulation={}
    return ''

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


