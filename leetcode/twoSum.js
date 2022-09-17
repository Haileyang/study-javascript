/*
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

/* ** Given Question **
    Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    You may assume that each input would have exactly one solution, and you may not use the same element twice.
    You can return the answer in any order.
*/

/* ** Given Example **
    Input: nums = [2,7,11,15], target = 9
    Output: [0,1]
    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
*/

/* ** Given Function **
    var twoSum = function(nums, target) {};
*/

/* ** Solution 01 - Nexted for loop **
    1) make an empty array 
    2) use Nexted for loop i = 0 , j = i + 1
    3) make varibles - current, next
    4) if(current + next == target)
*/

let twoSum = function(nums, target) {
    let newArray = []
    for(let i = 0; i < nums.length; i++){
        for( let j = i + 1; j < nums.length; j++){
            // console.log(nums[i]) //2 2 2 2 7 7 7 7 11 11 11 11 15 15 15 15
            // console.log(nums[j]) // 2 7 11 15 2 7 11 15 2 7 11 15 2 7 11 15
            // console.log([nums[i], nums[j]]) 
            // [2,2] [2,7] [2,11] [2,15] [7,2] [7,7] [7,11] [7,15] [11,2] [11,7] [11,11] [11,15] [15,2] [15,7] [15,11] [15,15]

            let current = i
            let next = j
            if (nums[i] + nums[j] == target) {
                newArray.push(current)
                newArray.push(next)
                return newArray 
            }
        }
        // console.log(nums[i]) // 2 7 11 15
        // console.log(nums[j]) // ReferenceError : j is not defined
    }
};

/* ** Solution 01 - Code Refactoring **
    * No need = New Array 
    * No need to make the current and next as variable
    * No need to push
*/
let twoSum2 = function(nums, target) {
    for(let i = 0; i < nums.length; i++){
        for( let j = i + 1; j < nums.length; j++){
            if (nums[i] + nums[j] == target) {
                return [i, j] // * reminder : return nums[i] is expecting the index number but not the value
                // if willing to use push and empty array, define "let newArray = []"
                // return newArray.push(i, j)
            }
        }
    }
};

/* Test */
arrayEX1 = [2,7,11,15]
arrayEX2 = [3,2,4]
arrayEX3 = [3,3]
twoSum(arrayEX1, 9)