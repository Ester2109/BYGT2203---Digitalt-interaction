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

/* Number of images to show */
function getSlidesPerView() {
  return window.innerWidth <= 768 ? 1 : 3;
}

/* Space between images */
function getGap() {
  return window.innerWidth <= 768 ? 0 : 20;
}

/* Updates the carousel */
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

/* Next step in the carousel */
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

/* Start auto rotation */
function startCarousel() {
  stopCarousel();
  autoSlide = setInterval(nextSlide, 4000);
}

/* Stop auto rotation */
function stopCarousel() {
  if (autoSlide) {
    clearInterval(autoSlide);
  }
}

/* Pause on hover */
if (track) {
  track.addEventListener("mouseenter", stopCarousel);
  track.addEventListener("mouseleave", startCarousel);
}

/* Update on resize */
window.addEventListener("resize", function () {
  updateCarousel();
});

/* Start */
updateCarousel();
startCarousel();

const toTopBtn = document.getElementById("toTopBtn");

// Scroll to top when clicked
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
  "Hi! I am the ReBygg Bot, your personal AI assistant. How can I help you?";

const doneOption = "I'm done";
let hasTypedWelcome = false;

const allQuestions = [
  "What is ReBygg?",
  "How does the app work?",
  "Why is this sustainable?",
  "I would like to contact you"
];

const answers = {
  "What is ReBygg?": [
    "ReBygg is a digital platform developed to make the construction industry more sustainable through smarter use of materials.",
    "Is there anything else you would like to know?"
  ],

  "How does the app work?": [
    "In the ReBygg app, you can register surplus materials with dimensions, material type, and shelf number where they are stored. Other users can then easily retrieve the material.",
    "Is there anything else you would like to know?"
  ],

  "Why is this sustainable?": [
    "ReBygg makes it easier to reuse materials that would otherwise be thrown away. This reduces waste, saves resources, and contributes to a more circular construction industry.",
    "Is there anything else you would like to know?"
  ],

  "I would like to contact you": [
    "Of course! What would you like to contact us about?",
    "Choose an option below:"
  ]
};

const contactOptions = [
  "Collaboration and partnerships",
  "Projects and execution",
  "Prices and offers",
  "Storage and material flow",
  "Digital solutions and the app",
  "Other"
];

const contactAnswers = {
  "Collaboration and partnerships": [
    "You can contact our Chief Executive Officer:",
    "Tove Marie Stepaschko at \nEmail: tove@rebygg.no"
  ],

  "Projects and execution": [
    "Please contact our Operations Manager:",
    "Remi André Stølen at \nEmail: remi@rebygg.no"
  ],

  "Prices and offers": [
    "Our Sales Manager will be happy to help you:",
    "Kristian Østmoløkken at \nEmail: kristian@rebygg.no"
  ],

  "Storage and material flow": [
    "Please contact our Production Manager:",
    "Petter Liabakk Eriksen at \nEmail: petter@rebygg.no"
  ],

  "Digital solutions and the app": [
    "Our IT Specialist can help you:",
    "Ester Halvorsen at \nEmail: ester@rebygg.no"
  ],

  "Other": [
    "For general inquiries, you can contact us at our main email:",
    "Email: kontakt@rebygg.no"
  ]
};

// Writes text letter by letter
function typeMessage(element, text, speed = 35, callback = null) {
  if (!element) return;

  element.textContent = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }

  typing();
}

// Creates a message
function createMessage(className) {
  const message = document.createElement("div");
  message.className = className;
  return message;
}

// Shows the main buttons again + the finish button
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

// Shows the contact buttons + the finish button
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

// Handles general questions
function handleQuestionClick(question) {
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
            if (question === "I would like to contact you") {
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

// Handles contact choices
function handleContactClick(contact) {
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

            typeMessage(botReply3, "Is there anything else you would like to know?", 30, () => {
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

// Handles the finish button
function handleDoneClick() {
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
      "Got it. Do not hesitate to contact us again if there is anything you are wondering about. Have a great day!",
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

// Connects clicks to the buttons
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

// Open/close chat
if (chatBtn && chatBox && closeChat) {
  chatBtn.addEventListener("click", () => {
    chatBox.classList.toggle("open");

    if (chatBox.classList.contains("open") && !hasTypedWelcome) {
      const currentBotMessage = document.getElementById("botMessage");

      if (currentBotMessage) {
        setTimeout(() => {
          typeMessage(currentBotMessage, welcomeText, 40);
        }, 500);
      }

      hasTypedWelcome = true;
    }
  });

  closeChat.addEventListener("click", () => {
    chatBox.classList.remove("open");
    resetChat();
  });
}

// ======================
// CONNECT CHAT BUTTONS
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
// CONTACT FORM
// ======================

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    showAlert(
      "Thank you for your inquiry! You will receive a reply within 2 business days."
    );

    form.reset();
  });
}

const selectedFlag = document.getElementById("selectedFlag");
const langMenu = document.getElementById("langMenu");

// Open/close dropdown
selectedFlag.addEventListener("click", () => {
    langMenu.style.display = 
        langMenu.style.display === "flex" ? "none" : "flex";
});

// Select language
document.querySelectorAll(".lang-option").forEach(option => {
    option.addEventListener("click", () => {
        const lang = option.getAttribute("data-lang");

        selectedFlag.src = option.src;

        langMenu.style.display = "none";

        console.log("Selected language:", lang);
    });
});

// Close if clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-dropdown")) {
        langMenu.style.display = "none";
    }
});