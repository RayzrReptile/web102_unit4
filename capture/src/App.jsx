import { useState } from 'react'
import './App.css'
import APIForm from './components/APIForm';
import Gallery from './components/Gallery';
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
  const [images, setImages] = useState([]);

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
      setImages((images) => [...images, json.url]);
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
  const scrollToggle = () => {
    let header = document.getElementById('header');
    let sticky = header.offsetTop + 25;
    if (window.scrollY > sticky) {
      header.classList.add("fade");
    } else {
      header.classList.remove("fade");
    }
  }

  // Header Scrolling
  window.onscroll = function() {scrollToggle()};

  return (
    <div className="page-container">
      <div className="header" id='header'>
        <h1 className="title">C A P I T</h1>
        <h3 className="subtitle">Capture your favorite website with API Flash</h3>
      </div>

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
        <p className='query-sequence'>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
          <br></br>
          &url=<span>{inputs.url}</span> <br></br>
          &format=<span>{inputs.format}</span> <br></br>
          &width=<span>{inputs.width}</span>
          <br></br>
          &height=<span>{inputs.height}</span>
          <br></br>
          &scroll_page=<span>{inputs.scroll_page}</span>
          <br></br>
          &no_cookie_banners=<span>{inputs.no_cookie_banners}</span>
          <br></br>
          &no_ads=<span>{inputs.no_ads}</span>
          <br></br>
        </p>
      </div>
      <Gallery images={images}/>
      <br></br>
    </div>
  )
}

export default App;
