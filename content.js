function extractQuestionAndAnswers() {
  // Question label
  const questionElement = document.querySelector('.qtext p[dir="ltr"]');
  const questionText = questionElement ? questionElement.innerText : chrome.i18n.getMessage("question_not_found");

  // Question block
  const firstQuestionBlock = questionElement.closest('.content');
  const selectElements = firstQuestionBlock ? firstQuestionBlock.querySelectorAll('.control select') : [];
  const labelElements = firstQuestionBlock ? firstQuestionBlock.querySelectorAll('.text p[dir="ltr"]') : [];

  let fullText;

  if (selectElements.length > 0 && labelElements.length > 0) {
      // Subquestions found (SelectElements)
      const subQuestions = Array.from(labelElements).map((label, index) => `${String.fromCharCode(97 + index)}. ${label.innerText.trim()}`);
      
      const answerOptions = Array.from(selectElements[0].options)
          .slice(1) // Skip first element
          .map((option, index) => `${index + 1}. ${option.text.trim()}`);
      // Text formatting (Question\na.Answer\n1.SubAnswer)
      fullText = `${questionText}\n${subQuestions.join('\n')}\n\n${answerOptions.join('\n')}`;
  } else {
      // Subquestions not found (SelectElements)
      const answers = Array.from(firstQuestionBlock.querySelectorAll('.answer p[dir="ltr"]'))
          .map((answer, index) => `${String.fromCharCode(97 + index)}. ${answer.innerText.trim()}`);
      // Text formatting (Question\na.Answer)
      fullText = `${questionText}\n${answers.join('\n')}`;
  }
  // Just debug
  console.debug("[MQC] "+chrome.i18n.getMessage("alert"));
  return fullText;
}

// Copyboard
function copyTextToClipboard(event) {
  // Prevent some unusual js scripts
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
    // Successfully added button
    const copyButton = document.createElement("MQC");
    copyButton.textContent = chrome.i18n.getMessage("button_text");
    copyButton.classList.add("copy-button btn btn-primary");
    copyButton.addEventListener("click", copyTextToClipboard);
    possearch.insertAdjacentElement("beforeend", copyButton);
  } else {
    // Failed to add button
    console.debug("[MQC] "+chrome.i18n.getMessage("button_error"));
  }
}

// Wait until page fully load
window.addEventListener("load", addCopyButton);