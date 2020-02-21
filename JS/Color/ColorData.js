function ColorData(name, color){
	this.name = name;
	this.color = color;
};

ColorData.prototype.getColor = function(){
	return this.color;
}

ColorData.prototype.getName = function(){
	return this.name;
}

ColorData.getColorByName = function(name){
	return ColorData[name];
}

ColorData['colorBlack'] = new ColorData('colorBlack', '#000000');
ColorData['colorRed'] = new ColorData('colorRed', '#ff0000');
ColorData['colorGreen'] = new ColorData('colorGreen', '#00ff00');
ColorData['colorBlue'] = new ColorData('colorBlue', '#0000ff');
ColorData['colorYellow'] = new ColorData('colorYellow', '#ffff00');
ColorData['colorMagenta'] = new ColorData('colorMagenta', '#ff00ff');
ColorData['colorCyan'] = new ColorData('colorCyan', '#00ffff');
ColorData['colorWhite'] = new ColorData('colorWhite','#ffffff');
ColorData['colorGray'] = new ColorData('colorGray','#888888');
ColorData['colorTeal'] = new ColorData('colorTeal','#007378');

ColorData['highlightClear'] = new ColorData('highlightClear', 'white');
ColorData['highlightBlue'] = new ColorData('highlightBlue', '#96E6FA');
ColorData['highlightYellow'] = new ColorData('highlightYellow', '#FFFF0D');
ColorData['highlightGreen'] = new ColorData('highlightGreen', '#5cb85c');
ColorData['highlightOrange'] = new ColorData('highlightOrange', '#FF8C50');
ColorData['highlightPink'] = new ColorData('highlightPink', '#FF96DC');
