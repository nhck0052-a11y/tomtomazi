class WordCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.getElementById('word-card-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    setData(data) {
        const wordElement = this.shadowRoot.querySelector('.word');
        const pronunciationElement = this.shadowRoot.querySelector('.pronunciation');
        const definitionsElement = this.shadowRoot.querySelector('.definitions');
        const playAudioButton = this.shadowRoot.querySelector('.play-audio');

        wordElement.textContent = data.word;
        pronunciationElement.textContent = data.phonetic;

        definitionsElement.innerHTML = '';
        data.meanings.forEach(meaning => {
            const definitionDiv = document.createElement('div');
            definitionDiv.classList.add('definition');
            const partOfSpeech = document.createElement('p');
            partOfSpeech.innerHTML = `<strong>${meaning.partOfSpeech}</strong>`;
            definitionDiv.appendChild(partOfSpeech);

            meaning.definitions.forEach(definition => {
                const p = document.createElement('p');
                p.textContent = definition.definition;
                definitionDiv.appendChild(p);

                if (definition.example) {
                    const example = document.createElement('p');
                    example.classList.add('example');
                    example.textContent = `Example: ${definition.example}`;
                    definitionDiv.appendChild(example);
                }
            });
            definitionsElement.appendChild(definitionDiv);
        });

        if (data.phonetics.length > 0 && data.phonetics[0].audio) {
            playAudioButton.addEventListener('click', () => {
                const audio = new Audio(data.phonetics[0].audio);
                audio.play();
            });
        } else {
            playAudioButton.style.display = 'none';
        }
    }
}

customElements.define('word-card', WordCard);

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const wordContainer = document.getElementById('word-container');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = searchInput.value.trim();
    if (word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) {
                throw new Error('Word not found');
            }
            const data = await response.json();
            wordContainer.innerHTML = '';
            data.forEach(wordData => {
                const card = document.createElement('word-card');
                card.setData(wordData);
                wordContainer.appendChild(card);
            });
        } catch (error) {
            wordContainer.innerHTML = `<p>${error.message}</p>`;
        }
    }
});

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.dataset.theme = savedTheme;
}

themeToggle.addEventListener('click', () => {
    if (body.dataset.theme === 'dark') {
        body.dataset.theme = 'light';
        localStorage.setItem('theme', 'light');
    } else {
        body.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
    }
});