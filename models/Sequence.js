/*
* Editor: Tony Ngan
*
*
*/
(function(){
  'use strict';
  //module.exports = function(config,mongoose,nodemailer){
  module.exports = function(mongoose){

    // Define the sequence schema
    var SequenceSchema = new mongoose.Schema({
      alias: {type:String,unique:true,required: true},
      mapping: {type:String,required:true},
      seq:{type:String,required: true}
    });
    var Sequence = mongoose.model('Sequence',SequenceSchema);

    var findSeqInfoByAlias = function(alias,callback){
      Sequence.findOne({alias:alias},function(err,doc){
        if(err) callback(false,null);
        callback(true,doc);
      });
    };

    return {
      findSeqInfoByAlias:findSeqInfoByAlias,
      Sequence: Sequence
    };
  };
})();
