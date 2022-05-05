document.getElementById("input1").focus();
console.log(document.getElementById("input1").nextSibling);
console.log(document.activeElement);

const Form = document.querySelector("textfields");
var FormInput = document.querySelector("#input1"); // <=> 

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined



if(SpeechRecognition) {
    console.log("Your Browser supports speech Recognition");
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    // recognition.lang = "en-US";
    const Footer = document.querySelector("footer");
    Footer.insertAdjacentHTML("afterbegin", '<button type="button"><i class="fas fa-microphone fa-lg"></i></button>');
    // FormInput.style.paddingRight = "50px";
  
    const micBtn = Footer.querySelector("button");
    const micIcon = micBtn.firstElementChild;
  
    micBtn.addEventListener("click", micBtnClick);
    function micBtnClick() {
      if(micIcon.classList.contains("fa-microphone")) { // Start Voice Recognition
        recognition.start(); // First time you have to allow access to mic!
      }
      else {
        recognition.stop();
      }
    }
  
    recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
    function startSpeechRecognition() {
      micIcon.classList.remove("fa-microphone");
      micIcon.classList.add("fa-microphone-slash");
      FormInput.focus();
      console.log("Voice activated, SPEAK");
    }
  
    recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
    function endSpeechRecognition() {
      micIcon.classList.remove("fa-microphone-slash");
      micIcon.classList.add("fa-microphone");
      FormInput.focus();
      console.log("Speech recognition service disconnected");
    }
  
    recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
    function resultOfSpeechRecognition(event) {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      console.log(transcript.toLowerCase().trim());
      if(transcript.toLowerCase().trim()==="stop recording.") {
        recognition.stop();
        
      }
      else if(!FormInput.value) {
        FormInput.value = transcript;
      }
      else {
        // if(transcript.toLowerCase().trim()==="go.") {
        //   Form.submit();
        // }
        if(transcript.toLowerCase().trim()==="reset input.") {
          FormInput.value = "";
        }
        else if (transcript.toLowerCase().trim()==="next"){
            var target = document.activeElement.parentElement; // input's li
            if (target.nextElementSibling != null){
                console.log("ter", target);
                var next = target;
                next = next.nextElementSibling.firstElementChild; // sibling's input
                console.log("next",next)
                // if (next == null)
                //     break;
                if (next.tagName.toLowerCase() == "input") {
                    next.focus();
                    FormInput = next; // <=> 

                    //break;
                }
            }
            else{
                console.log("List Finished");
            }
            
        }
        else {
          FormInput.value = transcript;
        }
      }
      // searchFormInput.value = transcript;
      // searchFormInput.focus();
      // setTimeout(() => {
      //   searchForm.submit();
      // }, 500);
    }
    
    // info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
    
  }
  else {
    console.log("Your Browser does not support speech Recognition");
    // info.textContent = "Your Browser does not support Speech Recognition";
  }
































//  console.log(document.activeElement.tagName);


    //for (let i = 0; i < 20; i++) {
    //     console.log(8);
    //   }
    // setTimeout(() => { document.activeElement.tagName; }, 2000);