/*
 * Projectname: amos-ss16-proj1
 *
 * Copyright (c) 2016 de.fau.cs.osr.amos2016.gruppe1
 *
 * This file is part of the AMOS Project 2016 @ FAU
 * (Friedrich-Alexander University Erlangen-Nürnberg)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program. If not, see
 * <http://www.gnu.org/licenses/>.
 *
 */


// Controller for Settings
angular.module('app.controllers')
.controller('GraphCtrl', function($scope, $rootScope, $cordovaSQLite, Log, settings, dataStorage) {
    $scope.labels = [];
    $scope.series = [/*'ACC-X', 'ACC-Y', */'ACC-Z'];
    $scope.data = [  [] ];

    $scope.numberOfDatapoints = 10;

    // Initialize the current start point
    $scope.currentStartPoint = ((dataStorage.retrieveData("accelerometer-time")).length - $scope.numberOfDatapoints);
    $scope.totalPoints = dataStorage.retrieveData("accelerometer-time").length;

    // This variable is true when the user dragged the graph to any location other than the end.
    $scope.dragged = false;

    // If less than 100 data points are available set the startpoint to 0
    if($scope.currentStartPoint < 0) {
        $scope.currentStartPoint = 0;
    }

    // This function extracs a 100 item data slice from the data starting at $scope.currentStartPoint
    // This data slice is set as the chart data.
    function createAndSetDataSlice()
    {
        var start = $scope.currentStartPoint;
        var end = start + $scope.numberOfDatapoints;
        //$scope.data[0] = dataStorage.retrieveData("accelerometer-x").slice(start,end;
        //$scope.data[1] = dataStorage.retrieveData("accelerometer-y").slice(start,end);
        $scope.data[0] = dataStorage.retrieveData("accelerometer-z").slice(start,end);
        $scope.labels = dataStorage.retrieveData("accelerometer-time").slice(start, end);
    }





    createAndSetDataSlice();

    $scope.barOffset = 0;

    // If we receive new data then update the graph
    $rootScope.$on("newAccelerometerData", function() {
        $scope.totalPoints = dataStorage.retrieveData("accelerometer-time").length;
        Log.add("Dragged is : " + $scope.dragged);
        // Initialize the current start point if not dragged
        if(!$scope.dragged)
        {
            $scope.currentStartPoint = $scope.totalPoints - $scope.numberOfDatapoints;

            // Update the start offset. We are following the graph at this point.
            $scope.startOffset = $scope.currentStartPoint;
        }


        // If less than $scope.numberOfDatapoints data points are available set the startpoint to 0
        if($scope.currentStartPoint < 0) {
            $scope.currentStartPoint = 0;
        }

        createAndSetDataSlice();
    });

    // Variables relating to dragging
    $scope.dragging = false;
    $scope.startOffset = 0;

    $scope.followGraph = function()
    {
        $scope.dragged = false;
        $scope.currentStartPoint = $scope.totalPoints - $scope.numberOfDatapoints;

        // Update the start offset. We are following the graph at this point.
        $scope.startOffset = $scope.currentStartPoint;
        createAndSetDataSlice();
    }

    // When starting drag set dragging to true and log the startPosition
    $scope.startDrag = function($event) {
        Log.add("Start Drag: " + JSON.stringify($event));
        $scope.dragging = true;
        $scope.startOffset = $scope.currentStartPoint;
    };

    // When stopping the dragging set dragging to false and persist the barOffset
    $scope.stopDrag = function($event) {
        Log.add("Stop Drag: " + JSON.stringify($event));
        $scope.dragging = false;
    };

    // On mouse move we need to update the dragging
    $scope.mouseMove = function($event) {
        Log.add("Mousemove: " + JSON.stringify($event));
        // Only do something if currently dragging
        if($scope.dragging)
        {
            // The width of a single bar in the bar graph
            var widthOfBar = angular.element("#bar").attr("width")/$scope.numberOfDatapoints;
            console.log("Width of bar is " + widthOfBar);

            // The number of bars we've dragged is dependent on the space moved and
            // the width of a single bar
            // Number of bars should be positive if dragging to the left.
            var numberOfBars = ($event.gesture.deltaX / widthOfBar) * -2;

            Log.add("Number of Bars: " + numberOfBars);

            // If we dragged to the end then set start point to the max
            if(numberOfBars + $scope.startOffset > ($scope.totalPoints - $scope.numberOfDatapoints)) {
                $scope.dragged = true;
                // The current start point is changed to the maximum.
                $scope.currentStartPoint = $scope.totalPoints - $scope.numberOfDatapoints;
                createAndSetDataSlice();
            }
            else {
                // We dragged. Therefore we do not want to follow anymore.
                $scope.dragged = true;
                // The current start point is changed by the number of dragged bars.
                $scope.currentStartPoint = $scope.startOffset + numberOfBars;

                // Don't let it become negative.
                if($scope.currentStartPoint < 0) {
                    $scope.currentStartPoint = 0;
                }
                createAndSetDataSlice();
            }
        }
    };
})

