var onRun = function(context) {

	var sketch = require('sketch')
	const UI = require("sketch/ui");
	
	// globals
	
	var exportDir = "";
	var exportStruct = ""; // plain,nested,flat
	var errorMessage = "";
	
	// functions
	
	function browseForDirectory() {
		var title = 'Select a directory for export');
		var openDialog = [NSOpenPanel openPanel];
		[openDialog setCanChooseFiles:false];
		[openDialog setCanChooseDirectories:true];
		[openDialog setAllowsMultipleSelection:false];
		[openDialog setCanCreateDirectories:true];
		[openDialog setTitle:title];
		if( [openDialog runModal] == NSOKButton ) {
			var url = [[openDialog URLs] firstObject];
			exportDir = url.absoluteString();
		} else {
		  errorMessage = 'cancelled on directory';
		}
	}
	
	function promptForExportStruct() {
	  var formats = {
		'parent-sub-layer.xxx' : 'flat',
		'parent/sub/layer.xxx' : 'nested',
		'layer.xxx' : 'plain'
	  }
	  UI.getInputFromUser(
		"Select export structure",
		{
		  type: UI.INPUT_TYPE.selection,
		  possibleValues: Object.keys(formats),
		},
		(err, value) => {
		  if (err) {
			errorMessage = 'cancelled on structure';
		  }
		  exportStruct = formats[value];
		}
	  )
	}
	
	
	function exportLayer(layer,format,parentNames) {
		var suffixedName = (format.prefix || '' )+layer.name+(format.suffix || '')
		var filestruct = parentNames.concat([suffixedName]);
		var filename = '';
		if (exportStruct === 'nested') {
			filename = filestruct.join('/');
		} else if (exportStruct === 'flat') {
			filename = filestruct.join('-');
		} else {
			filename = suffixedName;
		}
		
		// change the name 
		var orgname = layer.name;
		layer.name = filename;
		
		// export
		console.log("exporting",layer.name, format.fileFormat);
		const options = { 
		  output : exportDir, 
		  formats: format.fileFormat
		}
		sketch.export(layer, options);
		
		// restore the name
		layer.name = orgname;
		
	}
	
	function recurseAndExport(layer, parentNames=[]) {
	  var numExported = 0;
	  if (parentNames.length>99) {
		errorMessage = "Cowardly stopping at 100 layers deep.";
		return 0;
	  }
	  if (layer.exportFormats.length) {
		layer.exportFormats.forEach(format => {
		  exportLayer(layer,format,parentNames);
		  numExported++;
		});
	  } 
	  if (layer.layers && layer.layers.length) {
		layer.layers.forEach(function(child) {
		  numExported += recurseAndExport(child,parentNames.concat([layer.name]));
		})
	  }
	
	  return numExported;
	  
	}
	
	// main
	
	var document = sketch.getSelectedDocument()
	var selectedLayers = document.selectedLayers
	
	if (!selectedLayers.length) {
	  UI.message("Please select some layers to recurse and export");
	} else {
	  browseForDirectory();
	  promptForExportStruct();
	  var numExported = 0;
	  if (!errorMessage) {
		selectedLayers.forEach(function (layer, i) {
		  if (errorMessage) return;
		  numExported += recurseAndExport(layer);
		});
	  }
	  if (errorMessage) {
		console.error(errorMessage);
		UI.message(errorMessage);
	  } else {
		UI.message("Exported "+numExported+" files");
	  }
	}

};
          