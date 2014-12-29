/*
* Editor: Tony Ngan
*
*/
(function(){
  'use strict';
  //module.exports = function(config,mongoose,nodemailer){
  module.exports = function(mongoose){

    // Define the encoding schema
    var EncodingSchema = new mongoose.Schema({
      name: {type:String,unique:true,required: true},
      mapping: {type:String,required: true}
    });
    var Encoding = mongoose.model('Encoding',EncodingSchema);

    return {
      Encoding: Encoding
    };
  };
})();
