class EmojiButton {
    render() {
        return ` <div class="emoji-btn-wrapper" role="button" onclick="EmojiPicker.showEmoji()">
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
        this.sections;
        this.objectOfEmojiElement;
    }

    async getEmoji() {
        const request = new Request('./sections.json');
        const response = await fetch(request);
        if(response.ok){
            const res = await response.json();
            console.log(typeof res);
            this.sections = res;
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

    createEmoji() {
        const objectOfEmojiElement = {
            emotions: '',
            gesturesAndPeople: '',
            symbols: '',
            animalsAndPlants: '',
            foodAndDrink: '',
            sportsAndActivities: '',
            travelAndTransport: '',
            items: '',
            flags: '',
        }

        for (let section in this.sections) {
            for (let emojiNumber in this.sections[section]) {
                const emoji = this.sections[section][emojiNumber];
                let bagIconUrl;
                switch(emoji) {
                  case "☺":
                    bagIconUrl = './emoji/bag-emoji-1.png';
                    break;
                  case "☹":
                    bagIconUrl = './emoji/bag-emoji-2.png';
                    break;
                  case "☠":
                    bagIconUrl = './emoji/bag-emoji-3.png';
                    break;
                  case "👩‍❤️‍💋‍👨":
                    bagIconUrl = './emoji/bad-emodji-1.png';
                    break;
                  case "👨‍❤️‍💋‍👨":
                    bagIconUrl = './emoji/bad-emoji-2.png';
                    break;
                  case "👩‍❤️‍💋‍👩":
                    bagIconUrl = './emoji/bad-emoji-3.png';
                    break;
                  case "👩‍❤️‍👨":
                    bagIconUrl = './emoji/bad-emoji-4.png';
                    break;
                  case "👨‍❤️‍👨":
                    bagIconUrl = './emoji/bad-emoji-5.png';
                    break;
                  case "👩‍❤‍👩":
                    bagIconUrl = './emoji/bad-emoji-6.png';
                    break;
                }
                let emojiElement;
                if(bagIconUrl) {
                  emojiElement = `<div class="emoji-wrapper">
                                    <img class="emoji-img" src="${bagIconUrl}" alt="${emoji}">
                                  </div>`;
                } else {
                  emojiElement = `<div class="emoji-wrapper">
                                    <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji}</span>
                                  </div> `;
                }
                objectOfEmojiElement[section] += emojiElement;
            }
        }

        this.objectOfEmojiElement = objectOfEmojiElement;
    }

    render() {
        this.createEmoji();
        const {emotions, gesturesAndPeople, symbols, animalsAndPlants, foodAndDrink, sportsAndActivities, travelAndTransport, items, flags} = this.objectOfEmojiElement;
        const messageInput = new MessageInput();
        return `<div>
                  <div class="emoji-table hide">
                    <div class="emoji-table__emoji-block">
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Эмоции</p>
                        </div>
                        <div class="emoji-section">
                          ${emotions}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Жесты и люди</p>
                        </div>
                        <div class="emoji-section">
                          ${gesturesAndPeople}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Символы</p>
                        </div>
                        <div class="emoji-section">
                          ${symbols}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Животные и растения</p>
                        </div>
                        <div class="emoji-section">
                          ${animalsAndPlants}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Еда и напитки</p>
                        </div>
                        <div class="emoji-section">
                          ${foodAndDrink}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Спорт и активности</p>
                        </div>
                        <div class="emoji-section">
                          ${sportsAndActivities}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Путешествия и транспорт</p>
                        </div>
                        <div class="emoji-section">
                          ${travelAndTransport}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Предметы</p>
                        </div>
                        <div class="emoji-section">
                          ${items}
                        </div>
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Флаги</p>
                        </div>
                        <div class="emoji-section">
                          ${flags}
                        </div>
                      </div>
                    </div>
                    <div class="emoji-table__emoji-navbar"></div>
                  </div>
                  ${messageInput.render()}
                </div>`;
    }
}

function createEmojiPicker () {
    const emojiPicker = new EmojiPicker();
    emojiPicker.getEmoji().then(() => {
        const app = document.getElementById('app');
        app.insertAdjacentHTML('afterbegin', emojiPicker.render());
    })
}

window.addEventListener('load', createEmojiPicker);
