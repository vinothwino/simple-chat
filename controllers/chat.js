const ChatModel = require('../models/chat')
const FriendModel = require('../models/friend')
const { formatResponse } = require('../helpers')
const message = require('../messages.json')
const _ = require('lodash')

module.exports = {
    getChatList : async (req,res) => {
        let lookUpQuery = {
            $lookup: {
                from: 'rooms',
                localField: 'room',
                foreignField: '_id',
                as: 'rooms'
            }
        }

        let matchQuery = {
            $match: {
                'rooms.participant': { $in: [req.user.mobileNumber] }
            }
        }

        let unwind = { "$unwind": "$rooms" }

        // let lookUpQuery2 = {
        //     $lookup: {
        //         from: 'users',
        //         localField: 'rooms.participant',
        //         foreignField: 'mobileNumber',
        //         as: 'friendDetail'
        //     }
        // }

        let data = await ChatModel.aggregate([lookUpQuery, matchQuery,unwind])
        


        res.status(200).json(
            formatResponse(200, data, message.SUCCESS_GET_FRIEND_LIST)
        )
    }
}