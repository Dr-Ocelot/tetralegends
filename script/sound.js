import {loadSoundbank} from './loaders.js';
import settings from './settings.js';
class Sound {
  constructor() {
    this.sounds = [];
    this.music = {};
    this.toPlay = {};
    this.files = [];
    this.mustWait = false;
  }
  updateVolumes() {
    for (const key of Object.keys(this.sounds)) {
      this.sounds[key].volume(settings.settings.sfxVolume / 100);
    }
    for (const key of Object.keys(this.music)) {
      this.music[key].volume(settings.settings.musicVolume / 100);
    }
  }
  load(name = 'standard') {
    this.mustWait = true;
    loadSoundbank(name)
        .then((soundData) => {
          this.files = soundData.files;
          this.ren = soundData.ren;
          for (const soundName of this.files) {
            this.sounds[soundName] = new Howl({
              src: [`./se/game/${name}/${soundName}.ogg`],
              volume: settings.settings.sfxVolume / 100,
            });
          }
          for (const ren of this.ren) {
            this.sounds[`ren${ren}`] = new Howl({
              src: [`./se/game/${name}/ren/ren${ren}.ogg`],
              volume: settings.settings.sfxVolume / 100,
            });
          }
          this.mustWait = false;
        });
  }
  loadBgm(name, type) {
    this.music[`${type}-${name}-start`] = new Howl({
      src: [`./bgm/${type}/${name}-start.ogg`],
      volume: settings.settings.musicVolume / 100,
      onend: () => {
        this.music[`${type}-${name}-loop`].play();
      },
    });
    this.music[`${type}-${name}-loop`] = new Howl({
      src: [`./bgm/${type}/${name}-loop.ogg`],
      volume: settings.settings.musicVolume / 100,
      loop: true,
    });
  }
  playBgm(name, type) {
    this.killBgm();
    this.music[`${type}-${name}-start`].play();
  }
  killBgm() {
    for (const name of Object.keys(this.music)) {
      this.music[name].stop();
    }
  }
  playSeQueue() {
    if (this.mustWait) {
      return;
    }
    for (const name of Object.keys(this.toPlay)) {
      if (this.files.indexOf(name) !== -1) {
        this.sounds[name].play();
      } else if (name === 'initialrotate' && this.files.indexOf('rotate') !== -1) {
        this.sounds['rotate'].play();
      } else if (name === 'initialhold' && this.files.indexOf('hold') !== -1) {
        this.sounds['hold'].play();
      } else if (name === 'prespinmini' && this.files.indexOf('prespin') !== -1) {
        this.sounds['prespin'].play();
      }

      if (name.substr(0, 3) === 'ren') {
        let number = parseInt(name.substr(3, name.length - 3));
        while (this.ren.indexOf(number) === -1) {
          if (number <= 0) {
            break;
          }
          number--;
        }
        if (number > 0) {
          this.sounds[`ren${number}`].play();
        }
      }
    }
    this.toPlay = {};
  }
  add(name) {
    this.toPlay[name] = true;
  }
}
const sound = new Sound();
export default sound;
