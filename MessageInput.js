class EmojiButton {
  render() {
      return `<div class="emoji-btn-wrapper emoji-input-wrapper" role="button" onclick="EmojiPicker.showEmoji()">
                <div class="emoji-btn emoji-btn-input"></div>
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

class EmojiNavbar {
  static updateEmojiBlock(element) {
    const emojiBlock = document.querySelector('.emoji-table__emoji-block');
    const recentEmojiBlock = document.querySelector('.emoji-table__recent-emoji-block');
    const status = element.dataset.status;
    if (status === 'open') {
      emojiBlock.parentElement.classList.add('emoji-block-active');
      recentEmojiBlock.parentElement.classList.remove('emoji-block-active');
      emojiBlock.classList.remove('hidden');
      recentEmojiBlock.classList.add('hidden');
    } else {
      emojiBlock.parentElement.classList.remove('emoji-block-active');
      recentEmojiBlock.parentElement.classList.add('emoji-block-active');
      emojiBlock.classList.add('hidden');
      recentEmojiBlock.classList.remove('hidden');
    }
  }

  render() {
    return `<div class="emoji-table__emoji-navbar">
              <div class="emojis-buttons-wrapper">
                <div class="emoji-btn-wrapper emoji-open-wrapper emoji-block-active">
                  <div class="emoji-btn emoji-open-btn" role="button" data-status="open" onclick="EmojiNavbar.updateEmojiBlock(this)"></div>
                </div>
                <div class="emoji-btn-wrapper emoji-recent-wrapper">
                  <div class="emoji-btn emoji-recent-btn" role="button" data-status="recent" onclick="EmojiNavbar.updateEmojiBlock(this)"></div>
                </div>
              </div>
            </div>`;
  }
}

class RecentEmojiBlock {
  static getResentEmoji() {
    let recentEmoji = '';
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== 'emojiPosition' || key !== 'undefined') {
        recentEmoji += localStorage.getItem(key);
      }
    }
    return recentEmoji;
  }

  render() {
    const recentEmoji = RecentEmojiBlock.getResentEmoji();
    return `<div class="emoji-table__recent-emoji-block hidden">
              <div class="emoji-block__emoji-section">
                <div class="section-name-wrapper">
                  <p class="section-name-wrapper__section-name">Часто используемые</p>
                </div>
                <div class="recent-emoji-section">
                  ${recentEmoji}
                </div>
              </div>
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

      const emojiElement = `<div class="emoji-wrapper">
                              <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji}</span>
                            </div> `;
    
      let isDuplicate = false;
      for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== 'emojiPosition' || key !== 'undefined') {
          if(emoji === localStorage.getItem(key)){
            isDuplicate = true;
          }
        }
      }

      if(!isDuplicate) {
        if(localStorage.length > 26) {
          localStorage.setItem('emojiPosition', 1);
        }
  
        const emojiPosition = +localStorage.getItem('emojiPosition');
        localStorage.setItem(emojiPosition, emojiElement);
        const emojiNewPosition = emojiPosition + 1;
        localStorage.setItem('emojiPosition', emojiNewPosition);
  
        const recentEmoji = RecentEmojiBlock.getResentEmoji();
        const recentEmojiBlock = document.querySelector('.emoji-table__recent-emoji-block');
        recentEmojiBlock .innerHTML = recentEmoji;
      }
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
      const emojiNavbar = new EmojiNavbar();
      const recentEmojiBlock = new RecentEmojiBlock();
      return `<div>
                <div class="emoji-table hide">
                  ${recentEmojiBlock.render()}
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
                  ${emojiNavbar.render()}
                </div>
                ${messageInput.render()}
              </div>`;
  }
}

function createEmojiPicker () {
  localStorage.setItem('emojiPosition', 1);
  const emojiPicker = new EmojiPicker();
  emojiPicker.getEmoji().then(() => {
      const app = document.getElementById('app');
      app.insertAdjacentHTML('afterbegin', emojiPicker.render());
  })
}

window.addEventListener('load', createEmojiPicker);