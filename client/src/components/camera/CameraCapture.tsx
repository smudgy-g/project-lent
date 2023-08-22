import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Dropzone from 'react-dropzone';

interface CameraCaptureProps {
  onImageCapture: (imageSrc: string) => void;
}

const videoConstraints = {
  aspectRatio: 1,
  facingMode: "user"
};

export default function CameraCapture ({ onImageCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current!.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onImageCapture(imageSrc);
    }
  };

  // const onDrop = async (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const imageSrc = reader.result;
  //     setCapturedImage(imageSrc);
  //     onImageCapture(imageSrc);
  //   };

  //   reader.readAsDataURL(file);
  // };

  return (<>
    <div className='camera-capture'>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={captureImage}>Capture Image</button>
      {/* <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop an image here, or click to select a file</p>
          </div>
        )}
      </Dropzone> */}
      {capturedImage && <img src={capturedImage} alt="Captured" />}
    </div>
  </>);
};