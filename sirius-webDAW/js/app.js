let loop;
let timer = 0;
const membrane_synth = new Tone.MembraneSynth().toDestination();
const synth = new Tone.Synth().toDestination();
var mySong = new Audio();
mySong.src = '/samples/loops/kv_65_Emin.mp3';


// This currently only works with samples and not instruments with keys
class Instrument {

    // Fields
    name = 'Default';
    user = null;
    pattern = new Array(16);
    
    instrument_name_elem;

    constructor(name, instrument_num) {
        this.name = name;
        this.user = new Tone.Player('./' + name).toDestination();
        const drums = ["Hi-Hat", "Clap", "Kick", "808"];
        var drumsLength = drums.length;

        this.beat_elems = document.querySelectorAll('.track_' + instrument_num + ' .pad');

        // Initialize beat pattern on default instruments
        switch (instrument_num) {
            case 0: this.closed_hiHats(); break;
            case 1: this.claps(); break;
            case 2: this.kicks(); break;
            case 3: this.bass_808(); break;
            default: this.clear();
        }

        // Definitely not a pure function!
        const change_beat_color = (i) => {
            if (this.pattern[i])
                this.beat_elems[i].style.background = 'black';
            else
                this.beat_elems[i].style.background = 'rgba(255, 154, 72)';

            const j = i;
            if(this.pattern[j])
            {
                if ((0<=j && j<4) || (8<=j && j<12)) // gray elements
                    this.beat_elems[j].style.background = '#B2C2CC';
                else // red elements
                    this.beat_elems[j].style.background = '#dedcb1';
            }
            else {
                if ((0<=j && j<4) || (8<=j && j<12)) // gray elements
                    this.beat_elems[j].style.background = '#555A5E';
                else // red elements
                    this.beat_elems[j].style.background = '#666655';
            }


        };

        // Event-listener for drawing beat-pattern
        this.beat_elems.forEach((val, i) => { // NEW UI

            // Set initial beat-pattern graphics
            change_beat_color(i);

            // Change color of beat graphic upon click
            this.beat_elems[i].addEventListener('click', () => { // NEW UI
                this.pattern[i] = !(this.pattern[i]);
                change_beat_color(i);
            });
        });


    }

    // Methods
    change = name => this.user = new Tone.Player('./' + name).toDestination();


    clear() {
        for (let pattern of this.pattern)
            pattern = false;
    }

    print() {
        for (let pattern of this.pattern)
            console.log(pattern);
    }
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

}

// ========================================================

class Tracks {

    constructor() {

        function channel_rack_row_HTML() {
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


        // let num_channel_rack_rows = 0; // Used before prototype loop above
        //Add
        const add_channel_rack_row_button = document.querySelector('#add-row');
        add_channel_rack_row_button.addEventListener('click', () => {

            // const num_rows = this.num_channel_rack_rows;
            const num_rows = 0;
            console.log('num_rows = ', num_rows);

            // Add to classes instruments
            const x = new Instrument('../samples/drums/kv_hh_closed.wav', num_rows);
            // this.instruments.push();

            // Increase number of channel-rack rows (# of instruments)
            ++this.num_channel_rack_rows;


            console.log('Number of rows in channel rack = ', this.num_channel_rack_rows);



            // Apply to actual row in channel-rack:
            const channel_rack_center = document.getElementById('track-center');
            // console.log(channel_rack_center);

            const new_channel_rack_row = document.createElement('div');
            new_channel_rack_row.classList.add('track-row');

            new_channel_rack_row.innerHTML = channel_rack_row_HTML();

            channel_rack_center.appendChild(new_channel_rack_row);

            //Remove
                const remove_channel_rack_row_button = document.querySelector('#remove-row');
                remove_channel_rack_row_button.addEventListener('click', () => {

                    // const num_rows = this.num_channel_rack_rows;
                    const num_rows = 0;
                    console.log('num_rows = ', num_rows);

                    // Add to classes instruments
                    const y = new Instrument('../samples/drums/kv_hh_closed.wav', num_rows);
                    // this.instruments.push();

                    //Decrease
                    --this.num_channel_rack_rows;


                    console.log('Number of rows in channel rack = ', this.num_channel_rack_rows);



                    // Apply to actual row in channel-rack:
                    const channel_rack_center = document.getElementById('track-center');
                    // console.log(channel_rack_center);

                    //const del_channel_rack_row = document.createElement('div');
                    new_channel_rack_row.classList.remove('track-row');

                    new_channel_rack_row.innerHTML = channel_rack_row_HTML();

                    channel_rack_center.removeChild(new_channel_rack_row);

                    
                });

            // TODO: Change original Channel rack to fit the contents dynamically
            //       instead of hard coding its height.
        });

    }

}

class Track {
    instruments = [new Instrument('../samples/drums/kv_hh_closed.wav', 0), 
    new Instrument('../samples/drums/kv_clap.wav', 1), 
    new Instrument('../samples/drums/kv_kick.wav', 2), 
    new Instrument('../samples/bass/kv_808_Emin.mp3', 3)];

}
const track = new Track();
// ========================================================

//create a synth and bass and connect them to the master output (your speakers)
// let bassSynth = new Tone.MembraneSynth().toDestination();
// let synth = new Tone.Synth().toDestination()


//attach a click listener to a play button
document.querySelector('#playButton').addEventListener('click', async () => {
    // -The await expression causes async function execution to pause until
    //  a Promise is settled (that is, fulfilled or rejected), and to resume
    //  execution of the async function after fulfillment.
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

const stop_button = document.getElementById('pauseButton');
stop_button.addEventListener('click', () => {
    loop.stop();
    mySong.pause();
});


function callback(time) {

    const BarsBeatsSixteenths = Tone.Transport.position;
    const Bars_Beats_Sixteenths = BarsBeatsSixteenths.split(':');
    // .position ↝ BarsBeatsSixteenths #
    // The Transport’s position in Bars:Beats:Sixteenths. Setting the value will jump to that position right away.
    //      BarsBeatsSixteenths
    //      A colon-separated representation of time in the form of Bars:Beats:Sixteenths.

    const bar = Number(Bars_Beats_Sixteenths[0]);
    // console.log(`bar: ${bar}`);

    const beat = Number(Bars_Beats_Sixteenths[1]);
    // console.log(`beat: ${beat}`);

    const sixteenth = Math.round(Number(Bars_Beats_Sixteenths[2]));
    // console.log(`sixteenth: ${sixteenth}`);eenth: ${sixteenth}`);

    // const idx = (bar * 4) + (beat);
    const idx = (beat * 4) + sixteenth;

    document.querySelector('#time').innerHTML = 'TIME: ' + (time).toFixed(2);


    // Channel-Rack Metronome:
    const metronomes = document.querySelectorAll('.metronomeBG');
    metronomes[idx].style.background = 'yellow';
    if (idx > 0)
        metronomes[idx-1].style.background = 'black';
    else if (idx === 0 && timer > 0)
        metronomes[15].style.background = 'black';


    // Piano-Roll Metronome:
    const metronomes_pr = document.querySelectorAll('.metronome');
    metronomes_pr[idx].style.background = 'yellow';
    if (idx > 0)
        metronomes_pr[idx-1].style.background = 'black';
    else if (idx === 0 && timer > 0)
        metronomes_pr[15].style.background = 'black';






    timer = (timer + 1);

    const idx_mod = idx % 16;
    // console.log(`channel_rack.instruments[0].pattern[${idx_mod}] = ${channel_rack.instruments[0].pattern[idx_mod]}`);


    if (track.instruments[0].pattern[idx_mod]) {
        track.instruments[0].user.start(time);
        track.instruments[0].user.stop(time + 0.5);
    }
    if (track.instruments[1].pattern[idx_mod]) {
        track.instruments[1].user.start(time);
        track.instruments[1].user.stop(time + 0.5);
    }
    if (track.instruments[2].pattern[idx_mod]) {
        track.instruments[2].user.start(time);
        track.instruments[2].user.stop(time + 0.5);
    }
    if (track.instruments[3].pattern[idx_mod]) {
        track.instruments[3].user.start(time);
        track.instruments[3].user.stop(time + 0.5);
    }
}

// ========================================================

// TODO: Port into Channel Rack class

// ========================================================
let musical = new Tracks();

const increase_bpm = document.querySelector('#increase-bpm');

const bpm_slider = document.querySelector('#bpm-adjust');

bpm_slider.addEventListener('change', () => {
    Tone.Transport.bpm.value = Number(bpm_slider.value);
});