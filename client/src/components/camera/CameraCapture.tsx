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
        {!capturedImage && (<>
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div className='button styled full large' {...getRootProps()}>
                <input {...getInputProps()} />
                <button className='button styled full large'>
                  <svg width="28" height="28" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.748 8.996a1.248 1.248 0 1 0 0-2.496 1.248 1.248 0 0 0 0 2.496Z"/>
                    <path d="M6.25 3A3.25 3.25 0 0 0 3 6.25v9a3.25 3.25 0 0 0 3.25 3.25h9a3.25 3.25 0 0 0 3.25-3.25v-9A3.25 3.25 0 0 0 15.25 3h-9ZM4.5 6.25c0-.966.784-1.75 1.75-1.75h9c.966 0 1.75.784 1.75 1.75v9c0 .231-.045.452-.126.654l-4.587-4.291a2.25 2.25 0 0 0-3.074 0l-4.587 4.29a1.745 1.745 0 0 1-.126-.653v-9Zm6.762 6.458 4.505 4.214c-.163.05-.337.078-.517.078h-9c-.18 0-.354-.027-.517-.078l4.504-4.214a.75.75 0 0 1 1.025 0Z"/>
                    <path d="M8.75 21a3.247 3.247 0 0 1-2.74-1.5h9.74a3.75 3.75 0 0 0 3.75-3.75V6.011a3.248 3.248 0 0 1 1.5 2.74v7C21 18.65 18.65 21 15.75 21h-7Z"/>
                  </svg>
                </button>
              </div>
            )}
          </Dropzone>
          <button className='button styled secondary full large' onClick={handleClickCapture}>
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.925 2.503a2.25 2.25 0 0 1 1.94 1.11L16.679 5h2.071A3.25 3.25 0 0 1 22 8.25v9.5A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75v-9.5A3.25 3.25 0 0 1 5.25 5h2.08l.875-1.424a2.25 2.25 0 0 1 1.917-1.073h3.803Zm0 1.5h-3.803a.75.75 0 0 0-.574.268l-.065.09L8.39 6.141a.75.75 0 0 1-.639.358h-2.5A1.75 1.75 0 0 0 3.5 8.25v9.5c0 .966.784 1.75 1.75 1.75h13.5a1.75 1.75 0 0 0 1.75-1.75v-9.5a1.75 1.75 0 0 0-1.75-1.75h-2.5a.75.75 0 0 1-.647-.37l-1.032-1.757a.75.75 0 0 0-.646-.37ZM12 8a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
            </svg>
          </button>
        </>)}

        {capturedImage && (<>
          <button className='button styled full large' onClick={handleClickDiscard}>
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m4.397 4.554.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l6.47-6.47a.75.75 0 1 1 1.06 1.061L13.061 12l6.47 6.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-6.47 6.47a.75.75 0 0 1-1.06-1.061L10.939 12l-6.47-6.47a.75.75 0 0 1-.072-.976l.073-.084-.073.084Z"/>
            </svg>
          </button>

          <button className='button styled secondary full large' onClick={handleClickUse}>
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.267 4.209a.75.75 0 0 0-1.034 1.086l6.251 5.955H3.75a.75.75 0 0 0 0 1.5h14.734l-6.251 5.954a.75.75 0 0 0 1.034 1.087l7.42-7.067a.996.996 0 0 0 .3-.58.758.758 0 0 0-.001-.29.995.995 0 0 0-.3-.578l-7.419-7.067Z"/>
            </svg>
          </button>
        </>)}
      </div>
    </div>
  </>);
};