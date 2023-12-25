/* a path through an n-dimensional space can be partly specified by an object {start:<state>,a0:v0,a1:v1...} where each v* has the form {step:<number>,interval:<integer>,min:<number>,max:<number>),
and a state has the form {ia0:<number>,a1:<number>,a2:<number>,...,time:<number>}. Call this a pathSpace,  Actual paths can be computed in many ways. 
For example, a random walk would involve each component changing its value by step or -step (randomly chosen) at each interval.  Sweep would involve sweeping values up until max is reached, and then
down again.*/ 

let rs = function (item) {



item.startAtStep = 0;
item.stepsSoFar = 0;
item.numSteps = 150;
item.saveAnimation = 0;
item.chopOffBeginning = 0; // in steps
item.chopOffEnd = 0; // in steps
item.stepInterval = 40;
item.pauseAt = [];

item.setNumSteps = function () {
  let {stopTime,stopStep,timePerStep} = this;
  this.numSteps = stopStep?stopStep:Math.ceil(stopTime/timePerStep);
}


item.oneStep = function (one) {
  let {paused,numSteps,lastStep,chopOffEnd,chopOffBeginning} = this;
  debugger;
  if (this.paused) {
    return;
  }
  let ns = this.stepsSoFar;	
  
       //console.log('ns',ns,'tns',this.numSteps);
  if  (this.stepsSoFar >(Math.min(lastStep+1,numSteps-chopOffEnd))) {
    debugger;
    if (this.escapesFrame) {
      console.log('FRAME ESCAPED!');
    } else {
      console.log('FRAME WAS NOT ESCAPED!');
    }
    debugger;
    if (this.onCompleteAnimation) {
      this.onCompleteAnimation();
    }
    return;
  }
    this.updateState();

  if (ns&&this.saveAnimation&&(ns>chopOffBeginning)) { // for some reason, the first frame is corrupted 
    draw.saveFrame(ns-Math.max(chopOffBeginning+1,1));
  }
   //   this.updateState();

    this.stepsSoFar++;
  let pauseAt = this.pauseAt;
  if (pauseAt && (pauseAt.indexOf(ns)>=0)) {
    this.paused = 1;
    return;
  }
 if (!one) {
   setTimeout(() => this.oneStep(),this.stepInterval);
 }
}

}  
   
export {rs};
