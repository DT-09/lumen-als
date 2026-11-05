export type LearningModule = {
 id:string; title:string; disciplines:string; summary:string; keyIdea:string; explanation:string;
 example:string; misconception:string; activity:string; question:string;
};
export const LEARNING_MODULES: LearningModule[] = [
 {
  id:"echolocation",title:"Echolocation: sensing with sound",disciplines:"Biology · Physics · Signal processing",
  summary:"How some animals infer the location and properties of objects from returning sound.",
  keyIdea:"A returning echo carries information about distance, direction, motion and surface properties.",
  explanation:"An animal emits a sound pulse and receives reflections from nearby objects. The time delay between emission and reception can provide a distance estimate. For a stationary target and a simple path, distance is approximately sound speed multiplied by the round-trip time, divided by two. Frequency changes and echo strength can provide further clues, though real biological systems use more complex processing.",
  example:"If an echo returns 0.02 seconds after a pulse in air, and sound travels at roughly 343 m/s, the simple distance estimate is 343 × 0.02 ÷ 2 = 3.43 metres. The division by two matters because the sound travels to the object and back.",
  misconception:"The echo is not a tiny picture. It is a signal whose timing, frequency and structure must be interpreted. Different environments can distort or overlap echoes.",
  activity:"Change the assumed round-trip delay in the distance equation. Predict what happens to the inferred distance, then calculate several cases. State which assumptions make the estimate valid.",
  question:"What information can be extracted from an echo besides distance, and what makes that inference uncertain?"
 },
 {
  id:"chaos",title:"Deterministic chaos and sensitivity",disciplines:"Mathematics · Physics · Meteorology · Biology",
  summary:"Why systems governed by definite rules can still become difficult to predict.",
  keyIdea:"In some nonlinear systems, nearby starting states can evolve into very different outcomes.",
  explanation:"A deterministic system follows rules that specify its next state. Determinism does not guarantee practical predictability. In a chaotic system, small differences in initial conditions can grow rapidly over time. The system is not necessarily random; rather, limited measurement precision makes long-range prediction unreliable. Feedback and nonlinear relationships often shape this behaviour.",
  example:"Imagine two weather simulations that begin with almost identical temperature and pressure measurements. As the models evolve, small differences can grow until their forecasts diverge. This limits precise long-range forecasts even when the governing equations are deterministic.",
  misconception:"Chaos does not mean 'anything can happen' or that the system has no rules. It means the long-term outcome can be highly sensitive to the starting state.",
  activity:"Write down one example of a deterministic process and one of a random process. Explain what evidence would help distinguish sensitivity to initial conditions from genuine randomness.",
  question:"How can scientists make useful forecasts when exact long-term prediction is impossible?"
 },
 {
  id:"flight",title:"How wings generate lift",disciplines:"Physics · Fluid mechanics · Biology · Engineering",
  summary:"A connected explanation of forces, airflow, wing shape and flight control.",
  keyIdea:"A wing generates lift by changing the momentum of surrounding air and establishing a pressure distribution.",
  explanation:"A wing moving through air turns the airflow and creates a pressure distribution over its surfaces. The resulting aerodynamic force has a component perpendicular to the oncoming flow called lift. Angle of attack, airspeed, wing geometry and air density all matter. Bernoulli's principle can help describe pressure and speed along a streamline, but it is not a complete standalone explanation of lift.",
  example:"At a steady level flight condition, lift balances the aircraft's weight. If airspeed falls while other conditions remain similar, the wing may need a higher angle of attack to generate the required lift. Beyond a critical angle, flow separation can cause a stall.",
  misconception:"Air does not need to meet at the trailing edge at the same time. The equal-transit-time story is not a sound explanation of lift.",
  activity:"Sketch the forces on a wing in steady level flight. Label lift, weight, thrust and drag. Then explain which forces balance and why.",
  question:"How do birds change wing shape and motion to control lift, drag and manoeuvrability?"
 },
 {
  id:"blue-sky",title:"Why the sky appears blue",disciplines:"Physics · Chemistry · Human perception",
  summary:"How light interacts with molecules in the atmosphere and how vision interprets the scattered light.",
  keyIdea:"Air molecules scatter shorter visible wavelengths more strongly than longer wavelengths.",
  explanation:"Sunlight contains a range of visible wavelengths. When light interacts with molecules much smaller than its wavelength, Rayleigh scattering becomes important. In the relevant regime, scattering intensity has a strong inverse dependence on wavelength, approximately proportional to 1 divided by wavelength to the fourth power. Shorter blue and violet wavelengths are scattered more strongly than red wavelengths. Human vision and the solar spectrum help explain why the sky looks blue rather than violet.",
  example:"Compare two wavelengths, 450 nm and 650 nm. The simplified wavelength factor is (650/450)^4, so the shorter wavelength is scattered much more strongly under the same idealised conditions.",
  misconception:"The sky is not blue because it reflects the ocean. Nor is the atmosphere simply a blue filter; scattering redirects light through the atmosphere.",
  activity:"Explain why the sky near the horizon can look paler and why sunsets often appear red or orange. Include the longer path sunlight travels through the atmosphere.",
  question:"How would the appearance of the sky change on a planet with a different atmospheric composition?"
 },
 {
  id:"sound",title:"Sound, harmonics and timbre",disciplines:"Physics · Mathematics · Biology · Music · Computing",
  summary:"How vibrations become waves, how waveforms combine, and why instruments sound different.",
  keyIdea:"A sound's perceived character depends on more than its fundamental frequency.",
  explanation:"A periodic sound can often be described as a fundamental frequency plus harmonics at integer multiples of that frequency. The relative amplitudes and phases of these components shape the waveform and contribute to timbre. Fourier analysis provides a mathematical way to represent a complex signal as a combination of sinusoidal components. Real sounds may also be transient, noisy and time-varying.",
  example:"Two instruments can play the same note with the same fundamental frequency but produce different harmonic spectra. Their waveforms differ, so listeners can distinguish them even when pitch is similar.",
  misconception:"Pitch and timbre are not the same thing. The fundamental frequency strongly influences pitch, while the spectrum and time evolution help shape timbre.",
  activity:"Draw two waveforms with the same period but different shapes. Predict how their harmonic content might differ and explain why the sounds could be distinguishable.",
  question:"How does the ear and brain extract pitch, loudness and timbre from a changing pressure signal?"
 }
];
