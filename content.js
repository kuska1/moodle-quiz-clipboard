
function extractQuestionAndAnswers() {
  // Question
  const questionElement = document.querySelector('.qtext p[dir="ltr"]');
  const questionText = questionElement ? questionElement.innerText : chrome.i18n.getMessage("question_not_found");

  let fullText;

  // First block
  const firstQuestionBlock = questionElement.closest('.content'); // Замените '.content' на правильный родительский класс, если необходимо
  const selectElements = firstQuestionBlock ? firstQuestionBlock.querySelectorAll('.control select') : [];
  const labelElements = firstQuestionBlock ? firstQuestionBlock.querySelectorAll('.text p[dir="ltr"]') : [];

  if (selectElements.length > 0 && labelElements.length > 0) {
      // Select found
      const subQuestions = Array.from(labelElements).map((label, index) => `${index + 1}. ${label.innerText.trim()}`);
      
      const answerOptions = Array.from(selectElements[0].options)
          .slice(1) // Skip first element
          .map((option, index) => `${String.fromCharCode(97 + index)}. ${option.text.trim()}`);
      // Text format
      fullText = `${questionText}\n${subQuestions.join('\n')}\n\n${answerOptions.join('\n')}`;
  } else {
      // Select not found
      const answers = Array.from(firstQuestionBlock.querySelectorAll('.answer p[dir="ltr"]'))
          .map((answer, index) => `${index + 1}. ${answer.innerText.trim()}`);
      // Text format
      fullText = `${questionText}\n${answers.join('\n')}`;
  }

  return fullText;
}

// Copyboard
function copyTextToClipboard(event) {
  event.preventDefault();
  event.stopPropagation();
  const textToCopy = extractQuestionAndAnswers()
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert(chrome.i18n.getMessage("alert")+"\n\n"+textToCopy);
  }).catch(err => {
    console.error("[MQC] "+chrome.i18n.getMessage("error"), err);
  });
}

// Button
function addCopyButton() {
  const possearch = document.querySelector('.content');
  if (possearch) {
    const copyButton = document.createElement("no");
    copyButton.textContent = chrome.i18n.getMessage("button_text");
    copyButton.classList.add("copy-button");
    copyButton.addEventListener("click", copyTextToClipboard);
    possearch.insertAdjacentElement("afterend", copyButton);
  } else {
    console.log("[MQC] "+chrome.i18n.getMessage("button_error"));
  }
}

window.addEventListener("load", addCopyButton);