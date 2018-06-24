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

    var sample_rate = 40;
    var sample_method = "";
    var folderName = res_path + 'BSlinedetail_label' + sample_rate.toString() + "_seq";

    function changeSampleRate(rate) {
        this.sample_rate = rate;
    }

    function getSampleFile() {
        this.folderName = this.res_path + 'BSlinedetail_label' + this.sample_rate.toString() + "_seq";
        this.sample_method = "";
        if ($("#checkOverlap").is(":checked")) {
            this.sample_method += "0";
        }
        if ($("#checkBtw").is(":checked")) {
            this.sample_method += "1";
        }
        if ($("#checkComm").is(":checked")) {
            this.sample_method += "2";
        }
        this.folderName += this.sample_method;
        return this.folderName + "/0.csv";
    }

    //style
    var labelColorScale = d3
        .scaleOrdinal()
        .domain([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
        .range([
            "#A6A6A6", //-1
            "#80b1d3", //0
            "#fdb462",
            "#b3de69",
            "#fccde5",
            "#d9d9d9",
            "#bc80bd", //5
            "#ccebc5",
            "#ffed6f",
            "#8dd3c7",
            "#ffffb3",
            "#FFFF00", //10
            "#CCCCCC",
            "#E8CB0C",
            "#FC6AE5",
            "#47781C",
            "#6F7F6B", //15
            "#FDA318", //16
            "#fb8072", //17
        ]);

    var minArtLineWidth = 1,
        maxArtLineWidth = 15;
    return {
        system_name: system_name,
        root_path: root_path,
        fileList: fileList,
        track_file: track_file,
        minArtLineWidth: minArtLineWidth,
        maxArtLineWidth: maxArtLineWidth,
        circleBarStartColor: "#fff4b3",
        circleBarEndColor: "#F22613",
        scatterColor: 0xC2C2C2,
        res_path: res_path,
        pixel_file: pixel_file,
        originalScatterImg: originalScatterImg,
        labelColorScale: labelColorScale,
        sample_rate: sample_rate,
        changeSampleRate: changeSampleRate,
        getSampleFile: getSampleFile,
        sample_method: sample_method,
        folderName: folderName,
        img_root_path: img_root_path,
        originalLineColor: 0xa0a0a0,
        lineOpacity: 0.8,
        drawZoom: -1,
        timeArcColor: "#557BF0",
        timeArcOpacity: 0.5,
        selectedTimeArcOpacity: 1,
        oColor: "#0D9DFF",
        ourColor: '#E8E60C',
    }
}())