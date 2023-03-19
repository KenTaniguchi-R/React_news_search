import React from 'react';
import axios from 'axios';
import './App.css'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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

  const storiesReducer = (state, action)=>{
    switch (action.type){
      case 'STORIES_FETCH_INIT':
        return {...state, error: false, loading: true}
      case 'STORIES_FETCH_SUCCESS':
        return {...state, data: action.payload, error: false, loading: false};
      case 'STORIES_FETCH_FAILURE':
        return {...state, error: true, loading: false}
      case 'REMOVE_STORIES':
        return {
          ...state,
          data: state.data.filter((story) => story.objectID !== action.payload.objectID),
        };
      default:
        throw new Error();
    }
  }
  const [stories, dispatchStories] = React.useReducer(
      storiesReducer,
      {data: [], error: false, loading: true},
    );

  // const [stories, setStories] = React.useState([]);
  // const [loading, setLoading] = React.useState(true);
  // const [error, setError] = React.useState(false);
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)

  const handleFetchStories = React.useCallback(async () =>{
    if (!searchTerm) return;

    dispatchStories({type: 'STORIES_FETCH_INIT'})

    try{
      const result = await axios.get(url)
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      })
    }catch{
      dispatchStories({type: 'STORIES_FETCH_FAILURE'});
    }

  }, [url])

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    // const newStories = stories.filter((story)=> story.objectID !== item.objectID);
    // setStories(newStories) // previous
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    })
  }

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  }

  // const searched = stories.data.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()))
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm} onInputChange={handleSearchInput} onSubmit={handleSearchSubmit} />

      <hr />

      {stories.error && <p>Error occurred</p>}
      {stories.loading ? <p>loading...</p>:<List list={stories.data} handleRemoveStory={handleRemoveStory} loading={stories.loading}/>}
    </div>
  )
}

const SearchForm = ({searchTerm, onInputChange, onSubmit}) =>{
  return (
    <form onSubmit={onSubmit}>
        <InputWithLabel id="search" label="Search" type="text" value={searchTerm} onInputChange={onInputChange} isFocus>
          <strong>Search:</strong>
        </InputWithLabel>
        <button type="submit" disabled={!searchTerm} >Search</button>
    </form>
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
