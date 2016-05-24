var self = require("sdk/self");
//var FileUtils = Cu.import("resource://gre/modules/FileUtils.jsm").FileUtils;
let { Cc, Ci, Cu } = require("chrome");

var LSProcess = {
	initProcess : function(){
		
		LSProcess.process = Cc["@mozilla.org/process/util;1"]
			.createInstance(Ci.nsIProcess);
		
		var FileUtils = Cu.import("resource://gre/modules/FileUtils.jsm").FileUtils;
		LSProcess.file = FileUtils.File("C:\\Windows\\System32\\cmd.exe");
		if(LSProcess.file.exists()){
			LSProcess.process.init(LSProcess.file);
		} else { 
			console.log("NOT FOUND");
			return false;
		}
		return true;
	},
	
	playVideo : function(url) {
		var initSuccessful = LSProcess.initProcess();
		if(!initSuccessful){
			return;
		}
		
		var args = [];
		args[0] = '/k livestreamer ' + url + ' source';
		
		try {
			LSProcess.process.run(false, args, args.length);
		} catch(err) {
			var errorMsg = "Error: " + err.message;
			alert(errorMsg);
		}
	}
}

var contextMenu = require("sdk/context-menu");
var uri = "";
var script = 'self.on("click", function(node, data) {' + 
		'var uri = node.href;' +
		'self.postMessage(uri)});';
var menuItem = contextMenu.Item({
  label: "Start Livestreamer",
  context: contextMenu.SelectorContext("a[href]"),
  contentScript: script,
  onMessage: function (uri) { LSProcess.playVideo(uri); }
}); 

