/*
* Editor: Tony Ngan
*
*/
(function(){
  'use strict';
  //module.exports = function(config,mongoose,nodemailer){
  module.exports = function(mongoose){

    // Define the statistics schema
    var StatisticsSchema = new mongoose.Schema({
      sequences: {type:String,required: true},
      times: {type:Number,required:true}
    });
    var Statistics = mongoose.model('Statistics',StatisticsSchema);

    return {
      Statistics: Statistics
    };
  };
})();
