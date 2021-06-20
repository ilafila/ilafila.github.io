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
    const emojiOpenWrapper = document.querySelector('.emoji-open-wrapper');
    const emojiRecentWrapper = document.querySelector('.emoji-recent-wrapper');
    const status = element.dataset.status;
    if (status === 'open') {
      emojiOpenWrapper.classList.add('emoji-block-active');
      emojiRecentWrapper.classList.remove('emoji-block-active');
      emojiBlock.classList.remove('hidden');
      recentEmojiBlock.classList.add('hidden');
    } else {
      emojiOpenWrapper.classList.remove('emoji-block-active');
      emojiRecentWrapper.classList.add('emoji-block-active');
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
    let arrOfKeys = [];
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key != '0') {
        arrOfKeys.append(key);
      }
    }
    arrOfKeys.sort();
    for(let i = 0; i < arrOfKeys.length; i++){
      const key = arrOfKeys[i];
      const emoji = localStorage.getItem(key);
      const emojiElement = `<div class="emoji-wrapper">
                              <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji}</span>
                            </div> `;
        recentEmoji += emojiElement;
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
      const emojiInput = `<span>${emoji} </span>`;
      messageInput.insertAdjacentHTML('beforeend', emojiInput);
  
      let isDuplicate = false;
      for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key != '0') {
          if(emoji === localStorage.getItem(key)){
            isDuplicate = true;
          }
        }
      }

      if(!isDuplicate) {
        const recentEmojiSection = document.querySelector('.recent-emoji-section');
        if(recentEmojiSection.children.length == 25) {
          console.log(recentEmojiSection.firstChild);
          recentEmojiSection.removeChild(recentEmojiSection.children[0]);
          if(+localStorage.getItem('0') == 26) {
            localStorage.setItem('0', 1);
          }
        }
  
        const emojiPosition = +localStorage.getItem('0');
        localStorage.setItem(emojiPosition, emoji);
        const emojiNewPosition = emojiPosition + 1;
        localStorage.setItem('0', emojiNewPosition);
  
        const emojiElement = `<div class="emoji-wrapper">
                                <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji}</span>
                              </div> `;
        recentEmojiSection.insertAdjacentHTML('beforeend', emojiElement);
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
  console.log('oh blin');
  if(localStorage.length === 0) {
    localStorage.setItem('0', 1);
  }
  const emojiPicker = new EmojiPicker();
  emojiPicker.getEmoji().then(() => {
      const app = document.getElementById('app');
      app.insertAdjacentHTML('afterbegin', emojiPicker.render());
  })
}

window.addEventListener('load', createEmojiPicker);