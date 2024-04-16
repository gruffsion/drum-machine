const kickBus = new Tone.Gain(1).connect(delayEffect);
kickBus.connect(filter);


class KickSound {
  constructor() {
    this.baseFrequency = Tone.Frequency('A1'); // Updated to A1 (55 Hz)
    this.volumeVariable = -10;
    this.decayValue = 0.1; // Default decay
    this.releaseValue = 0.5; // Default release

    this.synth = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 8,
      oscillator: {
        type: 'sine',
        frequency: 65
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.2,
        release: this.releaseValue
      },
      volume: this.volumeVariable
    }).connect(kickBus);
  }

  setTuning(cents) {
    this.synth.oscillator.frequency.value = cents;
  }

  setDecay(newDecay) {
    this.synth.envelope.decay = newDecay;
    this.synth.envelope.release = newDecay;
  }

  setVolume(newVolume) {
    this.synth.volume.value = newVolume;
  }

  play(time) {
    this.synth.triggerAttackRelease(this.synth.oscillator.frequency.value, '8n', time);
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
        decay: 0.2,
        sustain: 0.05, 
      },
      volume: -20
    });

    this.poly.connect(filter);
    this.poly.connect(delayEffect);
    this.rattle.connect(filter);
    this.rattle.connect(delayEffect);
  }

  setTuning(cents) {
    this.basePitches = this.basePitches.map(pitch => {
      const baseFrequency = Tone.Frequency(pitch).toFrequency();
      const newFrequency = baseFrequency * Math.pow(2, cents / 1200);
      return Tone.Frequency(newFrequency).toNote();
    });
  }

  setDecay(newDecay) {
    this.rattle.envelope.decay = newDecay;
  }

  setVolume(volume) {
    this.poly.volume.value = volume;
    this.rattle.volume.value = volume;
  }

  play(time) {
    const pitches = this.basePitches;
    this.poly.triggerAttackRelease(pitches, '16n', time);
    this.rattle.triggerAttackRelease('16n', time);
  }
}




class HiHatSound {
  constructor() {
    this.hat = new Tone.NoiseSynth({
      volume: -17,
      noise: {
        type: 'white'
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
      },
    });

    this.hatFilter = new Tone.Filter({
      type: 'bandpass',
      frequency: 8000,
      Q: 1
    });

    this.hat.connect(this.hatFilter);
    this.hatFilter.connect(delayEffect);
    this.hatFilter.connect(filter);
  }

  setVolume(volume) {
    this.hat.volume.value = volume;
  }

  setPitch(newPitch) {
    this.hatFilter.Q.value = newPitch;
  }

  setDecay(newDecay) {
    this.hat.envelope.decay = newDecay;
    this.hat.envelope.release = newDecay;
  }

  play(time) {
    this.hat.triggerAttackRelease("8n", time);
  }
}






let cowbellPitch = 'F#5';
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
        volume: -15
      });
      this.click.connect(delayEffect);
      this.click.connect(filter);

    }

    setVolume(volume) {
      this.click.volume.value = volume;
    }
  
    setDecay(newdecay) {
      this.click.envelope.decay = newdecay;
    }
  


    play(time) {
      this.click.triggerAttackRelease(cowbellPitch, '16n', time, 0.8);
    }
  }



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


//controls for volume and pitch
const kickVolumeSlider = document.getElementById("kickVolumeSlider");
const kickTuneSlider = document.getElementById("kickTuneSlider");
const kickDecaySlider = document.getElementById("kickDecaySlider");
const kickDecayValue = document.getElementById("kickDecayValue");
const snareVolumeSlider = document.getElementById("snareVolumeSlider");
const snarePitchSlider = document.getElementById("snarePitchSlider");
const snareDecaySlider = document.getElementById("snareDecaySlider");
const hiHatVolumeSlider = document.getElementById("hihat-volume");
const hiHatPitchSlider = document.getElementById("hihat-pitch");
const hiHatDecaySlider = document.getElementById("hihatDecaySlider");
const cowbellVolumeSlider = document.getElementById("cowbellVolumeSlider");
const percussionTuning = document.getElementById("percussionTuning");
const percussionDecaySlider = document.getElementById("percussionDecaySlider");














kickVolumeSlider.addEventListener("input", (event) => {
    const newVolume = event.target.value;
    kickBus.gain.value = newVolume;
  });


  document.getElementById('kickTuneSlider').addEventListener('input', function(event) {
    let cents = parseInt(event.target.value); // Ensures the value is an integer
    kick.setTuning(cents); // Assuming `kickSound` is an instance of your `KickSound` class
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

snareDecaySlider.addEventListener("input", (event) => {
  const newDecay = event.target.value;
  snare.setDecay(newDecay);
});



hiHatVolumeSlider.addEventListener("input", () => {
  const newVolume = hiHatVolumeSlider.value;
  hihat.setVolume(newVolume);
});

hiHatPitchSlider.addEventListener("input", () => {
  const newPitch = parseFloat(hiHatPitchSlider.value);
  hihat.setPitch(newPitch);
});

hiHatDecaySlider.addEventListener("input", (event) => {
  const newDecay = event.target.value;
  hihat.setDecay(newDecay);
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

percussionDecaySlider.addEventListener("input", (event) => {
  const newDecay = event.target.value;
  cowbell.setDecay(newDecay);
});
















const kick = new KickSound();
const snare = new SnareSound()
const hihat = new HiHatSound();
const cowbell = new CowbellSound();





swingSlider.addEventListener("input", (event) => {
  const newSwing = event.target.value;
  Tone.Transport.swing = newSwing;
  // Tone.Transport.swingSubdivision = "16n";
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

function updateSequencer(currentStep, time) {
  columnElements.forEach((column, index) => {
    const isActiveColumn = index + 1 === currentStep;
    column.classList.toggle("activeColumn", isActiveColumn);

    if (isActiveColumn) {
      stepElements.forEach((step) => {
        if (step.checked && step.parentElement === column) {
          switch (step.className.split(" ")[1]) {
            case "kick":
              kick.play(time);
              break;
            case "snare":
              snare.play(time);
              break;
            case "hat":
              hihat.play(time);
              break;
            case "percussion":
              cowbell.play(time);
              break;
            default:
              break;
          }
        }
      });
    }
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



  