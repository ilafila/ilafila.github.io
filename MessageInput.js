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
                let emoji = this.sections[section][emojiNumber];
                const emojiElement = `<div class="emoji-wrapper">
                                        <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji}</span>
                                      </div> `;
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
                      <div class="emoji-block__emotions">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Эмоции</p>
                        </div>
                        ${emotions}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Жесты и люди</p>
                        </div>
                        ${gesturesAndPeople}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Символы</p>
                        </div>
                        ${symbols}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Животные и растения</p>
                        </div>
                        ${animalsAndPlants}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Еда и напитки</p>
                        </div>
                        ${foodAndDrink}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Спорт и активности</p>
                        </div>
                        ${sportsAndActivities}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Путешествия и транспорт</p>
                        </div>
                        ${travelAndTransport}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Предметы</p>
                        </div>
                        ${items}
                      </div>
                      <div class="emoji-block__emoji-section">
                        <div class="section-name-wrapper">
                          <p class="section-name-wrapper__section-name">Флаги</p>
                        </div>
                        ${flags}
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
