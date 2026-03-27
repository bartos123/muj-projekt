import React, { useState } from 'react'

function App() {
  // useState(5) znamená, že začínáme na 5 vejcích, co jsi už snědl
  const [eggs, setEggs] = useState(5)

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif',
      backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center'
    }}>
      <h1 style={{ color: '#646cff', fontSize: '3rem' }}>Vejcoměr 3000</h1>
      
      <div style={{ 
        fontSize: '5rem', margin: '20px', padding: '20px', 
        border: '4px solid #646cff', borderRadius: '50px' 
      }}>
        {eggs} 🥚
      </div>

      <p style={{ fontSize: '16px' }}>Právě v sobě máš {eggs} vajec.</p>

      <button 
        onClick={() => setEggs(eggs + 1)}
        style={{
          padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer',
          backgroundColor: '#646cff', color: 'white', border: 'none',
          borderRadius: '8px', fontWeight: 'bold', marginTop: '20px'
        }}
      >
        Sníst další vejce!
      </button>

      <p style={{ marginTop: '30px', color: '#888', fontStyle: 'italic' }}>
        „Silene dulezita aplikace“ <br/>
      </p>
    </div>
  )
}

export default App