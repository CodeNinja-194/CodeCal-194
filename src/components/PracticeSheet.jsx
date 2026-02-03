import { createSignal, onMount, For, Show, createMemo } from 'solid-js';

// DSA Problems Data Structure - The Final Unified Mastery List
const practiceData = {
    "LEARN THE BASICS": {
        description: "Language syntax, basic logic, and time complexity analysis.",
        problems: [
            { name: "Codeforces ➱ Basic to Medium", difficulty: "Medium", leetcode: "", codeforces: "https://codeforces.com/group/MWSDmqGsZm/contests" },
            { name: "Data Types", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/c-data-types/" },
            { name: "User Input / Output", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/basic-input-and-output-in-c/" },
            { name: "Conditional Statements", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/c-c-if-else-statement-with-examples/" },
            { name: "Loops", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/c-for-loop/" },
            { name: "Patterns", difficulty: "Easy", leetcode: "", gfg: "https://javaconceptoftheday.com/pattern-programs-in-java/" },
            { name: "Functions", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/dsa/functions-programming/" },
            { name: "Arrays, Strings Introduction", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/array-data-structure/" },
            { name: "Time Complexity Analysis", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/dsa/understanding-time-complexity-simple-examples/" },
            { name: "Master Sheet", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/gfg-academy/geeksforgeeks-master-sheet-list-of-all-cheat-sheets/" }
        ]
    },
    "MATHEMATICS": {
        description: "Pure logic and math tricks - no complex data structures needed",
        subtopics: {
            "Basic & Number Theory": [
                { name: "Palindrome number", difficulty: "Easy", leetcode: "https://leetcode.com/problems/palindrome-number/", gfg: "" },
                { name: "Reverse integer", difficulty: "Medium", leetcode: "https://leetcode.com/problems/reverse-integer/", gfg: "" },
                { name: "Sqrt(x)", difficulty: "Easy", leetcode: "https://leetcode.com/problems/sqrtx/", gfg: "" },
                { name: "Pow(x, n)", difficulty: "Medium", leetcode: "https://leetcode.com/problems/powx-n/", gfg: "" },
                { name: "Count primes", difficulty: "Medium", leetcode: "https://leetcode.com/problems/count-primes/", gfg: "" },
                { name: "Factorial trailing zeroes", difficulty: "Medium", leetcode: "https://leetcode.com/problems/factorial-trailing-zeroes/", gfg: "" }
            ],
            "Combinatorics & Advanced": [
                { name: "Pascal's triangle", difficulty: "Easy", leetcode: "https://leetcode.com/problems/pascals-triangle/", gfg: "" },
                { name: "Unique paths (math)", difficulty: "Medium", leetcode: "https://leetcode.com/problems/unique-paths/", gfg: "" },
                { name: "Integer to roman", difficulty: "Medium", leetcode: "https://leetcode.com/problems/integer-to-roman/", gfg: "" },
                { name: "Roman to integer", difficulty: "Easy", leetcode: "https://leetcode.com/problems/roman-to-integer/", gfg: "" }
            ]
        }
    },
    "BIT MANIPULATION": {
        description: "Lightning-fast operations using bitwise logic - loved by competitive programmers",
        subtopics: {
            "Basic": [
                { name: "Number of 1 bits", difficulty: "Easy", leetcode: "https://leetcode.com/problems/number-of-1-bits/", gfg: "" },
                { name: "Power of two", difficulty: "Easy", leetcode: "https://leetcode.com/problems/power-of-two/", gfg: "" },
                { name: "Count of bits", difficulty: "Easy", leetcode: "https://leetcode.com/problems/counting-bits/", gfg: "" },
                { name: "Reverse bits", difficulty: "Easy", leetcode: "https://leetcode.com/problems/reverse-bits/", gfg: "" }
            ],
            "Single Number": [
                { name: "Single number", difficulty: "Easy", leetcode: "https://leetcode.com/problems/single-number/", gfg: "" },
                { name: "Missing number", difficulty: "Easy", leetcode: "https://leetcode.com/problems/missing-number/", gfg: "" },
                { name: "Single number 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/single-number-ii/", gfg: "" }
            ],
            "XOR & Advanced": [
                { name: "Sum of two integers", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sum-of-two-integers/", gfg: "" },
                { name: "Decode XORed permutation", difficulty: "Medium", leetcode: "https://leetcode.com/problems/decode-xored-permutation/", gfg: "" },
                { name: "Bitwise and of numbers range", difficulty: "Medium", leetcode: "https://leetcode.com/problems/bitwise-and-of-numbers-range/", gfg: "" },
                { name: "Maximum product of word lengths", difficulty: "Medium", leetcode: "https://leetcode.com/problems/maximum-product-of-word-lengths/", gfg: "" },
                { name: "UTF-8 validation", difficulty: "Medium", leetcode: "https://leetcode.com/problems/utf-8-validation/", gfg: "" }
            ]
        }
    },
    "ARRAYS": {
        description: "Master the foundation of all data structures - arrays are tested in 90% of interviews",
        subtopics: {
            "Basic Operations": [
                { name: "Find the largest element in an array", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1" },
                { name: "Find the second largest element", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/second-largest3735/1" },
                { name: "Check if array is sorted", difficulty: "Easy", leetcode: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/", gfg: "https://www.geeksforgeeks.org/problems/check-if-an-array-is-sorted0701/1" },
                { name: "Find missing number in array", difficulty: "Easy", leetcode: "https://leetcode.com/problems/missing-number/", gfg: "https://www.geeksforgeeks.org/problems/missing-number-in-array1416/1" },
                { name: "Concatenation of Array", difficulty: "Easy", leetcode: "https://leetcode.com/problems/concatenation-of-array/description/?envType=problem-list-v2&envId=array", gfg: "" },
                { name: "Shuffle the Array", difficulty: "Easy", leetcode: "https://leetcode.com/problems/shuffle-the-array/description/?envType=problem-list-v2&envId=array", gfg: "" },
                { name: "Best time to buy and sell stock", difficulty: "Easy", leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", gfg: "https://www.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1" },
                { name: "Rotate array", difficulty: "Medium", leetcode: "https://leetcode.com/problems/rotate-array/", gfg: "https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1" }
            ],

            "Sorting": [
                { name: "Merge sorted array", difficulty: "Easy", leetcode: "https://leetcode.com/problems/merge-sorted-array/", gfg: "" },
                { name: "Minimum Moves to sort students", difficulty: "Easy", leetcode: "https://leetcode.com/problems/minimum-number-of-moves-to-seat-everyone/description/?envType=problem-list-v2&envId=sorting", gfg: "" },
                { name: "Sort numbers by their bits", difficulty: "Easy", leetcode: "https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/description/?envType=problem-list-v2&envId=sorting", gfg: "" },
                { name: "Squares of sorted array", difficulty: "Easy", leetcode: "https://leetcode.com/problems/squares-of-a-sorted-array/?envType=problem-list-v2&envId=sorting", gfg: "" },
                { name: "Sort 0's and 1's", difficulty: "Easy", gfg: "https://www.geeksforgeeks.org/problems/segregate-0s-and-1s5106/1" },
                { name: "Sort colors", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sort-colors/", gfg: "" }
            ],

            "Searching": [
                { name: "Count pairs", difficulty: "Easy", leetcode: "https://leetcode.com/problems/count-pairs-whose-sum-is-less-than-target/?envType=problem-list-v2&envId=binary-search", gfg: "" },
                { name: "Search in rotated sorted array", difficulty: "Medium", leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/", gfg: "" },
                { name: "Search in rotated sorted array II", difficulty: "Medium", leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/description/", gfg: "" },
                { name: "Find peak element", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-peak-element/", gfg: "" },
                { name: "Minimum in rotated sorted array", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/", gfg: "" },
                { name: "Median of two sorted arrays", difficulty: "Hard", leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/", gfg: "" }
            ],

            "Matrix": [
                { name: "Transpose matrix", difficulty: "Easy", leetcode: "https://leetcode.com/problems/transpose-matrix/description/", gfg: "" },
                { name: "Lucky Number", difficulty: "Easy", leetcode: "https://leetcode.com/problems/lucky-numbers-in-a-matrix/description/?envType=problem-list-v2&envId=matrix" },
                { name: "Rotate image", difficulty: "Medium", leetcode: "https://leetcode.com/problems/rotate-image/", gfg: "" },
                { name: "Set matrix zeroes", difficulty: "Medium", leetcode: "https://leetcode.com/problems/set-matrix-zeroes/", gfg: "" },
                { name: "Spiral matrix", difficulty: "Medium", leetcode: "https://leetcode.com/problems/spiral-matrix/", gfg: "" },
                { name: "Minimum no of Flips ", difficulty: "Hard", leetcode: "https://leetcode.com/problems/minimum-number-of-flips-to-convert-binary-matrix-to-zero-matrix/description/?envType=problem-list-v2&envId=matrix" }
            ],

            "Two Pointers": [
                { name: "Reverse array", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/reverse-an-array/1" },
                { name: "Move zeros to end", difficulty: "Easy", leetcode: "https://leetcode.com/problems/move-zeroes/", gfg: "https://www.geeksforgeeks.org/problems/move-all-zeroes-to-end-of-array0751/1" },
                { name: "Remove duplicates from sorted array", difficulty: "Easy", leetcode: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", gfg: "https://www.geeksforgeeks.org/problems/remove-duplicate-elements-from-sorted-array/1" },
                { name: "Two sum", difficulty: "Easy", leetcode: "https://leetcode.com/problems/two-sum/", gfg: "https://www.geeksforgeeks.org/problems/key-pair5616/1" },
                { name: "Container with most water", difficulty: "Medium", leetcode: "https://leetcode.com/problems/container-with-most-water/", gfg: "https://www.geeksforgeeks.org/problems/container-with-most-water0535/1" },
                { name: "Three sum", difficulty: "Medium", leetcode: "https://leetcode.com/problems/3sum/", gfg: "https://www.geeksforgeeks.org/problems/three-sum/1" },
                { name: "Trapping rain water", difficulty: "Hard", leetcode: "https://leetcode.com/problems/trapping-rain-water/", gfg: "https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1" }
            ],

            "Sliding Window": [
                { name: "Defuse Bomb", difficulty: "Easy", leetcode: "https://leetcode.com/problems/defuse-the-bomb/description/?envType=problem-list-v2&envId=sliding-window" },
                { name: "Min diff. high and low of k scores", difficulty: "Easy", leetcode: "https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/description/?envType=problem-list-v2&envId=sliding-window" },
                { name: "Max sum subarray size k", difficulty: "Easy", leetcode: "https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/description/", gfg: "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1" },
                { name: "Longest substring", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", gfg: "" },
                { name: "Minimum Swaps", difficulty: "Medium", leetcode: "https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/description/?envType=problem-list-v2&envId=sliding-window" },
                { name: "Sliding window maximum", difficulty: "Hard", leetcode: "https://leetcode.com/problems/sliding-window-maximum/", gfg: "" }
            ],

            "Prefix Sum & Subarray": [
                { name: "Topic Material", difficulty: "Easy-Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/dsa/top-problems-on-prefix-sum-technique-for-interviews/" },
                { name: "Equilibrium Index", difficulty: "Easy", gfg: "https://www.geeksforgeeks.org/problems/equilibrium-point-1587115620/1" },
                { name: "Product of array except self", difficulty: "Medium", leetcode: "https://leetcode.com/problems/product-of-array-except-self/", gfg: "" },
                { name: "Maximum subarray", difficulty: "Medium", leetcode: "https://leetcode.com/problems/maximum-subarray/", gfg: "" },
                { name: "Subarray sum equals k", difficulty: "Medium", leetcode: "https://leetcode.com/problems/subarray-sum-equals-k/", gfg: "" },
                { name: "New Topics", difficulty: "Easy-Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/dsa/array-subarray-subsequence-and-subset/" }
            ],

            "Intervals": [
                { name: "Topic Material", difficulty: "Easy-Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/dsa/coding-problems-on-interval-and-range-manipulation/" },
                { name: "Merge intervals", difficulty: "Medium", leetcode: "https://leetcode.com/problems/merge-intervals/", gfg: "" },
                { name: "Insert interval", difficulty: "Medium", leetcode: "https://leetcode.com/problems/insert-interval/", gfg: "" },
                { name: "Meeting rooms 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/meeting-rooms-ii/", gfg: "" }
            ]
        }
    },

    "HASHING": {
        description: "O(1) lookups transform many O(n²) problems into O(n) solutions",
        subtopics: {
            "Basic": [
                { name: "Two Sum", difficulty: "Easy", leetcode: "https://leetcode.com/problems/two-sum/", gfg: "" },
                { name: "Contains Duplicates", difficulty: "Easy", leetcode: "https://leetcode.com/problems/contains-duplicate/", gfg: "" },
                { name: "Valid Anagram", difficulty: "Easy", leetcode: "https://leetcode.com/problems/valid-anagram/", gfg: "" },
                { name: "Group anagrams", difficulty: "Medium", leetcode: "https://leetcode.com/problems/group-anagrams/", gfg: "" }
            ],
            "Subarray": [
                { name: "Subarray sum equals k", difficulty: "Medium", leetcode: "https://leetcode.com/problems/subarray-sum-equals-k/", gfg: "" },
                { name: "Longest consecutive sequence", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-consecutive-sequence/", gfg: "" },
                { name: "Continuous subarray sum", difficulty: "Medium", leetcode: "https://leetcode.com/problems/continuous-subarray-sum/", gfg: "" }
            ],
            "Design": [
                { name: "Design HashMap", difficulty: "Medium", leetcode: "https://leetcode.com/problems/design-hashmap/", gfg: "" },
                { name: "LRU cache", difficulty: "Medium", leetcode: "https://leetcode.com/problems/lru-cache/", gfg: "" },
                { name: "LFU cache", difficulty: "Hard", leetcode: "https://leetcode.com/problems/lfu-cache/", gfg: "" }
            ],
            "Advanced": [
                { name: "4sum 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/4sum-ii/", gfg: "" },
                { name: "Minimum window substring", difficulty: "Hard", leetcode: "https://leetcode.com/problems/minimum-window-substring/", gfg: "" },
                { name: "Subarrays with k different integers", difficulty: "Hard", leetcode: "https://leetcode.com/problems/subarrays-with-k-different-integers/", gfg: "" }
            ]
        }
    },
    "STRINGS": {
        description: "Text manipulation is everywhere - from parsing to pattern matching",
        subtopics: {
            "Basic Operations": [
                { name: "Reverse string", difficulty: "Easy", leetcode: "https://leetcode.com/problems/reverse-string/", gfg: "" },
                { name: "Valid palindrome", difficulty: "Easy", leetcode: "https://leetcode.com/problems/valid-palindrome/", gfg: "" },
                { name: "First unique character", difficulty: "Easy", leetcode: "https://leetcode.com/problems/first-unique-character-in-a-string/", gfg: "" },
                { name: "Longest common prefix", difficulty: "Easy", leetcode: "https://leetcode.com/problems/longest-common-prefix/", gfg: "" }
            ],
            "Two Pointers": [
                { name: "Valid palindrome 2", difficulty: "Easy", leetcode: "https://leetcode.com/problems/valid-palindrome-ii/", gfg: "" },
                { name: "Reverse words in string", difficulty: "Medium", leetcode: "https://leetcode.com/problems/reverse-words-in-a-string/", gfg: "" },
                { name: "Longest palindromic substring", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-palindromic-substring/", gfg: "" }
            ],
            "Sliding Window": [
                { name: "Longest substring without repeating", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", gfg: "" },
                { name: "Longest repeating character replacement", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-repeating-character-replacement/", gfg: "" },
                { name: "Minimum window substring", difficulty: "Hard", leetcode: "https://leetcode.com/problems/minimum-window-substring/", gfg: "" }
            ],
            "Hashmap": [
                { name: "Valid anagram", difficulty: "Easy", leetcode: "https://leetcode.com/problems/valid-anagram/", gfg: "" },
                { name: "Group anagrams", difficulty: "Medium", leetcode: "https://leetcode.com/problems/group-anagrams/", gfg: "" },
                { name: "Word pattern", difficulty: "Easy", leetcode: "https://leetcode.com/problems/word-pattern/", gfg: "" }
            ],
            "Pattern Matching": [
                { name: "Implement strstr", difficulty: "Easy", leetcode: "https://leetcode.com/problems/implement-strstr/", gfg: "" },
                { name: "Edit distance", difficulty: "Hard", leetcode: "https://leetcode.com/problems/edit-distance/", gfg: "" },
                { name: "Wildcard matching", difficulty: "Hard", leetcode: "https://leetcode.com/problems/wildcard-matching/", gfg: "" }
            ],
            "Advanced": [
                { name: "String to integer", difficulty: "Medium", leetcode: "https://leetcode.com/problems/string-to-integer-atoi/", gfg: "" },
                { name: "Longest palindromic subsequence", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-palindromic-subsequence/", gfg: "" },
                { name: "Palindrome partitioning", difficulty: "Hard", leetcode: "https://leetcode.com/problems/palindrome-partitioning/", gfg: "" }
            ]
        }
    },
    "BINARY SEARCH": {
        description: "Master O(log n) thinking - halve your search space repeatedly",
        subtopics: {
            "Basic": [
                { name: "Binary search", difficulty: "Easy", leetcode: "https://leetcode.com/problems/binary-search/", gfg: "" },
                { name: "First bad version", difficulty: "Easy", leetcode: "https://leetcode.com/problems/first-bad-version/", gfg: "" },
                { name: "Search insert position", difficulty: "Easy", leetcode: "https://leetcode.com/problems/search-insert-position/", gfg: "" }
            ],
            "Rotated Arrays": [
                { name: "Find minimum in rotated sorted array", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", gfg: "" },
                { name: "Search in rotated sorted array", difficulty: "Medium", leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/", gfg: "" }
            ],
            "Peak & Range": [
                { name: "Find peak element", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-peak-element/", gfg: "" },
                { name: "Find first and last position", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", gfg: "" }
            ],
            "Matrix Search": [
                { name: "Search 2d matrix", difficulty: "Medium", leetcode: "https://leetcode.com/problems/search-a-2d-matrix/", gfg: "" },
                { name: "Kth smallest in sorted matrix", difficulty: "Medium", leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/", gfg: "" }
            ],
            "Allocation Problems": [
                { name: "Koko eating bananas", difficulty: "Medium", leetcode: "https://leetcode.com/problems/koko-eating-bananas/", gfg: "" },
                { name: "Capacity to ship packages", difficulty: "Medium", leetcode: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", gfg: "" },
                { name: "Split array largest sum", difficulty: "Hard", leetcode: "https://leetcode.com/problems/split-array-largest-sum/", gfg: "" },
                { name: "Book allocation", difficulty: "Medium", leetcode: "", gfg: "" },
                { name: "Aggressive cows", difficulty: "Hard", leetcode: "", gfg: "" }
            ],
            "Advanced": [
                { name: "Median of two sorted arrays", difficulty: "Hard", leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/", gfg: "" },
                { name: "Minimize max distance to gas station", difficulty: "Hard", leetcode: "", gfg: "" }
            ]
        }
    },
    "RECURSION": {
        description: "Pure functional thinking - break problems into smaller self-similar copies",
        subtopics: {
            "Fundamentals": [
                { name: "Print 1 to N / N to 1", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/print-1-to-n-without-using-loops-1587115620/1" },
                { name: "Sum of first N numbers", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/sum-of-first-n-terms5843/1" },
                { name: "Factorial", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/factorial5439/1" },
                { name: "Fibonacci", difficulty: "Easy", leetcode: "https://leetcode.com/problems/fibonacci-number/", gfg: "https://www.geeksforgeeks.org/problems/nth-fibonacci-number1335/1" }
            ],
            "Array & String": [
                { name: "Check if array is sorted", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/check-if-array-is-sorted0604/1" },
                { name: "Binary search (recursive)", difficulty: "Easy", leetcode: "https://leetcode.com/problems/binary-search/", gfg: "https://www.geeksforgeeks.org/problems/binary-search/1" },
                { name: "String Palindrome check", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/palindrome-string0817/1" },
                { name: "Reverse string (recursion)", difficulty: "Easy", leetcode: "https://leetcode.com/problems/reverse-string/", gfg: "https://www.geeksforgeeks.org/problems/reverse-a-string-using-recursion/1" }
            ],
            "Intermediate": [
                { name: "Power(x, n)", difficulty: "Medium", leetcode: "https://leetcode.com/problems/powx-n/", gfg: "https://www.geeksforgeeks.org/problems/implement-powxn/1" },
                { name: "Merge sort", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sort-an-array/", gfg: "https://www.geeksforgeeks.org/problems/merge-sort/1" },
                { name: "Quick sort", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sort-an-array/", gfg: "https://www.geeksforgeeks.org/problems/quick-sort/1" }
            ]
        }
    },
    "LINKED LIST": {
        description: "Pointer manipulation mastery - foundation for trees and graphs",
        subtopics: {
            "Basic": [
                { name: "Reverse linked list", difficulty: "Easy", leetcode: "https://leetcode.com/problems/reverse-linked-list/", gfg: "" },
                { name: "Find middle of Linked List", difficulty: "Easy", leetcode: "https://leetcode.com/problems/middle-of-the-linked-list/", gfg: "" },
                { name: "Delete node in Linked List", difficulty: "Easy", leetcode: "https://leetcode.com/problems/delete-node-in-a-linked-list/", gfg: "" },
                { name: "Remove Nth from end of Linked List", difficulty: "Medium", leetcode: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", gfg: "" }
            ],
            "Cycle Detection": [
                { name: "Linked list cycle", difficulty: "Easy", leetcode: "https://leetcode.com/problems/linked-list-cycle/", gfg: "" },
                { name: "Linked list cycle 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/linked-list-cycle-ii/", gfg: "" },
                { name: "Find Length of Linked List Cycle", difficulty: "Easy", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/find-length-of-loop/1" }
            ],
            "Reversal": [
                { name: "Reverse linked list 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/reverse-linked-list-ii/", gfg: "" },
                { name: "Reorder list", difficulty: "Medium", leetcode: "https://leetcode.com/problems/reorder-list/", gfg: "" },
                { name: "Reverse nodes in k groups", difficulty: "Hard", leetcode: "https://leetcode.com/problems/reverse-nodes-in-k-group/", gfg: "" }
            ],
            "Merge & Manipulation": [
                { name: "Merge two sorted lists", difficulty: "Easy", leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/", gfg: "" },
                { name: "Partition list", difficulty: "Medium", leetcode: "https://leetcode.com/problems/partition-list/", gfg: "" },
                { name: "Sort list", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sort-list/", gfg: "" },
                { name: "Merge k sorted lists", difficulty: "Hard", leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/", gfg: "" }
            ],
            "Advanced": [
                { name: "Intersection of two linked lists", difficulty: "Easy", leetcode: "https://leetcode.com/problems/intersection-of-two-linked-lists/", gfg: "" },
                { name: "Copy list with random pointer", difficulty: "Medium", leetcode: "https://leetcode.com/problems/copy-list-with-random-pointer/", gfg: "" },
                { name: "Flatten multilevel doubly linked list", difficulty: "Medium", leetcode: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/", gfg: "" }
            ]
        }
    },
    "STACKS": {
        description: "LIFO (Last-In-First-Out) - essential for expression parsing, redo/undo, and recursion simulation",
        subtopics: {
            "Design & Basic": [
                { name: "Implement stack using queues", difficulty: "Easy", leetcode: "https://leetcode.com/problems/implement-stack-using-queues/", gfg: "" },
                { name: "Min stack", difficulty: "Medium", leetcode: "https://leetcode.com/problems/min-stack/", gfg: "" },
                { name: "Valid parentheses", difficulty: "Easy", leetcode: "https://leetcode.com/problems/valid-parentheses/", gfg: "" },
                { name: "Backspace string compare", difficulty: "Easy", leetcode: "https://leetcode.com/problems/backspace-string-compare/", gfg: "" },
                { name: "Remove outermost parentheses", difficulty: "Easy", leetcode: "https://leetcode.com/problems/remove-outermost-parentheses/", gfg: "" }
            ],
            "Monotonic Stack": [
                { name: "Next greater element", difficulty: "Easy", leetcode: "https://leetcode.com/problems/next-greater-element-i/", gfg: "" },
                { name: "Next greater element II", difficulty: "Medium", leetcode: "https://leetcode.com/problems/next-greater-element-ii/", gfg: "" },
                { name: "Daily temperatures", difficulty: "Medium", leetcode: "https://leetcode.com/problems/daily-temperatures/", gfg: "" },
                { name: "Online stock span", difficulty: "Medium", leetcode: "https://leetcode.com/problems/online-stock-span/", gfg: "" },
                { name: "Sum of subarray minimums", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sum-of-subarray-minimums/", gfg: "" }
            ],
            "Expression & Advanced": [
                { name: "Evaluate reverse polish notation", difficulty: "Medium", leetcode: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", gfg: "" },
                { name: "Basic calculator", difficulty: "Hard", leetcode: "https://leetcode.com/problems/basic-calculator/", gfg: "" },
                { name: "Remove k digits", difficulty: "Medium", leetcode: "https://leetcode.com/problems/remove-k-digits/", gfg: "" },
                { name: "Largest rectangle in histogram", difficulty: "Hard", leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/", gfg: "" },
                { name: "Trapping rain water", difficulty: "Hard", leetcode: "https://leetcode.com/problems/trapping-rain-water/", gfg: "" },
                { name: "Maximal rectangle", difficulty: "Hard", leetcode: "https://leetcode.com/problems/maximal-rectangle/", gfg: "" }
            ]
        }
    },
    "QUEUES": {
        description: "FIFO (First-In-First-Out) - critical for BFS, scheduling, and stream processing",
        subtopics: {
            "Design & Basic": [
                { name: "Implement queue using stacks", difficulty: "Easy", leetcode: "https://leetcode.com/problems/implement-queue-using-stacks/", gfg: "" },
                { name: "Number of recent calls", difficulty: "Easy", leetcode: "https://leetcode.com/problems/number-of-recent-calls/", gfg: "" },
                { name: "Design circular queue", difficulty: "Medium", leetcode: "https://leetcode.com/problems/design-circular-queue/", gfg: "" }
            ],
            "Deque (Double-Ended Queue)": [
                { name: "Sliding window maximum", difficulty: "Hard", leetcode: "https://leetcode.com/problems/sliding-window-maximum/", gfg: "" },
                { name: "Longest continuous subarray with absolute diff", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/", gfg: "" }
            ],
            "Advanced": [
                { name: "Decode string", difficulty: "Medium", leetcode: "https://leetcode.com/problems/decode-string/", gfg: "" },
                { name: "DOTA2 Senate", difficulty: "Medium", leetcode: "https://leetcode.com/problems/predict-party-victory/", gfg: "" },
                { name: "Simplify path", difficulty: "Medium", leetcode: "https://leetcode.com/problems/simplify-path/", gfg: "" }
            ]
        }
    },
    "BINARY TREES": {
        description: "Trees are recursive structures - master them for 50% of coding interviews",
        subtopics: {
            "Traversal": [
                { name: "Inorder traversal", difficulty: "Easy", leetcode: "https://leetcode.com/problems/binary-tree-inorder-traversal/", gfg: "" },
                { name: "Preorder traversal", difficulty: "Easy", leetcode: "https://leetcode.com/problems/binary-tree-preorder-traversal/", gfg: "" },
                { name: "Postorder traversal", difficulty: "Easy", leetcode: "https://leetcode.com/problems/binary-tree-postorder-traversal/", gfg: "" },
                { name: "Level order traversal", difficulty: "Medium", leetcode: "https://leetcode.com/problems/binary-tree-level-order-traversal/", gfg: "" },
                { name: "Zigzag level order traversal", difficulty: "Medium", leetcode: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", gfg: "" },
                { name: "Vertical order traversal", difficulty: "Hard", leetcode: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/", gfg: "" }
            ],
            "Properties": [
                { name: "Symmetric tree", difficulty: "Easy", leetcode: "https://leetcode.com/problems/symmetric-tree/", gfg: "" },
                { name: "Invert binary tree", difficulty: "Easy", leetcode: "https://leetcode.com/problems/invert-binary-tree/", gfg: "" },
                { name: "Maximum depth", difficulty: "Easy", leetcode: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", gfg: "" },
                { name: "Balanced binary tree", difficulty: "Easy", leetcode: "https://leetcode.com/problems/balanced-binary-tree/", gfg: "" },
                { name: "Diameter of binary tree", difficulty: "Easy", leetcode: "https://leetcode.com/problems/diameter-of-binary-tree/", gfg: "" }
            ],
            "Views": [
                { name: "Right side view", difficulty: "Medium", leetcode: "https://leetcode.com/problems/binary-tree-right-side-view/", gfg: "" },
                { name: "Bottom view", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1" },
                { name: "Top view", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1" }
            ],
            "Path & Sum": [
                { name: "Path sum", difficulty: "Easy", leetcode: "https://leetcode.com/problems/path-sum/", gfg: "" },
                { name: "Path sum 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/path-sum-ii/", gfg: "" },
                { name: "Sum root to leaf", difficulty: "Medium", leetcode: "https://leetcode.com/problems/sum-root-to-leaf-numbers/", gfg: "" },
                { name: "Binary tree maximum path sum", difficulty: "Hard", leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", gfg: "" }
            ],
            "BST": [
                { name: "Search in BST", difficulty: "Easy", leetcode: "https://leetcode.com/problems/search-in-a-binary-search-tree/", gfg: "" },
                { name: "Validate BST", difficulty: "Medium", leetcode: "https://leetcode.com/problems/validate-binary-search-tree/", gfg: "" },
                { name: "Kth smallest in BST", difficulty: "Medium", leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", gfg: "" },
                { name: "Lowest common ancestor BST", difficulty: "Medium", leetcode: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", gfg: "" }
            ],
            "Construction": [
                { name: "Flatten binary tree to Linked List", difficulty: "Medium", leetcode: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/", gfg: "" },
                { name: "Construct from preorder and postorder", difficulty: "Medium", leetcode: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/", gfg: "" },
                { name: "Serialize and deserialize", difficulty: "Hard", leetcode: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", gfg: "" }
            ],
            "Advanced": [
                { name: "Lowest common ancestor", difficulty: "Medium", leetcode: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", gfg: "" },
                { name: "Unique binary search trees", difficulty: "Medium", leetcode: "https://leetcode.com/problems/unique-binary-search-trees/", gfg: "" },
                { name: "House robber 3", difficulty: "Medium", leetcode: "https://leetcode.com/problems/house-robber-iii/", gfg: "" },
                { name: "All possible full binary trees", difficulty: "Medium", leetcode: "https://leetcode.com/problems/all-possible-full-binary-trees/", gfg: "" },
                { name: "Binary tree cameras", difficulty: "Hard", leetcode: "https://leetcode.com/problems/binary-tree-cameras/", gfg: "" }
            ]
        }
    },
    "HEAPS & PRIORITY QUEUES": {
        description: "Get min/max in O(1) and maintain order in O(log n) - perfect for scheduling",
        subtopics: {
            "Top-K": [
                { name: "Kth largest element", difficulty: "Medium", leetcode: "https://leetcode.com/problems/kth-largest-element-in-an-array/", gfg: "" },
                { name: "Kth largest in stream", difficulty: "Easy", leetcode: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", gfg: "" },
                { name: "Top k frequent elements", difficulty: "Medium", leetcode: "https://leetcode.com/problems/top-k-frequent-elements/", gfg: "" },
                { name: "K closest points", difficulty: "Medium", leetcode: "https://leetcode.com/problems/k-closest-points-to-origin/", gfg: "" },
                { name: "Kth smallest in sorted matrix", difficulty: "Medium", leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/", gfg: "" }
            ],
            "Merge": [
                { name: "K pairs with smallest sums", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/", gfg: "" },
                { name: "Merge k sorted lists", difficulty: "Hard", leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/", gfg: "" }
            ],
            "Scheduling": [
                { name: "Meeting rooms 2", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/meeting-rooms-ii/1" },
                { name: "Task scheduler", difficulty: "Medium", leetcode: "https://leetcode.com/problems/task-scheduler/", gfg: "" },
                { name: "Single threaded cpu", difficulty: "Medium", leetcode: "https://leetcode.com/problems/single-threaded-cpu/", gfg: "" }
            ],
            "Greedy with Heap": [
                { name: "Reorganize string", difficulty: "Medium", leetcode: "https://leetcode.com/problems/reorganize-string/", gfg: "" },
                { name: "Furthest building", difficulty: "Medium", leetcode: "https://leetcode.com/problems/furthest-building-you-can-reach/", gfg: "" },
                { name: "Minimum cost to hire k workers", difficulty: "Hard", leetcode: "https://leetcode.com/problems/minimum-cost-to-hire-k-workers/", gfg: "" }
            ],
            "Dual Heap": [
                { name: "Find median from data stream", difficulty: "Hard", leetcode: "https://leetcode.com/problems/find-median-from-data-stream/", gfg: "" },
                { name: "Sliding window median", difficulty: "Hard", leetcode: "https://leetcode.com/problems/sliding-window-median/", gfg: "" }
            ],
            "Shortest Path": [
                { name: "Network delay time", difficulty: "Medium", leetcode: "https://leetcode.com/problems/network-delay-time/", gfg: "" },
                { name: "Path with minimum effort", difficulty: "Medium", leetcode: "https://leetcode.com/problems/path-with-minimum-effort/", gfg: "" },
                { name: "Cheapest flights within k stops", difficulty: "Medium", leetcode: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", gfg: "" },
                { name: "Swim in rising water", difficulty: "Hard", leetcode: "https://leetcode.com/problems/swim-in-rising-water/", gfg: "" }
            ]
        }
    },
    "BACKTRACKING": {
        description: "Brute force search technique for finding all solutions to a problem",
        subtopics: {
            "Subsets & Combinations": [
                { name: "Subsets", difficulty: "Medium", leetcode: "https://leetcode.com/problems/subsets/", gfg: "https://www.geeksforgeeks.org/problems/subsets-1613027340/1" },
                { name: "Combination sum", difficulty: "Medium", leetcode: "https://leetcode.com/problems/combination-sum/", gfg: "https://www.geeksforgeeks.org/problems/combination-sum-1587115620/1" },
                { name: "Subsets 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/subsets-ii/", gfg: "https://www.geeksforgeeks.org/problems/subsets-ii/1" },
                { name: "Combination sum 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/combination-sum-ii/", gfg: "https://www.geeksforgeeks.org/problems/combination-sum-ii-1664263532/1" }
            ],
            "Permutations": [
                { name: "Permutations", difficulty: "Medium", leetcode: "https://leetcode.com/problems/permutations/", gfg: "https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1" },
                { name: "Generate parentheses", difficulty: "Medium", leetcode: "https://leetcode.com/problems/generate-parentheses/", gfg: "https://www.geeksforgeeks.org/problems/generate-all-possible-parentheses/1" }
            ],
            "Advanced Backtracking": [
                { name: "Palindrome partitioning", difficulty: "Medium", leetcode: "https://leetcode.com/problems/palindrome-partitioning/", gfg: "https://www.geeksforgeeks.org/problems/find-all-possible-palindrome-partitions-of-a-string/1" },
                { name: "Word search", difficulty: "Medium", leetcode: "https://leetcode.com/problems/word-search/", gfg: "https://www.geeksforgeeks.org/problems/word-search/1" },
                { name: "N queens", difficulty: "Hard", leetcode: "https://leetcode.com/problems/n-queens/", gfg: "https://www.geeksforgeeks.org/problems/n-queen-problem0315/1" },
                { name: "Sudoku solver", difficulty: "Hard", leetcode: "https://leetcode.com/problems/sudoku-solver/", gfg: "https://www.geeksforgeeks.org/problems/solve-the-sudoku-1587115621/1" }
            ]
        }
    },

    "GRAPHS": {
        description: "Model real-world networks - social connections, maps, dependencies",
        subtopics: {
            "Traversal": [
                { name: "Flood fill", difficulty: "Easy", leetcode: "https://leetcode.com/problems/flood-fill/", gfg: "" },
                { name: "Number of islands", difficulty: "Medium", leetcode: "https://leetcode.com/problems/number-of-islands/", gfg: "" },
                { name: "Number of connected components", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/number-of-provinces/1" },
                { name: "Clone graph", difficulty: "Medium", leetcode: "https://leetcode.com/problems/clone-graph/", gfg: "" },
                { name: "Pacific atlantic water flow", difficulty: "Medium", leetcode: "https://leetcode.com/problems/pacific-atlantic-water-flow/", gfg: "" }
            ],
            "Cycle Detection": [
                { name: "Detect cycle undirected", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1" },
                { name: "Course schedule", difficulty: "Medium", leetcode: "https://leetcode.com/problems/course-schedule/", gfg: "" },
                { name: "Detect cycle directed", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1" },
                { name: "Redundant connection", difficulty: "Medium", leetcode: "https://leetcode.com/problems/redundant-connection/", gfg: "" }
            ],
            "Shortest Path": [
                { name: "Dijkstras algorithm", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1" },
                { name: "Rotting oranges", difficulty: "Medium", leetcode: "https://leetcode.com/problems/rotting-oranges/", gfg: "" },
                { name: "Shortest path in binary matrix", difficulty: "Medium", leetcode: "https://leetcode.com/problems/shortest-path-in-binary-matrix/", gfg: "" },
                { name: "01 matrix", difficulty: "Medium", leetcode: "https://leetcode.com/problems/01-matrix/", gfg: "" }
            ],
            "Dijkstra": [
                { name: "Network delay time", difficulty: "Medium", leetcode: "https://leetcode.com/problems/network-delay-time/", gfg: "" },
                { name: "Path with minimum effort", difficulty: "Medium", leetcode: "https://leetcode.com/problems/path-with-minimum-effort/", gfg: "" },
                { name: "Cheapest flights within k stops", difficulty: "Medium", leetcode: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", gfg: "" }
            ],
            "Topological Sort": [
                { name: "Course schedule 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/course-schedule-ii/", gfg: "" },
                { name: "Find eventual safe states", difficulty: "Medium", leetcode: "https://leetcode.com/problems/find-eventual-safe-states/", gfg: "" },
                { name: "Alien dictionary", difficulty: "Hard", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/alien-dictionary/1" }
            ],
            "Union Find": [
                { name: "Number of provinces", difficulty: "Medium", leetcode: "https://leetcode.com/problems/number-of-provinces/", gfg: "" },
                { name: "Graph valid tree", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/is-it-a-tree/1" },
                { name: "Accounts merge", difficulty: "Medium", leetcode: "https://leetcode.com/problems/accounts-merge/", gfg: "" },
                { name: "Number of islands 2", difficulty: "Hard", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/number-of-islands-ii/1" }
            ],
            "MST": [
                { name: "Min cost to connect all points", difficulty: "Medium", leetcode: "https://leetcode.com/problems/min-cost-to-connect-all-points/", gfg: "" },
                { name: "Find critical and pseudo critical edges", difficulty: "Hard", leetcode: "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/", gfg: "" }
            ],
            "Bipartite": [
                { name: "Is graph bipartite", difficulty: "Medium", leetcode: "https://leetcode.com/problems/is-graph-bipartite/", gfg: "" },
                { name: "Possible bipartition", difficulty: "Medium", leetcode: "https://leetcode.com/problems/possible-bipartition/", gfg: "" }
            ],
            "Advanced": [
                { name: "Critical connections", difficulty: "Hard", leetcode: "https://leetcode.com/problems/critical-connections-in-a-network/", gfg: "" },
                { name: "Longest path in dag", difficulty: "Hard", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/longest-path-in-a-directed-acyclic-graph/1" },
                { name: "Strongly connected components", difficulty: "Hard", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1" }
            ]
        }
    },
    "DYNAMIC PROGRAMMING": {
        description: "Optimize recursion with memoization - turn exponential into polynomial time",
        subtopics: {
            "1D DP": [
                { name: "Climbing stairs", difficulty: "Easy", leetcode: "https://leetcode.com/problems/climbing-stairs/", gfg: "" },
                { name: "Min cost climbing stairs", difficulty: "Easy", leetcode: "https://leetcode.com/problems/min-cost-climbing-stairs/", gfg: "" },
                { name: "House robber", difficulty: "Medium", leetcode: "https://leetcode.com/problems/house-robber/", gfg: "" },
                { name: "Maximum subarray", difficulty: "Medium", leetcode: "https://leetcode.com/problems/maximum-subarray/", gfg: "" },
                { name: "House robber 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/house-robber-ii/", gfg: "" },
                { name: "Jump game", difficulty: "Medium", leetcode: "https://leetcode.com/problems/jump-game/", gfg: "" },
                { name: "Decode ways", difficulty: "Medium", leetcode: "https://leetcode.com/problems/decode-ways/", gfg: "" },
                { name: "Word break", difficulty: "Medium", leetcode: "https://leetcode.com/problems/word-break/", gfg: "" }
            ],
            "2D DP": [
                { name: "Unique paths", difficulty: "Medium", leetcode: "https://leetcode.com/problems/unique-paths/", gfg: "" },
                { name: "Unique paths 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/unique-paths-ii/", gfg: "" },
                { name: "Min path sum", difficulty: "Medium", leetcode: "https://leetcode.com/problems/minimum-path-sum/", gfg: "" },
                { name: "Triangle", difficulty: "Medium", leetcode: "https://leetcode.com/problems/triangle/", gfg: "" },
                { name: "Dungeon game", difficulty: "Hard", leetcode: "https://leetcode.com/problems/dungeon-game/", gfg: "" },
                { name: "Cherry pickup", difficulty: "Hard", leetcode: "https://leetcode.com/problems/cherry-pickup/", gfg: "" }
            ],
            "Knapsack": [
                { name: "Coin change 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/coin-change-ii/", gfg: "" },
                { name: "Coin change", difficulty: "Medium", leetcode: "https://leetcode.com/problems/coin-change/", gfg: "" },
                { name: "Subset sum", difficulty: "Medium", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1" },
                { name: "Target sum", difficulty: "Medium", leetcode: "https://leetcode.com/problems/target-sum/", gfg: "" },
                { name: "Partition equal subset sum", difficulty: "Medium", leetcode: "https://leetcode.com/problems/partition-equal-subset-sum/", gfg: "" }
            ],
            "Sequence DP": [
                { name: "Longest common subsequence", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-common-subsequence/", gfg: "" },
                { name: "Longest palindromic subsequence", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-palindromic-subsequence/", gfg: "" },
                { name: "Longest increasing subsequence", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-increasing-subsequence/", gfg: "" },
                { name: "Largest divisible subset", difficulty: "Medium", leetcode: "https://leetcode.com/problems/largest-divisible-subset/", gfg: "" },
                { name: "Edit distance", difficulty: "Hard", leetcode: "https://leetcode.com/problems/edit-distance/", gfg: "" },
                { name: "Distinct subsequences", difficulty: "Hard", leetcode: "https://leetcode.com/problems/distinct-subsequences/", gfg: "" },
                { name: "Shortest common supersequence", difficulty: "Hard", leetcode: "https://leetcode.com/problems/shortest-common-supersequence/", gfg: "" }
            ],
            "Interval DP": [
                { name: "Min cost to cut stick", difficulty: "Hard", leetcode: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/", gfg: "" },
                { name: "Palindrome partitioning 2", difficulty: "Hard", leetcode: "https://leetcode.com/problems/palindrome-partitioning-ii/", gfg: "" },
                { name: "Burst balloons", difficulty: "Hard", leetcode: "https://leetcode.com/problems/burst-balloons/", gfg: "" },
                { name: "Matrix chain multiplication", difficulty: "Hard", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1" }
            ],
            "Tree DP": [
                { name: "Unique binary search trees", difficulty: "Medium", leetcode: "https://leetcode.com/problems/unique-binary-search-trees/", gfg: "" },
                { name: "House robber 3", difficulty: "Medium", leetcode: "https://leetcode.com/problems/house-robber-iii/", gfg: "" },
                { name: "Binary tree max path sum", difficulty: "Hard", leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", gfg: "" },
                { name: "Binary tree cameras", difficulty: "Hard", leetcode: "https://leetcode.com/problems/binary-tree-cameras/", gfg: "" }
            ],
            "State Compression": [
                { name: "Partition to k equal sum subsets", difficulty: "Medium", leetcode: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/", gfg: "" },
                { name: "Shortest path visiting all nodes", difficulty: "Hard", leetcode: "https://leetcode.com/problems/shortest-path-visiting-all-nodes/", gfg: "" },
                { name: "Travelling salesman problem", difficulty: "Hard", leetcode: "", gfg: "https://www.geeksforgeeks.org/problems/travelling-salesman-problem2732/1" }
            ],
            "Advanced DP": [
                { name: "Longest increasing path in matrix", difficulty: "Hard", leetcode: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/", gfg: "" },
                { name: "Wildcard matching", difficulty: "Hard", leetcode: "https://leetcode.com/problems/wildcard-matching/", gfg: "" },
                { name: "Regular expression matching", difficulty: "Hard", leetcode: "https://leetcode.com/problems/regular-expression-matching/", gfg: "" },
                { name: "Russian doll envelopes", difficulty: "Hard", leetcode: "https://leetcode.com/problems/russian-doll-envelopes/", gfg: "" },
                { name: "Maximum profit in job scheduling", difficulty: "Hard", leetcode: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/", gfg: "" }
            ]
        }
    },
    "TRIES": {
        description: "Prefix trees for efficient string storage and autocomplete - O(L) operations",
        subtopics: {
            "Basic & Search": [
                { name: "Implement trie", difficulty: "Medium", leetcode: "https://leetcode.com/problems/implement-trie-prefix-tree/", gfg: "" },
                { name: "Design add and search words", difficulty: "Medium", leetcode: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", gfg: "" },
                { name: "Replace words", difficulty: "Medium", leetcode: "https://leetcode.com/problems/replace-words/", gfg: "" },
                { name: "Longest word in dictionary", difficulty: "Medium", leetcode: "https://leetcode.com/problems/longest-word-in-dictionary/", gfg: "" },
                { name: "Search suggestions system", difficulty: "Medium", leetcode: "https://leetcode.com/problems/search-suggestions-system/", gfg: "" },
                { name: "Word search 2", difficulty: "Hard", leetcode: "https://leetcode.com/problems/word-search-ii/", gfg: "" }
            ],
            "Advanced": [
                { name: "Maximum xor of two numbers", difficulty: "Medium", leetcode: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/", gfg: "" },
                { name: "Palindrome pairs", difficulty: "Hard", leetcode: "https://leetcode.com/problems/palindrome-pairs/", gfg: "" }
            ]
        }
    },
    "GREEDY": {
        description: "Make locally optimal choices for global optimum - prove correctness carefully",
        subtopics: {
            "Basic & Intervals": [
                { name: "Assign cookies", difficulty: "Easy", leetcode: "https://leetcode.com/problems/assign-cookies/", gfg: "" },
                { name: "Lemonade change", difficulty: "Easy", leetcode: "https://leetcode.com/problems/lemonade-change/", gfg: "" },
                { name: "Jump game", difficulty: "Medium", leetcode: "https://leetcode.com/problems/jump-game/", gfg: "" },
                { name: "Non-overlapping intervals", difficulty: "Medium", leetcode: "https://leetcode.com/problems/non-overlapping-intervals/", gfg: "" },
                { name: "Minimum arrows to burst balloons", difficulty: "Medium", leetcode: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/", gfg: "" }
            ],
            "Array Greedy": [
                { name: "Jump game 2", difficulty: "Medium", leetcode: "https://leetcode.com/problems/jump-game-ii/", gfg: "" },
                { name: "Partition labels", difficulty: "Medium", leetcode: "https://leetcode.com/problems/partition-labels/", gfg: "" },
                { name: "Gas station", difficulty: "Medium", leetcode: "https://leetcode.com/problems/gas-station/", gfg: "" },
                { name: "Candy", difficulty: "Hard", leetcode: "https://leetcode.com/problems/candy/", gfg: "" }
            ],
            "Advanced": [
                { name: "Task scheduler", difficulty: "Medium", leetcode: "https://leetcode.com/problems/task-scheduler/", gfg: "" },
                { name: "Queue reconstruction by height", difficulty: "Medium", leetcode: "https://leetcode.com/problems/queue-reconstruction-by-height/", gfg: "" },
                { name: "Course schedule 3", difficulty: "Hard", leetcode: "https://leetcode.com/problems/course-schedule-iii/", gfg: "" },
                { name: "Maximum profit in job scheduling", difficulty: "Hard", leetcode: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/", gfg: "" },
                { name: "Minimum refueling stops", difficulty: "Hard", leetcode: "https://leetcode.com/problems/minimum-number-of-refueling-stops/", gfg: "" }
            ]
        }
    }
};

function PracticeSheet() {
    const [progress, setProgress] = createSignal({});

    onMount(() => {
        const savedProgress = localStorage.getItem('practice_progress');
        if (savedProgress) setProgress(JSON.parse(savedProgress));
    });

    const toggleProblem = (topic, problemName) => {
        const key = `${topic}::${problemName}`;
        const current = { ...progress() };

        current[key] = !current[key];
        setProgress(current);
        localStorage.setItem('practice_progress', JSON.stringify(current));
    };

    const isSolved = (topic, problemName) => progress()[`${topic}::${problemName}`] || false;

    const getTopicProblems = (topicKey) => {
        const data = practiceData[topicKey];
        if (data.problems) return data.problems;
        if (data.subtopics) {
            return Object.values(data.subtopics).flat();
        }
        return [];
    };

    const stats = createMemo(() => {
        let total = 0, solved = 0;
        let easyT = 0, medT = 0, hardT = 0, easyS = 0, medS = 0, hardS = 0;

        Object.keys(practiceData).forEach((topic) => {
            getTopicProblems(topic).forEach(p => {
                total++;
                const isS = isSolved(topic, p.name);
                if (isS) solved++;
                if (p.difficulty === 'Easy') { easyT++; if (isS) easyS++; }
                else if (p.difficulty === 'Medium') { medT++; if (isS) medS++; }
                else if (p.difficulty === 'Hard') { hardT++; if (isS) hardS++; }
            });
        });
        return { total, solved, easyT: Math.max(easyT, 1), medT: Math.max(medT, 1), hardT: Math.max(hardT, 1), easyS, medS, hardS };
    });

    return (
        <div class="roadmap-v5-container">
            <header class="v6-mission-control">
                <div class="v6-dash-inner">
                    {/* Progress Section */}
                    <div class="v6-segment main-progress">
                        <div class="v6-meta">
                            <span class="v6-lbl">DSA PROGRESS</span>
                            <span class="v6-pct-val">{Math.round((stats().solved / stats().total) * 100)}%</span>
                        </div>
                        <div class="v6-progress-track">
                            <div class="v6-progress-bar" style={`width: ${Math.round((stats().solved / stats().total) * 100)}%`}>
                                <div class="v6-bar-glow"></div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Buckets */}
                    <div class="v6-segment stats-hub">
                        <div class="v6-stat-tile easy">
                            <span class="v6-s-val">{stats().easyS}<span>/{stats().easyT}</span></span>
                            <label>EASY</label>
                        </div>
                        <div class="v6-stat-tile medium">
                            <span class="v6-s-val">{stats().medS}<span>/{stats().medT}</span></span>
                            <label>MEDIUM</label>
                        </div>
                        <div class="v6-stat-tile hard">
                            <span class="v6-s-val">{stats().hardS}<span>/{stats().hardT}</span></span>
                            <label>HARD</label>
                        </div>
                    </div>

                </div>
            </header>

            <main class="v5-content-feed">
                <For each={Object.keys(practiceData)}>
                    {(topic) => {
                        const data = practiceData[topic];

                        return (
                            <section class="v5-topic-section">
                                <div class="v5-topic-meta">
                                    <h2 class="v5-topic-title">{topic}</h2>
                                    <p class="v5-topic-description">{data.description}</p>
                                </div>

                                <Show when={data.subtopics} fallback={
                                    <div class="v5-list">
                                        <For each={data.problems || []}>
                                            {(p) => {
                                                return <ProblemRow p={p} topic={topic} solved={isSolved(topic, p.name)} toggle={() => toggleProblem(topic, p.name)} />;
                                            }}
                                        </For>
                                    </div>
                                }>
                                    <For each={Object.entries(data.subtopics)}>
                                        {([subName, subProbs]) => {
                                            const filtered = subProbs;

                                            return (
                                                <div class="v5-subtopic-block">
                                                    <h4 class="v5-subtopic-name">{subName}</h4>
                                                    <div class="v5-list">
                                                        <For each={filtered}>
                                                            {(p) => <ProblemRow p={p} topic={topic} solved={isSolved(topic, p.name)} toggle={() => toggleProblem(topic, p.name)} />}
                                                        </For>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </For>
                                </Show>
                            </section>
                        );
                    }}
                </For>
            </main>
        </div>
    );
}

function ProblemRow(props) {
    return (
        <div class={`v5-item-row ${props.solved ? 'is-solved' : ''}`}>
            <div class="v5-cell status">
                <button class="v5-modern-checkbox" onClick={props.toggle}>
                    <div class={`v5-box ${props.solved ? 'checked' : ''}`}>
                        <Show when={props.solved}>
                            <ion-icon name="checkmark-sharp"></ion-icon>
                        </Show>
                    </div>
                </button>
            </div>

            <div class="v5-cell content">
                <span class="v5-p-name">{props.p.name}</span>
                <span class={`v5-difficulty-mini ${props.p.difficulty?.toLowerCase() || 'medium'}`}>
                    {props.p.difficulty || 'Medium'}
                </span>
            </div>

            <div class="v5-cell links">
                <Show when={props.p.gfg}>
                    <a href={props.p.gfg} target="_blank" class="v5-platform-link gfg">GFG</a>
                </Show>
                <Show when={props.p.leetcode}>
                    <a href={props.p.leetcode} target="_blank" class="v5-platform-link lc">LeetCode</a>
                </Show>
                <Show when={props.p.codeforces}>
                    <a href={props.p.codeforces} target="_blank" class="v5-platform-link cf">CodeForces</a>
                </Show>
            </div>
        </div>
    );
}

export default PracticeSheet;
