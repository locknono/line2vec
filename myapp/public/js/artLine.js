function drawArtLine() {
    get3hourData("data/18Data_track.json").then(function (data) {});
    function getInCircleTrack(originalTrack) {
        var allInCircleTrack = [];
        var inCircleTrack = [];
        var queue = new Queue();
        for (var i = 0; i < originalTrack.length; i++) {
            for (var j = 0; j < selectedMapData.length; j++) {
                if (originalTrack[i] == selectedMapData[j].stationID) {
                    queue.enqueue(selectedMapData[j]);
                    break;
                }
            }
            if (j == selectedMapData.length) {
                if (queue.count() < 2) {
                    queue.dequeue();
                } else if (queue.count() >= 2) {
                    while (!queue.empty()) {
                        inCircleTrack.push(queue.dequeue());
                    }
                    allInCircleTrack.push(inCircleTrack);
                    inCircleTrack = [];
                }
            }
        }
        return allInCircleTrack;
    }
}