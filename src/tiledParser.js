var Map = require('./Map');
var Tileset = require('./Tileset');
var Layer = require('./Layer');
var PIXI = require('pixi.js');
var path = require('path');

module.exports = function (resource, next) {

    // early exit if it is not the right type
    if(!resource.data.layers || !resource.data.tilesets) {
        return next();
    }

    var self = this;

    // tileset image paths are relative so we need the root path
    var root = path.dirname(resource.url);

    var data = resource.data;

    var map = new Map();

    console.log(data, map);

    data.tilesets.forEach(function(tilesetData) {

        var src = path.join(root, tilesetData.image);

        var baseTexture = PIXI.BaseTexture.fromImage(src);

        var tileset = new Tileset(tilesetData, baseTexture);

        // update the textures once the base texture has loaded
        baseTexture.once('loaded', function() {
            tileset.updateTextures();
        });

        map.tilesets.push(tileset);
    });

    // they need to be in order of firstGID
    map.tilesets.sort(function(a, b) {
        return a.firstGID > b.firstGID;
    });

    data.layers.forEach(function(layerData) {

        var layer = new Layer(layerData, map.tilesets);

        map.layers.push(layer);
    });

    next();
};