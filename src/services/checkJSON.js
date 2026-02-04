function checkJSON(payload){
    try{
        return ({ ok : true , value : JSON.parse(payload)});
    }
    catch(e){
        return ({ ok : false });
    }
}


module.exports = checkJSON;