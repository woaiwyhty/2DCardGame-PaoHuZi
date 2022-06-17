
// if (cc.sys.isNative) {
//     window.io = SocketIO;
// } else {
//     window.io = require("Socket-io");
// }
   
if(window.io == null){
    window.io = require("socket-io");
}
  var Global = cc.Class({
      extends: cc.Component,
      statics: {
          ip:"",
          sio:null,
          isPinging:false,
          fnDisconnect:null,
          handlers:{},
          addHandler:function(event,fn){
              if(this.handlers[event]){
                  console.log("event:" + event + "' handler has been registered.");
                  return;
              }
  
              var handler = function(data){
                  //console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
                  if(event != "disconnect" && typeof(data) == "string"){
                      data = JSON.parse(data);
                  }
                  fn(data);
              };
              
              this.handlers[event] = handler; 
              if(this.sio){
                  console.log("register:function " + event);
                  this.sio.on(event,handler);
              }
          },
          connect:function(fnConnect,fnError) {
              var self = this;
              
              var opts = {
                  'reconnection':false,
                  'force new connection': true,
                  'transports':['websocket', 'polling']
              }
              this.sio = window.io.connect(this.ip, opts);
              this.sio.on('reconnect',function(){
                  console.log('reconnection');
              });

              this.sio.on('connect',function(data){
                  self.sio.connected = true;
                  this.startHearbeat();
                  fnConnect(data);
              }.bind(this));
              
              this.sio.on('disconnect',function(data){
                  console.log("disconnect");
                  this.lastRecieveTime = null;
                  self.sio.connected = false;
                  self.close();
              });
              
              this.sio.on('connect_failed',function (){
                  console.log('connect_failed');
              });
              
              for(var key in this.handlers){
                  var value = this.handlers[key];
                  if(typeof(value) == "function"){
                      if(key == 'disconnect'){
                          this.fnDisconnect = value;
                      }
                      else{
                          console.log("register:function " + key);
                          this.sio.on(key,value);                        
                      }
                  }
              }
              
              
          },
          
          startHearbeat:function(){
              this.sio.on('game_pong',function(){
                  console.log('game_pong');
                  self.lastRecieveTime = Date.now();
                  self.delayMS = self.lastRecieveTime - self.lastSendTime;
                  console.log(self.delayMS);
              });
              this.lastRecieveTime = Date.now();
              var self = this;
              console.log(1);
              if(!self.isPinging){
                  self.isPinging = true;
                  cc.game.on(cc.game.EVENT_HIDE,function(){
                      self.ping();
                  });
                  self.pingInterval = setInterval(function(){
                      if(self.sio){
                          self.ping();                
                      }
                  }.bind(this),5000);
                  self.checkInterval = setInterval(function(){
                    console.log("self.lastRecieveTime  ", self.lastRecieveTime)
                      if(self.sio && self.lastRecieveTime !== null){
                          if(Date.now() - self.lastRecieveTime > 10000){
                              console.log("omg... trying to close ws");
                              self.lastRecieveTime = null;
                              self.isPinging = false;
                              self.close();
                              clearInterval(self.checkInterval);
                              clearInterval(self.pingInterval);
                          }         
                      }
                  }.bind(this),500);
              }   
          },
          send:function(event,data){
            console.log("sio send", event, data, this.sio.connected);
              if(this.sio.connected){
                  if(data != null && (typeof(data) == "object")){
                      data = JSON.stringify(data);
                      //console.log(data);              
                  }
                  if(data == null){
                      data = '';
                  }
                //   console.log("data sent out");
                  this.sio.emit(event,data);                
              }
          },
          
          ping:function(){
              if(this.sio){
                  this.lastSendTime = Date.now();
                  this.send('game_ping');
              }
          },
          
          close:function(){
              console.log('close');
              this.delayMS = null;
              if(this.sio && this.sio.connected){
                  this.sio.connected = false;
                  this.sio.disconnect();
              }
              this.sio = null;
              if(this.fnDisconnect){
                  this.fnDisconnect();
                  this.fnDisconnect = null;
              }
          },
          
          test:function(fnResult){
              var fn = function(ret){
                  fnResult(ret.errcode == 0);
              }
              cc.utils.http.sendRequest("/isServerOn", {}, fn);
            }
      },
  });