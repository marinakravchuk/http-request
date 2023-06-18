import React, { useState, useEffect, useCallback } from "react";

import JokeList from "./components/JokeList";
import "./App.css";
import AddJoke from "./components/AddJoke";

function App() {
  /*   const dummyJokes = [
    {
      id: 1,
      type: "general",
      setup: "What do you call a bee that lives in America?",
      punchline: "A USB.",
    },
    {
      id: 2,
      type: "programming",
      setup: "What's the best thing about a Boolean?",
      punchline: "Even if you're wrong, you're only off by a bit.",
    },
  ]; */

  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* function fetchJokesHandler(){
    fetch('https://official-joke-api.appspot.com/random_ten').then((response)=>{
      return response.json()
    }).then((data)=>{
      setJokes(data)
    });
  } */

  // async/await
  const fetchJokesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-57237-default-rtdb.firebaseio.com/jokes.json"
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Request failed with status ${response.status}: ${errorData.message}`
        );
      }
      const data = await response.json();

      const loadedJokes = []

      for (const key in data){
        loadedJokes.push({
          id: key,
          type: data[key].type,
          setup: data[key].setup,
          punchline: data[key].punchline,
        })
      }
      setJokes(loadedJokes);
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }, [setJokes]);

  useEffect(() => {
    fetchJokesHandler();
  }, [fetchJokesHandler]);

  async function addJokeHandler(joke) {
    try {
      const response = await fetch(
        "https://react-http-57237-default-rtdb.firebaseio.com/jokes.json",
        {
          method: "POST",
          body: JSON.stringify(joke),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  

  let content = <p>Jokes not found</p>;
  if (jokes !== null && jokes !== undefined && jokes.length > 0) {
    content = <JokeList jokes={jokes} />;
  }
  
  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading jokes...</p>;
  }
  return (
    <React.Fragment>
      <section>
        <AddJoke onAddJoke={addJokeHandler} />
      </section>
      <section>
        <button onClick={fetchJokesHandler}>Fetch Jokes</button>
      </section>
      <section>
        {content}
        {/* !isLoading && jokes.length>0  && <JokeList jokes={jokes} />}
       {!isLoading && jokes.length===0 && !error && <p>Jokes not found</p> }
       {isLoading && <p>Loading jokes...</p>}
       {!isLoading && error && <p>{error}</p> */}
      </section>
    </React.Fragment>
  );
}

export default App;
