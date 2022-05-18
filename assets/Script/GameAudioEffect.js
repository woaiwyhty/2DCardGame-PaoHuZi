cc.Class({
      extends: cc.Component,
  
      properties: {
          // foo: {
          //    default: null,      // The default value will be used only when the component attaching
          //                           to a node for the first time
          //    url: cc.Texture2D,  // optional, default is typeof default
          //    serializable: true, // optional, default is true
          //    visible: true,      // optional, default is true
          //    displayName: 'Foo', // optional
          //    readonly: false,    // optional, default is false
          // },
          // ...
      },

      initAudios: function() {
            this.audioClipsMap = new Map();
            cc.resources.loadDir("audios/cd", cc.AudioClip, function (err, assets) {
                  if (err) {
                        console.error(err.message);
                    } else {
                        for (asset of assets) {
                              console.log(`url: ${asset.name}`);
                              if (asset.name[1] === '_') {
                                    this.audioClipsMap.set(asset.name, asset);
                              } else {
                                    let index = parseInt(asset.name.slice(1));
                                    if (index > 10) {
                                          this.audioClipsMap.set(`d${index - 10}`, asset);
                                    } else {
                                          this.audioClipsMap.set(`x${index}`, asset);
                                    }
                              } 
                        }
                    }
            }.bind(this));

            cc.resources.loadDir("audios/effect", cc.AudioClip, function (err, assets) {
                  if (err) {
                        console.error(err.message);
                    } else {
                        for (asset of assets) {
                              this.audioClipsMap.set(asset.name, asset);
                        }
                    }
            }.bind(this));
      },

      playCardOutEffect: function(card) {
            console.log("playCardOutEffect  ", card, this.audioClipsMap);
            if (this.audioClipsMap.has(card)) {
                  cc.audioEngine.play(this.audioClipsMap.get(card), false, 1);
            }
      },

      actionsEffect: function(action) {
            if (this.audioClipsMap.has('v_' + action)) {
                  cc.audioEngine.play(this.audioClipsMap.get('v_' + action), false, 1);
            }
      },

      dealCardWhenGameStartEffect: function() {
            if (this.audioClipsMap.has('runcard')) {
                  let count = 0;
                  let audioId = cc.audioEngine.play(this.audioClipsMap.get('runcard'), false, 1);
                  // let callback = () => {
                  //       if (count > 20) {
                  //             return;
                  //       }
                  //       audioId = cc.audioEngine.play(this.audioClipsMap.get('runcard'), false, 1);
                  //       count += 1;
                  //       cc.audioEngine.setFinishCallback(audioId, callback);
                  // };
                  // cc.audioEngine.setFinishCallback(audioId, callback);
            }
      }
});
  