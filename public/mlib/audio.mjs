const rs = function (rs) {

rs.audioInitialized = 0;
rs.initAudio  = function () {
  //debugger;
  let {audioInitialized} = this;
  if (audioInitialized) {
    return;
  }
  let chunks = this.audioChunks = [];
  this.AudioContext = window.AudioContext || window.webkitAudioContext;
  let ac =this.audioContext = new this.AudioContext();
  this.audioInitialized = 1;
  let dest = this.audioDest = ac.createMediaStreamDestination();
  let mr =this.mediaRecorder = new MediaRecorder(dest.stream);
  mr.start();
   console.log('state',mr.state);
  mr.ondataavailable = (evt) => {
    // Push each chunk (blobs) in an array
    console.log('save chunk');
    chunks.push(evt.data);
  };
  
      mr.onstop = (evt) => {
         console.log('stopping mediaRecorder');
         debugger;
        // Make blob out of our blobs, and open it.
        const blob = new Blob(chunks, { type: "audio/wav; codecs=opus" });
        let url = this.audioURL =  URL.createObjectURL(blob);
        console.log(url);
        let  a = document.createElement("a");
        a.href = url;
        a.download = 'foom.wav';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
      };
    this.playTone(110,20);
  this.fileTest('/foo.txt');
}

   
rs.fileTest =  function (url) {
 //debugger;
 fetch(url).then((resp) => {
   debugger;
   let txt = resp.text();
   txt.then((rtxt) => {
    // debugger;
     console.log(rtxt);
    });
  });
}
}

export {rs};      
