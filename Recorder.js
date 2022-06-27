class Time {
  static async sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time * 1000));
  }
}

/**
 * Recorder classs created to record audio using the browser microphone.
 */
class Recorder {
  
  static async createRecorder() {
    return new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
  
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
  
      const start = () => {
        const start = mediaRecorder.start();
        return start;
      }
  
      const stop = () => {
        return new Promise(resolve => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            resolve({ audioBlob, audioUrl, play });
          });
  
          mediaRecorder.stop();
        });
      }
        
      resolve({ start, stop });
    });
  }

  static async blobToBase64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
  
    return new Promise(resolve => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };
}

(async () => {
    const recorder = await Recorder.createRecorder();
    recorder.start();
    await Time.sleep(2);
    const audio = await recorder.stop();
    const responseBase64 = await Recorder.blobToBase64(audio.audioBlob);
    console.log("Response:", responseBase64);
})();
