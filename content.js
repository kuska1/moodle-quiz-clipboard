function extractQuestionAndAnswers(questionElement) {
  // Extract the question text
  const questionText = questionElement ? questionElement.innerText : chrome.i18n.getMessage("question_not_found");
  
  // Find the parent block of the question
  const firstQuestionBlock = questionElement.closest('.content');
  
  // Find dropdown selects and text elements within the block
  const selectElements = firstQuestionBlock ? firstQuestionBlock.querySelectorAll('.control select') : [];
  const labelElements = firstQuestionBlock ? firstQuestionBlock.querySelectorAll('.text') : [];
  
  let fullText;

  if (selectElements.length > 0 && labelElements.length > 0) {
      // If sub-questions with answer options are found
      const subQuestions = Array.from(labelElements).map((label, index) => `${String.fromCharCode(97 + index)}. ${label.innerText.trim()}`);
      
      // Extract answer options from the first select element
      const answerOptions = Array.from(selectElements[0].options)
          .slice(1) // Skip the first empty element
          .map((option, index) => `${index + 1}. ${option.text.trim()}`);
      
      // Format the final text
      fullText = `${questionText}\n${subQuestions.join('\n')}\n\n${answerOptions.join('\n')}`;
  } else {
      // If no sub-questions, just extract the answers
      const answers = Array.from(firstQuestionBlock.querySelectorAll('.answer'))
          .map((answer, index) => `${String.fromCharCode(97 + index)}. ${answer.innerText.trim()}`);
      
      fullText = `${questionText}\n${answers.join('\n')}`;
  }

  console.debug("[MQC] " + chrome.i18n.getMessage("alert"));
  return fullText;
}

function copyTextToClipboard(event) {
  event.preventDefault(); // Prevent default behavior
  event.stopPropagation(); // Stop event propagation
  
  const button = event.target; // Get the button that triggered the event
  const questionElement = button.closest('.content').querySelector('.qtext'); // Find the corresponding question
  const textToCopy = extractQuestionAndAnswers(questionElement); // Extract the question and answer text

  // Copy text to clipboard
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert(chrome.i18n.getMessage("alert") + "\n\n" + textToCopy);
  }).catch(err => {
    console.error("[MQC] " + chrome.i18n.getMessage("error"), err);
  });
}

function addCopyButtons() {
  // Find all elements with the .content class
  document.querySelectorAll('.content').forEach(content => {
    // Check if the button already exists in this block
    if (!content.querySelector('.mqc-copy-button')) {

      if (content.querySelector('.othernav')) {
        return;
      }
      
      // Create a copy button
      const copyButton = document.createElement("button");
      copyButton.textContent = chrome.i18n.getMessage("button_text");
      copyButton.classList.add("mqc-copy-button", "btn", "btn-primary");
      
      // Add a click event listener
      copyButton.addEventListener("click", copyTextToClipboard);
      
      // Insert the button into the .content block
      content.appendChild(copyButton);
    }
  });
}

// Add buttons when the page loads
window.addEventListener("load", addCopyButtons);