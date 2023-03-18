import React from 'react';
import './App.css'
const title = 'Hello React + Vite'


const App = () => {
  const list = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState('');
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const searched = list.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase()))
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search onSearch={handleSearch} searchTerm={searchTerm} />

      <hr />

      <List list={searched} />
    </div>
  )
}

const Search = (props) => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input type="text" id="search" onChange={props.onSearch} />
      <p>{props.searchTerm}</p>
    </div>
  )
}

const List = (props) => {
  return (
    <ul>
      {
        props.list.map((book) => <Item key={book.objectID} book={book} />)
      }
    </ul>
  )
}

const Item = (props) => {
  return (
    <li>
      <a href={props.book.url}>{props.book.title}</a>
      <span> {props.book.author}</span>
      <span> {props.book.num_comments}</span>
      <span> {props.book.points}</span>
    </li>
  )
}

export default App
