const knapp = document.getElementById("knapp");

if (knapp) {
  knapp.addEventListener("click", function () {
    const aboutSection = document.getElementById("about");

    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".carousel-slide"));

let currentIndex = 0;
let autoSlide;

/* Hvor mange bilder som skal vises */
function getSlidesPerView() {
  return window.innerWidth <= 768 ? 1 : 3;
}

/* Avstand mellom bildene */
function getGap() {
  return window.innerWidth <= 768 ? 0 : 20;
}

/* Oppdaterer karusellen */
function updateCarousel() {
  if (!track || slides.length === 0) return;

  const slidesPerView = getSlidesPerView();
  const gap = getGap();
  const slideWidth = slides[0].offsetWidth + gap;

  slides.forEach((slide) => {
    slide.classList.remove("center", "side");
  });

  if (slidesPerView === 1) {
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    slides[currentIndex].classList.add("center");
    return;
  }

  // Pass på at currentIndex ikke går for langt
  if (currentIndex > slides.length - slidesPerView) {
    currentIndex = 0;
  }

  const leftIndex = currentIndex;
  const centerIndex = currentIndex + 1;
  const rightIndex = currentIndex + 2;

  if (slides[leftIndex]) slides[leftIndex].classList.add("side");
  if (slides[centerIndex]) slides[centerIndex].classList.add("center");
  if (slides[rightIndex]) slides[rightIndex].classList.add("side");

  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

/* Neste steg i karusellen */
function nextSlide() {
  if (slides.length === 0) return;

  const slidesPerView = getSlidesPerView();

  if (slidesPerView === 1) {
    currentIndex = (currentIndex + 1) % slides.length;
  } else {
    currentIndex++;

    if (currentIndex > slides.length - 3) {
      currentIndex = 0;
    }
  }

  updateCarousel();
}

/* Start auto-rotasjon */
function startCarousel() {
  stopCarousel();
  autoSlide = setInterval(nextSlide, 4000);
}

/* Stopp auto-rotasjon */
function stopCarousel() {
  if (autoSlide) {
    clearInterval(autoSlide);
  }
}

/* Pause ved hover */
if (track) {
  track.addEventListener("mouseenter", stopCarousel);
  track.addEventListener("mouseleave", startCarousel);
}

/* Oppdater ved resize */
window.addEventListener("resize", function () {
  updateCarousel();
});

/* Start */
updateCarousel();
startCarousel();

const toTopBtn = document.getElementById("toTopBtn");



// scroll til toppen når man klikker
toTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
// ======================
// CHATBOT
// ======================

const chatBtn = document.getElementById("chatBtn");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");
const chatMessages = document.getElementById("chatMessages");
const chatOptions = document.getElementById("chatOptions");

const welcomeText =
  "Hei! Jeg er ReBygg-botten, din personlige KI-assistent. Hva kan jeg hjelpe deg med?";

const doneOption = "Jeg er ferdig";
let hasTypedWelcome = false;

const allQuestions = [
  "Hva er ReBygg?",
  "Hvordan fungerer appen?",
  "Hvorfor er dette bærekraftig?",
  "Jeg ønsker å kontakte dere"
];

const answers = {
  "Hva er ReBygg?": [
    "ReBygg er en digital plattform utviklet for å gjøre byggebransjen mer bærekraftig gjennom smartere bruk av materialer.",
    "Noe annet du lurer på?"
  ],

  "Hvordan fungerer appen?": [
    "I ReBygg-appen kan du registrere overskuddsmateriell med mål, materialtype og hyllenummer der det lagres. Deretter kan andre brukere enkelt hente materialet.",
    "Noe annet du lurer på?"
  ],

  "Hvorfor er dette bærekraftig?": [
    "ReBygg gjør det enklere å gjenbruke materialer som ellers ville blitt kastet. Dette reduserer avfall, sparer ressurser og bidrar til en mer sirkulær byggebransje.",
    "Noe annet du lurer på?"
  ],

  "Jeg ønsker å kontakte dere": [
    "Selvfølgelig! Hva ønsker du å kontakte oss om?",
    "Velg et alternativ under:"
  ]
};

const contactOptions = [
  "Samarbeid og partnerskap",
  "Prosjekt og gjennomføring",
  "Priser og tilbud",
  "Lager og materialflyt",
  "Digitale løsninger og appen",
  "Annet"
];

const contactAnswers = {
  "Samarbeid og partnerskap": [
    "Du kan kontakte vår Administrerende Direktør:",
    "Tove Marie Stepaschko på \nE-post: tove@rebygg.no"
  ],

  "Prosjekt og gjennomføring": [
    "Ta kontakt med vår Operasjonsleder:",
    "Remi André Stølen på \nE-post: remi@rebygg.no"
  ],

  "Priser og tilbud": [
    "Vår Salgssjef hjelper deg gjerne:",
    "Kristian Østmoløkken på \nE-post: kristian@rebygg.no"
  ],

  "Lager og materialflyt": [
    "Ta kontakt med vår Produksjonssjef:",
    "Petter Liabakk Eriksen på \nE-post: petter@rebygg.no"
  ],

  "Digitale løsninger og appen": [
    "Vår IT-spesialist kan hjelpe deg:",
    "Ester Halvorsen på \nE-post: ester@rebygg.no"
  ],

  "Annet": [
    "For generelle henvendelser kan du kontakte oss på vårt sentralbord:",
    "E-post: kontakt@rebygg.no"
  ]
};

// Skriver tekst bokstav for bokstav
let activeTyping = null;

// Skriver tekst bokstav for bokstav
function typeMessage(element, text, speed = 35, callback = null) {
  if (!element) return;

  // stopp eventuell tidligere typing
  if (activeTyping) {
    clearTimeout(activeTyping.timeout);
    activeTyping = null;
  }

  element.textContent = "";
  let i = 0;

  activeTyping = {
    element,
    text,
    timeout: null,
    finish() {
      clearTimeout(this.timeout);
      element.textContent = text;

      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      activeTyping = null;

      if (callback) callback();
    }
  };

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;

      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      activeTyping.timeout = setTimeout(typing, speed);
    } else {
      activeTyping = null;
      if (callback) callback();
    }
  }

  typing();
}

// Lager en melding
function createMessage(className) {
  const message = document.createElement("div");
  message.className = className;
  return message;
}

// Viser hovedknappene på nytt + avslutt-knappen
function renderOptions(excludeQuestion = null) {
  if (!chatOptions) return;

  chatOptions.innerHTML = "";

  const remainingQuestions = excludeQuestion
    ? allQuestions.filter((question) => question !== excludeQuestion)
    : allQuestions;

  remainingQuestions.forEach((question) => {
    const button = document.createElement("button");
    button.className = "chat-option";
    button.textContent = question;
    button.dataset.question = question;
    chatOptions.appendChild(button);
  });

  const doneButton = document.createElement("button");
  doneButton.className = "chat-option";
  doneButton.textContent = doneOption;
  doneButton.dataset.done = "true";
  chatOptions.appendChild(doneButton);

  attachOptionListeners();
}

// Viser kontaktknappene + avslutt-knappen
function renderContactOptions() {
  if (!chatOptions) return;

  chatOptions.innerHTML = "";

  contactOptions.forEach((option) => {
    const button = document.createElement("button");
    button.className = "chat-option";
    button.textContent = option;
    button.dataset.contact = option;
    chatOptions.appendChild(button);
  });

  const doneButton = document.createElement("button");
  doneButton.className = "chat-option";
  doneButton.textContent = doneOption;
  doneButton.dataset.done = "true";
  chatOptions.appendChild(doneButton);

  attachOptionListeners();
}

// Håndterer vanlige spørsmål
function handleQuestionClick(question) {
  if (activeTyping) {
    activeTyping.finish();
  }

  if (!chatMessages || !chatOptions) return;

  chatOptions.innerHTML = "";

  const userMessage = createMessage("user-message");
  userMessage.textContent = question;
  chatMessages.appendChild(userMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const responseList = answers[question];
  if (!responseList) return;

  setTimeout(() => {
    const botReply1 = createMessage("bot-message");
    chatMessages.appendChild(botReply1);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    typeMessage(botReply1, responseList[0], 30, () => {
      setTimeout(() => {
        const botReply2 = createMessage("bot-message");
        chatMessages.appendChild(botReply2);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        typeMessage(botReply2, responseList[1], 30, () => {
          setTimeout(() => {
            if (question === "Jeg ønsker å kontakte dere") {
              renderContactOptions();
            } else {
              renderOptions(question);
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
          }, 300);
        });
      }, 500);
    });
  }, 500);
}

// Håndterer kontaktvalg
function handleContactClick(contact) {
  if (activeTyping) {
    activeTyping.finish();
  }

  if (!chatMessages || !chatOptions) return;

  chatOptions.innerHTML = "";

  const userMessage = createMessage("user-message");
  userMessage.textContent = contact;
  chatMessages.appendChild(userMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const responseList = contactAnswers[contact];
  if (!responseList) return;

  setTimeout(() => {
    const botReply1 = createMessage("bot-message");
    chatMessages.appendChild(botReply1);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    typeMessage(botReply1, responseList[0], 30, () => {
      setTimeout(() => {
        const botReply2 = createMessage("bot-message");
        chatMessages.appendChild(botReply2);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        typeMessage(botReply2, responseList[1], 30, () => {
          setTimeout(() => {
            const botReply3 = createMessage("bot-message");
            chatMessages.appendChild(botReply3);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            typeMessage(botReply3, "Noe annet du lurer på?", 30, () => {
              setTimeout(() => {
                renderOptions();
                chatMessages.scrollTop = chatMessages.scrollHeight;
              }, 300);
            });
          }, 400);
        });
      }, 500);
    });
  }, 500);
}

function resetChat() {
  if (!chatMessages || !chatOptions) return;

  chatMessages.innerHTML = '<div class="bot-message" id="botMessage"></div>';
  renderOptions();
  hasTypedWelcome = false;
}


// Håndterer avslutt-knappen
function handleDoneClick() {
  if (activeTyping) {
    activeTyping.finish();
  }

  if (!chatMessages || !chatOptions || !chatBox) return;

  chatOptions.innerHTML = "";

  const userMessage = createMessage("user-message");
  userMessage.textContent = doneOption;
  chatMessages.appendChild(userMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    const botReply = createMessage("bot-message");
    chatMessages.appendChild(botReply);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    typeMessage(
      botReply,
      "Den er god. Ikke nøl med å ta kontakt igjen om det er noe du lurer på. Ha en fin dag!",
      30,
      () => {
        setTimeout(() => {
          chatBox.classList.remove("open");
          resetChat();
        }, 1200);
      }
    );
  }, 500);
}

// Knytter klikk til knappene
function attachOptionListeners() {
  const optionButtons = document.querySelectorAll(".chat-option");

  optionButtons.forEach((button) => {
    button.onclick = () => {
      const question = button.dataset.question;
      const contact = button.dataset.contact;
      const done = button.dataset.done;

      if (question) {
        handleQuestionClick(question);
      } else if (contact) {
        handleContactClick(contact);
      } else if (done) {
        handleDoneClick();
      }
    };
  });
}

// Åpne/lukke chat
if (chatBtn && chatBox && closeChat) {
  chatBtn.addEventListener("click", () => {
    // Hvis chatbotten allerede er åpen: lukk og restart
    if (chatBox.classList.contains("open")) {
      chatBox.classList.remove("open");
      resetChat();
      return;
    }

    // Hvis chatbotten er lukket: åpne
    chatBox.classList.add("open");

    // Start velkomstmelding på nytt
    if (!hasTypedWelcome) {
      const currentBotMessage = document.getElementById("botMessage");

      if (currentBotMessage) {
        setTimeout(() => {
          typeMessage(currentBotMessage, welcomeText, 40);
        }, 500);
      }

      hasTypedWelcome = true;
    }
  });

  // Lukke-knapp
  closeChat.addEventListener("click", () => {
    chatBox.classList.remove("open");
    resetChat();
  });
}

// ======================
// KOBLE CHAT-KNAPPER
// ======================
attachOptionListeners();


// ======================
// CUSTOM ALERT
// ======================

function showAlert(message){
  const alertBox = document.getElementById("customAlert");
  const alertText = document.getElementById("alertText");

  if (!alertBox || !alertText) return;

  alertText.textContent = message;
  alertBox.classList.add("active");
}

function closeAlert(){
  const alertBox = document.getElementById("customAlert");
  if (alertBox) {
    alertBox.classList.remove("active");
  }
}


// ======================
// KONTAKTSKJEMA
// ======================

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // 🔥 vis pen alert
    showAlert(
      "Takk for din henvendelse! Du vil få svar innen 2 virkedager."
    );

    // 🔥 reset skjema
    form.reset();
  });
}

const selectedFlag = document.getElementById("selectedFlag");
const langMenu = document.getElementById("langMenu");

// åpne/lukke dropdown
selectedFlag.addEventListener("click", () => {
    langMenu.style.display = 
        langMenu.style.display === "flex" ? "none" : "flex";
});

// velge språk
document.querySelectorAll(".lang-option").forEach(option => {
    option.addEventListener("click", () => {
        const lang = option.getAttribute("data-lang");

        // bytt flagg
        selectedFlag.src = option.src;

        // lukk meny
        langMenu.style.display = "none";

        // HER kan du koble språkbytte senere
        console.log("Valgt språk:", lang);
        // setLanguage(lang);
    });
});

// lukk hvis man klikker utenfor
document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-dropdown")) {
        langMenu.style.display = "none";
    }
});