var op = (function () {
    var root_path = 'data/BS/';
    var track_file = root_path + '18Data_track.json';


    //style
    var minArtLineWidth = 2,
        maxArtLineWidth = 15
    circleBarStartColor = "#fff4b3",
        circleBarEndColor = "#F22613",
        scatterColor = 0xd9d9d9;
    return {
        root_path: root_path,
        track_file: track_file,
        minArtLineWidth: minArtLineWidth,
        maxArtLineWidth: maxArtLineWidth,
        circleBarStartColor: circleBarStartColor,
        circleBarEndColor: circleBarEndColor,
        scatterColor: scatterColor
    }
}())