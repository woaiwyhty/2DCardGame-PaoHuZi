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
            for (let i = 1; i <= 20; ++i) {
                  let key = 'x' + i.toString();
                  if (i > 10) {
                        key = 'd' + (i - 10).toString();
                  }
                  let url = `audios/ww/` + `ww_v` + i.toString();
                  cc.resources.load(url, (error, asset) => {
                        if (error) {
                            console.error(error.message);
                        } else {
                            console.log(`nativeUrl: ${asset.nativeUrl}`);
                            this.audioClipsMap.set(key, asset);
                        }
                  });
            }
      },


      playCardOutEffect: function(card) {
            if (this.audioClipsMap.has(card)) {
                  cc.audioEngine.play(this.audioClipsMap.get(card), false, 1);
            }
      },
});
  