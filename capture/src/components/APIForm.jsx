const APIForm = ({inputs, handleChange, onSubmit}) => {
    const inputsInfo = [
        "Input a link to any website you would like to take a screenshot of. Do not include https or any protocol in the URL",
        "Input which image format you would prefer for your screenshot: jpeg, png, or webp",
        "Input true or false if you would like your website screenshot to not contain any ads",
        "Input true or false if you would like your website screenshot to not contain cookie banners",
        "Input true or false if you would like a full scroll of the website to allow more element and animation loading time",
        "Choose the width of your screenshot (in pixels)",
        "Choose the height of your screenshot (in pixels)",
      ];
    return (
        <div className="form-wrapper">
            <h2 className="form-title">Select Your Image Attributes:</h2>
            <form className="form-container">
                {inputs &&
                    Object.entries(inputs).map(([category, value], index) => (
                        <li className="form" key={index}>
                            <h2>{category}</h2>
                            <input 
                                type="text"
                                name={category}
                                value={value}
                                placeholder="Type here..."
                                onChange={handleChange}
                                className="textbox" 
                            />
                            <br></br>
                            <p>{inputsInfo[index]}</p>
                        </li>
                    ))}
                <button className="submit-button" onClick={onSubmit}>Cap It!</button>
            </form>
        </div>
    );
};

export default APIForm;