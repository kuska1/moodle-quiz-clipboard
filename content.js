let currentIndex = 0; // Индекс текущего варианта ответа
let answers = [];     // Массив для хранения всех вариантов ответов

// Функция для копирования текста текущего ответа
function copyTextToClipboard(event) {
  event.preventDefault();
  event.stopPropagation();

  if (answers.length === 0) {
    console.error("No answers available to copy.");
    return;
  }

  // Получаем текст текущего ответа по индексу
  const textToCopy = answers[currentIndex];
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert(`Copied text: ${textToCopy}`);
    
    // Обновляем индекс для следующего копирования
    currentIndex = (currentIndex + 1) % answers.length; // Переход к следующему ответу, возвращаемся к началу, если достигнут конец
  }).catch(err => {
    console.error("Error: ", err);
  });
}

// Функция для добавления кнопки и инициализации массива ответов
function addCopyButton() {
  // Находим кнопку, после которой нужно вставить новую кнопку
  const startTestButton = document.querySelector('input[name="previous"]');
  
  // Находим и сохраняем текст всех вариантов ответов
  const answerLabels = document.querySelectorAll('[data-region="answer-label"] .flex-fill p');
  answers = Array.from(answerLabels).map(el => el.textContent.trim());

  if (startTestButton && answers.length > 0) {
    // Создаем кнопку "Copy text"
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy text";
    copyButton.classList.add("copy-button");
    copyButton.addEventListener("click", copyTextToClipboard);
    startTestButton.insertAdjacentElement("afterend", copyButton);
  } else {
    console.error('Button "previous" or answers not found!');
  }
}

// Запускаем функцию при загрузке страницы
window.addEventListener("load", addCopyButton);
