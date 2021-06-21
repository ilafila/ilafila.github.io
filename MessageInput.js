class ShowEmojiButton {
  static showEmoji() {
    const emojiTable = document.querySelector('.emoji-table');
    emojiTable.classList.toggle('hide');
  }

  render() {
    return `<div class="emoji-btn-wrapper emoji-input-wrapper" role="button" onclick="ShowEmojiButton.showEmoji()">
                <div class="emoji-btn emoji-btn-show"></div>
              </div>`;
  }
}

class MessageInput {
  render() {
    const emojiBtn = new ShowEmojiButton();
    return `<div class="message-wrapper">
                ${emojiBtn.render()}
                <div class="message-input" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="Ваше сообщение..."></div>
              </div>`;
  }
}

class EmojiNavbar {
  static updateEmojisBlocks(element) {
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
                  <div class="emoji-btn emoji-open-btn" role="button" data-status="open" onclick="EmojiNavbar.updateEmojisBlocks(this)"></div>
                </div>
                <div class="emoji-btn-wrapper emoji-recent-wrapper">
                  <div class="emoji-btn emoji-recent-btn" role="button" data-status="recent" onclick="EmojiNavbar.updateEmojisBlocks(this)"></div>
                </div>
              </div>
            </div>`;
  }
}

class RecentEmojiBlock {
  getResentEmojis() {
    let recentEmojis = '';
    const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
    '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
    for (let i = 0; i < validKeys.length; i++) {
      const key = validKeys[i];
      const emoji = localStorage.getItem(key);
      if(emoji != null) {
        const emojiElement = `<div id="emoji-wrapper-${key}" class="emoji-wrapper">
                                <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji}</span>
                              </div> `;
        recentEmojis += emojiElement;
      }
    }
    return recentEmojis;
  }

  render() {
    const recentEmojis = this.getResentEmojis();
    return `<div class="emoji-table__recent-emoji-block hidden">
              <div class="emoji-block__emoji-section">
                <div class="section-name-wrapper">
                  <p class="section-name-wrapper__section-name">Часто используемые</p>
                </div>
                <div class="recent-emoji-section">
                  ${recentEmojis}
                </div>
              </div>
            </div>`;
  }
}

class EmojiBlock {
  createEmojiSection(sectionName, emojiSection) {
    let sectionTitle = '';
    switch(sectionName) {
      case 'emotions':
        sectionTitle = 'Эмоции';
        break;
      case 'gesturesAndPeople':
        sectionTitle = 'Жесты и люди';
        break;
      case 'symbols':
        sectionTitle = 'Символы';
        break;
      case 'animalsAndPlants':
        sectionTitle = 'Животные и растения';
        break;
      case 'foodAndDrink':
        sectionTitle = 'Еда и напитки';
        break;
      case 'sportsAndActivities':
        sectionTitle = 'Спорт и активности';
        break;
      case 'travelAndTransport':
        sectionTitle = 'Путешествия и транспорт';
        break;
      case 'items':
        sectionTitle = 'Предметы';
        break;
      case 'flags':
        sectionTitle = 'Флаги';
        break;
    }
    return `<div class="emoji-block__emoji-section">
              <div class="section-name-wrapper">
                <p class="section-name-wrapper__section-name">${sectionTitle}</p>
              </div>
              <div class="emoji-section">
                ${emojiSection}
              </div>
            </div>`;
  }

  render(objectOfEmojiElements) {
    let emojiSections = '';
    for(let sectionName in objectOfEmojiElements) {
      const emojiSection = this.createEmojiSection(sectionName, objectOfEmojiElements[sectionName]);
      emojiSections += emojiSection;
    }
    return `<div class="emoji-table__emoji-block">
              ${emojiSections}
            </div>`;
  }
}

class EmojiPicker {
  static updateRecentEmoji(emoji) {
    let isDuplicate = false;
    const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
    '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
    for (let i = 0; i < validKeys.length; i++) {
      const key = validKeys[i];
      if (emoji === localStorage.getItem(key)) {
        isDuplicate = true;
      }
    }

    if (!isDuplicate) {
      const recentEmojiSection = document.querySelector('.recent-emoji-section');
      if (recentEmojiSection.children.length == 25) {
        if (+localStorage.getItem('0') == 26) {
          localStorage.setItem('0', 1);
        }
        const oldEmojiId = `emoji-wrapper-${localStorage.getItem('0')}`;
        const oldEmojiElement = document.getElementById(oldEmojiId);
        console.log(oldEmojiElement);
        oldEmojiElement.remove();
      }

      const emojiPosition = +localStorage.getItem('0');
      localStorage.setItem(emojiPosition, emoji);
      const emojiNewPosition = emojiPosition + 1;
      localStorage.setItem('0', emojiNewPosition);

      const emojiElement = `<div id="emoji-wrapper-${emojiPosition}" class="emoji-wrapper">
                              <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji} </span>
                            </div> `;
      recentEmojiSection.insertAdjacentHTML('beforeend', emojiElement);
    }

  }

  static addEmoji(element) {
    const messageInput = document.querySelector('.message-input');
    const emoji = element.dataset.emoji;
    const emojiInput = `<span>${emoji} </span>`;
    messageInput.insertAdjacentHTML('beforeend', emojiInput);

    EmojiPicker.updateRecentEmoji(emoji);
  }

  constructor() {
    this.emojiSections;
    this.objectOfEmojiElements = {
      emotions: '',
      gesturesAndPeople: '',
      symbols: '',
      animalsAndPlants: '',
      foodAndDrink: '',
      sportsAndActivities: '',
      travelAndTransport: '',
      items: '',
      flags: '',
    };
  }

  async getEmojis() {
    const request = new Request('./sections.json');
    const response = await fetch(request);
    if (response.ok) {
      const res = await response.json();
      this.emojiSections = res;
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  createEmojiElements() {
    for (let section in this.emojiSections) {
      for (let emojiNumber in this.emojiSections[section]) {
        const emoji = this.emojiSections[section][emojiNumber];
        const emojiElement = `<div class="emoji-wrapper">
                                <span class="emoji-icon" onclick="EmojiPicker.addEmoji(this)" data-emoji="${emoji}">${emoji}</span>
                              </div> `;
        this.objectOfEmojiElements[section] += emojiElement;
      }
    }
  }

  render() {
    this.createEmojiElements();
    const recentEmojiBlock = new RecentEmojiBlock();
    const emojiBlock = new EmojiBlock();
    const messageInput = new MessageInput();
    const emojiNavbar = new EmojiNavbar();

    return `<div class="emoji-picker">
              <div class="emoji-table hide">
                ${recentEmojiBlock.render()}
                ${emojiBlock.render(this.objectOfEmojiElements)}
                ${emojiNavbar.render()}
              </div>
              ${messageInput.render()}
            </div>`;
  }
}

function createEmojiPicker() {
  if (localStorage.getItem('0') == null) {
    localStorage.setItem('0', 1);
  }
  const emojiPicker = new EmojiPicker();
  emojiPicker.getEmojis().then(() => {
    const app = document.getElementById('app');
    app.insertAdjacentHTML('afterbegin', emojiPicker.render());
  })
}

function openEmojiBlock(e) {
  const keyCode = e.keyCode;
  const tab = 9;
  if (keyCode === tab) {
    ShowEmojiButton.showEmoji();
  }
}

window.addEventListener('load', createEmojiPicker);
window.addEventListener('keydown', openEmojiBlock);
