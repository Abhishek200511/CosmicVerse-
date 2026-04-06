/**
 * CosmicVerse — Procedural Sound Effects via Web Audio API
 * No external audio files needed. All sounds synthesized in real-time.
 */

let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Resume if suspended (browsers require user gesture)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Sci-fi planet selection "ping" — a layered cosmic chime
 */
export function playPlanetClickSound() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  // Layer 1: Main tone sweep (rising pitch)
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(300, now)
  osc1.frequency.exponentialRampToValueAtTime(900, now + 0.15)
  gain1.gain.setValueAtTime(0.15, now)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
  osc1.connect(gain1).connect(ctx.destination)
  osc1.start(now)
  osc1.stop(now + 0.4)

  // Layer 2: Higher harmonic ping
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(800, now + 0.02)
  osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.12)
  gain2.gain.setValueAtTime(0.08, now + 0.02)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
  osc2.connect(gain2).connect(ctx.destination)
  osc2.start(now + 0.02)
  osc2.stop(now + 0.3)

  // Layer 3: Sub-bass thud for weight
  const osc3 = ctx.createOscillator()
  const gain3 = ctx.createGain()
  osc3.type = 'sine'
  osc3.frequency.setValueAtTime(80, now)
  osc3.frequency.exponentialRampToValueAtTime(40, now + 0.2)
  gain3.gain.setValueAtTime(0.12, now)
  gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
  osc3.connect(gain3).connect(ctx.destination)
  osc3.start(now)
  osc3.stop(now + 0.25)

  // Layer 4: Noise burst for sci-fi texture
  const bufferSize = ctx.sampleRate * 0.15
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const noiseData = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * 0.03
  }
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer
  const noiseGain = ctx.createGain()
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = 2000
  noiseFilter.Q.value = 3
  noiseGain.gain.setValueAtTime(0.06, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination)
  noise.start(now)
  noise.stop(now + 0.15)
}

/**
 * Panel close sound — descending soft tone
 */
export function playPanelCloseSound() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, now)
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.2)
  gain.gain.setValueAtTime(0.08, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.25)
}

/**
 * Terminal keystroke beep for cinematic entry
 */
export function playTerminalBeep() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.value = 440 + Math.random() * 200
  gain.gain.setValueAtTime(0.02, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.04)
}

/**
 * Boot-up sequence sound — a rising sweep with harmonics
 */
export function playBootSound() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  // Rising sweep
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(100, now)
  osc1.frequency.exponentialRampToValueAtTime(500, now + 1.5)
  gain1.gain.setValueAtTime(0.06, now)
  gain1.gain.linearRampToValueAtTime(0.1, now + 0.8)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.0)
  osc1.connect(gain1).connect(ctx.destination)
  osc1.start(now)
  osc1.stop(now + 2.0)

  // Harmonic layer
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(200, now)
  osc2.frequency.exponentialRampToValueAtTime(800, now + 1.5)
  gain2.gain.setValueAtTime(0.03, now)
  gain2.gain.linearRampToValueAtTime(0.05, now + 0.6)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8)
  osc2.connect(gain2).connect(ctx.destination)
  osc2.start(now)
  osc2.stop(now + 1.8)
}

/**
 * Warp jump sound — dramatic sweep + white noise burst
 */
export function playWarpSound() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  // Deep sweep up
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(60, now)
  osc.frequency.exponentialRampToValueAtTime(2000, now + 0.6)
  gain.gain.setValueAtTime(0.08, now)
  gain.gain.linearRampToValueAtTime(0.15, now + 0.3)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0)
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(400, now)
  filter.frequency.exponentialRampToValueAtTime(6000, now + 0.5)
  osc.connect(filter).connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 1.0)

  // White noise burst
  const bufferSize = ctx.sampleRate * 0.8
  const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.15
  }
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = buf
  const noiseGain = ctx.createGain()
  const noiseFilt = ctx.createBiquadFilter()
  noiseFilt.type = 'highpass'
  noiseFilt.frequency.value = 1000
  noiseGain.gain.setValueAtTime(0, now + 0.1)
  noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.3)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
  noiseSrc.connect(noiseFilt).connect(noiseGain).connect(ctx.destination)
  noiseSrc.start(now + 0.1)
  noiseSrc.stop(now + 0.8)
}

/**
 * Ambient space hum — persistent low drone for cinematic page.
 * Returns a stop() function to kill it.
 */
export function startAmbientHum() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0, now)
  masterGain.gain.linearRampToValueAtTime(0.06, now + 2)
  masterGain.connect(ctx.destination)

  // Drone tone 1
  const drone1 = ctx.createOscillator()
  const g1 = ctx.createGain()
  drone1.type = 'sine'
  drone1.frequency.value = 55
  g1.gain.value = 0.5
  drone1.connect(g1).connect(masterGain)
  drone1.start(now)

  // Drone tone 2 — slightly detuned for shimmer
  const drone2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  drone2.type = 'sine'
  drone2.frequency.value = 55.3
  g2.gain.value = 0.4
  drone2.connect(g2).connect(masterGain)
  drone2.start(now)

  // Sub bass
  const sub = ctx.createOscillator()
  const gs = ctx.createGain()
  sub.type = 'sine'
  sub.frequency.value = 27.5
  gs.gain.value = 0.3
  sub.connect(gs).connect(masterGain)
  sub.start(now)

  // High shimmer — very quiet filtered noise
  const bufferSize = ctx.sampleRate * 4
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const noiseData = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    noiseData[i] = (Math.random() * 2 - 1)
  }
  const noiseSrc = ctx.createBufferSource()
  noiseSrc.buffer = noiseBuffer
  noiseSrc.loop = true
  const nFilter = ctx.createBiquadFilter()
  nFilter.type = 'bandpass'
  nFilter.frequency.value = 3000
  nFilter.Q.value = 8
  const ng = ctx.createGain()
  ng.gain.value = 0.02
  noiseSrc.connect(nFilter).connect(ng).connect(masterGain)
  noiseSrc.start(now)

  // Slow LFO modulating drone pitch for organic feel
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.type = 'sine'
  lfo.frequency.value = 0.15
  lfoGain.gain.value = 1.5
  lfo.connect(lfoGain)
  lfoGain.connect(drone1.frequency)
  lfoGain.connect(drone2.frequency)
  lfo.start(now)

  return function stop() {
    const t = ctx.currentTime
    masterGain.gain.linearRampToValueAtTime(0, t + 1)
    setTimeout(() => {
      try { drone1.stop(); drone2.stop(); sub.stop(); noiseSrc.stop(); lfo.stop() } catch (e) {}
    }, 1200)
  }
}

/**
 * Deploy button click sound
 */
export function playDeploySound() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, now)
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.1)
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.25)
  gain.gain.setValueAtTime(0.1, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.3)
}

/**
 * Hover "blip" sound — very subtle
 */
export function playHoverSound() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 1200
  gain.gain.setValueAtTime(0.03, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.06)
}

/**
 * Wormhole open — eerie reverse reverb sweep
 */
export function playWormholeSound() {
  const ctx = getAudioCtx()
  const now = ctx.currentTime

  // Deep descending sweep
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(800, now)
  osc1.frequency.exponentialRampToValueAtTime(80, now + 0.6)
  gain1.gain.setValueAtTime(0.12, now)
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8)
  osc1.connect(gain1).connect(ctx.destination)
  osc1.start(now)
  osc1.stop(now + 0.8)

  // Wobble layer
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(400, now)
  osc2.frequency.exponentialRampToValueAtTime(120, now + 0.5)
  gain2.gain.setValueAtTime(0.06, now + 0.05)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 12
  lfoGain.gain.value = 50
  lfo.connect(lfoGain)
  lfoGain.connect(osc2.frequency)
  lfo.start(now)
  lfo.stop(now + 0.6)
  osc2.connect(gain2).connect(ctx.destination)
  osc2.start(now + 0.05)
  osc2.stop(now + 0.6)
}
