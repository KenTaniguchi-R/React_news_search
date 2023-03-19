import React from 'react';
import './App.css'


const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  )

  React.useEffect(()=>{
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}

const App = () => {
  const initialStories = [
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

  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(
        () => resolve({ data: { stories: initialStories } }),
        2000
      )
    );

  const [stories, setStories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  React.useEffect(() => {
    getAsyncStories().then(result => {
      setLoading(false);
      setStories(result.data.stories);
    }).catch(()=> setError(true));
  }, []);

  const handleRemoveStory = (item) => {
    setStories(
      stories.filter((story)=> story.objectID !== item.objectID)
    )
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const searched = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" label="Search" type="text" value={searchTerm} onInputChange={handleSearch} isFocus={true}>
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />

      {error && <p>Error occurred</p>}
      {loading ? <p>loading...</p>:<List list={searched} handleRemoveStory={handleRemoveStory} loading={loading}/>}
    </div>
  )
}

const InputWithLabel = ({id, type, value, onInputChange, isFocus, children}) => {

  const inputRef = React.useRef();

  React.useEffect(()=>{
    if (isFocus && inputRef.current){
      inputRef.current.focus()
    }
  }, [isFocus])

  return (
    <div>
      <label htmlFor={id}>{children} </label>
      &nbsp;
      <input type={type} id={id} value={value} onChange={onInputChange} ref={inputRef} />
    </div>
  )
}

const List = ({list, handleRemoveStory}) => {
  return (
    <ul>
      {
        list.map((story) => <Item key={story.objectID} story={story} handleRemoveStory={handleRemoveStory}/>)
      }
    </ul>
  )
}

const Item = ({story, handleRemoveStory}) => {
  return (
    <li>
      <a href={story.url}>{story.title}</a>
      <span> {story.author}</span>
      <span> {story.num_comments}</span>
      <span> {story.points}</span>
      <button onClick={()=>{handleRemoveStory(story)}}>delete</button>
    </li>
  )
}

export default App
