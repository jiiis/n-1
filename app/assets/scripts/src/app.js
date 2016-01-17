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
        var _gapProperty = 'marginBottom',
            _gapRange = {
                min: 0,
                max: 300
            },
            _$timeline = $('#timeline'),
            _$timelineItem = $('.ch-timeline__item, .ch-timeline__item_inverted');

        _$timeline.on('mousewheel', function(e) {
            var delta = e.deltaY,
                gap = _$timelineItem.cssInt(_gapProperty),
                gapNew = gap + delta;

            if (gapNew < _gapRange.min || gapNew > _gapRange.max) {
                return;
            }

            _$timelineItem.css(_gapProperty, gapNew + 'px');
        });
    });

    /******************** jQuery prototype ********************/
    $.fn.cssInt = function(property) {
        return parseInt(this.css(property), 10) || 0;
    };
})(window, jQuery);
