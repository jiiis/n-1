'use strict';

(function(window, $) {
    /******************** timeline | drag ********************/
    $(function() {
        var _isCursorDown = false,
            _cursorPosition = 0,
            _$window = $(window),
            _$timelineContainer = $('#timeline-container'),
            _$timeline = $('#timeline');

        _$timeline.on('mousedown', function(e) {
            // primary button only
            if (e.which !== 1) {
                return;
            }

            _isCursorDown = true;
            _cursorPosition = e.pageY;
        });

        _$window.on('mouseup', function() {
            _isCursorDown = false;
        }).on('mousemove', function(e) {
            if (!_isCursorDown) {
                return;
            }

            var cursorPositionNew = e.pageY,
                cursorPositionDifference = cursorPositionNew - _cursorPosition,
                containerHeight = _$timelineContainer.outerHeight(),
                containerPositionTop = _$timelineContainer.offset().top,
                containerPositionBottom = containerPositionTop + containerHeight,
                timelineHeight = _$timeline.outerHeight(),
                timelinePositionTop = _$timeline.offset().top,
                timelinePositionBottom = timelinePositionTop + timelineHeight,
                timelinePositionTopNew = timelinePositionTop + cursorPositionDifference,
                timelinePositionBottomNew = timelinePositionBottom + cursorPositionDifference;

            // beyond the borders
            if (timelinePositionTopNew > containerPositionTop) {
                timelinePositionTopNew = containerPositionTop;
            } else if (timelinePositionBottomNew < containerPositionBottom) {
                timelinePositionTopNew = containerPositionBottom - timelineHeight;
            }

            // drag to position
            _$timeline.offset({
                top: timelinePositionTopNew
            });
            _cursorPosition = e.pageY;
        });
    });

    /******************** timeline | zoom ********************/
    $(function() {
        var _$timeline = $('#timeline');

        _$timeline.on('mousewheel', function(e) {
            console.log(e.deltaX);
        });
    });
})(window, jQuery);
