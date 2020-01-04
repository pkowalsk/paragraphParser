function formatParagraph (paragraph) {
	// get array of words seperated by space for word array
	let wordPara = paragraph.replace(/[.]/g,'');

	// remove "a", "the", "and", "of", "in", "be", "also" and "as"
	wordPara = wordPara.replace(/\ba\b/g, '');
	wordPara = wordPara.replace(/\bthe\b/g, '');
	wordPara = wordPara.replace(/\band\b/g, '');
	wordPara = wordPara.replace(/\bof\b/g, '');
	wordPara = wordPara.replace(/\bin\b/g, '');
	wordPara = wordPara.replace(/\bbe\b/g, '');
	wordPara = wordPara.replace(/\balso\b/g, '');
	wordPara = wordPara.replace(/\bas\b/g, '');

	// remove left over extra spaces
	wordPara = wordPara.replace(/\s{2,}/g," ");

	return wordPara;
};

function handleStemWords (wordSet) {
	// treat pluralized words (ie: 'dish','dishes') as the same word. do this by replacing words with endings of 's' or 'es' as the same as those without those endings
	// loop over word array and compare each element to the array, with an index occurring after the selected index (to avoid repetition)
	//wordPara = wordPara.replace(/([a-zA-Z]+?)(s )/g, '$1 ');
	for(let i = 0; i < wordSet.length; i++){
		let stem = wordSet[i]; // set the word stem equal to the element

		for(var x = i+1; x < wordSet.length; x++){
			if( stem === wordSet[x].slice(0,stem.length) // check if the current element has a stem of the selected word
				&& (
					( wordSet[x].slice(wordSet[x].length-1) == 's' && wordSet[x].length == stem.length + 1) // check if last character is s and element is only 1 char longer 
					|| (wordSet[x].slice(wordSet[x].length-2) == 'es' && wordSet[x].length == stem.length + 2) // check if last character is es and element is only 2 char longer
					|| (wordSet[x].slice(wordSet[x].length-2) == 'ed' && wordSet[x].length == stem.length + 2) // check if last character is ed and element is only 2 char longer
					|| (wordSet[x].slice(wordSet[x].length-3) == 'ing' && wordSet[x].length == stem.length + 3) // check if last character is ing and element is only 3 char longer
				) 
			){
				wordSet[x] = stem;
			}
		}
	}

	return wordSet;
};

function getWordCount (wordSet) {
	let curWord = '',
		count = 0,
		curWordObj = {},
		wordArray = [];

	// loop over words and get count of duplicates
	for(let i=0; i < wordSet.length; i++){
		if (curWord !== wordSet[i]){
			curWord = wordSet[i];
			count = 1;
			curWordObj = {'word': curWord, 'total-occurences': 1};
			wordArray.push(curWordObj);
		} else {
			count++;
			wordArray[wordArray.length - 1]['total-occurences'] = count;
		}
	}

	return wordArray;
};

function getSentencePosition (wordArray, sentenceArray) {
	// loop through words and get positions in the sentences
	for(var i=0; i < wordArray.length; i++){
		let sentPos = []; // array for found sentence indexes

		for(var x=0; x < sentenceArray.length; x++){
			if(sentenceArray[x].indexOf( wordArray[i].word ) > -1) {
				sentPos.push(x);
			}
		}
		wordArray[i]['sentence-indexes'] = sentPos;
	}

	return wordArray;
};

// convert to lowercase to avoid words like 'cat' and 'Cat' from showing up twice
function parseParagraph(paragraph) {
  paragraph = paragraph.toLowerCase();

  // remove punctuation from paragraph. exclude period to get sentence array
  paragraph = paragraph.replace(/[,\/#!$%\^&\*;:{}=\-_`~()"]/g,'');

  // create array of sentences
  let aSentences = paragraph.split(".");

  let wordPara = formatParagraph(paragraph);

  // create array of words
  let wordSet = wordPara.split(" ");

  // create alphabetized array of words
  wordSet = wordSet.sort();

  // handle words with the same stem
  wordSet = handleStemWords(wordSet);

  // get counts of words
  let wordArray = getWordCount(wordSet);
    

  // get position of words in sentences
  wordArray = getSentencePosition(wordArray, aSentences);

  const result = { results: wordArray };

  return JSON.stringify(result, 0, 2);
}

const paragraph = 'Take this paragraph of text and return an alphabetized list of ALL unique words. A unique word is any form of a word often communicated with essentially the same meaning. For example, dish and dishes could be defined as a unique word by using their stem dish. For each unique word found in this entire paragraph, determine the how many times the word appears in total. Also, provide an analysis of what sentence index position or positions the word is found. The following words should not be included in your analysis or result set: "a", "the", "and", "of", "in", "be", "also" and "as"! Your final result MUST be displayed in a readable console output in the same format as the JSON sample object shown below.';
console.log(parseParagraph(paragraph));
