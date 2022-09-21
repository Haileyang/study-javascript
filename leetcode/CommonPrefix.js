/*
 * @param {string[]} strs
 * @return {string}
 */

/* ** Given Question **
   Write a function to find the longest common prefix string amongst an array of strings.
   If there is no common prefix, return an empty string "".
*/

/* ** Given Example **
  Input: strs = ["flower","flow","flight"]
  Output: "fl"
*/

/* ** Given Function **
    var longestCommonPrefix = function(strs) {};
*/

/* ** Solution 01 **
    1) convert x from number to string 
    2) make a function with for loop reversed the order
*/

var longestCommonPrefix = function(strs) {
    let commonPrefix = ""
    // check if there is any element in an array
    if(strs == null || strs.length === 0){
        return commonPrefix
    }

    for (let i = 0; i < strs[0].length; i++){
        //search each elements in an array and get the value of max prefix that is at leat two elements
        let guideCharacter = strs[0][i] //"fl" "f" "l" "o" "fl"
        for (let j = i + 1; j < strs.length; j++){
            console.log(guideCharacter) //fl
           if(strs[j][i] !== guideCharacter){
                return commonPrefix
           }
           commonPrefix = commonPrefix + guideCharacter
        }
        return commonPrefix
    }
};


/* Test */
longestCommonPrefix(["flower","flow","flight"])