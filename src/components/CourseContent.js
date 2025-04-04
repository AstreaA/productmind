const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({ message: newMessage }),
});

const data = await response.json();
console.log('API Response:', data);

if (!response.ok) {
  throw new Error(data.error || 'Failed to get response from AI');
}

if (data.error) {
  throw new Error(data.error);
}

setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]); 