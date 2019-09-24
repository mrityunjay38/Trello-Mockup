// API Key-Token Setup

const boardId = 'T1fvjj3w';
const apiKey = '4889527730924708de702aa5a0633ee7';
const secretToken = '9ecc207787dc2989a558d492d51d8b5df086937e33319a89d54f3a9907a43558';

// Get lists from board

const getLists = async (board, key, token) => {
    try {

    const lists = await fetch(`https://api.trello.com/1/boards/${board}/lists?cards=none&card_fields=all&filter=open&fields=all&key=${key}&token=${token}`);
    const listsJson = await lists.json();
    console.log(listsJson[0].id);
    return listsJson.id;

    }
    catch(err){
        console.log("Failed to fetch list...");
        console.log(err);
    }
}

getLists(boardId,apiKey,secretToken);




// Setup Todo function

const callTodo = (board, key, token) => {

}


// Trigger todo function

callTodo(boardId, apiKey, secretToken);