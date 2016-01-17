'use strict';

(function(window, $) {
    $(function() {
        /******************** private variables ********************/
        // common
        var _$window = $(window),
            _$timelineContainer = $('#timeline-container'),
            _$timeline = $('#timeline'),
            _$timelineItem = $('.ch-timeline__item, .ch-timeline__item_inverted');

        // for timeline drag
        var _isCursorDown = false,
            _cursorPosition = 0;

        // for timeline zoom
        var _gapProperty = 'marginBottom',
            _gapRange = {
                min: 0,
                max: 300
            };

        /******************** timeline | drag ********************/
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

            // the delta to the timeline height
            var delta = e.pageY - _cursorPosition;

            // properly place the timeline
            _adjustTimelinePosition(delta);

            // upgrade the global cursor position
            _cursorPosition = e.pageY;
        });

        /******************** timeline | zoom ********************/
        _$timeline.on('mousewheel', function(e) {
            var delta = e.deltaY,
                gap = _$timelineItem.cssInt(_gapProperty),
                gapNew = gap + delta;

            // zoom within the range
            if (gapNew < _gapRange.min || gapNew > _gapRange.max) {
                return;
            }

            // zoom
            _$timelineItem.css(_gapProperty, gapNew + 'px');

            // ensure the timeline doesn't go beyond its container when the height changes
            _adjustTimelinePosition();
        });

        /******************** private functions ********************/
        /**
         * Adjusts the timeline position.
         *
         * During dragging or zooming the timeline, there is a chance for
         * the timeline to be placed outside of its container leaving a blank space.
         *
         * This function ensures the timeline is placed properly.
         *
         * @param delta The delta to the timeline height
         */
        function _adjustTimelinePosition(delta) {
            delta = delta || 0;

            var containerHeight = _$timelineContainer.outerHeight(),
                containerPositionTop = _$timelineContainer.offset().top,
                containerPositionBottom = containerPositionTop + containerHeight,
                timelineHeight = _$timeline.outerHeight(),
                timelinePositionTop = _$timeline.offset().top,
                timelinePositionBottom = timelinePositionTop + timelineHeight,
                timelinePositionTopNew = timelinePositionTop + delta,
                timelinePositionBottomNew = timelinePositionBottom + delta;

            // ensure the timeline doesn't go beyond its container when the height changes
            if (timelinePositionTopNew > containerPositionTop) {
                timelinePositionTopNew = containerPositionTop;
            } else if (timelinePositionBottomNew < containerPositionBottom) {
                timelinePositionTopNew = containerPositionBottom - timelineHeight;
            }

            // move the timeline vertically
            _$timeline.offset({
                top: timelinePositionTopNew
            });
        }
    });

    /******************** jQuery prototype ********************/
    $.fn.cssInt = function(property) {
        return parseInt(this.css(property), 10) || 0;
    };
})(window, jQuery);
