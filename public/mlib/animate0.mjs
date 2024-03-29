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
item.lastStep = Infinity;
item.stepArrayStep = 0;

item.setNumSteps = function () {
  let {stopTime,stopStep,timePerStep} = this;
  this.numSteps = stopStep?stopStep:Math.ceil(stopTime/timePerStep);
}


item.oneStep = function (one) {
  let {paused,numSteps,lastStep,chopOffEnd,chopOffBeginning,timePerStep:tps,stepsSoFar:issf,startAtStep,stepArray,stepArrayStep:sars,prevPauseAnimation:ppa} = this;
  let ssf = this.stepsSoFar = stepArray?stepArray[sars]:issf;
  if (1) {
    console.log('ssf',ssf);
  }
  
  if (stepArray)  {
    this.numSteps = Infinity;
  }
  if ((!stepArray)&&(ssf < startAtStep)) {
    ssf = this.stepsSoFar = startAtStep;
  }
  if (this.paused) {
    return;
  }
  this.currentTime = tps*ssf;
       //console.log('ns',ns,'tns',this.numSteps);
  if  (ssf >(Math.min(lastStep+1,numSteps-chopOffEnd))) {
    debugger;
    if (this.escapesFrame) {
      console.log('FRAME ESCAPED!');
    } else {
      console.log('FRAME WAS NOT ESCAPED!');
    }
    if (this.onCompleteAnimation) {
      this.onCompleteAnimation();
    }
    return;
  }
    this.updateState();
  let frnum = ssf- Math.max(startAtStep,1);
  if (ssf&&this.saveAnimation&&(!stepArray)) { // for some reason, the first frame is corrupted 
    if (ppa) {
      debugger;
      this.whereToSave = ppa;
      core.vars.whereToSave  = ppa;
      this.prevPauseAnimation=0;
    }
    draw.saveFrame(frnum);
  }
    this.pauseAnimationMaybe();

   //   this.updateState();
  if (stepArray) {
    this.stepArrayStep++;
  } else {
    this.stepsSoFar++;
  }
  let pauseAt = this.pauseAt;
  if (pauseAt && (pauseAt.indexOf(ssf)>=0)) {
    this.paused = 1;
    return;
  }
 if (!one) {
   setTimeout(() => this.oneStep(),this.stepInterval);
 }
}

/*item.pauseAnimationMaybe = function () {
  let {stepsSoFar:ssf,whereToPause:wtp,whereToSave:wts,pauseAnimationMaybeCalled:pamc} = this;
  if (wtp && (ssf === (wtp+0))&&(!pamc)) {
    debugger;
    this.paused = 1;
    this.pauseAnimationMaybeCalled = 1;
    let wts = this.whereToSave;
    let wtps = this.padIntTo(wtp,3);
    let nwts = pamc?wtps:wts+'__f'+wtps; 
    this.setName(nwts);
  }
}*/


item.pauseAnimationMaybe = function () {
  let {stepsSoFar:ssf,whereToPause:wtp,whereToSave:wts,prevPauseAnimation:ppa} = this;
  if (wtp && (ssf === (wtp+0))&&(!ppa)) {
    debugger;
    this.paused = 1;
    let wts = this.whereToSave;
     this.prevPauseAnimation= wts;
    let wtps = this.padIntTo(wtp,3);
    let nwts = wts+'__f'+wtps; 
    this.setName(nwts);
  }
}

}  
   
export {rs};
