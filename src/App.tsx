import data from './assets/data.json'
import Article from './components/Article'

function App() {

  return (
    <div>
      <Article {...data}/>
    </div>
  )
}

export default App
