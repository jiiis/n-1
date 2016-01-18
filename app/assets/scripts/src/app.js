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
        var _dates = {},
            _$taskForm = $('#task-form');

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

        $scope.isSubmitButtonDisabled = function() {
            return !$scope.taskForm.$valid;
        };

        // todo: this function is not completely correct
        $scope.getDateTitle = function(date) {
            var dateInt = parseInt(date.dateString),
                now = new Date(),
                dateIntNow = parseInt([now.getFullYear(), now.getMonth() + 1, now.getDate()].join(''));

            return dateIntNow === dateInt ? 'Today'
                : (dateIntNow === dateInt + 1 ? 'Yesterday'
                : (dateIntNow === dateInt - 1 ? 'Tomorrow' : date.dateIndex));
        };

        // todo: just a mockup for now
        $scope.getTimeOptions = function(domain) {
            var options = [],
                start = domain === 'day' ? 1 : 0,
                volume = domain === 'day' ? 31
                    : (domain === 'hours' ? 24 : 60);

            for (var i = start; i <= volume; i++) {
                options.push({
                    name: _getNormalizedTimeNumber(i),
                    value: i
                });
            }

            return options;
        };

        $scope.getTaskTypeOptions = function() {
            return [{
                name: 'Appointment',
                value: 'appointment'
            }, {
                name: 'Meeting',
                value: 'meeting'
            }];
        };

        // todo: the year and month are restricted to 2016 and 1 for now
        $scope.taskYear = 2016;
        $scope.taskMonth = 1;
        $scope.taskDay = $scope.getTimeOptions('day')[26];
        $scope.taskHours = $scope.getTimeOptions('hours')[11];
        $scope.taskMinutes = $scope.getTimeOptions('minutes')[30];
        $scope.taskType = $scope.getTaskTypeOptions()[0];
        $scope.taskTitle = '';
        $scope.taskDescription = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum maiores ratione tempora? Asperiores beatae dicta ducimus eos error eum impedit minima minus nemo nobis numquam obcaecati, omnis quae, quibusdam repellat.';

        $scope.addTask = function() {
            var task = {
                date: {
                    year: $scope.taskYear,
                    month: $scope.taskMonth,
                    day: $scope.taskDay.value,
                    hours: $scope.taskHours.value,
                    minutes: $scope.taskMinutes.value
                },
                type: $scope.taskType.value,
                title: $scope.taskTitle,
                description: $scope.taskDescription,
                author: 'Hao Change (default)'
            };

            _addTask(task);

            _updateTaskModel();

            $scope.closeTaskForm();
        };

        $scope.openTaskForm = function() {
            _$taskForm.slideDown(200);
        };

        $scope.closeTaskForm = function() {
            _$taskForm.slideUp(200);
        };

        /******************** event handlers ********************/
        Timeline.query(function(items) {
            angular.forEach(items, function(item) {
                _addTask(item);
            });

            _updateTaskModel();
        });

        /******************** private functions ********************/
        function _addTask(item) {
            var itemDate = item.date,
                month = _getNormalizedTimeNumber(itemDate.month),
                day = _getNormalizedTimeNumber(itemDate.day),
                dateIndex = [itemDate.year, month, day].join('-'),
                dateString = [itemDate.year, month, day].join(''),
                item = _getNormalizedTask(item);

            if (dateIndex in _dates) {
                _dates[dateIndex].items.push(item);
            } else {
                _dates[dateIndex] = {
                    dateIndex: dateIndex,
                    dateString: dateString,
                    items: [item]
                };
            }
        }

        function _updateTaskModel() {
            angular.forEach(_dates, function(date) {
                $scope.dates.push(date);
            });
        }

        function _getNormalizedTask(item) {
            var itemDate = item.date,
                dateLocale = 'en-us',
                date = new Date(itemDate.year, itemDate.month - 1, itemDate.day, itemDate.hours, itemDate.minutes);

            item.date.timestamp = date.getTime();
            item.date.dayName = _getDayName(date.getDay());
            item.date.monthName = date.toLocaleString(dateLocale, {
                month: 'long'
            });

            return item;
        }

        function _getNormalizedTimeNumber(timeNumber) {
            timeNumber = parseInt(timeNumber);

            return timeNumber < 10 ? '0' + timeNumber : '' + timeNumber;
        }

        function _getDayName(dayNumber) {
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
    }]);

    /******************** services ********************/
    app.factory('Timeline', ['$resource', '$q', function($resource) {
        return $resource('model/timeline.json');
    }]);
})(window, angular, jQuery);
