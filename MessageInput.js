class EmojiButton {
    render() {
        return ` <div class="emoji-wrapper" role="button" onclick="EmojiPicker.showEmoji()">
                  <div class="emoji-btn"></div>
                </div>`;
    }
}

class MessageInput {
    render() {
        const emojiBtn = new EmojiButton();
        return `<div class="message-wrapper">
                  ${emojiBtn.render()}
                  <div class="message-input" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="Ваше сообщение..."></div>
                </div>`;
    }
}

class EmojiPicker {
    constructor() {
        this.arrayOfEmoji = ["😀"];
        this.getEmoji();
    }

    async getEmoji() {
        const request = new Request('./sections.json');
        const response = await fetch(request);
        if(response.ok){
            const res = await response.json();
            console.log(res);
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    static showEmoji() {
        const emojiTable = document.querySelector('.emoji-table');
        emojiTable.classList.toggle('hide');
    }


    static addEmoji(element) {
        const messageInput = document.querySelector('.message-input');
        const emoji= element.dataset.emoji;
        const emojiElement = `<span>${emoji}</span>`;
        messageInput.insertAdjacentHTML('beforeend', emojiElement);
    }

    render() {
        const messageInput = new MessageInput();
        return `<div>
                  <div class="emoji-table hide">
                    <span onclick="EmojiPicker.addEmoji(this)" data-emoji="😱">😱</span>
                  </div>
                  ${messageInput.render()}
                </div>`;
    }
}

function createEmojiPicker () {
    const emojiPicker = new EmojiPicker();

    const app = document.getElementById('app');
    app.insertAdjacentHTML('afterbegin', emojiPicker.render());
}

window.addEventListener('load', createEmojiPicker);
