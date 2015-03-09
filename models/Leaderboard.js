/*
* Editor: Tony Ngan
*
*/
(function(){
  'use strict';
  //module.exports = function(config,mongoose,nodemailer){
  module.exports = function(mongoose){

    var MAXLEADER = 6;

    // Define the account schema
    var LeaderboardSchema = new mongoose.Schema({
      name: {type:String,required:true},
      ticker: {type:Number,required:true},
      sequence: {type:String,required:true}
    });
    var Leaderboard = mongoose.model('Leaderboard',LeaderboardSchema);

    // Internal Use
    var insertRec = function(dobj){
      var record = new Leaderboard({
        name: dobj.name,
        ticker: dobj.ticker,
        sequence: dobj.sequence
      });
      record.save(function(err){
        console.log(err);
      });
      return true;
    };

    var processSubmit = function(dobj,callback){
      Leaderboard.count({sequence:dobj.sequence},function(err,count){
        if(err) callback(false);
        if(count<MAXLEADER){
          callback(insertRec(dobj));
        } else if(count===MAXLEADER){
          Leaderboard.findOne({sequence:dobj.sequence}).sort({ticker:-1}).exec(function(err,doc){
            var min = doc.ticker;
            if(min >= dobj.ticker) {
              Leaderboard.remove({_id:doc._id},function(err){
                if(err) callback(false);
                callback(insertRec(dobj));
              });
            } else {
              callback(true,"Cheer next time! Cannot beat the minimum!");
            }
          });
        }
      });
    };

    var getAllRecordBySeqId = function(dobj,callback){
      Leaderboard.find({sequence:dobj.sequence}).sort({ticker:1}).exec(function(err,docs){
        if(err) callback(false);
        docs.forEach(function(doc){
          doc.ticker = parseTicker(doc.ticker);
        });
        callback(true,docs);
      });
    };

    var parseTicker = function(tk){
      var ms=tk%100;
      var s=((tk-ms)/100)%60;
      var mn=Math.floor(((tk-ms)/100)/60);
      return (mn===0?"":mn+".")+(s<10?"0"+s:s)+"."+(ms<10?"0"+ms:ms);
    };

    var getBottommostRecordBySeqId = function(dobj,callback){
      /*
      * The mechanism to get the bottommost record in collection:leaderboards
      * - User inserts without comparison when the collection is still not full (bounded by MAXLEADER)
      *   return -8
      * - Comparison will return the bottommost ticker value
      */
      Leaderboard.count(function(err,count){
        if(err) callback(false);
        else if(count>=0&&count<MAXLEADER){
          callback(true,-8);
        }
        else if(count===MAXLEADER){
          Leaderboard.findOne({sequence:dobj.sequence}).sort({ticker:-1}).exec(function(err,doc){
            if(err) callback(false);
            callback(true,doc.ticker);
          });
        }
        else callback(false);
      });
    };

    return {
      parseTicker:parseTicker,
      getBottommostRecordBySeqId:getBottommostRecordBySeqId,
      getAllRecordBySeqId:getAllRecordBySeqId,
      processSubmit: processSubmit,
      Leaderboard: Leaderboard
    };
  };
})();
