'use strict';

(function(window, $) {
    $(function() {
        /******************** private variables ********************/
        // common
        var _$window = $(window),
            _$timelineContainer = $('#timeline-container'),
            _$timeline = $('#timeline');

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
            var _$timelineItem = $('.ch-timeline__item, .ch-timeline__item_inverted'),
                delta = e.deltaY,
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

/******************** angular ********************/
(function(window, angular, $) {
    /******************** modules ********************/
    var app = angular.module('app', [
        'ngResource'
    ]);

    /******************** controllers ********************/
    app.controller('TimelineController', ['$scope', 'Timeline', function($scope, Timeline) {
        /******************** private variables ********************/
        var dates = {};

        /******************** model ********************/
        $scope.dates = [];

        $scope.isDateActive = function(date) {
            var dateIndex = date.dateIndex,
                now = new Date(),
                dateIndexNow = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');

            return dateIndex >= dateIndexNow;
        };

        $scope.isTitleRowShown = function(item) {
            return item.image === undefined;
        };

        $scope.isImageRowShown = function(item) {
            return item.image !== undefined;
        };

        // Todo: this function is not completely correct
        $scope.getDateTitle = function(date) {
            var dateInt = parseInt(date.dateString),
                now = new Date(),
                dateIntNow = parseInt([now.getFullYear(), now.getMonth() + 1, now.getDate()].join(''));

            return dateIntNow === dateInt ? 'Today'
                : (dateIntNow === dateInt + 1 ? 'Yesterday'
                : (dateIntNow === dateInt - 1 ? 'Tomorrow' : date.dateIndex));
        };

        /******************** event handlers ********************/
        Timeline.query(function(items) {
            angular.forEach(items, function(item) {
                var itemDate = item.date,
                    dateLocale = 'en-us',
                    dateIndex = [itemDate.year, itemDate.month, itemDate.day].join('-'),
                    dateString = [itemDate.year, itemDate.month, itemDate.day].join(''),
                    date = new Date(itemDate.year, itemDate.month - 1, itemDate.day, itemDate.hours, itemDate.minutes, itemDate.seconds || 0, itemDate.milliseconds || 0);

                item.date.timestamp = date.getTime();
                item.date.dayName = getDayName(date.getDay());
                item.date.monthName = date.toLocaleString(dateLocale, {
                    month: 'long'
                });

                if (dateIndex in dates) {
                    dates[dateIndex].items.push(item);
                } else {
                    dates[dateIndex] = {
                        dateIndex: dateIndex,
                        dateString: dateString,
                        items: [item]
                    };
                }
            });

            angular.forEach(dates, function(date) {
                $scope.dates.push(date);
            });
        });
    }]);

    /******************** services ********************/
    app.factory('Timeline', ['$resource', '$q', function($resource) {
        return $resource('model/timeline.json');
    }]);

    /******************** private functions ********************/
    function getDayName(dayNumber) {
        var dayMap = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        };

        return dayMap[dayNumber];
    }
})(window, angular, jQuery);
