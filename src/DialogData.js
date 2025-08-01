// Dialog data structure - easy to edit and modify
// Each dialog has an npcName and nodes object
// Each node has text and optional responses array
// Each response has text, optional nextNode, and optional action function

const doorGuardDialog = {
  npcName: "Door Guard",
  nodes: {
    start: {
      text: "Halt! Who goes there? This door is under my protection.",
      responses: [
        {
          text: "I'm just trying to get through.",
          nextNode: "explain"
        },
        {
          text: "I have business beyond this door.",
          nextNode: "business"
        },
        {
          text: "Sorry, I'll leave you alone.",
          nextNode: "goodbye"
        }
      ]
    },
    
    explain: {
      text: "Hmm, you seem harmless enough. But I still can't let you pass without proper authorization.",
      responses: [
        {
          text: "What kind of authorization do you need?",
          nextNode: "authorization"
        },
        {
          text: "Can't you make an exception?",
          nextNode: "exception"
        },
        {
          text: "Fine, I'll find another way.",
          nextNode: "goodbye"
        }
      ]
    },
    
    business: {
      text: "Business, you say? What sort of business could you possibly have?",
      responses: [
        {
          text: "It's... personal business.",
          nextNode: "personal"
        },
        {
          text: "I'm on an important quest!",
          nextNode: "quest"
        },
        {
          text: "Never mind, it's not that important.",
          nextNode: "goodbye"
        }
      ]
    },
    
    authorization: {
      text: "You need a special key or a written pass from the authorities. Do you have either?",
      responses: [
        {
          text: "I don't have anything like that.",
          nextNode: "no_auth"
        },
        {
          text: "Let me check my inventory...",
          nextNode: "check_inventory"
        }
      ]
    },
    
    exception: {
      text: "Rules are rules, I'm afraid. I can't make exceptions, even for someone as polite as you.",
      responses: [
        {
          text: "I understand. What would I need to pass?",
          nextNode: "authorization"
        },
        {
          text: "Alright, I'll come back later.",
          nextNode: "goodbye"
        }
      ]
    },
    
    personal: {
      text: "Personal business, eh? Well, that's still not enough to let you through. Sorry!",
      responses: [
        {
          text: "What if I told you it was urgent?",
          nextNode: "urgent"
        },
        {
          text: "I see. Thanks anyway.",
          nextNode: "goodbye"
        }
      ]
    },
    
    quest: {
      text: "A quest! How exciting! But even heroes need proper documentation these days.",
      responses: [
        {
          text: "What kind of documentation?",
          nextNode: "authorization"
        },
        {
          text: "This is ridiculous!",
          nextNode: "angry"
        }
      ]
    },
    
    no_auth: {
      text: "Then I'm afraid you'll have to find another way, or come back when you have the proper credentials.",
      responses: [
        {
          text: "Where can I get these credentials?",
          nextNode: "where_credentials"
        },
        {
          text: "Okay, I'll figure something out.",
          nextNode: "goodbye"
        }
      ]
    },
    
    check_inventory: {
      text: "Well? Do you have anything that might work as authorization?",
      responses: [
        {
          text: "I don't think so...",
          nextNode: "no_auth"
        },
        {
          text: "Maybe this will work?",
          nextNode: "try_item"
        }
      ]
    },
    
    urgent: {
      text: "Urgent or not, I have my orders. No one passes without authorization!",
      responses: [
        {
          text: "Your orders come from who exactly?",
          nextNode: "orders"
        },
        {
          text: "Fine, I give up.",
          nextNode: "goodbye"
        }
      ]
    },
    
    angry: {
      text: "Hey now, no need to get upset! I'm just doing my job here.",
      responses: [
        {
          text: "Sorry, I'm just frustrated.",
          nextNode: "apologize"
        },
        {
          text: "Your job is stupid!",
          nextNode: "insult"
        }
      ]
    },
    
    where_credentials: {
      text: "You'd need to visit the Town Hall or find someone with authority to write you a pass.",
      responses: [
        {
          text: "Thanks for the information.",
          nextNode: "goodbye"
        }
      ]
    },
    
    try_item: {
      text: "Hmm, let me see... No, I'm afraid that won't do. Nice try though!",
      responses: [
        {
          text: "Worth a shot.",
          nextNode: "goodbye"
        }
      ]
    },
    
    orders: {
      text: "The Mayor himself gave me these orders! No one gets through without proper documentation.",
      responses: [
        {
          text: "The Mayor, huh? Interesting...",
          nextNode: "goodbye"
        }
      ]
    },
    
    apologize: {
      text: "No worries, I understand. This job can be frustrating for everyone involved.",
      responses: [
        {
          text: "Thanks for being understanding.",
          nextNode: "goodbye"
        }
      ]
    },
    
    insult: {
      text: "Well, that's just rude! I'm definitely not letting you through now!",
      responses: [
        {
          text: "Wait, I'm sorry!",
          nextNode: "apologize"
        }
      ]
    },
    
    goodbye: {
      text: "Farewell, traveler. Come back when you have the proper authorization!"
      // No responses - dialog will end
    }
  }
};

// You can easily add more dialogs here
const friendlyNPCDialog = {
  npcName: "Friendly Villager",
  nodes: {
    start: {
      text: "Hello there! Beautiful day, isn't it?",
      responses: [
        {
          text: "Yes, it's lovely!",
          nextNode: "agree"
        },
        {
          text: "I suppose so.",
          nextNode: "neutral"
        },
        {
          text: "I'm in a hurry.",
          nextNode: "goodbye"
        }
      ]
    },
    
    agree: {
      text: "I'm so glad you think so! I love meeting positive people.",
      responses: [
        {
          text: "Thanks! Have a great day!",
          nextNode: "goodbye"
        }
      ]
    },
    
    neutral: {
      text: "Well, I hope your day gets better!",
      responses: [
        {
          text: "Thanks, you too.",
          nextNode: "goodbye"
        }
      ]
    },
    
    goodbye: {
      text: "Take care!"
    }
  }
};

export { doorGuardDialog, friendlyNPCDialog };
