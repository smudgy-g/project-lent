import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import Dropzone from 'react-dropzone';

interface CameraCaptureProps {
  onImageCapture: (imageSrc: string) => void;
}

const videoConstraints = {
  // aspectRatio: 1,
  facingMode: "environment"
};

export default function CameraCapture ({ onImageCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  function handleClickCapture () {
    const imageSrc = webcamRef.current!.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  function handleClickDiscard () {
    if (capturedImage) {
      setCapturedImage(null);
    }
  }

  function handleClickUse () {
    if (capturedImage) {
      onImageCapture(capturedImage);
    }
  }

  async function onDrop (acceptedFiles: any) {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const imageSrc = reader.result;
      if (imageSrc) {
        setCapturedImage(imageSrc as string);
      }
    };

    reader.readAsDataURL(file);
  };

  return (<>
    <div className='camera-capture'>
      {!capturedImage && (<>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </>)}
      {capturedImage && <img src={capturedImage} alt="Captured" />}
      <div className='button-group'>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div className='button full' {...getRootProps()}>
              <input {...getInputProps()} />
              <button className='button styled full large'>Select Image</button>
            </div>
          )}
        </Dropzone>
        {!capturedImage && <button className='button styled secondary full large' onClick={handleClickCapture}>Capture Image</button>}
        {capturedImage && (<>
          <button className='button styled full large' onClick={handleClickDiscard}>Discard Image</button>
          <button className='button styled secondary full large' onClick={handleClickUse}>Use Image</button>
        </>)}
      </div>
    </div>
  </>);
};