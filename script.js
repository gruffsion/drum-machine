document.documentElement.addEventListener("mousedown", () => {
  if (Tone.context.state !== "running") Tone.context.resume();
});

const playStopButton = document.getElementById("playStopButton");
const tempoSlider = document.getElementById("tempoSlider");
const tempoValue = document.getElementById("tempoValue");
const stepElements = document.querySelectorAll(".step");
const numVoices = 4;
const numSteps = 8;
const swingSlider = document.getElementById("swingSlider");
const swingValue = document.getElementById("swingValue");



//delay elements
const feedbackSlider = document.getElementById("feedbackSlider");
const feedbackValue = document.getElementById("feedbackValue");
const delayTimeSlider = document.getElementById("delayTimeSlider");
const delayTimeValue = document.getElementById("delayTimeValue");
const delayGainSlider = document.getElementById("delayGainSlider");
const delayGainValue = document.getElementById("delayGainValue");
const delayGain = new Tone.Gain(0).toDestination();
const delayEffect = new Tone.FeedbackDelay(0.0, 0.0);
delayEffect.connect(delayGain);


feedbackSlider.addEventListener("input", (event) => {
    const newFeedback = event.target.value / 100;
    delayEffect.feedback.value = newFeedback;

    // Disconnect the delay effect if feedback value is 0
    if (newFeedback === 0) {
        delayEffect.disconnect(delayGain);
        delayEffect.isConnected = false;
        // Disconnect your other drum sounds (snare, hi-hat, etc.) from the delay effect as needed
    } else {
        // Reconnect the delay effect if feedback value is greater than 0
        if (!delayEffect.isConnected) {
            delayEffect.connect(delayGain);
            delayEffect.isConnected = true;
            // Reconnect your other drum sounds (snare, hi-hat, etc.) to the delay effect as needed
        }
    }
});

  delayTimeSlider.addEventListener("input", (event) => {
    const newDelayTime = event.target.value / 1000;
    delayEffect.delayTime.value = newDelayTime;
  });

// Update the delay gain value when the delay gain slider changes
delayGainSlider.addEventListener("input", (event) => {
    const newGainValue = event.target.value / 100;
    delayGain.gain.value = newGainValue;
  });


//filter Elements
const frequencySlider = document.getElementById('frequencySlider');
const resonanceSlider = document.getElementById('resonanceSlider');

function mapFrequency(sliderValue) {
  const minValue = 20;
  const maxValue = 20000;
  const midValue = 2500;

  if (sliderValue <= 50) {
    return minValue + (midValue - minValue) * (sliderValue / 50);
  } else {
    return midValue + (maxValue - midValue) * ((sliderValue - 50) / 50);
  }
}

frequencySlider.addEventListener('input', (event) => {
  const sliderValue = event.target.value;
  const newFrequency = mapFrequency(sliderValue);
  filter.frequency.value = newFrequency;
});

resonanceSlider.addEventListener('input', (event) => {
  const newResonance = event.target.value;
  filter.Q.value = newResonance;
});



  const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 10000,
    Q: 1
  }).toDestination();




  class KickSound {
    constructor() {
      this.baseFrequency = Tone.Frequency('A0').toFrequency();
      this.currentFrequency = this.baseFrequency;
      this.pitchDecayValue = 0.01;
      this.volumeVariable = -10;
    }
  
    createSynth() {
      const synth = new Tone.MembraneSynth({
        pitchDecay: this.pitchDecayValue,
        octaves: 8,
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.2,
          release: 0.2
        },
        volume: this.volumeVariable// Set the synth's volume using the currentVolume property
      });
      synth.connect(delayEffect);
      synth.connect(filter);
      return synth;
    }
  
    setTuning(cents) {
      this.currentFrequency = this.baseFrequency * Math.pow(2, cents / 1200);
    }
  
    setDecay(newdecay) {
      this.pitchDecayValue = newdecay / 1000;
     
    }
  
    setVolume(newVolume) {
      console.log(newVolume)
      this.volumeVariable = newVolume;
    }
  
  
    play(time) {
      const synth = this.createSynth();
      const duration = synth.pitchDecay + synth.envelope.release;
      synth.triggerAttack(this.currentFrequency, time, 1);
      synth.triggerRelease(time + duration);
    }
  }
  
  
  
   



// Snare sound
class SnareSound {
  constructor() {
    this.basePitches = ['D4', 'F#4', 'E4'];
    
    this.poly = new Tone.PolySynth(Tone.MonoSynth, {
      volume: -10,
      oscillator: {
        partials: [0, 2, 3, 4]
      },
      envelope: {
        attack: 0.003,
        decay: 0.07,
        sustain: 0
      }
    });

    this.rattle = new Tone.NoiseSynth({
      type: 'white',
      envelope: {
        attack: 0.005,
        decay: 0.15,
        sustain: 0
      },
      volume: -15
    });

    this.poly.connect(filter);
    this.poly.connect(delayEffect);
    this.rattle.connect(filter);
    this.rattle.connect(delayEffect);
  }

  setTuning(cents) {
    this.newPitches = this.basePitches.map((pitch) => {
      const baseFrequency = Tone.Frequency(pitch).toFrequency();
      const newFrequency = baseFrequency * Math.pow(2, cents / 1200);
      return Tone.Frequency(newFrequency).toNote();
    });
  }

  setVolume(volume) {
    this.poly.volume.value = volume;
    this.rattle.volume.value = volume;
  }

  play(time) {
    const pitches = this.newPitches || this.basePitches;
    this.poly.triggerAttackRelease(pitches, '16n', time);
    this.rattle.triggerAttackRelease('16n', time);
  }
}



class HiHatSound {
  constructor() {
    
    this.hat = new Tone.NoiseSynth({
      volume: -15,
      noise: {
        type: 'white'
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0,
        release: 0.2,
      },
    });

    this.hatFilter = new Tone.Filter({
      type: 'bandpass',
      frequency: 8000,
      Q: 1
    });

    this.hat.connect(this.hatFilter);
    this.hatFilter.connect(filter);
    this.hatFilter.connect(delayEffect);
  }

  setVolume(volume) {
    this.hat.volume.value = volume;
  }

  setPitch(pitch) {
    const minValue = 4000;
    const maxValue = 12000;
    const newFrequency = minValue + (maxValue - minValue) * (pitch / 100);
    this.hatFilter.frequency.value = newFrequency;
  }

  play(time) {
    this.hat.triggerAttackRelease("8n", time);
  }
}





let cowbellPitch = 'A5';

  //Percussion sound
  class CowbellSound {
    constructor() {
      this.click = new Tone.MembraneSynth({
        pitchDecay: 0.01,
        octaves: 1,
        oscillator: {type: 'square4'},
        envelope: {
          attack: 0.001,
          decay: 0.05,
          sustain: 0.01
        },
        volume: -10
      });
      this.click.connect(delayEffect);
      this.click.connect(filter);
    }

    setVolume(volume) {
      this.click.volume.value = volume;
    }
  
    play(time) {
      this.click.triggerAttackRelease(cowbellPitch, '16n', time, 0.8);
    }
  }



//controls for volume and pitch
const kickVolumeSlider = document.getElementById("kickVolumeSlider");
const kickTuneSlider = document.getElementById("kickTuneSlider");
const kickDecaySlider = document.getElementById("kickDecaySlider");
const kickDecayValue = document.getElementById("kickDecayValue");
const snareVolumeSlider = document.getElementById("snareVolumeSlider");
const snarePitchSlider = document.getElementById("snarePitchSlider");
const hiHatVolumeSlider = document.getElementById("hihat-volume");
const hiHatPitchSlider = document.getElementById("hihat-pitch");
const cowbellVolumeSlider = document.getElementById("cowbellVolumeSlider");
const percussionTuning = document.getElementById("percussionTuning");



//event listeners for voice controls
kickVolumeSlider.addEventListener("input", (event) => {
  const newVolume = event.target.value;
  // const newVolumeInDecibels = Tone.gainToDb(newVolume / 100); // Convert the linear gain value to decibels
  kick.setVolume(newVolume);
});


kickTuneSlider.addEventListener("input", (event) => {
  // Adjust kick tuning
  const newTuning = event.target.value;
  // kickTuneValue.textContent = newTuning;
  kick.setTuning(newTuning);
});

kickDecaySlider.addEventListener("input", (event) => {
  const newDecay = event.target.value;
  kick.setDecay(newDecay);
});

snareVolumeSlider.addEventListener("input", (event) => {
  const newVolume = event.target.value;
  snare.setVolume(newVolume);
});

snarePitchSlider.addEventListener("input", () => {
  const newPitch = snarePitchSlider.value;
  snare.setTuning(newPitch);
});

hiHatVolumeSlider.addEventListener("input", () => {
  const newVolume = hiHatVolumeSlider.value;
  hihat.setVolume(newVolume);
});

hiHatPitchSlider.addEventListener("input", () => {
  const newPitch = parseFloat(hiHatPitchSlider.value);
  hihat.setPitch(newPitch);
});

cowbellVolumeSlider.addEventListener("input", (event) => {
  const newVolume = event.target.value;
  cowbell.setVolume(newVolume);
});

percussionTuning.addEventListener("input", (event) => {
  const baseFrequency = Tone.Frequency('A5');
  const newFrequency = baseFrequency.transpose(event.target.value);
  cowbellPitch = newFrequency.toNote();
});

















const kick = new KickSound();
const snare = new SnareSound()
const hihat = new HiHatSound();
const cowbell = new CowbellSound();








swingSlider.addEventListener("input", (event) => {
  const newSwing = event.target.value;
  swingValue.textContent = newSwing;
  Tone.Transport.swing = newSwing / 100;
  Tone.Transport.swingSubdivision = "16n";
});



//play button control

playStopButton.addEventListener("click", () => {
  if (Tone.Transport.state !== "started") {
    Tone.Transport.start();
    playStopButton.textContent = "Stop";
    stepIndex = 1;
  } else {
    Tone.Transport.stop();
    Tone.Transport.position = "0:0:0"; // Set position to the start
    playStopButton.textContent = "Start";
    stepIndex = 1;
  }
});





//assign space bar to play
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevents scrolling when spacebar is pressed

    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
      playStopButton.textContent = "Stop";
    } else {
      Tone.Transport.stop();
      playStopButton.textContent = "Start";
       stepIndex = 1;
    }
  }
});




tempoSlider.addEventListener("input", (event) => {
  const newTempo = event.target.value;
  tempoValue.textContent = newTempo;
  Tone.Transport.bpm.value = newTempo;
});


// Create an array to hold column references
const columnElements = [];

for (let i = 1; i <= numSteps; i++) {
  const column = document.getElementById(`col${i}`);
  columnElements.push(column);
}

function updateSequencer(currentStep, time){
  columnElements.forEach((column, index) => {
    const steps = stepElements;

    if (index + 1 === currentStep) {
      column.classList.add("activeColumn");
    } else {
      column.classList.remove("activeColumn");
    }

    steps.forEach((step) => {
      // Trigger the drum sound if the step is checked and active
      if (step.checked && step.parentElement === column && index + 1 === currentStep) {
        switch (step.className.split(" ")[1]) {
          case "kick":
            // Trigger kick sound
            kick.play(time);
            break;
          case "snare":
            // Trigger snare sound
            snare.play(time);
            break;
          case "hat":
            // Trigger hi-hat sound
            hihat.play(time);
            break;
          case "percussion":
            // Trigger percussion sound
            cowbell.play(time);
            break;
          default:
            break;
        }
      }
    });
  });
}







  let stepIndex = 1;
  Tone.Transport.scheduleRepeat((time) => {
    updateSequencer(stepIndex, time);
    stepIndex = (stepIndex % numSteps) + 1;
  }, "8n");


//TABS DISPLAY

document.addEventListener("DOMContentLoaded", function () {
  function handleTabs(tabLinks, tabContents) {
    for (let tabLink of tabLinks) {
      tabLink.addEventListener("click", function () {
        let target = this.getAttribute("data-target");

        for (let tabContent of tabContents) {
          if (tabContent.id === target) {
            tabContent.style.display = "grid";
          } else {
            tabContent.style.display = "none";
          }
        }

        for (let otherTabLink of tabLinks) {
          otherTabLink.classList.remove("active");
        }

        this.classList.add("active");
      });
    }
  }

  let drumTabs = document.querySelectorAll("#drum-paramaters .tab");
  let drumTabContents = document.querySelectorAll("#drum-paramaters .tab-content");
  handleTabs(drumTabs, drumTabContents);

  let masterEffectTabs = document.querySelectorAll("#master-effects .tab");
  let masterEffectTabContents = document.querySelectorAll("#master-effects .tab-content");
  handleTabs(masterEffectTabs, masterEffectTabContents);
});
  
  // Set the initial active tab
  document.querySelector('.tab').click();



  
