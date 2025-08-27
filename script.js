document.getElementById('send-btn').onclick = async function () {
  const input = document.getElementById('user-input').value;
  document.getElementById('response').innerText = "Consultant thinks";

  request = {
    "model": "deepseek-r1:8b",
    // "model": "owl/t-lite",
    "messages": [
      {
        "role": "system",
        "content": `You are a consultant of healthy food. Try to help make a daily meal plan.`
      },
      {
        "role": "user",
        "content": `${input}`
      },

    ],
    'max_tokens': '50', // Максимальное количество токенов
    "temperature": "0.5" // Температура для генерации текста
  }

  // Пример интеграции с ollama AI
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    // Чтение ответа в виде потока
    const reader = response.body.getReader();
    let result = '';
    document.getElementById('response').innerText ='';
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      try {
        let chunk = decoder.decode(value, { stream: true });
        let response_chunk = JSON.parse(chunk);
        if (response_chunk.message.content) {
          result += response_chunk.message.content;
          document.getElementById('response').innerText = result;
        }
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e){
    document.getElementById('response').innerText = "Error contacting AI service.";
    console.log(e);
  }
};

// Обработка нажатия клавиши Enter для ввода в textarea
document.getElementById('user-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('send-btn').click();
  }
});