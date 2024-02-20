import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm';
import axios from 'axios';

function App() {
  // Variables
  const [inputs, setInputs] = useState({
    url: "",
    format: "",
    no_ads: "",
    no_cookie_banners: "",
    //scroll_page: "",
    width: "",
    height: "",
  });
  const [currentImage, setCurrentImage] = useState(null);

  // API Key
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

  // Functions
  const submitForm = () => {
    let defaultValues = {
      format: "jpeg",
      no_ads: "true",
      no_cookie_banners: "true",
      //scroll_page: "false",
      width: "1920",
      height: "1080",
    };

    // URL error handle
    if (inputs.url == "" || inputs.url == " ") {
      // Consider changing this to be more unique with a popup or animation
      alert("No URL provided.");
    }
    else {
      for (const [key, value] of Object.entries(inputs)) {
        if (value == "") {
          inputs[key] = defaultValues[key];
        }
      }
      makeQuery();
    }
  }
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;

    // Query
    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&format=${inputs.format}&width=${inputs.width}&height=${inputs.height}&no_cookie_banners=${inputs.no_cookie_banners}&no_ads=${inputs.no_ads}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;

    callAPI(query).catch(console.error);
  }
  const callAPI = async (query) => {
    // axios.get(query)
    // .then(response => {
    //   let url = response.data.url;
    //   if (url != null) {
    //     console.log(url)
    //     setCurrentImage(url);
    //     reset();
    //   } else {
    //     // Consider changing this to be more unique with a popup or animation
    //     alert("Query Error: Please try again.")
    //   }
    // })
    // .catch(error => {
    //   console.error("There was a problem getting the data: " + error);
    // })
    const response = await fetch(query);
    const json = await response.json();
    if (json.url != null) {
      console.log(json.url)
      setCurrentImage(json.url);
      reset();
    } else {
      // Consider changing this to be more unique with a popup or animation
      alert("Query Error: Please try again.")
    }
  }
  const reset = () => {
    setInputs({
      url: "",
      format: "",
      no_ads: "",
      no_cookie_banners: "",
      //scroll_page: "",
      width: "",
      height: "",
    });
  }

  return (
    <div className="page-container">
      <h1 className="title">Website Capture</h1>

      <APIForm
        inputs={inputs}
        handleChange={(e) => {
          e.preventDefault();
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }}
        onSubmit={submitForm}
      />
      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot Returned"
        />
      ) : (
        <div> </div>
      )}
      <div className="query-container">
        <h3>Current Query Status:</h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
          <br></br>
          &url={inputs.url} <br></br>
          &format={inputs.format} <br></br>
          &width={inputs.width}
          <br></br>
          &height={inputs.height}
          <br></br>
          &scroll_page={inputs.scroll_page}
          <br></br>
          &no_cookie_banners={inputs.no_cookie_banners}
          <br></br>
          &no_ads={inputs.no_ads}
          <br></br>
        </p>
      </div>

      <br></br>
    </div>
  )
}

export default App;
