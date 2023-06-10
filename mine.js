$('.chevron-btn').click(function () {
    var ipAddress = $('#ip-address').val();
    if (ipAddress == '') {
        iziToast.error({
            title: 'Error',
            message: "Required IP address",
            position: 'topRight'
        });
    }
    else {
        fetch(`https://ipapi.co/${ipAddress}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    iziToast.error({
                        title: 'Error',
                        message: data.reason,
                        position: 'topRight'
                    });
                }
                else {
                    // check if map container is initialize!
                    var checkMap = L.DomUtil.get('map');
                    if (checkMap != null) {
                        checkMap._leaflet_id = null;
                    }

                    $('#ip-address').val('');

                    // $('.details').css('display', 'block');
                    $('.details').fadeIn(500);

                    var latitude = data.latitude;
                    var longitude = data.longitude;

                    var myMap = L.map('map').setView([latitude, longitude], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    }).addTo(myMap);

                    $('#ipAddress').html(ipAddress);
                    $('#location').html(data.city + ',' + data.country);
                    $('#timeZone').html('UTC '+ data.utc_offset);

                    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=6592fe9149d942158ca5236e55733359`)
                        .then(response => response.json())
                        .then(data => {
                            var address = data.results[0].formatted;
                            L.marker([latitude, longitude]).addTo(myMap)
                                .bindPopup(address)
                                .openPopup();
                        })
                }
            })
    }

});
$('.details i').click(function () { 
    $('.details').fadeOut(500);
});

