/**
 * Masking json format to new format
 * with rename key and change position
 */

class Masking{

    
    constructor(data) {
        this.input = data.input
        this.masking = JSON.parse(data.masking)
        this.output = {}
        this.subData = {}
        this.subDataArray = []
    }

     pointedData(dataKey, data) { 
        var keyArray    = dataKey.split('.'); 
        var pointedData     = data[keyArray[0]]; 
        for (var i = 1; i < keyArray.length; i++) { // loop through nested data if necessary
            if (pointedData == undefined) { // set as 'null' if pointer not found
                pointedData = null;
                continue;
            } else {
                pointedData = pointedData[keyArray[i]];
            }
        }
        return pointedData;
    }

    generate(keySelection){
        var selectedMasking   = this.masking[keySelection]
        for(var originKey in selectedMasking){
            var expectedKey = selectedMasking[originKey]
            this.diveIn(originKey, expectedKey, this.input, true)
        }
        return this.output
    }

    diveIn(originKey, expectedKey, data, saveToOutput){
        if (expectedKey instanceof Object){
            var dataLoop = this.pointedData(originKey,data)
            
            this.subDataArray = []
            dataLoop.forEach((dt) => {
                this.subData = {}
                var loop = 1;
                var lengthExpectedKey = Object.keys(expectedKey).length
                for(var oriKey in expectedKey){
                    var newExpectedKey = expectedKey[oriKey]
                    this.diveIn(oriKey, newExpectedKey, dt, (loop==lengthExpectedKey))
                    loop++
                }
            })
        }else{
            var multipleKey = expectedKey.split(".")
            if (multipleKey.length>1){
                // getting last child
                var lastKey = multipleKey[multipleKey.length-1]
                this.subData[lastKey] = this.pointedData(originKey, data)
                if (!this.subData[lastKey]){ //  if this data is null, check form parent data
                    this.subData[lastKey] = this.pointedData(originKey,this.input)
                }
                
                this.subDataArray.push(this.subData)
                
                var expectedData = [this.subDataArray[this.subDataArray.length-1]]
                expectedKey = multipleKey[0]
                
            }else{
                var expectedData = this.pointedData(originKey, data)
            }
            if (saveToOutput){
                if (typeof this.output[expectedKey] == "undefined") {
                    this.output[expectedKey] = expectedData
                 }else{
                    console.log("OUTPUT BEFORE PUSH",this.output[expectedKey],expectedKey);
                    this.output[expectedKey].push(expectedData[0])
                 }
            }
            
        }
    }
    
}

module.exports = Masking