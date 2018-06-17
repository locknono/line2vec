var op = (function () {
    //file
    var system_name = "Wenzhou";
    var root_path = 'data/BS/';
    var res_path = root_path + 'res/';
    var img_root_path = './images/source/'
    var fileList = {
        id_location_file: root_path + 'stationIDLocation.csv',
        pixel_file: root_path + 'pixel.json',
        track_file: root_path + '18Data_track.json',
        original_file: root_path + 'linedetail_label.csv',
        sample_file: root_path + 'linedetail_label.csv'
    };
    var pixel_file = root_path + 'pixel.json';
    var track_file = root_path + '18Data_track.json';
    var originalScatterImg = img_root_path + 'original.png';

    var labelColorScale = d3
        .scaleOrdinal()
        .domain([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
        .range([
            "#fb8072",
            "#80b1d3",
            "#fdb462",
            "#b3de69",
            "#fccde5",
            "#d9d9d9",
            "#bc80bd",
            "#ccebc5",
            "#ffed6f",
            "#8dd3c7",
            "#ffffb3",
            "#CCCCCC"
        ]);
    //style
    var minArtLineWidth = 2,
        maxArtLineWidth = 15,
        circleBarStartColor = "#fff4b3",
        circleBarEndColor = "#F22613",
        scatterColor = 0xd9d9d9;
    return {
        system_name: system_name,
        root_path: root_path,
        fileList: fileList,
        track_file: track_file,
        minArtLineWidth: minArtLineWidth,
        maxArtLineWidth: maxArtLineWidth,
        circleBarStartColor: circleBarStartColor,
        circleBarEndColor: circleBarEndColor,
        scatterColor: scatterColor,
        res_path: res_path,
        pixel_file: pixel_file,
        originalScatterImg: originalScatterImg,
        labelColorScale:labelColorScale,
    }
}())