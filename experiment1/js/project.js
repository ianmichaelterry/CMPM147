const fillers = {
  adverb: ["probably", "really", "certainly", "arguably", "decidedly"],
  verb: ["aggravate", "fornicate with", "commit arson with", "browse the dark web with", "murder", "defecate into the shoes of", "argue vehemetly with", "smoke salvia with", "defenestrate"],
  subject: ["your mother", "the police", "your boss", "the Malaysian Prime Minister", "Mike Tyson", "your parole officer", "the district attorney"],
};

const template = `Life can be complex, but can I see where you're coming from. You should $adverb $verb $subject.
`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();