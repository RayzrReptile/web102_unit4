const Gallery = ({ images }) => {

    return (
        <div className="gallery">
            <h1 className="gallery-title">Your Gallery</h1>
            <div className="image-container">
                {images && images.length > 0 ? (
                    images.map((pic, index) => (
                        <li className="image-wrapper" key={index}>
                            <p>{"Screenshot "+(index+1)}</p>
                            <img 
                                className="image"
                                src={pic} 
                                alt={"Screenshot "+index} />
                        </li>
                    ))
                ) : (
                    <h2>No screenshots taken.</h2>
                )}
            </div>
        </div>
    );
  };
  
  export default Gallery;