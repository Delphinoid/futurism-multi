(function() {
    'use strict';

    var _ = require('lodash');


    /**
     * Keep track of who's turn it is
     * mark players with active = true when it is their turn
     * put a time limit on turn durations
     * @param {array.<Player>} players
     * @param {number} timePerTurn
     * @constructor
     */
    var TurnTicker = function(players, timePerTurn) {
        var self = this;
        var running = false;
        var playerCount = players.length;
        var intervalId;
        var beginCallback;
        var endCallback;

        self.turn = 1;
        self.turnOwners = [];
        self.startTime = 0;
        self.timePerTurn = timePerTurn || 30000;


        /**
         * Start turn progression
         * @param {function} [beginCb]
         * @param {function} [endCb]
         */
        self.start = function(beginCb, endCb) {
            beginCallback = beginCb;
            endCallback = endCb;
            running = true;
            nextTurn();
        };


        /**
         * Pause turn progression
         */
        self.stop = function() {
            running = false;
            beginCallback = null;
            endCallback = null;
            clearTimeout(intervalId);
        };


        /**
         * Return how long this turn has lasted
         * @returns {number}
         */
        self.getElapsed = function() {
            return (+new Date()) - self.startTime;
        };
        
        
        /**
         * @returns {Number}
         */
        self.getTimeLeft = function() {
            return self.timePerTurn - self.getElapsed();
        };


        /**
         * Called when a turn is completed
         */
        self.endTurn = function() {
            clearTimeout(intervalId);
            if(running) {
                if(endCallback) {
                    endCallback(self.getElapsed(), self.turnOwners);
                }
                self.turn++;
                nextTurn();
            }
        };


        /**
         * Test if it is a players turn
         * @param player
         * @returns {boolean}
         */
        self.isTheirTurn = function(player) {
            return (self.turnOwners.indexOf(player) !== -1);
        };


        /**
         * fill turnOwners with players who are active this turn
         */
        self.populateTurn = function() {
            self.turnOwners = getTurnOwners(self.turn);
        };


        /**
         * select players based on which turn it is
         */
        var getTurnOwners = function(turn) {
            var index = (turn+1) % playerCount;
            var player = players[index];
            var owners = [player];
            return owners;
        };


        /**
         * Return an array of userIds that are active this turn
         */
        self.getTurnOwnerIds = function() {
            return _.map(self.turnOwners, function(player) {
                return player._id;
            });
        };


        /**
         * Return numbers of active players there are this turn
         * @returns {number}
         */
        self.getActivePlayers = function() {
            var activePlayers = _.filter(self.turnOwners, function(player) {
                return !player.forfeited;
            });
            return activePlayers.length;
        };


        /**
         * Move a turn to the next player in line
         */
        var nextTurn = function() {
            self.startTime = +new Date();
            self.populateTurn();

            var turnExpireTime = self.timePerTurn;
            if(self.getActivePlayers() === 0) {
                turnExpireTime = 1000;
            }

            intervalId = setTimeout(self.endTurn, turnExpireTime);

            if(beginCallback) {
                beginCallback(self.startTime, self.turnOwners);
            }
        };
    };


    module.exports = TurnTicker;

}());