cc.Class({
      extends: cc.Component,
    
      properties: {

      },
  
      // use this for initialization
      onLoad: function () {
            cc.utils.main.setFitSreenMode();
            var size = cc.view.getFrameSize();
            var w = size.width;
            var h = size.height;
            console.log(w, h);
      },
  });
    