// Original synthesized soundtrack and sound effects.
const GameAudio = {
    context: null,
    masterGain: null,
    musicGain: null,
    effectsGain: null,
    musicEnabled: true,
    effectsEnabled: true,
    unlocked: false,
    musicTimer: null,
    barIndex: 0,
    bpm: 82,
    progression: [
        [110, 138.59, 164.81],
        [87.31, 110, 130.81],
        [98, 123.47, 146.83],
        [73.42, 110, 146.83]
    ],
    melody: [
        [440, null, 392, 329.63, null, 392, 493.88, null],
        [392, null, 329.63, 293.66, null, 329.63, 392, null],
        [369.99, null, 329.63, 293.66, 246.94, null, 293.66, null],
        [329.63, null, 293.66, 246.94, null, 293.66, 329.63, null]
    ],

    unlock() {
        if (this.unlocked) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            console.error('Web Audio is unavailable; music and sound effects are disabled.');
            this.musicEnabled = false;
            this.effectsEnabled = false;
            this.unlocked = true;
            return;
        }

        this.context = new AudioContextClass();
        this.masterGain = this.context.createGain();
        this.musicGain = this.context.createGain();
        this.effectsGain = this.context.createGain();
        this.masterGain.gain.value = 0.55;
        this.musicGain.gain.value = 0.32;
        this.effectsGain.gain.value = 0.65;
        this.musicGain.connect(this.masterGain);
        this.effectsGain.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);
        this.unlocked = true;
        this.context.resume().then(() => {
            if (this.musicEnabled) this.startMusic();
        }).catch(error => {
            console.error('Unable to start game audio:', error);
        });
    },

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!this.unlocked) return;
        if (enabled) {
            this.context.resume().then(() => this.startMusic()).catch(error => {
                console.error('Unable to resume game music:', error);
            });
            this.musicGain.gain.setTargetAtTime(0.32, this.context.currentTime, 0.15);
        } else {
            this.stopMusic();
            this.musicGain.gain.setTargetAtTime(0, this.context.currentTime, 0.15);
        }
    },

    setEffectsEnabled(enabled) {
        this.effectsEnabled = enabled;
        if (this.unlocked) {
            this.effectsGain.gain.setTargetAtTime(
                enabled ? 0.65 : 0,
                this.context.currentTime,
                0.05
            );
        }
    },

    startMusic() {
        if (!this.unlocked || !this.musicEnabled || this.musicTimer !== null) return;
        this.musicGain.gain.setTargetAtTime(0.32, this.context.currentTime, 0.15);
        this.playMusicBar();
    },

    stopMusic() {
        if (this.musicTimer !== null) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
    },

    playMusicBar() {
        if (!this.musicEnabled || !this.context) {
            this.musicTimer = null;
            return;
        }

        const beat = 60 / this.bpm;
        const barDuration = beat * 4;
        const start = this.context.currentTime + 0.08;
        const chordIndex = this.barIndex % this.progression.length;
        const chord = this.progression[chordIndex];

        chord.forEach((frequency, index) => {
            this.playTone(frequency, start, barDuration * 0.92, 'triangle', 0.075 / (index + 1), this.musicGain);
        });
        this.playTone(chord[0] / 2, start, barDuration * 0.9, 'sine', 0.12, this.musicGain);

        for (let step = 0; step < 8; step++) {
            const time = start + step * beat / 2;
            const arpNote = chord[(step + this.barIndex) % chord.length] * (step % 4 === 3 ? 2 : 1);
            this.playTone(arpNote, time, beat * 0.38, 'triangle', 0.12, this.musicGain);

            const melodyNote = this.melody[chordIndex][step];
            if (melodyNote) {
                this.playTone(melodyNote, time, beat * 0.62, 'sine', 0.105, this.musicGain);
            }
        }

        this.barIndex++;
        this.musicTimer = setTimeout(() => {
            this.musicTimer = null;
            this.playMusicBar();
        }, barDuration * 1000);
    },

    playTone(frequency, start, duration, waveform, volume, output) {
        const oscillator = this.context.createOscillator();
        const envelope = this.context.createGain();
        oscillator.type = waveform;
        oscillator.frequency.setValueAtTime(frequency, start);
        envelope.gain.setValueAtTime(0.0001, start);
        envelope.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), start + 0.04);
        envelope.gain.setValueAtTime(Math.max(volume, 0.0002), start + Math.max(0.05, duration * 0.65));
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(envelope);
        envelope.connect(output);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.03);
    },

    playEffect(notes, waveform = 'square', duration = 0.09) {
        if (!this.unlocked || !this.effectsEnabled || this.context.state !== 'running') return;
        const start = this.context.currentTime + 0.005;
        notes.forEach(([frequency, offset, length = duration]) => {
            this.playTone(frequency, start + offset, length, waveform, 0.2, this.effectsGain);
        });
    },

    move() {
        this.playEffect([[330, 0], [440, 0.045, 0.07]], 'triangle', 0.07);
    },

    blocked() {
        this.playEffect([[150, 0, 0.11]], 'square', 0.11);
    },

    pickup() {
        this.playEffect([[523.25, 0], [659.25, 0.08], [783.99, 0.16]], 'sine', 0.12);
    },

    attack() {
        this.playEffect([[180, 0, 0.08], [115, 0.07, 0.1]], 'sawtooth', 0.1);
    },

    hit() {
        this.playEffect([[110, 0, 0.12], [82.41, 0.035, 0.1]], 'square', 0.1);
    },

    cast() {
        this.playEffect([[392, 0], [523.25, 0.07], [783.99, 0.14], [1046.5, 0.22, 0.17]], 'sine', 0.15);
    },

    heal() {
        this.playEffect([[523.25, 0], [659.25, 0.1], [783.99, 0.2], [1046.5, 0.3, 0.2]], 'sine', 0.16);
    },

    victory() {
        this.playEffect([[523.25, 0], [659.25, 0.11], [783.99, 0.22], [1046.5, 0.33, 0.24]], 'triangle', 0.18);
    }
};
