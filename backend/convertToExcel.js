const XLSX = require('xlsx'); 
const sqlite3 = require('sqlite3').verbose(); // verbose is from SQLite libary, helps debug
const fs = require('fs'); // for file creation

async function convertToExcel() {
    // TODO make the fetch a function asynchronous
    async function fetchDB() {
        try {
            const resp = await fetch('http://localhost:3001/orders');
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await resp.json();
            console.log('db rows grabbed', data);
            return data;
        } catch (error) {
            console.error('Error fetching database data:', error);
        }
    }

    //  2) get all orders that are new from db
    const dbData = await fetchDB();
    const orders = [];
    dbData.orders.forEach(orderRow => orders.push(orderRow));
    const newOrders = orders.filter(order => order.status === 'new');
    console.log(newOrders);

    // add the orderName to each item object
    newOrders.forEach(order => {
        const items = JSON.parse(order.data);
        items.forEach(item => item.orderName = order.orderName);
        order.data = JSON.stringify(items);
    })

    console.log("NEW ORDERS", newOrders)
    
    //  3) sort items into categories for excel sheets/print templates
    const nameTagItems = newOrders.flatMap(order => {
        const items = JSON.parse(order.data);
        const nameTags = items.filter(item => item.item_type === 'Name Tag');
        return nameTags;
    })
    console.log("NAME TAGS", nameTagItems);

    const regularNameTags = nameTagItems.filter(nameTag => {
        return (
            (nameTag.first_name && nameTag.last_name && !nameTag.pronouns) ||
            (nameTag.first_name && !nameTag.last_name && nameTag.pronouns) ||
            (!nameTag.first_name && nameTag.last_name && nameTag.pronouns)
        );
    });

    regularNameTags.forEach(nameTag => {
        nameTag.first_name = trim(nameTag.first_name + nameTag.last_name);
        nameTag.last_name = trim(nameTag.last_name + nameTag.pronouns);
    })

    const singleNameTags = nameTagItems.filter(nameTag => {
        if (!nameTag.last_name && !nameTag.pronouns) {
            return nameTag;
        }
    })

    const pronounNameTags = nameTagItems.filter(nameTag => {
        if (nameTag.first_name && nameTag.last_name && nameTag.pronouns) {
            return nameTag;
        }
    })

    const doorDeskStickers = newOrders.flatMap(order => {
        const items = JSON.parse(order.data);
        const stickers = items.filter(item => item.item_type && item.item_type !== 'Name Tag');
        return stickers;
    })
    
    console.log("REGULAR TAGS", regularNameTags);
    console.log("SINGLE NAME TAGS", singleNameTags);
    console.log("PRONOUN TAGS", pronounNameTags);
    console.log("doorDeskStickers", doorDeskStickers);
    



    //  4) change all orders added status to 'in progress'
    // TODO LATER
}

convertToExcel();



