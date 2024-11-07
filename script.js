// Функция для копирования текста
function copyTextToClipboard() {
    const textToCopy = "Здесь вставьте нужный текст";
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Текст скопирован в буфер обмена!");
    }).catch(err => {
      console.error("Не удалось скопировать текст: ", err);
    });
  }
  
  // Создаем кнопку
  const button = document.createElement("button");
  button.textContent = "Копировать текст";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = "1000";
  button.onclick = copyTextToClipboard;
  
  // Добавляем кнопку на страницу
  document.body.appendChild(button);
  