import React from 'react'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      <h1 style={{ color: '#646cff' }}>Den 1</h1>
      <p style={{ fontSize: '1.5rem' }}>Status: <b>5 vajec v sobe</b> 🥚</p>
      <div style={{ 
        padding: '20px', 
        border: '1px solid #646cff', 
        borderRadius: '8px', 
        backgroundColor: '#242424' 
      }}>
        <p>Zarathustra přečten, kód běží.</p>
        <p><i>„Musíš mít v sobě ještě chaos, abys mohl zrodit tančící hvězdu.“</i></p>
      </div>
    </div>
  )
}

export default App