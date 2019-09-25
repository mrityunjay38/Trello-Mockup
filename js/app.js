// API Key-Token Setup

const boardId = 'T1fvjj3w';
const apiKey = '4889527730924708de702aa5a0633ee7';
const secretToken = '9ecc207787dc2989a558d492d51d8b5df086937e33319a89d54f3a9907a43558';

// Fetch lists from board

const fetchBoardList = async (board, key, token) => {
    try {
    const list = await fetch(`https://api.trello.com/1/boards/${board}/lists?cards=none&card_fields=all&filter=open&fields=all&key=${key}&token=${token}`);
    const listJson = await list.json();
    return listJson[0].id;
    }
    catch (err) {
        console.log("Failed to fetch list...");
        console.log(err);
    }
}


// Fetch cards inside list

const fetchCards = async (listId, key, token) => {

    try {
        const checklists = await fetch (`https://api.trello.com/1/lists/${listId}/cards?fields=id&key=${key}&token=${token}`);
        const checklistsJson = checklists.json();
        return checklistsJson;
    }
    catch (err) {
        console.log('Failed to fetch checklists...');
        console.log(err);
    }

}


// Fetch Checklists

const fetchChecklists = (listCards, key, token) => {
  
    try {

        const checklists = listCards.map( async card => {
            const listChecklists = await fetch(`https://api.trello.com/1/cards/${card.id}/checklists?key=${key}&token=${token}`);
            let listChecklistsJson = await listChecklists.json();
            return listChecklistsJson[0];
        });

        return Promise.all(checklists);
        
    }
    catch (err) {
        console.log('Failed to fetch checklists item ids...');
        console.log(err);
    }

}


// Display checklist items

const displayChecklistItems = (checklistItemDetails) => {

    try {
        checklistItemDetails.forEach( (checklistItem,i) => {
            if(checklistItem.state == 'incomplete'){
                $('.checklist-items').append(
                    $(`<li id="${i}" state="${checklistItem.state}"><span class="checkbox"/>${checklistItem.name}<span class="cross">\u00D7</span></li>`)
                );    
            }
            else{
                $('.checklist-items').append(
                    $(`<li id="${i}" class="strike" state="${checklistItem.state}"><span class="checkbox">&#10003;</span>${checklistItem.name}<span class="cross">\u00D7</span></li>`)
                );    
            }
        });
    }
    catch (err) {
        console.log('Failed to display checklists items...');
        console.log(err);
    }
    
} 

const fetchlistItemDetails = (checklistItemDetails) => {
   
    const result = checklistItemDetails.reduce( (acc,checklistItem) => {

        let idCard = checklistItem.idCard;

        checklistItem.checkItems.forEach( checkItem => {
            let createNewObj = {};
            createNewObj = checkItem;
            createNewObj["idCard"] = idCard;
            acc.push(createNewObj);
        } );

        return acc;
    },[]);

    return result;

}


// Delete items event listener

const onClickEventListener = async (checklistItemDetails, key, token) => {

    // Adds new checklist item

    $('form').submit( async e => {
        e.preventDefault();

        let value = $('input').val();
        $('input').val('');
        console.log(value);
        try {
            await fetch(`https://api.trello.com/1/checklists/${checklistItemDetails[0].idChecklist}/checkItems?name=${value}&pos=bottom&checked=false&key=${key}&token=${token}`,{method : 'POST'});
        
            $('.checklist-items').append(
                $(`<li id="${$('ul li').length}" state="incomplete"><span class="checkbox"/>${value}<span class="cross">\u00D7</span></li>`)
            );

            const result = await fetchAndDisplayChecklists(boardId, apiKey, secretToken);
            onClickEventListener(result,key, token);

        }
        catch (err) {
            console.log('Failed to add new checklist item...');
            console.log(err);
        }

    });

    // Removes checklist item

    $('.cross').click(async function () {
        let id = $(this).parent().attr('id');
        // console.log("id = " + id);
        try {
            await fetch(`https://api.trello.com/1/checklists/${checklistItemDetails[id].idChecklist}/checkItems/${checklistItemDetails[id].id}?key=${key}&token=${token}`,{method: 'DELETE'});
            $(this).parent().remove();
        }
        catch (err) {
            console.log('Failed to delete checklists item...');
            console.log(err);
        }
    })


    // Add strike on when checked

    $('.checkbox').click(async function () {
        let id = $(this).parent().attr('id');
        let state = $(this).parent().attr('state');
        console.log(id);
        console.log(state);

        if(state == 'complete'){
            try {
                await fetch(`https://api.trello.com/1/cards/${checklistItemDetails[id].idCard}/checkItem/${checklistItemDetails[id].id}?state=incomplete&key=${key}&token=${token}`,{method: 'PUT'});
                $(this).html('');
                $(this).parent().removeClass('strike');
                $(this).parent().attr('state','incomplete');
            }
            catch (err) {
                console.log('Failed to delete checklists item...');
                console.log(err);
            }
        }
        else{
        
        try {
            await fetch(`https://api.trello.com/1/cards/${checklistItemDetails[id].idCard}/checkItem/${checklistItemDetails[id].id}?state=complete&key=${key}&token=${token}`,{method: 'PUT'});
            $(this).html('&#10003;');
            $(this).parent().attr({'class':'strike','state':'complete'});
        }
        catch (err) {
            console.log('Failed to delete checklists item...');
            console.log(err);
        }

    } 
     
    })

}


// Fetch and display todo

const fetchAndDisplayChecklists = async (board, key, token) => {

    const list = await fetchBoardList(board, key, token);
    const listCards = await fetchCards(list, key, token);
    const listChecklists = await fetchChecklists(listCards, key, token);
    const checklistItemDetails = await fetchlistItemDetails(listChecklists);

    return checklistItemDetails;

}


// Trigger todo function

const displayAll = async () => {

    const result = await fetchAndDisplayChecklists(boardId, apiKey, secretToken);

    displayChecklistItems(result);
    onClickEventListener(result, apiKey, secretToken);
}

displayAll();
