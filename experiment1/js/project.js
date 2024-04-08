const fillers = {
  adverb: [
    "probably",
    "really",
    "certainly",
    "arguably",
    "decidedly",
    "most definitely",
  ],
  verb: [
    "aggravate",
    "look through your browser's history with",
    "fornicate with",
    "commit arson with",
    "start a cool new cult with",
    "browse the dark web with",
    "kidnap",
    "defecate into the shoes of",
    "argue vehemetly with",
    "smoke salvia with",
    "defenestrate",
  ],
  subject: [
    "your mother",
    "the police",
    "your boss",
    "your new love interest",
    "your boss",
    "Yoko Ono",
    "the Malaysian Prime Minister",
    "Mike Tyson",
    "your parole officer",
    "the district attorney",
  ],
};

const template = `Life can be complex, but I see where you're coming from. You should $adverb $verb $subject.
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
