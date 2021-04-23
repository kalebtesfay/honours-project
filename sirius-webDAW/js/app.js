/*
    App.js
*/
let loop;
let count = 0;

// Melody
var mySong = new Audio();
mySong.src = '/samples/loops/kv_65_Emin.mp3';



class Instrument {
    name = 'New Project';
    user = null;
    pattern = new Array(16);
    


    constructor(name, num) {
        this.name = name;
        this.user = new Tone.Player('./' + name).toDestination();
        const drums = ["Hi-Hat", "Clap", "Kick", "808"];
        var drumsLength = drums.length;

        this.drumPad = document.querySelectorAll('.track_' + num + ' .pad');

        // Initialize beat pattern on default drums
        switch (num) {
            case 0: this.closed_hiHats(); break;
            case 1: this.claps(); break;
            case 2: this.kicks(); break;
            case 3: this.bass_808(); break;
            default: this.clear();
        }

        const switchColour = (i) => {
            if (this.pattern[i])
                this.drumPad[i].style.background = 'black';
            else
                this.drumPad[i].style.background = 'rgba(255, 154, 72)';

            const j = i;
            if(this.pattern[j])
            {
                if ((0<=j && j<=3) || (8<=j && j<=11))
                    this.drumPad[j].style.background = '#B2C2CC';
                else 
                    this.drumPad[j].style.background = '#dedcb1';
            }
            else {
                if ((0<=j && j<=3) || (8<=j && j<=11))
                    this.drumPad[j].style.background = '#555A5E';
                else 
                    this.drumPad[j].style.background = '#666655';
            }


        };

        this.drumPad.forEach((k, i) => { 
            switchColour(i);

            // Colour change when clicked
            this.drumPad[i].addEventListener('click', () => { 
                this.pattern[i] = !(this.pattern[i]);
                switchColour(i);
            });
        });


    }

    change = name => this.user = new Tone.Player('./' + name).toDestination();


    closed_hiHats() {
        for (let i = 0; i < this.pattern.length; ++i)
            this.pattern[i] = true;
    }

    claps() {
        this.pattern[4] = true;
        this.pattern[12] = true;
    }

    kicks() {
        this.pattern[0] = true;
        this.pattern[9] = true;
        this.pattern[15] = true;
    }

    bass_808(){
        this.pattern[0] = true;
        this.pattern[3] = true;
        this.pattern[6] = true;
        this.pattern[13] = true;
        this.pattern[15] = true;

    }

    clear() {
        for (let pattern of this.pattern)
            pattern = false;
    }

    print() {
        for (let pattern of this.pattern)
            console.log(pattern);
    }

}

class Tracks {
    constructor() {
        function trackRowHTML() {
            return `
            <div class="track-row">
                <div class="track-column">
                    <span class="box"></span>
                     <input class="trackName">
                    </div>
                     <div class="track_0">
                        <span class="pad pad-b"></span>
                        <span class="pad pad-b"></span>
                        <span class="pad pad-b"></span>
                        <span class="pad pad-b"></span>
                        <span class="pad pad-y"></span>
                        <span class="pad pad-y"></span>
                        <span class="pad pad-y"></span>
                        <span class="pad pad-y"></span>
                        <span class="pad pad-b"></span>
                        <span class="pad pad-b"></span>
                        <span class="pad pad-b"></span>
                        <span class="pad pad-b"></span>                        
                        <span class="pad pad-y"></span>
                        <span class="pad pad-y"></span>
                        <span class="pad pad-y"></span>
                        <span class="pad pad-y"></span>
                </div> 
            </div>
                `;
            
        }

        //Add
        const addTrackSelection = document.querySelector('#add-row');
        addTrackSelection.addEventListener('click', () => {
            const trackCent = document.getElementById('track-center');
            const newTrack = document.createElement('div');

            newTrack.classList.add('track-row');
            newTrack.innerHTML = trackRowHTML();
            trackCent.appendChild(newTrack);

            //Remove
            const deleteTrackSelection = document.querySelector('#remove-row');
            deleteTrackSelection.addEventListener('click', () => {
                    const trackCent = document.getElementById('track-center');

                    newTrack.classList.remove('track-row');
                    newTrack.innerHTML = trackRowHTML();
                    trackCent.removeChild(newTrack);

                    
                });
        });

    }

}
/*
    The track's drums
*/
class Track {
    drum = [new Instrument('../samples/drums/kv_hh_closed.wav', 0), 
    new Instrument('../samples/drums/kv_clap.wav', 1), 
    new Instrument('../samples/drums/kv_kick.wav', 2), 
    new Instrument('../samples/bass/kv_808_Emin.mp3', 3)];

}
const track = new Track();

/*
    Play Button functionality
*/
document.querySelector('#playButton').addEventListener('click', async () => {
    await Tone.start();
    if(typeof mySong.loop == 'boolean'){
        mySong.loop = true;
    }else
    {
        mySong.addEventListener('ended', function(){
            this.currentTime = 0;
            this.play();
        }, false);
    }
    mySong.play();

    console.log('playing audio is enabled');


    const interval = '16n';
    loop = new Tone.Loop(callback, interval).start(0);

    const bpm_val = document.querySelector('#bpm-adjust').value;
    Tone.Transport.bpm.value = Number(bpm_val);

    Tone.Transport.start();
    mySong.play();
})

/*
    Pause Button functionality
*/
const stop_button = document.getElementById('pauseButton');
stop_button.addEventListener('click', () => {
    loop.stop();
    mySong.pause();
});

/*
    callback function
*/
function callback(time) {

    //sixteenth notes
    const sixteenths = Tone.Transport.position;
    const beat_Sixteenths = sixteenths.split(':');

    const beat = Number(beat_Sixteenths[1]);
    const sixteenth = Math.round(Number(beat_Sixteenths[2]));
    const index = (beat * 4) + sixteenth;

    document.querySelector('#time').innerHTML = 'TIME: ' + (time).toFixed(2);


    // Track mini Metronome:
    const metronomes = document.querySelectorAll('.metronomeBG');
    metronomes[index].style.background = 'yellow';
    if (index > 0)
        metronomes[index-1].style.background = 'black';
    else if (index === 0 && count > 0)
        metronomes[15].style.background = 'black';


    //Main metronome
    const metro = document.querySelectorAll('.metronome');
    metro[index].style.background = 'yellow';
    if (index > 0)
        metro[index-1].style.background = 'black';
    else if (index === 0 && count > 0)
        metro[15].style.background = 'black';

    count = (count + 1);

    const indexMod = index % 16;

    if (track.drum[0].pattern[indexMod]) {
        track.drum[0].user.start(time);
        track.drum[0].user.stop(time + 0.5);
    }
    if (track.drum[1].pattern[indexMod]) {
        track.drum[1].user.start(time);
        track.drum[1].user.stop(time + 0.5);
    }
    if (track.drum[2].pattern[indexMod]) {
        track.drum[2].user.start(time);
        track.drum[2].user.stop(time + 0.5);
    }
    if (track.drum[3].pattern[indexMod]) {
        track.drum[3].user.start(time);
        track.drum[3].user.stop(time + 0.5);
    }
}

let musical = new Tracks();

const adjustBPM = document.querySelector('#bpm-adjust');

adjustBPM.addEventListener('change', () => {
    Tone.Transport.bpm.value = Number(adjustBPM.value);
});