// Select Elements
let container = document.querySelector(".quiz_app");
let countSpan = document.querySelector(".quiz_info .count span");
let mainBullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz_area");
let answerArea = document.querySelector(".answers_area");
let submitButton = document.querySelector(".submit_button");
let countDownElement = document.querySelector(".countdown");
let startAppContainer = document.querySelector(".start_app");
let startAppSpans = document.querySelectorAll(".start_app .start_box span");
let categoryName = document.querySelector(".quiz_info .category span");

// set option
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

startAppSpans.forEach(function (span) {
  span.onclick = function () {
    startAppContainer.style.cssText = "display: none;";

    let category = span.className;
    let catName = span.textContent;
    categoryName.textContent = catName;

    fetch(`json/${category}_questions.json`)
      .then((quizJson) => quizJson.json())
      .then((allQuiz) => {
        countSpan.textContent = allQuiz.length;

        // create bullets
        createBullets(allQuiz.length);

        // add quiz data
        addQuizData(allQuiz[currentIndex], allQuiz.length);

        // Start Timer
        countDown(10, allQuiz.length);

        // click on submit
        submitButton.onclick = () => {
          let theRightAnswer = allQuiz[currentIndex].right_answer;
          currentIndex++;

          // Check Answer
          checkerAnswer(theRightAnswer);

          quizArea.innerHTML = "";
          answerArea.innerHTML = "";
          addQuizData(allQuiz[currentIndex], allQuiz.length);

          handleBullets();

          showResult(allQuiz.length, allQuiz);

          clearInterval(countDownInterval);
          countDown(10, allQuiz.length);
        };
      });
  };
});
// create bullets function
function createBullets(num) {
  for (let i = 1; i <= num; i++) {
    let bullets = document.createElement("span");
    if (i === 1) {
      bullets.classList.add("on");
    }
    bulletsContainer.appendChild(bullets);
  }
}

// add quiz data function
function addQuizData(quiz, qCount) {
  if (currentIndex < qCount) {
    let quizTitle = document.createElement("h2");
    quizTitle.textContent = `${quiz.title} ?`;
    quizArea.appendChild(quizTitle);

    // Create Answer
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.classList.add("answer");

      let radioInput = document.createElement("input");
      radioInput.setAttribute("type", "radio");
      radioInput.setAttribute("name", "questions");
      radioInput.setAttribute("id", `answer_${i}`);
      radioInput.dataset.answer = quiz[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      mainDiv.appendChild(radioInput);

      let theLabel = document.createElement("label");
      theLabel.setAttribute("for", `answer_${i}`);
      theLabel.textContent = quiz[`answer_${i}`];
      mainDiv.appendChild(theLabel);

      answerArea.appendChild(mainDiv);
    }
  }
}

// Check Answer Function
function checkerAnswer(rAnswer) {
  let answers = document.getElementsByName("questions");
  let theChooseAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChooseAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChooseAnswer) {
    rightAnswers++;
  }
}

// add class on to bullet Function
function handleBullets() {
  let bullets = document.querySelectorAll(".bullets .spans span");
  let bulletsArray = Array.from(bullets);
  bulletsArray.forEach(function (span, index) {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}

// Show Result Function
function showResult(count, quiz) {
  if (currentIndex === count) {
    submitButton.remove();
    quizArea.remove();
    answerArea.remove();
    mainBullets.remove();
    let resultContainer = document.createElement("div");
    resultContainer.classList.add("the-results");
    container.appendChild(resultContainer);

    for (let i = 0; i < count; i++) {
      let resultBox = document.createElement("div");
      resultBox.classList.add("result_box");

      let spanTitle = document.createElement("span");
      spanTitle.classList.add("title");
      spanTitle.textContent = `${quiz[i].title} ?`;
      resultBox.appendChild(spanTitle);

      let spanRight = document.createElement("span");
      spanRight.classList.add("right_answer");
      spanRight.textContent = quiz[i].right_answer;
      resultBox.appendChild(spanRight);
      resultContainer.appendChild(resultBox);
    }

    let resultInfo = document.createElement("div");
    resultInfo.classList.add("result_info");

    if (rightAnswers > count / 2 && rightAnswers < count) {
      let wordSpan = document.createElement("span");
      wordSpan.textContent = "Good";
      wordSpan.classList.add("good");
      resultInfo.appendChild(wordSpan);

      let fromSpan = document.createElement("span");
      fromSpan.textContent = `${rightAnswers} From ${count}`;
      fromSpan.classList.add("good");
      resultInfo.appendChild(fromSpan);
    } else if (rightAnswers === count) {
      let wordSpan = document.createElement("span");
      wordSpan.textContent = "Perfect";
      wordSpan.classList.add("perfect");
      resultInfo.appendChild(wordSpan);
      let fromSpan = document.createElement("span");
      fromSpan.textContent = `${rightAnswers} From ${count}`;
      fromSpan.classList.add("perfect");
      resultInfo.appendChild(fromSpan);
    } else {
      let wordSpan = document.createElement("span");
      wordSpan.textContent = "Bad";
      wordSpan.classList.add("bad");
      resultInfo.appendChild(wordSpan);
      let fromSpan = document.createElement("span");
      fromSpan.textContent = `${rightAnswers} From ${count}`;
      fromSpan.classList.add("bad");
      resultInfo.appendChild(fromSpan);
    }
    resultContainer.appendChild(resultInfo);
  }
}

// countDown Function
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes;
    let seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.textContent = `${minutes}:${seconds}`;
      duration--;
      if (duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
