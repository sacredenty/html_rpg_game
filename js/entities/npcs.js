// Npcs
Object.assign(Entities, {
    NPCs: {
        villager: {
            name: 'Villager',
            dialogue: "Hello traveler! Welcome to this land.",
            questGiver: false
        },
        king: {
            name: 'King Alaric',
            dialogue: "My people need your help, brave hero!",
            questGiver: true,
            mainQuest: true
        },
        merchant: {
            name: 'Merchant',
            dialogue: "Items for sale! Check my wares!",
            questGiver: false,
            hasShop: true
        }
    },

    // Create NPC instance

    createNPC: (type, x, y) => {
        const template = Entities.NPCs[type];
        return {
            id: Utils.generateId(),
            type: type,
            name: template.name,
            dialogue: template.dialogue,
            questGiver: template.questGiver,
            mainQuest: template.mainQuest,
            hasShop: template.hasShop,
            x: x,
            y: y,
            alive: true
        };
    },

});
