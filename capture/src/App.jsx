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
  const [popupTitle, setPopupTitle] = useState("");
  const [popupSubtitle, setPopupSubtitle] = useState("");
  const [popupButton, setPopupButton] = useState(false);
  const TIMEOUT = 15000; // Timeout limit for API

  // API Key
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

  // Functions
  const createPopup = (title, subtitle, isLoading) => {
    setPopupTitle(title);
    setPopupSubtitle(subtitle);
    let container = document.querySelector('.popup-container');
    let wrapper = document.querySelector('.popup-wrapper');
    let titleContainer = document.querySelector('.popup-title');
    container.classList.remove("popupHidden");
    if (isLoading) {
      wrapper.classList.add("loading");
      titleContainer.classList.add("elipses");
      setPopupButton(false);
    } else {
      setPopupButton(true);
    }
  }
  const removePopup = () => {
    let popup = document.querySelector('.popup-container');
    let wrapper = document.querySelector('.popup-wrapper');
    let titleContainer = document.querySelector('.popup-title');
    wrapper.classList.remove("loading");
    titleContainer.classList.remove("elipses");
    popup.classList.add("popupHidden");
  }
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
      let title = "No URL Provided";
      let subtitle = "Please provide a URL in the above input"
      createPopup(title, subtitle, false);
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
  // Not in use: Example for axios
  const axios = (query) => {
    axios.get(query)
    .then(response => {
      let url = response.data.url;
      if (url != null) {
        console.log(url)
        setCurrentImage(url);
        reset();
      } else {
        // Consider changing this to be more unique with a popup or animation
        alert("Query Error: Please try again.")
      }
    })
    .catch(error => {
      console.error("There was a problem getting the data: " + error);
    })
  }
  const callAPI = async (query) => {
    // Loading popup
    let title = "Capturing";
    let subtitle = "Waiting to fetch your Cap"
    createPopup(title, subtitle, true);

    // Failure popup
    setTimeout(() => {
      removePopup();
      let title = "Timeout Error";
      let subtitle = "Capture took too long!"
      createPopup(title, subtitle, false);
    }, TIMEOUT);

    const response = await fetch(query);
    const json = await response.json();
    if (json.url != null) {
      console.log(json.url)
      setCurrentImage(json.url);
      setImages((images) => [...images, json.url]);
      reset();
      removePopup();
    } else {
      removePopup();
      let title = "Query Error";
      let subtitle = "Something went wrong with your Cap!"
      createPopup(title, subtitle, false);
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
      <div className="popup-container popupHidden">
        <div className="popup-wrapper">
          <h2 className="popup-title">{popupTitle}</h2>
          <p className="popup-subtitle">{popupSubtitle}</p>
          {popupButton ? (
            <button className="popup-button" onClick={removePopup}>OK</button>
          ) : (
            <div></div>
          )
          }
        </div>
      </div>
      
      <div className="app-container">
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
    </div>
  )
}

export default App;
