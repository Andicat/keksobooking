'use strict';

(function () {
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 65;
  var PIN_MAIN_ACTIVE_HEIGHT = 87;
  var PIN_MIN_Y = 130;
  var PIN_MAX_Y = 630;

  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMainX = mapPinMain.getAttribute('offsetLeft');
  var mapPinMainY = mapPinMain.getAttribute('offsetTop');

  var limits = {
    top: PIN_MIN_Y - PIN_MAIN_ACTIVE_HEIGHT,
    right: mapPins.offsetLeft + mapPins.offsetWidth,
    bottom: PIN_MAX_Y,
    left: mapPins.offsetLeft
  };

  // устанавливаем значение поля адреса
  function setPinMainAddress(pinActive) {
    var x = mapPinMain.offsetLeft + PIN_MAIN_WIDTH / 2;
    var y = mapPinMain.offsetTop + (pinActive ? PIN_MAIN_ACTIVE_HEIGHT : PIN_MAIN_HEIGHT / 2);

    window.form.form.address.value = Math.round(x) + ', ' + Math.round(y);
  }

  function activatePinMain() {
    if (window.main.map.classList.contains('map--faded')) {
      window.main.activateMap();
      if (window.filter.dataLoaded) {
        window.filter.disableFilterForm(false);
        window.pins.createPins(window.filter.filterOffers(window.filter.offers));
      }
    }
    setPinMainAddress(true);
  }

  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    function onClickMapPinMain(clEvt) {
      clEvt.preventDefault();
      mapPinMain.removeEventListener('click', onClickMapPinMain);
    }

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      dragged = true;
      // смещение мышки относительно начальных координат
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.top = Math.min(Math.max((mapPinMain.offsetTop - shift.y), limits.top), limits.bottom - PIN_MAIN_ACTIVE_HEIGHT) + 'px';
      mapPinMain.style.left = Math.min(Math.max((mapPinMain.offsetLeft - shift.x), limits.left), limits.right - PIN_MAIN_WIDTH) + 'px';

      setPinMainAddress(true);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        onClickMapPinMain(evt);
        mapPinMain.addEventListener('click', onClickMapPinMain);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    activatePinMain();
  });

  // экспорт
  window.pinMain = {
    mapPinMain: mapPinMain,
    setPinMainAddress: setPinMainAddress,
    activatePinMain: activatePinMain,
    mapPinMainX: mapPinMainX,
    mapPinMainY: mapPinMainY
  };
})();
