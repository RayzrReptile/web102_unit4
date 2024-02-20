const Gallery = ({ images }) => {

    return (
        <div className="gallery">
            <h2 className="gallery-title">Your Gallery</h2>
            <div className="image-container">
                {images && images.length > 0 ? (
                    images.map((pic, index) => (
                        <li className="image-wrapper" key={index}>
                            <img 
                                className="image"
                                src={pic} 
                                alt={"Screenshot "+index} />
                        </li>
                    ))
                ) : (
                    <h3>No screenshots taken.</h3>
                )}
            </div>
        </div>
    );
  };
  
  export default Gallery;