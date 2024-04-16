
//Distortion element
const distortion = new Tone.BitCrusher(8);
const distortionFilter = new Tone.Filter(400, "highpass").connect(distortion);
distortion.wet.value = 0;
const distortionGain = new Tone.Gain(1).toDestination();
distortion.chain(distortionGain);
const distortionGainSlider = document.getElementById("distortionGain");
const distortionGainSlider2 = document.getElementById("distortionSlider2");

distortionGainSlider.addEventListener('input', (event) => {
  const newDistortion = event.target.value;
  // distortion.wet.value = newDistortion;
  distortion.wet.value = newDistortion;
});

distortionGainSlider2.addEventListener('input', (event) => {
  const newValue= event.target.value;
  distortion.bits.value = newValue;;
});

//filter Elements
const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: 10000,
    Q: 1
  }).connect(distortion);

  
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


filter.chain(distortionFilter);




//delay elements
const feedbackSlider = document.getElementById("feedbackSlider");
const feedbackValue = document.getElementById("feedbackValue");
const delayTimeSlider = document.getElementById("delayTimeSlider");
const delayTimeValue = document.getElementById("delayTimeValue");
const delayGainSlider = document.getElementById("delayGainSlider");
const delayGainValue = document.getElementById("delayGainValue");
const delayGain = new Tone.Gain(1).connect(filter);
const delayEffect = new Tone.FeedbackDelay(0.0, 0.0);
delayEffect.connect(delayGain);


feedbackSlider.addEventListener("change", event => {
    delayEffect.feedback.value = parseFloat(event.target.value) / 100;
});

delayTimeSlider.addEventListener("change", event => {
    delayEffect.delayTime.value = parseFloat(event.target.value);
});

delayGainSlider.addEventListener("change", event => {
    delayEffect.wet.value = parseFloat(event.target.value);
});



