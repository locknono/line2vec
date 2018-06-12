$(function () {


    $("#flowSlider").slider({
        //range:true,
        min: 1,
        max: 10,
        step: 1,
        value: 1,
        // value:[0,100],
        slide: function (event, ui) {},
        stop: function (event, ui) {}
    });
    $("#flowSliderAmount").val($("#flowSlider").slider("value"));

    $("#sortable").sortable({
        revert: true
    });
    $("#sortable").disableSelection();

    $("#slider2").slider({
        //range:true,
        min: 5,
        max: 60,
        step: 5,
        value: 40,
        // value:[0,100],
        slide: function (event, ui) {
            $("#amount2").val(ui.value);
            sampleRate = ui.value;
        },
        stop: function (event, ui) {}
    });
    $("#amount2").val($("#slider2").slider("value"));

    $("#tabs").tabs();
    $('[data-toggle="tooltip"]').tooltip()

    $("#Chicago").unbind();
    $("#Wenzhou").unbind();

    $("#Chicago").on("click", function () {
        removeBeforeChangeDataSet();
        map.setView([41.89001, -87.700386]);
        map.setZoom(12);
        load(CHIFileList[0], CHIFileList[1], CHIFileList[2]);
        $('#stationNumber').text("Location count:582");
        $('#linesNumberBeforeSample').text(
            "Original Flow Count:38050");
        $('#linesNumberAfterSample').text("Sampled Flow Count:2096");
    });
    $("#Wenzhou").on("click", function () {
        removeBeforeChangeDataSet();
        map.setView([28.0092688, 120.658735]);
        map.setZoom(12);
        load(BSFileList[0], BSFileList[1], BSFileList[2]);
        $('#stationNumber').text("Location count:2970");
        $('#linesNumberBeforeSample').text(
            "Original Flow Count:65952");
        $('#linesNumberAfterSample').text(
            "Sampled Flow Count:10342");
    });
    $('[data-toggle="popover"]').popover()
    $("[name='my-checkbox']").bootstrapSwitch();
});