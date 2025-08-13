

// let send_question_url = 'http://localhost:8000/question'
// let send_feedback_url = 'http://localhost:8000/feedback'

let send_question_url = 'https://verofiv3-tietotech.azurewebsites.net/question';
let send_feedback_url = 'https://verofiv3-tietotech.azurewebsites.net/feedback';

const finnishHeading = 'TaxAssist - Verotietoa helposti'
const swedishHeading = 'TaxAssist - Skatteinformation snabbt & enkelt'
const englishHeading = 'TaxAssist - Tax information made easy'

const finnishSubtitle = 'Kysy verotukseen liittyvä kysymys. TaxAssist vastaa verottajan julkiseen dataan perustuen.'
const swedishSubtitle = 'Ställ en skattefråga. TaxAssist svarar baserat på offentliga uppgifter från skattemyndigheterna.'
const englishSubtitle = 'Ask a tax question. TaxAssist answers based on public data from the tax authorities.'

const finnishSendText = 'Lähetä'
const swedishSendText = 'Skicka'
const englishSendText = 'Send'

const finnishSendingText = 'Lähettäminen'
const swedishSendingText = 'Sändning'
const englishSendingText = 'Sending'

const finnishInputWarningText = 'Kysymyksen pituuden on oltava 3-1024 merkkiä.'
const swedishInputWarningText = 'Frågan måste innehålla mellan 3 och 1024 tecken.'
const englishInputWarningText = 'Question must be between 3 and 1024 characters.'

function addQuestionToChat(question) {
    document.getElementById('clear_chat_button').style.display = 'block';
    document.getElementById('exampleQuestions').className = 'closed';
    const formattedQuestion = question.replace(/\n/g, '<br \>')
    const newQuestion = document.createElement('div');
    newQuestion.classList.add('question');
    const newQuestionContent = document.createElement('div');
    newQuestionContent.innerHTML = formattedQuestion;
    newQuestion.appendChild(newQuestionContent);
    const chatMessagesDiv = document.getElementById('chat_messages');
    chatMessagesDiv.appendChild(newQuestion);
    newQuestion.scrollIntoView({behavior: 'smooth', block: 'end'});
}

function addAnswerToChat(answer, feedbackId) {
    document.getElementById('clear_chat_button').style.display = 'block';
    const newAnswer = document.createElement('div');
    newAnswer.classList.add('answer');
    const newAnswerContent = document.createElement('div');
    newAnswer.classList.add('answer-content'); // Add a class for styling
    newAnswer.appendChild(newAnswerContent);

    const feedbackIconsDiv = document.createElement('div');
    feedbackIconsDiv.classList.add('feedback_icons');
    const happyImg = createFeedbackImage(feedbackIconsDiv, 'Happy', feedbackId, 'Happy');
    const sadImg = createFeedbackImage(feedbackIconsDiv, 'Sad', feedbackId, 'Sad');

    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;

    switch (selectedLanguage.toLowerCase()) {
        case "finnish":
            happyImg.innerHTML = 'Hyvä vastaus';
            sadImg.innerHTML = 'Huono vastaus';
            break;
        case "swedish":
            happyImg.innerHTML = 'Bra svar';
            sadImg.innerHTML = 'Dåligt svar';
            break;
        case "english":
            happyImg.innerHTML = 'Good answer';
            sadImg.innerHTML = 'Bad answer';
            break;
        default:
            happyImg.innerHTML = 'Good answer';
            sadImg.innerHTML = 'Bad answer';
            break;
    }

    happyImg.classList.add('happy_icon_unselected');
    sadImg.classList.add('sad_icon_unselected');

    feedbackIconsDiv.appendChild(happyImg);
    feedbackIconsDiv.appendChild(sadImg);

    const chatMessagesDiv = document.getElementById('chat_messages');
    chatMessagesDiv.appendChild(newAnswer);

    // Use marked.js to convert the Markdown string to HTML.
    // We'll keep the character-by-character display but render the HTML at the end.
    let index = 0;
    const displayText = () => {
        if (index < answer.length) {
            newAnswerContent.innerHTML += answer[index];
            index++;
            setTimeout(displayText, 20);
            newAnswer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            // Once the text is fully "typed out", parse the whole thing and update the content.
            // This is the key change to get structured formatting.
            const formattedAnswer = marked.parse(answer);
            newAnswerContent.innerHTML = formattedAnswer;

            // Wait a moment for the content to render before adding feedback buttons
            setTimeout(() => {
                newAnswer.appendChild(feedbackIconsDiv);
                newAnswer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        }
    };
    displayText();
}

function createFeedbackImage(parentDiv, alt, feedbackId, feedbackValue) {
    const img = document.createElement('div');
    img.addEventListener('click', function () {
        console.log('Feedback will be sent: ', feedbackId, ', ', feedbackValue);

        sendFeedback(img, parentDiv, feedbackId, feedbackValue)
            .then(response => {
                console.log('Feedback sent successfully:', response);
            })
            .catch(error => {
                console.error('Error sending feedback:', error);
            });

        // const previous_class_name = img.className
        // const previous_width = img.width
        // const previous_height = img.height
        // img.style.opacity = '1';
        // img.style.transition = 'transform 0.2s ease, width 0.2s ease, height 0.2s ease';
        // img.style.transform = 'scale(2) rotate(360deg)';
        // img.style.boxShadow = '0 0 20px 10px white';
        // setTimeout(function () {
        //     img.style.transition = 'transform 0.2s ease, width 0.2s ease, height 0.2s ease';
        //     img.style.transform = 'scale(1) rotate(0deg)';
        //     img.style.width = previous_width;
        //     img.style.height = previous_height;
        //     img.style.boxShadow = 'none';
        //     img.removeAttribute('style')
        //     img.className = previous_class_name;
        // }, 1000);


    });
    return img;
}


async function sendFeedback(img, parentDiv, feedbackId, feedbackValue) {
    try {
        const response = await fetch(send_feedback_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({feedback: feedbackId, response: feedbackValue})
        });
        const responseData = response.json();
        const elements = parentDiv.querySelectorAll('*');
        elements.forEach(element => {
            const className = element.className
            if (className.endsWith('_selected')) {
                element.classList.remove(className);
                element.classList.add(className.replace('_selected', '_unselected'));
            }
        });

        if (img.className.endsWith('_unselected')) {
            const className = img.className
            img.classList.remove(className);
            img.classList.add(className.replace('_unselected', '_selected'));
        }

        return await responseData
    } catch (error) {
        console.error('Error sending feedback:', error);
        return {error: error.message};
    }
}

let sendQuestionRunning = false;
let controller;

async function sendQuestion(question, language) {

    if (sendQuestionRunning) {
        console.log('Function sendQuestion is already running.');
        return;
    }

    sendQuestionRunning = true;

    try {
        if (question.length < 3 || question.length > 1024) {
            console.info(englishInputWarningText);
            sendQuestionRunning = false;
            const info = document.getElementById("info");

            switch (language.toLowerCase()) {
                case "finnish":
                    info.innerHTML = finnishInputWarningText
                    break;
                case "swedish":
                    info.innerHTML = swedishInputWarningText
                    break;
                case "english":
                    info.innerHTML = englishInputWarningText
                    break;
                default:
                    info.innerHTML = englishInputWarningText
                    break;
            }

            info.style.opacity = 1;
            const fadeOutInterval = setInterval(function () {
                info.style.opacity -= 0.02;
                if (info.style.opacity <= 0) {
                    clearInterval(fadeOutInterval);
                    info.innerHTML = '';
                }
            }, 100);
            return;
        }
        console.log('Question will be sent: ', question, ', ', language);
        const sendQuestionIcon = document.getElementById('sendQuestionIcon');
        sendQuestionIcon.className = 'processing';
        switch (language.toLowerCase()) {
            case "finnish":
                sendQuestionIcon.innerHTML = finnishSendingText
                break;
            case "swedish":
                sendQuestionIcon.innerHTML = swedishSendingText
                break;
            case "english":
                sendQuestionIcon.innerHTML = englishSendingText
                break;
            default:
                sendQuestionIcon.innerHTML = englishSendingText
                break;
        }

        controller = new AbortController();
        const signal = controller.signal;

        const data = {
            question: question,
            language: language
        };

        let textarea;
        try {
            textarea = document.getElementById('questionTextarea');
            textarea.value = '';
            addQuestionToChat(question)

            // await new Promise(resolve => setTimeout(resolve, 10000));
            console.log('Question sent: ', question, ', ', language);
            const response = await fetch(send_question_url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal: signal
            });
            const responseData = await response.json();
            const answer = responseData.answer;
            const feedback = responseData.feedback;
            console.log('Answer received from API: ', responseData)
            addAnswerToChat(answer, feedback);
            return responseData;
        } catch (error) {
            console.error('Error sending question:', error);
            return {error: error.message};
        } finally {
            sendQuestionRunning = false;
            const sendQuestionIcon = document.getElementById('sendQuestionIcon');
            sendQuestionIcon.className = 'static';
            switch (language.toLowerCase()) {
                case "finnish":
                    sendQuestionIcon.innerHTML = finnishSendText
                    break;
                case "swedish":
                    sendQuestionIcon.innerHTML = swedishSendText
                    break;
                case "english":
                    sendQuestionIcon.innerHTML = englishSendText
                    break;
                default:
                    sendQuestionIcon.innerHTML = englishSendText
                    break;
            }
            console.log('Function sendQuestion stopped.')
        }
    } catch (error) {
        console.error('Error in sendQuestion function:', error);
    }
}

function stopSendingQuestion() {
    controller.abort();
    sendQuestionRunning = false;
    console.log('Function sendQuestion stopped by user.');
}

document.addEventListener('DOMContentLoaded', function () {

    const textarea = document.getElementById('questionTextarea');
    textarea.focus();

    const sendQuestionIcon = document.getElementById('sendQuestionIcon');
    sendQuestionIcon.addEventListener('click', function () {

        if (!sendQuestionRunning) {
            const textareaContent = textarea.value;
            const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
            sendQuestion(textareaContent, selectedLanguage)
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            stopSendingQuestion()
        }

    });

    textarea.addEventListener('keydown', function (event) {

        const textareaContent = textarea.value;
        const selectedLanguage = document.querySelector('input[name="language"]:checked').value;

        if (event.key === 'Enter') {
            if (event.shiftKey) {
                event.preventDefault();
                const cursorPosition = textarea.selectionStart;
                const currentValue = textarea.value;
                textarea.value = currentValue.substring(0, cursorPosition) + "\n" + currentValue.substring(textarea.selectionEnd);
                textarea.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
                this.style.height = 'auto';
                const computedStyle = window.getComputedStyle(this);
                const maxHeight = parseInt(computedStyle.getPropertyValue('max-height'), 10);
                if (this.scrollHeight > maxHeight) {
                    this.style.height = maxHeight + 'px';
                    this.style.overflowY = 'auto';
                } else {
                    this.style.height = this.scrollHeight + 'px';
                    this.style.overflowY = 'hidden';
                }
            } else {
                event.preventDefault();
                sendQuestion(textareaContent, selectedLanguage)
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        }

    });

    const listItems = document.querySelectorAll('#exampleQuestions button');
    listItems.forEach(function (button) {
        button.addEventListener('click', function () {
            const question = button.textContent.trim();
            const selectedLanguage = button.getAttribute("language");
            sendQuestion(question, selectedLanguage)
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });

    const clearChatButton = document.getElementById('clear_chat_button');
    const chatMessagesContainer = document.getElementById('chat_messages');

    clearChatButton.addEventListener('click', function () {
        chatMessagesContainer.innerHTML = '';
        clearChatButton.style.display = 'none';
        document.getElementById('exampleQuestions').className = 'open';
    });

    const heading = document.getElementById('heading');
    const finnishRadio = document.getElementById('finnishRadio');
    const swedishRadio = document.getElementById('swedishRadio');
    const englishRadio = document.getElementById('englishRadio');
    const subTitle = document.getElementById('subTitle');

    const finnishExampleQuestions = document.getElementById('finnishExampleQuestions');
    const swedishExampleQuestions = document.getElementById('swedishExampleQuestions');
    const englishExampleQuestions = document.getElementById('englishExampleQuestions');

    heading.innerHTML = finnishHeading;
    subTitle.innerHTML = finnishSubtitle;
    sendQuestionIcon.innerHTML = finnishSendText;
    swedishExampleQuestions.style.display = 'none';
    englishExampleQuestions.style.display = 'none';

    finnishRadio.addEventListener('click', function () {
        heading.innerHTML = finnishHeading;
        subTitle.innerHTML = finnishSubtitle;
        sendQuestionIcon.innerHTML = finnishSendText;
        finnishExampleQuestions.style.display = 'block';
        swedishExampleQuestions.style.display = 'none';
        englishExampleQuestions.style.display = 'none';
    });
    swedishRadio.addEventListener('click', function () {
        heading.innerHTML = swedishHeading;
        subTitle.innerHTML = swedishSubtitle;
        sendQuestionIcon.innerHTML = swedishSendText;
        finnishExampleQuestions.style.display = 'none';
        swedishExampleQuestions.style.display = 'block';
        englishExampleQuestions.style.display = 'none';
    });
    englishRadio.addEventListener('click', function () {
        heading.innerHTML = englishHeading;
        subTitle.innerHTML = englishSubtitle;
        sendQuestionIcon.innerHTML = englishSendText;
        finnishExampleQuestions.style.display = 'none';
        swedishExampleQuestions.style.display = 'none';
        englishExampleQuestions.style.display = 'block';
    });


});
