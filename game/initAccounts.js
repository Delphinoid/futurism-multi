'use strict';

var _ = require('lodash');
var gameLookup = require('./gameLookup');
var factions = require('../shared/factions');
var actions = require('../shared/actions');
var Player = require('./Player');
var nextCid = require('./nextCid');


/**
 * Fill an account with the data structure needed to play a match
 * @param {Array} accounts
 * @returns {Array.<Player>} players
 */
var InitAccounts = function(accounts) {
    var players = [];
    _.each(accounts, function(account) {
        var player = new Player(account);
        var commander = makeAccountCard(account);
        player.hand.push(commander);
        players.push(player);
    });

    return players;
};


/**
 * Create a card to represent the player
 * @param {object} account
 */
var makeAccountCard = function(account) {
    return {
        _id: 0,
        commander: true,
        userId: account._id,
        name: account.name,
        faction: 'no',
        attack: 0,
        health: 10,
        story: '',
        abilities: [actions.SUMMON, actions.FUTURE],
        cid: nextCid(),
        moves: 1,
        pride: 0
    };
};


/**
 * public interface
 */
module.exports = InitAccounts;


