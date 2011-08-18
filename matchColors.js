var colorTable = new Array();
function createColorTable() {
	for (var i = 0; i < colors.length; i++) {
		var name = colors[i][0];
		var rgb = colors[i][1];
		var rgba = decomposeRgb(rgb);
		var hsv = rgb2hsv(rgb);
		colorTable.push([name, rgb, rgba, hsv]);
	}
}
function hex2dec(hex) {
	return parseInt(hex, 16);
}
function dec2hex(dec) {
	return parseInt(dec, 10);
}
function decomposeRgb(rgb) {
	var r = rgb.substring(0, 2);
	var g = rgb.substring(2, 4);
	var b = rgb.substring(4, 6);
	return [hex2dec(r), hex2dec(g), hex2dec(b), "0:"];
}
function order(lhd, rhd) {
	return lhd - rhd;
}
function sort(rgb) {
	var calculate = [rgb[0], rgb[1], rgb[2]];
	calculate.sort(order);
	return calculate;
}
function maxValue(rgb) {
	return sort(rgb)[2];
}
function minValue(rgb) {
	return sort(rgb)[0];
}
function rgb2hsv(rgb) {
	var rgba = decomposeRgb(rgb);
	var max = maxValue(rgba);
	var min = minValue(rgba);
	if (max == 0) {
		return [0, 0, 0];
	}
	var s = 255 * ((max - min) / max);
	var h;
	if (max == rgba[0]) {
		h = 60 * ((rgba[2] - rgba[1]) / (max - min));
	}
	if (max == rgba[1]) {
		h = 60 * (2 + ((rgba[0] - rgba[2]) / (max - min)));
	}
	if (max == rgba[2]) {
		h = 60 * (4 + ((rgba[1] - rgba[0]) / (max - min)));
	}
	if (h < 0) {
		h += 360;
	}
	return [Math.round(h), Math.round(s), Math.round(max)];
}
function hsv2rgb(hsv) {
}
function findHsv(rgb) {
	for (var i = 0; i < colorTable.length; i++) {
		if (colorTable[i][1] == rgb) {
			return colorTable[i][3];
		}
	}
	return null;
}
function findNearColorByH(h, s, v) {
	var found = null;
	for(var diff = 1; diff < 5; diff++) {
		for (i = 0; i< colorTable.length; i++) {
			if ((((h - (diff * 3)) < colorTable[i][3][0]) && (colorTable[i][3][0] < (h + (diff * 3))))
				&& (((s - (diff * 8)) < colorTable[i][3][1]) && (colorTable[i][3][1] < (s + (diff * 8))))
				&& (((v - (diff * 8)) < colorTable[i][3][2]) && (colorTable[i][3][2] < (v + (diff * 8))))
				) {
				return colorTable[i];
			}
		}
	}
	return found;
}
function findNearColorByS(h, s, v) {
	var found = null;
	for(var diff = 1; diff < 5; diff++) {
		for (i = 0; i< colorTable.length; i++) {
			if ((((h - (diff * 10)) < colorTable[i][3][0]) && (colorTable[i][3][0] < (h + (diff * 10))))
				&& (((s - (diff * 2)) < colorTable[i][3][1]) && (colorTable[i][3][1] < (s + (diff * 2))))
				&& (((v - (diff * 8)) < colorTable[i][3][2]) && (colorTable[i][3][2] < (v + (diff * 8))))
				) {
				return colorTable[i];
			}
		}
	}
	return found;
}
function findNearColorByV(h, s, v) {
	var found = null;
	for(var diff = 1; diff < 5; diff++) {
		for (i = 0; i< colorTable.length; i++) {
			if ((((h - (diff * 10)) < colorTable[i][3][0]) && (colorTable[i][3][0] < (h + (diff * 10))))
				&& (((s - (diff * 8)) < colorTable[i][3][1]) && (colorTable[i][3][1] < (s + (diff * 8))))
				&& (((v - (diff * 2)) < colorTable[i][3][2]) && (colorTable[i][3][2] < (v + (diff * 2))))
				) {
				return colorTable[i];
			}
		}
	}
	return found;
}
function findNearColor(h, s, v, hsv) {
	for (var i = 0; i< colorTable.length; i++) {
		if (colorTable[i][3][0] == h && colorTable[i][3][1] == s && colorTable[i][3][2] == v) {
			return colorTable[i];
		}
	}
	var found = null;
	switch (hsv) {
		case 0:
			found = findNearColorByH(h, s, v);
			break;
		case 1:
			found = findNearColorByS(h, s, v);
			break;
		case 2:
			found = findNearColorByV(h, s, v);
			break;
	}
	if (!found) {
		for(var diff = 1; diff < 5; diff++) {
			for (i = 0; i< colorTable.length; i++) {
				if ((((h - (diff * 10)) < colorTable[i][3][0]) && (colorTable[i][3][0] < (h + (diff * 10))))
					&& (((s - (diff * 8)) < colorTable[i][3][1]) && (colorTable[i][3][1] < (s + (diff * 8))))
					&& (((v - (diff * 8)) < colorTable[i][3][2]) && (colorTable[i][3][2] < (v + (diff * 8))))
					) {
					found = colorTable[i];
					break;
				}
			}
			if (found) {
				break;
			}
		}
	}
	// TODO hsvをそのままrgbに変換して返す？
	return found;
}
function calculateNearColor(rgb) {
	var hsv = findHsv(rgb);
	if (hsv == null) {
		return null;
	}
	var hsvs = new Array();
	var hs = new Array();
	hs.push([
		Math.round(hsv[0] / 4),
		hsv[1],
		hsv[2]
		,"0:"
	]);
	hs.push([
		Math.round(hsv[0] / 4) * 2,
		hsv[1],
		hsv[2]
		,"0:"
	]);
	hs.push([
		Math.round(hsv[0] / 4 * 3),
		hsv[1],
		hsv[2]
		,"0:"
	]);
	hs.push([
		hsv[0],
		hsv[1],
		hsv[2]
		,"0:"
	]);
	hs.push([
		hsv[0] + (Math.round((360 - hsv[0])) / 4),
		hsv[1],
		hsv[2]
		,"0:"
	]);
	hs.push([
		hsv[0] + (Math.round((360 - hsv[0])) / 4) * 2,
		hsv[1],
		hsv[2]
		,"0:"
	]);
	hs.push([
		hsv[0] + (Math.round((360 - hsv[0])) / 4) * 3,
		hsv[1],
		hsv[2]
		,"0:"
	]);
	hsvs.push(hs);
	var ss = new Array();
	ss.push([
		hsv[0] ,
		Math.round(hsv[1] / 4),
		hsv[2]
		,"0:"
	]);
	ss.push([
		hsv[0] ,
		Math.round(hsv[1] / 4) * 2,
		hsv[2]
		,"0:"
	]);
	ss.push([
		hsv[0] ,
		Math.round(hsv[1] / 4 * 3),
		hsv[2]
		,"0:"
	]);
	ss.push([
		hsv[0] ,
		hsv[1],
		hsv[2]
		,"0:"
	]);
	ss.push([
		hsv[0] ,
		hsv[1] + (Math.round((256 - hsv[1])) / 4),
		hsv[2]
		,"0:"
	]);
	ss.push([
		hsv[0] ,
		hsv[1] + (Math.round((256 - hsv[1])) / 4) * 2,
		hsv[2]
		,"0:"
	]);
	ss.push([
		hsv[0] ,
		hsv[1] + (Math.round((256 - hsv[1])) / 4) * 3,
		hsv[2]
		,"0:"
	]);
	hsvs.push(ss);
	var vs = new Array();
	vs.push([
		hsv[0] ,
		hsv[1],
		hsv[2] + (Math.round((256 - hsv[2])) / 4) * 3
		,"0:"
	]);
	vs.push([
		hsv[0] ,
		hsv[1],
		hsv[2] + (Math.round((256 - hsv[2])) / 4) * 2
		,"0:"
	]);
	vs.push([
		hsv[0] ,
		hsv[1],
		hsv[2] + (Math.round((256 - hsv[2])) / 4)
		,"0:"
	]);
	vs.push([
		hsv[0] ,
		hsv[1],
		hsv[2]
		,"0:"
	]);
	vs.push([
		hsv[0] ,
		hsv[1],
		Math.round(hsv[2] / 4) * 3
		,"0:"
	]);
	vs.push([
		hsv[0] ,
		hsv[1],
		Math.round(hsv[2] / 4) * 2
		,"0:"
	]);
	vs.push([
		hsv[0] ,
		hsv[1],
		Math.round(hsv[2] / 4)
		,"0:"
	]);
	hsvs.push(vs);
	var foundColors = new Array();
	for (var i = 0; i < 3; i++) {
		var foundHsvs = new Array();
		for (var j = 0; j < 7; j++) {
			foundHsvs.push(findNearColor(
				hsvs[i][j][0],
				hsvs[i][j][1],
				hsvs[i][j][2],
				i));
		}
		foundColors.push(foundHsvs);
	}
	return foundColors;
}
